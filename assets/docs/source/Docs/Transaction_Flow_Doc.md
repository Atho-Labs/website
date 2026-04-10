# Atho Transaction Flow (End-to-End, Deterministic Restore, and Private Pipeline)

Date: 2026-04-05

This document is a code-grounded, operator-focused walkthrough of the Atho transaction lifecycle with specific emphasis on the private flow and deterministic wallet recovery behavior.

It is written to answer the practical questions that matter in production:
- If a user imports or recovers a wallet, can they recover public and private funds?
- How are Falcon and Kyber key materials derived from mnemonic path data?
- How are private note keys generated for each note, and how are they recovered later?
- Why can one receive bundle accept unlimited private receives, and how does scanning recover them deterministically?
- Where are the consensus boundaries for transaction validity, fee routing, and state transition integrity?

The scope is intentionally broad and deep: GUI/API ingress, tx build pipeline, mempool admission, mining transforms, block verification, state commit, wallet-side private scanning, and deterministic recovery semantics.

Primary code anchors used for this document:
- `Src/Accounts/mnemonic.py`
- `Src/Accounts/key_manager.py`
- `Src/Accounts/kybercli.py`
- `Src/Falcon/deterministic_keygen.py`
- `Src/Wallet/private_spend.py`
- `Src/Wallet/private_receive.py`
- `Src/Wallet/private_note_crypto.py`
- `Src/Transactions/private_layer.py`
- `Src/Utility/private_bundle.py`
- `Src/Utility/const.py`
- `Src/Api/apis.py`
- `Src/Main/consensus.py`
- `Src/Main/txveri.py`
- `Src/Main/blockveri.py`
- `Src/Miner/miner.py`

---

## 1) System Model: What Atho Is Actually Enforcing

Atho is a layered system where each stage has a narrow responsibility. That separation is important because it prevents one component from becoming a hidden consensus authority.

1. Interface layer (GUI/API): gathers inputs, normalizes payloads, and applies UX safeguards.
2. Build layer: creates canonical transaction structures and fills witness/private vectors.
3. Admission layer: mempool entry checks tx policy and basic validity.
4. Verification layer: enforces ownership, signature validity, UTXO spend rules, and private note semantics.
5. Mining layer: selects mempool txs, applies block-mode transforms, builds coinbase, and mines.
6. Block verification layer: recomputes commitments and checks accounting and structural invariants.
7. Commit layer: atomically updates state stores and journals.
8. Wallet recovery layer: scans chain and decodes private receives for local ownership.

This division means wallet usability logic and consensus logic are not the same thing. A GUI bug can break user experience, but consensus remains anchored in verifier/block-verifier rules.

---

## 2) Versioning Reality: Private Product-V1 Is the Genesis Target

A major clarification in current code is that the production private flow is now version-targeted to product-v1 from genesis.

In constants:
- `PRIVATE_TX_V1_ACTIVATION_HEIGHT = 0`
- `PRIVATE_TX_V4_ACTIVATION_HEIGHT = -1`
- `PRIVATE_TX_V5_ACTIVATION_HEIGHT = -1`
- `PRIVATE_TX_VERSION_PRODUCT_V1 = TX_VERSION` (currently `1.00`)

This means operationally:
- private tx should be built and validated as v1 semantics,
- legacy 4.x/5.x are disabled unless explicitly reactivated via environment/config overrides,
- amount-commit mode for private path is tied to product-v1 semantics.

So if you reset from genesis and run default settings, private flow should use v1 rules by design.

---

## 3) Canonical Tx Data Model and Identity

A transaction carries:
- header/body fields (`version`, `network`, `timestamp`, `lock_time`),
- `inputs` and `outputs` for UTXO path,
- witness/signature material,
- optional `private_inputs` and `private_outputs` vectors for private flow.

Key identity facts:
- tx signing uses canonical no-witness domain rules,
- txid identity and wtxid/witness commitments are recomputed where required,
- block-level commitments must match transformed, final payloads, not mempool draft state.

This is especially important for private tx because mempool-mode and block-mode private outputs differ in allowed fields.

---

## 4) Fee Policy and Size Policy (Operational, Not Theoretical)

