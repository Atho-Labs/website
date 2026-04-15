# Atho Emissions and Fee Routing Policy

Date: 2026-04-15

This document defines active monetary policy and fee routing under current consensus constants.

## 1) Accounting Units
- All consensus accounting is integer-atom based.
- `1 ATHO = 1,000,000,000 atoms`.

## 2) Reward Schedule (Current)
- Block time target: `120` seconds.
- Blocks/year: `262,800`.
- Era size: `2,000,000` blocks (~7.61 years).

Pre-tail eras:
- Era 1: `100 ATHO/block`
- Era 2: `50 ATHO/block`
- Era 3: `25 ATHO/block`
- Era 4: `12.5 ATHO/block`
- Era 5: `6.25 ATHO/block`
- Era 6: `3.125 ATHO/block`
- Era 7: `1.5625 ATHO/block`
- Era 8: `0.78125 ATHO/block`

Bootstrap and pre-tail totals:
- One-time bootstrap allocation: `781,250 ATHO` at block `1`.
- Pre-tail subsidy target: `399,218,750 ATHO`.
- Total pre-tail base target = `399,218,750 + 781,250 = 400,000,000 ATHO`.
- Hard max supply cap = `500,000,000 ATHO`.
- Supply-closure check: `399,218,750 + 781,250 + 100,000,000 = 500,000,000`.

Tail:
- Tail reward `0.1953125 ATHO/block` from height `17,000,000` onward.
- Tail activation occurs at `~64.69 years` from genesis.
- Tail annual issuance: `51,328.125 ATHO/year`.

Hard-cap clipping rule:
- Subsidy is clipped at coinbase path by remaining cap headroom.
- Once `total_emitted_atoms` reaches `500,000,000 ATHO`, subsidy is `0` for all later heights.
- Fee routing/burn/pool accounting remains unchanged (fees do not mint new supply).

## 3) Monetary Anchors
Atho uses three monetary anchors:
- `400,000,000 ATHO` base issuance path.
- `500,000,000 ATHO` hard max supply cap.
- `21,000,000 ATHO` protected supply floor.

Design intent:
- Base path controls deterministic launch distribution.
- Max cap bounds long-run mint expansion.
- Floor bounds long-run burn pressure.

## 4) Active Fee Policy
Current constants:
- `FEE_PER_BYTE_ATOMS = 500` (policy unit is `vsize`)
- `MIN_TRANSACTION_FEE_ATOMS = 200,000`
- `DUST_LIMIT_ATOMS = 20,000` (`1/10` of `MIN_TRANSACTION_FEE_ATOMS`)
- Max block base cap: `3,500,000` bytes
- Max block weight: `14,000,000`

Fee routing:
- Pre-tail: `40%` of total fees route to consensus pool (`20%` miner bucket, `20%` stake bucket).
- Post-tail: `55%` of total fees route to consensus pool (`25%` miner bucket, `30%` stake bucket).
- At tail, routed non-pool fees (`45%`) are burn-targeted (`100%` burn policy), clipped by supply-floor headroom.

Supply floor:
- Effective circulating supply is clipped to never go below `21,000,000 ATHO`.

## 5) Throughput Formulas
Let:
- `Bv = 3,500,000` effective vbytes per block cap
- `T = 120` seconds
- `Savg = average non-coinbase tx vsize`

Then:
- `tx_per_block = Bv / Savg`
- `TPS = tx_per_block / T`

## 6) Post-Tail Net Supply Math
At full block utilization by vbytes:
- Total fee floor capacity per block = `3,500,000 * 500 = 1,750,000,000 atoms = 1.75 ATHO`
- Annual total fees at full utilization = `459,900 ATHO/year`
- Burnable routed share (`45%`) at full utilization = `206,955 ATHO/year`

Post-tail net annual change:
- `Delta_supply = 51,328.125 - (206,955 * utilization)`

Deflation threshold:
- `utilization ~= 51,328.125 / 206,955 ~= 0.24802` (`24.802%`)

Interpretation:
- `<24.802%` utilization: inflationary net.
- `=24.802%`: neutral net.
- `>24.802%`: deflationary net (subject to floor clipping).

## 7) Milestones
- Pre-tail complete at height `16,999,999`: `400,000,000 ATHO` emitted total.
- Tail starts at height `17,000,000`.
- Tail subsidy headroom to hard cap: `100,000,000 ATHO`.
- Tail blocks required to exhaust hard-cap headroom: `512,000,000` blocks.
- Last positive-subsidy height: `528,999,999` (~`2012.94` years from genesis).
- First zero-subsidy height after cap clip: `529,000,000` (~`2012.94` years from genesis).
- Time from tail start to subsidy shutdown: `~1,948.25` years.

Supply-floor timing (burn-enabled scenarios, sustained utilization, current fee policy):

| Sustained utilization | Post-tail net (ATHO/year, pre-cap) | Circulating at hard cap | Additional blocks from `529,000,000` to floor | Approx years from genesis to floor |
|---:|---:|---:|---:|---:|
| 25% | `-410.625` | `399,200,000 ATHO` | `1,921,015,874` | `~9,322.74` |
| 50% | `-52,149.375` | `298,400,000 ATHO` | `704,507,937` | `~4,693.71` |
| 75% | `-103,888.125` | `197,600,000 ATHO` | `299,005,292` | `~3,150.71` |
| 100% | `-155,626.875` | `96,800,000 ATHO` | `96,253,969` | `~2,379.20` |

Notes:
- No-burn scenarios never reach floor by protocol burn logic.
- For any burn-enabled utilization above `0%`, floor is eventually reached because subsidy becomes `0` after hard-cap clip.

## 8) Coinbase Invariants
Consensus payout invariants:
- `coinbase_outputs_sum_atoms == block_reward_atoms + fees_miner_atoms`
- `total_emitted_atoms(height) <= 500,000,000 * 1e9 atoms`

When fee routing is active, blocks carry auditable fields:
- `fees_total_atoms`
- `fees_miner_atoms`
- `fees_burned_atoms`
- `fees_pool_atoms`
- `cumulative_burned_atoms`

## 9) Consensus Change Reminder
Changing any of the following is consensus-breaking and requires coordinated upgrade:
- reward schedule,
- hard max supply cap and subsidy clipping rule,
- tail reward,
- fee uplift/routing percents,
- burn split and floor,
- fee constants,
- atom denomination.
