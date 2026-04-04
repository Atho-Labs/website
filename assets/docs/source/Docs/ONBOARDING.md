# Atho Network — Developer Onboarding

Last refresh: 2026-04-04.

This doc is a practical, minimal path to get a new developer productive fast.

All detailed docs live in `Docs/`. Use the [documentation index](INDEX.md) in this folder as the central map, and keep this file for the developer path.

## 0) Prerequisites
- Python 3.9+
- Docker Desktop (optional, for multi-node testing)
- macOS/Linux/WSL recommended

## 1) Repo layout (high‑level)
- `Src/` — core code (nodes, blockchain, storage, P2P, miner, API, CLI)
- `Docs/` — protocol and component docs
- `docker/docker-compose.yml` — Docker services (fullnode/miner/etc.)
- `Src/Main/runnode.py` — local launcher for full/miner/wallet nodes
- `logs/` — runtime logs (ignored in onboarding)

## 2) Local setup (venv)
```bash
cd /path/to/<repo-dir>
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## 3) Local run (single machine)
Launcher:
```bash
source .venv/bin/activate
python Src/Main/runnode.py
```
Pick:
1 = Full node, 2 = Miner, 3 = Wallet/API, 4 = All.

## 4) Docker run (multi‑node test)
Start full node in one terminal:
```bash
cd /path/to/<repo-dir>
docker compose down -v
docker compose -f docker/docker-compose.yml -f docker/docker-compose.override.yml build
docker compose -f docker/docker-compose.yml -f docker/docker-compose.override.yml up fullnode
```

Start miner in another terminal:
```bash
cd /path/to/<repo-dir>
docker compose -f docker/docker-compose.yml -f docker/docker-compose.override.yml up miner
```

## 5) Logs to watch
```bash
tail -f logs/terminal/terminal_events.log
tail -f logs/network/network.log
```

Key signals:
- `handshake_ok` — peers connected
- `sync_verified_blocks` — blocks downloaded and verified
- `block_parent_missing` / `ORPHAN` — parent not yet available
- `Mining tip height=...` — miner following chain tip

## 6) Common env knobs
Set per shell (or docker-compose override):
- `ATHO_P2P_PORT` — P2P TCP port
- `ATHO_DB_ROOT` — storage root
- `ATHO_LOG_ROOT` — logs root
- `ATHO_MINER_SYNC_WAIT` — delay before mining
- `ATHO_MNEMONIC_PBKDF2_ITERS` — optional override for mnemonic PBKDF2-HMAC-SHA3-512 iterations (default is secure baseline in code)

## 6.1) Wallet/key model (current)
- Key generation is mnemonic-first (`atho-mnemonic-v1`) with default **24 words**.
- Supported phrase lengths: **12 / 24 / 48**.
- Mnemonic restore is deterministic by phrase + passphrase + path (`network/account/role/index`).
- Wallet APIs now include:
  - `POST /wallet/create`
  - `POST /wallet/recover_mnemonic`
  - `POST /wallet/export`
  - `POST /wallet/import`
- CLI commands include:
  - `wallet new [12|24|48]`
  - `wallet recover`
  - `wallet export`
  - `wallet import`

## 7) Where to start in code
- `Src/Main/runnode.py` — launcher
- `Src/Node/fullnode.py` / `minernode.py` — node entrypoints
- `Src/Network/*` — P2P, peers, sync
- `Src/Storage/*` — LMDB stores
- `Src/Miner/*` — mining loop + PoW
- `Src/Blockchain/*` — block/chain validation

## 8) `Src/` module map (one‑by‑one)
This project is modular by domain. Below is a quick map of every top‑level module under `Src/` and its role.

- `Src/Accounts/`
  - Key management (Falcon keys, export/import, format enforcement).
- `Src/Api/`
  - FastAPI app, auth, API routes (wallet, chain, tx, mining, peers).
- `Src/Blockchain/`
  - Core blockchain logic (block model, chain validation, genesis, reorg/orphan handling).
- `Src/Config/`
  - Config files (API keys, port mappings, bootstrap seeds, etc.).
- `Src/Falcon/`
  - Falcon signature integration and CLI/binaries.
- `Src/Kyber/`
  - Vendored Kyber KEM implementation and wrappers used by wallet lockbox workflows.
- `Src/GUI/`
  - Desktop GUI, CLI UI, Web Explorer (`web_explorer.html`), and local explorer bridge server.
- `Src/Main/`
  - Launchers and main entrypoints (`runnode.py`, emission bootstrap, etc.).
- `Src/Miner/`
  - Mining loop, PoW manager, candidate block building.
- `Src/Network/`
  - P2P server, peer manager, sync logic, bootstrap/seed handling, network logs.
- `Src/SigWit/`
  - Witness model, commitments, wtxid logic, pruning helpers.
- `Src/Storage/`
  - LMDB stores for blocks, UTXO, mempool, and orphan branches.
- `Src/Transactions/`
  - Transaction model, inputs/outputs, signing, verification, coinbase.
- `Src/Utility/`
  - Shared helpers (constants, hashing, logging, serialization, trace/debug).

### Modular flow (high‑level)
1. `Node/*` starts services → initializes `Storage/*`, `Blockchain/*`, `Transactions/*`.
2. `Network/*` handles P2P, peers, sync → feeds blocks/tx into `Blockchain/*` + `Transactions/*`.
3. `Miner/*` builds candidates → validates via `Blockchain/*` + `Transactions/*`.
4. `Api/*` exposes chain/tx/miner data → uses `Storage/*`, `Transactions/*`, and `Accounts/*` key/material services.

## 9) Full per‑file / per‑class map (auto‑generated)
For extreme detail (every `Src/` file, class, method, and top‑level function with signatures + docstrings), see:
- [SRC_FILE_MAP.md](SRC_FILE_MAP.md)

## 10) If something fails
- Verify Docker Desktop is running.
- Make sure DB paths exist (`blockchain_storage/...`).
- Check `logs/terminal/terminal_events.log`.
- Confirm peers are active (handshake events).

## 11) Next steps (recommended)
- Read: [Consensus.md](Consensus.md), [Tx.md](Tx.md), [Sigwit.md](Sigwit.md)
- Run: local full + miner, then Docker full + miner, compare tip heights.
- Keep the [documentation index](INDEX.md) open while you work.
