# Atho Complete Whitepaper

Date: 2026-04-04

Complete PDF artifact: `Docs/Atho_Complete_Whitepaper_v2.0.pdf`

## 1. Executive Summary
Atho is a post-quantum UTXO blockchain that uses Falcon-512 signatures, SHA3-384 hashing, and a 120-second block target. The system is optimized around a hybrid architecture:
- Python for orchestration, APIs, and operator control.
- Native C/C++ binaries for cryptographic and performance-critical loops.

The current direction is throughput and determinism:
- compact binary transaction wire format,
- integer atom accounting end-to-end,
- hash-pinned native binary loading,
- CPU/GPU miner backends under one consensus path.
- Bonded Proof of Work (BPoW) with wallet staking as a separate role.

## 2. Current Protocol Direction
Compared with earlier snapshots, the current implementation formalizes these changes:

1. Binary-first transaction transport:
- Canonical transport codec is compact binary (`ATX2`, with `ATX1` decode compatibility).
- Witness is handled as raw bytes internally.

2. Integer accounting standardization:
- Consensus-critical value math is integer atoms.
- Display formats remain user-facing (`ATHO`, decimal strings, Base56 addresses) without changing internal math semantics.

3. Native acceleration and binary governance:
- Native bridges for signing-body hashing, UTXO batch checks, and CPU mining loops.
- GPU miner binaries (OpenCL baseline, CUDA where available).
- Per-binary SHA3-384 pinning and metadata in `Binaries/`.

4. Updated throughput model:
- Capacity estimates now use measured/derived `vsize` distributions rather than a fixed baseline tx size.

5. BPoW + wallet staking economics:
- miner eligibility is controlled by deterministic bond state,
- staking remains separate from block production,
- fee routing is deterministic and auditable at block level.

## 3. Protocol Snapshot
- Block interval target: `120` seconds.
- Difficulty retarget interval: `180` blocks.
- Transaction confirmations required: `10`.
- Coinbase maturity: `150` blocks.
- Block cap: `3,500,000` base bytes, `14,000,000` weight units.
- Transaction policy cap: `250,000 vB` per transaction.
- Transaction policy metric: SegWit-style `vsize`.
- Addressing: Base56 for users, HPK-based internal destination binding.
- Signature system: Falcon-512.
- Hashing: SHA3-384 for canonical tx/block identity operations.
- Active fee floor: `250 atoms/vB`.
- Active min tx fee: `100,000 atoms`.

### 3.1 Network Parameters (Operator Reference)
- Network mode set: `mainnet`, `testnet`, `regnet`
- Target block cadence: `120s`
- Difficulty retarget window: `180` blocks
- Median-time-past window: `13` blocks
- Future drift bound: `30s`
- Tx confirmations (standard): `10`
- Coinbase maturity: `150`
- Max block size: `3,500,000` bytes
- Max block weight: `14,000,000`
- Max transaction size policy: `250,000 vB`
- Fee floor: `250 atoms/vB`
- Minimum transaction fee: `100,000 atoms`
- Dust threshold: `250 atoms`
- BPoW enforcement height: `10,000`
- Bond requirement: `25 ATHO`
- Bond activation confirmations: `25`
- Slash penalty: `2.5 ATHO`
- Epoch/finalization windows: `720 / 3,600` blocks

## 4. Transaction Encoding and Capacity
Atho no longer relies on one static tx-size assumption. Effective tx size depends on:
- input count,
- output count,
- amount varint widths,
- witness lengths,
- optional metadata inclusion.

Current reference witness targets:
- Falcon signature: ~666 bytes (compressed range policy).
- Falcon public key: 897 bytes canonical (legacy-size acceptance can be policy-gated).

Representative current estimates (metadata empty, compressed witness, binary sizing path):
- `1 in / 1 out`: ~513 vB
- `1 in / 2 out`: ~566 vB
- `2 in / 2 out`: ~615 vB
- `3 in / 2 out`: ~664 vB

At 120-second blocks and 3.5M vbytes/block, this maps to approximately:
- ~56.9 TPS (`1 in / 1 out`)
- ~51.5 TPS (`1 in / 2 out`)
- ~47.4 TPS (`2 in / 2 out`)
- ~43.9 TPS (`3 in / 2 out`)

This supports the target operating band of sustained ~44-52 TPS under realistic mixes.

