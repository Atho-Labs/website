# Atho Emissions and Fee Routing Policy

Date: 2026-04-04

This document defines active monetary policy and fee routing under current consensus constants.

## 1) Accounting Units
- All consensus accounting is integer-atom based.
- `1 ATHO = 1,000,000,000 atoms`.

## 2) Reward Schedule (Current)
- Block time target: `120` seconds.
- Blocks/year: `262,800`.
- Era size: `1,000,000` blocks (~3.805 years).

Pre-tail eras:
- Era 1: `50 ATHO/block`
- Era 2: `25 ATHO/block`
- Era 3: `12.5 ATHO/block`
- Era 4: `6.25 ATHO/block`
- Era 5: `3.125 ATHO/block`
- Era 6: `1.5625 ATHO/block`
- Era 7: `0.78125 ATHO/block`
- Era 8: `0.390625 ATHO/block`

Bootstrap and pre-tail totals:
- One-time bootstrap allocation: `390,625 ATHO` at block `1`.
- Pre-tail subsidy target: `99,609,375 ATHO`.
- Total pre-tail base target = `99,609,375 + 390,625 = 100,000,000 ATHO`.

Tail:
- Tail reward `0.1953125 ATHO/block` from height `8,000,000` onward.
- Tail activation occurs at `~30.44 years` from genesis.
- Tail annual issuance: `51,328.125 ATHO/year`.

## 3) Active Fee Policy
Current constants:
- `FEE_PER_BYTE_ATOMS = 250` (policy unit is `vsize`)
- `MIN_TRANSACTION_FEE_ATOMS = 100,000`
- `DUST_LIMIT_ATOMS = 250`
- Max block base cap: `3,500,000` bytes
- Max block weight: `14,000,000`

Fee routing:
- Pre-tail: `40%` of total fees route to consensus pool (`20%` miner bucket, `20%` stake bucket).
- Post-tail: `50%` of total fees route to consensus pool (`25%` miner bucket, `25%` stake bucket).
- At tail, routed non-pool fees (`50%`) are burn-targeted (`100%` burn policy), clipped by supply-floor headroom.

Supply floor:
- Effective circulating supply is clipped to never go below `21,000,000 ATHO`.

## 4) No Fixed Base Transaction Size Assumption
Atho does **not** use one static tx size for economics or TPS planning. Real size depends on:
- input/output counts,
- varint widths,
- witness lengths,
- optional metadata.

Representative estimates (compressed witness, metadata empty):
- `1 in / 1 out`: ~513 vB
- `1 in / 2 out`: ~566 vB
- `2 in / 2 out`: ~615 vB
- `3 in / 2 out`: ~664 vB

## 5) Throughput Formulas
Let:
- `Bv = 3,500,000` effective vbytes per block cap
- `T = 120` seconds
- `Savg = average non-coinbase tx vsize`

Then:
- `tx_per_block = Bv / Savg`
- `TPS = tx_per_block / T`

Examples:
- `Savg=566` -> `~51.5 TPS`
- `Savg=615` -> `~47.4 TPS`
- `Savg=664` -> `~43.9 TPS`

## 6) Post-Tail Net Supply Math
At full block utilization by vbytes:
- Total fee floor capacity per block = `3,500,000 * 250 = 875,000,000 atoms = 0.875 ATHO`
- Annual total fees at full utilization = `229,950 ATHO/year`
- Burnable routed share (`50%`) at full utilization = `114,975 ATHO/year`

Post-tail net annual change:
- `Delta_supply = 51,328.125 - (114,975 * utilization)`

Deflation threshold:
- `utilization ~= 51,328.125 / 114,975 ~= 0.4464` (`44.64%`)

Interpretation:
- `<44.64%` utilization: inflationary net.
- `=44.64%`: neutral net.
- `>44.64%`: deflationary net (subject to floor clipping).

## 7) Coinbase Invariants
Consensus payout invariants:
- `coinbase_outputs_sum_atoms == block_reward_atoms + fees_miner_atoms`

When fee routing is active, blocks carry auditable fields:
- `fees_total_atoms`
- `fees_miner_atoms`
- `fees_burned_atoms`
- `fees_pool_atoms`
- `cumulative_burned_atoms`

## 8) Consensus Change Reminder
Changing any of the following is consensus-breaking and requires coordinated upgrade:
- reward schedule,
- tail reward,
- fee uplift/routing percents,
- burn split and floor,
- fee constants,
- atom denomination.
