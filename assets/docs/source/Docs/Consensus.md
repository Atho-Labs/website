# Atho Consensus (Current)

Date: 2026-04-04

This document defines active consensus-enforced behavior for blocks, transactions, fee routing, and BPoW state transitions.

## 1) Core Constants
From `Src/Utility/const.py`:
- Block target time: `120` seconds
- Difficulty retarget interval: `180` blocks
- Transaction confirmations required: `10` blocks
- Coinbase maturity: `150` blocks
- Max block base bytes: `3,500,000`
- Max block weight: `14,000,000`
- Max tx policy size (`vsize`): `250,000`
- Fee floor: `250 atoms` per policy byte (`vsize`)
- Min tx fee: `100,000 atoms`
- Dust limit: `250 atoms`

## 2) BPoW and Stake Constants
- BPoW enforcement height: `10,000` (`mainnet`, `testnet`, `regnet`)
- Bond requirement: `25 ATHO`
- Bond activation confirmations: `25`
- Unbond delay: `10,080` blocks
- Slash penalty: `2.5 ATHO`
- Epoch length: `720` blocks
- Finalization buffer: `3,600` blocks
- Bootstrap allocation: `390,625 ATHO` at block `1`

Primary data stores:
- `bond.lmdb` for miner bond lifecycle state
- `stake.lmdb` for wallet staking lifecycle state
- `utxo.lmdb` for standard spendable outputs

## 2.1 Deterministic Role Address Rules
Consensus role derivation is domain-separated from raw Falcon pubkey bytes:
- regular: `SHA3-384("ATHO_ADDR_V1" || network || pubkey)`
- bond: `SHA3-384("ATHO_BOND_V1" || network || pubkey)`
- stake: `SHA3-384("ATHO_STAKE_V1" || network || pubkey)`

Consensus does not trust user-facing string prefix alone. It validates deterministic derivation rules plus network role domains.

## 2.2 State Machines
Bond state machine:
- `pending` -> `active` -> `exiting` -> `unlockable` -> `withdrawn`

Stake state machine:
- `pending` -> `active` -> `exiting` -> `unlockable` -> `withdrawn`

Both are enforced by deterministic height and confirmation checks. No state transition is accepted if preconditions fail.

## 3) Fee Routing and Pool Rules
- Fee uplift policy: `+25%`
- Fee pool routing:
  - pre-tail (`height < 8,000,000`): `40%` of total fees (`20%` miner-side, `20%` stake-side),
  - post-tail (`height >= 8,000,000`): `50%` of total fees (`25%` miner-side, `25%` stake-side).
- Miner-side split:
  - pre-tail: `0%` winner-proportional, `20%` bonded-idle split (of total fees),
  - post-tail: `20%` winner-proportional, `5%` bonded-idle split (of total fees).
- Burn policy at tail: `100%` burn on routed non-pool fees (subject to floor clipping).

Consensus-managed pool address is deterministic and network-separated:
- mainnet: `"P" + Base56(SHA3-384("ATHO_PROTOCOL_POOL_MAINNET"))`
- testnet: `"L" + Base56(SHA3-384("ATHO_PROTOCOL_POOL_TESTNET"))`
- regnet: `"L" + Base56(SHA3-384("ATHO_PROTOCOL_POOL_REGNET"))`

## 4) Transaction Consensus Path
Primary code:
- `Src/Main/txveri.py`
- `Src/Transactions/txvalidation.py`

Consensus checks include:
- canonical serialization/hash consistency,
- Falcon signature validity,
- UTXO existence + unspent state,
- no in-block or mempool double spend,
- strict integer-atom conservation,
- fee floor by canonical `vsize`,
- role/address consistency checks for bond/stake specific flows.
- rejection if role-targeted lockup paths do not match derived ownership semantics.

## 5) Signature and Witness Rules
- Transport codec is binary (`ATX2`; `ATX1` decode compatibility).
- Witness is processed as bytes in consensus paths.
- Falcon witness policy:
  - signature bytes in `600..690` (target `666`)
  - pubkey bytes `897` canonical
  - legacy 1024-byte pubkey acceptance is disabled by default.

## 6) Block Consensus Path
Primary code:
- `Src/Main/blockveri.py`
- `Src/Main/consensus.py`

Block acceptance enforces:
- parent linkage and index continuity,
- PoW target validation,
- merkle/witness commitment checks,
- byte and weight limits,
- coinbase payout invariants,
- tx list validity under active tx rules,
- BPoW miner metadata checks (`miner_pubkey`, `reward_address`, `miner_signature`, role tag),
- active bond eligibility once BPoW is active.

## 6.1 Slashable vs Non-Slashable
Slashable:
- PoW-valid block that is consensus-invalid (miner proof, bond eligibility, tx validity, structure, or reward correctness).

Not slashable:
- stale/orphan valid block from honest race,
- reorged-out valid block,
- late but otherwise valid relay.

This distinction is deterministic and required for safe slashing enforcement.

## 7) Monetary Invariants
- All consensus value math is integer atoms.
- Coinbase payout must match:
  - block subsidy +
  - miner-routed fee share for that height.
- Tail-era floor clipping guarantees effective circulating supply cannot burn below `21,000,000 ATHO`.
- Pool routing is consensus-accounted independently (`fees_pool_atoms`) and cannot be user-spent by arbitrary keys.

## 8) Throughput Framing (Policy)
At `3,500,000 vB` and `120s`:
- `566 vB` avg tx -> `~51.5 TPS`
- `615 vB` avg tx -> `~47.4 TPS`
- `664 vB` avg tx -> `~43.9 TPS`

These are policy-capacity estimates. Real throughput depends on tx mix and sustained utilization.

## 9) Engine Independence
CPU and GPU miners are execution backends only. Consensus validity is engine-independent: a valid block verifies identically regardless of mining backend.

## 10) Related Docs
- [Network_Stack.md](Network_Stack.md)
- [Tx.md](Tx.md)
- [Sigwit.md](Sigwit.md)
- [Falcon512.md](Falcon512.md)
- [Emissions.md](Emissions.md)
- [WhitePaper.md](WhitePaper.md)