Atho policy uses weight/vsize style accounting, not a static byte fee.

Policy model:
- `weight = base_bytes * 3 + total_bytes`
- `vsize = ceil(weight / 4)`

Fee floor in production policy:
- `required_fee = max(vsize * 350 atoms, 100,000 atoms)`

Measured empirical `vsize` from current serializer/metrics path:
- public `1 in / 2 out`: `553 vB`
- public -> private (`1 in / 1 private out`): `2471 vB`
- private -> public (`1 private in / 1 public out`): `2708 vB`
- private -> private (`1 private in / 1 private out`): `4673 vB`

Interpretation:
- private tx are significantly larger due to encrypted payload and private vector witness data,
- this is expected and consistent with privacy feature overhead,
- throughput planning should assume mixed workload, not public-only baseline.

---

## 5) Deterministic Wallet Root: Mnemonic to Seed

Mnemonic flow in Atho is explicit:

1. Entropy is generated first.
2. Mnemonic phrase is encoded from entropy+checksum.
3. Seed is derived from mnemonic phrase (plus optional passphrase) using PBKDF2-HMAC-SHA3-512.

Important deterministic inputs:
- normalized mnemonic phrase,
- passphrase,
- PBKDF2 iteration count,
- salt prefix scheme.

This root seed is then split into independent derivation domains for Falcon and Kyber via HKDF-like extract/expand with domain strings.

Practical implication: mnemonic phrase is not a decorative label. It is the cryptographic root of deterministic key regeneration when path parameters match.

---

## 6) Falcon Branch: Wallet Identity and Public Address Rebuild

For Falcon branch derivation, mnemonic module includes path context:
- network (`mainnet`, `testnet`, `regnet`),
- account index,
- role label,
- child index.

The derived Falcon seed is fed into deterministic Falcon keygen, producing the same keypair for the same path inputs.

`add_key_from_mnemonic(...)` then stores:
- Falcon private/public material,
- hashed public key (HPK),
- base56 display address,
- derived role-separated addresses,
- mnemonic metadata (`role`, `account`, `index`, `iterations`, passphrase-used flag).

Idempotent behavior is built in: if imported mnemonic path maps to an already-present public key, KeyManager updates metadata rather than duplicating divergent records.

This is why public wallet identity recovery is deterministic and reliable across imports when path and passphrase are consistent.

---

## 7) Kyber Branch: Deterministic Private Receive Identity

Private receive identity depends on Kyber key material plus Falcon public key in the bundle.

Current code supports deterministic Kyber keypair generation by seeded Kyber ref RNG through `KyberCLI.keypair_deterministic(...)`.

`get_or_create_private_bundle(...)` behavior:
- attempts to derive deterministic Kyber seed from mnemonic context and stored mnemonic metadata,
- if mnemonic metadata is not available, falls back to deterministic Falcon-root Kyber seed derivation,
- uses deterministic keypair generation whenever deterministic seed material is available,
- stores `seed_source = mnemonic_v1` and mnemonic restore path metadata,
- stores `seed_source = falcon_root_v1` for fallback-derived deterministic bundles.

Bundle construction:
- bundle bytes = `version || falcon_public_key || kyber_public_key`
- `bundle_hash = sha3_384(bundle_bytes)`
- `x_address = "X" + base56(bundle_hash_bytes)`
- `bundle_view_tag = first 4 bytes` represented as first 8 hex chars of bundle hash

Result: for mnemonic-backed wallets with same path/passphrase, Kyber bundle identity can be recreated deterministically, so same bundle hash/x-address are regenerated.
For imported/legacy key records without mnemonic metadata, Falcon-root fallback still keeps bundle identity deterministic.

---

## 8) What "Recover All Funds" Means in Practice

You can now interpret recovery in concrete categories.

### 8.1 Public funds
Recovered if mnemonic path inputs match:
- Falcon keypair and address identity are regenerated deterministically,
- chain UTXOs for those addresses are discoverable and spendable.

### 8.2 Private funds
Recovered when two conditions are true:
1. receiver private bundle identity (Kyber secret + bundle binding) is recreated or restored,
2. wallet scans chain and decodes private outputs targeted to that bundle.

