# Atho Transaction Security Audit FAQ (Public + Private)

Version: 2026-04-08
Scope: Consensus, mempool, public UTXO flow, private note flow, signature binding, replay/malleability, double spend, state recovery, reorg safety, and operational abuse resistance.

This document is a full FAQ-style security audit summary for Atho transaction security. It is written for operators, contributors, and reviewers who need both a high-level and code-level explanation of how transaction security works today, what was validated, what was fixed, and what remains to harden.

---

## Quick Summary

- We executed a high-volume private transaction adversarial suite at **20,000 attack points** (`sandbox_private_tx_attack_audit.py --attack-points 20000 --strict`) and it passed completely.
- We executed an additional focused private red-team run at **500 attack points** (`sandbox_private_tx_attack_audit.py --attack-points 500 --strict`) and it passed completely.
- We executed the crypto attack suite (`sandbox_crypto_attack_audit.py --timing-samples 2000 --strict`) and it passed completely.
- We executed consensus, fuzz, advanced edge, full integrated, and BPoW attack suites.
- The strict failures in those suites are largely due to **harness drift** (old fee assumptions, old bond assumptions, and old block-private-root assumptions), not successful bypasses.
- Current code already includes hardening across public input duplication, private nullifier replay, private commit collision handling, private input/output amount handling, and deterministic private output commitment transformation.

The practical conclusion is: core anti-double-spend and anti-forgery controls are present and active in the code paths that matter for mempool admission and consensus verification. The largest current operational risk is not “easy exploit bypass,” but policy/config mismatches between old test harness templates and newer stricter consensus rules.

---

## Audit Method

### What was attacked?

We attacked:

1. Public transaction admission and consensus validation.
2. Private transaction vectors (private inputs, nullifiers, anchors, Merkle paths, note spend signatures).
3. Mempool replacement and collision logic.
4. Block-level acceptance rules and anti-malleability fields.
5. Fee policy abuse vectors.
6. Reorg depth and finalization boundary behavior.
7. BPoW eligibility and bond/stake policy surfaces.
8. Fuzz/mutation differentials and malformed payload handling.
9. LMDB corruption/poisoning behavior for fail-closed semantics.

### Tools used

- `scripts/sandbox_private_tx_attack_audit.py --attack-points 20000 --strict`
- `scripts/sandbox_crypto_attack_audit.py --timing-samples 2000 --strict`
- `scripts/sandbox_consensus_attack_audit.py --strict`
- `scripts/sandbox_fuzz_mutation_diff_audit.py --tx-fuzz-cases 2000 --block-fuzz-cases 2000 --diff-cases 500 --strict`
- `scripts/sandbox_advanced_edge_audit.py --strict --multi-node-count 12 --dos-invalid-tx-count 3000 --dos-orphan-count 2000 --dos-valid-block-count 60`
- `scripts/sandbox_full_attack_audit.py --strict --low-epoch-length 720 --low-finalization-buffer 3600 --falcon-timing-samples 2000`
- `scripts/sandbox_bpow_flow_audit.py --strict`

### Result files

- `sandbox/private_tx_attack_audit/reports/private_tx_attack_audit_20260408_171543.json`
- `sandbox/private_tx_attack_audit/reports/private_tx_attack_audit_20260408_173046.json`
- `sandbox/private_tx_attack_audit/reports/private_tx_attack_audit_20260408_181807.json`
- `sandbox/crypto_attack_audit/reports/crypto_attack_audit_20260409_001609.json`
- `sandbox/consensus_attack_audit/reports/consensus_attack_audit_20260408_171815.json`
- `sandbox/consensus_attack_audit/reports/consensus_attack_audit_20260408_173347.json`
- `sandbox/fuzz_mutation_diff_audit/reports/fuzz_mutation_diff_audit_20260408_171627.json`
- `sandbox/advanced_edge_audit/reports/advanced_edge_audit_20260408_171844.json`
- `sandbox/full_attack_audit/reports/full_attack_audit_20260408_171838.json`
- `sandbox/full_attack_audit/reports/full_attack_audit_20260408_173411.json`
- `sandbox/bpow_flow_audit/reports/bpow_flow_audit_20260408_171624.json`

---

## Focused Private Red-Team Run (500 Points)

This run was requested as a deep private-only attack sweep focused on consensus-relevant private spend manipulation vectors.

Command:

- `python3 scripts/sandbox_private_tx_attack_audit.py --attack-points 500 --strict`

Result:

- `ok=true`
- `passed=500`
- `failed=0`
- report: `sandbox/private_tx_attack_audit/reports/private_tx_attack_audit_20260408_181807.json`

Scenario coverage (all passed):

- `duplicate_nullifier_in_tx`
- `duplicate_nullifier_overlay`
- `nullifier_confirmed`
- `nullifier_pending_conflict`
- `nullifier_pending_same_tx_allowed`
- `note_missing`
- `note_already_spent`
- `note_pk_missing`
- `note_pk_mismatch`
- `anchor_unknown`
- `anchor_expired_invalid`
- `anchor_future_block_mode`
- `merkle_path_invalid`
- `amount_commit_mismatch`
- `signature_invalid`
- `pin_signature_length_invalid`
- `pin_note_pk_length_invalid`
- `pin_merkle_path_length_invalid`
- `pin_nullifier_length_invalid`
- `pin_commit_length_invalid`
- `private_vectors_on_non_private_version`
- `private_version_without_vectors`
- `reserve_pending_conflict`
- `reserve_pending_add_fail`
- `baseline_valid`

Hardening outcome from this 500-point run:

- No accepted bypass was observed.
- No new consensus-acceptance bug was found in this run.
- Therefore, no emergency hotfix was required from this specific pass.
- Existing hardening actions from earlier passes remain the current recommended baseline.

---

## What Was Fixed (Code-Level)

The following defenses are now present in current code and directly address high-risk transaction attack vectors.

### 1) Duplicate public input outpoint rejection

- Added explicit duplicate-input outpoint rejection in transaction validation.
- Added mempool-level duplicate public input reference checks before admission.

Why this matters:

- Stops same-transaction self-double-spend attempts.
- Prevents malformed transactions from creating ambiguous spend graphs.

### 2) Block-overlay protection for private spend collisions

- Added block-overlay checks for private input commits and private output commits.
- Prevents two transactions in the same block from spending the same private input commit.
- Prevents duplicate private output commit insertion in a block assembly cycle.

Why this matters:

- This closes a class of miner-assembly collision attacks where mempool-local checks are not enough.

### 3) Mempool indexes for private commit conflicts

- Added in-memory commit indexes:
  - private input commit -> tx owner
  - private output commit -> tx owner
- Enforced commit conflict checks during add/remove/load paths.

Why this matters:

