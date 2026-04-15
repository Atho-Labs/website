# Atho Binary Build and Pinning Guide

Date: 2026-04-10

This document defines the production binary layout, build flow, and pinning controls for Atho native components. The goal is deterministic runtime loading with explicit integrity checks, while keeping build and deployment workflows straightforward for operators.

## 1) Canonical Binary Layout

All runtime binaries are loaded from:
- `Binaries/<platform-tag>/`

Typical platform-tag examples include architecture and OS identity (for example, macOS arm64 vs Linux x86_64). Runtime should not depend on ad-hoc source-tree paths.

Common binary artifacts:
- `falcon_cli(.exe)`
- `libatho_falcon_verify.(dylib|so|dll)`
- `libtx_signing_body_bridge.(dylib|so|dll)`
- `libutxo_batch_check.(dylib|so|dll)`
- `libatho_pow_cpu.(dylib|so|dll)`
- `gpu_miner_opencl(.exe)`
- `gpu_miner_cuda(.exe)` when CUDA build is available

## 2) Pin Registry and Metadata

Integrity metadata is maintained in:
- `Binaries/pin_registry.json`
- `Binaries/<platform-tag>/binary_meta.json`

These files map expected SHA3-384 digests to binary names and are consumed by runtime pin validators. If a binary is rebuilt and metadata is not refreshed, strict mode will reject the load.

## 3) Strict Loading Mode

Enable strict canonical-path loading with:
```bash
export ATHO_BINARIES_STRICT=1
```

Behavior in strict mode:
- runtime only loads from canonical `Binaries/<platform-tag>/` paths,
- legacy fallback paths are disabled,
- hash mismatches fail closed.

This is the recommended production setting.

## 4) Build Commands

From repository root:

```bash
# Falcon CLI build + register
./Src/Falcon/Falcon/compile_falcon.sh

# Falcon FFI verifier
./Src/Falcon/Falcon/build_falcon_verify_shared.sh

# TX signing bridge
./Src/Utility/build_tx_signing_bridge.sh

# UTXO batch checker
./Src/Transactions/build_utxo_batch_check.sh

# CPU PoW native loop
./Src/Miner/build_pow_cpu_bridge.sh

# GPU miners
./Src/Miner/GPU/build_gpu_miner.sh
```

Run these in your release pipeline before packaging or smoke tests.

## 5) Script Output Variables

Build scripts emit expected environment values so downstream tooling can verify exact artifacts.

Examples:
- Falcon FFI verifier:
  - `ATHO_FALCON_FFI_ENABLE`
  - `FALCON_VERIFY_SO`
  - `FALCON_VERIFY_SO_SHA3_384`
- TX signing bridge:
  - `ATHO_TX_SIGNING_SO`
  - `ATHO_TX_SIGNING_SO_SHA3_384`
- UTXO checker:
  - `ATHO_UTXO_BATCH_CHECK_SO`
  - `ATHO_UTXO_BATCH_CHECK_SO_SHA3_384`
- CPU PoW bridge:
  - `ATHO_POW_NATIVE_SO`
  - `ATHO_POW_NATIVE_SO_SHA3_384`

## 6) GPU Build Notes

GPU build behavior is backend-aware:
- OpenCL build is attempted broadly,
- CUDA build runs only where toolchain and platform support are present,
- on macOS, CUDA output may be intentionally absent.

Treat missing CUDA binary on unsupported hosts as expected, not a build failure.

## 7) Release Packaging

Release helper:
```bash
./scripts/build_release_binaries.sh
```

This produces timestamped bundles under:
- `releases/binaries/<timestamp>/`

Recommended release flow:
1. build all required binaries,
2. verify pin metadata updates,
3. run runtime smoke tests in strict mode,
4. package release payload,
5. generate and sign checksums for distribution.

## 8) Common Failure Modes

Most frequent issues:
- wrong platform artifact loaded,
- missing LMDB headers during native build,
- hash mismatch after rebuild without metadata update,
- strict mode enabled while a required binary is absent.

First response:
- confirm active platform-tag path,
- inspect pin metadata for expected digest,
- rebuild artifact + refresh metadata,
- retest with strict mode still enabled.

## 9) Security and Policy Context

Binary integrity controls complement consensus policy but do not replace consensus validation. Active policy values remain independent:
- block target `120s`, retarget `180`,
- tx confirmations `10`, private tx confirmations `10`, coinbase maturity `150`,
- fee floor `500 atoms/vB`.

Binary pinning protects runtime execution integrity; consensus rules protect chain validity.

## 10) Recommended Production Standard

Use this baseline in all production-like environments:
- canonical binary paths only,
- strict mode enabled,
- deterministic build logs retained,
- pin registry/version control updates reviewed,
- release checksums signed and externally verifiable.

Following this standard reduces upgrade risk and makes binary-level audit trails clear for operators and security reviewers.