For mnemonic-v1 bundle path, this is deterministic if passphrase/path match.
For older legacy random bundle generation, mnemonic alone cannot recreate old Kyber secret key; that requires preserved key backup artifacts or explicit migration.

### 8.3 Non-fund local state
Not strictly blockchain funds and not guaranteed from mnemonic alone:
- local contacts and UI labels,
- favorites and address-book metadata,
- local in-flight UI state.

Funds recovery and UX-state recovery are different problem domains.

---

## 9) Private Note Seed Model: How Child Note Keys Are Generated

A core question is: how do note child Falcon keys get generated and later recovered?

Sender-side deterministic stream:
1. KeyManager computes private note master seed from wallet Falcon materials + network domain.
2. `reserve_private_note_seed(...)` reads current `private_note_state` (`account`, `next_counter`).
3. `derive_note_seed(master_seed, account, counter, network)` computes 32-byte deterministic note seed.
4. Counter increments and persists atomically.

Important current property:
- identifier string is no longer part of this master-seed derivation domain for determinism.
- this removes prior alias/name drift risk.

Then, inside private send builder:
- `note_seed_key_seed(...)` produces a 32-byte key-seed for Falcon note keygen,
- `note_seed_payload_bytes(...)` expands/normalizes to 64-byte payload seed for encrypted payload storage.

So one deterministic seed stream produces per-note deterministic Falcon child keypairs and payload seeds.

---

## 10) Why Unlimited Receives Work on One Bundle

A receiver does not need to rotate bundle every receive.

One bundle can receive unlimited private notes because each send includes fresh randomness and context:
- sender performs Kyber encapsulation to receiver Kyber public key,
- this generates a per-output shared secret,
- recipient id and encrypted payload are derived from that shared secret,
- per-note Falcon child key in output is tied to encrypted note seed, not to a static receiver-side counter.

This means:
- receiver does not pre-generate all possible note keys,
- receiver scans outputs and attempts decapsulation/decryption,
- only outputs targeted to receiver bundle decode successfully.

This is the correct model for scalable private receive without key explosion in advance.

---

## 11) Private Send Build Pipeline (Public->Private and Private->Private)

For private recipients, API builder path does strict normalization:
- each recipient must provide amount,
- recipient bundle is parsed by resilient decoder,
- recipient x-address is required and binding-validated,
- optional include_view_tag defaults true in send path.

In `PrivateSpendBuilder.build_private_output_bundle(...)`:
1. Resolve note seed (deterministic from reserved stream in normal flow).
2. Derive Falcon note child keypair from key seed.
3. Parse and validate recipient bundle/x-address binding.
4. Extract recipient Kyber public key.
5. Kyber encapsulate -> shared secret.
6. Derive recipient id from shared secret.
7. Compute note commit from note pubkey + amount + recipient id + nonce.
8. Build encrypted payload (AES-GCM) carrying note seed and optional message.
9. Emit private output fields including recipient binding fields.

For product-v1 amount-commit semantics:
- mempool format carries `amount_plain` path constraints,
- block transform converts to commitment-compatible block mode before inclusion.

---

## 12) Encrypted Payload Structure and View Tags

Payload model in private note crypto:
- `kyber_ciphertext` (for decapsulation),
- `aes_nonce`,
- amount field (for v5/product semantics),
- `ciphertext_seed` (AES-GCM encrypted note seed payload),
- optional 4-byte view tag prefix.

The view tag is derived from shared secret and allows fast rejection of non-matching outputs before deeper work.

Security-relevant checks on recovery:
- decapsulation must succeed,
- recipient_id must match expected output field,
- if view-tag present, derived tag must match payload tag,
- decrypted note seed must regenerate note pubkey that matches output note pubkey,
- recomputed commit must match output commit.

Only then note is accepted as wallet-owned.

---

## 13) Private Receive/Recovery: How Wallet Recreates Notes

Receiver flow is scanner-driven and deterministic:

1. KeyManager creates scan entries from local wallet keys that have private layer material:
   - bundle,
   - bundle hash,
   - x-address,
   - Kyber secret key.

2. For each block/tx private output:
   - prefilter by `recipient_bundle_hash` tag (first 8 hex chars / 4 bytes) when present,
   - call scanner on candidate outputs.

