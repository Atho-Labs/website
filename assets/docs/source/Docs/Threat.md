# Threat Model and Security Posture

Last refresh: 2026-04-04.

This document reviews current security posture across keys, signing, networking/auth, consensus, storage, and operational controls. It calls out weaknesses, impacts, and recommended improvements with code references.

## Overview: high-risk areas
- Key files can still be left unencrypted in legacy/plain mode; lockbox encryption should be enabled for production wallets.
- Falcon CLI integrity depends on maintaining the pinned digest map per release; misconfigured/empty pins on required networks block startup.
- Runtime guard exists but may be left in `audit` mode; live networks should run enforce mode + signed manifest requirement.
- API auth relies on key+user+pass; HMAC optional; no TLS termination described.
- Signature policy currently allows legacy 1024-byte pubkey compatibility in some paths; keep rollout policy explicit and minimize compatibility windows.
- Verbose logging leaks metadata (key lengths/previews, tx details).
- Tail issuance is active, with post-tail fee burn target (100%, floor-clipped) and a hard circulating-supply floor (21M ATHO).
- LMDB map-size/permissions misconfiguration can cause DoS; no WAL/backup guidance in code.
- P2P now has basic per-IP request rate limits, but API-level throttling and global mempool caps are still limited.

## Cryptography and key management
- **Key storage**: `Keys/KeyManager_Public_Private_Keys.json` supports encrypted lockbox mode, but legacy/plain mode is still possible. Impact if plaintext mode is used: disk compromise → key theft. Mitigation: enforce lockbox encryption, 0600 permissions, and hardened backup handling.
- **Key generation/import**: `Src/Accounts/key_manager.py`, `wimport.py` accept CLI-format Falcon-512 keys. Some import paths log previews. Impact: logs can leak key material previews. Mitigation: remove previews, restrict logs in production.
- **Signing pipeline**: `KeyManager.sign_transaction` → `FalconCLI.sign` now passes key material via stdin (`--key-stdin`) instead of temp files. Impact reduced vs disk temp files; residual risk remains in process memory and local host compromise. Mitigation: keep debug off, reduce key lifetime in RAM, consider hardware signing.
- **Signature verification**: transaction validation enforces signature byte bounds and pubkey length policy from `Constants` (compressed-signature range with canonical/legacy pubkey rules). Impact: overly broad compatibility windows can increase ambiguity. Mitigation: tighten compatibility flags as rollout completes.
- **Hashing**: SHA3-384 for txid/signing/HPK and SHA3-256 for address checksum. Consistent; risk is mostly around normalization (handled in `txdhash.py`).

## Falcon CLI binary integrity
- **Binary discovery**: `Src/Accounts/falconcli.py` searches PATH and repo locations. On required networks, strict pinning + file-permission checks are applied before use.
- **Hash pinning**: version-bound pinning is enforced with `FALCONCLI_PIN_DOMAIN` + `FALCONCLI_PINNED_VERSION_DIGESTS[CONSENSUS_VERSION]`. If pinning is required and no digest is configured, startup fails. Impact of bad pin hygiene: upgrade outages or forced fallback decisions. Mitigation: publish audited release digests and keep pins synchronized with version upgrades.
- **FFI fallback**: loads `FALCON_VERIFY_SO` if present. Impact: loading untrusted shared object can run arbitrary code. Mitigation: restrict/disable unless explicitly configured and pinned.

## Runtime integrity controls (implemented)
- **Runtime guard**: `Src/Utility/versioning.py` snapshots critical constants and critical file hashes at startup and checks drift periodically.
- **Modes**:
  - `audit` (default): logs violations, does not stop node.
  - `enforce`: fail-closed behavior in full/miner/wallet entrypoints.
- **Manifest verification**:
  - release manifest can be verified at runtime (`security_manifest.json`),
  - optional Falcon signature verification over canonical manifest payload.
- **Consensus ingress coupling**:
  - `accept_tx` and `accept_block` reject with `runtime_guard_violation` in enforce mode if guard is violated.
- **Reorg rollback cap**:
  - reorg depth is capped by policy (`max_reorg_depth_blocks`), returning `reorg_depth_exceeded` when exceeded.

