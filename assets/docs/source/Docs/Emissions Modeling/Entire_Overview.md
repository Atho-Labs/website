# ENTIRE OVERVIEW - ATHO EMISSIONS MODELING


Date: 2026-04-10 (UTC)

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

Core constants used by the active model are: 120-second blocks, 262,800 blocks/year, 8 initial pre-tail
eras of 1,000,000 blocks each, one-time bootstrap allocation of 390,625 ATHO at block 1, total pre-tail
base target 100,000,000 ATHO, and tail reward 0.1953125 ATHO/block, fee floor 0.00000035 ATHO per policy
byte (350 atoms/byte), max block policy budget 3,500,000 vbytes, burn share 45.0%, miner fee share 0.0%,
consensus-pool routing share 55.0%, supply floor 21,000,000 ATHO, and hard max supply cap 150,000,000
ATHO.

CONSENSUS ALIGNMENT STATUS

PASS: Year-250 supply ordering NoBurn >= Burn25 >= Burn50 >= Burn75 >= Burn100.

PASS: no_burn_100 post-tail net change matches tail_issuance - burned_fees.

PASS: burn_25 post-tail net change matches tail_issuance - burned_fees.

PASS: burn_50 post-tail net change matches tail_issuance - burned_fees.

PASS: burn_75 post-tail net change matches tail_issuance - burned_fees.

PASS: burn_100 post-tail net change matches tail_issuance - burned_fees.

PASS: Annual burn never exceeds annual fee pool.

PASS: Burn activation flips between year 30 (off) and 31 (on) in sampled yearly outputs.

Consensus alignment checks verify that the model schedule and policy math match live constants (tail
start, fee floor, burn split, supply floor, and hard max cap). The same constants are enforced during
block verification and persistence in the node, so model and chain policy remain coupled.

EMISSION SHAPE

Pre-tail emission is fixed by the consensus era sequence (50 -> 25 -> 12.5 -> 6.25 -> 3.125 -> 1.5625 ->
0.78125 -> 0.390625 -> tail 0.1953125 ATHO/block), producing an exact pre-tail issuance of 100,000,000.000
ATHO. Tail mode starts at height 8,000,000 (~year 30.44). Tail activation combines two transitions: reward
moves from 0.3906250 to 0.1953125 ATHO/block, burn policy activates, and subsidy is clipped to zero after
the hard-cap headroom is exhausted.

Tail annual issuance is 51,328.125 ATHO. At 100% policy-budget utilization, annual fee pool is 321,930.000
ATHO and max annual burn equals 144,868.500 ATHO. Therefore post-tail protocol net supply change is a
linear function of utilization: Delta_supply = tail_issuance - max_annual_burn * utilization.

SCENARIO OUTCOMES

Year-250 circulating supply ordering is strictly monotonic: NoBurn100=111,269,531.250 ATHO,
Burn25=103,301,763.750, Burn50=95,333,996.250, Burn75=87,366,228.750, Burn100=79,398,461.250. This
confirms expected policy behavior: greater sustained utilization under burn policy removes more aggregate
fees from circulating supply.

At year 100, NoBurn100 exceeds Burn100 by 10,140,795.000 ATHO. At year 250, Burn100 is 28.643% below
NoBurn100. These are material differences for long-horizon communications and treasury planning, so
scenario labels must always accompany projected supply numbers.

Protocol-only deflation threshold is >35.431% utilization. Under current constants, that means the
protocol can be inflationary at low-to-mid utilization but deflationary in sustained high-usage regimes.

FEE MARKET AND USER COSTS

Model baseline uses 566 vB as representative transaction size, so typical fee at floor is 0.000198 ATHO. A
2,000-vB heavy transaction costs 0.000700 ATHO. Fee burden therefore scales linearly with vsize and market
price, so any public affordability claim should publish both coin-denominated and fiat-translated cost
bands.

Throughput and fee policy are coupled. If the realized transaction-size distribution shifts upward, fees
per transaction increase even when fee-per-byte policy remains unchanged. The model already includes
measured vsize references to avoid treating all traffic as uniform 1-in/2-out activity.

MINER ECONOMICS

Post-tail miner income in NoBurn100 is 373,258.125 ATHO/year. In Burn100 it is 51,328.125 ATHO/year
because fee share is policy-limited to 0.0%. The difference is 321,930.000 ATHO/year (86.249%).

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

No Burn (100% block capacity): year25 circulating=99,273,437.500 ATHO, year50=101,003,906.250,
year100=103,570,312.500, year250=111,269,531.250. Annual net change at year250 is 51,328.125 ATHO with
annual net rate 0.046%.

Burn On (25% block capacity): year25 circulating=99,273,437.500 ATHO, year50=100,279,563.750,
year100=101,035,113.750, year250=103,301,763.750. Annual net change at year250 is 15,111.000 ATHO with
annual net rate 0.015%.

