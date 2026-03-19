# Falcon-512 Integration Notes and Audit

Status: Alpha documentation snapshot (2026-03-12).

This explains how Falcon-512 is integrated into the Atho stack, where signing and verification happen, how keys are handled, and the security posture of the current implementation (excluding the C source itself under `Src/Falcon/Falcon`).

Related reference package: `Docs/falcon Docs.pdf` (NIST/Falcon context used by this repo).

## Components (code paths)
- Binary: platform-tagged binaries live under `Src/Falcon/Binaries/<platform_tag>/falcon_cli(.exe)` with legacy fallback to `Src/Falcon/Falcon/falcon_cli`. Build script: `Src/Falcon/Falcon/compile_falcon.sh`; registration script: `Src/Falcon/Falcon/install_platform_binary.py`.
- Wrapper: `Src/Accounts/falconcli.py` locates the binary, enforces strict version-bound pinning on required networks (`FALCONCLI_PIN_DOMAIN`, `FALCONCLI_PIN_REQUIRED_NETWORKS`, `FALCONCLI_PINNED_VERSION_DIGESTS`), validates it (runs `keygen`), and exposes `keygen`, `sign`, and `verify` helpers. Optional FFI verify fallback via `FALCON_VERIFY_SO`.
- Key manager: `Src/Accounts/key_manager.py` calls `FalconCLI` for keygen/sign/verify, enforces CLI-format keys, and stores them in JSON (default `Keys/KeyManager_Public_Private_Keys.json`). It derives hashed public keys (HPK) and Base56 addresses from the Falcon public key.
- Transaction hashing: `Src/Utility/txdhash.py` defines `canonical_tx_id` (no-witness hash) and `signing_message_hex_digest` (sha3_384 of canonical fields) used for signing and verification.
- Transaction signing: `Src/Main/send.py` and `Src/Transactions/tx.py` build txs, then call `KeyManager.sign_transaction`, which in turn invokes `FalconCLI.sign` on the signing digest.
- Transaction verification: `Src/Transactions/txvalidation.py::_validate_signature` strips witness data (`SegWit.strip_witness`), recomputes the signing digest, and calls `KeyManager.verify_transaction`, which uses `FalconCLI.verify`/`verify_transaction_hash` (multiple call orders + optional FFI).
- Block validation: `Src/Main/blockveri.py` trusts `TXValidation` for per-tx signature checks; coinbase has no signature.

## Key and signature formats
- Public key: Falcon-512, 1024 bytes = 2048 hex chars. Private key components f/g/F/G: 1793 bytes each = 3586 hex chars.
- Signatures: treated as 2048 hex chars (1024 bytes). Verification accepts 1024 or 2048 hex length.
- Wire format: transaction witness fields (`pubkey`, `signature`) are canonical base64 on-chain/wire; they are decoded back to hex/bytes before Falcon verification.
- Hashing/signing payload: sha3_384 digest (96 hex chars) of the canonical no-witness transaction body from `signing_message_hex_digest`. Witness (`tx.signature`) is **not** included in the txid.
- Address binding: outputs carry `hashed_public_key` (HPK); HPK is derived from the Falcon public key and can be rendered as Base56 via `Src/Blockchain/base56.py`.

## Binary discovery and hardening (`Src/Accounts/falconcli.py`)
- Path search order: provided `cli_path` → `ATHO_FALCONCLI_BIN` env override → `PATH` (`falcon_cli`) → platform-tagged candidates in `Src/Falcon/Binaries/` → legacy `Src/Falcon/Falcon/falcon_cli`.
- Hash pinning: preferred path is version-bound pinning (`FALCONCLI_PINNED_VERSION_DIGESTS[CONSENSUS_VERSION]`); legacy raw-binary pinning (`FALCONCLI_EXPECTED_HASH`) is a fallback.
- Startup validation: supports mode-controlled CLI sanity checks:
  - `ATHO_FALCONCLI_VALIDATE_MODE=cached` (default): validate once per binary fingerprint (path+mtime+size+expected hash), then reuse cache.
  - `ATHO_FALCONCLI_VALIDATE_MODE=always`: validate on every process init.
  - `ATHO_FALCONCLI_VALIDATE_MODE=off`: skip startup validation.
- Cached validation state is persisted to `logs/falconcli/validation_cache.json` (override with `ATHO_FALCONCLI_VALIDATE_CACHE`).
- Rebuild fallback still applies for exec format errors.
- Optional FFI verify: loads `FALCON_VERIFY_SO` (or sibling `libfalcon_verify.*`) and, if present, uses CLI first, then FFI `falcon_verify(pub, msg48, sig)` on failure.
- Temp handling: signing now uses in-memory key delivery via stdin (`falcon_cli sign --key-stdin <msg_hex>`), so private key parts are not written to a temporary file on disk.

