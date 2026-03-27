# Atho Transaction Reference (Current)

Date: 2026-03-27

This is the authoritative transaction behavior reference for current development builds.

## 1) Canonical Policy Metric
Atho uses SegWit-style policy metrics:
- `weight = base_bytes * 3 + total_bytes`
- `vsize = ceil(weight / 4)`

`vsize` is used for:
- fee floor checks,
- mempool admission,
- miner packing,
- transaction size policy limits.

Active policy constants:
- fee floor: `225 atoms/vB`
- minimum tx fee: `150,000 atoms`
- tx confirmations required for regular spend visibility: `10`

## 2) Binary Transport Codec
Current serializer emits compact binary payload magic:
- `ATX2` (current)

Decoder accepts:
- `ATX2`
- `ATX1` (legacy decode compatibility)

Code:
- `Src/Transactions/txbinary.py`
- `Src/SigWit/sigwit.py`

## 3) Field Strategy (Compact)
Inputs:
- spend reference: `tx_out_id` (`<96-hex-txid>:<vout>`)
- optional non-zero sequence via bitmap + varint in binary codec
- no full signature embedded per-input

Outputs:
- amount encoded from integer atoms
- destination binding encoded as 48-byte raw HPK digest
- lock flags compacted with bitmap

Witness:
- signature and public key are raw bytes in binary payload
- API/UI wire display remains canonicalized for compatibility/human tooling

## 4) Signature Reference Token
Input `script_sig` is a compact reference token, not a full signature blob.

Current canonical prefix:
- `SR:<16-hex>`

Legacy `SIG_REF:*` acceptance is policy-gated and disabled in current defaults.

## 5) Integer Accounting
Consensus-critical tx value logic uses integer atoms. Display conversion to decimal strings is presentation-only.

Examples:
- `amount_atoms`
- `fee_atoms`
- exact conservation checks in verifier paths

## 6) Witness Size Policy
Current Falcon witness policy bounds:
- signature target ~666 bytes (compressed range accepted by policy)
- canonical public key length 897 bytes
- legacy public key length acceptance is migration-policy controlled

## 7) Why There Is No Single "Base Tx Size"
There is no universal fixed tx size because encoded size varies with:
- input count,
- output count,
- varint widths for values and indexes,
- witness length,
- optional metadata inclusion.

Use measured/derived `vsize` distributions, not one static byte number.

Representative estimates (metadata empty, compressed witness):
- `1 in / 1 out`: ~513 vB
- `1 in / 2 out`: ~566 vB
- `2 in / 2 out`: ~615 vB
- `3 in / 2 out`: ~664 vB
- `4 in / 2 out`: ~713 vB

## 8) Hashing Model
- `txid`: no-witness hash
- `wtxid`: full-transaction hash (with witness)
- Signing digest: deterministic no-witness signing body hash

Hashing and signing internals:
- `Src/Utility/txdhash.py`
- `Src/Transactions/tx.py`
- `Src/Transactions/txvalidation.py`

## 9) Validation Invariants
Transaction acceptance requires:
- valid structure and network identity,
- valid signature over no-witness digest,
- existing/unspent inputs,
- no double spend,
- atom-exact value conservation,
- fee >= required fee from canonical `vsize`.

## 9.1 Role-Aware Lockup Flows (Bond and Stake)
Bonding and staking are represented as normal transaction flows to deterministic role-derived destinations, with additional consensus state handling:
- bond deposit/top-up to bond-derived address,
- stake deposit/top-up to stake-derived address,
- exit/withdraw paths gated by state and height rules.

Consensus rejects malformed or unauthorized role-path interactions, even when base transaction format is otherwise valid.

Key point:
- display addresses can vary by UI form,
- consensus ownership/eligibility checks are driven by deterministic pubkey-derived role digests.

## 10) Practical Throughput Mapping
With `2,500,000` vbytes/block and `120s` block time:
- `566 vB avg` -> `~36.8 TPS`
- `615 vB avg` -> `~33.9 TPS`
- `664 vB avg` -> `~31.4 TPS`

This is why tx-shape distribution directly drives sustained TPS.