- Rejects parallel conflicting private spends earlier.
- Rejects duplicate output commitment reuse attempts in pending state.

### 4) Stronger private amount handling at mempool path

- For private vector validation, mempool mode now rejects cases where required amount fields are unavailable.
- Enforces negative-amount rejection on private input/output amount data.

Why this matters:

- Stops “hidden amount fallback” abuse in the mempool path.
- Keeps fee and accounting checks meaningful before block inclusion.

### 5) Deterministic v5 output commitment conversion for block path

- Added deterministic blinding-factor derivation for mempool-form to block-form conversion (`amount_plain` -> `amount_commit`) in v5/product-v1 path.

Why this matters:

- Prevents commitment drift across conversions.
- Protects signature preimage consistency when block-mode transformation occurs.
- Addresses instability/malleability-like behavior that can show as block rejection.

### 6) Privacy-safe default for mixed public/private send construction

- When caller requests private recipients with private inputs, public leg is suppressed by default unless explicitly enabled.

Why this matters:

- Prevents accidental public linkage from mixed-output send requests.
- Reduces privacy foot-guns by default.

### 7) Wallet note-state maturity refresh improvements

- Key manager reconciliation now re-evaluates note state using refreshed `created_height` / `leaf_index` metadata.
- Better transitions between `pending_receive` and `unspent` using confirmation policy and current tip state.

Why this matters:

- Fixes intermittent note-visibility and spendability inconsistencies after restart/reorg.
- Reduces UI-level “note disappeared” behavior caused by stale state transitions.

---

## High-Level Security Posture

### Public UTXO path

- Ownership binding: signer pubkey-derived role addresses are enforced against consumed UTXO owner hash.
- Coinbase maturity: enforced by required confirmation depth.
- Fee floor and minimums: enforced by vsize policy and absolute minimum fee.
- Dust rejection: output dust floor enforced.
- Duplicate outpoint defenses: now in verifier and mempool.

### Private note path

- Required fields: commit/nullifier/anchor/leaf/merkle path/note_pk/signature structure parsing.
- Nullifier replay prevention:
  - confirmed set checks
  - pending set checks
  - block overlay checks
- Anchor validity and Merkle path verification enforced against private note store.
- Note spend signature verifies against stored note public key and computed spend digest.
- Duplicate private commit handling now protected in mempool and block overlays.

### Block-level private safety

- Private notes root requirements are enforced for blocks containing private-layer-v1 activity.
- Hidden supply accumulator consistency checks are enforced.
- Aggregate proof gate rejects missing/invalid placeholder and requires configured behavior.

---

## FAQ (Detailed)

## Q1) Did you actually run a 20,000-point private attack pass?

Yes. The private transaction attack suite was run with `--attack-points 20000 --strict`, and passed fully: 20,000/20,000. This validates broad private-path defenses under high mutation volume (field tampering, malformed combinations, and replay-oriented permutations) without successful bypass in that suite.

## Q2) Did cryptographic attack probes pass?

Yes. The crypto suite run with 2,000 timing samples passed 55/55 checks. This does not mean “perfect cryptography forever,” but it confirms no immediate failures were found in the tested signature and crypto-path behavior under the current audit harness.

## Q3) Why do some strict suites still fail?

Most strict failures are from harness assumptions that no longer match chain policy:

- Old fee assumptions below current per-vbyte floor.
- Old bond seed values above current per-address bond cap.
- Crafted private-activity blocks omitting now-required `private_notes_root` metadata.

Those failures are expected rejects under stricter rules, not accepted attacks.

## Q4) Are those failures still important?

Yes, operationally. Even if they are not exploit bypasses, they indicate testing drift. A stale harness can hide real regressions in future runs because it fails too early for wrong reasons. Recommended fix is to update the harness templates to current constants and block-shape requirements so strict suites measure intended predicates.

## Q5) How is public double spend blocked?

Three layers:

1. Transaction-level duplicate outpoint rejection.
2. Mempool reservation/index conflict rejection for already-referenced outpoints.
3. UTXO store spent-status checks at admission and verifier paths.

Together these prevent both same-tx and cross-tx mempool spend collisions.

## Q6) How is private double spend blocked?

Private spends use nullifiers plus commit tracking:

- Nullifier must be unique per spend.
- Nullifier cannot already be confirmed.
- Nullifier cannot be pending in another tx.
- Input commit cannot be duplicated in same tx.
- Input commit collision can be detected in block overlay and mempool index.

This is the private equivalent of UTXO spend reservation.

## Q7) Can an attacker fake a private note and spend it?

Not if the validator path is followed:

- Commit must exist in private note store.
- `note_pk` in tx input must match stored note.
- Anchor must be valid at the reference height.
- Merkle path must verify.
- Spend signature must verify against the stored note public key and computed digest.

Without all of those, spend is rejected.

## Q8) Can someone reuse a nullifier but make it look different?

The nullifier is normalized and tracked. Reuse across casing/format variants is handled because values are parsed and normalized before checks. Duplicate or pending/confirmed collisions are rejected.

## Q9) Can someone include two private spends of same note in one block?

The new overlay checks reduce this risk significantly:

- Per-block private input commit overlay now rejects same-commit double spend in a block assembly cycle.
- Nullifier overlays also block repeated nullifier references.

## Q10) Can someone create money from thin air with private amounts hidden?

In normal validated flows, no. The system uses private amount commitments and block-level proof/accumulator gates. However, this is a sensitive area: correctness depends on enforcement of the proof gate and commitment consistency checks. Current implementation rejects placeholder proofs and validates private-layer block metadata. This is strong policy-gating, but should continue to mature toward full cryptographic proof enforcement everywhere.

## Q11) Is private tx malleability still possible?

Key defenses:

- Private spend preimage uses `txid_without_signatures` and normalized payload rules.
- Private input signatures are verified on deterministic digest construction.
- Deterministic v5 block conversion for `amount_commit` removes conversion drift.

Residual risk is lower now than before deterministic conversion patch.

## Q12) Why was deterministic v5 conversion necessary?

If mempool-form private outputs and block-form private outputs use non-deterministic conversion inputs, signatures and expected commitments can desync across contexts, causing valid-looking tx to fail at block time. Deterministic conversion makes conversion reproducible and removes that attack/failure surface.

## Q13) How does the system stop output commitment duplication?

- In-tx duplicate output commit rejection.
- Mempool output-commit index conflict checks.
- Existing confirmed note commit collision checks.
- Block overlay checks for duplicate output commits.

## Q14) Can a tx with malformed private fields bypass checks?

Parsing enforces field shape and constraints first. Invalid encoding or missing required fields causes parse failure before spend logic. This is a fail-closed design point.

## Q15) Does private tx require top-level pubkey/signature?

For pure private-input spends, authentication is done by per-input private signatures bound to note ownership and spend digest. Public-input transactions still require top-level witness/signature handling.

