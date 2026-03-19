# ENTIRE OVERVIEW - ATHO EMISSIONS MODELING AUDIT


This document is a complete observation-based audit of the active Atho emissions and burn model. It
explains what the model computes, why the outputs look the way they do, and where practical limits show up
under different utilization assumptions. It is intentionally deterministic: every claim in this overview
maps back to current consensus constants and generated artifacts under Docs/Emissions Modeling.

SCOPE AND METHOD

Audit scope includes consensus math, issuance behavior, burn mechanics, miner incentive surface, user fee
costs, inflation/deflation transitions, floor clipping behavior, and long-horizon supply trajectories. The
model evaluates no-burn and burn-enabled scenarios side-by-side under identical throughput assumptions to
avoid framing bias. This report is observational rather than predictive; it does not treat demand, price,
or realized capacity as known values.

Core constants used by the active model are: 120-second blocks, 262,800 blocks/year, 5 initial pre-tail
eras of 1,314,000 blocks each, followed by a transition reward of 0.3125 ATHO/block until 30,000,000 ATHO,
and a tail reward of 0.2500 ATHO/block, fee floor 0.00000020 ATHO/byte (200 atoms/byte), max block size
2,500,000 bytes, burn share 100.0%, miner fee share 0.0%, and supply floor 21,000,000 ATHO.

CONSENSUS ALIGNMENT STATUS

PASS: Year-250 supply ordering NoBurn >= Burn25 >= Burn50 >= Burn75 >= Burn100.

PASS: no_burn_100 post-tail net change matches tail_issuance - burned_fees.

PASS: burn_25 post-tail net change matches tail_issuance - burned_fees.

PASS: burn_50 post-tail net change matches tail_issuance - burned_fees.

PASS: burn_75 post-tail net change matches tail_issuance - burned_fees.

PASS: burn_100 post-tail net change matches tail_issuance - burned_fees.

PASS: Annual burn never exceeds annual fee pool.

PASS: Burn activation flips between year 80 (off) and 81 (on) in sampled yearly outputs.

Consensus alignment checks verify that the model schedule and policy math match live constants (tail
start, fee floor, burn split, and supply floor). The same constants are enforced during block verification
and persistence in the node, so model and chain policy remain coupled.

EMISSION SHAPE

Pre-tail emission is fixed by the 5-era + transition reward sequence (10 -> 5 -> 2.5 -> 1.25 -> 0.625 ->
0.3125 (until 30M) ATHO/block), producing an exact pre-tail issuance of 30,000,000.000 ATHO. Tail mode
starts at height 21,102,000 (~year 80.30). Tail activation combines two transitions: reward moves from
0.3125 to 0.2500 ATHO/block, and burn policy activates.

Tail annual issuance is 65,700.000 ATHO. At 100% block-byte utilization, annual fee pool is 131,400.000
ATHO and max annual burn equals 131,400.000 ATHO. Therefore post-tail protocol net supply change is a
linear function of utilization: Delta_supply = tail_issuance - max_annual_burn * utilization.

SCENARIO OUTCOMES

Year-250 circulating supply ordering is strictly monotonic: NoBurn100=41,149,500.000 ATHO,
Burn25=35,565,000.000, Burn50=29,980,500.000, Burn75=24,396,000.000, Burn100=21,000,000.000. This confirms
expected policy behavior: greater sustained utilization under burn policy removes more aggregate fees from
circulating supply.

At year 100, NoBurn100 exceeds Burn100 by 2,628,000.000 ATHO. At year 250, Burn100 is 48.967% below
NoBurn100. These are material differences for long-horizon communications and treasury planning, so
scenario labels must always accompany projected supply numbers.

Protocol-only deflation threshold is >50.000% utilization. Under current constants, that means the
protocol can be inflationary at low-to-mid utilization but deflationary in sustained high-usage regimes.

FEE MARKET AND USER COSTS

Model baseline uses 7,000 bytes as representative transaction size, so typical fee at floor is 0.001400
ATHO. A 20,000-byte stress transaction costs 0.004000 ATHO. Fee burden therefore scales linearly with
bytes and market price, so any public affordability claim should publish both coin-denominated and fiat-
translated cost bands.

