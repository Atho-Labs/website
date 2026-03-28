# Atho Network (Alpha Release) ![Version](https://img.shields.io/badge/version-1.00-blue)

Status: Alpha documentation snapshot (2026-03-12).

## Simple Quick Start (Recommended Order)
If you want the fastest setup with the least troubleshooting, use macOS or Linux. Windows works, but typically needs more toolchain setup.
If setup fails at any point, use [Docs/Troubleshooting.md](Docs/Troubleshooting.md).

### System requirements
- CPU: Intel i3 (or equivalent) or better
- RAM: 4-8 GB minimum
- Storage: 120 GB SSD recommended
- Graphics/runtime: OpenGL 2.0 support (for GUI/Kivy)

### 1) Download code + create virtual environment + install requirements
macOS / Linux:
```bash
git clone <repo-url>
cd <repo-dir>
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip setuptools wheel
python -m pip install -r requirements.txt
```

Windows (PowerShell):
```powershell
git clone <repo-url>
cd <repo-dir>
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip setuptools wheel
python -m pip install -r requirements.txt
```
If `requirements.txt` install fails (`lmdb`, `kivy`, `cryptography`), see [Docs/Troubleshooting.md](Docs/Troubleshooting.md) -> `Dependency install issues (venv + pip)`.

### 2) Build/install Falcon binary
Runtime uses platform-tagged Falcon binaries from `Src/Falcon/Binaries/<platform_tag>/`.

Register/install current host binary:
```bash
./.venv/bin/python Src/Falcon/Falcon/install_platform_binary.py
```

If Falcon is missing for your platform, build it first (compiler required), then rerun install:
- macOS: `clang` (Xcode Command Line Tools)
- Linux: `gcc`/`clang` (build-essential)
- Windows: `MSYS2 MinGW-w64 (gcc)` or Visual Studio Build Tools (`cl`)

Falcon compile commands (full flags):

macOS:
```bash
cd Src/Falcon/Falcon
clang -O3 -std=c99 -Wall -Wextra -Wshadow -Wundef \
  -DFALCON_FPNATIVE \
  cli.c falcon.c fft.c fpr.c keygen.c rng.c shake.c sign.c vrfy.c common.c codec.c \
  -o falcon_cli
chmod +x falcon_cli
cd ../../..
./.venv/bin/python Src/Falcon/Falcon/install_platform_binary.py --src "$(pwd)/Src/Falcon/Falcon/falcon_cli"
```

Linux:
```bash
cd Src/Falcon/Falcon
gcc -O3 -std=c99 -Wall -Wextra -Wshadow -Wundef -mavx2 \
  -DFALCON_FPNATIVE -DFALCON_AVX2 \
  cli.c falcon.c fft.c fpr.c keygen.c rng.c shake.c sign.c vrfy.c common.c codec.c \
  -o falcon_cli
chmod +x falcon_cli
cd ../../..
./.venv/bin/python Src/Falcon/Falcon/install_platform_binary.py --src "$(pwd)/Src/Falcon/Falcon/falcon_cli"
```

Windows (MSYS2 MinGW-w64):
```bash
cd Src/Falcon/Falcon
gcc -O3 -std=c99 -Wall -Wextra -Wshadow -Wundef -mavx2 \
  -DFALCON_FPNATIVE -DFALCON_AVX2 \
  cli.c falcon.c fft.c fpr.c keygen.c rng.c shake.c sign.c vrfy.c common.c codec.c \
  -o falcon_cli.exe -ladvapi32
cd ../../..
python Src/Falcon/Falcon/install_platform_binary.py --src "%CD%\\Src\\Falcon\\Falcon\\falcon_cli.exe"
```

### 3) Build Kyber shared library (wallet PQ unlock path)
Kyber can auto-build when needed, but you can prebuild by running any wallet key action after deps are installed.

