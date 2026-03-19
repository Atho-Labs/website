# Troubleshooting Guide (Atho)

Status: Alpha documentation snapshot (2026-03-12).

This guide collects common issues and fixes by area (network/P2P, APIs/auth, storage/LMDB, mining, Docker, build/tooling).

## Most Common Right Now (Fast Fixes)
- **Nodes won’t start from GUI / start inconsistently**
  - Cause: stale background processes or PID conflicts.
  - Fix:
    - `./.venv/bin/python Src/Main/stop.py --active`
    - `./.venv/bin/python Src/Main/stop.py --all`
    - start again from GUI Node tab or `Src/Main/runnode.py`.

- **GUI says auth/API key issue**
  - Cause: API key/user/password not set or mismatched between GUI and `Api_Keys.json`.
  - Fix:
    - regenerate key: `./.venv/bin/python Src/Api/auth.py`
    - re-enter values in GUI Settings.

- **Falcon/Kyber binary or compile failures**
  - Cause: missing compiler/toolchain or wrong platform binary.
  - Fix:
    - follow compile sections in `README.md` and `Docs/quickstart.md`
    - register Falcon binary:
      - `./.venv/bin/python Src/Falcon/Falcon/install_platform_binary.py`
    - confirm compiler exists (`clang`/`gcc`/`cc`).

- **Peer connects but later drops (`Connection refused`)**
  - Cause: peer process stopped, wrong target port, or service restart timing.
  - Fix:
    - verify target node process still running (`stop.py --active`)
    - verify correct P2P port from `Src/Config/NodePorts.json`
    - restart both peers and recheck `logs/mainnet/network/network.log`.

- **Remote peers cannot connect to bootstrap IP**
  - Cause: bootstrap set to private LAN IP (`192.168.x.x`, `10.x.x.x`, `172.16-31.x.x`).
  - Fix:
    - use public endpoint (`DDNS/public IP + port-forward`) or VPN mesh endpoint (Tailscale/ZeroTier).
    - keep LAN IP only for local-network testing.

## Network / P2P
- **Peers=0 / no headers:** Check `ATHO_BOOTSTRAP` and network (`ATHO_NETWORK`) match your seed; ensure P2P port (default 56000) is reachable. Clear peers: `rm Src/Config/Peers.json` and restart with `ATHO_RESET_PEERS=1`.
- **`sync_no_headers` or tip stuck at 0:** Often a network mismatch or genesis mismatch. Align `ATHO_NETWORK` across nodes; verify bootstrap points to the right chain.
- **Block rejects like `'Transaction' object has no attribute 'get'`:** Incoming blocks weren’t deserialized to the expected dicts. Ensure all nodes run the same code/version; wipe stale storage if formats changed.
- **Port in use:** Pick a free P2P/API port (`ATHO_P2P_PORT`, `ATHO_FULLNODE_API_PORT`, `ATHO_MINERNODE_API_PORT`) or let `runnode.py` auto-assign. On Docker, avoid binding API ports if they conflict; use random host ports.
- **Different tips across nodes:** Confirm all nodes point to the same bootstrap seed and network; if a node lags, clear its storage/peers and resync.
- **Repeated `sync_headers_ok` but no progress:** The serving peer may be on a short fork or serving invalid blocks. Point to a trusted seed with the desired tip; stop low-tip peers.
- **Genesis mismatch:** Changing genesis content requires all nodes to resync; mixed genesis nodes will reject each other’s chains.
- **Many `rpc_fail ... short_header` / reconnect churn at scale:** Tune peer/network concurrency and backoff to reduce dial storms and socket churn:
  - `ATHO_P2P_RPC_TIMEOUT=2.5` to `4.0` (lower probe RPC timeout)
  - `ATHO_PROBE_BATCH_SIZE=16` to `32` and `ATHO_PROBE_WORKERS=4` to `12`
  - `ATHO_OUTBOUND_MAX_NEW_PER_CYCLE=1` to `3` (limit new dials per keepalive cycle)
  - `ATHO_OUTBOUND_RETRY_BASE_SECS=5` and `ATHO_OUTBOUND_RETRY_MAX_SECS=300`
  - `ATHO_DROPPED_PEER_READD_DELAY_SECS=120` to `300` (avoid immediate re-add of failing peers)
  - `ATHO_SYNC_PEERS_PER_CYCLE=3` to `6` (cap sync fan-out)
  - `ATHO_P2P_SERVER_CLIENT_WORKERS=32` to `128` (bound inbound worker pool)
- **Slow block relay on larger responses:** Current relay path intentionally strips export-only block fields (`tx_list_full`, derived counters) before wire send. If peers still lag, check message-size cap (`ATHO_MAX_MESSAGE_SIZE`) and peer CPU/network limits.
- **`reorg_depth_exceeded` rejects:** A competing branch exceeded policy rollback cap (`max_reorg_depth_blocks`). Review `CHECKPOINT_INTERVAL_BLOCKS`, `MAX_REORG_CHECKPOINT_MULTIPLIER`, and `MAX_REORG_DEPTH_BLOCKS` in `Src/Utility/const.py`.
- **P2P logs are too noisy:** Current defaults keep high-volume tx/inv/getdata lines at DEBUG and dedupe repeated INFO lines.
  - keep default lightweight mode:
    - `ATHO_NETLOG_LEVEL=INFO`
    - `ATHO_NETLOG_DEDUP_SECONDS=45`
  - temporarily increase detail:
    - `ATHO_NETLOG_LEVEL=DEBUG`
    - `ATHO_NETLOG_TX_ACTIVITY_INFO=1`
  - send propagation/recovery diagnostics are in:
    - `logs/<network>/api/send_intent_audit.log`

