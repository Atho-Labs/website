# Atho Inflationary/Deflationary Network Model

Last refresh: 2026-03-27.

## Scope
This file explains how Atho transitions between inflationary and deflationary behavior under active consensus policy.

Canonical references:
- `Src/Utility/const.py`
- `Src/Main/blockveri.py`
- `Src/Main/consensus.py`
- `Src/Main/emission.py`

## Executive Summary
- Block time: `120` seconds (`262,800` blocks/year).
- Era size: `1,314,000` blocks (`5` years).
- First 5 eras: `10 -> 5 -> 2.5 -> 1.25 -> 0.625 ATHO/block`.
- Transition: `0.3125 ATHO/block` until exact supply reaches `30,000,000 ATHO`.
- Tail starts at height `21,102,000` (year `~80.3`) at `0.25 ATHO/block`.
- Tail annual issuance: `65,700 ATHO/year`.
- Fee floor: `225 atoms/vB` (`2.25e-7 ATHO/vB`).
- Fee routing: `20%` to consensus pool, `80%` to burn/miner split path.
- Tail split target on routed share: `100% burn / 0% miner`, with floor clipping.
- Supply floor: `21,000,000 ATHO`.
- Protocol deflation threshold: `~55.56%` sustained utilization.

## Emission Schedule

| Phase | Height range | Reward (ATHO/block) | Issuance (ATHO) | Cumulative (ATHO) |
|---|---|---:|---:|---:|
| Era 1 | `0 .. 1,313,999` | 10.0 | 13,140,000 | 13,140,000 |
| Era 2 | `1,314,000 .. 2,627,999` | 5.0 | 6,570,000 | 19,710,000 |
| Era 3 | `2,628,000 .. 3,941,999` | 2.5 | 3,285,000 | 22,995,000 |
| Era 4 | `3,942,000 .. 5,255,999` | 1.25 | 1,642,500 | 24,637,500 |
| Era 5 | `5,256,000 .. 6,569,999` | 0.625 | 821,250 | 25,458,750 |
| Transition | `6,570,000 .. 21,101,999` | 0.3125 | 4,541,250 | 30,000,000 |
| Tail | `21,102,000+` | 0.25 | perpetual | perpetual |

## Fee and Burn Math

### Per block at full utilization
- Total fee capacity at floor: `2,500,000 * 225 = 562,500,000 atoms = 0.5625 ATHO`
- Routed-to-pool share (`20%`): `0.1125 ATHO`
- Burn-path share (`80%`): `0.45 ATHO`
- Tail issuance per block: `0.25 ATHO`
- Net per-block formula: `Delta_block = 0.25 - (0.45 * utilization)`

### Per year at full utilization
- Tail issuance: `0.25 * 262,800 = 65,700 ATHO/year`
- Total annual fees at floor: `147,825 ATHO/year`
- Annual burn-path max (`80%`): `118,260 ATHO/year`
- Annual net formula: `Delta_year = 65,700 - (118,260 * utilization)`

### Deflation Threshold
Set annual net to zero:

`65,700 - 118,260u = 0`  
`u = 65,700 / 118,260 ~= 0.5556`

So:
- `<55.56%`: inflationary protocol net.
- `=55.56%`: neutral.
- `>55.56%`: deflationary protocol net (until floor clipping binds).

## Post-tail net annual change by utilization

| Utilization | Net annual change |
|---:|---:|
| 0% | `+65,700 ATHO/year` |
| 25% | `+36,135 ATHO/year` |
| 40% | `+18,396 ATHO/year` |
| 50% | `+6,570 ATHO/year` |
| 55.56% | `~0 ATHO/year` |
| 60% | `-5,256 ATHO/year` |
| 75% | `-22,995 ATHO/year` |
| 100% | `-52,560 ATHO/year` |

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
- **30M over ~80.3 years pre-tail**,
- then fixed tail subsidy (`0.25 ATHO/block`),
- with pool-routed fees and burn on routed non-pool share,
- and a hard **21M supply floor**.

Current utilization pivot is **~55.56%** for neutral net supply change.
