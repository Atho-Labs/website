# Packaging and Runtime Snapshot (Alpha)

Last refresh: 2026-04-10

This guide describes the production packaging workflow for Atho alpha builds. The packaging process keeps repository-relative paths intact, captures a timestamped snapshot, and supports reproducible release verification with checksums and signatures.

## 1) Packaging Goal

The current packaging strategy is intentionally conservative:
- preserve runnable repository structure,
- avoid breaking path assumptions used by runtime modules,
- make release artifacts portable across operators,
- keep a deterministic, timestamped build trail.

This is preferred over aggressive single-binary packaging until all runtime paths are fully migrated to OS-native application data directories.

## 2) Quick Start

From project root:
```bash
chmod +x scripts/make_prealpha_package.sh
./scripts/make_prealpha_package.sh --with-venv
```

Optional Windows executable inclusion:
```bash
./scripts/make_prealpha_package.sh --with-venv --windows-exe /absolute/path/to/AthoAlpha-windows.exe
```

## 3) Build Native Release Binaries First

For multi-OS release binaries and source fallback package:
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

Output roots:
- binary artifacts: `releases/binaries/<UTC_TIMESTAMP>/`
- package snapshot: `releases/Atho-Alpha-<UTC_TIMESTAMP>-p<PID>/`

## 4) Package Content Layout

Inside each package root:
- `Atho-Alpha/` portable project copy,
- tarball archive (`.tar.gz`),
- zip archive (`.zip`) when `zip` tool is available.

Default behavior:
- includes project data and `Keys/` unless excluded,
- excludes `.venv` unless `--with-venv` is set,
- excludes test tree unless `--with-tests` is passed.

## 5) Packaging Options

Useful flags:
```bash
./scripts/make_prealpha_package.sh --without-keys
./scripts/make_prealpha_package.sh --with-tests
./scripts/make_prealpha_package.sh --prune-unused-icons
./scripts/make_prealpha_package.sh --name-prefix Atho-alpha-candidate
./scripts/make_prealpha_package.sh --name-prefix "Atho Alpha"
```

Operational guidance:
- use `--without-keys` for distributable public release bundles,
- use `--with-tests` for internal QA or partner technical review payloads.

## 6) Running Packaged Builds

Inside packaged `Atho-Alpha` folder:
- macOS: `Atho.command`
- Linux: `./run_gui.sh`
- Windows: `run_gui.bat` (prefers packaged `AthoAlpha.exe` when present)

Local working-copy launchers remain available from repository root:
- `./run_gui.command`
- `./run_gui.sh`
- `run_gui.bat`

For foreground debugging:
```bash
ATHO_FOREGROUND=1 ./run_gui.sh
```

Launcher log path:
- `logs/gui/gui_launcher.log`

## 7) Release Integrity Workflow

Generate checksums:
```bash
./.venv/bin/python Src/Main/checksum.py build \
  --root releases/Atho-Alpha-<STAMP>-p<PID>/Atho-Alpha \
  --out releases/Atho-Alpha-<STAMP>-p<PID>/Atho-Alpha/checksums.sha256
```

Sign checksum hash with Falcon key JSON:
```bash
./.venv/bin/python Src/Main/checksum.py sign \
  --checksums releases/Atho-Alpha-<STAMP>-p<PID>/Atho-Alpha/checksums.sha256 \
  --key-json /absolute/path/to/falcon_key.json \
  --release Atho-Alpha-<STAMP>
```

Verify checksums + signature:
```bash
./.venv/bin/python Src/Main/checksum.py verify \
  --checksums releases/Atho-Alpha-<STAMP>-p<PID>/Atho-Alpha/checksums.sha256 \
  --signature releases/Atho-Alpha-<STAMP>-p<PID>/Atho-Alpha/checksums.sha256.sig.json \
  --root releases/Atho-Alpha-<STAMP>-p<PID>/Atho-Alpha
```

Optional pinned expected hash verification:
```bash
./.venv/bin/python Src/Main/checksum.py verify \
  --checksums .../checksums.sha256 \
  --signature .../checksums.sha256.sig.json \
  --root .../Atho-Alpha \
  --expected-checksums-sha256 <expected_sha256_of_checksums_file>
```

## 8) Production Policy Context

Packaging does not alter consensus constants, but release communication should include current policy reference so downstream operators validate against the right profile:
- block target `120s`, retarget `180`,
- tx confirmations `10`, private tx confirmations `10`, coinbase maturity `150`,
- fee floor `350 atoms/vB`, minimum fee `100,000 atoms`.

## 9) Recommended Release Checklist

1. Build native binaries.
2. Validate binary pin metadata.
3. Run smoke tests for node + GUI launch.
4. Create package snapshot.
5. Generate checksums and Falcon signature.
6. Verify artifact integrity on a second machine.
7. Publish release note with expected checksum-file hash.

## 10) Bottom Line

The current Atho packaging flow favors reproducibility and operational reliability over installer-style polish. That tradeoff is intentional for alpha hardening. Until path migration and freeze tooling are fully mature, this repository-preserving packaging strategy remains the safest way to distribute consistent runtime artifacts.
