# Atho Emissions and Fee Routing Policy

Date: 2026-04-05

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
- Hard max supply cap = `150,000,000 ATHO`.

Tail:
- Tail reward `0.1953125 ATHO/block` from height `8,000,000` onward.
- Tail activation occurs at `~30.44 years` from genesis.
- Tail annual issuance: `51,328.125 ATHO/year`.

Hard-cap clipping rule:
- Subsidy is clipped at coinbase path by remaining cap headroom.
- Once `total_emitted_atoms` reaches `150,000,000 ATHO`, subsidy is `0` for all later heights.
- Fee routing/burn/pool accounting remains unchanged (fees do not mint new supply).

## 3) Why This Bounded Model Exists
Atho uses three monetary anchors for stability and auditability:

- `100,000,000 ATHO` base issuance path:
  - defines the long-form launch distribution and predictable early-to-mid lifecycle issuance,
  - gives operators and integrators a deterministic emission curve to model from genesis.

- `150,000,000 ATHO` hard max supply cap:
  - enforces a strict upper bound on minted supply at consensus level,
  - prevents perpetual subsidy expansion and guarantees issuance eventually terminates (`subsidy = 0` after cap is reached).

- `21,000,000 ATHO` protected supply floor:
  - ensures burn logic cannot reduce effective circulating supply below a minimum economic base,
  - protects against pathological over-burn in sustained high-fee periods.

Design intent:
- The base path controls structured distribution,
- the max cap bounds long-run inflation risk,
- the floor bounds long-run deflation pressure from fee burn.

Result:
- supply is constrained inside a deterministic corridor and remains consensus-verifiable on every block.

## 4) How This Differs and Why It Matters
How Atho differs:
- It combines a finite hard cap (`150M`) with a structured base path (`100M`) and an enforced lower floor (`21M`).
- Many networks implement only one side of this envelope:
  - cap-only systems constrain inflation but do not include a protocol burn-floor guardrail,
  - perpetual-tail systems preserve ongoing issuance but do not hard-stop minting at a fixed maximum.
- Atho enforces both boundaries in consensus math:
  - upper bound through subsidy clipping at coinbase,
  - lower bound through burn headroom clipping.

Why this is important:
- Predictability: issuance and boundary behavior can be modeled from genesis with no discretionary policy step.
- Safety: prevents two extremes at protocol level:
  - unbounded long-run mint expansion,
  - over-aggressive fee burn reducing circulating supply below intended minimum.
- Auditability: nodes can verify boundary adherence per block using deterministic fields (`fees_*_atoms`, `cumulative_burned_atoms`, emitted totals).
- Upgrade clarity: monetary changes are explicit hard-fork events, not hidden runtime tuning.

## 5) Active Fee Policy
Current constants:
- `FEE_PER_BYTE_ATOMS = 350` (policy unit is `vsize`)
- `MIN_TRANSACTION_FEE_ATOMS = 100,000`
- `DUST_LIMIT_ATOMS = 250`
- Max block base cap: `3,500,000` bytes
- Max block weight: `14,000,000`

Fee routing:
- Pre-tail: `40%` of total fees route to consensus pool (`20%` miner bucket, `20%` stake bucket).
- Post-tail: `55%` of total fees route to consensus pool (`25%` miner bucket, `30%` stake bucket).
- At tail, routed non-pool fees (`45%`) are burn-targeted (`100%` burn policy), clipped by supply-floor headroom.

Supply floor:
- Effective circulating supply is clipped to never go below `21,000,000 ATHO`.

## 6) No Fixed Base Transaction Size Assumption
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

## 7) Throughput Formulas
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

## 8) Post-Tail Net Supply Math
At full block utilization by vbytes:
- Total fee floor capacity per block = `3,500,000 * 350 = 1,225,000,000 atoms = 1.225 ATHO`
- Annual total fees at full utilization = `321,930 ATHO/year`
- Burnable routed share (`45%`) at full utilization = `144,868.5 ATHO/year`

Post-tail net annual change:
- `Delta_supply = 51,328.125 - (144,868.5 * utilization)`
- This formula applies while subsidy is still positive; after hard-cap clip, subsidy term is `0`.

Deflation threshold:
- `utilization ~= 51,328.125 / 144,868.5 ~= 0.3543` (`35.43%`)

Interpretation:
- `<35.43%` utilization: inflationary net.
- `=35.43%`: neutral net.
- `>35.43%`: deflationary net (subject to floor clipping).

## 9) Coinbase Invariants
Consensus payout invariants:
- `coinbase_outputs_sum_atoms == block_reward_atoms + fees_miner_atoms`
- `total_emitted_atoms(height) <= 150,000,000 * 1e9 atoms`

When fee routing is active, blocks carry auditable fields:
- `fees_total_atoms`
- `fees_miner_atoms`
- `fees_burned_atoms`
- `fees_pool_atoms`
- `cumulative_burned_atoms`

## 10) Consensus Change Reminder
Changing any of the following is consensus-breaking and requires coordinated upgrade:
- reward schedule,
- hard max supply cap and subsidy clipping rule,
- tail reward,
- fee uplift/routing percents,
- burn split and floor,
- fee constants,
- atom denomination.
