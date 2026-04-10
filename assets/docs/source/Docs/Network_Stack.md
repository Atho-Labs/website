# Atho Network Stack

Date: 2026-04-04

This document explains the current stack, why each layer exists, and where the implementation lives.

## Design Goal
Atho keeps Python as the controller while moving performance-critical execution into native code where practical. The result is maintainability + speed:
- Python owns orchestration, APIs, configuration, and UI.
- C/C++ binaries own heavy loops and cryptographic hot paths.

## Layer 0: Binary Runtime and Hash Pinning
Purpose: load native components safely and consistently across OS/arch.

Key behavior:
- Canonical binary location: `Binaries/<platform-tag>/`.
- Every built binary is registered with SHA3-384 hash in:
  - `Binaries/pin_registry.json`
  - `Binaries/<platform-tag>/binary_meta.json`
- Strict load mode via `ATHO_BINARIES_STRICT=1` prevents fallback to legacy paths.

Code paths:
- `Src/Utility/oscompat.py`
- `Src/Utility/binarypin.py`
- `Src/Falcon/Falcon/install_platform_binary.py`

Why: runtime integrity, reproducible deployments, and safer upgrades.

## Layer 1: Cryptography
Purpose: deterministic post-quantum signing and verification with pinned binaries.

Components:
- `falcon_cli` binary for keygen/sign/verify.
- Optional FFI verify library (`libatho_falcon_verify`) for in-process verification acceleration.

Code paths:
- `Src/Accounts/falconcli.py`
- `Src/Falcon/Falcon/build_falcon_verify_shared.sh`
- `Src/Utility/const.py` (pin policy and verifier settings)

Why: keep Falcon verification fast while preserving strict binary trust policy.

## Layer 2: Transaction Wire and Integer Accounting
Purpose: compact tx transport and exact accounting.

Current behavior:
- Transport codec is compact binary (`ATX2`; `ATX1` decode compatibility).
- Inputs/outputs are encoded using varints and fixed-size digests where appropriate.
- Witness is encoded as raw bytes internally.
- API/UI display remains stable (human-readable fields, canonical encoding), while internal math stays integer-atom based.
- Fee policy is enforced on canonical `vsize` with current floor `350 atoms/vB`.

Code paths:
- `Src/Transactions/txbinary.py`
- `Src/SigWit/sigwit.py`
- `Src/Utility/wirecodec.py`
- `Src/Utility/const.py`

Why: reduce wire overhead and avoid float/decimal drift in consensus-critical math.

## Capacity Snapshot (Current Policy)
With `3,500,000 vB` block budget and `120s` block time:
- `1 in / 2 out` (~`566 vB`) -> `~51.5 TPS`
- `2 in / 2 out` (~`615 vB`) -> `~47.4 TPS`
- `3 in / 2 out` (~`664 vB`) -> `~43.9 TPS`

This is why tx-shape distribution directly drives sustained throughput.

## Layer 3: Validation and Consensus
Purpose: deterministic acceptance rules and consistent mempool/block behavior.

Components:
- Transaction verification with parallel workers.
- Optional C UTXO batch checker for fast LMDB existence checks.
- Block verification and consensus admission gates.
- BPoW bond/stake state machines (`bond.lmdb`, `stake.lmdb`) and fee-pool routing logic.

BPoW execution in this layer:
- validates miner proof fields in block body (`miner_pubkey`, `reward_address`, `miner_signature`),
- derives expected bond identity from raw pubkey + role domain,
- enforces bond state/confirmations/threshold at active heights,
- classifies slashable-invalid vs stale/orphan conditions deterministically.

Code paths:
- `Src/Main/txveri.py`
- `Src/Transactions/txvalidation.py`
- `Src/Main/blockveri.py`
- `Src/Main/consensus.py`
- `Src/Transactions/build_utxo_batch_check.sh`

Why: keep rule execution deterministic while scaling throughput under load.

## Layer 4: Mining Engines
Purpose: support CPU and GPU mining without changing consensus outputs.

CPU path:
- Native PoW loop bridge (`libatho_pow_cpu`) called from Python orchestrator.

GPU path:
- OpenCL miner binary (`gpu_miner_opencl`) for cross-platform GPU execution.
- CUDA miner binary (`gpu_miner_cuda`) for NVIDIA systems where supported.
- Runtime backend auto/probe logic with explicit error reporting.

Code paths:
- `Src/Miner/pow.py`
- `Src/Miner/build_pow_cpu_bridge.sh`
- `Src/Miner/GPU/build_gpu_miner.sh`
- `Src/Miner/GPU/gpu_interface.py`

Why: maximize hash throughput while keeping one control plane and one consensus path.

## Layer 5: Node APIs, GUI, and Operator Control
Purpose: operational usability without exposing consensus internals to accidental mutation.

Components:
- FastAPI auth and role-controlled endpoints.
- GUI controls for node lifecycle, miner mode, backend selection, and runtime tuning.
- Launcher and stop tooling for deterministic process management.

Code paths:
- `Src/Api/auth.py`
- `Src/Api/apis.py`
- `Src/GUI/gui.py`
- `Src/Main/runnode.py`
- `Src/Main/stop.py`

Why: keep operator workflows stable while internals evolve for speed.

## Why This Stack Works
- Security: binary pinning + explicit env-gated native loading.
- Performance: native execution in PoW and validation hot paths.
- Correctness: consensus/accounting remain integer-atom and deterministic.
- Maintainability: Python still coordinates lifecycle, APIs, and UX.