Throughput and fee policy are coupled. If the realized transaction-size distribution shifts upward, fees
per transaction increase even when fee-per-byte policy remains unchanged. The model already includes
measured larger transaction references to avoid treating all traffic as uniform 1-in/2-out activity.

MINER ECONOMICS

Post-tail miner income in NoBurn100 is 197,100.000 ATHO/year. In Burn100 it is 65,700.000 ATHO/year
because fee share is policy-limited to 0.0%. The difference is 131,400.000 ATHO/year (66.667%).

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
validated once burn policy is active, ensuring every block exposes auditable token-flow decomposition.

RISK BOUNDARIES

This model is deterministic but intentionally bounded. It does not natively model cyclic utilization,
above-floor fee spikes, network topology effects, orphan dynamics, hashrate migration, hardware
replacement curves, or policy feedback from external exchanges.

Those omissions do not invalidate the base math; they define confidence boundaries. Protocol outputs
should be treated as first-principles anchors, then layered with market and infrastructure assumptions
during governance or investor communication.

SCENARIO DEEP DIVE (YEAR CHECKPOINTS)

No Burn (100% block capacity): year25 circulating=25,458,750.000 ATHO, year50=27,511,875.000,
year100=31,294,500.000, year250=41,149,500.000. Annual net change at year250 is 65,700.000 ATHO with
annual net rate 0.160%.

Burn On (25% block capacity): year25 circulating=25,458,750.000 ATHO, year50=27,511,875.000,
year100=30,637,500.000, year250=35,565,000.000. Annual net change at year250 is 32,850.000 ATHO with
annual net rate 0.092%.

Burn On (50% block capacity): year25 circulating=25,458,750.000 ATHO, year50=27,511,875.000,
year100=29,980,500.000, year250=29,980,500.000. Annual net change at year250 is 0.000 ATHO with annual net
rate 0.000%.

Burn On (75% block capacity): year25 circulating=25,458,750.000 ATHO, year50=27,511,875.000,
year100=29,323,500.000, year250=24,396,000.000. Annual net change at year250 is -32,850.000 ATHO with
annual net rate -0.134%.

Burn On (100% block capacity): year25 circulating=25,458,750.000 ATHO, year50=27,511,875.000,
year100=28,666,500.000, year250=21,000,000.000. Annual net change at year250 is 0.000 ATHO with annual net
rate 0.000%.

CONCLUSIONS

The active Atho emissions model is internally coherent, reproducible, and strongly auditable. Supply
outcomes move monotonically with utilization under burn-enabled scenarios, and the floor clipping
invariant protects against pathological long-run over-burn.

The model now provides a clearer evidence chain: deterministic constants, scenario CSVs, narrative
reports, and presentation PDFs. This is the correct operating baseline for production tokenomics
communication.

Final audit position: treat these outputs as deterministic policy maps, not market certainties. Maintain
explicit assumptions, publish versioned artifacts, and preserve strict separation between protocol math
and external market assumptions.

Appendix note 1: At year 10, scenario No Burn (100% block capacity) reports circulating supply
19,710,000.000 ATHO, cumulative burned 0.000 ATHO, and annual net change 1,314,000.000 ATHO. This
checkpoint reinforces that cumulative burn tracks utilization and burn policy directly, while net-rate
drift depends on the ratio of annual delta to existing circulating base.

Appendix note 2: For No Burn (100% block capacity) at year 25, annual issuance remains 164,250.000 ATHO
and annual fee pool assumption is 131,400.000 ATHO. Under the configured burn split, annual burned amount
is 0.000 ATHO and miner revenue is 295,650.000 ATHO. This makes token flow decomposition explicit for
auditing and economics review.

Appendix note 3: The No Burn (100% block capacity) curve at year 50 shows net rate 0.299% with TPS
estimate 2.975. Even though TPS is scenario-constrained in this model, net supply behavior is controlled
by utilization and burn policy rather than by nominal subsidy transitions after tail start.

Appendix note 4: At year 75, scenario No Burn (100% block capacity) reports circulating supply
29,565,000.000 ATHO, cumulative burned 0.000 ATHO, and annual net change 82,125.000 ATHO. This checkpoint
reinforces that cumulative burn tracks utilization and burn policy directly, while net-rate drift depends
on the ratio of annual delta to existing circulating base.