## Q16) What about replay attacks on old private spends?

Replay of a spent private note should fail due to nullifier confirmed/pending checks and note spent status. Replay of public spends fails via UTXO spent-status and mempool reservation.

## Q17) Can someone inject invalid tx_out_id references?

Yes as an attack attempt, but those are rejected by strict input format parsing and outpoint validation.

## Q18) Can malformed merkle_path data crash validation?

The parser and validator reject malformed path formats. The attacker can produce rejection noise (DoS attempts), but not bypass acceptance by malformed path alone.

## Q19) How are fee-based mempool replacement attacks handled?

Mempool replacement policy enforces fee delta and fee-rate bump requirements. Low-quality replacement attempts should fail and not evict better pending tx.

## Q20) Is dust spam blocked?

Public outputs are dust-checked against configured dust limit. Outputs below threshold are rejected.

## Q21) Is coinbase maturity enforced?

Yes. Spends of coinbase UTXO are blocked until required confirmation threshold is reached.

## Q22) Are lockup roles (bond/stake) protected?

Yes, role-based spend constraints are enforced. The signer must match the role-derived owner address, and lockup spend operations require appropriate metadata and unlockable state.

## Q23) Can attacker bypass ownership by setting tx_input.address?

No. Ownership is primarily validated against UTXO owner hash and signer-derived role addresses. Input address hints do not override ownership checks.

## Q24) Why do some BPoW strict runs fail early now?

Because strict harness seed values exceed current bond cap, and current code correctly rejects those deposits. That is expected under strengthened bond policy.

## Q25) Is that a consensus weakness?

No. It is stronger policy enforcement. The weakness is only in stale test vectors that were not updated after policy hardening.

## Q26) What does `private_notes_root missing/invalid` failure mean?

It means crafted blocks with private-layer-v1 activity must include correct private notes root metadata. Missing or malformed value is rejected. This is an integrity requirement, not an exploit success.

## Q27) Why does this show up frequently in strict attack logs?

Because many attack vectors intentionally craft malformed blocks and private metadata. Under stricter validation, they fail at this gate first.

## Q28) Is there a fake-note injection risk through mempool only?

Mempool does not finalize state by itself. Even if an attacker floods fake private records, block-level and verifier-level checks still enforce note existence, ownership proof, and nullifier rules before acceptance.

## Q29) Can pending-state races cause double spend?

Potential race classes are reduced by lock-protected mempool indexes and pending nullifier reservation. The design intends fail-closed behavior under conflict.

## Q30) Are private and public flow accounting both checked?

Yes. Amount checks combine public and private components where available, enforce non-negative constraints, and enforce accounting consistency unless hidden amount mode requires proof-based policy path.

## Q31) What happens when amount data is unavailable in mempool path?

Now rejected for mempool private input/output validation where required. This closes an ambiguity path where hidden amounts could previously delay arithmetic accountability.

## Q32) How do reorgs affect private notes?

Reorg handling depends on private note store and key manager reconciliation. Recent key manager changes improved pending/unspent recomputation based on refreshed metadata (`created_height`, `leaf_index`) and confirmation thresholds.

## Q33) Can wallet note states desync after restart?

That was a practical issue. Current reconciliation logic improved this by re-evaluating state from freshest chain/scanner metadata and clearing stale pending-spend tags when necessary.

## Q34) Is there still a residual risk in UI note visibility?

UI can still appear inconsistent if backend state is changing rapidly during sync/reorg windows. Core fix priority is deterministic backend note state first; UI should consume that state without local heuristics.

## Q35) Does the code protect against transaction format injection?

Yes. Standardization/parsing steps and structural validation reject malformed transaction shapes, missing required fields, invalid address prefixes, invalid fee precision, and invalid tx version activation.

## Q36) Are old versions replayable under new rules?

Version gating (`tx_version_allowed` and private version activation checks) limits when versions are accepted. This reduces cross-era replay and malformed-version injection.

## Q37) What about consensus payout transaction abuse?

Consensus payout tx are block-only and have strict constraints: no arbitrary signature/pubkey witness usage, sender pool-address checks, metadata sequence consistency, and expected fee routing fields.

## Q38) Can invalid block hash / previous hash / merkle tampering pass?

No. Block verifier rejects hash mismatch, previous-hash mismatch, merkle mismatch, and invalid PoW target checks.

## Q39) Is there an attack where private output creates public linkage by mistake?

This is mostly a construction-side privacy foot-gun. Current API logic now defaults to suppressing accidental mixed public leg when building private-input private-recipient sends, unless explicitly allowed.

## Q40) Is this enough for “maximum unlinkability”?

It materially improves unlinkability safety defaults, but maximum unlinkability still depends on end-to-end transaction construction policy, wallet behavior, metadata hygiene, and ensuring no unintended public outputs are introduced by UI or caller flags.

## Q41) How are fake or corrupt storage records handled?

LMDB attack tests show many corrupted/poisoned records fail closed: lookup returns none or rejected state without accepting poisoned data as valid consensus state.

## Q42) Could an attacker bypass by forcing parser exceptions?

Parser exceptions generally produce rejection, not acceptance. This is fail-closed. Operationally, exception storms can still be used for resource pressure, so rate limiting and peer penalties remain important.

## Q43) Is there a timing side-channel concern around signature checks?

No immediate bypass was found in tested crypto suite. Still, side-channel hardening is a continuous process. Keep critical crypto operations in vetted libraries, avoid custom branching on secret-dependent material, and continue measurement-based regression tests.

## Q44) How is transaction signature binding enforced for public inputs?

Public-input tx require valid signer material, verify strict signing hash format, and bind ownership to signer-derived role addresses for consumed UTXOs. This blocks unauthorized spends even if tx format itself looks valid.

## Q45) Why did we see “missing transaction pubkey for ownership validation” in some prior runs?

That error indicates a transaction path that includes public inputs but omitted top-level signer witness fields. This is expected rejection for public-input ownership validation.

## Q46) Could private-input spends bypass with empty top-level pubkey?

Pure private spends do not depend on top-level pubkey; they use per-input private note signatures and proof material. That is expected architecture, not a bypass.

## Q47) How do nullifier overlays differ from note commit overlays?

- Nullifier overlay prevents replay of spend identity.
- Input commit overlay prevents duplicate spending of same note commit in block/mempool contexts.
- Output commit overlay prevents duplicate output note insertion collisions.

All three together provide stronger anti-collision coverage.

## Q48) Is fee policy itself part of security?

Yes. Fee floors are anti-DoS controls. Many strict harness cases now fail fee checks before deeper attack predicate checks because policy is tighter. This is desirable for production but requires attack harness updates for meaningful deep-path tests.

## Q49) Could old tests falsely imply vulnerabilities now?