Manual Kyber build requirement:
- C compiler available (`cc`, `clang`, or `gcc`)
- Output path used by runtime: `Src/Kyber/ref/lib/`

Kyber compile commands (full flags, Kyber-1024 / `KYBER_K=4`):

macOS:
```bash
cd Src/Kyber/ref
clang -shared -fPIC -Wall -Wextra -Wpedantic -Wmissing-prototypes -Wredundant-decls \
  -Wshadow -Wpointer-arith -O3 -fomit-frame-pointer -DKYBER_K=4 \
  kem.c indcpa.c polyvec.c poly.c ntt.c cbd.c reduce.c verify.c symmetric-shake.c fips202.c randombytes.c \
  -o lib/libpqcrystals_kyber1024_ref.dylib
cd ../../..
```

Linux:
```bash
cd Src/Kyber/ref
gcc -shared -fPIC -Wall -Wextra -Wpedantic -Wmissing-prototypes -Wredundant-decls \
  -Wshadow -Wpointer-arith -O3 -fomit-frame-pointer -DKYBER_K=4 \
  kem.c indcpa.c polyvec.c poly.c ntt.c cbd.c reduce.c verify.c symmetric-shake.c fips202.c randombytes.c \
  -o lib/libpqcrystals_kyber1024_ref.so
cd ../../..
```

Windows (MSYS2 MinGW-w64):
```bash
cd Src/Kyber/ref
gcc -shared -Wall -Wextra -Wpedantic -Wmissing-prototypes -Wredundant-decls \
  -Wshadow -Wpointer-arith -O3 -fomit-frame-pointer -DKYBER_K=4 \
  kem.c indcpa.c polyvec.c poly.c ntt.c cbd.c reduce.c verify.c symmetric-shake.c fips202.c randombytes.c \
  -o lib/libpqcrystals_kyber1024_ref.dll
cd ../../..
```

### 4) Open Key Manager, create keys, encrypt if desired
- You can do this in CLI (`Src/GUI/cliui.py`) or GUI.
- CLI is good for first-time guided flow (`wallet new`, `wallet recover`, `wallet export`, etc.).

### 5) Open GUI and set API auth
Run GUI:
- macOS: `./run_gui.command`
- Linux/macOS shell: `./run_gui.sh`
- Windows: `run_gui.bat`

In GUI -> Settings:
- set API key
- set username/password you created in `Src/Api/auth.py`

### 6) Start nodes (Node tab in GUI)
- Start default nodes first (`full` + `wallet` is enough to participate).
- Miner node is optional and needs extra compute.

If nodes do not start:
1. Run `./.venv/bin/python Src/Main/stop.py --active` (or `--list`) to inspect running PIDs.
2. Stop all stuck nodes:
   - `./.venv/bin/python Src/Main/stop.py --all`
3. Start again from GUI Node tab.

You can also start manually:
- `./.venv/bin/python Src/Main/runnode.py`
- `./.venv/bin/python Src/Main/join.py`

### 6.5) Request Inbox (GUI)
- Request inbox UI is currently disabled by default in the alpha desktop build for stability.
- If you enable it in code/runtime, keep the send safety flow:
  - open request inbox,
  - choose a request,
  - copy requester address,
  - paste the same address in the verify field,
  - continue to prefilled send modal (address + amount).
- Legacy bell/notification-center flow is not part of the stable default path.

### 7) Verify network behavior in logs
Watch:
- `logs/mainnet/network/network.log`
- `logs/mainnet/api/send_intent_audit.log` (send propagation/recovery/probe events)

Healthy signs:
- `peer_connected`
- `handshake_ok`
- sync/header activity
- mempool/tx communication

Low-noise defaults:
- P2P tx/inv/getdata chatter is DEBUG by default (keeps `network.log` lighter).
- Re-enable tx activity at INFO if needed: `ATHO_NETLOG_TX_ACTIVITY_INFO=1`.
- Network log dedupe window defaults to 45 seconds (`ATHO_NETLOG_DEDUP_SECONDS`).
- For deep troubleshooting: `ATHO_NETLOG_LEVEL=DEBUG`.

