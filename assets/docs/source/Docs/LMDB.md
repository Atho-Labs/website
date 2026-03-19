# LMDB Storage Overview

Status: Alpha documentation snapshot (2026-03-12).

This describes how Atho uses LMDB for chain, UTXO, mempool, orphan handling, and state checkpoints. Paths and knobs are driven by `Constants` (see `Src/Utility/const.py`).

## Database layout and paths
- Root: `blockchain_storage/<NETWORK_FOLDER>/` (network-specific).
- Main environments (`Constants.DATABASES`):
  - `full_block_chain.lmdb` — BlockStore (blocks by height/hash).
  - `utxo.lmdb` — UTXOStore.
  - `mempool.lmdb` — MempoolStore.
  - `orphan_blocks.lmdb` — orphan/side-branch staging (OrphanReorgManager).
- Additional LMDB:
  - `blockchain_storage/BlockData/state_hashes.lmdb` — StateTracker Merkle accumulator.
- Map sizes/bounds:
  - Initial sizes: `BLOCKSTORE_MAP_SIZE`, `UTXO_MAP_SIZE`, `MEMPOOL_MAP_SIZE`, `STATE_MAP_SIZE`, `ORPHAN_MAP_SIZE`.
  - Per-store rollover ceilings: `BLOCKSTORE_MAX_MAP_SIZE`, `UTXO_MAX_MAP_SIZE`, `MEMPOOL_MAX_MAP_SIZE`, `STATE_MAX_MAP_SIZE`, `ORPHAN_MAX_MAP_SIZE`.
- Global controls: `LMDB_MAX_READERS`, `AUTO_RESIZE_LMDB`, `LMDB_GROWTH_FACTOR`, `LMDB_MIN_GROWTH_STEP_BYTES`, `LMDB_ROLLOVER_ALERT_THRESHOLD`, `LMDB_RESIZE_RETRY_ATTEMPTS`.
- Runtime logging: `LMDB_STATUS_LOG_INTERVAL_SECONDS` rate-limits memory-pressure logs while a store is near its rollover threshold.

## Rollover model
- Atho does not shard a single logical store across multiple LMDB environments yet.
- In current code, "rollover" means bounded LMDB map growth: when a write hits `lmdb.MapFullError`, the store asks `Src/Storage/lmdbutils.py` for the next map size and grows the existing environment.
- Growth is store-specific and stops at that store's configured `*_MAX_MAP_SIZE`.
- Once a store reaches its max map size, writes stop auto-growing and the node logs `lmdb_map_limit_reached`. At that point you must raise the configured ceiling or archive/prune data.
- While a store is near the rollover threshold, the node emits `lmdb_memory_status` log entries with `used_bytes`, `free_bytes`, `utilization_percent`, and the next planned map size.
- Those LMDB memory events are also written to `logs/<network>/storage/lmdb_memory.log` so storage pressure is preserved even if terminal log filtering is enabled.
- Stores expose `lmdb_status()` and the aggregate checker in `Src/Storage/dbcheck.py` reports `used_bytes`, `free_bytes`, `utilization_percent`, `near_rollover`, and `next_map_size`.

## BlockStore (Src/Storage/blockstorage.py)
- Keys:
  - `blk:h:<height>` → compact JSON block.
  - `blk:x:<hash>` → compact JSON block.
  - `blk:t:<txid>` → tx location index payload (`block_height`, `block_hash`, `tx_index`).
  - `meta:blk:txindex_ready` → tx-index readiness marker.
- Serialization: `to_compact/from_compact("Block", ...)`; Decimal/bytes serialized via custom JSON hook.
- Writes: `put_block` enforces network, normalizes `index`/`height`, merges witness info, prunes witnesses for old blocks based on retention, and writes both height/hash keys in one LMDB txn. Optional guard `ENFORCE_CONSENSUS_WRITE` requires `consensus_write_context`.
- Tx index maintenance is in the same LMDB write transaction as block writes and deletes so tx lookup stays consistent with chain state.
- Persistent witness pruning: `compact_pruned_witnesses()` now rewrites eligible old block records so witness maps and `tx_list_full` payloads are actually removed from disk as the tip advances.
- Reads: `get_by_height/get_by_hash` expand compact, prune witnesses in-memory if past retention window, and attach full txs/witnesses for display.
- Fast tx lookup: `get_tx_location(txid)` and `get_tx_by_id(txid)` use `blk:t:*` first; legacy backward scan is retained as a compatibility fallback.
- Startup backfill: when `TX_INDEX_AUTO_BACKFILL=true` (default), BlockStore backfills missing `blk:t:*` entries once and marks `meta:blk:txindex_ready=1`.
- Tip tracking: `latest_height` scans `blk:h:` keys and validates stored index matches height.
- Resizing: `put_block` retries writes and uses the shared rollover helper. `lmdb_status()` reports remaining headroom.
- Integrity log: `_append_chain_hash` writes cumulative SHA3-384 header chain to `logs/<network>/state_hashes.log`.

## UTXOStore (Src/Storage/utxostorage.py)
- Environment: `Constants.DATABASES["utxo"]`.
- Keys:
  - Primary: `utxo:<txid-bytes>:<vout>` (record JSON).
  - Secondary address index: `utxoaddr:<canonical_hpk>:<txid>:<vout>` (points to primary key).
  - Index-ready marker: `meta:utxoaddr:index_ready`.