Appendix note 5: For No Burn (100% block capacity) at year 100, annual issuance remains 65,700.000 ATHO
and annual fee pool assumption is 131,400.000 ATHO. Under the configured burn split, annual burned amount
is 0.000 ATHO and miner revenue is 197,100.000 ATHO. This makes token flow decomposition explicit for
auditing and economics review.

Appendix note 6: The No Burn (100% block capacity) curve at year 150 shows net rate 0.190% with TPS
estimate 2.975. Even though TPS is scenario-constrained in this model, net supply behavior is controlled
by utilization and burn policy rather than by nominal subsidy transitions after tail start.

Appendix note 7: At year 200, scenario No Burn (100% block capacity) reports circulating supply
37,864,500.000 ATHO, cumulative burned 0.000 ATHO, and annual net change 65,700.000 ATHO. This checkpoint
reinforces that cumulative burn tracks utilization and burn policy directly, while net-rate drift depends
on the ratio of annual delta to existing circulating base.

Appendix note 8: For No Burn (100% block capacity) at year 250, annual issuance remains 65,700.000 ATHO
and annual fee pool assumption is 131,400.000 ATHO. Under the configured burn split, annual burned amount
is 0.000 ATHO and miner revenue is 197,100.000 ATHO. This makes token flow decomposition explicit for
auditing and economics review.

Appendix note 9: The Burn On (25% block capacity) curve at year 10 shows net rate 7.143% with TPS estimate
0.742. Even though TPS is scenario-constrained in this model, net supply behavior is controlled by
utilization and burn policy rather than by nominal subsidy transitions after tail start.

Appendix note 10: At year 25, scenario Burn On (25% block capacity) reports circulating supply
25,458,750.000 ATHO, cumulative burned 0.000 ATHO, and annual net change 164,250.000 ATHO. This checkpoint
reinforces that cumulative burn tracks utilization and burn policy directly, while net-rate drift depends
on the ratio of annual delta to existing circulating base.

Appendix note 11: For Burn On (25% block capacity) at year 50, annual issuance remains 82,125.000 ATHO and
annual fee pool assumption is 32,850.000 ATHO. Under the configured burn split, annual burned amount is
0.000 ATHO and miner revenue is 114,975.000 ATHO. This makes token flow decomposition explicit for
auditing and economics review.

Appendix note 12: The Burn On (25% block capacity) curve at year 75 shows net rate 0.279% with TPS
estimate 0.742. Even though TPS is scenario-constrained in this model, net supply behavior is controlled
by utilization and burn policy rather than by nominal subsidy transitions after tail start.

Appendix note 13: At year 100, scenario Burn On (25% block capacity) reports circulating supply
30,637,500.000 ATHO, cumulative burned 657,000.000 ATHO, and annual net change 32,850.000 ATHO. This
checkpoint reinforces that cumulative burn tracks utilization and burn policy directly, while net-rate
drift depends on the ratio of annual delta to existing circulating base.

Appendix note 14: For Burn On (25% block capacity) at year 150, annual issuance remains 65,700.000 ATHO
and annual fee pool assumption is 32,850.000 ATHO. Under the configured burn split, annual burned amount
is 32,850.000 ATHO and miner revenue is 65,700.000 ATHO. This makes token flow decomposition explicit for
auditing and economics review.

Appendix note 15: The Burn On (25% block capacity) curve at year 200 shows net rate 0.097% with TPS
estimate 0.742. Even though TPS is scenario-constrained in this model, net supply behavior is controlled
by utilization and burn policy rather than by nominal subsidy transitions after tail start.

Appendix note 16: At year 250, scenario Burn On (25% block capacity) reports circulating supply
35,565,000.000 ATHO, cumulative burned 5,584,500.000 ATHO, and annual net change 32,850.000 ATHO. This
checkpoint reinforces that cumulative burn tracks utilization and burn policy directly, while net-rate
drift depends on the ratio of annual delta to existing circulating base.