### Common issues
- Falcon binary not built/registered for your platform.
- API key/user/password not set correctly in GUI.
- Nodes are already running in background (PID conflict).
- Wrong bootstrap/port configuration.
- On low-power systems, run only full + wallet nodes.
- Runtime guard audit shows `digest_mismatch` (manifest is stale after code updates).
- Explorer shows stale pages after a restart/reset (refresh route cache/source).

### Windows note
Windows setup may require extra compiler/runtime troubleshooting. For easiest setup and fewer issues, we recommend macOS or Linux.

### Need help?
For bugs/issues: `labs@atho.io`

### Common Troubleshooting
If you get stuck, start here:
- [Docs/Troubleshooting.md](Docs/Troubleshooting.md) (most common setup/runtime failures)
- [Docs/Node_Stop.md](Docs/Node_Stop.md) (stuck/background node PIDs, stop/list/watch)
- [Docs/quickstart.md](Docs/quickstart.md) (step-by-step run flow)
- [Docs/Binaries.md](Docs/Binaries.md) (Falcon/binary build and platform issues)
- [Docs/ApiAuth.md](Docs/ApiAuth.md) (API key/user/password auth errors)

Fast checks:
- List running nodes: `./.venv/bin/python Src/Main/stop.py --active`
- Stop all nodes: `./.venv/bin/python Src/Main/stop.py --all`
- Watch network logs: `tail -f logs/mainnet/network/network.log`
- Rebuild runtime guard manifest after critical code changes:
  `PYTHONPATH=. ./.venv/bin/python Src/Utility/versioning.py refresh-manifest --out Src/Config/security_manifest.json`
- Sign manifest (optional, when using signed guard policy):
  `PYTHONPATH=. ./.venv/bin/python Src/Utility/versioning.py sign-manifest --path Src/Config/security_manifest.json --key-file /absolute/path/to/falcon_private_key.json`
- Verify manifest:
  `PYTHONPATH=. ./.venv/bin/python Src/Utility/versioning.py verify-manifest --path Src/Config/security_manifest.json`

Startup health gate behavior:
- Launcher now reports node `started` only after expected ports are listening and API `/health` (or `/chain/info`) responds.
- Preflight now fails fast if API key requirements fail or Falcon binary/pin validation fails.

## Overview
Atho is an experimental, post-quantum–ready UTXO blockchain built around Falcon signatures. It targets 120-second blocks (~2 minutes), deterministic serialization, and LMDB-backed storage for blocks, UTXO, and mempool. Everything is exposed via a secured API (API key + user/pass + optional HMAC), with a CLI and launcher to spin up full, miner, and wallet/API nodes.

**License / Status:** Apache 2.0, experimental software, provided “as is” without warranties. Copyright 2025 Atho Labs (owner hash: 0d93dcb5040319b7b93e3f5228cca70ea580eb00959d12a97ab79c30254c8ccff20f6ee55675c27d8ac570fd9b0897d1fc14d5b62467f9fecf7d4e535e89d219).

Current version: `1.00` (kept in `VERSION` and `Src/Utility/const.py:Constants.VERSION`).

## What we’re solving
- Post-quantum signatures now: Falcon-512 for keys, transactions, and block validation.
- Deterministic, compact storage: LMDB for blocks/UTXO/mempool; standardized JSON schemas.
- Simple but guarded consensus paths: consensus write contexts for block/UTXO/mempool writes.
- Wallet safety: API key + username/password on all HTTP endpoints; HMAC optional; deterministic mnemonic-backed key management (default 24 words).
- Network bootstrap: auto-assigned P2P/API ports, seed sharing, and header-first sync.

## PQC at-rest model (Kyber + AES-256)
Atho uses a hybrid lockbox model for wallet keys at rest:

- AES-256-GCM encrypts the wallet secret payload (Falcon private key parts + mnemonic material).
- A random DEK (data-encryption key) performs payload encryption.
- The same DEK is wrapped two ways:
  - password path: Argon2id-derived KEK + AES-256-GCM wrap for normal unlock UX,
  - PQ path: Kyber KEM wrap for post-quantum recovery/backup unlock flow.

Why this is a full-stack PQC direction:
- Falcon covers signing/verification on-chain.
- Kyber covers key encapsulation for at-rest key recovery material.
- AES-256-GCM provides fast authenticated symmetric encryption for large payloads.

In short: Falcon secures signatures, Kyber secures DEK recovery path, AES secures data at rest.

See also:
- [Docs/KeyManager.md](Docs/KeyManager.md)
- [Docs/WhitePaper.md](Docs/WhitePaper.md)

## Key facts & parameters
- **Signature scheme:** Falcon-512 (post-quantum).
- **Addressing:** Base56 addresses derived from hashed public keys (HPK); CLI and wallet display Base56.
- **Mnemonic keys (current):** new keys default to `atho-mnemonic-v1` (SHA3-512 based) with 24 words by default; 12/24/48-word generation and deterministic recovery are supported.
- **Transaction policy unit:** canonical `vsize` (SegWit-style weight/vsize model) is used for fee and size admission, not raw JSON byte length.
- **Witness wire encoding:** `signature`/`pubkey` are canonical base64 on wire; legacy hex witness wire is disabled by default.
- **Block time target:** `120` seconds (~2 minutes; consensus constants in `Src/Utility/const.py`).
- **Block limits:** max block base size is `2,500,000` bytes (2.5 MB), with max block weight `10,000,000`.
- **Difficulty adjust:** every `360` blocks on mainnet/testnet using an interval-based weighted-median estimator (oldest 25% weight=1, middle 25% weight=2, newest 50% weight=4), with fixed-point consensus math and clamp factors `0.60..1.85`.
- **Emissions (current):** five fixed pre-tail eras (`10 -> 5 -> 2.5 -> 1.25 -> 0.625`, each `1,314,000` blocks), then transition reward `0.3125 ATHO/block` until subsidy emission reaches `29,950,000 ATHO`; bootstrap allocation is `50,000 ATHO` at block `1` for `30,000,000 ATHO` total pre-tail base. Tail starts at height `20,942,000` (~year `79.7`). Tail issuance is `65,700 ATHO/year`.
- **Fees/Burn (current):** fee floor `225 atoms/vB` (`2.25e-7 ATHO/vB`), minimum tx fee `150,000 atoms` (`0.000150000 ATHO`), dust `250 atoms`. Post-tail target split is `100% burn / 0% miner fee share`, clipped by a hard supply floor at `21,000,000 ATHO`.
- **Inflation/Deflation regime:** protocol net post-tail change is utilization-dependent; under current constants the deflation threshold is `~55.56%` sustained block-byte utilization.
- **Storage:** LMDB for blocks (`blockchain_storage/BlockData/full_block_chain.lmdb`), UTXO (`utxo.lmdb`), mempool; consensus write guards.
- **P2P:** Length-prefixed JSON over TCP; commands include `ping`, `getheight/tip_hash`, `getheaders`, `getblock(s)`, `tx`, `inv`, `getdata`, `getseeds`. Default P2P is 56000 (runnode and Docker); override via env if needed.
- **APIs:** FastAPI secured by API key + user/pass; optional HMAC; localhost/HTTPS enforcement toggles; endpoints for wallet, tx, chain, validation, storage, network/peers, mining, and network hashrate telemetry. Wallet admin API now includes mnemonic recovery and key bundle import/export routes.
- **CLI:** `Src/GUI/cliui.py` talks to the API (headers: X-API-Key/X-User/X-Pass). Displays wallet addresses in Base56 and supports `wallet new [12|24|48]`, `wallet recover`, `wallet import`, `wallet export`, and `wallet send`.
- **GUI + Explorer:** `Src/GUI/gui.py` provides desktop wallet/node controls and launches the browser-based Web Explorer (`Src/GUI/web_explorer.html`) through a local authenticated bridge.
- **Launcher:** `Src/Main/runnode.py` auto-assigns free P2P/API ports (base P2P 56000) and writes them to `Src/Config/NodePorts.json`; can start full/miner/wallet nodes or all.
- **Optimization status:** canonical compact tx wire format + canonical `vsize` policy sizing + incremental miner template build + mempool revision-gated refresh + multiprocess PoW workers + lean block relay are active.
- **Timestamp safety:** median-time-past (`MTP_WINDOW=13`) and future-drift (`MAX_TIME_DRIFT=120` seconds) checks are enforced on both verifier and direct chain-accept paths to reduce timestamp-manipulation risk.