Yes. If an attack case expects “invalid signature” but gets rejected earlier for “fee too low,” it still fails as an attack, but not for the intended reason. That means the harness needs policy-aligned baseline values to remain a precise security signal.

## Q50) What should be updated in harnesses immediately?

1. Update fee assumptions to current `FEE_PER_BYTE_ATOMS` and min fee.
2. Update bond seed amounts to current cap.
3. Ensure private-activity block fixtures include valid `private_notes_root` and required private metadata.
4. Ensure consensus payout sender fixtures match active allowed pool-address versions.

## Q51) How does code handle malformed tx input references?

It rejects invalid `tx_out_id` format, invalid vout parsing, and duplicate input references. This blocks malformed-reference injection and same-tx duplicate-spend attempts.

## Q52) Is transaction ID protected from witness-only mutation?

Current private preimage handling explicitly normalizes signature-bearing fields and private signature placeholder logic for txid_without_signatures. This reduces witness-induced malleability. Public-path signature binding is separately enforced by signature verification.

## Q53) How are private output amounts represented across mempool/block stages?

For product-v1 amount-commit mode:

- Mempool form uses amount plain field for policy/accounting checks.
- Block form uses amount commitment.
- Deterministic conversion now ensures stable commitment output and prevents drift.

## Q54) What is the direct benefit of deterministic conversion to consensus safety?

It prevents accidental consensus divergence where two nodes transform the same mempool transaction into different block commitments due non-deterministic blinding. Deterministic transformation means same input transaction yields same block commitment bytes across nodes.

## Q55) Does private note store enforce anchor freshness?

Yes. Anchor validity and anchor height relation checks are used in private input verification. Invalid/expired/unknown anchors are rejected.

## Q56) Is Merkle path verification optional?

No for valid private spend paths. Path verification is part of acceptance criteria.

## Q57) Can an attacker use valid signature with wrong note key?

No. Input note key must match stored note key, and signature is verified against stored key with computed spend digest.

## Q58) What if private input note exists but has unknown amount?

Mempool path now rejects this for required checks. Block path may support hidden amount mode with proof gate requirements, depending on current private policy.

## Q59) Are negative private amounts blocked?

Yes. Negative private component values are rejected explicitly.

## Q60) How is output dust handled for privacy sends?

Public outputs are dust-checked. Private outputs are governed by private parser/commit constraints and accounting/proof rules.

## Q61) Could someone submit consensus payout tx into mempool?

Rejected. Consensus payouts are block-only.

## Q62) Could someone use coinbase tx in mempool?

Rejected. Coinbase is block-internal only.

## Q63) How does node recover from mempool crashes regarding private nullifiers?

Mempool load/rebuild now reconstructs relevant indexes and can reconcile private pending-state journal behavior from pending transactions.

## Q64) Are private pending states cleared on tx removal?

Yes, removal paths clear pending nullifiers and pending note state for that tx.

## Q65) Are private spend commitments reconciled on confirmation?

Yes. Confirmation paths trigger reconciliation for confirmed private spends.

## Q66) What about replay after tx drop and resubmit?

Pending reservations are managed through add/remove reserve/release paths. A dropped tx can be retried; conflicting pending ownership should still block concurrent collision.

## Q67) Are there known unresolved gaps?

There are no obvious accepted bypasses in this audit pass, but key ongoing hardening areas remain:

- Keep strict attack harness fixtures aligned with policy constants.
- Continue deep testing around reorg + private note state transitions.
- Continue hardening for high-volume adversarial network traffic and peer-level abuse.

## Q68) Is “all attack vectors solved forever” realistic?

No. Security is continuous. This audit significantly raises assurance and closes concrete weaknesses, but threat models evolve. The correct stance is continuous attack simulation, constant policy alignment, and periodic independent review.

## Q69) What was the practical security impact of this cycle?

High practical impact on transaction integrity:

- Better collision prevention for both public and private spends.
- Better deterministic behavior for private commitment conversion.
- Better default privacy behavior in mixed send construction.
- Better wallet note state reconciliation under chain movement.

## Q70) What is your recommendation for production-readiness confidence?

For transaction-layer security specifically, confidence is strong for currently implemented controls when configured consistently. Final production confidence should include:

- policy-aligned attack harness baselines,
- regression runs per commit on all suites,
- external red-team pass on private flow and networking behavior,
- continued reorg and recovery chaos testing at scale.

---

## Attack Surface Map (Expanded)

This section enumerates the practical transaction attack surface in plain language and maps each to current defense layers.

### Surface A: Public input forgery

Attack idea:

- Attacker references someone else’s UTXO and signs with unrelated key.

Defense:

- UTXO ownership binding to signer-derived role addresses.
- Signature validation for public inputs.
- UTXO existence/spent-state checks.

Status:

- Defended.

### Surface B: Public input duplicate within same tx

Attack idea:

- Use same outpoint twice in one tx to confuse accounting.

Defense:

- Duplicate outpoint rejection in verifier and mempool.

Status:

- Defended; recently hardened.

### Surface C: Public mempool double spend across txs

Attack idea:

- Send two txs spending same UTXO; race mempool acceptance.

Defense:

- `utxo_index` reservation and replacement policy checks.

Status:

- Defended.

### Surface D: Private nullifier replay

Attack idea:

- Reuse nullifier to spend note again.

Defense:

- Confirmed and pending nullifier checks.
- Block and mempool overlays.

Status:

- Defended.

### Surface E: Private commit collision in same block

Attack idea:

- Miner packs conflicting private input commits.

Defense:

- Private spent commit overlay in verification cycle.

Status:

- Defended; recently hardened.

### Surface F: Duplicate private output commit insertion

Attack idea:

- Reuse output commitment to confuse note state.

Defense:

- In-tx duplicate rejection, mempool output-commit index checks, confirmed note commit existence checks, block overlay checks.

Status:

- Defended; recently hardened.

### Surface G: Fake private note injection

Attack idea:

- Construct private spend with made-up note data.

Defense:

- Commit must resolve to note store record.
- note_pk must match stored note.
- anchor + Merkle path verification.
- per-input signature verification.

Status:

- Defended.

### Surface H: Private amount ambiguity abuse

Attack idea:

- Use hidden/unknown amount fields to bypass arithmetic checks.

Defense:

- Mempool now rejects required missing amount paths.
- Block-level hidden mode gated by proof/accumulator policy.

Status:

- Defended with policy dependency.

### Surface I: Commitment drift / conversion instability

Attack idea:

- Non-deterministic conversion causes block mismatch or replay anomalies.

Defense:

- Deterministic v5 amount-commit conversion.

Status:

- Defended; recently hardened.

### Surface J: Consensus payout spoofing

Attack idea:

- Forge payout sender or metadata to divert pool funds.

Defense:

