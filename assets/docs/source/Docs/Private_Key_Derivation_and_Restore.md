# Private Key Derivation, Kyber Security Boundary, and Wallet Restore

Date: 2026-04-05

This document answers four operator-critical questions from the current codebase:
- What is still missing in the private transaction flow?
- Is the Kyber implementation secure, and can it be "unbreakable"?
- How Falcon keys and wallet addresses are recreated from mnemonic import.
- What exactly is restored from mnemonic alone vs what requires additional key material.

Primary code anchors:
- `Src/Accounts/mnemonic.py`
- `Src/Accounts/key_manager.py`
- `Src/Falcon/deterministic_keygen.py`
- `Src/Accounts/falconcli.py`
- `Src/Accounts/kybercli.py`
- `Src/Utility/private_bundle.py`
- `Src/Wallet/private_spend.py`
- `Src/Wallet/private_receive.py`
- `Src/Api/apis.py`

## 1) Direct Answers

### 1.1 Is the seed where mnemonic phrases come from?
No.

Current implementation flow is:
1. entropy is generated first (`generate_mnemonic` -> `secrets.token_bytes(...)`).
2. mnemonic words are encoded from entropy + checksum (`entropy_to_mnemonic`).
3. seed is then derived from mnemonic + optional passphrase (`derive_seed`, PBKDF2-HMAC-SHA3-512).

So mnemonic does not come from seed in this code path. Seed comes from mnemonic.

### 1.2 Can mnemonic import recreate all private addresses/notes exactly?
For wallets created under current code paths: yes for both public identity and private receive bundle identity.

`get_or_create_private_bundle(...)` now derives Kyber seed deterministically by default:
- `seed_source = mnemonic_v1` when mnemonic metadata/path is available,
- `seed_source = falcon_root_v1` fallback when mnemonic metadata is absent (derived from Falcon root key material).

Practical consequence:
- mnemonic restore recreates Falcon/public identity as before,
- private bundle/x-address can also be regenerated deterministically from the same key path/material,
- legacy wallets that already persisted `seed_source=random` remain a caveat (see section 4.2).

### 1.3 Is Kyber "audited and impossible to break"?
It is not correct to claim "cannot be broken."

What can be stated from code audit:
- there are meaningful hardening controls (hash pinning, trusted binary path checks, strict byte-length validation, deterministic bundle-binding checks),
- but this is not equivalent to a formal cryptographic audit proving unbreakability,
- security remains conditional on implementation quality, binary integrity, platform hardening, and future cryptanalysis.

### 1.4 How does wallet recreation work after key import?
Deterministic recreation for Falcon/public identity works if all derivation inputs match:
- mnemonic phrase,
- mnemonic passphrase,
- PBKDF2 iteration count,
- network,
- account,
- role,
- index.

If those match, `add_key_from_mnemonic` derives same Falcon key and same role-derived addresses.

Private-layer recreation needs extra material (Kyber private key and note journal state), described below.

## 2) Mnemonic -> Seed -> Falcon -> Address Pipeline

## 2.1 Mnemonic generation and validation
`Src/Accounts/mnemonic.py` enforces a deterministic scheme:
- allowed word counts: 12, 24, 48,
- checksum over entropy uses SHA3-512,
- input normalization uses Unicode NFKD and lowercase canonicalization,
- unknown words and checksum mismatch are rejected.

## 2.2 Seed derivation
`derive_seed(...)` uses PBKDF2-HMAC-SHA3-512 with:
- default iterations: 600,000,
- minimum enforced iterations: 100,000,
- salt prefix: `atho-mnemonic-v1` + user passphrase.

This returns 64-byte seed material.

## 2.3 Falcon leaf seed derivation
`derive_falcon_seed(...)` uses HKDF-like extract/expand over the seed and path context:
- network (mainnet/testnet/regnet),
- account,
- role,
- index,
- scheme/domain labels.

`add_key_from_mnemonic(...)` then calls `FalconCLI.keygen(seed_hex=...)`, producing deterministic Falcon key material for that path.

## 2.4 Address derivation
After Falcon public key is generated, `KeyManager` derives role-separated addresses (`regular`, `bond`, `stake`) deterministically from public key + network policy.

This is why public identity is recoverable with mnemonic import.

## 3) Private Layer Derivation Model

## 3.1 Private receive bundle (recipient identity)
`get_or_create_private_bundle(...)` builds recipient bundle bytes as:
- `version || falcon_public_key || kyber_public_key`.

It then computes:
- `bundle_hash = sha3_384(bundle_bytes)`,
- `x_address = "X" + base56(bundle_hash_bytes)`.

Current deterministic key source order:
1. mnemonic path context (`mnemonic_v1`) when available,
2. Falcon-root deterministic fallback (`falcon_root_v1`) for legacy/imported records missing mnemonic metadata,
3. random generation only as a legacy compatibility fallback when deterministic derivation is unavailable.

