# Atho LMDB Storage Overview

Date: 2026-04-09

This document defines which LMDB stores are consensus-critical vs local/runtime
state, and why each store exists.

## 1) Database Root
Root path:
- `blockchain_storage/<network>/`

Configured in:
- `Src/Utility/const.py` (`Constants.DATABASES`)

## 2) Store Classification

### Consensus-Critical Stores (network state)
These stores are replayed/validated from canonical blocks and directly affect
validation outcomes.

- `full_block_chain*.lmdb`
  - Code: `Src/Storage/blockstorage.py`
  - Role: canonical block bodies, tx location index, tip metadata.
  - Consensus impact: highest.

- `utxo*.lmdb`
  - Code: `Src/Storage/utxostorage.py`
  - Role: spendable output set + apply/unspend markers.
  - Consensus impact: highest.

- `private_notes*.lmdb`
  - Code: `Src/Storage/private_notes_store.py`
  - Role: shielded note set, nullifier sets, Merkle tree nodes, anchor roots.
  - Consensus impact: highest for private tx validity.

- `bond*.lmdb`
  - Code: `Src/Storage/bondstake.py`
  - Role: bond lock state machine, miner eligibility linkage.
  - Consensus impact: high (bonded mining checks).

- `stake*.lmdb`
  - Code: `Src/Storage/bondstake.py`
  - Role: stake lock state machine + network totals used by staking logic.
  - Consensus impact: high (staking constraints/rewards).

- `payout_journal*.lmdb`
  - Code: `Src/Storage/bondstake.py`
  - Role: deterministic payout idempotency/event history.
  - Consensus impact: high for safe replay/reorg payout behavior.
  - Why it is required:
    - prevents duplicate payouts across retries/restarts,
    - preserves ordered payout transitions (`pending -> submitted -> confirmed`),
    - enables deterministic reprocessing after crashes/reorg windows.

### Local Runtime/Propagation Stores
Important for networking and performance, but not canonical chain truth.

- `mempool*.lmdb`
  - Code: `Src/Storage/mempool.py`
  - Role: pending tx propagation, fee/ranking indexes, tombstones.
  - Canonical source remains accepted blocks, not mempool records.

- `orphan_blocks*.lmdb`
  - Code: `Src/Blockchain/orphreorgs.py`
  - Role: orphan/side-branch staging for bounded reorg handling.
  - Becomes canonical only when blocks are accepted into block store.

## 3) Runtime Deletion/Recovery Expectations

- Deleting a consensus store while node is running is unsafe by default.
- Current hardening behavior:
  - LMDB begin paths detect missing backing paths,
  - affected stores attempt environment recovery/reopen,
  - consensus code still treats missing/corrupt required state as validation
    failure rather than accepting uncertain state.
- Operational recommendation:
  - stop node before manual DB deletion unless intentionally testing recovery.

## 4) Map Growth / Rollover
Atho uses bounded LMDB map growth:
- on `MapFullError`, stores may grow map size (if enabled),
- growth is capped by per-store limits,
- near-limit pressure is logged.

Important:
- LMDB page reuse does not shrink map size automatically.
- pruning/cleanup frees pages for reuse but does not compact file size.

## 5) Operational Checks
- Inspect store health:
```bash
python3 Src/Storage/dbcheck.py
```
- Watch logs for map pressure and recovery events.
- Increase max map size before sustained high-write load if near limits.

## 6) Related Files
- `Src/Storage/lmdbutils.py`
- `Src/Storage/blockstorage.py`
- `Src/Storage/utxostorage.py`
- `Src/Storage/private_notes_store.py`
- `Src/Storage/mempool.py`
- `Src/Storage/bondstake.py`
- `Src/Blockchain/orphreorgs.py`

## 7) Production Operating Guidance

For long-running production-like nodes, treat LMDB behavior as part of reliability engineering, not just storage internals. Recommended baseline:
- monitor map usage growth trends, not only absolute map size,
- alert before `LMDB_ROLLOVER_ALERT_THRESHOLD` is reached,
- snapshot/backup before planned store maintenance,
- keep store path ownership and permissions explicit per deployment user.

When migrating hosts, copy complete store sets together (`block`, `utxo`, `private_notes`, `bond`, `stake`, `payout_journal`) so state-machine relationships remain consistent. Partial copies can produce hard-to-debug replay inconsistencies.

## 8) Policy Snapshot Context

Storage behavior supports active policy constants but does not define them. Current production policy references used by upper layers include:
- tx confirmations `10`, private tx confirmations `10`, coinbase maturity `150`,
- fee floor `500 atoms/vB`,
- tail start `17,000,000`, supply floor `21,000,000 ATHO`.

Keeping storage docs synchronized with these values helps operators reason about expected maturity and accounting behavior in persisted state.