- Sender candidate checks, metadata checks, block-only policy, fee-route consistency checks.

Status:

- Defended.

### Surface K: Coinbase maturity bypass

Attack idea:

- Spend immature coinbase outputs.

Defense:

- Maturity confirmations enforced in UTXO validation.

Status:

- Defended.

### Surface L: Fee-floor bypass spam

Attack idea:

- Flood low-fee tx to pressure mempool/validation.

Defense:

- Required fee for vsize and minimum transaction fee checks.

Status:

- Defended; stronger policy now active.

### Surface M: Reorg depth abuse

Attack idea:

- Force extreme reorg depth beyond safe threshold.

Defense:

- Reorg depth limits and finalization boundary logic.

Status:

- Defended in tested behavior.

### Surface N: Storage poisoning attacks

Attack idea:

- Corrupt LMDB records to trigger invalid accepts.

Defense:

- Fail-closed decode/read behavior in tested components.

Status:

- Generally defended in tested scenarios.

### Surface O: Mixed public/private privacy foot-gun

Attack idea:

- User thinks send is private, wallet emits public output leg.

Defense:

- Privacy-safe API default suppresses unintended mixed public output unless explicitly allowed.

Status:

- Improved; now safer by default.

---

## Examples (Easy-to-Follow)

## Example 1: Public double spend attempt

Scenario:

- Tx A spends UTXO `X:0`.
- Tx B also spends `X:0` with similar fee.

Expected:

- First accepted (if valid), second rejected unless replacement policy conditions are met.

Security effect:

- Prevents two mempool tx from reserving same outpoint.

## Example 2: Same-tx duplicate input attack

Scenario:

- Attacker submits tx with two inputs both referencing `X:0`.

Expected:

- Rejected immediately due duplicate outpoint in transaction.

Security effect:

- Prevents malformed intra-tx spend duplication.

## Example 3: Private nullifier replay attack

Scenario:

- Attacker copies a valid private input and resubmits with same nullifier.

Expected:

- Rejected because nullifier is pending or confirmed.

Security effect:

- Stops replay of private spend identity.

## Example 4: Fake private note with wrong key

Scenario:

- Attacker references known commit but uses different `note_pk` and signature.

Expected:

- Rejected due note_pk mismatch and failed signature validation.

Security effect:

- Prevents unauthorized spend of existing note.

## Example 5: Block collision with duplicate private input commit

Scenario:

- Two txs in same block both try to spend same note commit.

Expected:

- Block tx verification fails via private spent commit overlay.

Security effect:

- Prevents miner-packing collision bypass.

## Example 6: Private output commitment reuse attack

Scenario:

- Attacker constructs output commit already present in pending or confirmed state.

Expected:

- Rejected by mempool commit index or confirmed note check.

Security effect:

- Prevents duplicate private output note insertion.

## Example 7: Hidden amount abuse attempt in mempool

Scenario:

- Private tx omits required amount where mempool path needs it.

Expected:

- Rejected in private vector validation.

Security effect:

- Removes ambiguous accounting windows in mempool admission.

## Example 8: Mixed-output privacy leak prevention

Scenario:

- Caller builds private-input private-recipient send but accidentally leaves public amount.

Expected:

- Public leg is suppressed by default unless explicitly opted in.

Security effect:

- Reduces accidental linkage.

---

## How Code Handles Critical Edge Cases

### Edge case: duplicate outpoint in one tx

- Handled in verifier and mempool.
- Result: rejection before consensus state mutation.

### Edge case: duplicate private nullifier in one tx

- Handled in private vector parse/validate checks.
- Result: reject.

### Edge case: duplicate private input commit in one tx

- Handled in private validation and mempool parser checks.
- Result: reject.

### Edge case: duplicate private output commit in one tx

- Handled in private validation and mempool parser checks.
- Result: reject.

### Edge case: duplicate private input spend across block txs

- Handled by private spent commit overlay.
- Result: block tx verification fails.

### Edge case: duplicate private output commit across block txs

- Handled by private output commit overlay.
- Result: block tx verification fails.

### Edge case: private note missing in store

- Private spend reject.

### Edge case: note already spent

- Private spend reject.

### Edge case: invalid anchor or stale anchor

- Private spend reject.

### Edge case: invalid Merkle path

- Private spend reject.

### Edge case: missing or invalid per-input private signature

- Private spend reject.

### Edge case: public output dust

- Reject below dust threshold.

### Edge case: fee too low for size

- Reject by fee floor.

### Edge case: consensus payout in mempool

- Reject (block-only).

### Edge case: coinbase tx in mempool

- Reject (block-internal only).

### Edge case: wrong network tx/block injection

- Reject network mismatch.

### Edge case: invalid block hash/merkle/target

- Reject block verification.

### Edge case: bad LMDB row payload

- Fail closed on read/decode in tested paths.

### Edge case: pending note state after restart

- Reconciliation logic re-evaluates maturity and state transition using refreshed metadata.

---

## Residual Risks and Next Hardening Priorities

1. Keep harness fixtures in sync with policy constants.
2. Continue stress-testing reorg + private state recovery under long-running adversarial workloads.
3. Keep proving/verifier external tools configured and monitored in environments requiring full private proof enforcement.
4. Add more explicit observability around private-note-root mismatch causes in miner path to shorten incident triage.
5. Maintain deterministic conversion invariants as protocol evolves.
6. Expand adversarial network simulation coverage for peer-quality poisoning and stale-tip behavior under partition.

---

## Final Statement

This cycle did not reveal an accepted consensus bypass in the audited transaction paths. It did reveal and confirm stronger policy enforcement that invalidates several old harness assumptions. Core transaction-layer defenses now include stricter duplicate-spend protections, stronger private commit/nullifier collision prevention, deterministic private output conversion behavior, safer private-send defaults, and improved wallet private-note state reconciliation.

From a transaction security perspective, Atho is materially stronger than earlier iterations. The next production-security gains come from keeping the harnesses policy-aligned, continuously running offensive regression suites, and maintaining strict fail-closed behavior in both parser and consensus paths as the private system evolves.

---

## FAQ Extended Threat Matrix (Q71-Q130)

## Q71) What prevents a private-input transaction from silently skipping ownership checks?

Private ownership validation is not optional in the accepted path. A private input must match an existing note commitment in the private note store, must present a `note_pk` matching that stored note, must include an anchor and Merkle path that verify, and must carry a valid spend signature bound to the private spend digest. If any of those fail, verification fails.

## Q72) Could an attacker craft a transaction that is valid in mempool but invalid in block, then exploit miner behavior?

This class of risk is exactly why deterministic transformation was added for v5 amount-commit conversion. Previously, non-deterministic conversion could create instability. Current code normalizes preimage/block transformation so the same private output conversion is reproducible across nodes and miner context. This significantly reduces mempool-to-block drift attacks.

