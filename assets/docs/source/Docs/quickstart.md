# Atho Quickstart

Date: 2026-04-04

This guide is the canonical setup path for current development builds.

## 0) Prerequisites
- Canonical OS package matrix:
  - [build-prereqs.md](build-prereqs.md)
- Minimum required everywhere:
  - Python 3.9+
  - `git`
  - Docker Desktop (Windows/macOS) or Docker Engine (Linux)
- Host-native fallback builders (bash/compiler/cargo/LMDB) are documented in:
  - [build-prereqs.md](build-prereqs.md)

One-click Docker-first launch:

macOS/Linux:
```bash
git clone <repo-url>
cd <repo-dir>
python3 run.py mainnet
```

Windows PowerShell:
```powershell
git clone <repo-url>
cd <repo-dir>
py -3 run.py mainnet
```

## 1) Clone + virtualenv + dependencies

macOS/Linux:
```bash
git clone <repo-url>
cd <repo-dir>
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip setuptools wheel
python -m pip install -r requirements.txt
```

Windows PowerShell:
```powershell
git clone <repo-url>
cd <repo-dir>
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip setuptools wheel
python -m pip install -r requirements.txt
```

## 2) Build and register all binaries

All native outputs are placed under:
- `Binaries/<platform-tag>/...`
- with hash metadata/pinning auto-updated in `Binaries/pin_registry.json` and `Binaries/<platform-tag>/binary_meta.json`

### 2.1 Falcon CLI (required)
Build + auto-register `falcon_cli` into `Binaries/<platform-tag>/`:
```bash
cd Src/Falcon/Falcon
./compile_falcon.sh
cd ../../..
```

If you already have a prebuilt `falcon_cli`, register it directly:
```bash
./.venv/bin/python Src/Falcon/Falcon/install_platform_binary.py --src /absolute/path/to/falcon_cli
```

### 2.2 Falcon FFI verify shared library (required for fastest verify path)
```bash
./Src/Falcon/Falcon/build_falcon_verify_shared.sh
```
This prints export lines for:
- `ATHO_FALCON_FFI_ENABLE=1`
- `FALCON_VERIFY_SO=<path>`
- `FALCON_VERIFY_SO_SHA3_384=<hash>`

### 2.3 TX signing-body native bridge
```bash
./Src/Utility/build_tx_signing_bridge.sh
```
Exports printed by script:
- `ATHO_TX_SIGNING_SO=<path>`
- `ATHO_TX_SIGNING_SO_SHA3_384=<hash>`

### 2.4 UTXO batch checker native library
```bash
./Src/Transactions/build_utxo_batch_check.sh
```
Exports printed by script:
- `ATHO_UTXO_BATCH_CHECK_SO=<path>`
- `ATHO_UTXO_BATCH_CHECK_SO_SHA3_384=<hash>`

### 2.5 CPU PoW native bridge
```bash
./Src/Miner/build_pow_cpu_bridge.sh
```
Exports printed by script:
- `ATHO_POW_NATIVE_SO=<path>`
- `ATHO_POW_NATIVE_SO_SHA3_384=<hash>`

### 2.6 GPU miner binaries (OpenCL + optional CUDA)
```bash
./Src/Miner/GPU/build_gpu_miner.sh
```
Outputs:
- `gpu_miner_opencl` (always attempted)
- `gpu_miner_cuda` (only when `nvcc` exists and OS supports CUDA)

## 3) Strict binary mode (default)
Runtime now uses only `Binaries/<platform-tag>/` paths by default.
Explicitly set for clarity:
```bash
export ATHO_BINARIES_STRICT=1
```

## 4) Create API credentials
```bash
./.venv/bin/python Src/Api/auth.py
```

## 5) Run node launcher
```bash
./.venv/bin/python Src/Main/runnode.py
```
Recommended first run:
- start full + wallet/API
- then add miner role after baseline sync is healthy

Scripted terminal-only launch (no prompts):
```bash
./.venv/bin/python Src/Main/runnode.py --non-interactive --node-type full --network mainnet
./.venv/bin/python Src/Main/runnode.py --non-interactive --node-type miner --network mainnet
```

## 6) Run GUI (optional)
```bash
./.venv/bin/python Src/GUI/gui.py
```

## 6.1) Terminal sender + bond/stake flows
```bash
# transfer
./.venv/bin/python Src/Main/send.py transfer <recipient_hpk_or_base56> <amount> --yes

# role addresses + balances
./.venv/bin/python Src/Main/send.py addresses
./.venv/bin/python Src/Main/send.py balance

# deposits
./.venv/bin/python Src/Main/send.py bond-deposit <amount> --yes
./.venv/bin/python Src/Main/send.py stake-deposit <amount> --yes

# exit / unbond request
./.venv/bin/python Src/Main/send.py bond-exit --yes
./.venv/bin/python Src/Main/send.py stake-exit --yes

# withdraw after unlockable state
./.venv/bin/python Src/Main/send.py bond-withdraw <amount> --yes
./.venv/bin/python Src/Main/send.py stake-withdraw <amount> --yes
```

## 7) Performance-related runtime knobs
- `ATHO_TX_VERIFY_WORKERS=<n>`: parallel tx verification workers.
- `ATHO_UTXO_BATCH_CHECK_ENABLE=1`: enable native UTXO batch path (default on).
- `ATHO_ALLOW_UTXO_BATCH_FALLBACK=1`: keep bootstrap/runtime usable when the native UTXO checker cannot be built.
- `ATHO_GPU_BACKEND=auto|opencl|cuda`: GPU backend selection override.
- `ATHO_BINARIES_STRICT=1`: require canonical binary locations.

## 8) Basic health checks
```bash
# running processes and ports
./.venv/bin/python Src/Main/stop.py --active

# network activity
tail -f logs/mainnet/network/network.log

# miner runtime
tail -f logs/mainnet/miner/gpu_runtime.log
```

## 9) Common failure points
- Falcon binary not installed for current platform tag.
- LMDB headers missing when building `libutxo_batch_check` only matter if you want the native checker; bootstrap now falls back to Python validation when allowed.
- CUDA expected on macOS (CUDA build is skipped there).
- API auth not initialized.
- Stale background processes holding ports.

## 10) Current Consensus Runtime Defaults
Useful verification values for deployment checks:
- block target: `120s`
- difficulty retarget interval: `180` blocks
- transaction confirmations required: `10`
- coinbase maturity: `150` blocks
- fee floor: `500 atoms/vB`
- min tx fee: `200,000 atoms`
- BPoW enforcement height: `10,000`
- bond requirement: `25 ATHO`

Use:
- [build-prereqs.md](build-prereqs.md)
- [Troubleshooting.md](Troubleshooting.md)
- [Binaries.md](Binaries.md)
- [Node_Stop.md](Node_Stop.md)
