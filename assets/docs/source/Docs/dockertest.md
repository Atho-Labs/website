# Docker P2P Test Harness

Status: Alpha documentation snapshot (2026-03-12).

Run two full nodes plus two miners and CLI locally via Docker to exercise the P2P network. All nodes speak P2P on port 56000 inside the network; host bindings differ so they can coexist on one machine.
For baseline Docker usage, start with `Docs/Docker.md`; this file is the higher-load harness.
Last refresh: 2026-03-12.

## Prerequisites
- Docker Desktop running
- Repo root: `/path/to/<repo-dir>`

## Bring up the stack
```sh
cd /path/to/<repo-dir>

# Build images (rerun if you change code)
docker compose build --no-cache

# Optional override used by docker-compose.override.yml
export ATHO_ADVERTISE_HOST=host.docker.internal

# Start primary full node, secondary full node, two miners, and CLI
docker compose up -d fullnode fullnode2 miner miner2 cli
```

## Observe logs
Run in another terminal to watch node activity:
```sh
docker compose logs -f fullnode fullnode2 miner miner2
```

## Interact with the CLI
```sh
docker compose exec -it cli python Src/GUI/cliui.py
```

## Hit APIs directly
- Primary full node: `curl http://127.0.0.1:10100/chain/info`
- Secondary full node: `curl http://127.0.0.1:10300/chain/info`
- Miner1: resolve host port first with `docker compose port miner 10200`, then curl `http://127.0.0.1:<resolved_port>/chain/info`
- Miner2: resolve host port first with `docker compose port miner2 10250`, then curl `http://127.0.0.1:<resolved_port>/chain/info`

## Ports and data
- P2P (in-container): 56000 for every node.
- P2P (host bindings): fullnode 56000→56000, fullnode2 56002→56000, miner1 56001→56000, miner2 56003→56000 (use `docker compose ps` to confirm).
- APIs (host): fullnode 10100, fullnode2 10300; miner1/miner2 use random host ports mapped to container ports 10200/10250 (check via `docker compose port miner 10200` and `docker compose port miner2 10250`).
- Data/logs are volume-mounted per node:
  - Primary: `./blockchain_storage`, `./Keys`, `./Logs`
  - Secondary: `./blockchain_storage_node2`, `./Keys_node2`, `./Logs_node2`
  - Miner1: `./blockchain_storage_miner`, `./Keys_miner`, `./Logs_miner`
  - Miner2: `./blockchain_storage_miner2`, `./Keys_miner2`, `./Logs_miner2`

## Bootstrap to an external/host node
- Set the seed to your host IP/P2P port (default P2P is usually 56000 unless you overrode it):
  ```sh
  export HOST_IP="192.0.2.10"   # replace with your host/seed IP
  export HOST_P2P="56000"       # replace if your seed uses a different P2P port
  export ATHO_BOOTSTRAP=${HOST_IP}:${HOST_P2P}
  export ATHO_RESET_PEERS=1
  docker compose up -d fullnode fullnode2 miner miner2
  ```
- Verify connectivity from inside a container:
  ```sh
  docker compose exec -e HOST_IP="$HOST_IP" -e HOST_P2P="$HOST_P2P" fullnode sh -c "python - <<'PY'
import os
import socket
s=socket.socket(); s.settimeout(3)
try:
    s.connect((os.environ['HOST_IP'], int(os.environ['HOST_P2P'])))
    print('connect ok')
except Exception as e:
    print('connect failed', e)
PY"
  ```
- Check logs for `handshake_ok` and `sync_headers_ok`.

## Shutdown
```sh
docker compose down
# Optional fresh start:
# docker compose down -v
```

## Reset to a clean state
If you need to wipe all local data/peers and start fresh:
```sh
cd /path/to/<repo-dir>
docker compose down -v
rm -rf blockchain_storage* Keys* Logs* Src/Config/Peers.json
```
Then rerun the build/up steps above.

## Ten-node add-on (for P2P stress)
- Assumes the base stack above is already up (`fullnode` is the bootstrap peer).
- Adds 9 more full nodes (nodes 2–10) on the same Docker network with unique host ports and isolated data.

Start them:
```sh
cd /path/to/<repo-dir>

# Launch 9 additional full nodes (node2..node10)
for i in $(seq 2 10); do
  p2p=$((56100 + (i-2)))                  # host P2P port (56100..56108)
  api=$((10300 + (i-2)*100))              # host API port (10300,10400,...)
  docker run -d \
    --name atho-fullnode-$i \
    --network atho-beta-main_default \
    -p "${p2p}:56000" \
    -p "${api}:${api}" \
    -e ATHO_FULLNODE_API=true \
    -e ATHO_FULLNODE_API_HOST=0.0.0.0 \
    -e ATHO_FULLNODE_API_PORT="${api}" \
    -e ATHO_P2P_PORT=56000 \
    -e ATHO_BOOTSTRAP=fullnode:56000 \
    -e ATHO_API_REQUIRE_HTTPS=false \
    -e ATHO_NETWORK=mainnet \
    -v "$PWD/blockchain_storage_node${i}:/app/blockchain_storage" \
    -v "$PWD/Keys_node${i}:/app/Keys" \
    -v "$PWD/Logs_node${i}:/app/Logs" \
    atho/fullnode:local \
    python Src/Node/fullnode.py
done
```

Check one of the extra nodes:
```sh
docker logs -f atho-fullnode-5
curl http://127.0.0.1:10500/chain/info   # adjust port per node: 10300,10400,...,11100
```

Tear them down (keeps volumes):
```sh
docker rm -f atho-fullnode-{2..10}
```

## Per-terminal commands (copy/paste)
- Terminal 1: build + start stack
  ```sh
  cd /path/to/<repo-dir>
  docker compose build
  docker compose up -d fullnode fullnode2 miner miner2 cli
  ```
- Terminal 2: follow logs for built-in services
  ```sh
  cd /path/to/<repo-dir>
  docker compose logs -f fullnode fullnode2 miner miner2 cli
  ```
- Optional CLI shell
  ```sh
  cd /path/to/<repo-dir>
  docker compose exec -it cli python Src/GUI/cliui.py
  ```
- API checks
  ```sh
  curl http://127.0.0.1:10100/chain/info   # fullnode
  curl http://127.0.0.1:10300/chain/info   # fullnode2
  # miner1: use the host port from `docker compose port miner 10200`
  # miner2: use the host port from `docker compose port miner2 10250`
  ```

## Host + Docker sync test on P2P port 56000
If you run a seed/full node on the host and want Docker nodes to join it on P2P 56000:
```sh
cd /path/to/<repo-dir>
docker compose down -v || true
rm -rf blockchain_storage* Keys* Logs* Src/Config/Peers.json

HOST_IP="192.0.2.10"   # replace with your host/seed IP
HOST_P2P="56000"       # from host NodePorts.json

ATHO_BOOTSTRAP=${HOST_IP}:${HOST_P2P} ATHO_RESET_PEERS=1 docker compose up -d fullnode miner miner2

# Discover miner2 host ports if needed
docker compose port miner2 56000    # P2P host port
docker compose port miner2 10250    # API host port
```
Verify connectivity from inside a container:
```sh
docker compose exec -e HOST_IP="$HOST_IP" -e HOST_P2P="$HOST_P2P" fullnode sh -c "python - <<'PY'
import os
import socket
s=socket.socket(); s.settimeout(3)
try:
    s.connect((os.environ['HOST_IP'], int(os.environ['HOST_P2P'])))
    print('connect ok')
except Exception as e:
    print('connect failed', e)
PY"
```
Watch logs for `handshake_ok` / `sync_headers_ok`.
