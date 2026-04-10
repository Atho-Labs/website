# Atho Final Specs (350 Model)

Date: 2026-04-08

This file is the canonical Markdown policy snapshot for the 350 atoms/vB model and updated stake routing.

## Core Policy
- Base issuance path: `100,000,000 ATHO`
- Hard max supply cap: `150,000,000 ATHO`
- Protected supply floor: `21,000,000 ATHO`
- Unit model: integer atoms
- Conversion: `1 ATHO = 1,000,000,000 atoms`

## Block and Era Structure
- Block time target: `120 seconds`
- Blocks/year: `262,800`
- Era size: `1,000,000` blocks
- Tail start height: `8,000,000`
- Tail start time from genesis: `~30.44 years`

Reward schedule:
- Era 1: `50 ATHO/block`
- Era 2: `25 ATHO/block`
- Era 3: `12.5 ATHO/block`
- Era 4: `6.25 ATHO/block`
- Era 5: `3.125 ATHO/block`
- Era 6: `1.5625 ATHO/block`
- Era 7: `0.78125 ATHO/block`
- Era 8: `0.390625 ATHO/block`
- Tail: `0.1953125 ATHO/block`

Bootstrap and totals:
- Bootstrap allocation: `390,625 ATHO` at block `1`
- Pre-tail subsidy path: `99,609,375 ATHO`
- Pre-tail total including bootstrap: `100,000,000 ATHO`
- Tail annual issuance: `51,328.125 ATHO/year`
- Subsidy clipping: clipped by remaining headroom under `150M`
- After cap reached: subsidy = `0`

## Fee Policy
- Fee floor: `350 atoms/vB`
- ATHO equivalent: `0.00000035 ATHO/vB`
- Scientific notation: `3.5e-7 ATHO/vB`
- Minimum transaction fee: `100,000 atoms`
- Dust limit: `250 atoms`

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

## 350 atoms/vB Annual Math
Full-utilization totals:
- Total annual fees: `321,930 ATHO/year`
- Miner pool post-tail: `80,482.5 ATHO/year`
- Stake pool post-tail: `96,579 ATHO/year`
- Burn path post-tail: `144,868.5 ATHO/year`
- Tail subsidy: `51,328.125 ATHO/year`
- Net supply change at 100% utilization: `-93,540.375 ATHO/year`

Per block at full utilization:
- Total fees/block: `1.225 ATHO`
- Miner pool/block: `0.30625 ATHO`
- Stake pool/block: `0.3675 ATHO`
- Burn/block: `0.55125 ATHO`
- Tail subsidy/block: `0.1953125 ATHO`
- Net burn/block after tail: `0.3559375 ATHO`

Post-tail net annual formula:
- `Delta_supply = 51,328.125 - (144,868.5 * utilization)`

Neutral utilization point:
- `~35.43%`

## Staking Policy (Updated)
- Minimum stake: `20 ATHO`
- Maximum per staking address: `500 ATHO`
- Maximum new ATHO entering staking per rolling 30 days (network-wide): `25,000 ATHO`
- Maximum total staked network-wide at any time: `25,000,000 ATHO`
- Unstake finalization: `180 days` worth of blocks (`129,600` blocks)
- Reward accrual after unstake request: stops on request
- Reward split: proportional to active staked share

Derived stake throughput:
- Max new staking per year: `300,000 ATHO/year`
- Time from zero to 25M cap (at max inflow): `~83.33 years`

## Bonding Policy
- Minimum active mining bond: `25 ATHO`
- Maximum per bond address: `30 ATHO`
- Bond release period: `14 days` worth of blocks (`10,080` blocks)
- Global bond cap: none
- Slashing buffer: `5 ATHO`
- Miner eligibility loss: below `25 ATHO` until topped back up

## Post-tail Miner-Side Support
Miner-side annual support = tail subsidy + miner fee bucket:
- 0% utilization: `51,328.125 ATHO/year`
- 25% utilization: `71,448.75 ATHO/year`
- 50% utilization: `91,569.375 ATHO/year`
- 75% utilization: `111,690 ATHO/year`
- 100% utilization: `131,810.625 ATHO/year`

## Final Summary
- Base supply path: `100M ATHO`
- Hard cap: `150M ATHO`
- Protected floor: `21M ATHO`
- Fee floor: `350 atoms/vB`
- Post-tail routing: `25% miners / 30% stakers / 45% burn`
- Neutral utilization: `~35.43%`
- Minimum stake: `20 ATHO`
- Max stake per address: `500 ATHO`
- Max new staking per rolling 30 days: `25,000 ATHO`
- Max total staked: `25M ATHO`
- Unstake delay: `180 days`
- Rewards stop on unstake request: yes
- Minimum mining bond: `25 ATHO`
- Max bond per address: `30 ATHO`
- Bond release period: `14 days`
- Global bond cap: none