Burn On (50% block capacity): year25 circulating=99,273,437.500 ATHO, year50=99,555,221.250,
year100=98,499,915.000, year250=95,333,996.250. Annual net change at year250 is -21,106.125 ATHO with
annual net rate -0.022%.

Burn On (75% block capacity): year25 circulating=99,273,437.500 ATHO, year50=98,830,878.750,
year100=95,964,716.250, year250=87,366,228.750. Annual net change at year250 is -57,323.250 ATHO with
annual net rate -0.066%.

Burn On (100% block capacity): year25 circulating=99,273,437.500 ATHO, year50=98,106,536.250,
year100=93,429,517.500, year250=79,398,461.250. Annual net change at year250 is -93,540.375 ATHO with
annual net rate -0.118%.

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
83,240,625.000 ATHO, cumulative burned 0.000 ATHO, and annual net change 3,285,000.000 ATHO. This
checkpoint reinforces that cumulative burn tracks utilization and burn policy directly, while net-rate
drift depends on the ratio of annual delta to existing circulating base.

Appendix note 2: For No Burn (100% block capacity) at year 25, annual issuance remains 205,312.500 ATHO
and annual fee pool assumption is 321,930.000 ATHO. Under the configured burn split, annual burned amount
is 0.000 ATHO and miner revenue is 527,242.500 ATHO. This makes token flow decomposition explicit for
auditing and economics review.

Appendix note 3: The No Burn (100% block capacity) curve at year 50 shows net rate 0.051% with TPS
estimate 51.525. Even though TPS is scenario-constrained in this model, net supply behavior is controlled
by utilization and burn policy rather than by nominal subsidy transitions after tail start.

Appendix note 4: At year 75, scenario No Burn (100% block capacity) reports circulating supply
102,287,109.375 ATHO, cumulative burned 0.000 ATHO, and annual net change 51,328.125 ATHO. This checkpoint
reinforces that cumulative burn tracks utilization and burn policy directly, while net-rate drift depends
on the ratio of annual delta to existing circulating base.

Appendix note 5: For No Burn (100% block capacity) at year 100, annual issuance remains 51,328.125 ATHO
and annual fee pool assumption is 321,930.000 ATHO. Under the configured burn split, annual burned amount
is 0.000 ATHO and miner revenue is 373,258.125 ATHO. This makes token flow decomposition explicit for
auditing and economics review.

Appendix note 6: The No Burn (100% block capacity) curve at year 150 shows net rate 0.048% with TPS
estimate 51.525. Even though TPS is scenario-constrained in this model, net supply behavior is controlled
by utilization and burn policy rather than by nominal subsidy transitions after tail start.

Appendix note 7: At year 200, scenario No Burn (100% block capacity) reports circulating supply
108,703,125.000 ATHO, cumulative burned 0.000 ATHO, and annual net change 51,328.125 ATHO. This checkpoint
reinforces that cumulative burn tracks utilization and burn policy directly, while net-rate drift depends
on the ratio of annual delta to existing circulating base.

Appendix note 8: For No Burn (100% block capacity) at year 250, annual issuance remains 51,328.125 ATHO
and annual fee pool assumption is 321,930.000 ATHO. Under the configured burn split, annual burned amount
is 0.000 ATHO and miner revenue is 373,258.125 ATHO. This makes token flow decomposition explicit for
auditing and economics review.

Appendix note 9: The Burn On (25% block capacity) curve at year 10 shows net rate 4.109% with TPS estimate
12.875. Even though TPS is scenario-constrained in this model, net supply behavior is controlled by
utilization and burn policy rather than by nominal subsidy transitions after tail start.

Appendix note 10: At year 25, scenario Burn On (25% block capacity) reports circulating supply
99,273,437.500 ATHO, cumulative burned 0.000 ATHO, and annual net change 205,312.500 ATHO. This checkpoint
reinforces that cumulative burn tracks utilization and burn policy directly, while net-rate drift depends
on the ratio of annual delta to existing circulating base.

Appendix note 11: For Burn On (25% block capacity) at year 50, annual issuance remains 51,328.125 ATHO and
annual fee pool assumption is 80,482.500 ATHO. Under the configured burn split, annual burned amount is
36,217.125 ATHO and miner revenue is 95,593.500 ATHO. This makes token flow decomposition explicit for
auditing and economics review.

Appendix note 12: The Burn On (25% block capacity) curve at year 75 shows net rate 0.015% with TPS
estimate 12.875. Even though TPS is scenario-constrained in this model, net supply behavior is controlled
by utilization and burn policy rather than by nominal subsidy transitions after tail start.

Appendix note 13: At year 100, scenario Burn On (25% block capacity) reports circulating supply
101,035,113.750 ATHO, cumulative burned 2,535,198.750 ATHO, and annual net change 15,111.000 ATHO. This
checkpoint reinforces that cumulative burn tracks utilization and burn policy directly, while net-rate
drift depends on the ratio of annual delta to existing circulating base.

