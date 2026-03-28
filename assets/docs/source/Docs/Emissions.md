# Atho Emissions and Fee Routing Policy

Date: 2026-03-27

This document defines active monetary policy and fee routing under current consensus constants.

## 1) Accounting Units
- All consensus accounting is integer-atom based.
- `1 ATHO = 1,000,000,000 atoms`.

## 2) Reward Schedule (Current)
- Block time target: `120` seconds.
- Blocks/year: `262,800`.
- Era size: `1,314,000` blocks (5 years).

Pre-tail eras:
- Era 1: `10.0 ATHO/block`
- Era 2: `5.0 ATHO/block`
- Era 3: `2.5 ATHO/block`
- Era 4: `1.25 ATHO/block`
- Era 5: `0.625 ATHO/block`

Transition:
- `0.3125 ATHO/block` until exact subsidy emission reaches `29,950,000 ATHO`.
- One-time bootstrap allocation: `50,000 ATHO` at block `1`.
- Total pre-tail base target = `29,950,000 + 50,000 = 30,000,000 ATHO`.

Tail:
- Tail reward `0.25 ATHO/block` from height `20,942,000` onward.
- Tail activation occurs at `~79.7 years` from genesis (roughly `80 years`).
- Tail annual issuance: `65,700 ATHO/year`.

## 3) Active Fee Policy
Current constants:
- `FEE_PER_BYTE_ATOMS = 225` (policy unit is `vsize`)
- `MIN_TRANSACTION_FEE_ATOMS = 100,000`
- `DUST_LIMIT_ATOMS = 250`
- Max block base cap: `2,500,000` bytes
- Max block weight: `10,000,000`

Fee routing:
- `20%` of total fees route to consensus pool.
- Remaining `80%` are routed through burn/miner split logic.
- At tail, routed non-pool fees are burn-targeted (`100%` burn policy), clipped by supply-floor headroom.

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
- `Bv = 2,500,000` effective vbytes per block cap
- `T = 120` seconds
- `Savg = average non-coinbase tx vsize`

Then:
- `tx_per_block = Bv / Savg`
- `TPS = tx_per_block / T`

Examples:
- `Savg=566` -> `~36.8 TPS`
- `Savg=615` -> `~33.9 TPS`
- `Savg=664` -> `~31.4 TPS`

## 6) Post-Tail Net Supply Math
At full block utilization by vbytes:
- Total fee floor capacity per block = `2,500,000 * 225 = 562,500,000 atoms = 0.5625 ATHO`
- Annual total fees at full utilization = `147,825 ATHO/year`
- Burnable routed share (`80%`) at full utilization = `118,260 ATHO/year`

Post-tail net annual change:
- `Delta_supply = 65,700 - (118,260 * utilization)`

Deflation threshold:
- `utilization ~= 65,700 / 118,260 ~= 0.5556` (`55.56%`)

Interpretation:
- `<55.56%` utilization: inflationary net.
- `=55.56%`: neutral net.
- `>55.56%`: deflationary net (subject to floor clipping).

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
