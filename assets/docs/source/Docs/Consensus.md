# Consensus Overview

Status: Alpha documentation snapshot (2026-03-15).

This document explains Atho’s consensus logic, how blocks/transactions are validated, how PoW/difficulty and rewards are enforced, and where the code lives. File references are relative to repo root.

## Core constants and parameters (Src/Utility/const.py)
- Network: `Constants.NETWORK` (`mainnet`/`testnet`/`regnet`), address prefixes, block/tx size/weight limits, witness policy, time drift, checkpoint depth.
- Hard size limits: `MAX_BLOCK_SIZE_BYTES = 2,500,000` (2.5 MB base bytes), `MAX_BLOCK_WEIGHT = 10,000,000`, `MAX_TRANSACTION_SIZE_BYTES = 250,000`.
- Supply: `_reward_atoms` schedule → `Constants.get_block_reward(height)`; current pre-tail issuance target is `30,000,000 ATHO`, tail starts at height `21,102,000` (`0.25 ATHO`).
- Burn/floor: post-tail fee split target is 0% miner / 100% burn (floor-clipped), with a `21,000,000 ATHO` supply floor enforced by burn clipping.
- Fees: `FEE_PER_BYTE_ATOMS`, `MIN_TRANSACTION_FEE_ATOMS`, `DUST_LIMIT_ATOMS`, `TXID_EXCLUDE_FIELDS`, `TXID_INCLUDE_PUBKEY`.
- Current fee/dust constants:
  - `FEE_PER_BYTE_ATOMS = 200`
  - `MIN_TRANSACTION_FEE_ATOMS = 187,500`
  - `DUST_LIMIT_ATOMS = 5`
- Current production retarget constants:
  - `TARGET_BLOCK_TIME = 120`
  - `DIFFICULTY_ADJUSTMENT_INTERVAL = 360`
  - ratio clamps: `0.60 .. 1.85` (`MIN_DIFFICULTY_FACTOR`, `MAX_DIFFICULTY_FACTOR`)
  - timestamp guards: `MTP_WINDOW = 13`, `MAX_TIME_DRIFT = 120`
  - confirmation policy: `TX_CONFIRMATIONS_REQUIRED = 10`, `COINBASE_MATURITY_BLOCKS = 400`
- Difficulty bounds: `MIN_DIFFICULTY`, `MAX_DIFFICULTY`; target validation uses these in block verification.

## How block size works (end-to-end)
- Canonical limits are defined in `Src/Utility/const.py`:
  - `MAX_BLOCK_SIZE_BYTES = 2,500,000`
  - `MAX_BLOCK_WEIGHT = 10,000,000`
  - `MAX_TRANSACTION_SIZE_BYTES = 250,000`
- During mining/template build (`Src/Miner/miner.py`), candidate transactions are selected with both per-tx and per-block byte caps in mind before PoW starts.
- Block byte size is computed from canonical compact JSON serialization in `Block.to_dict()` / `_calc_size_from_std()` (`Src/Blockchain/block.py`) and stored as `size_bytes`.
- On validation (`Src/Main/blockveri.py`), a block is rejected if either:
  - `Constants.block_weight_ok_from_obj(...)` fails, or
  - `size_bytes > MAX_BLOCK_SIZE_BYTES`.
- `ConsensusSupervisor.accept_block` (`Src/Main/consensus.py`) also enforces that each included transaction is at or below `MAX_TX_SIZE_BYTES` before full acceptance.
- Practical result: both caps are active; whichever limit is reached first rejects the block.

## Runtime optimization path (non-consensus semantics)
These changes improve liveness and throughput behavior without changing core monetary/cryptographic rules:

- Miner tx-in-chain checks use tx index fast path (`block_store.get_tx_location`) before fallback scans.
- Miner template assembly is revision-cached and incrementally sized (running payload accounting) instead of repeated full-candidate reserialization.
- Mempool readers are revision-gated with `mempool:meta:revision`, reducing unnecessary LMDB rebuild scans across full/miner/wallet processes.
- P2P block relay uses lean payloads (drops export/duplicate fields on wire) and response fitting to message limits.
- API history/recent paths use hard scan caps and cursor pagination to avoid unbounded request-time scans.

## Proof of Work and targets (Src/Miner/pow.py)
- `PowManager.expected_target_for_height` / `expected_target_for_candidate` compute target deterministically from interval statistics at retarget boundaries.
- Mainnet/testnet retarget flow:
  - retarget every `360` blocks,
  - build consecutive block intervals (`dt = ts[i] - ts[i-1]`) from the active window,
  - clamp per-interval times with `RETARGET_INTERVAL_MIN_SECONDS` / `RETARGET_INTERVAL_MAX_SECONDS`,
  - apply weighted-median by recency (`oldest 25% = 1`, `middle 25% = 2`, `newest 50% = 4`),
  - compute ratio using fixed-point integer math (`DIFFICULTY_FACTOR_SCALE`) and clamp it to `0.60..1.85`.
