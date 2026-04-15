# Atho Documentation Index

Date: 2026-04-14

This is the canonical documentation map for the current Atho repository state. Use this file as the first checkpoint before reading topic-specific docs, because it reflects the active production policy profile and the most recent rewrite pass.

## Documentation Goals

The docs in this folder are organized around four outcomes:
- explain consensus and economic policy in plain language,
- map policy to concrete code paths and runtime controls,
- provide operational runbooks for node/wallet/miner workflows,
- preserve a traceable relationship between whitepaper claims, constants, and generated model artifacts.

Current baseline profile referenced across docs:
- target block time `120s`,
- difficulty retarget interval `180` blocks,
- tx confirmations `10`, private tx confirmations `10`, coinbase maturity `150`,
- fee floor `500 atoms/vB`, minimum fee `200,000 atoms`,
- pre-tail base target `400,000,000 ATHO`, hard max `500,000,000 ATHO`, supply floor `21,000,000 ATHO`,
- BPoW bond requirement `25 ATHO` with activation at `25` confirmations,
- fee pool routing pre-tail/post-tail `40% / 55%`.

## Start Here

If you are new to the repository, read in this order:
1. [quickstart.md](quickstart.md): environment setup, native binaries, first node launch.
2. [build-prereqs.md](build-prereqs.md): exact OS package prerequisites + one-click Docker-first setup path.
3. [Binaries.md](Binaries.md): binary build outputs, pin metadata, strict loading controls.
4. [Troubleshooting.md](Troubleshooting.md): common failures and known fixes.
5. [Consensus.md](Consensus.md): block validity, policy constants, deterministic checks.
6. [Tx.md](Tx.md): tx encoding, fee rules, witness-size behavior.

This sequence minimizes confusion by placing runtime prerequisites before protocol detail.

## Core Protocol References

Primary technical references:
- [WhitePaper.md](WhitePaper.md)
- [Consensus.md](Consensus.md)
- [Tx.md](Tx.md)
- [Transaction_Flow_Doc.md](Transaction_Flow_Doc.md)
- [Private_Key_Derivation_and_Restore.md](Private_Key_Derivation_and_Restore.md)
- [Wallet_Hierarchy_Visual_Guide.md](Wallet_Hierarchy_Visual_Guide.md)
- [PlatinumShield_Privacy.md](PlatinumShield_Privacy.md)
- [PrivateTx_v3.md](PrivateTx_v3.md)
- [PrivateTx_v3_Condensed.md](PrivateTx_v3_Condensed.md)
- [Sigwit.md](Sigwit.md)
- [Sha3-384.md](Sha3-384.md)
- [Falcon512.md](Falcon512.md)
- [Emissions.md](Emissions.md)
- [Inflation_Deflationary.md](Inflation_Deflationary.md)
- [Atho_Final_Specs.md](Atho_Final_Specs.md)
- [Emissions Modeling/Entire_Overview.md](Emissions Modeling/Entire_Overview.md)

For wallet-stake and bonded mining policy, use this focused path:
1. [WhitePaper.md](WhitePaper.md) (economic and governance context)
2. [Consensus.md](Consensus.md) (validation and payout mechanics)
3. [Tx.md](Tx.md) (role-aware transaction behavior)

## Runtime and Operations

Operational docs for day-to-day deployment and support:
- [Network_Stack.md](Network_Stack.md)
- [ApiAuth.md](ApiAuth.md)
- [LMDB.md](LMDB.md)
- [KeyManager.md](KeyManager.md)
- [Base56.md](Base56.md)
- [GPU_Miner.md](GPU_Miner.md)
- [Docker.md](Docker.md)
- [build-prereqs.md](build-prereqs.md)
- [Packaging.md](Packaging.md)
- [Node_Stop.md](Node_Stop.md)
- [gui.md](gui.md)

Use these for system administration, API integrations, mining operations, packaging, and UI runtime control.

## Developer References

Codebase orientation and audit support:
- [ONBOARDING.md](ONBOARDING.md)
- [SRC_FILE_MAP.md](SRC_FILE_MAP.md)
- [Threat.md](Threat.md)
- [Transaction_Security_Audit_FAQ.md](Transaction_Security_Audit_FAQ.md)

`SRC_FILE_MAP.md` is especially useful when tracing a rule from docs to implementation modules.

## Whitepaper and Modeling Artifacts

Canonical investor and technical narrative sources:
- [WhitePaper.md](WhitePaper.md) (technical markdown source)
- `Atho_Whitepaper_v3.pdf` (new technical v3 PDF artifact)
- `Atho_Whitepaper_Condensed_v3.pdf` (condensed high-level investor/casual overview)

Modeling outputs are regenerated from live constants through `Src/Main/esim.py` and published under `Docs/Emissions Modeling/` as both CSV and PDF.

## Maintenance Rules for This Folder

When policy constants change:
1. Update `Src/Utility/const.py` and validate invariants.
2. Regenerate emissions outputs with `python3 Src/Main/esim.py`.
3. Rebuild whitepaper PDFs from updated sources.
4. Update any docs that expose user-facing values (confirmations, fee floor, pool routing, maturity, supply figures).

When adding a new doc:
- place it in the most relevant section above,
- include date and scope,
- include code path references when making consensus or security claims,
- avoid copying stale policy snippets from older drafts.

## Reader Guidance by Role

- Operators: prioritize `quickstart`, `build-prereqs`, `Binaries`, `Network_Stack`, `LMDB`, and `Troubleshooting`.
- Wallet/API integrators: prioritize `Tx`, `ApiAuth`, `Wallet_Hierarchy_Visual_Guide`, `KeyManager`.
- Security reviewers: prioritize `WhitePaper`, `Consensus`, `Threat`, `Transaction_Security_Audit_FAQ`, and `SRC_FILE_MAP`.
- Economic reviewers: prioritize `Atho_Final_Specs`, `Emissions`, `Inflation_Deflationary`, and `Emissions Modeling/Entire_Overview.md`.

Using this index as the entry point helps keep all readers on the same, current policy baseline and prevents accidental dependence on stale assumptions.
