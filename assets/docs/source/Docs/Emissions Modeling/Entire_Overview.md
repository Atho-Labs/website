# ENTIRE OVERVIEW - ATHO EMISSIONS MODELING


Date: 2026-04-15 (UTC)

This document is a complete observation-based report of the active Atho emissions and burn model. It
explains what the model computes, why the outputs look the way they do, and where practical limits show up
under different utilization assumptions. It is intentionally deterministic: every claim in this overview
maps back to current consensus constants and generated artifacts under Docs/Emissions Modeling.

SCOPE AND METHOD

Scope includes consensus math, issuance behavior, burn mechanics, miner incentive surface, user fee costs,
inflation/deflation transitions, floor clipping behavior, and long-horizon supply trajectories. The model
evaluates no-burn and burn-enabled scenarios side-by-side under identical throughput assumptions to avoid
framing bias. This report is observational rather than predictive; it does not treat demand, price, or
realized capacity as known values.

Core constants used by the active model are: 120-second blocks, 262,800 blocks/year, 8 fixed pre-tail
eras of 2,000,000 blocks each plus a 1,000,000-block transition at 0.78125 ATHO/block, one-time bootstrap
allocation of 781,250 ATHO at block 1, total pre-tail base target 400,000,000 ATHO, and tail reward
0.1953125 ATHO/block, fee floor 0.00000050 ATHO per policy byte (500 atoms/byte), max block policy budget
3,500,000 vbytes, burn share 45.0%, miner fee share 0.0%, consensus-pool routing share 55.0%, supply floor
21,000,000 ATHO, and hard max supply cap 500,000,000 ATHO.

CONSENSUS ALIGNMENT STATUS

PASS: Year-250 supply ordering NoBurn >= Burn25 >= Burn50 >= Burn75 >= Burn100.

PASS: no_burn_100 post-tail net change matches tail_issuance - burned_fees.

PASS: burn_25 post-tail net change matches tail_issuance - burned_fees.

PASS: burn_50 post-tail net change matches tail_issuance - burned_fees.

PASS: burn_75 post-tail net change matches tail_issuance - burned_fees.

PASS: burn_100 post-tail net change matches tail_issuance - burned_fees.

PASS: Annual burn never exceeds annual fee pool.

PASS: Burn activation flips between year 64 (off) and 65 (on) in sampled yearly outputs.

Consensus alignment checks verify that the model schedule and policy math match live constants (tail
start, fee floor, burn split, supply floor, and hard max cap). The same constants are enforced during
block verification and persistence in the node, so model and chain policy remain coupled.

EMISSION SHAPE

Pre-tail emission is fixed by the consensus sequence (100 -> 50 -> 25 -> 12.5 -> 6.25 -> 3.125 ->
1.5625 -> 0.78125, then a 1,000,000-block transition at 0.78125, then tail 0.1953125 ATHO/block),
producing an exact pre-tail issuance of 400,000,000.000 ATHO. Tail mode starts at height 17,000,000
(~year 64.69). Tail activation combines two transitions: reward moves from 0.7812500 to 0.1953125
ATHO/block, burn policy activates, and subsidy is clipped to zero after the hard-cap headroom is exhausted.

Tail annual issuance is 51,328.125 ATHO. At 100% policy-budget utilization, annual fee pool is 459,900.000
ATHO and max annual burn equals 206,955.000 ATHO. Therefore post-tail protocol net supply change is a
linear function of utilization: Delta_supply = tail_issuance - max_annual_burn * utilization.

Hard-cap timing is deterministic under these constants: 100,000,000 ATHO of tail headroom requires
512,000,000 tail blocks, so last positive subsidy is at height 528,999,999 and first zero-subsidy block is
529,000,000 (~year 2012.94). Time-to-floor is utilization-dependent after that point (about year 2379.20
at sustained 100% utilization and year 9322.74 at sustained 25% utilization, burn-enabled path).

SCENARIO OUTCOMES

Year-250 circulating supply ordering is strictly monotonic: NoBurn100=409,511,718.750 ATHO,
Burn25=399,888,311.250, Burn50=390,264,903.750, Burn75=380,641,496.250, Burn100=371,018,088.750. This
confirms expected policy behavior: greater sustained utilization under burn policy removes more aggregate
fees from circulating supply.

At year 100, NoBurn100 exceeds Burn100 by 7,450,380.000 ATHO. At year 250, Burn100 is 9.400% below
NoBurn100. These are material differences for long-horizon communications and treasury planning, so
scenario labels must always accompany projected supply numbers.

