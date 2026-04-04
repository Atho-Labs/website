# ENTIRE OVERVIEW - ATHO EMISSIONS MODELING


Date: 2026-04-04 (UTC)

Legacy snapshot date for archived scenario body below: 2026-03-28 (UTC)

This document keeps the full historical scenario narrative from the previous model while adding an
explicit active-policy correction layer.

ACTIVE POLICY CORRECTION (CURRENT CONSENSUS)

The long scenario body below is a historical snapshot for audit traceability. The current live constants
in `Src/Utility/const.py` are:

- block target: `120s` (`262,800` blocks/year)
- pre-tail schedule: 8 eras of `1,000,000` blocks
  - rewards: `50, 25, 12.5, 6.25, 3.125, 1.5625, 0.78125, 0.390625 ATHO/block`
- bootstrap allocation: `390,625 ATHO` at block `1`
- total pre-tail base target: `100,000,000 ATHO`
- tail start height: `8,000,000`
- tail reward: `0.1953125 ATHO/block`
- fee floor: `250 atoms/vB` (`0.00000025 ATHO/vB`)
- max block policy budget: `3,500,000 vbytes`
- post-tail pool routing: `50%` (miner `25%`, stake `25%`)
- post-tail non-pool routed share: `50%`, with `100%` burn target on that non-pool share
- supply floor: `21,000,000 ATHO`

Derived current-reference points at 100% utilization:
- annual fee pool: `229,950 ATHO/year`
- annual burn-path max: `114,975 ATHO/year`
- annual tail issuance: `51,328.125 ATHO/year`
- net annual protocol delta at full utilization: `-63,646.875 ATHO/year`
- neutrality pivot utilization: `~44.64%`

The historical sections below remain intentionally detailed, but should be interpreted as
legacy-policy analysis unless/until scenario files are regenerated under current constants.

SCOPE AND METHOD (LEGACY SNAPSHOT BODY BELOW)

LEGACY SCENARIO BODY (ARCHIVED POLICY CONSTANTS)

CONSENSUS ALIGNMENT STATUS

PASS: Year-250 supply ordering NoBurn >= Burn25 >= Burn50 >= Burn75 >= Burn100.

PASS: no_burn_100 post-tail net change matches tail_issuance - burned_fees.

PASS: burn_25 post-tail net change matches tail_issuance - burned_fees.

PASS: burn_50 post-tail net change matches tail_issuance - burned_fees.

PASS: burn_75 post-tail net change matches tail_issuance - burned_fees.

PASS: burn_100 post-tail net change matches tail_issuance - burned_fees.

PASS: Annual burn never exceeds annual fee pool.

PASS: Burn activation flips between year 79 (off) and 80 (on) in sampled yearly outputs.

Consensus alignment checks verify that the model schedule and policy math match live constants (tail
start, fee floor, burn split, and supply floor). The same constants are enforced during block verification
and persistence in the node, so model and chain policy remain coupled.

EMISSION SHAPE

Pre-tail emission is fixed by the 5-era + transition reward sequence (10 -> 5 -> 2.5 -> 1.25 -> 0.625 ->
0.3125 (until 29,950,000 subsidy) ATHO/block), producing an exact pre-tail issuance of 30,000,000.000
ATHO. Tail mode starts at height 20,942,000 (~year 79.69). Tail activation combines two transitions:
reward moves from 0.3125 to 0.2500 ATHO/block, and burn policy activates.

Tail annual issuance is 65,700.000 ATHO. At 100% policy-budget utilization, annual fee pool is 147,825.000
ATHO and max annual burn equals 118,260.000 ATHO. Therefore post-tail protocol net supply change is a
linear function of utilization: Delta_supply = tail_issuance - max_annual_burn * utilization.

SCENARIO OUTCOMES

Year-250 circulating supply ordering is strictly monotonic: NoBurn100=41,189,500.000 ATHO,
Burn25=36,133,885.000, Burn50=31,078,270.000, Burn75=26,022,655.000, Burn100=21,000,000.000. This confirms
expected policy behavior: greater sustained utilization under burn policy removes more aggregate fees from
circulating supply.

