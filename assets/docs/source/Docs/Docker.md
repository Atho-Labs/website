# Docker Guide (Atho)

Last refresh: 2026-04-14.

Docker in Atho is now build/bootstrap only.
Runtime is native on host.

## Model
- Docker builds pinned binaries and bootstrap metadata in a reproducible Linux toolchain.
- Launcher exports those artifacts to local folders.
- Node/miner/wallet/gui processes are launched natively (not in containers).

## Prereqs
- Docker Desktop (macOS/Windows) or Docker Engine (Linux).
- Host Python environment for runtime (`.venv` is managed by launcher unless `--skip-pip`).
- Full OS package matrix (including host-native fallback tools): [build-prereqs.md](build-prereqs.md)

## One-Command Usage
From repo root:

Option 1 (recommended):
```bash
# GUI-first wrapper
python run.py

# explicit network
python run.py mainnet
python run.py testnet
python run.py regnet
```

Windows PowerShell equivalent:
```powershell
py -3 run.py mainnet
py -3 run.py testnet
py -3 run.py regnet
```

Option 2 (power users):
```bash
# bootstrap only
python build.py --network mainnet
```

What happens:
1. `run.py` launches GUI natively.
2. If GUI dependencies are missing on the current interpreter, `run.py` runs `build.py` once and relaunches GUI from `.venv`.
3. GUI checks runtime readiness (`runtime/build_manifest_<network>.json` + required binaries/libs).
4. If missing, GUI invokes `build.py`.
5. `build.py` runs Docker preflight checks (binary + daemon), then calls Docker builder flow (`docker/run.py --mode builder`), exports artifacts, validates output, writes `runtime/build_manifest_<network>.json`.
6. If selected network binaries are already present, `build.py` skips Docker rebuild and only finalizes runtime metadata.
7. GUI continues with native runtime controls and opens first-run Setup Assistant (wallet + encryption + node profile).

## Useful Flags
```bash
# bootstrap only
python run.py testnet --build-only

# force bootstrap rebuild
python run.py testnet --build-only --force-build

# skip docker rebuild; use cached builder image
python run.py testnet --build-only --no-build

# skip host pip install/update before launch
python run.py testnet --build-only --skip-pip

# no-GUI backend launch
python run.py testnet --no-gui
```

## Artifacts and Paths
- Docker export root: `runtime/docker_bootstrap/`
- Export manifest: `runtime/docker_bootstrap/bootstrap_manifest.json`
- In-image metadata: `runtime/docker_bootstrap/image/docker_bootstrap/build_manifest.json`
- Binary destination (network-scoped): `Binaries/<network>/`
- Runtime-ready marker: `runtime/build_manifest_<network>.json` (legacy `runtime/build_manifest.json` kept for compatibility)

## Runtime Notes
- Storage/key/log directories are managed by native runtime logic.
- Docker no longer starts/stops node containers and no longer manages compose stacks.
- Closing GUI stops native nodes by default (`ATHO_STOP_ON_GUI_EXIT=0` to keep running).

## Troubleshooting
- `docker not found`: install Docker Desktop/Engine and restart terminal.
- `docker daemon unavailable`: open Docker Desktop (or start Docker Engine service) and wait until engine status is healthy.
- `no cached Docker builder image` with `--no-build`: rerun without `--no-build` once.
- GUI bootstrap popup failed: run `python build.py --network <mainnet|testnet|regnet>` in terminal to inspect direct output.
- If native runtime fails after bootstrap, inspect local logs and run:
  - `python Src/Main/runnode.py`
  - `python Src/Main/stop.py --all --include-launcher`