- Consensus math in the active target path is integer/fixed-point (no float ratio multiplication in retarget commit).
- `PowManager.difficulty_to_human_float` (not shown) is used for logging.
- `PowManager` logs adjustments to `logs/<network>/pow/adjustments.log` with before/after targets and human-readable difficulty.
- Blocks carry `target`; validators enforce strict PoW inequality `hash_int < target` and bounds.
- PoW runtime supports multiprocess worker mode with `POW_WORKER_CORES` and `POW_WORKER_NONCE_CHUNK`; worker count is runtime-capped to available CPU cores, and capped/fallback behavior is logged to PoW runtime logs.

## Transaction validation (Src/Main/txveri.py + Src/Transactions/txvalidation.py)
- Shape: `TransactionVerifier` normalizes addresses (`normalize_hpk`), checks structure, network, atom alignment, and duplicates.
- Txid / signing: `signing_message_hex_digest` (SHA3-384) over no-witness body; txid is also SHA3-384 without witness.
- Signatures: `TxValidation._validate_signature` strips witness, recomputes digest, and calls `KeyManager.verify_transaction` (Falcon-512 via CLI, multiple verify strategies). Witness signature stored once at `tx.signature`; inputs do not embed full sig.
- Fees: `required_fee` via size (SegWit vsize) enforces `MIN_TRANSACTION_FEE_ATOMS` and per-vB policy; fee, dust, and output comparisons are performed in atomic units.
- Canonical size metric is `vsize` from `Constants.tx_policy_metrics(...)`. Internal bookkeeping keys (`block_height`, `size*`, `weight`, `vsize`) are stripped before policy sizing to avoid send/mempool/block mismatch.
- Fee accounting strictness: non-coinbase transactions must satisfy `inputs_atoms == outputs_atoms + fee_atoms` exactly (no implicit/unallocated remainder).
- UTXO/double-spend: checks inputs exist, unspent, not locked; mempool conflicts screened.
- Witness wire is strict canonical base64 for `signature`/`pubkey` (legacy hex disabled unless explicitly allowed by constants).
- Input `script_sig` must be canonical `SIG_REF:<16hex>` in signed context; this rule is aligned across send path, mempool, tx validation, and block validation.
- Coinbase: no inputs, one output to miner HPK, amount must match schedule in txvalidation; block-level check enforces exact payout = `base_reward + miner_fee_share`.

## Block validation (Src/Main/blockveri.py)
- Structural: block version must be in the allowed set for the active ruleset at that height, network match, hash length/hex, prev_hash linkage, timestamp not in future and not before parent, height/index consistency.
- Timestamp defense: MTP (`MTP_WINDOW=13`) and future-drift (`MAX_TIME_DRIFT=120`) checks are enforced during block verification.
- Merkle: recomputes Merkle root (SHA3-384) over txids; witness commitment checked if enabled.
- PoW: validates `block.hash` against `block.target` and bounds with strict `< target`; optional expected target via `PowManager.expected_target_for_height`.
- Size/weight: enforces `MAX_BLOCK_SIZE_BYTES`, `MAX_BLOCK_WEIGHT`.
- Coinbase: ensures exactly one coinbase (first tx), output to miner HPK, payout equals `reward(height) + fees_miner`.
- Fee-burn accounting: validates `fees_total_atoms`, `fees_miner_atoms`, `fees_burned_atoms`, and `cumulative_burned_atoms` (required once burn is active).
- Checkpoint lock: prevents replacing blocks deeper than `Constants.CHECKPOINT_INTERVAL_BLOCKS`.
- Logging: writes JSON lines to `logs/<network>/verified_blocks/verified_blocks.log`; `last_error` exposed for callers.

## Consensus gateway/supervisor (Src/Main/consensus.py)
- `ConsensusSupervisor.accept_tx`:
  - Runs runtime guard check first; in enforce mode, rejects with `runtime_guard_violation` when critical runtime drift is detected.
  - Resolve the active placeholder ruleset by height, require tx version in that ruleset's allowed version set, construct `Transaction`, run `TransactionVerifier.verify_transaction`.
  - Enforce hard max transaction size (`MAX_TX_SIZE_BYTES`) before verifier/mempool admission.
  - Enforce fee ≥ required (size-based).
  - Add to mempool under `mempool.consensus_write_context`.
