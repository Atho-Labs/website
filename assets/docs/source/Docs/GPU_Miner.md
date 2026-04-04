# Atho GPU Miner

Date: 2026-04-04

This document defines the active GPU miner runtime and build path.

## Implemented Components
- `Src/Miner/GPU/sha3_384.cl`: OpenCL SHA3-384 kernels.
- `Src/Miner/GPU/gpu_miner.cpp`: OpenCL host binary and probing/runtime entry.
- `Src/Miner/GPU/gpu_interface.py`: Python wrapper with backend autodetect (`auto/opencl/cuda`).
- `Src/Miner/GPU/compat.py`: backend compatibility and runtime checks.
- `Src/Miner/GPU/audit_gpu_miner.py`: correctness/security checks.
- `Src/Miner/GPU/compare_cpu_gpu_blocks.py`: CPU vs GPU hash/vector consistency checks.

## Build
From repository root:
```bash
./Src/Miner/GPU/build_gpu_miner.sh
```

## OpenCL Binary Usage
Probe:
```bash
./Binaries/<platform-tag>/gpu_miner_opencl --probe
```

Fixed-header mode:
```bash
./Binaries/<platform-tag>/gpu_miner_opencl <header_hex_344> <nonce_offset_172> <start_nonce> <batch_size> <target_hex_96>
```

Template mode:
```bash
./Binaries/<platform-tag>/gpu_miner_opencl --template <prefix_hex> <suffix_hex> <start_nonce> <batch_size> <target_hex_96>
```

## Runtime Tuning (`runtime_tuning.json -> miner`)
- `miner_type`: `CPU` or `GPU`
- `gpu_backend`: `auto`, `opencl`, `cuda`
- `gpu_batch_size`: integer batch size
- `gpu_batch_timeout_sec`: per-batch timeout
- `gpu_auto_tune`: adaptive batch-size tuning
- `gpu_target_batch_ms`: target batch wall-time
- `gpu_strict`: fail instead of CPU fallback on GPU errors
- `gpu_sandbox`: apply subprocess resource limits
- `gpu_verify_runtime`: require successful backend probe

## Relevant Logs
- `logs/<network>/pow/pow_runtime.log`
- `logs/<network>/miner/miner_runtime.log`
- `logs/<network>/miner/gpu_runtime.log`

## Validation
```bash
./.venv/bin/python Src/Miner/GPU/audit_gpu_miner.py --strict
./.venv/bin/python Src/Miner/GPU/compare_cpu_gpu_blocks.py --count 5 --strict --backend auto
```