## Architecture (high-level)
- **Nodes:**  
  - Full node: validates blocks/tx, syncs, serves P2P, optional API.  
  - Miner node: mines blocks + full-node validation/P2P, optional API.  
  - Wallet/API node: serves the secured HTTP API only.  
- **Consensus/validation:** BlockManager/TxManager, TransactionVerifier; consensus write contexts around block/UTXO/mempool writes. Header-first sync worker to fetch headers/blocks.  
- **Storage:** LMDB-backed stores for blocks, UTXO, mempool with compact JSON encoding and Decimal-safe serialization.  
- **Wallet/keys:** Falcon-512 keys with mnemonic-first generation (`mnemonic_v1`), deterministic recovery paths, Base56/HPK handling, label metadata, optional encryption/export, and signing/verification endpoints.  
- **Security:** API key + user/pass required globally; optional HMAC; rate limiting per IP on P2P; localhost/HTTPS enforcement defaults to on (disabled by runnode for local use).

## Running the network (summary)
- Create venv, install deps, generate API key (auth.py), and launch nodes with `runnode.py` (option 4 “all” or single nodes). Ports are auto-assigned and saved to `Src/Config/NodePorts.json`.
- Use `cliui.py` to interact (reads `Api_Keys.json` and `NodePorts.json`, prompts for password if needed). Override API target with `ATHO_API_URL`.
- Full quickstart is in [Docs/quickstart.md](Docs/quickstart.md) (setup, auth, node launch, CLI, troubleshooting).

## Run GUI (one click)
- macOS: `./run_gui.command`
- Linux/macOS shell: `./run_gui.sh`
- Windows: `run_gui.bat`

## Package and preserve this exact copy
- Create a timestamped portable package (source layout + launchers):
  - `./scripts/make_prealpha_package.sh --with-venv`
  - default production payload excludes `Src/Test/`; use `--with-tests` only when needed
  - optional cleanup: `--prune-unused-icons` (prunes unreferenced icon assets in payload copy)
- Build alpha GUI binary artifacts (per-OS, host-native):
  - `./scripts/build_release_binaries.sh`
- Build/sign/verify release checksums:
  - `./.venv/bin/python Src/Main/checksum.py build --root <release_payload_dir> --out <release_payload_dir>/checksums.sha256`
  - `./.venv/bin/python Src/Main/checksum.py sign --checksums <...>/checksums.sha256 --key-json <falcon_key.json> --release <version>`
  - `./.venv/bin/python Src/Main/checksum.py verify --checksums <...>/checksums.sha256 --signature <...>/checksums.sha256.sig.json --root <release_payload_dir>`
- Packaging guide:
  - [Docs/Packaging.md](Docs/Packaging.md)

