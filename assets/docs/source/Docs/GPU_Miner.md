# Atho GPU Miner

Date: 2026-04-10

This document defines the active GPU mining runtime for Atho and the expected production operating model. It is focused on practical execution details: build outputs, runtime controls, safety checks, tuning guidance, and validation workflows.

## Scope

The GPU path is a performance acceleration layer for the same consensus rules used by the CPU miner. It does not introduce a separate block format or alternate validation pipeline. If a GPU backend is unavailable or fails policy checks, runtime behavior is controlled by explicit fallback and strictness flags.

Primary implementation components:
- `Src/Miner/GPU/sha3_384.cl`: OpenCL SHA3-384 kernels.
- `Src/Miner/GPU/sha3_384.cu`: CUDA SHA3-384 kernels (where supported).
- `Src/Miner/GPU/gpu_miner.cpp`: host binary entrypoint and probe mode.
- `Src/Miner/GPU/gpu_interface.py`: Python orchestration wrapper.
- `Src/Miner/GPU/compat.py`: capability checks and backend compatibility logic.
- `Src/Miner/GPU/audit_gpu_miner.py`: correctness and safety validation suite.
- `Src/Miner/GPU/compare_cpu_gpu_blocks.py`: output consistency checks against CPU reference.

## Build and Artifact Location

Build from repository root:
```bash
./Src/Miner/GPU/build_gpu_miner.sh
```

Expected binaries are written to canonical platform paths under `Binaries/<platform-tag>/` and are governed by the same hash-pinning model used for other native modules.

Typical outputs:
- `gpu_miner_opencl(.exe)`
- `gpu_miner_cuda(.exe)` when CUDA toolchain is available

Operational rule:
- Always treat `Binaries/<platform-tag>/` as source of truth for runtime loading.
- Avoid manual ad-hoc copies from build temp directories.

## Binary Runtime Modes

OpenCL probe mode:
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

Use probe mode during host bring-up, driver updates, or after changing backend/runtime flags.

## Runtime Tuning Fields

`runtime_tuning.json -> miner` supports GPU controls:
- `miner_type`: `CPU` or `GPU`.
- `gpu_backend`: `auto`, `opencl`, `cuda`.
- `gpu_batch_size`: nonce batch size.
- `gpu_batch_timeout_sec`: timeout guard per batch.
- `gpu_auto_tune`: adaptive batch tuning.
- `gpu_target_batch_ms`: target wall-time for tuning.
- `gpu_strict`: disable CPU fallback on GPU failure.
- `gpu_sandbox`: subprocess resource guardrails.
- `gpu_verify_runtime`: require successful probe.

Recommended production posture:
- keep `gpu_verify_runtime` enabled,
- keep `gpu_sandbox` enabled,
- set `gpu_strict` based on SLA preference:
  - `false` for resilience-first environments,
  - `true` for deterministic GPU-only testing and benchmarks.

## Logging and Observability

Relevant logs:
- `logs/<network>/pow/pow_runtime.log`
- `logs/<network>/miner/miner_runtime.log`
- `logs/<network>/miner/gpu_runtime.log`

What to watch:
- backend detection at startup,
- probe failures and fallback events,
- repeated timeout/retry loops,
- hashrate instability across identical workload windows.

A quick health baseline should include stable backend availability and predictable batch completion latency.

## Validation Checklist

Run after binary rebuilds, driver upgrades, or major runtime tuning changes:
```bash
./.venv/bin/python Src/Miner/GPU/audit_gpu_miner.py --strict
./.venv/bin/python Src/Miner/GPU/compare_cpu_gpu_blocks.py --count 5 --strict --backend auto
```

Expected outcome:
- strict audit passes,
- CPU/GPU outputs match for identical templates/targets,
- no hash or nonce-format drift versus CPU reference path.

## Common Failure Patterns

Frequent causes of GPU miner issues:
- stale or mismatched OpenCL/CUDA drivers,
- running wrong platform binary,
- missing device permissions in containerized environments,
- overly aggressive batch sizes that trigger repeated timeout churn,
- strict mode enabled with no validated backend available.

First-response sequence:
1. run `--probe`,
2. reduce batch size and timeout pressure,
3. rerun strict audit,
4. compare with CPU output for deterministic parity,
5. verify binary hash metadata is current.

## Security and Consensus Notes

The GPU miner does not alter consensus policy constants. Active production values remain:
- block target cadence `120s`,
- retarget interval `180` blocks,
- fee floor `350 atoms/vB`,
- tx confirmations `10`, private tx confirmations `10`, coinbase maturity `150`.

GPU acceleration changes throughput potential for hash search, not chain validity semantics.

## Operational Recommendation

Treat GPU mining as a controlled acceleration feature:
- keep reproducible build artifacts,
- keep pin metadata synchronized,
- enforce preflight probe + strict audit in deployment pipelines,
- maintain documented fallback behavior so operators know exactly what happens under backend failure.

This keeps mining performance improvements compatible with deterministic consensus and predictable runtime behavior.
