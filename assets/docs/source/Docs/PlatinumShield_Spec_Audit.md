# Platinum Shield Spec Audit (Code Alignment)

Last updated: 2026-04-05

## Scope Audited
- migrated checklist content into `Docs/PrivateTx_v3.md` / `Docs/PrivateTx_v3.pdf`
- condensed companion published at `Docs/PrivateTx_v3_Condensed.md` / `Docs/PrivateTx_v3_Condensed.pdf`
- migrated into `Docs/PrivateTx_v3.md` / `Docs/PrivateTx_v3.pdf`
- migrated into `Docs/PrivateTx_v3.md` / `Docs/PrivateTx_v3.pdf`
- migrated into `Docs/PrivateTx_v3.md` / `Docs/PrivateTx_v3.pdf`
- Runtime and consensus code paths under `Src/Transactions`, `Src/Main`, `Src/Miner`, `Src/Storage`, `Src/Wallet`, `Src/Accounts`, `Src/ZKSTARK`.

## Remediation Completed (Items 1-7)

1. Merkle mismatch rejection hardening:
- Miner now canonicalizes txids for all candidate transactions during final block assembly before witness commitment and PoW persistence.
- Verifier now recomputes Merkle root from canonical txids directly in verifier path.
- Files: `Src/Miner/miner.py`, `Src/Main/blockveri.py`.

2. Version semantics cleanup:
- Private version detector now includes product-v1 major (`1`) in addition to compatibility majors.
- Proof statement now carries explicit `private_product_v1_activity` while preserving compatibility aliases.
- Docs now describe v1 as active production line and v5 naming as compatibility alias.
- Files: `Src/Utility/const.py`, `Src/Transactions/private_layer.py`, `Src/ZKSTARK/scripts/private_layer_stark_bridge.py`, `Docs/PlatinumShield_Privacy.md`.

3. Private tx version detection consistency:
- `Constants.is_private_tx_version()` updated to include major `1`, preventing split-path policy checks.
- File: `Src/Utility/const.py`.

4. API recipient x-address ergonomics:
- API now derives `recipient_x_address` from `recipient_bundle` when omitted.
- API rejects explicitly provided x-address when it does not match bundle hash.
- File: `Src/Api/apis.py`.

5. Consensus-level recipient binding strictness for product-v1:
- Product-v1 outputs now require both `recipient_bundle_hash` and `recipient_x_address` in private output parsing.
- File: `Src/Transactions/private_layer.py`.

6. Deterministic bundle migration gap:
- Added deterministic readiness audit API in key manager.
- Added explicit safe migration routine for random legacy bundles with no note-state history.
- File: `Src/Accounts/key_manager.py`.

7. Coverage and regression additions:
- Added/updated tests for canonical merkle helper, product-v1 version detection, strict recipient binding, auto-derived x-address bundle flow, deterministic bundle readiness/migration.
- Files: `tests/test_private_layer_pipeline.py`, `tests/test_key_manager_private_layer_materials.py`.

## Checklist Crosswalk (Private Layer)

All 25 checklist points remain implemented in codebase. Additional verification pass confirms:
- deterministic Falcon note-seed derivation and identifier-independent master seed path are active;
- private note store/nullifier/anchor enforcement is active in mempool and block validation;
- private root and proof fields are carried in block data and gated fail-closed;
- wallet receive scan path uses 4-byte view tag fast-check and validates bundle/x-address metadata;
- replay separation remains network-domain bound for private commitments/signatures.

Primary implementation references:
- `Src/Transactions/private_layer.py`
- `Src/Main/txveri.py`
- `Src/Main/consensus.py`
- `Src/Storage/private_notes_store.py`
- `Src/Storage/mempool.py`
- `Src/Wallet/private_receive.py`
- `Src/Wallet/private_spend.py`
- `Src/Accounts/key_manager.py`

## Validation Run

Executed after patching:
- `python3 -m unittest tests.test_private_layer_pipeline tests.test_key_manager_private_layer_materials`
- `python3 -m unittest discover -s tests`
- `python3 -m py_compile` on all modified source/test files

Result:
- all tests passed.
- modified modules compile without syntax errors.

## Additional Production Alignment Notes (2026-04-10)

The remediation summary above is now aligned with the current production policy baseline used across docs and constants. The most important operational point is that private-layer validation is not treated as optional enrichment; it is part of the fail-closed consensus path when product-v1 private flow is active.

Current policy-adjacent constants that matter for private-layer runtime behavior:
- standard tx confirmations: `10`,
- private tx confirmations: `10`,
- coinbase maturity: `150`,
- fee floor: `500 atoms/vB`,
- BPoW bond requirement: `25 ATHO` with activation at `25` confirmations.

These values influence wallet visibility timing, note maturity interpretation, and mempool/user expectations around when outputs become practically spendable.

## Residual Risk Tracking

Residual risks are mostly operational rather than algorithmic in this revision stage:
- incorrect binary deployment or stale hash metadata,
- inconsistent API/client assumptions about private note maturity windows,
- partial rollout where one environment updates policy docs but not runtime constants.

Recommended controls:
1. run strict binary pin mode in production-like environments,
2. include private-flow regression tests in pre-release CI,
3. publish a synchronized policy snapshot in release notes,
4. verify `Src/Utility/const.py` invariants and docs in same review cycle.

## Audit Follow-Up Cadence

Suggested cadence for this audit document:
- update after every private-layer consensus-affecting patch,
- update after any transaction version activation/schedule changes,
- include test command outputs and commit references for reproducibility.

This keeps the audit trail usable by external reviewers who need to confirm that narrative claims remain consistent with active implementation and runtime policy.
