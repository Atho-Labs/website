# Packaging & Snapshot (Alpha)

Last refresh: 2026-03-27.

## Goal
Create a portable package you can launch directly into the GUI while preserving a timestamped copy of the current project runtime snapshot.

This workflow keeps Atho in its repository layout so existing relative paths continue to work.

## Quick Start

From the project root:

```bash
chmod +x scripts/make_prealpha_package.sh
./scripts/make_prealpha_package.sh --with-venv
```

To include a prebuilt Windows `.exe` in the package:

```bash
./scripts/make_prealpha_package.sh --with-venv --windows-exe /absolute/path/to/AthoAlpha-windows.exe
```

## Build Native Binary Artifacts

To build per-OS GUI binaries (plus source fallback package):

```bash
./scripts/build_release_binaries.sh
```

Examples:

```bash
./scripts/build_release_binaries.sh --with-docker
./scripts/build_release_binaries.sh --linux-only
./scripts/build_release_binaries.sh --macos-only
./scripts/build_release_binaries.sh --windows-only
```

Binary output root:

```text
releases/binaries/<UTC_TIMESTAMP>/
```

Output goes to:

```text
releases/Atho-Alpha-<UTC_TIMESTAMP>-p<PID>/
```

Inside each package:
- `Atho-Alpha/` (portable project copy)
- `Atho-Alpha-<UTC_TIMESTAMP>-p<PID>.tar.gz`
- `Atho-Alpha-<UTC_TIMESTAMP>-p<PID>.zip` (if `zip` exists)

## Run The Packaged Copy

Inside the packaged `Atho-Alpha` folder:
- macOS: double-click `Atho.command`
- Linux: run `./run_gui.sh`
- Windows: run `run_gui.bat` (it uses `AthoAlpha.exe` first if present)

## Keep Or Exclude Sensitive Data

Default package behavior:
- Includes `Keys/` and project data.
- Excludes `.venv` unless `--with-venv` is used.
- Excludes `Src/Test/` (production payload default).

Options:

```bash
./scripts/make_prealpha_package.sh --without-keys
./scripts/make_prealpha_package.sh --with-tests
./scripts/make_prealpha_package.sh --prune-unused-icons
./scripts/make_prealpha_package.sh --name-prefix Atho-alpha-candidate
./scripts/make_prealpha_package.sh --name-prefix "Atho Alpha"
```

## Release checksums and signature

Create checksums, sign the checksum hash, and verify on another machine:

```bash
# 1) Build file checksums for packaged payload
./.venv/bin/python Src/Main/checksum.py build \
  --root releases/Atho-Alpha-<STAMP>-p<PID>/Atho-Alpha \
  --out releases/Atho-Alpha-<STAMP>-p<PID>/Atho-Alpha/checksums.sha256

# 2) Sign checksum hash with Falcon key json (f,g,F,G)
./.venv/bin/python Src/Main/checksum.py sign \
  --checksums releases/Atho-Alpha-<STAMP>-p<PID>/Atho-Alpha/checksums.sha256 \
  --key-json /absolute/path/to/falcon_key.json \
  --release Atho-Alpha-<STAMP>

# 3) Verify checksums + Falcon signature
./.venv/bin/python Src/Main/checksum.py verify \
  --checksums releases/Atho-Alpha-<STAMP>-p<PID>/Atho-Alpha/checksums.sha256 \
  --signature releases/Atho-Alpha-<STAMP>-p<PID>/Atho-Alpha/checksums.sha256.sig.json \
  --root releases/Atho-Alpha-<STAMP>-p<PID>/Atho-Alpha
```

If you publish an expected checksum-file hash with the release note:

```bash
./.venv/bin/python Src/Main/checksum.py verify \
  --checksums .../checksums.sha256 \
  --signature .../checksums.sha256.sig.json \
  --root .../Atho-Alpha \
  --expected-checksums-sha256 <expected_sha256_of_checksums_file>
```

## Local One-Click Launch (Current Working Copy)

From the repository root, you can launch GUI directly with:
- macOS: `./run_gui.command`
- Linux/macOS shell: `./run_gui.sh`
- Windows: `run_gui.bat`

These launchers now start the GUI detached in background so terminal can be closed.
Launcher log path:
- `logs/gui/gui_launcher.log`

To force foreground mode for debugging:

```bash
ATHO_FOREGROUND=1 ./run_gui.sh
```

## Notes
- This is the safest packaging path for current alpha architecture because many modules use repo-relative roots.
- If you want a single binary installer later (`.app`, `.dmg`, `.exe`, `.deb`), first migrate runtime paths (logs/keys/db/config) to OS app-data directories and then freeze with PyInstaller/Briefcase.
