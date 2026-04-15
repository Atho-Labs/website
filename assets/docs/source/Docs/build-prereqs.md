# Atho Build Prerequisites

Date: 2026-04-14

This is the canonical prerequisite matrix for Atho launcher/bootstrap builds.

Use this page when:
- first setting up a machine,
- debugging build/bootstrap failures,
- preparing CI or reproducible dev workstations.

## 0) One-Click Path (Docker-First)

If you want the default path, use this:
- install Docker,
- install Python 3.9+,
- run launcher once.

macOS / Linux:
```bash
git clone <repo-url>
cd <repo-dir>
python3 run.py mainnet
```

Windows (PowerShell):
```powershell
git clone <repo-url>
cd <repo-dir>
py -3 run.py mainnet
```

What this does:
1. Runs launcher bootstrap checks.
2. Uses Docker as builder/export toolchain.
3. Prepares `.venv` runtime dependencies.
4. Starts native runtime/GUI.

## 1) Required on All Platforms

- `git`
- Python `3.9+` with `pip` and `venv`
- Docker:
  - Docker Desktop (Windows/macOS), or
  - Docker Engine (Linux)

## 2) Host-Native Fallback Build Tools

These are required when Docker export is missing host binaries for your platform, or when you manually run native build scripts.

### Windows

Required:
- Windows-native Bash shell:
  - Git Bash, or
  - MSYS2, or
  - Cygwin
- C/C++ toolchain:
  - MSYS2/MinGW `gcc`/`clang`
- Rust toolchain (`cargo`) for private STARK binaries

Optional but recommended:
- LMDB dev package for native UTXO batch checker

Install examples:
- Git Bash: install Git for Windows
- MSYS2 packages:
  - `pacman -S --needed mingw-w64-x86_64-toolchain`
  - `pacman -S --needed mingw-w64-x86_64-lmdb`
- Rust:
  - install `rustup-init.exe`, reopen terminal

Notes:
- WSL bash shim is not accepted for Windows host-native build scripts.
- You can set explicit bash path:
  - `set ATHO_HOST_BASH=C:\Program Files\Git\bin\bash.exe`

### macOS

Required:
- Xcode Command Line Tools (`clang`, `make`, etc)
- Rust toolchain (`cargo`) for private STARK binaries

Optional:
- LMDB for native UTXO batch checker

Install:
```bash
xcode-select --install
brew install lmdb
curl https://sh.rustup.rs -sSf | sh
```

### Linux (Debian/Ubuntu)

Required:
- C/C++ toolchain
- Bash
- Rust toolchain (`cargo`) for private STARK binaries

Optional:
- LMDB dev headers/libs for native UTXO batch checker

Install:
```bash
sudo apt-get update
sudo apt-get install -y bash build-essential clang pkg-config liblmdb-dev
curl https://sh.rustup.rs -sSf | sh
```

### Linux (Fedora/RHEL)

Required:
- C/C++ toolchain
- Bash
- Rust toolchain (`cargo`) for private STARK binaries

Optional:
- LMDB dev headers/libs for native UTXO batch checker

Install:
```bash
sudo dnf install -y bash gcc gcc-c++ clang make pkgconf-pkg-config lmdb-devel rustup
```

### Linux (Arch)

Required:
- C/C++ toolchain
- Bash
- Rust toolchain (`cargo`) for private STARK binaries

Optional:
- LMDB dev headers/libs for native UTXO batch checker

Install:
```bash
sudo pacman -S --needed bash base-devel clang pkgconf lmdb rustup
```

## 3) Quick Verification Commands

Run from terminal:
```bash
python --version
docker --version
docker info
```

If host-native fallback tools are needed:
```bash
bash --version
cc --version
cargo --version
```

## 4) Related Docs

- [quickstart.md](quickstart.md)
- [Docker.md](Docker.md)
- [Troubleshooting.md](Troubleshooting.md)
- [Binaries.md](Binaries.md)
