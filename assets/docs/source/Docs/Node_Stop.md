# Node Stop Utility (`Src/Main/stop.py`)

Last refresh: 2026-04-04.

This utility stops Atho node processes even when they were started from another terminal/background session.

It targets:
- `fullnode.py`
- `minernode.py`
- `walletnode.py`
- `runminer.py`
- `runnode.py` (launcher, optional/available)

## Why this exists

`runnode.py` launches background processes but does not include a dedicated stop command.  
`stop.py` gives you one place to:
- stop one node role (`full`, `miner`, `wallet`)
- stop everything
- stop specific PIDs
- integrate the same logic from API/GUI code

## CLI Usage

From project root:

```bash
./.venv/bin/python Src/Main/stop.py
```

No flags opens an interactive menu where you can choose:
- stop all
- stop full
- stop miner
- stop wallet
- stop launcher
- stop by PID

Non-interactive examples:

```bash
# list matching Atho node processes
./.venv/bin/python Src/Main/stop.py --list

# same as --list (explicit "active nodes" wording)
./.venv/bin/python Src/Main/stop.py --active

# live monitor (refreshes every 2s)
./.venv/bin/python Src/Main/stop.py --watch

# live monitor with custom refresh
./.venv/bin/python Src/Main/stop.py --watch --interval 1.0

# stop all nodes (and launcher)
./.venv/bin/python Src/Main/stop.py --all

# stop only miner processes
./.venv/bin/python Src/Main/stop.py --node miner

# stop specific PID(s)
./.venv/bin/python Src/Main/stop.py --pid 12345 --pid 12346

# preview without killing
./.venv/bin/python Src/Main/stop.py --all --dry-run

# machine-readable output
./.venv/bin/python Src/Main/stop.py --all --json
```

## API-Friendly Functions

You can import and reuse these directly:

```python
from Src.Main.stop import list_node_processes, stop_nodes, stop_pids

processes = list_node_processes(include_launcher=True)
result_all = stop_nodes("all", include_launcher=True)
result_miner = stop_nodes("miner")
result_pid = stop_pids([12345, 12346])
```

Main callable functions:
- `discover_node_processes(include_launcher=True)`
- `list_node_processes(include_launcher=True)`
- `active_nodes_snapshot(include_launcher=True)`
- `stop_nodes(target="all", include_launcher=True, timeout_seconds=5.0, force_kill=True, dry_run=False)`
- `stop_pids(pids, timeout_seconds=5.0, force_kill=True, dry_run=False)`

## Signal Behavior

For each matched process:
1. send `SIGTERM`
2. wait up to timeout (default 5s)
3. if still running and force-kill enabled, send `SIGKILL`

This is designed to cleanly stop nodes first, then force-stop only when needed.

## GUI/API Integration

The API node stop routes now call this stop logic, so GUI stop actions can terminate:
- processes started by API controller
- processes started from other terminals/background launchers

The API also exposes active node monitoring:
- `GET /nodes/active` -> returns active node list, roles, and PIDs (`counts_by_role`, `processes`, `by_role`).

## Safety Scope

`stop.py` only matches Atho node/launcher command paths listed above.  
It does **not** blanket-kill all Python processes.