Protocol-only deflation threshold is >24.802% utilization. Under current constants, that means the
protocol can be inflationary at low-to-mid utilization but deflationary in sustained high-usage regimes.

FEE MARKET AND USER COSTS

Model baseline uses 566 vB as representative transaction size, so typical fee at floor is 0.000283 ATHO. A
2,000-vB heavy transaction costs 0.001000 ATHO. Fee burden therefore scales linearly with vsize and market
price, so any public affordability claim should publish both coin-denominated and fiat-translated cost
bands.

Throughput and fee policy are coupled. If the realized transaction-size distribution shifts upward, fees
per transaction increase even when fee-per-byte policy remains unchanged. The model already includes
measured vsize references to avoid treating all traffic as uniform 1-in/2-out activity.

MINER ECONOMICS

Post-tail miner income in NoBurn100 is 511,228.125 ATHO/year. In Burn100 it is 51,328.125 ATHO/year
because fee share is policy-limited to 0.0%. The difference is 459,900.000 ATHO/year (89.960%).

Interpretation is straightforward: this design explicitly prioritizes fee destruction over fee-funded tail
miner uplift. Security remains funded by tail issuance, while fee burn tightens supply path under higher
usage. Whether this split is optimal depends on expected hashrate elasticity, power markets, and miner
treasury tolerance in late-stage eras.

FLOOR SAFETY AND ACCOUNTING INVARIANTS

The supply floor is not a narrative hint; it is an accounting guardrail. Burn is clipped by burn headroom
(emitted_up_to - cumulative_burned_before - floor), so modeled circulating supply cannot be reduced below
floor via burn accounting.

Coinbase payout invariants are enforced as: coinbase_sum_atoms = block_reward_atoms + fees_miner_atoms.
Fee accounting fields (fees_total_atoms, fees_miner_atoms, fees_burned_atoms, cumulative_burned_atoms) are
validated once burn policy is active, ensuring every block exposes reviewable token-flow decomposition.

RISK BOUNDARIES

This model is deterministic but intentionally bounded. It does not natively model cyclic utilization,
above-floor fee spikes, network topology effects, orphan dynamics, hashrate migration, hardware
replacement curves, or policy feedback from external exchanges.

Those omissions do not invalidate the base math; they define confidence boundaries. Protocol outputs
should be treated as first-principles anchors, then layered with market and infrastructure assumptions
during governance or investor communication.

SCENARIO DEEP DIVE (YEAR CHECKPOINTS)

No Burn (100% block capacity): year25 circulating=357,906,250.000 ATHO, year50=396,312,500.000,
year100=401,812,500.000, year250=409,511,718.750. Annual net change at year250 is 51,328.125 ATHO with
annual net rate 0.013%.

Burn On (25% block capacity): year25 circulating=357,906,250.000 ATHO, year50=396,312,500.000,
year100=399,949,905.000, year250=399,888,311.250. Annual net change at year250 is -410.625 ATHO with
annual net rate -0.000%.

Burn On (50% block capacity): year25 circulating=357,906,250.000 ATHO, year50=396,312,500.000,
year100=398,087,310.000, year250=390,264,903.750. Annual net change at year250 is -52,149.375 ATHO with
annual net rate -0.013%.

Burn On (75% block capacity): year25 circulating=357,906,250.000 ATHO, year50=396,312,500.000,
year100=396,224,715.000, year250=380,641,496.250. Annual net change at year250 is -103,888.125 ATHO with
annual net rate -0.027%.

Burn On (100% block capacity): year25 circulating=357,906,250.000 ATHO, year50=396,312,500.000,
year100=394,362,120.000, year250=371,018,088.750. Annual net change at year250 is -155,626.875 ATHO with
annual net rate -0.042%.

CONCLUSIONS

The active Atho emissions model is internally coherent, reproducible, and strongly reviewable. Supply
outcomes move monotonically with utilization under burn-enabled scenarios, and the floor clipping
invariant protects against pathological long-run over-burn.

The model now provides a clearer evidence chain: deterministic constants, scenario CSVs, narrative
reports, and presentation PDFs. This is the correct operating baseline for production tokenomics
communication.

Final report position: treat these outputs as deterministic policy maps, not market certainties. Maintain
explicit assumptions, publish versioned artifacts, and preserve strict separation between protocol math
and external market assumptions.

Appendix note 1: At year 10, scenario No Burn (100% block capacity) reports circulating supply
232,181,250.000 ATHO, cumulative burned 0.000 ATHO, and annual net change 13,140,000.000 ATHO. This
checkpoint reinforces that cumulative burn tracks utilization and burn policy directly, while net-rate
drift depends on the ratio of annual delta to existing circulating base.

