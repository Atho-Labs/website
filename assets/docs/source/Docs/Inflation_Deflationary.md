# Atho Inflationary/Deflationary Network Model

Last refresh: 2026-04-04.

## Scope
This file explains how Atho transitions between inflationary and deflationary behavior under active consensus policy.

Canonical references:
- `Src/Utility/const.py`
- `Src/Main/blockveri.py`
- `Src/Main/consensus.py`
- `Src/Main/emission.py`

## Executive Summary
- Block time: `120` seconds (`262,800` blocks/year).
- Era size: `1,000,000` blocks (~`3.805` years).
- Eight pre-tail eras: `50 -> 25 -> 12.5 -> 6.25 -> 3.125 -> 1.5625 -> 0.78125 -> 0.390625 ATHO/block`.
- Bootstrap allocation: `390,625 ATHO` at block `1` (included in total pre-tail base).
- Tail starts at height `8,000,000` (~`30.44` years) at `0.1953125 ATHO/block`.
- Tail annual issuance: `51,328.125 ATHO/year`.
- Fee floor: `250 atoms/vB` (`2.5e-7 ATHO/vB`).
- Fee routing: pre-tail `40%` to consensus pool, post-tail `50%` to consensus pool.
- Tail burn target on non-pool share: `100% burn / 0% miner`, with floor clipping.
- Supply floor: `21,000,000 ATHO`.
- Protocol deflation threshold: `~44.64%` sustained utilization.

## Emission Schedule

| Phase | Height range | Reward (ATHO/block) | Issuance (ATHO) | Cumulative (ATHO) |
|---|---|---:|---:|---:|
| Era 1 | `0 .. 999,999` | 50.0 | 50,000,000 | 50,000,000 |
| Era 2 | `1,000,000 .. 1,999,999` | 25.0 | 25,000,000 | 75,000,000 |
| Era 3 | `2,000,000 .. 2,999,999` | 12.5 | 12,500,000 | 87,500,000 |
| Era 4 | `3,000,000 .. 3,999,999` | 6.25 | 6,250,000 | 93,750,000 |
| Era 5 | `4,000,000 .. 4,999,999` | 3.125 | 3,125,000 | 96,875,000 |
| Era 6 | `5,000,000 .. 5,999,999` | 1.5625 | 1,562,500 | 98,437,500 |
| Era 7 | `6,000,000 .. 6,999,999` | 0.78125 | 781,250 | 99,218,750 |
| Era 8 | `7,000,000 .. 7,999,999` | 0.390625 | 390,625 | 99,609,375 |
| Tail | `8,000,000+` | 0.1953125 | perpetual | perpetual |

Total pre-tail base including bootstrap:
- `99,609,375 ATHO` subsidy path + `390,625 ATHO` bootstrap at block `1` = `100,000,000 ATHO`.

## Fee and Burn Math

### Per block at full utilization
- Total fee capacity at floor: `3,500,000 * 250 = 875,000,000 atoms = 0.875 ATHO`
- Routed-to-pool share at tail (`50%`): `0.4375 ATHO`
- Burn-path share at tail (`50%`): `0.4375 ATHO`
- Tail issuance per block: `0.1953125 ATHO`
- Net per-block formula: `Delta_block = 0.1953125 - (0.4375 * utilization)`

### Per year at full utilization
- Tail issuance: `0.1953125 * 262,800 = 51,328.125 ATHO/year`
- Total annual fees at floor: `229,950 ATHO/year`
- Annual burn-path max (`50%`): `114,975 ATHO/year`
- Annual net formula: `Delta_year = 51,328.125 - (114,975 * utilization)`

### Deflation Threshold
Set annual net to zero:

`51,328.125 - 114,975u = 0`  
`u = 51,328.125 / 114,975 ~= 0.4464`

So:
- `<44.64%`: inflationary protocol net.
- `=44.64%`: neutral.
- `>44.64%`: deflationary protocol net (until floor clipping binds).

## Post-tail net annual change by utilization

| Utilization | Net annual change |
|---:|---:|
| 0% | `+51,328.125 ATHO/year` |
| 25% | `+22,584.375 ATHO/year` |
| 40% | `+5,338.125 ATHO/year` |
| 44.64% | `~0 ATHO/year` |
| 50% | `-6,159.375 ATHO/year` |
| 60% | `-17,656.875 ATHO/year` |
| 75% | `-34,903.125 ATHO/year` |
| 100% | `-63,646.875 ATHO/year` |

## Floor-Clipped Burn Behavior
Burn is constrained by available headroom:

- `burn_headroom = emitted_up_to - cumulative_burned_before - supply_floor`
- `effective_burn = min(desired_burn, routed_non_pool_fees, burn_headroom)`

Implications:
1. Consensus cannot burn below `21,000,000 ATHO` effective circulating supply.
2. At/near floor, burn is clipped to available headroom.
3. Unburned routed fees fall through to miner accounting for exact coinbase closure.

## Coinbase and Accounting Invariants
Consensus enforces:

- `coinbase_outputs_sum_atoms == block_reward_atoms + fees_miner_atoms`

Tail-active blocks carry auditable fields:
- `fees_total_atoms`
- `fees_miner_atoms`
- `fees_burned_atoms`
- `fees_pool_atoms`
- `cumulative_burned_atoms`

## Bottom Line
Atho’s active model is:
- **100M total pre-tail base over ~30.44 years** (`99.609375M` subsidy + `390,625` bootstrap),
- then fixed tail subsidy (`0.1953125 ATHO/block`),
- with pool-routed fees and burn on routed non-pool share,
- and a hard **21M supply floor**.

Current utilization pivot is **~44.64%** for neutral net supply change.