- `ConsensusSupervisor.accept_block`:
  - Runs runtime guard check first; in enforce mode, rejects with `runtime_guard_violation` when critical runtime drift is detected.
  - Resolve the active placeholder ruleset by block height, require block version in the allowed version set, reject configured invalid block hashes, enforce configured checkpoints when present, then run `BlockVerifier.verify_block`.
  - Run full in-block transaction verification (`TransactionVerifier.verify_transactions_in_block`) before state commit; reject block on any tx failure.
  - Enforce that every transaction in the candidate block is at or below `MAX_TX_SIZE_BYTES` (`block_contains_oversize_tx` reject).
  - Emission guard via `EmissionMonitor._process_block` (rejects if coinbase overpays schedule; fees not minted).
  - If not extending tip, pre-store block; delegate to `OrphanReorgManager.handle_block` for side/orphan/reorg handling.
  - Applies block to `blockchain.add_block` when available (updates UTXO/mempool), otherwise stores and optionally `utxo_store.apply_block`.
  - `blockchain.add_block` also enforces timestamp safety (MTP + future drift), so direct chain-accept paths do not depend solely on `BlockVerifier` for time checks.
  - Cleans mempool of confirmed txs; runs `StateTracker` and `EmissionMonitor` best-effort.
- Supervisory loop: `run_loop` periodically verifies tip (and two predecessors), sweeps mempool, and logs the active placeholder consensus policy (ruleset id, label, flags, tighten-only mode) to `logs/<network>/consensus/consensus.log`.

## Chain selection and reorgs
- `OrphanReorgManager` (Src/Blockchain/orphreorgs.py) handles side branches and reorg application (UTXO rewinds/forwards). `accept_block` delegates reorg decisions; on `reorg_failed`, block is rejected.
- Reorg depth is capped by policy (`Constants.max_reorg_depth_blocks()`): if a competing branch requires deeper rollback than allowed, result is `reorg_depth_exceeded` and block acceptance fails.
- Blocks not on tip are stored; future arrivals may trigger reorg.

## State and emission monitoring
- `EmissionMonitor` (Src/Main/emission.py): tracks expected coinbase payout, burned fees, cumulative burned supply, and floor-aware circulating supply; alerts on overpay and floor violations.
- `BurnMonitor` (Src/Main/burn.py): dedicated burn accounting tracker; logs per-block fee split and cumulative burned totals to burn-specific logs/state.
- `StateTracker` (Src/Main/state.py): builds Merkle accumulator over (height, block_hash) leaves; logs to `logs/<network>/State/detailed_state_hashes.log`; uses the same bounded LMDB growth helpers and pressure logging as the other stores; used for divergence checks.

## Addressing and identity
- HPK = SHA3-384(pubkey bytes) hex; internal prefixes `ATHO`/`ATHT`.
- Base56 addresses (Src/Blockchain/base56.py): prefix (`A`/`T`), base56 of HPK bytes, checksum = first 4 bytes of `sha3_256(body)` encoded base56. `normalize_hpk` converts address→HPK for tx building/validation.

## Serialization and hashing
- Canonical txid/signing hash: SHA3-384 over normalized, no-witness JSON (`signing_message_hex_digest`, `canonical_tx_id` in Src/Utility/txdhash.py). Fee serialization is fixed at 9 decimal places, matching atom precision, so new transaction hashes follow the canonical width.
- Merkle: SHA3-384 in `SigWit` and `hash.py`.
- Block hash: computed on block header/body (Block.compute_hash) and checked against PoW target.

## Mempool policy (Src/Storage/mempool.py usage)
- `accept_tx` calls `mempool.add_transaction`; `sweep_mempool` re-verifies pending txs and evicts failures.
- After block acceptance, confirmed txids are removed from mempool.

## Genesis and reward usage
- Genesis creation uses `Constants.get_block_reward(0)` (Src/Blockchain/genblock.py).
- Miner coinbase creation: `Miner.create_coinbase` pays `reward(height)+fees_miner` and carries fee/burn accounting fields into the block (Src/Miner/miner.py).

## Audit notes / risks
- PoW target expectation is best-effort; block carries its own `target`. Ensure `PowManager.expected_target_for_height` aligns with miners or blocks can be accepted with unexpected targets (still bounded by min/max).
- Tail issuance is perpetual, but fee burn starts at tail and is capped by a hard supply floor (`21,000,000 ATHO`).
- The upgrade framework now includes active runtime integrity controls (runtime guard + optional signed manifest checks), but only the baseline ruleset is active until future activation entries are added.
- Signature acceptance allows 1024-hex sigs in verification path; tighten to 2048 if only Falcon-512 is valid.
- Falcon CLI pinning is strict on required networks (`mainnet`/`testnet`) and enforced via `Constants.FALCONCLI_PINNED_VERSION_DIGESTS` (with legacy raw-hash fallback only when explicitly configured).
- Logging is verbose (keys/lengths/previews); reduce in production to limit metadata leakage.
- Temp key file handling during signing is best-effort; consider in-memory signing to avoid disk residue.

## Operational tips
- Run `ConsensusSupervisor.run_loop` (or via node runner) to keep mempool clean and tip verified.
- For diagnostics: `BlockVerifier.verify_full_chain_once()` then `verify_latest_chain_tip()`; `EmissionMonitor.run_once()`; `StateTracker.run_once()`.
- To test PoW/target logic, log `PowManager` adjustments and compare against observed block intervals.
- For live hardening, require signed release checksums and strict binary verification before rollout.