Appendix note 17: For Burn On (50% block capacity) at year 10, annual issuance remains 1,314,000.000 ATHO
and annual fee pool assumption is 65,700.000 ATHO. Under the configured burn split, annual burned amount
is 0.000 ATHO and miner revenue is 1,379,700.000 ATHO. This makes token flow decomposition explicit for
auditing and economics review.

Appendix note 18: The Burn On (50% block capacity) curve at year 25 shows net rate 0.649% with TPS
estimate 1.483. Even though TPS is scenario-constrained in this model, net supply behavior is controlled
by utilization and burn policy rather than by nominal subsidy transitions after tail start.

Appendix note 19: At year 50, scenario Burn On (50% block capacity) reports circulating supply
27,511,875.000 ATHO, cumulative burned 0.000 ATHO, and annual net change 82,125.000 ATHO. This checkpoint
reinforces that cumulative burn tracks utilization and burn policy directly, while net-rate drift depends
on the ratio of annual delta to existing circulating base.

Appendix note 20: For Burn On (50% block capacity) at year 75, annual issuance remains 82,125.000 ATHO and
annual fee pool assumption is 65,700.000 ATHO. Under the configured burn split, annual burned amount is
0.000 ATHO and miner revenue is 147,825.000 ATHO. This makes token flow decomposition explicit for
auditing and economics review.

Appendix note 21: The Burn On (50% block capacity) curve at year 100 shows net rate 0.000% with TPS
estimate 1.483. Even though TPS is scenario-constrained in this model, net supply behavior is controlled
by utilization and burn policy rather than by nominal subsidy transitions after tail start.

Appendix note 22: At year 150, scenario Burn On (50% block capacity) reports circulating supply
29,980,500.000 ATHO, cumulative burned 4,599,000.000 ATHO, and annual net change 0.000 ATHO. This
checkpoint reinforces that cumulative burn tracks utilization and burn policy directly, while net-rate
drift depends on the ratio of annual delta to existing circulating base.

Appendix note 23: For Burn On (50% block capacity) at year 200, annual issuance remains 65,700.000 ATHO
and annual fee pool assumption is 65,700.000 ATHO. Under the configured burn split, annual burned amount
is 65,700.000 ATHO and miner revenue is 65,700.000 ATHO. This makes token flow decomposition explicit for
auditing and economics review.

Appendix note 24: The Burn On (50% block capacity) curve at year 250 shows net rate 0.000% with TPS
estimate 1.483. Even though TPS is scenario-constrained in this model, net supply behavior is controlled
by utilization and burn policy rather than by nominal subsidy transitions after tail start.

Appendix note 25: At year 10, scenario Burn On (75% block capacity) reports circulating supply
19,710,000.000 ATHO, cumulative burned 0.000 ATHO, and annual net change 1,314,000.000 ATHO. This
checkpoint reinforces that cumulative burn tracks utilization and burn policy directly, while net-rate
drift depends on the ratio of annual delta to existing circulating base.

Appendix note 26: For Burn On (75% block capacity) at year 25, annual issuance remains 164,250.000 ATHO
and annual fee pool assumption is 98,550.000 ATHO. Under the configured burn split, annual burned amount
is 0.000 ATHO and miner revenue is 262,800.000 ATHO. This makes token flow decomposition explicit for
auditing and economics review.

Appendix note 27: The Burn On (75% block capacity) curve at year 50 shows net rate 0.299% with TPS
estimate 2.225. Even though TPS is scenario-constrained in this model, net supply behavior is controlled
by utilization and burn policy rather than by nominal subsidy transitions after tail start.

Appendix note 28: At year 75, scenario Burn On (75% block capacity) reports circulating supply
29,565,000.000 ATHO, cumulative burned 0.000 ATHO, and annual net change 82,125.000 ATHO. This checkpoint
reinforces that cumulative burn tracks utilization and burn policy directly, while net-rate drift depends
on the ratio of annual delta to existing circulating base.

Appendix note 29: For Burn On (75% block capacity) at year 100, annual issuance remains 65,700.000 ATHO
and annual fee pool assumption is 98,550.000 ATHO. Under the configured burn split, annual burned amount
is 98,550.000 ATHO and miner revenue is 65,700.000 ATHO. This makes token flow decomposition explicit for
auditing and economics review.