3. Scanner tries decapsulation with local Kyber secret key(s).
4. If decapsulation succeeds, derive recipient id and check binding.
5. Verify optional payload view tag.
6. Decrypt encrypted note seed payload.
7. Derive note Falcon child key deterministically from decrypted note seed.
8. Recompute commit/nullifier and validate consistency.
9. Record note locally as unspent.

This answers the central deterministic recovery question:
- wallet does not guess note keys by brute-force derivation from receiver mnemonic path alone,
- wallet reconstructs exact note keys from chain payload encrypted to receiver bundle,
- deterministic regeneration happens after decryption.

---

## 14) Chain Scan Triggers and Sync Behavior

Private scan is wired in multiple places:

1. Wallet unlock path:
- on unlock, API triggers `scan_private_notes_from_chain(...)` starting from stored scan cursor or genesis fallback.

2. Consensus accepted block path:
- after private state apply, consensus invokes wallet private scan for that block when wallet is available/unlocked.

3. Rebuild/reconcile path:
- extension-state rebuild path also runs wallet private scan replay when conditions are satisfied.

Scan cursor behavior:
- per-key `private_scan_state.last_height` is tracked,
- if absent, start from height 0 to ensure no missed historical outputs.

This is how import/recovery can catch up from genesis to tip and recover incoming private notes.

---

## 15) Critical Consistency Fix: Bundle Hash Length in Scan

Bundle hash in this protocol is SHA3-384 hex (96 chars), not 64 chars.

A mismatch in scan-entry validation can silently skip valid bundle records and break private recovery.

Current code now uses 96-char validation in private scan entry building. This aligns with:
- bundle hash construction in `private_bundle.py`,
- tx parser checks in `private_layer.py`,
- wallet scan prefilter logic.

Operational meaning:
- imported/recovered wallets with valid private bundle data are not silently excluded from scan due to wrong hash length assumption.

---

## 16) Public Send Flow (Reference Path)

Public path remains straightforward:

1. Select UTXOs for sender HPK.
2. Build outputs (recipient + change).
3. Compute fee by vsize policy.
4. Sign Falcon witness.
5. Submit to mempool admission.

Verifier checks:
- inputs exist and unspent,
- signatures valid for ownership path,
- no double-spend/mempool collisions,
- conservation holds (`inputs = outputs + fee`).

Once mined and verified in block context, UTXO state updates atomically.

---

## 17) Private->Public Flow

Private->public combines private-note spend verification with public output creation:

1. Select private notes and build private inputs (commit/nullifier/anchor/path/signature).
2. Build public outputs for destination.
3. Build optional private change output.
4. Admission checks private vectors and version semantics.

Verifier enforces:
- nullifier uniqueness (confirmed and pending domains),
- note existence/ownership,
- anchor validity and age window,
- merkle-path correctness,
- private spend digest signature validity.

After block inclusion, nullifiers prevent replay of those same spent notes.

---

## 18) Private->Private Flow

Private->private is the most data-heavy path:

1. Consume private inputs as above.
2. Build one or more recipient private outputs with bundle/x-address binding.
3. Add private change if needed.
4. In miner/block assembly, convert private outputs to block mode and rebind txid where required.

Consensus and block verifier then enforce full consistency including:
- private vector parse validity,
- accounting consistency,
- proof/commitment gates as configured.

This path yields the largest vsize and strongest private-surface usage.

---

## 19) Mempool-Mode vs Block-Mode Private Output Transform

A non-obvious but critical design feature:
- tx can carry one representation at mempool stage,
- then be transformed to consensus block representation before final inclusion.

If transformation changes tx body, txid must be recomputed on transformed payload before merkle commitment.

Failure to do this produces merkle root inconsistencies and consensus splits.

Current mining path explicitly handles this rebinding for private output transforms.

---

## 20) Coinbase and Fee Routing Integrity

Fee routing is consensus-enforced accounting, not optional policy metadata.

For each block, verifier recomputes expected split:
- total tx fees,
- miner fee share,
- pool share,
- burned share,
- cumulative burn counters.

Coinbase payout must match subsidy + miner share only, according to split rules.

