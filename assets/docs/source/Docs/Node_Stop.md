# Node Stop Utility (`Src/Main/stop.py`)

Last refresh: 2026-04-10

This utility provides a deterministic way to stop Atho node processes, including nodes started from different shells, launch scripts, or background sessions. It is designed for operational safety: match only known Atho process patterns, stop gracefully first, then force-stop only when required.

## 1) Why This Utility Exists

`runnode.py` and related launch paths can start multiple long-lived processes. Without a centralized stop mechanism, operators may rely on manual process hunting, which is error-prone and risks killing unrelated Python workloads.

`stop.py` addresses this by providing:
- role-aware stop actions (`full`, `miner`, `wallet`, `launcher`),
- all-node stop behavior,
- explicit PID targeting,
- list and watch modes for live visibility,
- reusable Python-callable functions for API/GUI integration.

## 2) Targeted Process Scope

Default target process names:
- `fullnode.py`
- `minernode.py`
- `walletnode.py`
- `runminer.py`
- `runnode.py` (launcher)

Scope safety rule:
- the tool is intentionally narrow,
- it does not terminate arbitrary Python processes,
- operator intent is explicit through flags or menu selection.

## 3) CLI Usage

From repository root:
```bash
./.venv/bin/python Src/Main/stop.py
```

No flags opens interactive mode with role-specific options.

Non-interactive examples:
```bash
# list matching Atho node processes
./.venv/bin/python Src/Main/stop.py --list

# same information with active-node wording
./.venv/bin/python Src/Main/stop.py --active

# live monitor view
./.venv/bin/python Src/Main/stop.py --watch
./.venv/bin/python Src/Main/stop.py --watch --interval 1.0

# stop all node roles + launcher
./.venv/bin/python Src/Main/stop.py --all

# stop only miner processes
./.venv/bin/python Src/Main/stop.py --node miner

# stop explicit pid(s)
./.venv/bin/python Src/Main/stop.py --pid 12345 --pid 12346

# preview only
./.venv/bin/python Src/Main/stop.py --all --dry-run

# machine-readable output
./.venv/bin/python Src/Main/stop.py --all --json
```

## 4) Programmatic API Functions

Importable utilities for integrations:
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

## 5) Signal Escalation Behavior

Stop sequence per process:
1. send `SIGTERM`,
2. wait up to timeout (default `5s`),
3. if still alive and force-kill enabled, send `SIGKILL`.

This preserves graceful shutdown opportunities for state flush and log closure while ensuring stuck processes cannot persist indefinitely.

## 6) API and GUI Integration

The same stop logic is used by API/GUI stop routes so user actions can terminate:
- processes started by API-managed lifecycle,
- processes started manually from other terminals.

Active monitoring endpoint:
- `GET /nodes/active`

Response includes:
- `counts_by_role`,
- per-process PID and role grouping,
- flattened process views for UI refresh logic.

## 7) Operational Recommendations

Production-like usage guidance:
- use `--list` or `--active` before stop actions when diagnosing incidents,
- use `--dry-run` in scripted environments before enabling destructive mode,
- keep force-kill enabled for unattended automation, but record stop outcomes,
- verify no pending maintenance operation depends on node liveness before issuing `--all`.

For service wrappers or orchestrators, call programmatic functions directly and capture JSON-style result payloads in logs.

## 8) Policy Context

The stop utility itself does not change consensus policy. It supports safe operations around the active production constants:
- block cadence `120s`,
- tx confirmations `10`, private tx confirmations `10`,
- coinbase maturity `150`,
- fee floor `350 atoms/vB`.

Reliable process lifecycle control is part of maintaining operational consistency for these policy-governed runtimes.

## 9) Failure and Recovery Notes

If a stop operation appears incomplete:
1. rerun `--list` to confirm remaining PID(s),
2. run targeted `--pid` stop for survivors,
3. inspect runtime logs for shutdown deadlocks,
4. verify parent launcher process did not immediately respawn roles.

When integrated with external supervisors, confirm restart policies are intentionally disabled during maintenance windows.

## 10) Bottom Line

`Src/Main/stop.py` is the supported shutdown control point for Atho node roles. Use it instead of ad-hoc process termination to reduce collateral risk, preserve graceful shutdown semantics, and maintain predictable operational behavior across CLI, API, and GUI surfaces.
