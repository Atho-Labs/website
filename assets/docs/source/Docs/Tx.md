# Atho Transactions (Current Canonical Behavior)

Status: Alpha documentation snapshot (2026-03-12).

This is the current tx reference for structure, hashing, witness handling, sizing, fee policy, and validation flow.

## Wire format (compact, current)
Top-level fields:
- `tx_id`
- `fee` (fixed 9-decimal string; atom-aligned)
- `timestamp`
- `inputs`
- `outputs`
- `signature` (witness, canonical base64 on wire)
- `pubkey` (witness, canonical base64 on wire)
- `network`
- `coinbase`
- `metadata` (only when non-empty)
- `block_height` (optional metadata field; not consensus payload for fee sizing)

Input fields:
- `tx_out_id` (`<prev_txid>:<vout>`)
- `script_sig` (canonical `SIG_REF:<16hex>`)
- `sequence` (only included when non-zero)

Output fields:
- `amount` (fixed 9-decimal string)
- `hashed_public_key`
- `is_locked` (only included when true)

## Removed redundant wire fields
The wire format no longer depends on older redundant fields:
- input `tx_id`, `index`, `address` duplicates
- output `tx_out_id` payload duplication
- tx `pubkey_size`, `signing_hash`, `signing_hash_mode`
- always-on default flags/fields that can be derived

This materially reduced high-input tx size.

High-input impact:
- each extra input now carries only the spend reference (`tx_out_id`) + compact script reference (`SIG_REF`) plus optional non-zero sequence,
- no duplicated per-input alias fields are emitted on wire.

## Witness encoding
- Internal signing/verification still uses Falcon hex values.
- Wire format uses canonical base64 for `signature` and `pubkey`.
- Decoder is strict canonical base64 (`wire_to_hex(...)`), with legacy hex disabled by default:
  - `WITNESS_WIRE_ALLOW_HEX_LEGACY = False`

## Hashing model
- `txid`: SHA3-384 over no-witness tx (SegWit-style).
- Signing digest: SHA3-384 over deterministic no-witness signing payload.
- `wtxid`: SHA3-384 over full tx (with witness).
- Witness never changes `txid` or signing digest.

## Size and weight model
Canonical metrics are:
- `base_bytes`
- `total_bytes`
- `weight = base_bytes * 3 + total_bytes`
- `vsize = ceil(weight / 4)`

Helper: `Constants.tx_policy_metrics(tx)` returns `(base_bytes, total_bytes, weight, vsize)`.

Policy and consensus sizing both use `vsize` as the canonical fee/limit unit.

Important:
- `size_bytes` in tx logs is the canonical `vsize` used for policy.
- Raw serialized full bytes are reported separately as `total_bytes` in diagnostics when needed.
- For block packing and fee checks, `vsize` is the authoritative metric.

## Fee policy (current constants)
- `FEE_PER_BYTE_ATOMS = 200`
- `MIN_TRANSACTION_FEE_ATOMS = 187,500` (`0.000187500 ATHO`)
- `DUST_LIMIT_ATOMS = 5` (`0.000000005 ATHO`)

Required fee formula:
- `required_fee_atoms = max(vsize * 200, 187500)`

## SIG_REF rule (consistency fix)
`script_sig` is a compact reference only, never a full embedded signature:
- required canonical pattern: `SIG_REF:<16hex>`
- same rule is enforced in send path, mempool validation, tx validation, and block validation

This removed the prior class of “accepted in mempool, rejected in block” SIG_REF mismatches.

## Bookkeeping field exclusion in policy math
`Constants.tx_policy_metrics(...)` strips internal bookkeeping keys before sizing:
- `block_height`
- `size`
- `size_bytes`
- `size_base_bytes`
- `weight`
- `vsize`

This prevents fee drift when non-consensus metadata is attached during pipeline stages.

## Signing flow
1. Build base tx (empty witness/signature refs).
2. Compute no-witness signing digest.
3. Sign via Falcon CLI.
4. Store witness once at tx top-level (`signature`, `pubkey`).
5. Set each input `script_sig = SIG_REF:<txid_prefix>`.
6. Recompute canonical policy metrics and required fee.

## Validation flow
Validation requires:
- canonical tx normalization,
- strict witness decoding (canonical base64),
- canonical SIG_REF on signed inputs,
- txid/signing digest integrity,
- UTXO checks (exists/unspent/unlocked),
- atom-exact accounting,
- fee >= required by canonical `vsize`.

## Recent observed sizes (mainnet dev logs, 2026-03-07)
Accepted examples after optimization:
- `1 in / 2 out`: `vsize=1371`, `base_bytes=674`, `weight=5483`
- `3 in / 2 out`: `vsize=1646`, `base_bytes=937`, `weight=6583`
- `16 in / 2 out`: `vsize=3428`, `base_bytes=2641`, `weight=13711`
- `31 in / 2 out`: `vsize=5483`, `base_bytes=4606`, `weight=21931`

Compared to older 31-input examples (`vsize=10012`), this shows a major reduction from wire cleanup.

## Related code
- `Src/Transactions/tx.py`
- `Src/Transactions/txin.py`
- `Src/Transactions/txout.py`
- `Src/Transactions/txvalidation.py`
- `Src/SigWit/sigwit.py`
- `Src/Utility/const.py`
- `Src/Utility/wirecodec.py`