If declared fields (`fees_total_atoms`, `fees_pool_atoms`, `fees_miner_atoms`, `fees_burned_atoms`, etc.) diverge from recomputed values, block is rejected.

So pool-routing bugs are not just reporting bugs. If they alter consensus-visible accounting, they become block-invalid conditions.

---

## 21) Deterministic Restore Matrix (What Restores, Exactly)

### 21.1 Restores from mnemonic path alone (when matching)
- Falcon wallet keypair.
- HPK/public address identity.
- Role-derived addresses.
- For mnemonic-derived private layer: deterministic Kyber keypair and same bundle/x-address.

### 21.2 Requires additional artifacts in some cases
- Historical wallets whose private bundle was created with `seed_source=random`.
- Local UI/contact/label metadata.
- Any non-chain local preferences.

### 21.3 Passphrase caveat
If mnemonic metadata indicates passphrase was used, deterministic restore requires the same passphrase; otherwise deterministic Kyber restore path is intentionally blocked.

---

## 22) Security Boundary Notes: Falcon, Kyber, and AES-GCM Roles

Roles are separated by function:
- Falcon: signatures and deterministic note keypairs.
- Kyber-512 (private tx path): encapsulation/decapsulation to derive shared secret for note payload encryption.
- AES-GCM: authenticated encryption of note payload using key derived from shared secret.

At-rest wallet encryption can use different Kyber level policy (for example 1024 path) depending on wallet crypto configuration, but private tx routing logic here is keyed to private-layer constants (`PRIVATE_KYBER_LEVEL`, currently 512).

This separation is expected and should not be conflated:
- transaction transport confidentiality path and at-rest wallet file protection path are distinct.

---

## 23) Replay and Double-Spend Prevention Layers

Public domain:
- outpoint spend checks,
- mempool conflict tracking,
- block-local duplicate protection.

Private domain:
- nullifier uniqueness across confirmed state,
- pending nullifier conflict maps,
- anchor/path verification,
- block-local nullifier duplication checks.

Combined effect:
- cannot replay same public spend,
- cannot replay same private note spend once nullifier is consumed.

---

## 24) Private Scan Performance Model and View Tags

Scan performance is constrained by chain size and private output density.

Optimizations currently used:
1. Bundle-hash tag prefilter (`recipient_bundle_hash[:8]`) at KeyManager block scan layer.
2. Optional payload view-tag check in scanner candidate flow.

Why this matters:
- most outputs are not for this wallet,
- fast prefilter prevents unnecessary full decapsulation/decryption attempts,
- reduces sync catch-up cost materially.

The 4-byte view tag does not replace cryptographic verification. It is a cheap reject filter before stronger checks.

---

## 25) End-to-End Example: "Restore and Recover Everything" Walkthrough

Scenario:
- User reinstalls client,
- imports mnemonic,
- unlocks wallet,
- expects both public and private balances to reappear.

Actual flow:
1. `add_key_from_mnemonic` regenerates Falcon wallet key and public addressing.
2. KeyManager ensures private bundle material exists; for mnemonic-v1 path this regenerates deterministic Kyber/bundle identity.
3. On unlock, API runs private chain scan from scan cursor/genesis fallback.
4. Scanner iterates blocks, prefilters outputs, decapsulates matching outputs, decrypts note seeds, regenerates note keys, validates commits, stores notes.
5. Public UTXO and private notes now both become spendable in wallet context.

If user had a legacy random-sourced private bundle and only mnemonic was backed up, step 2 cannot recreate old Kyber secret. Public funds restore, but historical incoming private notes targeted at old bundle remain undecryptable without that additional backup material.
If user has a legacy random-sourced private bundle with historical activity and only mnemonic was backed up, step 2 cannot recreate old Kyber secret. Public funds restore, but historical incoming private notes targeted at old bundle remain undecryptable without that additional backup material.

---

## 26) Operational Checklist for Production Readiness

