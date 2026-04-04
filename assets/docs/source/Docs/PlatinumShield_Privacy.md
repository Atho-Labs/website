# Platinum Shield Privacy Layer (Atho)

Last refresh: 2026-04-04

This document is the canonical markdown reference for Atho private-layer behavior in the current repository.

Product naming:
- Product release line: `Platinum Shield v1` (`PRIVATE_LAYER_PRODUCT_VERSION=1.00`)
- Internal transaction family used by product v1: private tx `v5`

## 1) Design Goals
- keep public UTXO behavior intact,
- add private notes and nullifier-based spend controls,
- hide private amounts on-chain while preserving consensus correctness,
- fail closed whenever proof/runtime requirements are missing.

## 2) Public and Private Coexistence
Atho supports mixed blocks containing both:
- public UTXO transactions,
- private transactions with private inputs/outputs.

Consensus enforces both planes in a single block acceptance path. Private-state transitions are applied/reverted with block connect/disconnect so reorg behavior remains deterministic.

## 3) Private Transaction Model
Private tx vectors are carried in tx structures:
- `private_inputs`
- `private_outputs`

Core fields include:
- `commit`
- `nullifier`
- `anchor`
- `merkle_path`
- `note_pk`
- `signature`
- `amount_plain` (mempool)
- `amount_commit` (block)
- `enc_payload`

Mempool validates plaintext amount arithmetic; miners convert outputs to commitment form for on-chain privacy.

## 4) Cryptography Stack
- Falcon-512: ownership/signature proofs for note spends.
- Kyber: recipient payload encapsulation for note recovery.
- SHA3 domains: network-separated commit/nullifier/leaf/signing/seed hashes.
- STARK (block-level): proves private amount consistency for block private activity.

## 5) Private Note Lifecycle
1. Sender obtains recipient bundle (`Falcon pk + Kyber pk`).
2. Sender creates private output with encrypted payload.
3. Tx enters mempool (private amount still explicit for policy validation).
4. Miner assembles block and computes private commitments.
5. Miner generates block-level private STARK proof.
6. Node verifies proof during block validation.
7. Recipient scans chain, decapsulates payload, and stores recovered note material.

## 6) Nullifiers and Anti-Double-Spend
- confirmed nullifier set blocks replay of spent notes,
- mempool pending-nullifier tracking blocks competing pending spends,
- conflicts fail admission before block inclusion.

## 7) Merkle Root and Anchors
Private notes are tracked under a deterministic private Merkle tree (`depth=20`).
Anchors are validated against recent/allowed roots (`MAX_ANCHOR_AGE` policy).

## 8) Block-Level STARK Pipeline
Current production path:
- bridge script: `Src/ZKSTARK/scripts/private_layer_stark_bridge.py`
- backend launcher: `Src/ZKSTARK/scripts/private_layer_stark_backend.py`
- Rust backend binary: `Binaries/<platform>/private_layer_backend`
- Rust runtime binary: `Binaries/<platform>/atho_private_stark_runtime`

Behavior:
- prove mode required for private-activity block assembly,
- verify mode required for block acceptance,
- runtime/proof failures are fail-closed.

## 9) Binary Pinning and Runtime Integrity
Private STARK binaries are hash-pinned in:
- `Binaries/pin_registry.json`
- `Binaries/<platform>/binary_meta.json`

Pin policy is enforced on production networks by default. Unpinned command execution is denied unless explicitly allowed via env overrides.

## 10) Signature Length and Robustness
Private input Falcon signatures are accepted within bounded consensus limits (not a single fixed byte value hard-coded in all paths), while still enforcing strict validation bounds.

## 11) X-Address and Bundle Binding
Bundle helper paths provide:
- bundle-hash derivation,
- x-address derivation from bundle hash,
- receive-path bundle/x-address consistency validation.

Canonical helpers:
- `Src/Utility/private_bundle.py`

## 12) Hidden Supply Accumulator
Private flow updates a hidden-supply accumulator using deterministic domain-separated events from private amount commitments. This is part of the proof statement pipeline and block-level validation checks.

## 13) Storage and Logs
### Storage
Private state is persisted in private note storage paths under chain data roots (network-separated).

### Logs
Private event logs are written under:
- `logs/<network>/private/mempool/private_tx_mempool.log`
- `logs/<network>/private/blocks/private_tx_blocks.log`
- `logs/<network>/private/errors/private_tx_errors.log`

## 14) Replay Protection
Consensus hashes for private commitments/nullifiers/signing include network identity domains, preventing valid private material from one network being replayed on another network.

## 15) Operational Controls
Relevant env controls (examples):
- `ATHO_PRIVATE_STARK_BIN_PIN_REQUIRED`
- `ATHO_PRIVATE_STARK_RUNTIME_AUTOBUILD`
- `ATHO_PRIVATE_STARK_RUST_BACKEND_AUTOBUILD`
- `ATHO_PRIVATE_STARK_BACKEND_TIMEOUT_MS`
- `ATHO_PRIVATE_STARK_PROOF_MAX_BYTES`

## 16) Current Status
Implemented in repo:
- private tx parsing/validation,
- private mempool/block/error logging,
- block-level STARK proof bridge/backend/runtime wiring,
- pinned binary workflow for STARK binaries,
- fail-closed verification gates.

Remaining hardening work:
- broader adversarial/fuzz/regression automation,
- stronger p2p proof-flood/rate-limit stress policies,
- extended long-run mixed-network burn-in suites.

## 17) Related Docs
- [Consensus.md](Consensus.md)
- [Tx.md](Tx.md)
- [Binaries.md](Binaries.md)
- [LMDB.md](LMDB.md)
- [Troubleshooting.md](Troubleshooting.md)
- [../Src/platinum shield/ATHO_PRIVATE_LAYER_CHECKLIST.md](../Src/platinum shield/ATHO_PRIVATE_LAYER_CHECKLIST.md)