## 5. BPoW and Wallet Staking Architecture
### 5.1 Why BPoW Exists
Atho separates:
- **block production security** (PoW + miner bond),
- **capital participation rewards** (wallet staking).

This avoids validator-complexity while still adding economic commitment to mining behavior.

### 5.2 Core Parameters
- BPoW enforcement height: `10,000` (all networks by default).
- Bond requirement: `25 ATHO`.
- Bond activation confirmations: `25`.
- Unbonding delay: `10,080` blocks.
- Slash penalty: `2.5 ATHO`.
- Epoch length: `720` blocks.
- Finalization buffer: `3,600` blocks.
- Bootstrap allocation: `390,625 ATHO` at block `1`.

### 5.3 Deterministic Address Role Derivation
All role destinations are derived from raw Falcon public key bytes with domain separation.

Conceptual digest rules:
- regular: `SHA3-384("ATHO_ADDR_V1" || network || pubkey)`
- bond: `SHA3-384("ATHO_BOND_V1" || network || pubkey)`
- stake: `SHA3-384("ATHO_STAKE_V1" || network || pubkey)`

User-facing Base56 prefixes:
- mainnet: `A` regular, `B` bond, `S` stake
- testnet/regnet: `T` regular, `D` bond, `E` stake

Security intent:
- same key, different deterministic role address,
- no role confusion,
- no cross-replay between roles.

### 5.4 Miner Bond Lifecycle
Bond states:
- `pending`
- `active`
- `exiting`
- `unlockable`
- `withdrawn`

Transitions:
1. deposit to bond address -> `pending`
2. `25` confirmations -> `active`
3. explicit exit request -> `exiting`
4. unbond delay reached -> `unlockable`
5. withdrawal -> `withdrawn`

Top-up:
- if slashed below threshold, additional bond deposit + confirmations restore eligibility.

### 5.5 Wallet Stake Lifecycle
Stake states mirror deterministic lockup handling:
- deposit,
- activation,
- active accrual,
- exit request,
- unlock delay,
- withdrawal.

Wallet staking does not sign blocks and does not independently grant mining rights.

### 5.6 Block-Level Miner Proof (Consensus-Critical)
Each mined block carries:
- `miner_pubkey`
- `reward_address`
- `miner_signature`
- role tag (`bonded_pow_v1`)

Miner signature commits to block identity and reward destination so payout rewriting is prevented.

### 5.7 Validation and Slashing Classification
A block is slashable only when:
1. PoW is valid, and
2. deterministic consensus validity fails.

Examples:
- invalid miner signature,
- missing/invalid bond eligibility,
- invalid tx set / malformed structure / payout violation.

Non-slashable cases:
- stale/orphan block from honest race,
- reorged-out valid block,
- late but valid propagation.

### 5.8 Fee Routing and Epoch Settlement
Per block fee policy:
- +25% fee policy uplift over base constants,
- pre-tail: 40% to consensus-managed pool, 60% to non-pool path,
- post-tail: 50% to consensus-managed pool, 50% to non-pool path (tail burn-floor logic applies there).

Pool split:
- pre-tail: 20% miner-side pool, 20% wallet-stake pool
- post-tail: 25% miner-side pool, 25% wallet-stake pool

Miner-side sub-split:
- pre-tail: 0% winner-proportional, 20% bonded-idle distribution
- post-tail: 20% winner-proportional, 5% bonded-idle distribution

Settlement windows:
- epoch: `720` blocks
- finalization buffer: `3,600` blocks

### 5.9 Consensus-Managed Pool Address
Pool sink is deterministic and network-separated:
- mainnet: `P + Base56(SHA3-384("ATHO_PROTOCOL_POOL_MAINNET"))`
- testnet: `L + Base56(SHA3-384("ATHO_PROTOCOL_POOL_TESTNET"))`
- regnet: `L + Base56(SHA3-384("ATHO_PROTOCOL_POOL_REGNET"))`

### 5.10 Bootstrap and Activation Timeline
- Block `0`: genesis block (special bootstrap context).
- Block `1`: bootstrap allocation and normal state tracking begins.
- Height `10,000`: BPoW enforcement activates.

This gives miners deterministic onboarding runway before strict bond gating.

### 5.11 Bootstrap Allocation ("Premine") Clarification
Current bootstrap allocation:
- `390,625 ATHO` at block `1` (not block `0`).