Appendix note 14: For Burn On (25% block capacity) at year 150, annual issuance remains 51,328.125 ATHO
and annual fee pool assumption is 80,482.500 ATHO. Under the configured burn split, annual burned amount
is 36,217.125 ATHO and miner revenue is 95,593.500 ATHO. This makes token flow decomposition explicit for
auditing and economics review.

Appendix note 15: The Burn On (25% block capacity) curve at year 200 shows net rate 0.015% with TPS
estimate 12.875. Even though TPS is scenario-constrained in this model, net supply behavior is controlled
by utilization and burn policy rather than by nominal subsidy transitions after tail start.

Appendix note 16: At year 250, scenario Burn On (25% block capacity) reports circulating supply
103,301,763.750 ATHO, cumulative burned 7,967,767.500 ATHO, and annual net change 15,111.000 ATHO. This
checkpoint reinforces that cumulative burn tracks utilization and burn policy directly, while net-rate
drift depends on the ratio of annual delta to existing circulating base.

Appendix note 17: For Burn On (50% block capacity) at year 10, annual issuance remains 3,285,000.000 ATHO
and annual fee pool assumption is 160,965.000 ATHO. Under the configured burn split, annual burned amount
is 0.000 ATHO and miner revenue is 3,445,965.000 ATHO. This makes token flow decomposition explicit for
auditing and economics review.

Appendix note 18: The Burn On (50% block capacity) curve at year 25 shows net rate 0.207% with TPS
estimate 25.758. Even though TPS is scenario-constrained in this model, net supply behavior is controlled
by utilization and burn policy rather than by nominal subsidy transitions after tail start.

Appendix note 19: At year 50, scenario Burn On (50% block capacity) reports circulating supply
99,555,221.250 ATHO, cumulative burned 1,448,685.000 ATHO, and annual net change -21,106.125 ATHO. This
checkpoint reinforces that cumulative burn tracks utilization and burn policy directly, while net-rate
drift depends on the ratio of annual delta to existing circulating base.

Appendix note 20: For Burn On (50% block capacity) at year 75, annual issuance remains 51,328.125 ATHO and
annual fee pool assumption is 160,965.000 ATHO. Under the configured burn split, annual burned amount is
72,434.250 ATHO and miner revenue is 139,858.875 ATHO. This makes token flow decomposition explicit for
auditing and economics review.

Appendix note 21: The Burn On (50% block capacity) curve at year 100 shows net rate -0.021% with TPS
estimate 25.758. Even though TPS is scenario-constrained in this model, net supply behavior is controlled
by utilization and burn policy rather than by nominal subsidy transitions after tail start.

Appendix note 22: At year 150, scenario Burn On (50% block capacity) reports circulating supply
97,444,608.750 ATHO, cumulative burned 8,692,110.000 ATHO, and annual net change -21,106.125 ATHO. This
checkpoint reinforces that cumulative burn tracks utilization and burn policy directly, while net-rate
drift depends on the ratio of annual delta to existing circulating base.

Appendix note 23: For Burn On (50% block capacity) at year 200, annual issuance remains 51,328.125 ATHO
and annual fee pool assumption is 160,965.000 ATHO. Under the configured burn split, annual burned amount
is 72,434.250 ATHO and miner revenue is 139,858.875 ATHO. This makes token flow decomposition explicit for
auditing and economics review.

Appendix note 24: The Burn On (50% block capacity) curve at year 250 shows net rate -0.022% with TPS
estimate 25.758. Even though TPS is scenario-constrained in this model, net supply behavior is controlled
by utilization and burn policy rather than by nominal subsidy transitions after tail start.

Appendix note 25: At year 10, scenario Burn On (75% block capacity) reports circulating supply
83,240,625.000 ATHO, cumulative burned 0.000 ATHO, and annual net change 3,285,000.000 ATHO. This
checkpoint reinforces that cumulative burn tracks utilization and burn policy directly, while net-rate
drift depends on the ratio of annual delta to existing circulating base.

Appendix note 26: For Burn On (75% block capacity) at year 25, annual issuance remains 205,312.500 ATHO
and annual fee pool assumption is 241,447.500 ATHO. Under the configured burn split, annual burned amount
is 0.000 ATHO and miner revenue is 446,760.000 ATHO. This makes token flow decomposition explicit for
auditing and economics review.

Appendix note 27: The Burn On (75% block capacity) curve at year 50 shows net rate -0.058% with TPS
estimate 38.642. Even though TPS is scenario-constrained in this model, net supply behavior is controlled
by utilization and burn policy rather than by nominal subsidy transitions after tail start.

Appendix note 28: At year 75, scenario Burn On (75% block capacity) reports circulating supply
97,397,797.500 ATHO, cumulative burned 4,889,311.875 ATHO, and annual net change -57,323.250 ATHO. This
checkpoint reinforces that cumulative burn tracks utilization and burn policy directly, while net-rate
drift depends on the ratio of annual delta to existing circulating base.

