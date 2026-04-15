# Atho Inflationary/Deflationary Network Model

Last refresh: 2026-04-15.

## Scope
This file explains how Atho transitions between inflationary and deflationary behavior under active consensus policy.

Canonical references:
- `Src/Utility/const.py`
- `Src/Main/blockveri.py`
- `Src/Main/consensus.py`
- `Src/Main/emission.py`

## Executive Summary
- Block time: `120` seconds (`262,800` blocks/year).
- Era size: `2,000,000` blocks (~`7.61` years).
- Eight pre-tail eras: `100 -> 50 -> 25 -> 12.5 -> 6.25 -> 3.125 -> 1.5625 -> 0.78125 ATHO/block`.
- Bootstrap allocation: `781,250 ATHO` at block `1` (included in total pre-tail base).
- Tail starts at height `17,000,000` (~`64.69` years) at `0.1953125 ATHO/block`.
- Tail annual issuance: `51,328.125 ATHO/year`.
- Hard max supply cap: `500,000,000 ATHO`.
- Fee floor: `500 atoms/vB` (`5e-7 ATHO/vB`).
- Fee routing: pre-tail `40%` to consensus pool, post-tail `55%` to consensus pool.
- Tail burn target on non-pool share: `100% burn / 0% miner`, with floor clipping.
- Supply floor: `21,000,000 ATHO`.
- Protocol deflation threshold: `~24.802%` sustained utilization.

## Emission Schedule

| Phase | Height range | Reward (ATHO/block) | Issuance (ATHO) | Cumulative subsidy (ATHO) |
|---|---|---:|---:|---:|
| Era 1 | `0 .. 1,999,999` | 100.0 | 200,000,000 | 200,000,000 |
| Era 2 | `2,000,000 .. 3,999,999` | 50.0 | 100,000,000 | 300,000,000 |
| Era 3 | `4,000,000 .. 5,999,999` | 25.0 | 50,000,000 | 350,000,000 |
| Era 4 | `6,000,000 .. 7,999,999` | 12.5 | 25,000,000 | 375,000,000 |
| Era 5 | `8,000,000 .. 9,999,999` | 6.25 | 12,500,000 | 387,500,000 |
| Era 6 | `10,000,000 .. 11,999,999` | 3.125 | 6,250,000 | 393,750,000 |
| Era 7 | `12,000,000 .. 13,999,999` | 1.5625 | 3,125,000 | 396,875,000 |
| Era 8 | `14,000,000 .. 15,999,999` | 0.78125 | 1,562,500 | 398,437,500 |
| Transition | `16,000,000 .. 16,999,999` | 0.78125 | 781,250 | 399,218,750 |
| Tail | `17,000,000+` | 0.1953125 (clipped by cap headroom) | until hard cap | until `500,000,000` |

Total pre-tail base including bootstrap:
- `399,218,750 ATHO` subsidy path + `781,250 ATHO` bootstrap at block `1` = `400,000,000 ATHO`.
- Remaining mintable headroom after pre-tail base: `100,000,000 ATHO` (tail subsidy only, then subsidy suppresses to zero).
- Supply closure: `399,218,750 + 781,250 + 100,000,000 = 500,000,000 ATHO`.

Hard-cap rule:
- `total_supply <= 500,000,000 ATHO`.
- Subsidy is clipped at coinbase by remaining cap headroom.
- After cap is reached, subsidy remains `0` and fees continue through the same burn/pool paths.

## Fee and Burn Math

### Per block at full utilization
- Total fee capacity at floor: `3,500,000 * 500 = 1,750,000,000 atoms = 1.75 ATHO`
- Routed-to-pool share at tail (`55%`): `0.9625 ATHO`
- Burn-path share at tail (`45%`): `0.7875 ATHO`
- Tail issuance per block: `0.1953125 ATHO`
- Net per-block formula: `Delta_block = 0.1953125 - (0.7875 * utilization)`

### Per year at full utilization
- Tail issuance: `0.1953125 * 262,800 = 51,328.125 ATHO/year`
- Total annual fees at floor: `459,900 ATHO/year`
- Annual burn-path max (`45%`): `206,955 ATHO/year`
- Annual net formula: `Delta_year = 51,328.125 - (206,955 * utilization)`
- Formula above applies while subsidy is still positive; after hard-cap clip, subsidy term is `0`.

### Deflation Threshold
Set annual net to zero:

`51,328.125 - 206,955u = 0`  
`u = 51,328.125 / 206,955 ~= 0.24802`

So:
- `<24.802%`: inflationary protocol net.
- `=24.802%`: neutral.
- `>24.802%`: deflationary protocol net (until floor clipping binds).

## Post-tail net annual change by utilization

| Utilization | Net annual change |
|---:|---:|
| 0% | `+51,328.125 ATHO/year` |
| 25% | `-410.625 ATHO/year` |
| 30% | `-10,758.375 ATHO/year` |
| 40% | `-31,453.875 ATHO/year` |
| 50% | `-52,149.375 ATHO/year` |
| 75% | `-103,888.125 ATHO/year` |
| 100% | `-155,626.875 ATHO/year` |

## Hard-Cap and Floor Timelines

### Time to hard max supply (`500,000,000 ATHO`)
- Tail headroom to mint after pre-tail base: `100,000,000 ATHO`.
- Tail blocks required to exhaust headroom: `100,000,000 / 0.1953125 = 512,000,000` blocks.
- Last positive-subsidy block: height `528,999,999` (~`2,012.94` years from genesis).
- First zero-subsidy block: height `529,000,000` (~`2,012.94` years from genesis).
- Time from tail start (`17,000,000`) to zero subsidy: `~1,948.25` years.

### Time to supply floor (`21,000,000 ATHO`) after burn
Assumptions for this table:
- Burn-enabled policy path.
- Sustained utilization at listed level.
- Current post-tail burn path (`45%` of total fees, floor clipped).

| Sustained utilization | Circulating at hard cap | Additional blocks from `529,000,000` to floor | Approx years from genesis to floor |
|---:|---:|---:|---:|
| 25% | `399,200,000 ATHO` | `1,921,015,874` | `~9,322.74` |
| 50% | `298,400,000 ATHO` | `704,507,937` | `~4,693.71` |
| 75% | `197,600,000 ATHO` | `299,005,292` | `~3,150.71` |
| 100% | `96,800,000 ATHO` | `96,253,969` | `~2,379.20` |

Notes:
- No-burn scenarios do not reach floor via protocol burn accounting.
- Any burn-enabled utilization above `0%` eventually reaches floor after hard-cap subsidy shutdown.

## Floor-Clipped Burn Behavior
Burn is constrained by available headroom:

- `burn_headroom = emitted_up_to - cumulative_burned_before - supply_floor`
- `effective_burn = min(desired_burn, routed_non_pool_fees, burn_headroom)`

Implications:
1. Consensus cannot burn below `21,000,000 ATHO` effective circulating supply.
2. At/near floor, burn is clipped to available headroom.
3. Unburned routed fees fall through to miner accounting for exact coinbase closure.

## Bottom Line
Atho’s active model is:
- **400M total pre-tail base over ~64.69 years** (`399.21875M` subsidy + `781,250` bootstrap),
- then fixed tail subsidy (`0.1953125 ATHO/block`) until clipped by hard-cap headroom,
- with pool-routed fees and burn on routed non-pool share,
- with a hard max emitted supply cap of **500,000,000 ATHO**,
- and a hard **21M supply floor**.

Current utilization pivot is **~24.802%** for neutral net supply change.