## Q73) Could fake `script_sig` values in private-input transactions be used to bypass checks?

For pure private spends, spend authorization is not derived from top-level input `script_sig`; it is derived from per-private-input signatures and note ownership checks. For public inputs, `script_sig` is still tied to ownership signature checks. So forged script fields alone do not provide an authorization bypass.

## Q74) Can nullifier reuse be hidden by casing tricks, spacing, or alternate encoding?

No practical bypass was found under current parser normalization. Nullifiers are parsed and normalized before pending/confirmed comparisons. Duplicate nullifier checks then run both locally in-tx and against pending/confirmed sets. Normalization closes easy textual trick vectors.

## Q75) Can an attacker spend the same private note twice by changing only output layout?

No. Private spend uniqueness is tied to note/nullifier/commit checks, not output shape. If the same private note is attempted again, nullifier and input commit collision checks trip. Output permutations do not permit duplicate spending of one note.

## Q76) Could a malicious miner include two conflicting private spends in one block and rely on ordering?

Current block verification uses private overlays for nullifiers and input/output commitments. That means conflicts are detected in block assembly/verification context even when both transactions are present in one candidate block. This closes a high-value miner-ordering attack surface.

## Q77) Could a malicious node inject malformed private vectors to crash verifiers?

Malformed vectors are rejected during parse/shape validation. The expected behavior is fail-closed rejection, not acceptance. While malformed floods can still be used for resource pressure, they are not a direct integrity bypass. Operationally, rate limiting and peer penalties remain important for anti-DoS resilience.

## Q78) Is there protection against duplicate public inputs and duplicate private inputs in one tx?

Yes. Both paths now include explicit duplicate guards. Public outpoints are deduped during verification/mempool admission. Private inputs are deduped by commit and nullifier within transaction validation. These checks prevent ambiguous accounting in single transaction payloads.

## Q79) Can a private output commitment be replayed to confuse wallet scanning?

Replay by commitment is blocked by confirmed commit existence checks and pending output-commit indexes. A commitment already known as confirmed or pending-conflicting is rejected. This blocks duplicate output-commit insertion as a state confusion strategy.

## Q80) How is "create value from thin air" addressed for hidden private amounts?

For mempool-path private checks, missing required amount fields are now fail-closed. For block paths in hidden-amount mode, acceptance is gated by private metadata and proof/accumulator rules. The rule is that hidden accounting must still pass consensus gates; hidden does not mean unvalidated.

## Q81) Is there a risk of accepting a private transaction without any private outputs?

Transaction shape rules and policy paths validate input/output structure. A private-input spend with missing outputs is not a valid value-preserving transaction under normal rules and should fail format/accounting validation. Tests should continue to cover this as a regression target.

## Q82) Could stale wallet note state allow spending a note that is already spent?

Wallet state is advisory; consensus decides final validity. The key manager reconciliation improvements reduce stale local state by recalculating maturity/state using refreshed metadata. Even if UI is stale, consensus/private-note-store checks still reject already-spent notes.

## Q83) What happens if private note metadata is partially missing after import/recovery?

Recovery logic now rehydrates and re-evaluates note state with updated created-height and leaf-index metadata, then transitions between `pending_receive` and `unspent` more safely. If metadata is insufficient, notes can remain pending until deterministic data is available.

## Q84) Could tx malleability still happen through witness mutation?

Public and private paths both reduce this risk through canonical hashing and signature binding. Private path specifically zeros/normalizes signatures for deterministic preimage construction and now aligns v5 conversion to block view. This greatly reduces witness-only mutation classes that previously caused acceptance instability.

## Q85) Could an attacker abuse lock-time/version edge cases to bypass checks?

Version and network gates are enforced. Transaction version schedule and private-activation checks constrain which versions are accepted at which heights. Malformed or non-activated versions are rejected. Lock-time and sequence semantics should continue to be fuzzed, but no direct bypass was observed in this cycle.

## Q86) Could the mempool accept txs that consensus later rejects and create exploitable divergence?

Mempool/consensus policy mismatch is always a risk in blockchain systems, but the current changes reduced high-impact mismatches in private vectors and commitment conversion. Remaining strict-suite failures are mostly fixture-policy mismatch (fee/bond/test block metadata), not observed exploitable acceptance mismatches.

## Q87) Could malicious peers spam replacement transactions to evict good txs?

Replacement policy requires meaningful fee delta and fee-rate bump, which raises the cost of eviction abuse. This does not remove all economic spam pressure, but it prevents trivial low-effort churn. Combined with size/fee floors, this is the expected defensive posture.

## Q88) What about timing attacks against signature verification?

The crypto audit with timing samples found no immediate practical bypass in tested paths. That said, timing side-channel hardening is continuous work. The correct posture is to keep critical operations in vetted libraries and maintain differential timing regression tests.

## Q89) Could invalid fee precision or decimal formatting bypass minimum fee checks?

Fee parsing and atom conversion paths normalize fee values before comparison. Minimum fee and per-vbyte required fee checks are performed on normalized atom values. This closes simple floating-format manipulation vectors.

## Q90) Could payload bloat in private fields bypass tx size/weight policy?

Private payload fields are subject to structural and size constraints by version and parser logic. Transaction weight/vsize policy still applies for admission and miner packing. Oversized or malformed payloads are rejected by parser or policy checks.

## Q91) Could a private tx be accepted with empty top-level `pubkey` and empty `signature`?

For pure private-input spends, yes, top-level public witness can be empty by design because spend authorization comes from private input signatures. That is not a bypass. For any spend that consumes public UTXOs, missing top-level witness is rejected by ownership checks.

## Q92) Could an attacker inject fake anchors that look syntactically valid?

Anchor syntax alone is insufficient. Anchor must exist in the tracked root set within validity windows and Merkle path verification must succeed relative to that anchor. Fake-but-formatted anchors fail the semantic checks.

## Q93) Is Merkle path replay from a different note possible?

Not if verifier checks are applied correctly. Path verification ties note, anchor, leaf index, and path relation. Reusing a path with mismatched note/leaf/anchor should fail verification.

## Q94) Could attackers exploit negative or overflow amounts in private outputs?

Negative amount handling is explicitly rejected in private accounting checks. Overflow conditions are constrained by atom conversion and field bounds. Additional fuzz for extreme integer boundaries remains useful, but current logic already contains explicit fail-closed checks.

## Q95) Can a note be marked spendable too early due to low confirmations in UI?

Consensus enforcement still guards final spend validity. UI maturity is user experience; consensus maturity is security. With the current constant reductions for testing, confirmation behavior intentionally changed. For production, confirmation constants should be restored and exercised in regression tests.

## Q96) Could reorgs cause private note resurrection (spent note appearing unspent)?

