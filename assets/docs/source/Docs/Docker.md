# Docker Guide (Atho)

Last refresh: 2026-03-27.

This guide walks through building and running Atho nodes with Docker/Compose on Linux, macOS, and Windows (Docker Desktop). It also shows how to run multiple nodes without port conflicts and how to use the CLI container.

## Prereqs
- Install Docker (Docker Desktop on macOS/Windows; Docker Engine on Linux).
- Optional: docker-compose v1/v2 (Compose v2 is built into recent Docker Desktop).

## What’s in the repo
- `docker/Dockerfile`: builds a Python 3.11 image, installs deps, builds `falcon_cli`, and runs `Src/Node/fullnode.py` by default.
- `docker/docker-entrypoint.sh`: simple entrypoint wrapper.
- `docker/docker-compose.yml`: services `fullnode`, `miner`, `miner2`, optional `fullnode2`, and `cli`. P2P is fixed to 56000 in-container; host ports are distinct (56000/56001/56002/56003). Miner APIs use randomized host ports (still 10200/10250 in-container) to avoid conflicts.
- Bootstrap defaults: fullnode sets `ATHO_BOOTSTRAP=""` (no external seed); miners bootstrap to `fullnode:56000` on the compose network.
- P2P bootstrap seeds are now **env-only** (`ATHO_BOOTSTRAP` as comma-separated `host:port`); no hardcoded seeds.

## Quick start (full node + miners + CLI, internal networking)
```bash
export ATHO_ADVERTISE_HOST=host.docker.internal   # avoids blank-variable compose warnings
docker compose -f docker/docker-compose.yml -f docker/docker-compose.override.yml up --build fullnode miner miner2 cli
```
This builds the image and starts:
- `fullnode`: P2P 56000 and API 10100 inside the compose network.
- `miner`: P2P 56000 (host bind 56001) and API 10200 in-container (host port randomized); bootstraps to `fullnode:56000`.
- `miner2`: P2P 56000 (host bind 56003) and API 10250 in-container (host port randomized); bootstraps to `fullnode:56000`.
- `cli`: interactive CLI pointing at `http://fullnode:10100`.

Stop: `docker compose -f docker/docker-compose.yml -f docker/docker-compose.override.yml down`

### Run just a full node (no miner/cli)
```bash
docker compose -f docker/docker-compose.yml -f docker/docker-compose.override.yml up --build fullnode
```

### Run just a miner (no full/cli)
Be sure there’s a peer to bootstrap to (in this repo the compose default is `fullnode:56000`):
```bash
docker compose -f docker/docker-compose.yml -f docker/docker-compose.override.yml up --build miner
```

### Run both nodes (no cli)
```bash
docker compose -f docker/docker-compose.yml -f docker/docker-compose.override.yml up --build fullnode miner
```

## Accessing the CLI
If the CLI container exits (after a session), rerun it:
```bash
docker compose -f docker/docker-compose.yml -f docker/docker-compose.override.yml run --rm cli
```

## Running multiple nodes (no host port conflicts)
Use the built-in services; they run on internal ports (P2P 56000, APIs 10100/10200/10250) with separate volumes. For more nodes, duplicate a service with a new name and distinct volumes. Example addition:
```yaml
  fullnode2:
    image: atho/fullnode:local
    environment:
      ATHO_FULLNODE_API: "true"
      ATHO_FULLNODE_API_HOST: "0.0.0.0"
      ATHO_FULLNODE_API_PORT: "10300"
      ATHO_P2P_PORT: "56000"
      ATHO_API_REQUIRE_HTTPS: "false"
      ATHO_NETWORK: "mainnet"
      ATHO_BOOTSTRAP: "fullnode:56000"   # point at first node
    volumes:
      - ./blockchain_storage2:/app/blockchain_storage
      - ./Keys2:/app/Keys
      - ./Logs2:/app/Logs
    depends_on:
      - fullnode
    command: ["python", "Src/Node/fullnode.py"]
```
Now run `docker compose -f docker/docker-compose.yml -f docker/docker-compose.override.yml up --build` and both nodes run on internal ports (56000/10100/10300). CLI can target either by setting `ATHO_API_URL` to `http://fullnode:10100` or `http://fullnode2:10300`.