## Signing flow (tx creation)
1) `Send.send` resolves sender HPK → key identifier via `KeyManager`.
2) Tx is built without signatures; txid/no-witness hash set.
3) `KeyManager.sign_transaction`:
   - Normalizes the signing message to hex (detects 48-byte raw or 96-char hex SHA3-384).
   - Extracts CLI-format private key (f/g/F/G).
   - Calls `FalconCLI.sign(priv, message_hex)` → signature hex.
   - Returns bytes (decoded from hex) to the caller.
4) The witness signature/public key are stored in tx witness fields and encoded as canonical base64 when serialized (`Transaction.to_dict`).
5) Inputs reference prev outputs via `tx_out_id` and carry only compact `SIG_REF` markers (no full embedded signature).
6) Size/fee recalculated after witness is added (policy uses canonical `vsize`).

## Verification flow (tx admission)
1) `TXValidation.normalize_tx_dict` standardizes shapes and derives `prev_tx_id/index`.
2) `SegWit.strip_witness` removes `signature/pubkey` to get the base tx for hashing.
3) `signing_message_hex_digest` recomputes the signing payload (sha3_384 hex).
4) `KeyManager.verify_transaction`:
   - Resolves pubkey from identifier/HPK; recomputes HPK to ensure binding.
   - Normalizes message to hex (prefers 96-char sha3_384 if present).
   - Normalizes signature (hex or base64).
   - Runs `FalconCLI.verify` (CLI), then `verify-hex`, then manual CLI orders; optional FFI fallback if configured.
5) On success, validation continues to fee/UTXO checks; on failure, tx is rejected.

## Build & runtime requirements
- `falcon_cli` must be executable for the host (x86_64/ARM). Rebuild with `Src/Falcon/Falcon/compile_falcon.sh` or the inline gcc/clang command in `falconcli.py`.
- Set execute bit: `chmod +x Src/Falcon/Falcon/falcon_cli`.
- If signing fails with `--key-stdin` unsupported, you are running an older `falcon_cli`; rebuild from current `cli.c` and refresh pinned digest constants before main/test/reg runtime use.
- Optional env:
  - `FALCON_VERIFY_SO` for FFI verify.
  - `FALCONCLI_SILENT=1` to mute verbose logs.
  - `ATHO_FALCONCLI_VALIDATE_MODE` (`cached|always|off`) for startup validation behavior.
  - `ATHO_FALCONCLI_VALIDATE_CACHE` to override startup validation cache file location.
- Hash pin: maintain `Constants.FALCONCLI_PINNED_VERSION_DIGESTS_BY_PLATFORM` + `Constants.FALCONCLI_EXPECTED_HASH_BY_PLATFORM` for release builds. Use global pins only as fallback.

## Audit findings / risks
- Hash pinning is **required on mainnet/testnet by default**; startup fails if no expected digest is configured for the active consensus version. Keep the digest map current for every release.
- FFI fallback will load any path given by `FALCON_VERIFY_SO`; ensure it points to a trusted library or leave unset.
- Key storage is plain JSON on disk (`Keys/KeyManager_Public_Private_Keys.json`), not encrypted. Backup/permission hardening is required.
- Verbose logging prints paths, key lengths, and sometimes previews; run with reduced logging in production to avoid metadata leakage.
- Signing key delivery is now stdin/in-memory. Remaining exposure is process-memory lifetime and debug/log mishandling, not temp-file residue.
- Verification accepts 1024-hex signatures in addition to 2048; if only Falcon-512 is intended, tighten this to 2048 to avoid ambiguity.
- CLI path fallback includes `shutil.which("falcon_cli")`, but strict pinning plus file-permission checks on required networks prevents untrusted binaries from passing verification.
- No hardware-key or MPC support; all signing uses the local CLI with full private key material.

## Operational tips
- Keep `falcon_cli` versioned with the repo; update the version-bound digest map after audited builds.
- Use `FALCONCLI_SILENT=1` in production to cut noise; keep it verbose for diagnostics.
- Regenerate or migrate keys with `KeyManager.enforce_cli_only()` if legacy formats appear.
- In CI, run a lightweight smoke test: `python3 - <<'PY'\nfrom Src.Accounts.falconcli import FalconCLI\nfc = FalconCLI()\nkeys = fc.keygen()\nsig = fc.sign(keys['private_key'], '00'*48)\nassert fc.verify_transaction_hash(keys['public_key'], '00'*48, sig)\nprint('ok')\nPY`