Purpose:
- initial network bootstrapping,
- miner/bond onboarding runway before strict BPoW gating,
- deterministic launch allocation tracked under consensus rules.

Accounting posture:
- this allocation is consensus-accounted,
- included in supply/economic modeling,
- observable and auditable in block history.

## 6. Network Stack
The stack is layered for operational clarity and speed:
- Binary runtime + pinning (`Binaries/`, pin registry).
- Cryptographic runtime (Falcon CLI + optional FFI verifier).
- Transaction wire/validation pipeline (binary codec + integer accounting).
- Mining engines (CPU native bridge + GPU backends).
- API/GUI control plane.

Detailed architecture doc:
- [Network_Stack.md](Network_Stack.md)

## 7. Security Model
Security posture combines protocol-level rules and runtime integrity controls.

Protocol controls:
- deterministic transaction verification,
- strict fee and coinbase accounting,
- bounded PoW validation,
- UTXO spend checks and duplicate prevention.

Runtime controls:
- binary hash pinning,
- optional strict binary-path mode,
- explicit env-gated native library loading,
- authenticated API access and operator role boundaries.

## 8. Emissions and Incentives
Monetary policy remains atom-based and deterministic:
- pre-tail subsidy schedule reaches 99,609,375 ATHO and bootstrap adds 390,625 ATHO at block 1 (100,000,000 ATHO total pre-tail base),
- tail activation occurs at block 8,000,000 (about 30.44 years) with 51,328.125 ATHO annual post-tail issuance,
- tail reward: 0.1953125 ATHO/block,
- fee policy uplift: +25% over base fee constants (`250 atoms/vB` effective floor),
- fee routing: pre-tail 40% pool / 60% non-pool, post-tail 50% pool / 50% non-pool,
- tail burn target: 100% burn on routed non-pool fees with floor clipping safeguards.

Deterministic consensus-managed fee pool address is network-separated:
- mainnet: `P + Base56(SHA3-384("ATHO_PROTOCOL_POOL_MAINNET"))`
- testnet: `L + Base56(SHA3-384("ATHO_PROTOCOL_POOL_TESTNET"))`
- regnet: `L + Base56(SHA3-384("ATHO_PROTOCOL_POOL_REGNET"))`

Important modeling update:
- fee and throughput analysis uses dynamic `vsize` distributions, not a fixed tx byte baseline.

See:
- [Emissions.md](Emissions.md)
- [Emissions Modeling/Entire_Overview.md](Emissions Modeling/Entire_Overview.md)

## 9. Practical Operator Visibility
Operationally important observability surfaces include:
- block-level fee decomposition fields,
- bond/stake state DB tracking (`bond.lmdb`, `stake.lmdb`),
- consensus and emission logs,
- explorer/API paths for pool and payout visibility.

This is required so policy behavior is independently auditable in running networks.

## 10. Development and Hard-Fork Context
Atho is in active development. Consensus and encoding evolution can be introduced intentionally with network coordination and upgrade planning. This documentation reflects the current implementation path and expected migration model for future rule changes.

## 11. FAQ (Core)
### Q: What is the premine/bootstrap amount, and what is it for?
A: Atho currently uses a `390,625 ATHO` bootstrap allocation at block `1`. Its role is launch bootstrapping: enabling early miner/bond onboarding and predictable network activation before strict BPoW enforcement. It is consensus-accounted and visible on-chain.

### Q: Is block `0` treated the same as block `1`?
A: No. Block `0` is the genesis context. The bootstrap allocation is enforced at block `1`, and BPoW enforcement starts at height `10,000`.

### Q: What are the most important network parameters to know first?
A: `120s` block target, `180`-block retarget interval, `10` tx confirmations, `150` coinbase maturity, `250 atoms/vB` fee floor, and BPoW bond requirement `25 ATHO` with `25` confirmations.

### Q: Does wallet staking allow block production by itself?
A: No. Wallet staking is an economic participation role. Mining eligibility is determined by PoW plus active bond state under BPoW rules.

## 12. Conclusion
Atho is designed for a practical outcome: higher deterministic throughput while preserving post-quantum cryptographic direction and operator control. The architecture explicitly separates:
- control-plane ergonomics (Python), and
- execution-plane performance (native binaries).

That split is the core engineering strategy behind the chain's current optimization roadmap.
