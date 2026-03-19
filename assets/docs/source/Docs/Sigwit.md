# Atho SegWit + Throughput Reference (Updated)

Status: Alpha documentation snapshot (2026-03-12).

This document explains how witness data is handled, how block/tx size is measured, and how to estimate TPS from real chain data.

## Canonical limits
From `Src/Utility/const.py`:
- `MAX_BLOCK_SIZE_BYTES = 2,500,000` (base-byte ceiling)
- `MAX_BLOCK_WEIGHT = 10,000,000`
- `MAX_TRANSACTION_SIZE_BYTES = 250,000` (applied as max tx `vsize`)
- `WITNESS_SCALE_FACTOR = 4`

## Witness model
- Witness fields:
  - top-level `signature`, `pubkey`, `witness`
  - per-input `script_sig`
- Base transaction:
  - witness removed at top-level
  - `inputs[].script_sig` blanked
- Hashing:
  - `txid` = no-witness hash
  - `wtxid` = full hash
- Block commitment:
  - block header carries `witness_commitment` when witnesses are present

## Wire encoding
- Witness `signature` and `pubkey` are canonical base64 on wire.
- Internal verification uses decoded hex/bytes.
- Legacy hex witness wire is disabled by default (`WITNESS_WIRE_ALLOW_HEX_LEGACY = False`).

## Exact size formulas
- `weight = base_bytes * 3 + total_bytes`
- `vsize = ceil(weight / 4)`

`vsize` is the canonical policy metric for:
- tx fee floor,
- tx size acceptance,
- mempool admission,
- miner selection.

## Why logs show multiple size fields
Transaction logs include:
- `size_bytes` (canonical `vsize` used by fee policy),
- `size_base_bytes`,
- `weight`,
- `vsize` (same policy value as `size_bytes`).

So for policy/TPS planning, use `vsize`.

## Consensus size vs relay payload size
- `vsize`/`weight` drives fee policy and block admission.
- Separate relay optimizations (for example lean block wire payloads that omit export-only fields like `tx_list_full`) improve propagation latency but do not change consensus tx `vsize`.
- For TPS/capacity math, always use consensus tx `vsize`, not transport JSON byte counts from relay wrappers.

## TPS formula
Let:
- `B = 2,500,000` (effective vbytes per block ceiling from weight/base caps)
- `T = block interval in seconds`
- `F = packing factor` (use `0.95` for practical estimate)
- `S = average non-coinbase tx vsize`

Then:
- `TPS ~= (B * F) / (T * S)`

## Production vs dev timing
- Production planning target: `T = 120s`.
- Some dev runs use shorter block intervals for testing. TPS scales linearly with `1/T`.

## Observed tx shapes (2026-03-07 logs)
- `1 in / 2 out`: `vsize=1371`
- `3 in / 2 out`: `vsize=1646`
- `16 in / 2 out`: `vsize=3428`
- `31 in / 2 out`: `vsize=5483` (older pre-cleanup sample was `10012`)

Estimated practical TPS at `T=120`, `F=0.95`:
- `1371 vB` -> `~14.44 TPS`
- `1646 vB` -> `~12.02 TPS`
- `3428 vB` -> `~5.77 TPS`
- `5483 vB` -> `~3.61 TPS`

## Verify from your own chain
Use your transaction log or exported blocks and compute:
1. average non-coinbase `vsize`,
2. observed average block interval,
3. observed TPS over a recent window.

Always publish all three together (size, interval, TPS) to avoid misleading comparisons.