At year 100, NoBurn100 exceeds Burn100 by 2,483,460.000 ATHO. At year 250, Burn100 is 49.016% below
NoBurn100. These are material differences for long-horizon communications and treasury planning, so
scenario labels must always accompany projected supply numbers.

Protocol-only deflation threshold is >55.556% utilization. Under current constants, that means the
protocol can be inflationary at low-to-mid utilization but deflationary in sustained high-usage regimes.

FEE MARKET AND USER COSTS

Model baseline uses 566 vB as representative transaction size, so typical fee at floor is 0.000127 ATHO. A
2,000-vB heavy transaction costs 0.000450 ATHO. Fee burden therefore scales linearly with vsize and market
price, so any public affordability claim should publish both coin-denominated and fiat-translated cost
bands.

Throughput and fee policy are coupled. If the realized transaction-size distribution shifts upward, fees
per transaction increase even when fee-per-byte policy remains unchanged. The model already includes
measured vsize references to avoid treating all traffic as uniform 1-in/2-out activity.

MINER ECONOMICS

Post-tail miner income in NoBurn100 is 213,525.000 ATHO/year. In Burn100 it is 65,700.000 ATHO/year
because fee share is policy-limited to 0.0%. The difference is 147,825.000 ATHO/year (69.231%).

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

No Burn (100% block capacity): year25 circulating=25,508,750.000 ATHO, year50=27,561,875.000,
year100=31,334,500.000, year250=41,189,500.000. Annual net change at year250 is 65,700.000 ATHO with
annual net rate 0.160%.

Burn On (25% block capacity): year25 circulating=25,508,750.000 ATHO, year50=27,561,875.000,
year100=30,713,635.000, year250=36,133,885.000. Annual net change at year250 is 36,135.000 ATHO with
annual net rate 0.100%.

Burn On (50% block capacity): year25 circulating=25,508,750.000 ATHO, year50=27,561,875.000,
year100=30,092,770.000, year250=31,078,270.000. Annual net change at year250 is 6,570.000 ATHO with annual
net rate 0.021%.

Burn On (75% block capacity): year25 circulating=25,508,750.000 ATHO, year50=27,561,875.000,
year100=29,471,905.000, year250=26,022,655.000. Annual net change at year250 is -22,995.000 ATHO with
annual net rate -0.088%.

Burn On (100% block capacity): year25 circulating=25,508,750.000 ATHO, year50=27,561,875.000,
year100=28,851,040.000, year250=21,000,000.000. Annual net change at year250 is -19,600.000 ATHO with
annual net rate -0.093%.

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
19,760,000.000 ATHO, cumulative burned 0.000 ATHO, and annual net change 1,314,000.000 ATHO. This
checkpoint reinforces that cumulative burn tracks utilization and burn policy directly, while net-rate
drift depends on the ratio of annual delta to existing circulating base.

Appendix note 2: For No Burn (100% block capacity) at year 25, annual issuance remains 164,250.000 ATHO
and annual fee pool assumption is 147,825.000 ATHO. Under the configured burn split, annual burned amount
is 0.000 ATHO and miner revenue is 312,075.000 ATHO. This makes token flow decomposition explicit for
auditing and economics review.

Appendix note 3: The No Burn (100% block capacity) curve at year 50 shows net rate 0.299% with TPS
estimate 36.800. Even though TPS is scenario-constrained in this model, net supply behavior is controlled
by utilization and burn policy rather than by nominal subsidy transitions after tail start.

Appendix note 4: At year 75, scenario No Burn (100% block capacity) reports circulating supply
29,615,000.000 ATHO, cumulative burned 0.000 ATHO, and annual net change 82,125.000 ATHO. This checkpoint
reinforces that cumulative burn tracks utilization and burn policy directly, while net-rate drift depends
on the ratio of annual delta to existing circulating base.

