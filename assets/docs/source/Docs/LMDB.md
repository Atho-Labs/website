# Atho LMDB Storage Overview

Date: 2026-03-27

This document describes active LMDB usage for chain persistence and transaction paths.

## 1) Core Stores
Root path:
- `blockchain_storage/<network>/`

Primary LMDB environments:
- `full_block_chain.lmdb` (block storage + tx location index)
- `utxo.lmdb` (UTXO set)
- `mempool.lmdb` (pending transactions)
- `orphan_blocks.lmdb` (side/orphan branch staging)

## 2) Block Store
Code:
- `Src/Storage/blockstorage.py`

Responsibilities:
- persist blocks by height and hash,
- maintain tx location index,
- provide fast tx lookup,
- support block-add/reorg storage operations under consensus write context.

## 3) UTXO Store
Code:
- `Src/Storage/utxostorage.py`

Responsibilities:
- store spendable outputs,
- indexed lookup by canonical address binding,
- apply/spend/unspend operations during block connect/disconnect,
- provide deterministic read behavior for tx verification.

## 4) Mempool Store
Code:
- `Src/Storage/mempool.py`

Responsibilities:
- persist and index pending txs,
- track confirmed tombstones,
- maintain revision marker for cross-process refresh behavior,
- support consensus-safe add/remove paths.

## 5) Orphan/Reorg Store
Code:
- `Src/Blockchain/orphreorgs.py`

Responsibilities:
- hold side/orphan blocks,
- assist bounded reorg flow when stronger branches appear.

## 6) Map Growth and Rollover Behavior
Atho uses bounded LMDB map growth:
- on `MapFullError`, stores can grow map size (when enabled),
- growth is capped by per-store max map settings,
- near-limit status is logged for operator visibility.

Important:
- LMDB page reuse does not automatically shrink file map size.
- pruning/cleanup frees reusable pages but does not compact map size by itself.

## 7) Operational Checks
- Inspect store health:
```bash
python3 Src/Storage/dbcheck.py
```
- Watch logs for storage pressure and map-limit events.
- If a store reaches max map size, increase configured max before resuming high write load.

## 8) Related Files
- `Src/Storage/lmdbutils.py`
- `Src/Storage/blockstorage.py`
- `Src/Storage/utxostorage.py`
- `Src/Storage/mempool.py`
- `Src/Blockchain/orphreorgs.py`
