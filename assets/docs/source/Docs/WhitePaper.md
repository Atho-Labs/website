# Atho Whitepaper (Core Brief)

Status: Alpha documentation snapshot (2026-03-15).

## Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [Origin and History](#2-origin-and-history)
3. [Vision and Principles](#3-vision-and-principles)
4. [Problems Atho Solves](#4-problems-atho-solves)
5. [Architecture and Network Design](#5-architecture-and-network-design)
6. [PQC Full-Stack Key Protection at Rest](#6-pqc-full-stack-key-protection-at-rest)
7. [Economics and Incentives](#7-economics-and-incentives)
8. [Threat Model and Defenses](#8-threat-model-and-defenses)
9. [Operations and Governance Direction](#9-operations-and-governance-direction)
10. [Roadmap Priorities](#10-roadmap-priorities)
11. [Conclusion](#11-conclusion)
12. [Primary Technical References](#12-primary-technical-references)

## 1. Executive Summary
Atho is a UTXO blockchain built for deterministic validation, operational clarity, and post-quantum readiness. It combines Falcon-512 signatures, SHA3-based hashing, Base56 user addresses, and LMDB-backed state storage.

The objective is to keep consensus behavior explainable, node roles explicit, and state drift low across node, wallet, GUI, and explorer surfaces.

Project phase at this snapshot: **Alpha hardening**.

## 2. Origin and History
Atho started as an operator-first chain project. Early development exposed role confusion, stale UI/API state, weak incident traceability, and fragile restart behavior.

Development then shifted toward hardening:
- stronger validation and payout checks,
- cleaner role boundaries,
- more explicit node lifecycle control,
- and better structured logs for audit and recovery.

This paper preserves mission and context while removing stale implementation detail.

## 3. Vision and Principles
Atho follows five principles:
- Determinism: identical data should produce identical validation outcomes.
- Auditability: operators must be able to explain failures quickly.
- Role clarity: full/miner/wallet behavior must remain explicit.
- Cryptographic modernization: post-quantum and SHA3-first direction.
- Operational resilience: failures should be visible and recoverable.

## 4. Problems Atho Solves
Atho targets practical infrastructure issues:
- state drift across chain, mempool, wallet, and explorer,
- miner payout mismatches from stale defaults,
- limited visibility into emission, fee, and coinbase anomalies,
- and long-term risk from legacy cryptographic assumptions.

## 5. Architecture and Network Design
### 5.1 Identity and Addressing
- Falcon-512 for signatures.
- SHA3-384-derived key and transaction hashing.
- Base56 address format for user-facing workflows.
- Internal normalized HPK representation for deterministic processing.

### 5.2 Ledger and Validation
Atho uses a UTXO ledger with explicit spent/locked semantics, canonical transaction hashing, fee and dust policy enforcement, and coinbase limits tied to reward schedule plus fees.

### 5.3 Consensus and Chain Integrity
Block acceptance verifies linkage, structure, signatures, target bounds, and payout correctness. Reorg/orphan handling is treated as a normal consensus path.

Current PoW retargeting uses a deterministic interval-based weighted-median window on production networks: target block time is 120 seconds, retarget every 360 blocks, clamp per-epoch adjustment ratio to 0.60..1.85, clamp interval outliers, and weight recent intervals more heavily for responsiveness without excessive volatility. Timestamp safety uses median-time-past (`MTP_WINDOW=13`) plus bounded future drift (`MAX_TIME_DRIFT=120` seconds) across verifier and direct chain-accept paths to reduce timestamp-manipulation attack surface. User-facing confirmation policy is 10 confirmations for regular transactions and 400 confirmations for coinbase maturity.

### 5.4 Storage and APIs
LMDB-backed stores track blocks, UTXOs, mempool data, and state metadata. The API surface is role-aware:
- full node for canonical chain state,
- miner for PoW and candidate flow,
- wallet/API for address and transaction operations.

## 6. PQC Full-Stack Key Protection at Rest
Atho’s key-at-rest model is hybrid by design: it combines post-quantum key encapsulation with high-assurance symmetric encryption.

### 6.1 What is encrypted
- Wallet secret payload: Falcon private key parts and mnemonic recovery material.
- Payload is encrypted with **AES-256-GCM** using a random DEK (data-encryption key).

### 6.2 How unlock works (two control planes)
- Password plane:
  - User password -> Argon2id -> KEK.
  - KEK unwraps DEK (AES-256-GCM wrap record).
  - DEK decrypts payload.
- PQ plane:
  - Kyber KEM record (ciphertext + metadata) also wraps the same DEK.
  - Advanced unlock/recovery mode can restore DEK through Kyber material.

### 6.3 Why Kyber + AES together
- AES-256-GCM is efficient and authenticated for bulk payload encryption.
- Kyber is used for KEM/wrap semantics, not bulk data encryption.
- Using both gives practical performance now and a post-quantum recovery path.

### 6.4 Security interpretation
- If password handling is weak, Kyber path still gives a separate cryptographic control plane for backup/recovery policy.
- If future cryptanalytic pressure changes assumptions, DEK wrap policy can be tightened without redesigning payload encryption format.
- This keeps wallet-at-rest protection modular and upgradeable.

### 6.5 Operator-facing result
- Falcon signs chain data.
- Kyber protects DEK recovery path.
- AES-256-GCM protects serialized wallet secrets at rest.

That is Atho’s current “PQC full-stack” posture for key custody.

## 7. Economics and Incentives
Atho uses scheduled rewards with fee participation and long-tail issuance behavior. Economic goals are predictable issuance, transparent accounting, and sustained miner incentives.

Emission and burn monitors compare expected and observed supply behavior to detect drift early.

## 8. Threat Model and Defenses
Atho defends at three layers.

Protocol layer:
- strict signature and UTXO checks,
- coinbase and fee enforcement,
- block linkage and target validation.

Network layer:
- mempool policy controls,
- peer visibility and node telemetry,
- deterministic payload handling.

Operational layer:
- wallet lock/unlock controls,
- API credential/HMAC support,
- role-pinned API routing to reduce stale endpoint confusion.

## 9. Operations and Governance Direction
Atho favors explicit operations over hidden automation:
- clear start/stop/restart/switch behavior,
- persistent runtime configuration,
- structured logs for incident audit and recovery.

Governance direction is engineering-led: improve safety, correctness, and observability before expanding protocol complexity.

## 10. Roadmap Priorities
1. Continue role-isolation hardening across node, wallet, GUI, and explorer.
2. Expand mempool and peer policy depth under adversarial conditions.
3. Improve key-management UX while preserving strict security defaults.
4. Improve diagnostics and explorer drill-down for faster audits.
5. Increase automated coverage for consensus, reorg, and high-volume transaction edges.

## 11. Conclusion
Atho is built to address real operating pain: stale state surfaces, unclear role boundaries, payout drift risk, and weak observability. The long-term goal is a resilient network where protocol integrity and operator usability improve together.

For deeper technical material:
- `Docs/Consensus.md`
- `Docs/Falcon512.md`
- `Docs/Sha3-384.md`
- `Docs/LMDB.md`
- `Docs/Threat.md`
- `Docs/Emissions.md`

## 12. Primary Technical References
- `Docs/falcon Docs.pdf` (Falcon/NIST context and package-level reference)
- `Docs/Falcon512.md` (integration and pinning implementation notes)
- `Docs/Consensus.md` (validation and chain-integrity flow)
- `Docs/Tx.md` (transaction rules, witness, fee policy, and sizing)
- `Src/Main/checksum.py` release checksum/signature workflow (release integrity)