## API / Auth
- **401/403 errors:** Missing/invalid `X-API-Key`/`X-User`/`X-Pass` or missing permissions (e.g., `send_tx`, `mining`). Check `Src/Config/Api_Keys.json`; recreate keys with `Src/Api/auth.py` if needed.
- **HMAC failures:** If `REQUIRE_HMAC` is on, include `X-TS` and `X-Sig` for every request; ensure clock skew < ±60s.
- **CLI can’t connect:** Verify `ATHO_API_URL` (CLI reads `Src/Config/NodePorts.json`). If using Docker, use the host-mapped API port from `docker compose port`.
- **HTTP 500 from API:** Often missing deps or missing API key file in container. Rebuild images and ensure `Src/Config/Api_Keys.json` exists/mounted; check container logs for import errors.

## GUI / Web Explorer
- **Request inbox icon appears in wrong place / top-bar alignment looks off**
  - Cause: stale GUI process or older local GUI file loaded from another path/release folder.
  - Fix:
    - fully stop GUI and relaunch from the same repo/venv path,
    - verify you run `Src/GUI/gui.py` from this workspace,
    - if needed clear stale Python caches and restart.

- **Clicking inbox does not open request page**
  - Cause: stale GUI process or feature-disabled runtime.
  - Fix:
    - restart GUI from this workspace/venv,
    - note: current alpha build keeps request inbox UI disabled by default,
    - confirm requests page is present only in builds where it is explicitly enabled,
    - verify node/API is reachable and authenticated.

- **Fund request -> Send security step fails**
  - Cause: pasted verification address does not exactly match requester address.
  - Fix:
    - use `Copy Request Address`,
    - paste exact value into verify field,
    - continue (send modal prefill opens only on exact match).

- **Explorer popup says it cannot start bridge:** Ensure GUI can read/write `Src/GUI/web_explorer.html` and that local loopback bind is available (`127.0.0.1`). Restart GUI and try again.
- **Explorer opens but stats show `--` / no peers/tip hash:** Verify node API is reachable and authenticated by GUI; check `/chain/info` and `/network/node_count` from the active API port.
- **Address search returns `invalid_address`:** Explorer accepts Base56 or HPK; verify no whitespace/newlines were copied and network prefix matches the selected chain.
- **Explorer page feels stale:** click `Refresh` in explorer, then refresh node/API state in GUI if local node role changed.

## Storage / LMDB
- **LMDB file not found / map full:** Ensure storage paths exist; increase map size if needed. Clean start: remove `blockchain_storage*` if you intend to resync.
- **Corruption/stale data after upgrades:** Wipe `blockchain_storage*` and `Peers.json` and resync; keep backups before deleting.
- **Permission errors on LMDB:** Ensure the process/container user can write to the volume; adjust ownership/permissions on macOS/Linux.

## Mining
- **Miner mining its own fork:** Bootstrap it to the authoritative node (`ATHO_BOOTSTRAP=<seed>:56000`), align networks, and clear peers/storage if formats changed.
- **Reward/balance not showing:** Ensure API auth headers are present; check mempool/UTXO sync; confirm the address mapping (HPK/Base56) is correct.
- **HTTP 403 on `wallet send`:** The API key lacks `send_tx` or password is wrong; recreate key with proper permissions.
- **`broadcast_rejected: Invalid pubkey: pubkey must use canonical base64 wire encoding`:** The node is enforcing canonical witness wire encoding and rejected hex witness payloads. Ensure sender/receiver nodes are on the updated code path and restart wallet/full/miner together.
- **`block_tx_verify_failed` with `Fee ... below required minimum ... (vsize=...)` after mempool accepted:** Usually version skew or stale runtime where one path sizes tx differently. Run one code version across wallet/full/miner, restart all processes, clear stale mempool entries, and retry.
- **PoW workers not scaling or unexpectedly single-core:** Check `POW_WORKER_CORES`, `POW_MULTIPROCESS_ENABLED`, and `POW_WORKER_NONCE_CHUNK` in constants/env. If requested cores exceed available CPUs, runtime caps to max CPU count and logs the cap event.
- **Miner prints too frequently / console overhead:** raise `POW_PROGRESS_INTERVAL_SEC` to reduce progress-print I/O.
- **Wallet import fails:** The GUI import accepts Atho `.txt` exports in both current structured format and legacy warning-header format. Duplicates by HPK/Base56 are rejected/skipped. If the identifier already exists but HPK/Base56 is unique, the importer auto-renames to `import_#`.
- **Mnemonic restore mismatch:** Ensure the phrase words and order are exact, and use the same passphrase/account/index used at creation time. A different passphrase/path intentionally derives a different key.
- **CLI shows `API reported non-canonical recovery mode...` after a successful mnemonic recover:** This can happen when the recovered key is an existing additional miner key outside canonical slots (for example `miner_3`). On current builds, this path is reported as informational (`Recovered existing key outside canonical miner slots.`). If you still see the old warning, update to the latest code and restart the wallet API process.
- **Key manager startup fails with schema validation error:** The key file failed strict structure validation. Check `Keys/backups/` for the last known backup, repair malformed records, and restart. Runtime now fails closed instead of silently accepting malformed key JSON.
- **`unsupported hash type` during mnemonic operations:** On some Python/OpenSSL builds, native `pbkdf2_hmac('sha3_512')` is unavailable. Install project dependencies (`cryptography`) so the accelerated SHA3-512 PBKDF2 path is used.
- **Cannot delete address:** Deletion is blocked only if it would remove the last key on the selected network. Ensure at least two keys exist; defaults are reassigned automatically when one is removed.
- **Hashrate stuck / no blocks:** Verify mining is enabled, check logs for PoW errors, and ensure the mempool isn’t rejecting constructed blocks.