## Networking and API auth
- **API auth**: key + user + pass headers; optional HMAC (`ATHO_API_HMAC`). If HMAC off (default), replay risk on plaintext channels. Impact: credential replay/steal if traffic intercepted. Mitigation: require HMAC by default, enforce TLS, rotate keys.
- **TLS**: No built-in TLS; docs recommend local-only. Impact: if exposed, MITM risk. Mitigation: enforce loopback binding or TLS/proxy guidance in defaults.
- **Rate limiting**: P2P server enforces basic per-IP request window caps (`RATE_LIMIT_WINDOW_SECS`, `RATE_LIMIT_MAX_REQUESTS`), but API-level and mempool-admission throttling are still comparatively light. Impact: tx/API flood pressure can still create high CPU/IO load. Mitigation: per-key/token HTTP throttles + explicit mempool size/age eviction policy.
- **P2P**: Not detailed here; ensure handshake/ban logic is robust (not in scope of listed code).

## Consensus rules and enforcement
- **Tail issuance and burn floor**: Tail reward continues, and post-tail fees target 100% burn (0% miner fee share) with burn clipped by a 21M ATHO floor. Impact: under high utilization the protocol can be net deflationary, but burn accounting cannot push circulating supply below floor.
- **PoW target**: Blocks carry `target`; `BlockVerifier` enforces bounds and compares to `PowManager.expected_target_for_height` best-effort. If expected-target check fails (exceptions ignored), a wrong-but-in-bounds target could pass. Mitigation: make expected-target check mandatory with clear failure.
- **Checkpoint lock**: `CHECKPOINT_INTERVAL_BLOCKS` prevents deep reorgs; verify value fits threat model (too low → censorship risk; too high → reduced safety).
- **Signature policy**: legacy pubkey compatibility should be phased out when network migration allows; keep canonical compressed-signature ranges enforced.
- **Witness policy**: Pruning controlled by `WITNESS_*`; ensure pruning doesn’t break validation for older blocks if full verification required.

## Storage (LMDB) and data integrity
- **Map size exhaustion**: `MapFullError` can still DoS writes if a store reaches its configured `*_MAX_MAP_SIZE`, even though bounded auto-growth is on by default. Mitigation: monitor `lmdb_memory_status`, size ceilings appropriately, and prune/archive before a store hits its cap.
- **Permissions**: LMDB files under `blockchain_storage/...` require writable perms; lack of checking could cause silent failures. Mitigation: startup checks for writability.
- **Backups**: No built-in consistent snapshot; copying live env during writes risks corruption. Mitigation: document stopping writers or use LMDB `copy()`; periodic backups.
- **State logs**: BlockStore writes cumulative header hash log; not a hard guarantee—tampering with LMDB could go undetected without independent verification. Mitigation: periodic recomputation, external anchoring.

## Mempool and DoS considerations
- **Admission**: `accept_tx` verifies tx and fee, but no overall mempool size cap exposed; `mempool.get_mempool_size` used in logging only. Impact: memory/disk exhaustion by many minimally valid txs. Mitigation: set max mempool size/count and eviction policy.
- **Sweep/verify**: `ConsensusSupervisor.sweep_mempool` re-verifies pending txs; heavy load could be expensive. Mitigation: rate limit submissions, batch verification.
- **Large blocks**: Size/weight limits enforced; still subject to CPU verification load (signatures). Mitigation: per-connection work caps, parallel verification with limits.

## Performance hardening already applied (liveness risk reduction)
- Miner template build now uses tx-index lookup + revision-cached snapshots + incremental size accounting, reducing wasted CPU and stale-template churn.
- Mempool reader refresh uses LMDB revision markers (`mempool:meta:revision`) to avoid repeated full rebuild scans.
- PoW supports multiprocess workers with runtime CPU-cap enforcement and structured runtime logs.
- P2P block relay uses lean payloads (drops export-only duplicate fields), improving propagation efficiency.

These are operational hardening improvements; they do not alter core cryptographic consensus rules.