Reorgs are complex and must be handled via deterministic apply/revert state logic plus wallet reconciliation. Current code has apply/revert hooks and stronger key-manager state refresh. This area is improved but should remain a top chaos-test target under deep and repeated reorg patterns.

## Q97) Can a private tx hide a public linkage accidentally?

A common privacy foot-gun is mixed public/private outputs. API defaults now suppress accidental public leg when user intent is private-input private-recipient unless explicitly opted in (`allow_mixed_public_private`). This reduces accidental linkage leaks from wallet/API construction.

## Q98) Could consensus payout metadata be forged to reroute funds?

Consensus payout transactions are constrained to block context and undergo stricter metadata and sender checks. Forged payout metadata in ordinary mempool txs is rejected. This reduces fee-routing abuse and payout spoof attempts.

## Q99) Could coinbase outputs be spent immediately via private shielding?

Coinbase maturity applies to UTXO spends regardless of later private conversion intent. Immature coinbase attempts are rejected. Shielding does not bypass coinbase maturity.

## Q100) Can an attacker fake a "valid-looking" private transaction by copying a prior note_pk/signature pair?

Signatures bind to spend digest context, including transaction-specific elements. Reusing prior signature material against a new digest should fail. Reusing exact same spend attempt collides on nullifier/commit checks.

## Q101) Are there injection vectors in transaction metadata fields?

Metadata is parsed as data, not executable code, and transaction validity derives from canonical fields/signatures/policy gates. Still, metadata bloat and malformed metadata should continue to be fuzzed to ensure parser resilience and bounded resource usage.

## Q102) Could malformed network IDs slip through and cause cross-network replay?

Network checks enforce transaction/block network matching. Cross-network payloads are rejected when network identifiers mismatch, which is a standard anti-replay control.

## Q103) Could stale mempool indexes cause hidden double spends?

Mempool cleanup and reload paths now rebuild and clean public and private indexes (UTXO refs, private input commits, private output commits). This reduces stale-index collision bugs after restart or persistence rebuild.

## Q104) What if two peers send conflicting private spends at nearly the same time?

Pending nullifier and commit indexes are designed to make first-accepted reservation block later conflicts. Races are mediated by lock-protected structures. One should be admitted and the other rejected unless policies explicitly allow replacement semantics for that class.

## Q105) Could attackers abuse minimum fee changes in docs vs code?

Yes, operationally. If docs, harnesses, and code diverge, confusion and false negatives appear in testing. This cycle showed several strict-suite failures caused by old fee assumptions. Security posture improves when constants, docs, and tests are updated together.

## Q106) How does the code handle transaction ownership for role-based addresses?

Ownership is validated against signer-derived role hashes (regular, bond, stake, etc.) as applicable. This prevents spending role-locked UTXOs with unrelated keys and supports policy-specific controls for lockup/unlock flows.

## Q107) Could a malicious block include private activity but omit required private header fields?

Current consensus checks reject private-activity blocks without required private metadata (for example `private_notes_root` consistency expectations). This is an integrity requirement and prevents silent private-state divergence.

## Q108) Could someone bypass spend checks by sending a tx with no public inputs and no private inputs?

Transaction shape validation requires valid input vectors. Empty-input normal tx is invalid (except coinbase in block context with strict rules). Such malformed payloads are rejected.

## Q109) Is there still a data leak in private tx format?

By design, your current tx format still carries some public fields for compatibility and consensus processing. Privacy quality depends on exactly which fields are exposed. If you want stronger unlinkability, minimizing public-facing private metadata (while preserving consensus verification ability) remains a design roadmap item.

## Q110) Is reuse of the same bundle automatically linkable?

Bundle reuse does not automatically mean note reuse, but repeated public artifacts can increase linkability risk. Strong unlinkability requires fresh private notes/nullifiers/signatures per spend and careful control of exposed metadata. Deterministic key derivation for recovery can still coexist with per-spend uniqueness.

## Q111) Can attacker craft fake note with valid format and random ciphertext to clog mempool?

Yes as a spam attempt, but not as a validity bypass. Without valid note ownership/signature/anchor/path and state conditions, the transaction is rejected. Anti-spam remains fee/policy/rate-limit territory.

## Q112) How does the system prevent accepting private output commits already on chain?

Verifier and mempool code check whether a private output commit already exists in confirmed note store. Existing commitment reuse is rejected.

## Q113) Could an attacker force wrong confirmation status in GUI to trick user spending?

GUI can mislead if backend state mapping is buggy, but consensus still enforces actual validity. Security fix strategy is to make GUI state derive from canonical backend note-state and confirmation constants, then treat GUI as display-only source of truth.

## Q114) Could manual tx injection through API bypass GUI safety defaults?

Potentially, if API callers explicitly disable safe defaults. That is why policy defaults matter. For sensitive paths, enforce server-side invariants in addition to UI safeguards so direct API callers cannot accidentally create high-risk outputs.

## Q115) Is there anti-serialization-injection hardening in binary tx paths?

Canonical serialization and strict parser checks are in place for private vectors and tx versions. This reduces acceptance of malformed serialized payloads. Continued fuzzing remains necessary because parser edge cases are high-risk across blockchain systems.

## Q116) Can an attacker exploit note leaf index mismatches?

Leaf index is part of anchor/path verification semantics. Inconsistent leaf index should fail path verification. This is a core control preventing arbitrary proof material from being attached to unrelated notes.

## Q117) What prevents "unknown private validation failed" silent errors from masking bugs?

Operationally, this requires better structured error propagation and logging. The verifier now emits clearer failure classes for many private checks, but unknown fallbacks should keep being reduced. Instrumentation is part of security because opaque failures delay incident response.

## Q118) Could "pending forever" private notes be used for griefing?

This is mostly UX/operational, not consensus bypass. Key-manager reconciliation improvements and confirmation-state refresh reduce indefinite pending drift. Additional watchdogs can clear stale pending states based on canonical chain evidence.

## Q119) Could fake block metadata trigger false rejections and DoS?

Malformed block metadata can trigger rejection by design. This is a valid anti-corruption behavior. DoS protection then depends on peer-level controls (rate limiting, scoring, banning) so invalid block floods do not saturate resources.

## Q120) How do you differentiate exploit findings from harness drift findings?

Exploit finding means invalid data was accepted. Harness drift means attack case failed for a different reason (for example fee floor mismatch) before reaching intended predicate. Both matter, but they represent different actions: code fix vs test fixture fix.

## Q121) What was the single most important private-path hardening in this cycle?

The combination of deterministic v5 amount-commit conversion and additional private commit/nullifier collision controls (mempool + block overlays) is the highest practical impact set. It directly reduces consensus instability and double-spend collision risk.

## Q122) What was the most important public-path hardening in this cycle?