## Docker / Compose
- **Port binding errors:** If a host port is in use, remove the mapping or use random host ports (e.g., `ports: ["10200"]`). P2P ports are fixed (56000 in-container; host binds 56000/56001/56002/56003).
- **API key missing in containers:** Entry point auto-creates one; read logs for the generated key/user/pass. Ensure `Src/Config` is mounted.
- **Containers not following host chain:** Set `ATHO_BOOTSTRAP=host.docker.internal:56000` (or your LAN IP) and wipe peers/storage before `docker compose up`.
- **Modules missing in container:** Rebuild after updating `requirements.txt` (`docker compose build --no-cache`); ensure Python is 3.11 in the image.
- **Random API ports on miners:** Discover with `docker compose port miner 10200` (and `... 10250` for miner2) when host ports are randomized.

## Build / Tooling
- **falcon_cli build fails:** Install toolchain (`build-essential`/`clang`/`libssl-dev` on Linux; Xcode CLT on macOS). On ARM, disable AVX2 (`FALCON_USE_AVX2=false`). Use Docker to avoid local toolchain issues.
- **`falcon_cli pinning is required but no expected digest is configured`**: Update `Constants.FALCONCLI_PINNED_VERSION_DIGESTS` in `Src/Utility/const.py` for the active `CONSENSUS_VERSION`, using the release-audited version-bound digest. Mainnet/testnet startup is intentionally blocked until this is set.
- **Runtime guard fail-closed startup error:** If startup reports runtime guard bootstrap failure, inspect `logs/<network>/security/security.log`, verify `Src/Config/security_manifest.json`, and ensure `ATHO_RUNTIME_GUARD_RELEASE_PUBKEY_HEX` matches release signer pubkey when signature is required.
- **`runtime_guard_violation` during runtime:** In enforce mode this is expected fail-closed behavior on drift. Re-deploy clean artifacts, re-verify manifest, and restart nodes from trusted release package.
- **`python` not found / deps missing:** Use Python 3.11+, activate venv, `pip install -r requirements.txt`.
- **LibreSSL/SSL warnings:** Typically harmless locally; if you see handshake errors, upgrade OpenSSL/Python.

## Dependency install issues (venv + pip)
- **Use a virtual environment first (strongly recommended)**
  - Why: avoids global package conflicts and broken mixed installs.

macOS / Linux:
```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip setuptools wheel
python -m pip install -r requirements.txt
```

Windows (PowerShell):
```powershell
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip setuptools wheel
python -m pip install -r requirements.txt
```

- **`lmdb` install fails**
  - First retry inside activated venv:
    - `python -m pip install lmdb`
  - If still failing, install OS build tools then retry:
    - macOS: `xcode-select --install`
    - Linux (Debian/Ubuntu): `sudo apt-get install -y build-essential python3-dev`
    - Windows: install Visual Studio Build Tools or use MSYS2/WSL

- **`kivy`/graphics deps fail**
  - Confirm OpenGL 2.0 capable system/drivers.
  - Keep installs inside venv and retry `python -m pip install -r requirements.txt`.

- **`cryptography`/hash-related install or runtime errors**
  - Upgrade packaging tools in venv (`pip setuptools wheel`) and reinstall requirements.
  - This dependency is required for fallback SHA3-512 PBKDF2 paths used in wallet operations.

## General tips
- Align versions across all nodes; mismatched code can reject blocks/tx.
- When in doubt, clean state: stop nodes, `docker compose down -v`, remove `blockchain_storage*`, `Keys*`, `Logs*`, `Src/Config/Peers.json`, then restart with correct env.
- Check logs at source (not just grep): `docker compose logs -f fullnode miner miner2` or tail `Logs*/network.log` for detailed reasons.
- For hashrate telemetry validation, query:
  - `/network/hashrate/live`
  - `/network/hashrate/chart`
  - `/network/hashrate`
