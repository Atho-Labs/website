# Atho Final Specs (500 Model)

Date: 2026-04-15

This file is the canonical Markdown policy snapshot for the active 500 atoms/vB fee model and updated supply/staking policy.

## Core Policy
- Base issuance path: `400,000,000 ATHO`
- Hard max supply cap: `500,000,000 ATHO`
- Protected supply floor: `21,000,000 ATHO`
- Unit model: integer atoms
- Conversion: `1 ATHO = 1,000,000,000 atoms`

## Block and Era Structure
- Block time target: `120 seconds`
- Blocks/year: `262,800`
- Era size: `2,000,000` blocks
- Tail start height: `17,000,000`
- Tail start time from genesis: `~64.69 years`

Reward schedule:
- Era 1: `100 ATHO/block`
- Era 2: `50 ATHO/block`
- Era 3: `25 ATHO/block`
- Era 4: `12.5 ATHO/block`
- Era 5: `6.25 ATHO/block`
- Era 6: `3.125 ATHO/block`
- Era 7: `1.5625 ATHO/block`
- Era 8: `0.78125 ATHO/block`
- Transition: `0.78125 ATHO/block` for `1,000,000` blocks
- Tail: `0.1953125 ATHO/block`

Bootstrap and totals:
- Bootstrap allocation: `781,250 ATHO` at block `1`
- Pre-tail subsidy path: `399,218,750 ATHO`
- Pre-tail total including bootstrap: `400,000,000 ATHO`
- Supply-closure check: `399,218,750 + 781,250 + 100,000,000 = 500,000,000`
- Tail annual issuance: `51,328.125 ATHO/year`
- Subsidy clipping: clipped by remaining headroom under `500M`
- After cap reached: subsidy = `0`

## Fee Policy
- Fee floor: `500 atoms/vB`
- ATHO equivalent: `0.0000005 ATHO/vB`
- Scientific notation: `5e-7 ATHO/vB`
- Minimum transaction fee: `200,000 atoms`
- Dust limit: `20,000 atoms` (`1/10` of min tx fee)

Transaction policy metric:
- `weight = base_bytes * 3 + total_bytes`
- `vsize = ceil(weight / 4)`
- `vsize` is used for mempool admission, miner packing, and tx policy.

Block capacity:
- Effective vbyte cap per block: `3,500,000 vB`
- Max block weight: `14,000,000`
- Max block base cap: `3,500,000 bytes`

## Fee Routing
Pre-tail:
- Total routed to consensus pool: `40%`
- Miner bucket: `20%`
- Stake bucket: `20%`

Post-tail:
- Miner bucket: `25%`
- Stake bucket: `30%`
- Burn-targeted share: `45%`
- Burn clipping: clipped by `21M` floor headroom

## 500 atoms/vB Annual Math
Full-utilization totals:
- Total annual fees: `459,900 ATHO/year`
- Miner pool post-tail: `114,975 ATHO/year`
- Stake pool post-tail: `137,970 ATHO/year`
- Burn path post-tail: `206,955 ATHO/year`
- Tail subsidy: `51,328.125 ATHO/year`
- Net supply change at 100% utilization: `-155,626.875 ATHO/year`

Per block at full utilization:
- Total fees/block: `1.75 ATHO`
- Miner pool/block: `0.4375 ATHO`
- Stake pool/block: `0.525 ATHO`
- Burn/block: `0.7875 ATHO`
- Tail subsidy/block: `0.1953125 ATHO`
- Net burn/block after tail: `0.5921875 ATHO`

Post-tail net annual formula:
- `Delta_supply = 51,328.125 - (206,955 * utilization)`

Neutral utilization point:
- `~24.802%`

## Emission Milestone Timing
- Tail headroom to hard cap: `100,000,000 ATHO`.
- Tail blocks required to reach hard cap: `512,000,000`.
- Last positive-subsidy height: `528,999,999` (~`2,012.94` years from genesis).
- First zero-subsidy height: `529,000,000` (~`2,012.94` years from genesis).
- Time from tail start (`17,000,000`) to zero subsidy: `~1,948.25` years.

Floor timing (burn-enabled scenarios, sustained utilization):

| Sustained utilization | Circulating at hard cap | Additional blocks to floor after `529,000,000` | Approx years from genesis to floor |
|---:|---:|---:|---:|
| 25% | `399,200,000 ATHO` | `1,921,015,874` | `~9,322.74` |
| 50% | `298,400,000 ATHO` | `704,507,937` | `~4,693.71` |
| 75% | `197,600,000 ATHO` | `299,005,292` | `~3,150.71` |
| 100% | `96,800,000 ATHO` | `96,253,969` | `~2,379.20` |

Notes:
- No-burn scenarios do not reach floor via protocol burn.
- Any burn-enabled utilization above `0%` eventually reaches floor after subsidy shutdown.

## Staking Policy (Updated)
- Minimum stake: `20 ATHO`
- Maximum per staking address: `1,000 ATHO`
- Maximum new ATHO entering staking per rolling window (network-wide): `50,000 ATHO` per `21,600` blocks
- Maximum total staked network-wide at any time: `75,000,000 ATHO`
- Unstake finalization: `180 days` worth of blocks (`129,600` blocks)
- Reward accrual after unstake request: stops on request
- Reward split: proportional to active staked share

Derived stake throughput:
- Max new staking per year: `608,333.333 ATHO/year` (`50,000 * 262,800 / 21,600`)
- Time from zero to 75M cap (at max inflow): `~123.29 years`

## Bonding Policy
- Minimum active mining bond: `25 ATHO`
- Maximum per bond address: `30 ATHO`
- Bond release period: `14 days` worth of blocks (`10,080` blocks)
- Global bond cap: none
- Slashing buffer: `5 ATHO`
- Miner eligibility loss: below `25 ATHO` until topped back up

## Final Summary
- Base supply path: `400M ATHO`
- Hard cap: `500M ATHO`
- Protected floor: `21M ATHO`
- Fee floor: `500 atoms/vB`
- Post-tail routing: `25% miners / 30% stakers / 45% burn`
- Neutral utilization: `~24.802%`
- Minimum stake: `20 ATHO`
- Max stake per address: `1,000 ATHO`
- Max new staking per rolling window: `50,000 ATHO / 21,600 blocks`
- Max total staked: `75M ATHO`
- Unstake delay: `180 days`
- Rewards stop on unstake request: yes
- Minimum mining bond: `25 ATHO`
- Max bond per address: `30 ATHO`
- Bond release period: `14 days`
- Global bond cap: none
