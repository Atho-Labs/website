# Falcon-512 Integration (Current)

Date: 2026-03-27

This document is the current Falcon-512 reference for Atho runtime, transaction validation, and binary security controls.

## 1) Active Runtime Model
- Signing and verification are routed through `Src/Accounts/falconcli.py`.
- Binary discovery prefers `Binaries/<platform-tag>/falcon_cli(.exe)` with strict pin enforcement available.
- Verification path in consensus:
  - `Src/Transactions/txvalidation.py::_validate_signature`
  - `KeyManager.verify_with_pubkey(...)`
  - `FalconCLI.verify(...)`

## 2) Key and Signature Size Policy
From `Src/Utility/const.py`:
- Canonical Falcon pubkey size: `897` bytes (`FALCON_PUBKEY_BYTES`).
- Legacy pubkey size (compatibility): `1024` bytes (`FALCON_PUBKEY_LEGACY_BYTES`), currently disabled (`FALCON_PUBKEY_ACCEPT_LEGACY=False`).
- Signature compressed target: `666` bytes (`FALCON_SIG_COMPRESSED_TARGET_BYTES`).
- Signature acceptance window: `600..690` bytes (`FALCON_SIG_MIN_BYTES..FALCON_SIG_MAX_BYTES`).

Consensus validation enforces these byte bounds before signature verification.

## 3) Wire/Encoding Behavior
- Internal binary tx codec (`ATX2`) carries witness items as raw bytes.
- API/JSON compatibility representation still uses canonical base64 for `signature` and `pubkey`.
- Validation decodes wire fields back to bytes/hex and applies byte-length policy + Falcon verification.

This means display format can remain stable while consensus logic is byte-native.

## 4) Signing and Verification Flow
Signing:
1. Build canonical no-witness signing body.
2. Compute SHA3-384 signing digest.
3. Sign through `FalconCLI.sign(...)`.
4. Attach witness to tx (binary path uses raw bytes; JSON path uses canonical wire encoding).

Verification:
1. Strip witness and recompute signing digest.
2. Decode witness `signature`/`pubkey`.
3. Enforce signature/pubkey size policy.
4. Verify with Falcon CLI (and optional pinned FFI verifier).

## 5) FFI Verify Path (Optional)
FFI verify is optional and must be explicitly enabled:
- `ATHO_FALCON_FFI_ENABLE=1`
- `FALCON_VERIFY_SO=<absolute path>`
- `FALCON_VERIFY_SO_SHA3_384=<expected hash>`

If configured incorrectly, runtime falls back to CLI-only behavior based on current policy/flags.

## 6) Binary Pinning and Safety
- Pin domain and digest maps are enforced from `Src/Utility/const.py`.
- Canonical pin metadata is maintained in:
  - `Binaries/pin_registry.json`
  - `Binaries/<platform-tag>/binary_meta.json`
- Strict mode:
```bash
export ATHO_BINARIES_STRICT=1
```

## 7) Operational Checklist
- Register/install platform Falcon binary:
```bash
./.venv/bin/python Src/Falcon/Falcon/install_platform_binary.py
```
- Optional FFI verifier build:
```bash
./Src/Falcon/Falcon/build_falcon_verify_shared.sh
```
- Keep pin metadata current whenever binaries are rebuilt.
- Keep legacy pubkey acceptance disabled (`FALCON_PUBKEY_ACCEPT_LEGACY=False`) unless a coordinated migration requires temporary re-enable.
