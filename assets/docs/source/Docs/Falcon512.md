# Falcon-512 Integration (Current)

Date: 2026-04-10

This document is the active Falcon-512 integration reference for Atho. It covers signing and verification flow, byte-policy enforcement, runtime binary controls, and operational checks required to keep cryptographic behavior deterministic across nodes.

## 1) Runtime Model

Signing and verification are orchestrated through:
- `Src/Accounts/falconcli.py`

Consensus validation path references:
- `Src/Transactions/txvalidation.py::_validate_signature`
- `KeyManager.verify_with_pubkey(...)`
- `FalconCLI.verify(...)`

Runtime binary resolution prefers canonical pinned artifacts in `Binaries/<platform-tag>/`.

## 2) Key and Signature Byte Policy

Current policy constants in `Src/Utility/const.py`:
- canonical Falcon public key size: `897 bytes` (`FALCON_PUBKEY_BYTES`),
- legacy public key size compatibility: `1024 bytes` (`FALCON_PUBKEY_LEGACY_BYTES`), disabled by default,
- compressed signature target: `666 bytes` (`FALCON_SIG_COMPRESSED_TARGET_BYTES`),
- accepted signature window: `600..690 bytes` (`FALCON_SIG_MIN_BYTES..FALCON_SIG_MAX_BYTES`).

Consensus checks enforce these bounds before invoking cryptographic verification.

## 3) Encoding and Wire Behavior

Atho uses a binary-first tx transport (`ATX2`) with witness as raw bytes. API compatibility layers may expose witness fields using canonical text-safe encodings, but validation always decodes back to byte form and applies policy checks on bytes.

Practical implication:
- display format can vary by API surface,
- consensus acceptance rules remain byte-deterministic.

## 4) Signing Flow

Standard signing pipeline:
1. construct canonical no-witness signing body,
2. hash signing body with SHA3-384,
3. sign digest via Falcon CLI bridge,
4. attach signature/public key witness fields.

Determinism requirements:
- canonical field ordering,
- stable serialization separators,
- explicit decimal/atom normalization before digesting.

## 5) Verification Flow

Standard verification pipeline:
1. strip witness fields and reconstruct canonical signing body,
2. recompute SHA3-384 digest,
3. decode witness signature/public key,
4. enforce byte-length policy,
5. run Falcon verification via configured verifier path.

Any mismatch in canonical body reconstruction invalidates the signature regardless of witness payload shape.

## 6) Optional FFI Verification Path

An optional shared-library verifier can be enabled with explicit env configuration:
- `ATHO_FALCON_FFI_ENABLE=1`
- `FALCON_VERIFY_SO=<absolute-path>`
- `FALCON_VERIFY_SO_SHA3_384=<expected-digest>`

If FFI is unavailable or fails pin checks, runtime can fall back to CLI verification according to current policy flags.

## 7) Binary Pinning and Integrity Controls

Integrity metadata locations:
- `Binaries/pin_registry.json`
- `Binaries/<platform-tag>/binary_meta.json`

Strict mode:
```bash
export ATHO_BINARIES_STRICT=1
```

With strict mode enabled, unexpected binary paths or digest mismatches are rejected. This protects against accidental drift and malicious binary substitution.

## 8) Operational Checklist

After Falcon-related changes:
1. rebuild Falcon CLI/shared verifier artifacts,
2. refresh pin metadata,
3. run tx signing/verification smoke tests,
4. run full unit/integration suite for tx validation paths,
5. confirm explorer/API endpoints still decode witness fields correctly.

Command references:
```bash
./.venv/bin/python Src/Falcon/Falcon/install_platform_binary.py
./Src/Falcon/Falcon/build_falcon_verify_shared.sh
```

## 9) Migration and Compatibility Notes

Legacy pubkey acceptance (`1024-byte`) should remain disabled unless a deliberate migration window is approved. Re-enabling compatibility broadens acceptance surface and should be time-bounded with explicit network coordination.

When compatibility mode is temporarily enabled:
- document activation height and deactivation plan,
- track acceptance counts,
- return to canonical-only mode as soon as migration completes.

## 10) Policy Snapshot Context

Related production policy values (not Falcon-specific, but relevant to tx lifecycle):
- block target `120s`, retarget interval `180`,
- tx confirmations `10`, private tx confirmations `10`, coinbase maturity `150`,
- fee floor `500 atoms/vB`, min tx fee `200,000 atoms`.

Falcon signatures protect transaction authenticity; these constants govern confirmation and economic policy around those authenticated transactions.

## 11) Bottom Line

Falcon-512 integration in Atho is operationally mature when three things remain true:
- byte-level policy checks are enforced before verify,
- canonical signing-body reconstruction is deterministic,
- runtime verifier binaries are pin-validated from canonical paths.

Maintaining these guarantees keeps transaction signature behavior stable, auditable, and consensus-safe.
