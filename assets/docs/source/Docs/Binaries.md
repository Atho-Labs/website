# Atho Binary Build and Pinning Guide

Date: 2026-04-04

This document defines the current binary layout, build flow, and hash-pinning behavior.

## Canonical Layout
All runtime binaries are expected under:
- `Binaries/<platform-tag>/`

Typical outputs:
- `falcon_cli(.exe)`
- `libatho_falcon_verify.(dylib|so|dll)`
- `libtx_signing_body_bridge.(dylib|so|dll)`
- `libutxo_batch_check.(dylib|so|dll)`
- `libatho_pow_cpu.(dylib|so|dll)`
- `gpu_miner_opencl(.exe)`
- `gpu_miner_cuda(.exe)` (when CUDA build is available)

## Registry and Metadata
Build scripts auto-register SHA3-384 hashes in:
- `Binaries/pin_registry.json`
- `Binaries/<platform-tag>/binary_meta.json`

These files are consumed by runtime pin validators.

## Strict Mode (Default)
Runtime binary loading is canonical-path only by default:
```bash
export ATHO_BINARIES_STRICT=1
```

Effect:
- Runtime loads from canonical `Binaries/<platform-tag>/` paths only.
- Legacy fallback paths are disabled.

## Build Commands
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

## Script Outputs and Env Vars
### Falcon FFI verifier
Script prints:
- `ATHO_FALCON_FFI_ENABLE`
- `FALCON_VERIFY_SO`
- `FALCON_VERIFY_SO_SHA3_384`

### TX signing bridge
Script prints:
- `ATHO_TX_SIGNING_SO`
- `ATHO_TX_SIGNING_SO_SHA3_384`

### UTXO batch checker
Script prints:
- `ATHO_UTXO_BATCH_CHECK_SO`
- `ATHO_UTXO_BATCH_CHECK_SO_SHA3_384`

### CPU PoW bridge
Script prints:
- `ATHO_POW_NATIVE_SO`
- `ATHO_POW_NATIVE_SO_SHA3_384`

## GPU Build Behavior
- OpenCL binary build is attempted on all supported hosts.
- CUDA binary build is attempted only when:
  - OS supports CUDA build path, and
  - `nvcc` is present.
- On macOS, CUDA output is expected to be skipped.

## Legacy Paths
Legacy source-tree binary mirrors are disabled. Runtime and pinning use only `Binaries/`.

## Release Packaging
Release artifact helper:
```bash
./scripts/build_release_binaries.sh
```

This creates timestamped output under `releases/binaries/<timestamp>/` and includes source snapshot fallback packaging.

## Failure Modes to Check First
- Wrong platform tag (binary built for different OS/arch).
- Missing LMDB headers for UTXO checker build.
- Hash mismatch after rebuilding without refreshing or using expected pin metadata.
- Runtime strict mode enabled while required binary is missing.