Appendix note 5: For No Burn (100% block capacity) at year 100, annual issuance remains 65,700.000 ATHO
and annual fee pool assumption is 147,825.000 ATHO. Under the configured burn split, annual burned amount
is 0.000 ATHO and miner revenue is 213,525.000 ATHO. This makes token flow decomposition explicit for
auditing and economics review.

Appendix note 6: The No Burn (100% block capacity) curve at year 150 shows net rate 0.190% with TPS
estimate 36.800. Even though TPS is scenario-constrained in this model, net supply behavior is controlled
by utilization and burn policy rather than by nominal subsidy transitions after tail start.

Appendix note 7: At year 200, scenario No Burn (100% block capacity) reports circulating supply
37,904,500.000 ATHO, cumulative burned 0.000 ATHO, and annual net change 65,700.000 ATHO. This checkpoint
reinforces that cumulative burn tracks utilization and burn policy directly, while net-rate drift depends
on the ratio of annual delta to existing circulating base.

Appendix note 8: For No Burn (100% block capacity) at year 250, annual issuance remains 65,700.000 ATHO
and annual fee pool assumption is 147,825.000 ATHO. Under the configured burn split, annual burned amount
is 0.000 ATHO and miner revenue is 213,525.000 ATHO. This makes token flow decomposition explicit for
auditing and economics review.

Appendix note 9: The Burn On (25% block capacity) curve at year 10 shows net rate 7.123% with TPS estimate
9.200. Even though TPS is scenario-constrained in this model, net supply behavior is controlled by
utilization and burn policy rather than by nominal subsidy transitions after tail start.

Appendix note 10: At year 25, scenario Burn On (25% block capacity) reports circulating supply
25,508,750.000 ATHO, cumulative burned 0.000 ATHO, and annual net change 164,250.000 ATHO. This checkpoint
reinforces that cumulative burn tracks utilization and burn policy directly, while net-rate drift depends
on the ratio of annual delta to existing circulating base.

Appendix note 11: For Burn On (25% block capacity) at year 50, annual issuance remains 82,125.000 ATHO and
annual fee pool assumption is 36,956.250 ATHO. Under the configured burn split, annual burned amount is
0.000 ATHO and miner revenue is 119,081.250 ATHO. This makes token flow decomposition explicit for
auditing and economics review.

Appendix note 12: The Burn On (25% block capacity) curve at year 75 shows net rate 0.278% with TPS
estimate 9.200. Even though TPS is scenario-constrained in this model, net supply behavior is controlled
by utilization and burn policy rather than by nominal subsidy transitions after tail start.

Appendix note 13: At year 100, scenario Burn On (25% block capacity) reports circulating supply
30,713,635.000 ATHO, cumulative burned 620,865.000 ATHO, and annual net change 36,135.000 ATHO. This
checkpoint reinforces that cumulative burn tracks utilization and burn policy directly, while net-rate
drift depends on the ratio of annual delta to existing circulating base.

Appendix note 14: For Burn On (25% block capacity) at year 150, annual issuance remains 65,700.000 ATHO
and annual fee pool assumption is 36,956.250 ATHO. Under the configured burn split, annual burned amount
is 29,565.000 ATHO and miner revenue is 73,091.250 ATHO. This makes token flow decomposition explicit for
auditing and economics review.

Appendix note 15: The Burn On (25% block capacity) curve at year 200 shows net rate 0.105% with TPS
estimate 9.200. Even though TPS is scenario-constrained in this model, net supply behavior is controlled
by utilization and burn policy rather than by nominal subsidy transitions after tail start.

Appendix note 16: At year 250, scenario Burn On (25% block capacity) reports circulating supply
36,133,885.000 ATHO, cumulative burned 5,055,615.000 ATHO, and annual net change 36,135.000 ATHO. This
checkpoint reinforces that cumulative burn tracks utilization and burn policy directly, while net-rate
drift depends on the ratio of annual delta to existing circulating base.

