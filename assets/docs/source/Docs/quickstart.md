# Atho Node Quickstart

Status: Alpha documentation snapshot (2026-03-12).

This walks you through running a full node, miner node, and wallet/API node, then using the CLI. All auth is secured via API key + user/pass, and ports are auto-assigned to avoid collisions.

This is the fastest setup path. For the full docs map, start at the [documentation index](README.md). For developer-oriented setup, use [ONBOARDING.md](ONBOARDING.md).
If anything fails during setup, check [Troubleshooting.md](Troubleshooting.md) first.

## Prereqs (why you need them)
- Python 3.11+ (or 3.9+) to run nodes and CLI.
- `git` and `curl` for fetching code and checking APIs.
- macOS/Linux/WSL recommended (Windows native works but WSL is smoother for toolchains).
- Prefer containers? See the [Docker guide](Docker.md) for building/running via `docker compose` (full/miner/wallet) as an alternative to local toolchains.
- Hardware guidance: OpenGL 2.0 compatible system, i3-class CPU or better, 4-8 GB RAM minimum, 120 GB SSD recommended.

## 1) Get the code + venv + deps
macOS / Linux / WSL:
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
Why: venv keeps deps isolated; requirements pulls FastAPI/LMDB/requests, etc.
If install fails (especially `lmdb`/`kivy`/`cryptography`), go to [Troubleshooting.md](Troubleshooting.md) -> `Dependency install issues (venv + pip)`.

## 2) Create an API key (required)
```bash
./.venv/bin/python Src/Api/auth.py
```
- Pick a username/password (default user is `atho`). Password set = full permissions; blank password = read-only.
- Writes `Src/Config/Api_Keys.json` (keep private; `chmod 600`).
Why: All API calls (including CLI) require `X-API-Key/X-User/X-Pass` to prevent misuse.

## 2.5) Falcon + Kyber binary/runtime check (important)
Falcon:
- Runtime expects `falcon_cli` for your host platform.
- Install/register current host binary:
```bash
./.venv/bin/python Src/Falcon/Falcon/install_platform_binary.py
```
- If Falcon is missing, build with platform compiler first:
  - macOS: `clang` (Xcode Command Line Tools)
  - Linux: `gcc`/`clang` (`build-essential`)
  - Windows: `MSYS2 MinGW-w64 (gcc)` or Visual Studio Build Tools (`cl`)

Falcon compile commands (full flags):

macOS (Apple Silicon/Intel):
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

Kyber:
- Wallet encryption/decryption paths use vendored Kyber and can auto-build shared libs.
- Ensure a C compiler is installed (`cc`/`clang`/`gcc`) so Kyber build can succeed when first needed.

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

## 3) Join the network (start nodes)
```bash
./.venv/bin/python Src/Main/runnode.py
# choose option 4 to start full + miner + wallet/API (background)
```
- Ports auto-assign and are saved to `Src/Config/NodePorts.json` (P2P base is 56000).
- To point at an existing seed:
  ```bash
  export ATHO_P2P_PORT=56001                 # free port on your machine
  export ATHO_BOOTSTRAP=<seed_ip>:<seed_p2p> # e.g., 56000
  ./.venv/bin/python Src/Main/runnode.py     # choose full or miner
  ```
- Check sync: `tail -f logs/<network>/network/network.log` and look for `handshake_ok` / `sync_progress` with growing tip_height.

## 4) Verify via API (optional but recommended)
```bash
curl -H "X-API-Key:<KEY>" -H "X-User:<USER>" -H "X-Pass:<PASS>" http://127.0.0.1:<full_api_port>/chain/info
```
- Full API port is in `NodePorts.json` (default ~10100). Success shows network, tip height/hash.
- Optional network hashrate telemetry check:
```bash
curl -H "X-API-Key:<KEY>" -H "X-User:<USER>" -H "X-Pass:<PASS>" "http://127.0.0.1:<full_api_port>/network/hashrate/live"
```

## 5) Use the CLI
macOS / Linux / WSL:
```bash
source .venv/bin/activate
./.venv/bin/python Src/GUI/cliui.py
```
Windows (PowerShell):
```powershell
.\.venv\Scripts\Activate.ps1
python Src/GUI/cliui.py
```
- CLI loads `Api_Keys.json` and `NodePorts.json`; prompts for password if not set in env.
- Common commands: `wallet addresses|balance|new [12|24|48]|recover|import|export|send`, `blocks recent|height <n>|hash <hash>|latest|tx <txid>|export500`, `mining start|stop|status`, `system peers`.
- `wallet new` defaults to 24-word mnemonic generation when word count is not provided.