## Exposing ports to the host (optional)
If you want to reach a node from the host, add `ports:` with unique host mappings:
```yaml
    ports:
      - "56001:56000"    # host:container P2P
      - "10101:10100"    # host:container API
```
Use different host ports per node (e.g., 56001/10101, 56002/10102, etc.). Then set CLI `ATHO_API_URL` to `http://localhost:10101` for that node.

## Running the image manually (without compose)
```bash
docker build -f docker/Dockerfile -t atho-node .
docker run -d --name n1 \
  -e ATHO_P2P_PORT=56000 -e ATHO_FULLNODE_API_PORT=10100 \
  -v $(pwd)/node1:/app/blockchain_storage \
  -v $(pwd)/Keys:/app/Keys \
  -v $(pwd)/Logs:/app/Logs \
  atho-node
# Second node on different host ports
docker run -d --name n2 \
  -e ATHO_P2P_PORT=56000 -e ATHO_FULLNODE_API_PORT=10100 \
  -p 56001:56000 -p 10101:10100 \
  -v $(pwd)/node2:/app/blockchain_storage \
  -v $(pwd)/Keys2:/app/Keys \
  -v $(pwd)/Logs2:/app/Logs \
  atho-node
```

## Configuring CLI target
- Internal compose network: `ATHO_API_URL=http://fullnode:10100` (default in CLI service).
- Host-mapped ports: set `ATHO_API_URL=http://localhost:<host_api_port>` when running `cliui.py`.
- External bootstrap: set `ATHO_BOOTSTRAP=<seed_ip>:56000` so docker nodes sync to your host/seed. Use `ATHO_RESET_PEERS=1` to clear stale peers on startup.

## Performance-related knobs (containers)
- PoW worker scaling:
  - `POW_MULTIPROCESS_ENABLED` (default on)
  - `POW_WORKER_CORES` (requested core count; runtime-capped to available CPUs)
  - `POW_WORKER_NONCE_CHUNK` (worker batch size)
  - `POW_PROGRESS_INTERVAL_SEC` (progress print interval)
- Network/API scan controls:
  - `ATHO_MAX_MESSAGE_SIZE` (P2P message cap; defaults to consensus block-size ceiling)
  - API history/recent/balance caps are constant-driven and already bounded.

## Security notes (even for testnets)
- API key + user/pass auth is required by default. If you expose APIs without TLS/HMAC, credentials and payloads can still be intercepted/replayed. Set `ATHO_API_HMAC=true` and run behind TLS/reverse proxy when publishing ports.
- P2P is plaintext/unauthenticated by design; firewall appropriately if exposed.
- Keys/LMDB data are stored on host volumes (`blockchain_storage`, `Keys`, `Logs`); they are unencrypted. Use permissions and avoid sharing volumes across nodes unless intentional.
- Falcon CLI pinning is strict on `mainnet`/`testnet`; keep `Constants.FALCONCLI_PINNED_VERSION_DIGESTS` current for the active consensus version before deployment.

## Platform notes
- macOS/Windows: use Docker Desktop; commands are the same. Host volume paths may differ (`%cd%` or absolute paths).
- ARM hosts: AVX2 is opt-in (`FALCON_USE_AVX2=true`). Keep the default (`false`) on ARM/older CPUs, or provide a known-good prebuilt binary.

## Troubleshooting
- Port in use: adjust host mappings in `ports:` or remove them to keep services internal.
- falcon_cli build fails: ensure build-essential/clang is present (installed in Dockerfile); if AVX2 was enabled on an unsupported CPU, rebuild with `FALCON_USE_AVX2=false`.
- Map full errors: ensure the mounted volume has free space and raise the relevant LMDB size ceiling if a store reaches its configured max; bounded `AUTO_RESIZE_LMDB` growth is already supported and enabled in current code.
- CLI can’t connect: check `NodePorts.json` and `ATHO_API_URL`; ensure correct host/port mapping if accessing from host.
- Miner not starting: ensure you’re running the `miner` service (`docker compose up miner`) and that it can reach a bootstrap peer (defaults to `fullnode:56000` in compose).
- Miner not starting: ensure you’re running the `miner` service (`docker compose -f docker/docker-compose.yml -f docker/docker-compose.override.yml up miner`) and that it can reach a bootstrap peer (defaults to `fullnode:56000` in compose).
- Hashrate telemetry check: query `/network/hashrate/live` on your API port to verify local and peer reports are being aggregated.
