# Mnemonic Recovery Audit (2026-03-09)

Status: Alpha documentation snapshot (2026-03-12).

This audit documents the final sandbox verification pass for mnemonic recovery and key consistency.

## Scope

- Validate deterministic mnemonic recovery behavior on mainnet key records.
- Resolve false-positive CLI warning:
  - `API reported non-canonical recovery mode. Restart node/API and retry.`
- Harden API boolean parsing for wallet recovery payloads.
- Add key-file reliability controls (schema validation, backup-on-write, file locking).
- Add explicit recovery audit logs with canonical recovery metadata.
- Run regression tests and a 100-check key consistency matrix.

## Code updates applied

- `Src/GUI/cliui.py`
  - Recovery result messaging now treats known non-canonical overflow source (`auto_assigned_overflow`) as informational.
  - This removes false restart guidance when recovery correctly resolves an existing additional key (for example `miner_3`).
- `Src/Api/auth.py`
  - Added `_coerce_bool(...)` for strict boolean parsing of JSON payload values.
  - Updated `/wallet/recover_mnemonic` and `/wallet/export` to use `_coerce_bool(...)` instead of raw `bool(...)`.
- `Src/Accounts/key_manager.py`
  - Added strict key-file schema validation.
  - Added lock-protected save/load behavior (`<key_file>.lock`).
  - Added rolling backup-on-write snapshots under `Keys/backups/`.
  - Added support for `ATHO_KEY_MANAGER_KEY_FILE` env override (useful for isolated integration tests/sandboxes).
- `Src/Api/apis.py`
  - Added structured wallet recovery audit logging:
    - `logs/.../wallet/wallet_recovery_audit.log`
    - includes timestamp, network, identifier, source, canonical flag.
- `Src/Test/test_wallet_mnemonic_security.py`
  - Added regression test:
    - `test_cli_existing_overflow_key_does_not_show_restart_warning`
  - Added schema/backup/locking safety tests.
- `Src/Test/test_wallet_api_e2e_integration.py`
  - Added API integration test covering:
    - create -> recover -> restart -> recover -> export -> import
    - signature sign/verify checks
    - key identity continuity (same HPK/Base56)

## Sandbox validation results

## 1) Mnemonic/security regression suite

Command:

```bash
.venv/bin/python -m unittest Src.Test.test_wallet_mnemonic_security -v
```

Result:

- `20` tests run
- `20` passed
- `0` failed

## 2) Compile check (edited files)

Command:

```bash
PYTHONPYCACHEPREFIX=/tmp/pycache .venv/bin/python -m py_compile Src/Api/auth.py Src/GUI/cliui.py
```

Result:

- Pass (no syntax/compile errors).

## 3) Lockbox encryption/relock suite

Command:

```bash
.venv/bin/python -m unittest Src.Test.test_wallet_lockbox -v
```

Result:

- `4` tests run
- `4` passed
- includes auto-relock timer policy validation (`unlock_ttl_seconds`).

## 4) 100-point key consistency matrix (mainnet)

Matrix focus:

- structure/integrity checks on `Keys/KeyManager_Public_Private_Keys.json`
- per-miner checks on:
  - role/network/source/version metadata
  - mnemonic phrase/text/words/meta consistency
  - private key part parity (`F/f/G/g`) between `private_key` and `cli_private_key`
  - uniqueness of HPK and Base56 address

Result:

- `CHECKS_TOTAL=100`
- `CHECKS_PASSED=100`
- `CHECKS_FAILED=0`

## 5) Combined wallet suite

Command:

```bash
.venv/bin/python -m unittest Src.Test.test_wallet_mnemonic_security Src.Test.test_wallet_lockbox Src.Test.test_wallet_api_e2e_integration -v
```

Result:

- `36` tests run
- `35` passed
- `1` skipped (`wallet_api_e2e` can be skipped in restricted sandbox due local socket bind policy)

## 6) Security remediation follow-up (same date)

Applied remediations for the lockbox security audit findings:

- plaintext backup leakage:
  - encrypted migration no longer emits new plaintext `pre_write` backup,
  - encrypted save path purges existing plaintext-secret backups under `Keys/backups/`.
- plaintext mnemonic sidecar leakage:
  - enabling encrypted-at-rest lockbox now removes plaintext files in `Keys/mnemonic_recovery/...`.
- unlock session persistence:
  - API refresh now uses key-file fingerprint caching so unchanged files do not reset unlock state.
- unlock brute-force controls:
  - per-client backoff + lockout on repeated `/wallet/unlock` failures.
- KDF parameter bounds:
  - Argon2id metadata is now range-validated to prevent resource-exhaustion unlock payloads.
- in-memory unlock secret:
  - migrated to mutable bytes with zeroization on lock/expiry.
- Kyber wrapper trust boundary:
  - external lib path loading now opt-in (`ATHO_KYBER_ALLOW_EXTERNAL_LIB=1`); default is trusted vendored path only.
- Kyber lockbox requirement:
  - wallet lockbox now requires Kyber DEK wrapping for encrypted-at-rest payloads.
  - Kyber opt-out requests are rejected.
- Advanced unlock mode:
  - wallet now supports `unlock_mode=advanced`, which requires Kyber unlock `.txt` bundle import plus password at unlock.
  - bundle schema is strict (`athokey-kyber-unlock-v1`) with integrity hash + binding checks; tampered files are rejected.
- unlock status metadata:
  - absolute key-file path hidden by default.

## Operational note

- Local Python runtime prints:
  - `urllib3 ... NotOpenSSLWarning ... LibreSSL 2.8.3`
- This warning is environment/runtime related and did not block recovery, tests, or API behavior.
- Sandbox note:
  - full socket-bind integration execution may be skipped in restricted sandboxes;
  - in unrestricted localhost runtime, `Src.Test.test_wallet_api_e2e_integration` was executed and passed.