Explicit duplicate public input outpoint rejection in verifier plus mempool conflict checks improved same-tx and pending collision protections. This closes straightforward malformed double-spend payloads early.

## Q123) Could attacker abuse high-fee tx replacement to censor specific users?

Economic replacement pressure always exists. Current policy requires meaningful fee bump; that raises cost but does not eliminate market-driven replacement behavior. Additional anti-censorship policy is a network governance tradeoff, not just transaction verifier logic.

## Q124) What should be monitored in production dashboards for tx security?

Track:

- mempool reject reasons by class,
- nullifier conflict rate,
- duplicate outpoint rejection rate,
- private-root mismatch frequency,
- block rejection reasons split by consensus stage,
- pending-note age distribution,
- reorg count/depth,
- fee-floor reject volume.

These metrics detect both attacks and regression.

## Q125) Could private-to-private sends leak through public outputs in your sample tx?

If a public output appears in a private-to-private flow, that is usually constructor policy behavior, not verifier bypass. API defaults were hardened to avoid accidental mixed output when private-input private-recipient intent is present. Any remaining cases should be treated as construction-policy bugs.

## Q126) Could attacker submit private tx with empty inputs but non-empty private outputs to mint?

Such payloads should fail accounting and validation constraints unless it is a protocol-defined special transaction type (which normal private transfer is not). This remains a mandatory regression case in private accounting tests.

## Q127) What about fake notes with reused nullifiers that "look legit"?

Legit appearance is insufficient. Nullifier uniqueness is enforced globally (pending + confirmed). Reused nullifier attempts are rejected regardless of payload cosmetics.

## Q128) Could reused private bundle identifiers create deterministic linkability?

Bundle identifier reuse can become metadata linkage in off-chain sharing channels. It is safer to avoid redundant identifying fields and keep imported bundle parsing strictly from canonical block sections with checksum verification. This is a wallet UX and privacy design point.

## Q129) Is your current model closer to fail-open or fail-closed on parser errors?

The implemented behavior is overwhelmingly fail-closed in tested parser and validation paths: invalid shape/value leads to rejection, not acceptance.

## Q130) What is the bottom-line risk grade after this cycle?

For transaction integrity and double-spend resistance: materially improved and strong in audited paths.
For privacy unlinkability semantics: improved but still design-sensitive to exposed fields and constructor policy.
For operational robustness: improved, with remaining priority on harness alignment, reorg chaos testing, and richer failure observability.

---

## Platinum Shield Checklist Crosswalk (Spec to Code)

This section maps the private-layer checklist into practical security controls and where they appear in current implementation.

1. Consensus constants and limits: enforced via `Constants` gating and verifier policy checks.
2. Deterministic private key derivation modules: supports reproducible recovery while preserving per-spend signature checks.
3. Private state store wiring: `private_notes_store` drives note/nullifier/anchor validation.
4. Preimage helper (`txid_without_signatures`): hardens signature binding against witness mutation.
5. Schema and serialization extension: private input/output fields are parsed with strict shapes.
6. Version schedule and activation: private tx acceptance only after configured activation rules.
7. Private input parser/validator: commit/nullifier/anchor/leaf/path validation plus signature check.
8. Private output parser/validator: commitment/payload validation and duplicate controls.
9. Payload length bounds: prevents unbounded payload abuse and malformed vectors.
10. Pending-nullifier mempool checks: blocks in-flight private replay.
11. Confirmed-nullifier block checks: blocks chain-level replay.
12. Merkle roots and anchor-age constraints: protect historical state membership assertions.
13. Block fields (`private_notes_root` and related gates): enforce private-state consistency in blocks.
14. Apply/revert hooks for private state: foundational for reorg correctness.
15. STARK/proof gate integration: hidden-value paths are expected to pass proof gates.
16. Miner assembly integration: private outputs and proof metadata are attached in block context.
17. Wallet receive/scan pipeline: decap/decrypt/recovery path for note discovery.
18. Wallet spend builder: private inputs, nullifiers, signatures, and outputs constructed for consensus.
19. Conflict tests and reorg tests: regression coverage in test suites and sandbox attack scripts.

This crosswalk matters because it demonstrates that private security is not one check; it is a chain of constraints from parsing to mempool to consensus to state transitions.

---

## Additional Concrete Attack Examples

## Example 9: Private nullifier collision across pending and confirmed domains

Scenario:

- Attacker submits Tx A with nullifier N.
- Tx A confirms in block H.
- Attacker submits Tx B later with same nullifier N, modified payload.

Expected:

- Tx B rejected by confirmed-nullifier check.

Security effect:

- Prevents replay of spent private note after confirmation.

## Example 10: Same-block private input commit collision

Scenario:

- Malicious miner builds block with Tx X and Tx Y both spending input commit C.

Expected:

- Block tx verification fails at overlay collision detection.

Security effect:

- Prevents "double spend in same candidate block" attacks.

## Example 11: Mempool fake private output commit reuse

Scenario:

- Attacker submits Tx M with output commit O.
- Before M confirms, attacker submits Tx N with same output commit O.

Expected:

- Tx N rejected due mempool private output commit index conflict.

Security effect:

- Prevents pending-state confusion and duplicate note insertion.

## Example 12: Fee-floor bypass attempt used to hide deeper malicious predicate

Scenario:

- Attack harness crafts malformed signature transaction with fee below current floor.

Observed:

- Rejected at fee-floor check before signature predicate.

Interpretation:

- This is not a successful exploit; it is a fixture mismatch. Harness must use policy-compliant base fee to test intended predicate.

## Example 13: Public-to-private shield then private-to-private transfer

Scenario:

- Tx1 consumes public UTXO(s), creates private note(s) to sender.
- Tx2 consumes private note, sends private outputs.

Security implications:

- Public source remains visible in Tx1 by design.
- Tx2 unlinkability depends on private note semantics and exposed fields.
- Constructor defaults should avoid unnecessary public outputs in Tx2.

## Example 14: Missing private block metadata

Scenario:

- Block contains private activity but omits required private root metadata.

Expected:

- Block rejected by consensus private-layer integrity checks.

Security effect:

- Prevents private-state divergence and malformed private block acceptance.

---

## Closing Technical Notes

The large-volume private attack pass and crypto pass gave strong confidence in core correctness for high-risk transaction paths. Remaining strict-suite failures do not currently indicate a demonstrated acceptance bypass; they mostly indicate policy-aware harness maintenance work that should be prioritized immediately. In a security program, this distinction matters: exploit fixes and test-fidelity fixes are both required, but they are different workstreams.

For the private system specifically, the most critical maintained invariant is:

`No private note may be spent more than once, and no private output commitment may be inserted ambiguously, while preserving deterministic cross-node transformation of commitments and strict anchor/path/signature validation.`

Current code changes move directly in support of that invariant.
