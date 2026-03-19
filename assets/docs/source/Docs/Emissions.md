# Atho Emissions, Burn, and Supply Floor (Consensus)

Status: Alpha documentation snapshot (2026-03-17).

## Scope
This document defines the active consensus monetary policy.

- All consensus-critical accounting is integer atoms.
- `1 ATHO = 1,000,000,000 atoms`.
- This is policy/engineering documentation, not a market forecast.

## 30M Standard (Active)

### Core constants
- `BLOCK_TIME_SECONDS = 120`
- `BLOCKS_PER_YEAR = 262,800`
- `BLOCKS_PER_ERA = 1,314,000` (5 years)
- `SUPPLY_FLOOR = 21,000,000 ATHO`

### Pre-tail schedule
First five eras (fixed):
- Era 1: `10.0 ATHO/block` (`0 .. 1,313,999`)
- Era 2: `5.0 ATHO/block` (`1,314,000 .. 2,627,999`)
- Era 3: `2.5 ATHO/block` (`2,628,000 .. 3,941,999`)
- Era 4: `1.25 ATHO/block` (`3,942,000 .. 5,255,999`)
- Era 5: `0.625 ATHO/block` (`5,256,000 .. 6,569,999`)

Transition phase:
- Reward is fixed at `0.3125 ATHO/block`.
- Transition runs until exact pre-tail supply reaches `30,000,000 ATHO`.
- Transition block span: `6,570,000 .. 21,101,999`.
- Transition block count: `14,532,000`.

Pre-tail totals:
- First five eras: `25,458,750 ATHO`
- Transition issuance: `4,541,250 ATHO`
- Exact pre-tail total: `30,000,000 ATHO`

### Tail (perpetual)
- Tail reward: `0.25 ATHO/block`
- Tail start height: `21,102,000`
- Tail start year (120s blocks): `~80.3`
- Tail annual issuance: `65,700 ATHO/year`

## Fee policy and burn
Defined in `Src/Utility/const.py`:

- `FEE_PER_BYTE_ATOMS = 200` (`2.0e-7 ATHO/vB`)
- `MIN_TRANSACTION_FEE_ATOMS = 187,500` (`0.000187500 ATHO`)
- `DUST_LIMIT_ATOMS = 5` (`0.000000005 ATHO`)
- Max block base size: `2,500,000 bytes`

Burn policy:
- Before tail start: miner receives 100% of fees.
- At and after tail start: target split is `100% burn / 0% miner fee share`.
- Burn is floor-clipped so effective circulating supply cannot go below `21,000,000 ATHO`.

## Derived post-tail economics
At 100% block-byte utilization:
- Max annual fee pool: `131,400 ATHO/year`
  - `2,500,000 * 262,800 * 2.0e-7`
- Tail annual issuance: `65,700 ATHO/year`
- Deflation threshold utilization: `50%`
  - `65,700 / 131,400 = 0.50`

Net annual change formula (post-tail):
- `Delta_supply = 65,700 - (131,400 * utilization)`

Interpretation:
- `<50%` utilization: inflationary net.
- `50%` utilization: neutral net.
- `>50%` utilization: deflationary net (until floor clipping binds).

## Coinbase and accounting invariants
Consensus enforces:
- `coinbase_outputs_sum_atoms == block_reward_atoms + fees_miner_atoms`

Tail-era blocks must carry auditable fee/burn fields:
- `fees_total_atoms`
- `fees_miner_atoms`
- `fees_burned_atoms`
- `cumulative_burned_atoms`

## Monitoring and outputs
- `Src/Main/emission.py` tracks expected coinbase payout and floor-aware supply accounting.
- `Src/Main/burn.py` tracks fee split and cumulative burned totals.
- `Src/Main/esim.py` generates long-horizon modeling outputs in `Docs/Emissions Modeling/`.

## Hard-fork note
Changing any of these is consensus-breaking:
- reward schedule,
- pre-tail target supply,
- tail reward,
- tail start behavior,
- fee floor/min fee,
- burn split,
- supply floor,
- atom denomination.