1. Keep private tx target version pinned to product-v1 (`1.00`) for genesis deployments.
2. Validate all nodes share same constants and activation heights.
3. Enforce binary pinning for cryptographic native libraries in production.
4. Verify wallet creation/import path consistently stores mnemonic metadata required for deterministic restore.
5. Confirm private bundle records show expected `seed_source` and restore metadata.
6. Run chain wipe/bootstrap test and validate unlock-triggered private scan catches historical private receives.
7. Validate public->private, private->public, and private->private round trips on multi-node topology.
8. Confirm mempool-to-block private output transforms and txid rebinding are active in miner path.
9. Inspect blocks for fee split field correctness and coinbase payout consistency.
10. Monitor private error logs for decapsulation/decrypt/commit mismatch events and treat repeated patterns as integration bugs.

---

## 27) FAQ (Focused on Your Current Questions)

### Q1) If I recover wallet from mnemonic, will all funds come back?
Public funds: yes when path inputs match.
Private funds: yes for deterministic bundle paths (`mnemonic_v1` and `falcon_root_v1`) after chain scan; legacy random bundle history still needs old private-layer backup artifacts.

### Q2) How does wallet know which child Falcon note keys to generate?
It does not pre-generate an infinite tree blindly. It scans chain outputs, decapsulates/decrypts outputs addressed to its bundle, gets note seed from payload, then deterministically regenerates that note Falcon keypair.

### Q3) If receiver reuses same bundle forever, how can notes stay unique?
Each sender encapsulation produces fresh shared secret and encrypted payload. Each note payload carries note seed, producing per-note Falcon key uniqueness even under same receiver bundle.

### Q4) What is the role of account/counter in private note derivation?
On sender side, they define deterministic sequence for note seed reservation from sender master seed. This ensures deterministic, non-colliding note generation across sends.

### Q5) Why enforce x-address and bundle-hash binding?
To prevent malformed or substituted recipient bundle data. X-address is deterministic encoding of bundle hash; mismatch means reject.

### Q6) Where is replay prevention for private spends?
Nullifier uniqueness at verifier and state-store layers; consumed nullifier cannot be spent again.

### Q7) Why include view tags if we already have recipient id checks?
Performance. View tags are fast reject filters before expensive decapsulation/decryption and full validation.

### Q8) Why are private tx larger than public tx?
They carry encrypted payload and private vectors with additional cryptographic context. This is expected tradeoff for privacy.

---

## 28) Common Failure Modes and What They Usually Mean

1. `invalid base64 encoding` on private recipient data:
- usually malformed bundle text; parser now supports multiple forms but payload may still be corrupted.

2. `recipient_x_address hash does not match recipient_bundle_hash`:
- bundle/x-address mismatch; user pasted wrong pair or payload altered.

3. `kyber_decapsulate_failed` during scan:
- output not for this wallet key, malformed ciphertext, or wrong secret key material.

4. `note_pk_mismatch` or `commit_mismatch` after decrypt:
- decrypted payload not consistent with output fields; reject as not-owned or invalid.

5. No private notes recovered after mnemonic import:
- possible old random bundle history without old Kyber secret backup,
- or wallet locked during scan,
- or chain scan cursor/path not yet replayed.

---

## 29) Audit Notes and Determinism Guarantees

Determinism claims that are valid from current code behavior:
- same mnemonic path inputs => same Falcon wallet keypair.
- same mnemonic path inputs + deterministic Kyber branch => same private bundle identity.
- same sender master seed/account/counter/network => same reserved note seed.
- same note seed => same deterministic Falcon note keypair.

Determinism does not mean one static key per receive. It means reproducible generation from the same seed/path material and reproducible recovery from authenticated encrypted payload.

---

## 30) Final Summary

Atho private flow is best understood as two linked deterministic systems:

1. Wallet identity derivation system:
- mnemonic -> seed -> Falcon branch (public identity) and Kyber branch (private receive identity).

2. Transaction note lifecycle system:
- sender deterministic note seed stream -> note key generation -> encrypted payload to receiver bundle -> receiver scan/decap/decrypt -> deterministic note key regeneration.

With product-v1 active from genesis, proper bundle/x binding, deterministic Kyber support, and scan wiring on unlock/consensus, the end-to-end behavior is now coherent for production-style operation.

The remaining operational rule is simple:
- treat mnemonic path parameters as strict recovery inputs,
- treat legacy random private-layer cases as requiring migration planning and additional backup artifacts,
- keep consensus-visible transforms and accounting strictly deterministic across nodes.