Appendix note 2: For No Burn (100% block capacity) at year 25, annual issuance remains 3,285,000.000 ATHO
and annual fee pool assumption is 459,900.000 ATHO. Under the configured burn split, annual burned amount
is 0.000 ATHO and miner revenue is 3,744,900.000 ATHO. This makes token flow decomposition explicit for
auditing and economics review.

Appendix note 3: The No Burn (100% block capacity) curve at year 50 shows net rate 0.104% with TPS
estimate 51.525. Even though TPS is scenario-constrained in this model, net supply behavior is controlled
by utilization and burn policy rather than by nominal subsidy transitions after tail start.

Appendix note 4: At year 75, scenario No Burn (100% block capacity) reports circulating supply
400,529,296.875 ATHO, cumulative burned 0.000 ATHO, and annual net change 51,328.125 ATHO. This checkpoint
reinforces that cumulative burn tracks utilization and burn policy directly, while net-rate drift depends
on the ratio of annual delta to existing circulating base.

Appendix note 5: For No Burn (100% block capacity) at year 100, annual issuance remains 51,328.125 ATHO
and annual fee pool assumption is 459,900.000 ATHO. Under the configured burn split, annual burned amount
is 0.000 ATHO and miner revenue is 511,228.125 ATHO. This makes token flow decomposition explicit for
auditing and economics review.

Appendix note 6: The No Burn (100% block capacity) curve at year 150 shows net rate 0.013% with TPS
estimate 51.525. Even though TPS is scenario-constrained in this model, net supply behavior is controlled
by utilization and burn policy rather than by nominal subsidy transitions after tail start.

Appendix note 7: At year 200, scenario No Burn (100% block capacity) reports circulating supply
406,945,312.500 ATHO, cumulative burned 0.000 ATHO, and annual net change 51,328.125 ATHO. This checkpoint
reinforces that cumulative burn tracks utilization and burn policy directly, while net-rate drift depends
on the ratio of annual delta to existing circulating base.

Appendix note 8: For No Burn (100% block capacity) at year 250, annual issuance remains 51,328.125 ATHO
and annual fee pool assumption is 459,900.000 ATHO. Under the configured burn split, annual burned amount
is 0.000 ATHO and miner revenue is 511,228.125 ATHO. This makes token flow decomposition explicit for
auditing and economics review.

Appendix note 9: The Burn On (25% block capacity) curve at year 10 shows net rate 5.999% with TPS estimate
12.875. Even though TPS is scenario-constrained in this model, net supply behavior is controlled by
utilization and burn policy rather than by nominal subsidy transitions after tail start.

Appendix note 10: At year 25, scenario Burn On (25% block capacity) reports circulating supply
357,906,250.000 ATHO, cumulative burned 0.000 ATHO, and annual net change 3,285,000.000 ATHO. This
checkpoint reinforces that cumulative burn tracks utilization and burn policy directly, while net-rate
drift depends on the ratio of annual delta to existing circulating base.

Appendix note 11: For Burn On (25% block capacity) at year 50, annual issuance remains 410,625.000 ATHO
and annual fee pool assumption is 114,975.000 ATHO. Under the configured burn split, annual burned amount
is 0.000 ATHO and miner revenue is 525,600.000 ATHO. This makes token flow decomposition explicit for
auditing and economics review.

Appendix note 12: The Burn On (25% block capacity) curve at year 75 shows net rate -0.000% with TPS
estimate 12.875. Even though TPS is scenario-constrained in this model, net supply behavior is controlled
by utilization and burn policy rather than by nominal subsidy transitions after tail start.

Appendix note 13: At year 100, scenario Burn On (25% block capacity) reports circulating supply
399,949,905.000 ATHO, cumulative burned 1,862,595.000 ATHO, and annual net change -410.625 ATHO. This
checkpoint reinforces that cumulative burn tracks utilization and burn policy directly, while net-rate
drift depends on the ratio of annual delta to existing circulating base.

Appendix note 14: For Burn On (25% block capacity) at year 150, annual issuance remains 51,328.125 ATHO
and annual fee pool assumption is 114,975.000 ATHO. Under the configured burn split, annual burned amount
is 51,738.750 ATHO and miner revenue is 114,564.375 ATHO. This makes token flow decomposition explicit for
auditing and economics review.