## 6) Launch desktop GUI + Web Explorer (optional)
macOS / Linux / WSL:
```bash
source .venv/bin/activate
./.venv/bin/python Src/GUI/gui.py
```
Windows (PowerShell):
```powershell
.\.venv\Scripts\Activate.ps1
python Src/GUI/gui.py
```
- From the GUI, click the explorer icon to open the browser-based explorer.
- Explorer supports search by block/tx/address and accepts Base56 or HPK address input.
- Explorer runs through a local GUI bridge (`127.0.0.1`, random free port) and proxies to your authenticated node API.

## 6.5) GUI first-run checklist
1. Open GUI.
2. Go to Settings.
3. Set API key, username, password.
4. Open Node tab and start nodes.
5. If miner is not needed, run full + wallet only.

## 6.6) Request inbox workflow (GUI)
- Request inbox UI is currently disabled by default in this alpha build for stability.
- If enabled in code/runtime, the flow is:
  1. Open inbox tab.
  2. Select a request and click `Send`.
  3. Copy requester address.
  4. Paste same address into verify field (must match exactly).
  5. Continue to Send modal (recipient + amount prefilled; amount can be edited).
- The verify step prevents accidental/misdirected sends.

## Common env vars (set before runnode/CLI)
- `ATHO_API_URL` – override API base (CLI target).
- `ATHO_API_KEY`, `ATHO_API_USER`, `ATHO_API_PASS` – avoid prompts.
- `ATHO_P2P_PORT` – set specific P2P port; otherwise auto.
- `ATHO_BOOTSTRAP` – seed list (`ip:port[,...]`) to join existing network.
- `ATHO_API_URL` + `wallet recent` pagination can be used to pull bounded history pages (`limit`/`cursor`) efficiently from the CLI/API.

## Security essentials
- Every API call needs `X-API-Key`, `X-User`, `X-Pass`; keys live in `Src/Config/Api_Keys.json`.
- Local dev: HTTPS off by default; if exposing, run behind TLS/reverse proxy and consider enabling HMAC.
- Protect `Api_Keys.json` and backups; rotate keys/passwords; use read-only keys where possible.
- For release artifact integrity, generate and sign release file checksums:
  - `./.venv/bin/python Src/Main/checksum.py build --root <release_payload_dir> --out <release_payload_dir>/checksums.sha256`
  - `./.venv/bin/python Src/Main/checksum.py sign --checksums <...>/checksums.sha256 --key-json <falcon_key.json> --release <version>`
  - `./.venv/bin/python Src/Main/checksum.py verify --checksums <...>/checksums.sha256 --signature <...>/checksums.sha256.sig.json --root <release_payload_dir>`

## Quick troubleshooting
- Port in use: rerun `runnode.py` (auto-assign) or set a free `ATHO_P2P_PORT`/API port.
- 401/403: wrong/missing headers or missing permissions (`send_tx`, `mining`).
- Stuck tip / `sync_no_headers`: check `ATHO_NETWORK` and `ATHO_BOOTSTRAP`; ensure seed is correct and reachable.
- CLI can’t connect: verify API port in `NodePorts.json`, set `ATHO_API_URL`, ensure API is running.
- `unsupported hash type` during mnemonic keygen: ensure dependencies are installed from `requirements.txt` (`cryptography` provides the SHA3-512 PBKDF2 path on Python builds lacking native support).
- falcon_cli/toolchain pain: use Docker as an easy path:
  ```
  docker compose build
  docker compose up -d fullnode miner miner2   # set ATHO_BOOTSTRAP to your seed if needed
  ```
- GUI node start issues / stale PIDs:
  - list: `./.venv/bin/python Src/Main/stop.py --active`
  - stop all: `./.venv/bin/python Src/Main/stop.py --all`
  - restart from GUI Node tab or via `Src/Main/runnode.py`
- Check live P2P behavior in:
  - `logs/mainnet/network/network.log`
  - look for `peer_connected`, header sync, mempool activity, and block acceptance
- On low-power systems, skip miner and run only full + wallet.

Support: `labs@atho.io`

## What to read next
- [ONBOARDING.md](ONBOARDING.md) for repo layout and developer workflow.
- [ApiAuth.md](ApiAuth.md) for the full auth model.
- [Troubleshooting.md](Troubleshooting.md) if ports, sync, auth, or builds fail.