- Operations: list by address, get/spend/apply_block. Write-heavy paths run through a bounded retry wrapper so `MapFullError` triggers rollover growth up to the configured UTXO ceiling.
- Address lookup now uses a prefix scan on `utxoaddr:*` when index is ready (`O(utxos_for_address)`), with legacy full-scan fallback while index is not ready.
- Index maintenance is done in the same LMDB write transaction on put/spend/unspend/delete/apply/revert paths.
- Backfill: `UTXOStore.backfill_address_index()` can rebuild secondary keys for existing datasets and then mark `meta:utxoaddr:index_ready=1`.
- Optional safety compare: `UTXO_ADDR_INDEX_SHADOW_COMPARE` runs indexed + legacy lookup and logs mismatch. `UTXO_ADDR_INDEX_RETURN_LEGACY` can force returning legacy results on mismatch.
- Consensus guard: uses `utxostorage.consensus_write_context` (mirrors BlockStore pattern) when called from consensus.
- Amounts stored as Decimal-friendly strings; locking/spent flags persisted. Addresses are canonicalized to HPK at write boundaries.
- Diagnostics: `lmdb_status()` exposes current map utilization and next growth step.

## MempoolStore (Src/Storage/mempool.py)
- Environment: `Constants.DATABASES["mempool"]`.
- Keys:
  - `tx:<txid>` for raw tx JSON
  - `mempool:confirmed:<txid>` tombstones
  - `mempool:meta:revision` cross-process refresh marker
  - in-memory UTXO reservation index map
- Features: add/remove tx, list pending, rebuild UTXO index from LMDB on startup, tombstone confirmed txs.
- Runtime performance path: hot API reads use RAM snapshots/counters (`transactions`, `_ram`, `_total_size_bytes`, `_total_fees`) instead of full LMDB scans.
- Cross-process coherence path: readers call `_maybe_refresh_from_lmdb()` and skip full rebuilds when `mempool:meta:revision` is unchanged.
- Internal write helpers retry on `MapFullError` and grow the mempool map within its configured ceiling.
- Consensus writes: use `mempool.consensus_write_context` when invoked from `ConsensusSupervisor.accept_tx/accept_block`.
- Diagnostics: `lmdb_status()` reports utilization and rollover readiness.

## Orphan/side-branch storage (Src/Blockchain/orphreorgs.py)
- Environment: `blockchain_storage/BlockData/orphan.lmdb` (network-specific via `Constants.DATABASES["orphan_blocks"]` when set).
- Stores orphan/side-branch blocks for later reorg consideration. Orphan writes retry with the shared rollover helper and stop at `ORPHAN_MAX_MAP_SIZE`.
- Reorg application rewinds/applies UTXO using stored branches.

## State checkpoint LMDB (Src/Main/state.py)
- Environment: `blockchain_storage/BlockData/state_hashes.lmdb`.
- Stores leaves `leaf:<height>` with payload {height, block_hash, leaf, state_root, chain_hash, status}. State root is a Merkle accumulator over `(height:block_hash)` leaves (SHA3-384).
- State leaf writes retry with the shared rollover helper. Auto-growth is controlled by `STATE_LMDB_GROWTH_FACTOR` and capped by `STATE_MAX_MAP_SIZE`.

## Non-LMDB telemetry persistence (network hashrate)
- Network hashrate aggregation is intentionally file-based JSON/JSONL (not LMDB):
  - `logs/<network>/network/network_hashrate_live.json`
  - `logs/<network>/network/network_hashrate_state.json`
  - `logs/<network>/network/network_hashrate_history.jsonl`
- This data powers `/network/hashrate*` API responses and chart windows.

## Concurrency and safety
- LMDB readers are many; writers are single per environment. Code opens envs with `max_readers` from `Constants`.
- Consensus guards (`consensus_write_context`) prevent accidental writes when `ENFORCE_CONSENSUS_WRITE` is enabled.
- Write operations catch `lmdb.MapFullError` and optionally roll the map up to the next configured size; if `AUTO_RESIZE_LMDB` is off or the store is already at its ceiling, callers must enlarge the configured map size manually.
- Pruning: witness data can be pruned in persisted blocks based on retention (`WITNESS_*` constants); reads may return pruned witness maps for old heights.
- Important LMDB behavior: pruning frees pages for reuse by future writes, but it does not shrink the already-allocated `map_size`. If you want a smaller file footprint after heavy pruning, you need an explicit LMDB compaction/export step.

## Operational tips
- Use `python3 Src/Storage/dbcheck.py` to inspect all LMDB stores and see how close each one is to rollover.
- If a store reports `near_rollover`, raise that store's `*_MAX_MAP_SIZE` before it reaches the ceiling.
- If you hit `MapFullError`, check whether the store already reached its `*_MAX_MAP_SIZE`; if so, raise the limit or prune/archive data before retrying.
- Backups: stop writers, copy the LMDB directory (env is a few files). Avoid copying while writes are in flight unless you use LMDB’s `copy()` API (not wrapped here).
- Permissions: ensure `blockchain_storage/...` is writable by the node user; map sizes allocate virtual space, not immediate disk, but plan for growth.
- For debugging, inspect `logs/<network>/state_hashes.log`, `logs/<network>/pow/adjustments.log` (difficulty), and `logs/<network>/consensus/consensus.log` for consensus actions touching LMDB-backed stores.