## Build/Runtime prerequisites
- Python 3.9+, `pip install -r requirements.txt` (ensure `numpy` installs; activate venv).
- `requirements.txt` now includes runtime + packaging deps used by this repo:
  - API/node stack (`fastapi`, `uvicorn`, `lmdb`, `cryptography`, `pydantic`, `requests`)
  - GUI stack (`kivy`, `kivymd`, `pillow`, `qrcode`, `psutil`, `opencv-python`)
  - docs/charts (`matplotlib`)
  - packaging (`pyinstaller`, `setuptools`, `wheel`)
- Falcon CLI binary must match host OS/arch and should be installed in `Src/Falcon/Binaries/<platform_tag>/` (runtime falls back to legacy `Src/Falcon/Falcon/falcon_cli`):  
  - macOS: Xcode CLT (`xcode-select --install`), chmod +x; rebuild with clang if needed.  
  - Linux: `build-essential`, `cmake`, `libssl-dev`; ensure arch matches.  
  - Windows: Prefer WSL with build-essential/cmake/libssl-dev; native via MSYS2/MinGW-w64 or VS Build Tools + CMake (or use prebuilt binary).
- After building Falcon, register the host binary and print pin values:
  - `./.venv/bin/python Src/Falcon/Falcon/install_platform_binary.py`

## Security & disclaimers
- Experimental software; no warranties/guarantees; provided “as is.”
- Protect `Src/Config/Api_Keys.json` (`chmod 600`); use strong passwords; rotate keys; enable HMAC if exposed.
- Falcon CLI pinning is strict on `mainnet`/`testnet`; keep `FALCONCLI_PINNED_VERSION_DIGESTS` updated for the active consensus version.
- If exposing HTTP, run behind TLS/reverse proxy; bind to localhost otherwise.
- P2P is unauthenticated/plain TCP by design; control exposure with firewalls/ports.

## Documentation
All docs live in `Docs/`. Start with the index, then go straight to the section you need.

Essential starting points:
- [Docs/README.md](Docs/README.md) – condensed docs map.
- [Docs/quickstart.md](Docs/quickstart.md) – fastest setup/run flow.
- [Docs/Troubleshooting.md](Docs/Troubleshooting.md) – common setup/runtime fixes.
- [Docs/ONBOARDING.md](Docs/ONBOARDING.md) – developer setup and code flow.

Protocol + architecture:
- [Docs/WhitePaper.md](Docs/WhitePaper.md)
- [Docs/Consensus.md](Docs/Consensus.md)
- [Docs/Tx.md](Docs/Tx.md)
- [Docs/Emissions.md](Docs/Emissions.md)
- [Docs/Inflation_Deflationary.md](Docs/Inflation_Deflationary.md)
- [Docs/Threat.md](Docs/Threat.md)

Operations + runtime:
- [Docs/ApiAuth.md](Docs/ApiAuth.md)
- [Docs/LMDB.md](Docs/LMDB.md)
- [Docs/Binaries.md](Docs/Binaries.md)
- [Docs/Packaging.md](Docs/Packaging.md)
- [Docs/Node_Stop.md](Docs/Node_Stop.md)
- [Docs/Docker.md](Docs/Docker.md)

Reference docs:
- [Docs/Falcon512.md](Docs/Falcon512.md)
- [Docs/Sha3-384.md](Docs/Sha3-384.md)
- [Docs/Base56.md](Docs/Base56.md)
- [Docs/KeyManager.md](Docs/KeyManager.md)
- [Docs/gui.md](Docs/gui.md)
- [Docs/SRC_FILE_MAP.md](Docs/SRC_FILE_MAP.md)

Whitepaper artifacts:
- [Docs/Atho_Complete_Whitepaper.pdf](Docs/Atho_Complete_Whitepaper.pdf)
- [Docs/Atho_Core_Whitepaper_Compact.pdf](Docs/Atho_Core_Whitepaper_Compact.pdf)
- [Docs/falcon Docs.pdf](<Docs/falcon Docs.pdf>)

Apache 2.0 – see file headers and `LICENSE` if present.
