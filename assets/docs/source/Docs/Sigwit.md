# Atho SegWit Sizing and Throughput Reference

Date: 2026-03-27

This document describes how Atho computes size/weight and how to estimate TPS.

## 1) Active Limits
From `Src/Utility/const.py`:
- `MAX_BLOCK_SIZE_BYTES = 2,500,000`
- `MAX_BLOCK_WEIGHT = 10,000,000`
- `MAX_TRANSACTION_SIZE_BYTES = 250,000` (policy `vsize` cap)
- `WITNESS_SCALE_FACTOR = 4`

## 2) Metric Definitions
- `weight = base_bytes * 3 + total_bytes`
- `vsize = ceil(weight / 4)`

Atho fee and admission logic uses canonical `vsize`.

## 3) How Base vs Witness Is Counted
Base view:
- top-level witness fields removed,
- input `script_sig` blanked for no-witness form.

Total view:
- includes witness payload.

Sizing implementation:
- `Src/SigWit/sigwit.py::SegWit.sizes_bytes`
- binary codec length is used when available.

## 4) Throughput Formula
Let:
- `Bv = 2,500,000` effective vbytes per block cap,
- `T = 120` seconds,
- `F` = packing factor (`0.95` for conservative planning),
- `Savg` = avg non-coinbase tx `vsize`.

Then:
- `TPS ~= (Bv * F) / (T * Savg)`

## 5) Current Reference Sizes
Current representative estimates (compressed witness, no metadata):
- `1 in / 1 out`: ~513 vB
- `1 in / 2 out`: ~566 vB
- `2 in / 2 out`: ~615 vB
- `3 in / 2 out`: ~664 vB
- `4 in / 2 out`: ~713 vB

## 6) TPS Bands (F=1.0 and F=0.95)
Using `T=120`:
- `566 vB`: `36.8 TPS` ideal, `35.0 TPS` at `F=0.95`
- `615 vB`: `33.9 TPS` ideal, `32.2 TPS` at `F=0.95`
- `664 vB`: `31.4 TPS` ideal, `29.8 TPS` at `F=0.95`

## 7) Key Interpretation
There is no single static network tx size. Real capacity depends on tx mix and utilization.

For planning:
1. measure rolling `Savg` from your own blocks,
2. measure real utilization,
3. recompute TPS from these formulas.