## 3.2 Outgoing private note seed derivation
For private sends, `reserve_private_note_seed(...)`:
- loads/stores `private_note_state` (`account`, `next_counter`),
- derives a master seed via `_derive_private_note_master_seed(...)`,
- derives note seed via `derive_note_seed(master_seed, account, counter, network)`,
- increments counter atomically in key file.

Current master-seed derivation mixes:
- network,
- identifier string,
- Falcon public key,
- Falcon private components (`f,g,F,G`).

This provides deterministic per-wallet stream progression, but identifier is part of the domain.

## 3.3 Note construction
`PrivateSpendBuilder.build_private_output_bundle(...)` performs:
1. deterministic Falcon note key generation from note seed,
2. Kyber encapsulation to recipient Kyber public key,
3. recipient id derivation from shared secret,
4. note commit derivation,
5. AES-GCM encryption of seed payload,
6. private output assembly with recipient binding fields.

## 4) What Is Recreated On Wallet Import

## 4.1 Recreated by mnemonic-only import
If same derivation inputs are used, import recreates:
- Falcon private/public key,
- hashed public key / base56 address,
- derived role addresses.

## 4.2 Not recreated by mnemonic-only import
Mnemonic-only import still does not inherently recreate:
- local private note journal metadata (`private_notes` state cache),
- prior `private_note_state.next_counter` unless retained in key storage,
- historical *legacy-random* Kyber private bundle identity if that wallet was created before deterministic bundle derivation and cannot be safely migrated.

## 4.3 Required artifacts for full private restore
For full private continuity, you need one of:
- encrypted key backup that includes private-layer secret payloads,
- current key file carrying `private_layer_secret` and private note state,
- Kyber unlock material where wallet encryption mode externalizes Kyber secret wraps.

Without old Kyber secret, old incoming private payloads targeted to a legacy random bundle remain undecryptable.

## 5) Kyber Security Audit Summary (Code-Level)

This is an implementation audit summary, not a mathematical proof.

## 5.1 Positive controls present
- Kyber wrapper enforces known key/ciphertext sizes by level (512/768/1024).
- Shared library loading prefers trusted project binary directories.
- Binary pin verification is wired through `binarypin.verify_binary_or_raise(...)` with required mode support.
- Private bundle parser performs strict structure/length validation and x-address hash binding.
- Private output parser enforces recipient x-address <-> bundle hash consistency.
- Private receive scanner verifies recipient id/view tag/commit consistency before accepting recovered note.

## 5.2 Material limitations observed
- No system can honestly claim "cannot be broken".
- This audit did not include external formal verification of Kyber C source, compiler outputs, or side-channel resistance under hostile local execution.
- Security depends on correct pin registry operation and deployment hygiene.
- If operators bypass pinning policies in environment configuration, trust assumptions weaken.

## 5.3 Falcon/Kyber integration boundary
The private protocol depends on both:
- Falcon deterministic key generation/signing correctness,
- Kyber encapsulation/decapsulation correctness.

A fault in either path can break privacy recovery or spendability. Current code has checks and tests, but still requires operational controls and regression testing per release.

## 6) Private Flow Gaps Still Missing (Current)

From this code audit, the largest remaining limitations are:

1. Legacy-random bundle history still needs explicit migration/backups.
Current code can safely auto-migrate only low-risk records (no private-note history / no reserved counters). Active legacy random histories still require old private-layer secret artifacts.

2. Full private restore still depends on chain scan completion.
Deterministic key recreation is now available, but funds recovery still requires replay/scan of chain private outputs and successful note journal reconciliation.

3. External cryptographic assurance remains an operational requirement.
Implementation hardening exists, but this is not a formal proof of unbreakability.

## 7) Current Test Evidence

Environment execution result in this audit run:
- command: `python3 -m unittest tests.test_private_layer_pipeline tests.test_key_manager_private_layer_materials`
- result: `Ran 39 tests ... OK`

Note: `pytest` was unavailable in this environment (`No module named pytest`), so unittest path was used.

## 8) Production Guidance

For production-grade private continuity today:
- treat mnemonic/path metadata as the primary deterministic recovery scope for Falcon + Kyber identity,
- preserve encrypted key backups for legacy random-era compatibility and local metadata continuity,
- enforce binary pinning in all production nodes,
- avoid identifier drift for deterministic private note stream continuity,
- run private-layer regression tests on every release artifact.

Legacy random-era wallets still require explicit migration/backups until all historical private identities are moved to deterministic seed sources.

## 9) Implementation Worklist (Recommended)

1. Wire `PrivateReceiveScanner` into a canonical block processing path so inbound private notes are recovered and persisted automatically.
2. Add explicit restore modes:
- public-only (mnemonic),
- full-private (mnemonic + kyber/private-layer artifacts),
- strict deterministic restore checks.
3. Expand explicit migration tooling for legacy random bundle histories with operator preview/rollback.
4. Add integration tests for cross-device restore scenarios and historical private-note spend after restore.