Appendix note 15: The Burn On (25% block capacity) curve at year 200 shows net rate -0.000% with TPS
estimate 12.875. Even though TPS is scenario-constrained in this model, net supply behavior is controlled
by utilization and burn policy rather than by nominal subsidy transitions after tail start.

Appendix note 16: At year 250, scenario Burn On (25% block capacity) reports circulating supply
399,888,311.250 ATHO, cumulative burned 9,623,407.500 ATHO, and annual net change -410.625 ATHO. This
checkpoint reinforces that cumulative burn tracks utilization and burn policy directly, while net-rate
drift depends on the ratio of annual delta to existing circulating base.

Appendix note 17: For Burn On (50% block capacity) at year 10, annual issuance remains 13,140,000.000 ATHO
and annual fee pool assumption is 229,950.000 ATHO. Under the configured burn split, annual burned amount
is 0.000 ATHO and miner revenue is 13,369,950.000 ATHO. This makes token flow decomposition explicit for
auditing and economics review.

Appendix note 18: The Burn On (50% block capacity) curve at year 25 shows net rate 0.926% with TPS
estimate 25.758. Even though TPS is scenario-constrained in this model, net supply behavior is controlled
by utilization and burn policy rather than by nominal subsidy transitions after tail start.

Appendix note 19: At year 50, scenario Burn On (50% block capacity) reports circulating supply
396,312,500.000 ATHO, cumulative burned 0.000 ATHO, and annual net change 410,625.000 ATHO. This
checkpoint reinforces that cumulative burn tracks utilization and burn policy directly, while net-rate
drift depends on the ratio of annual delta to existing circulating base.

Appendix note 20: For Burn On (50% block capacity) at year 75, annual issuance remains 51,328.125 ATHO and
annual fee pool assumption is 229,950.000 ATHO. Under the configured burn split, annual burned amount is
103,477.500 ATHO and miner revenue is 177,800.625 ATHO. This makes token flow decomposition explicit for
auditing and economics review.

Appendix note 21: The Burn On (50% block capacity) curve at year 100 shows net rate -0.013% with TPS
estimate 25.758. Even though TPS is scenario-constrained in this model, net supply behavior is controlled
by utilization and burn policy rather than by nominal subsidy transitions after tail start.

Appendix note 22: At year 150, scenario Burn On (50% block capacity) reports circulating supply
395,479,841.250 ATHO, cumulative burned 8,899,065.000 ATHO, and annual net change -52,149.375 ATHO. This
checkpoint reinforces that cumulative burn tracks utilization and burn policy directly, while net-rate
drift depends on the ratio of annual delta to existing circulating base.

Appendix note 23: For Burn On (50% block capacity) at year 200, annual issuance remains 51,328.125 ATHO
and annual fee pool assumption is 229,950.000 ATHO. Under the configured burn split, annual burned amount
is 103,477.500 ATHO and miner revenue is 177,800.625 ATHO. This makes token flow decomposition explicit
for auditing and economics review.

Appendix note 24: The Burn On (50% block capacity) curve at year 250 shows net rate -0.013% with TPS
estimate 25.758. Even though TPS is scenario-constrained in this model, net supply behavior is controlled
by utilization and burn policy rather than by nominal subsidy transitions after tail start.

Appendix note 25: At year 10, scenario Burn On (75% block capacity) reports circulating supply
232,181,250.000 ATHO, cumulative burned 0.000 ATHO, and annual net change 13,140,000.000 ATHO. This
checkpoint reinforces that cumulative burn tracks utilization and burn policy directly, while net-rate
drift depends on the ratio of annual delta to existing circulating base.

Appendix note 26: For Burn On (75% block capacity) at year 25, annual issuance remains 3,285,000.000 ATHO
and annual fee pool assumption is 344,925.000 ATHO. Under the configured burn split, annual burned amount
is 0.000 ATHO and miner revenue is 3,629,925.000 ATHO. This makes token flow decomposition explicit for
auditing and economics review.

Appendix note 27: The Burn On (75% block capacity) curve at year 50 shows net rate 0.104% with TPS
estimate 38.642. Even though TPS is scenario-constrained in this model, net supply behavior is controlled
by utilization and burn policy rather than by nominal subsidy transitions after tail start.

Appendix note 28: At year 75, scenario Burn On (75% block capacity) reports circulating supply
398,821,918.125 ATHO, cumulative burned 1,707,378.750 ATHO, and annual net change -103,888.125 ATHO. This
checkpoint reinforces that cumulative burn tracks utilization and burn policy directly, while net-rate
drift depends on the ratio of annual delta to existing circulating base.
