# Atho Inflationary/Deflationary Network Model (30M Standard)

Status: Alpha documentation snapshot (2026-03-17).

## Scope
This file explains how Atho transitions between inflationary and deflationary behavior under the active consensus monetary policy.

Canonical implementation references:
- `Src/Utility/const.py`
- `Src/Main/blockveri.py`
- `Src/Storage/blockstorage.py`
- `Src/Main/emission.py`
- `Src/Main/esim.py`

## Executive summary
- Block time: `120` seconds (`262,800` blocks/year).
- Era size: `1,314,000` blocks (`5` years).
- First 5 eras follow `10 -> 5 -> 2.5 -> 1.25 -> 0.625` ATHO/block.
- Then reward is fixed at `0.3125 ATHO/block` until exact supply reaches `30,000,000 ATHO`.
- Tail starts at height `21,102,000` (year `~80.3`) with `0.25 ATHO/block` forever.
- Tail annual issuance is fixed at `65,700 ATHO/year`.
- Fee floor is `200 atoms/vB` (`2.0e-7 ATHO/vB`).
- Post-tail split target is `100% burn / 0% miner fee share`, clipped by floor headroom.
- Supply floor is `21,000,000 ATHO`.
- Protocol deflation threshold is exactly `50%` sustained block-byte utilization.

## Emission schedule

| Phase | Height range | Reward (ATHO/block) | Issuance (ATHO) | Cumulative (ATHO) |
|---|---|---:|---:|---:|
| Era 1 | `0 .. 1,313,999` | 10.0 | 13,140,000 | 13,140,000 |
| Era 2 | `1,314,000 .. 2,627,999` | 5.0 | 6,570,000 | 19,710,000 |
| Era 3 | `2,628,000 .. 3,941,999` | 2.5 | 3,285,000 | 22,995,000 |
| Era 4 | `3,942,000 .. 5,255,999` | 1.25 | 1,642,500 | 24,637,500 |
| Era 5 | `5,256,000 .. 6,569,999` | 0.625 | 821,250 | 25,458,750 |
| Transition | `6,570,000 .. 21,101,999` | 0.3125 | 4,541,250 | 30,000,000 |
| Tail | `21,102,000+` | 0.25 | perpetual | perpetual |

## Fee and burn math

### Per block at full utilization
- Max fee pool per full block: `2,500,000 * 200 atoms = 500,000,000 atoms = 0.5 ATHO`
- Tail issuance per block: `0.25 ATHO`
- Net per-block change formula: `Delta_block = 0.25 - (0.5 * utilization)`

### Per year at full utilization
- Tail issuance: `0.25 * 262,800 = 65,700 ATHO/year`
- Max annual fee pool: `2,500,000 * 262,800 * 2.0e-7 = 131,400 ATHO/year`
- Annual net formula: `Delta_year = 65,700 - (131,400 * utilization)`

### Deflation threshold
Set annual net to zero:

`65,700 - 131,400u = 0`  
`u = 65,700 / 131,400 = 0.50`

So:
- `<50%`: inflationary protocol net.
- `=50%`: neutral.
- `>50%`: deflationary protocol net (until floor clipping binds).

## Post-tail net annual change by utilization

| Utilization | Net annual change |
|---:|---:|
| 0% | `+65,700 ATHO/year` |
| 25% | `+32,850 ATHO/year` |
| 40% | `+13,140 ATHO/year` |
| 50% | `0 ATHO/year` |
| 60% | `-13,140 ATHO/year` |
| 75% | `-32,850 ATHO/year` |
| 100% | `-65,700 ATHO/year` |

## Reference long-horizon outcomes (model-generated scenarios)

| Scenario | Supply at year 250 |
|---:|---:|
| No burn (100% capacity) | `41,149,500 ATHO` |
| Burn on (25% capacity) | `35,565,000 ATHO` |
| Burn on (50% capacity) | `29,980,500 ATHO` |
| Burn on (75% capacity) | `24,396,000 ATHO` |
| Burn on (100% capacity) | `21,000,000 ATHO` (floor reached around year `217`) |

## Floor-clipped burn behavior
Burn is constrained by available headroom:

- `burn_headroom = emitted_up_to - cumulative_burned_before - supply_floor`
- `effective_burn = min(desired_burn, fees_total, burn_headroom)`

Implications:
1. Consensus cannot burn below `21,000,000 ATHO` effective circulating supply.
2. At/near floor, burn continues but is clipped to available headroom.
3. Unburned fee remainder flows to miner fee share for exact payout accounting.

## Coinbase and accounting invariants
Consensus enforces:

- `coinbase_outputs_sum_atoms == block_reward_atoms + fees_miner_atoms`

Tail-active blocks carry:
- `fees_total_atoms`
- `fees_miner_atoms`
- `fees_burned_atoms`
- `cumulative_burned_atoms`

## Bottom line
Atho’s active model is:
- **30M over ~80.3 years pre-tail**,
- then fixed tail subsidy (`0.25 ATHO/block`),
- with **100% post-tail fee burn target**,
- and a hard **21M supply floor**.

That yields a clean utilization pivot: **50% utilization is neutral**, below is inflationary net, above is deflationary net.