Appendix note 17: For Burn On (50% block capacity) at year 10, annual issuance remains 1,314,000.000 ATHO
and annual fee pool assumption is 73,912.500 ATHO. Under the configured burn split, annual burned amount
is 0.000 ATHO and miner revenue is 1,387,912.500 ATHO. This makes token flow decomposition explicit for
auditing and economics review.

Appendix note 18: The Burn On (50% block capacity) curve at year 25 shows net rate 0.648% with TPS
estimate 18.400. Even though TPS is scenario-constrained in this model, net supply behavior is controlled
by utilization and burn policy rather than by nominal subsidy transitions after tail start.

Appendix note 19: At year 50, scenario Burn On (50% block capacity) reports circulating supply
27,561,875.000 ATHO, cumulative burned 0.000 ATHO, and annual net change 82,125.000 ATHO. This checkpoint
reinforces that cumulative burn tracks utilization and burn policy directly, while net-rate drift depends
on the ratio of annual delta to existing circulating base.

Appendix note 20: For Burn On (50% block capacity) at year 75, annual issuance remains 82,125.000 ATHO and
annual fee pool assumption is 73,912.500 ATHO. Under the configured burn split, annual burned amount is
0.000 ATHO and miner revenue is 156,037.500 ATHO. This makes token flow decomposition explicit for
auditing and economics review.

Appendix note 21: The Burn On (50% block capacity) curve at year 100 shows net rate 0.022% with TPS
estimate 18.400. Even though TPS is scenario-constrained in this model, net supply behavior is controlled
by utilization and burn policy rather than by nominal subsidy transitions after tail start.

Appendix note 22: At year 150, scenario Burn On (50% block capacity) reports circulating supply
30,421,270.000 ATHO, cumulative burned 4,198,230.000 ATHO, and annual net change 6,570.000 ATHO. This
checkpoint reinforces that cumulative burn tracks utilization and burn policy directly, while net-rate
drift depends on the ratio of annual delta to existing circulating base.

Appendix note 23: For Burn On (50% block capacity) at year 200, annual issuance remains 65,700.000 ATHO
and annual fee pool assumption is 73,912.500 ATHO. Under the configured burn split, annual burned amount
is 59,130.000 ATHO and miner revenue is 80,482.500 ATHO. This makes token flow decomposition explicit for
auditing and economics review.

Appendix note 24: The Burn On (50% block capacity) curve at year 250 shows net rate 0.021% with TPS
estimate 18.400. Even though TPS is scenario-constrained in this model, net supply behavior is controlled
by utilization and burn policy rather than by nominal subsidy transitions after tail start.

Appendix note 25: At year 10, scenario Burn On (75% block capacity) reports circulating supply
19,760,000.000 ATHO, cumulative burned 0.000 ATHO, and annual net change 1,314,000.000 ATHO. This
checkpoint reinforces that cumulative burn tracks utilization and burn policy directly, while net-rate
drift depends on the ratio of annual delta to existing circulating base.

Appendix note 26: For Burn On (75% block capacity) at year 25, annual issuance remains 164,250.000 ATHO
and annual fee pool assumption is 110,868.750 ATHO. Under the configured burn split, annual burned amount
is 0.000 ATHO and miner revenue is 275,118.750 ATHO. This makes token flow decomposition explicit for
auditing and economics review.

Appendix note 27: The Burn On (75% block capacity) curve at year 50 shows net rate 0.299% with TPS
estimate 27.600. Even though TPS is scenario-constrained in this model, net supply behavior is controlled
by utilization and burn policy rather than by nominal subsidy transitions after tail start.

Appendix note 28: At year 75, scenario Burn On (75% block capacity) reports circulating supply
29,615,000.000 ATHO, cumulative burned 0.000 ATHO, and annual net change 82,125.000 ATHO. This checkpoint
reinforces that cumulative burn tracks utilization and burn policy directly, while net-rate drift depends
on the ratio of annual delta to existing circulating base.