## Logging and observability
- **Verbose logs**: `falconcli.py`, `key_manager.py`, `send.py`, `txveri.py` print key lengths/previews, paths, and occasionally transaction details. Impact: metadata leakage into logs; potential key info exposure. Mitigation: production log level that omits sensitive fields; redact previews.
- **Consensus logs**: JSON logs stored under `logs/<network>/consensus`, `logs/<network>/verified_blocks`, `logs/<network>/emissions.log`, `logs/<network>/State`, and `logs/<network>/storage/lmdb_memory.log`; ensure permissions and rotation to avoid disk exhaustion.

## Configuration and secrets
- **API credentials**: `Src/Config/Api_Keys.json` defaults; stored plaintext. Impact: theft if file readable. Mitigation: permissions (0600), optional encryption, env var overrides.
- **Env vars**: Paths/auth can be set via env; ensure they are not printed in logs or shell history.

## Privacy
- Addresses are HPK/Base56; no additional privacy (no coinjoin, no stealth). Impact: standard UTXO traceability; out of scope for immediate security, but note linkage risk.

## Testing and CI gaps
- No automated security regression checks (hash pinning, signature length policy, API auth defaults) in CI.
- No automated map-size smoke tests to catch LMDB misconfig.
- No fuzzing of address decode, tx normalization, or orphan handling observed.

## Recommendations (prioritized)
1) **Run live nodes in enforce mode with signed manifests**: set runtime guard to enforce, require manifest + signature, and distribute signer keys via trusted channels.
2) **Pin the Falcon CLI binary correctly**: Maintain `Constants.FALCONCLI_PINNED_VERSION_DIGESTS` per consensus release; fail fast on mismatch; keep bundled binaries and digest publication in the release process.
3) **Encrypt keys at rest**: Wrap `Keys/KeyManager_Public_Private_Keys.json` with passphrase-based encryption; enforce 0600 perms; avoid key previews in logs.
4) **Harden signing**: Move temp key handling to in-memory or tmpfs; minimize logging during signing; consider hardware/MPC options.
5) **Tighten compatibility policy**: disable legacy Falcon pubkey acceptance once migration is complete; keep compressed-signature bounds strict.
6) **Default to HMAC + TLS**: Require `ATHO_API_HMAC=true` and document TLS/proxy as baseline; consider rejecting non-localhost without TLS.
7) **Rate limiting/mempool caps**: Add request throttling and max mempool size/eviction policy; expose metrics/alerts.
8) **LMDB resilience**: Keep `AUTO_RESIZE_LMDB` enabled, size the per-store ceilings correctly, add startup checks for writable dirs and free space, and provide backup guidance.
9) **Reduce sensitive logging**: Production log level should omit key material previews and limit tx details; add redaction helpers.
10) **Expected-target enforcement**: Make `PowManager.expected_target_for_height` check mandatory (no silent pass on exception); alert on deviations.
11) **Security testing**: Add CI smoke tests for manifest verify, runtime drift checks, hash pin, signature length enforcement, LMDB open/write/read, and API auth defaults.

## Residual risks after mitigations
- If Falcon CLI supply chain is compromised before hashing/pinning, signatures could be subverted—consider multi-party or hardware-based signing for high assurance.
- Local compromise (disk/root) still exposes plaintext keys unless hardware protection is used.
- Network-layer DoS remains possible without robust rate limiting and P2P-level protections beyond current scope.

## Additional coverage: areas not detailed above

### P2P / networking surface
- **Bootstrap/peering**: Default seed/ports handled in `NodePorts.json` and env; no documented peer scoring/ban logic here. Risk: eclipse/sybil without peer diversity and ban heuristics. Mitigation: diversify peers, add inbound connection limits, misbehavior scoring, and addr freshness checks.
- **Binding**: Defaults bind APIs to localhost, but if exposed externally without TLS/HMAC, MITM/replay risk increases. Enforce loopback by default; require explicit opt-in for external binds with TLS.
- **DoS on wire**: No explicit P2P rate limiting, message caps, or handshake timeouts noted in this excerpt. Large/invalid message floods could tie up CPU. Mitigation: add per-connection throttles and message size caps.

### API surface & auth lifecycle
- **Key lifecycle**: API keys in `Src/Config/Api_Keys.json` are plaintext; no rotation tooling. Add rotation commands and expiry; consider scoping (send/mine/admin).
- **Secrets in env**: `ATHO_API_KEY/USER/PASS` may leak in shell history/process list. Encourage env files with restricted perms and avoid echoing.
- **Audit logging**: No signed audit logs for API calls; tampering risk. Consider append-only, tamper-evident logs or remote shipping.

### Time/difficulty correctness
- **Timestamp rules**: MTP (`MTP_WINDOW=13`) and `MAX_TIME_DRIFT=120` are enforced in both `BlockVerifier` and direct `blockchain.add_block` acceptance paths. Residual risk remains from hostile clock skew and coordinated timestamp games, so monitor adjustment logs and reject persistent outliers.
- **Difficulty windows**: `PowManager` uses weighted intervals; if data is sparse or manipulated, expected-target check may fail open. Make failures fatal and log/ban peers sending off-target blocks.

### Reorg/orphan handling
- **Orphan LMDB**: `orphan_blocks.lmdb` persists side branches; corruption or map exhaustion could impair reorg safety. Add integrity checks and size caps. Ensure rollback/apply paths are idempotent and crash-safe.
- **Checkpoint policy**: Fixed `CHECKPOINT_INTERVAL_BLOCKS`; risk of accidental chain lock-in or censorship. Document and review values per network.

### Storage integrity and recovery
- **Corruption detection**: Limited detection (header chain hash log). No full-chain hash audit on startup beyond optional `verify_full_chain_once`. Mitigation: periodic end-to-end hash walk and external anchoring.
- **Backups/restores**: No scripted safe-copy; copying live LMDB during writes risks inconsistency. Provide a `--backup` command using LMDB `copy()` or instruct shutdown-before-backup.
- **Pruning/witness**: Witnesses are now compacted out of persisted old block records after the retention horizon. If retention is too short, old witness payloads cannot be replay-verified locally. Align retention with reorg depth and verification needs.

### Build, dependencies, and supply chain
- **Python deps**: Unpinned beyond versions in `requirements.txt` (e.g., `lmdb==1.7.3`). Supply-chain risk if mirrors are compromised. Mitigation: hash-pinned requirements (`--require-hashes`) and vendored wheels for releases.
- **C toolchain**: `compile_falcon.sh` uses system compiler flags; no reproducible build pipeline. Mitigation: documented deterministic build with checksums for released binaries.
- **Binary artifacts**: `falcon_cli`, `qrcode`, `PIL` etc. are runtime dependencies; validate licenses and update cadence; monitor CVEs.

### Resource exhaustion
- **CPU-heavy verification**: Falcon verification is expensive; block with many inputs/sigs can be used for CPU DoS within size limits. Mitigation: per-block/tx verification timeouts, parallelism caps, fee policies that reflect verification cost.
- **Disk growth**: Tail emission with no pruning of blocks/utxos by default; ensure pruning/archival strategy to prevent disk exhaustion.
- **Mempool size**: No hard cap; high volume of small, valid txs can bloat LMDB. Add configurable mempool size/age eviction.

### Logging/observability gaps
- **Rotation**: Logs under `logs/<network>/...` have no automatic rotation; disk fill risk. Add rotation/compression and monitoring.
- **Sensitive fields**: Some logs may capture auth failures or API keys if exceptions include headers. Audit log formatting to redact secrets.

### Operational hygiene
- **Process privileges**: Runs as invoking user; no sandbox/chroot. For production, run under dedicated unprivileged user, consider seccomp/AppArmor if feasible.
- **Config drift**: Some safety knobs still remain optional (especially HMAC/TLS posture), but `ENFORCE_CONSENSUS_WRITE` and `AUTO_RESIZE_LMDB` now default on. Provide a hardened config profile and startup checks to warn if those protections are turned off.
- **Testing/fuzzing**: No fuzzers for address decode, tx normalization, or block parsing. Add property/fuzz tests to catch malformed inputs early.
