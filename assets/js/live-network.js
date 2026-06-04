import {
  defaultExplorerNetwork,
  explorerApiConfig,
  explorerNetworks,
  explorerRefresh
} from "./explorer-config.js";

const refs = {
  shell: document.querySelector("[data-home-live-shell]"),
  status: document.querySelector("[data-home-live-status]"),
  stats: document.querySelector("[data-home-live-stats]"),
  latest: document.querySelector("[data-home-live-latest]"),
  footnote: document.querySelector("[data-home-live-footnote]")
};

const state = {
  pollTimer: 0,
  uptimeTimer: 0,
  uptimeBaseSeconds: null
};

const ATHO_DECIMALS = 8;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

function formatNumber(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return "0";
  }
  return new Intl.NumberFormat("en-US").format(numeric);
}

function groupIntegerString(value) {
  const text = String(value ?? "").trim();
  if (!text) {
    return "0";
  }
  const negative = text.startsWith("-");
  const digits = negative ? text.slice(1) : text;
  if (!/^\d+$/.test(digits)) {
    return text;
  }
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return negative ? `-${grouped}` : grouped;
}

function atomsToDecimalString(atoms, decimals = ATHO_DECIMALS) {
  const raw = String(atoms ?? "").trim();
  if (!raw) {
    return "";
  }
  const negative = raw.startsWith("-");
  const digits = negative ? raw.slice(1) : raw;
  if (!/^\d+$/.test(digits)) {
    return "";
  }
  const padded = digits.padStart(decimals + 1, "0");
  const whole = padded.slice(0, -decimals) || "0";
  const fraction = padded.slice(-decimals).replace(/0+$/, "");
  return `${negative ? "-" : ""}${whole}${fraction ? `.${fraction}` : ""}`;
}

function formatAthoValue(value, atoms) {
  const source = atoms != null && atoms !== ""
    ? atomsToDecimalString(atoms)
    : String(value ?? "").trim().replace(/\s*ATHO$/i, "");
  if (!source || !/^-?\d+(\.\d+)?$/.test(source)) {
    return "Unavailable";
  }
  const [wholeRaw, fractionRaw = ""] = source.split(".");
  const whole = groupIntegerString(wholeRaw);
  return `${fractionRaw ? `${whole}.${fractionRaw}` : whole} ATHO`;
}

function formatTimestamp(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return "Unknown";
  }
  return new Date(numeric * 1000).toLocaleString();
}

function shortHash(value, left = 16, right = 12) {
  const text = String(value || "");
  if (!text || text.length <= left + right + 3) {
    return text;
  }
  return `${text.slice(0, left)}...${text.slice(-right)}`;
}

function pluralize(value, unit) {
  return `${value} ${unit}${value === 1 ? "" : "s"}`;
}

function formatUptime(seconds) {
  const totalSeconds = Math.max(0, Math.floor(Number.isFinite(Number(seconds)) ? Number(seconds) : 0));
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const secs = totalSeconds % 60;

  if (days > 0) {
    return `${pluralize(days, "Day")} ${pluralize(hours, "Hour")}`;
  }
  if (hours > 0) {
    return `${pluralize(hours, "Hour")} ${pluralize(minutes, "Minute")}`;
  }
  if (minutes > 0) {
    return `${pluralize(minutes, "Minute")} ${pluralize(secs, "Second")}`;
  }
  return pluralize(secs, "Second");
}

function setCanonicalUptime(seconds) {
  const uptimeSeconds = Math.max(0, Math.floor(Number.isFinite(Number(seconds)) ? Number(seconds) : NaN));
  if (!Number.isFinite(uptimeSeconds)) {
    return;
  }
  state.uptimeBaseSeconds = uptimeSeconds;
}

function liveUptimeSeconds() {
  if (!Number.isFinite(state.uptimeBaseSeconds) || state.uptimeBaseSeconds == null) {
    return null;
  }
  return state.uptimeBaseSeconds;
}

function formatNetworkUptime(stats) {
  const tickingSeconds = liveUptimeSeconds();
  if (tickingSeconds != null) {
    return formatUptime(tickingSeconds);
  }
  const rawSeconds = stats?.node_uptime_seconds ?? stats?.network_uptime_seconds;
  if (Number.isFinite(Number(rawSeconds))) {
    return formatUptime(Number(rawSeconds));
  }
  return stats?.node_uptime || stats?.network_uptime || "Updating";
}

function refreshVisibleUptime() {
  if (!(refs.stats instanceof HTMLElement)) {
    return;
  }
  const value = formatNetworkUptime({});
  refs.stats.querySelectorAll("[data-network-uptime]").forEach((node) => {
    node.textContent = value;
  });
}

function startUptimeTicker() {
  window.clearInterval(state.uptimeTimer);
  state.uptimeTimer = window.setInterval(refreshVisibleUptime, 1000);
}

function normalizeHashrate(value) {
  const text = String(value || "").trim();
  if (!text) {
    return "Unavailable";
  }
  return text;
}

function verifyPayloadIdentity(payload, networkKey) {
  const expected = explorerNetworks[networkKey];
  if (!expected) {
    throw new Error("unknown_network");
  }
  if (payload?.api_version !== explorerApiConfig.apiVersion) {
    throw new Error("unsupported_api_version");
  }
  if (payload?.network_id !== expected.networkId) {
    throw new Error("network_mismatch");
  }
  if (payload?.network !== expected.network) {
    throw new Error("network_mismatch");
  }
  if (payload?.genesis_hash !== expected.genesisHash) {
    throw new Error("genesis_mismatch");
  }
}

async function fetchNetworkStats() {
  const apiBase = explorerNetworks[defaultExplorerNetwork].apiBaseUrl;
  if (!apiBase) {
    throw new Error("api_unavailable");
  }
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 12_000);
  try {
    const response = await fetch(`${apiBase}/network/stats`, {
      headers: { Accept: "application/json" },
      signal: controller.signal
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload?.success) {
      throw new Error(payload?.error || `http_${response.status}`);
    }
    verifyPayloadIdentity(payload, defaultExplorerNetwork);
    return payload.data;
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error("timeout");
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}

function setStatus(message, tone = "info") {
  if (!(refs.status instanceof HTMLElement)) {
    return;
  }
  refs.status.textContent = message;
  refs.status.dataset.tone = tone;
}

function renderStats(stats) {
  if (!(refs.stats instanceof HTMLElement)) {
    return;
  }
  const cards = [
    ["Network", "Testnet"],
    ["Uptime", formatNetworkUptime(stats)],
    ["Height", formatNumber(stats.height)],
    ["Hashrate", normalizeHashrate(stats.estimated_hashrate)],
    ["Active Peers", formatNumber(stats.active_peers)],
    ["Mempool TXs", formatNumber(stats.mempool_transactions)],
    ["Circulating Supply", formatAthoValue(stats.circulating_supply, stats.circulating_supply_atoms)],
    ["Current Reward", formatAthoValue(stats.current_block_reward, stats.current_block_reward_atoms)]
  ];
  refs.stats.innerHTML = cards
    .map(
      ([label, value]) => `
        <article class="live-stat-card">
          <span class="live-stat-label">${escapeHtml(label)}</span>
          <strong class="live-stat-value" ${label === "Uptime" ? 'data-network-uptime=""' : ""}>${escapeHtml(value)}</strong>
        </article>
      `
    )
    .join("");
}

function renderLatest(stats) {
  if (!(refs.latest instanceof HTMLElement)) {
    return;
  }
  refs.latest.innerHTML = `
    <div class="live-network-note-card">
      <h3>Network Snapshot</h3>
      <div class="live-network-snapshot-grid">
        <article class="live-network-snapshot-item">
          <span>Latest Block</span>
          <strong>#${escapeHtml(formatNumber(stats.height))}</strong>
          <code>${escapeHtml(shortHash(stats.latest_block_hash, 20, 14))}</code>
        </article>
        <article class="live-network-snapshot-item">
          <span>Average Block Time</span>
          <strong>${escapeHtml(stats.average_block_time || "Unknown")}</strong>
          <p>Rolling network window</p>
        </article>
        <article class="live-network-snapshot-item">
          <span>Estimated Hashrate</span>
          <strong>${escapeHtml(normalizeHashrate(stats.estimated_hashrate))}</strong>
          <p>Recent chain estimate</p>
        </article>
        <article class="live-network-snapshot-item">
          <span>Current Reward</span>
          <strong>${escapeHtml(formatAthoValue(stats.current_block_reward, stats.current_block_reward_atoms))}</strong>
          <p>Current block subsidy</p>
        </article>
      </div>
      <p class="live-network-meta">
        Refreshes every 15 seconds.
      </p>
    </div>
  `;
}

function renderFailure(errorCode) {
  if (refs.stats instanceof HTMLElement) {
    refs.stats.innerHTML = `
      <article class="live-stat-card live-stat-card-wide">
        <span class="live-stat-label">Live Feed</span>
        <strong class="live-stat-value">Unavailable</strong>
        <p class="live-stat-copy">
          The homepage could not reach the live feed right now. Error:
          <code>${escapeHtml(errorCode)}</code>
        </p>
      </article>
    `;
  }
  if (refs.latest instanceof HTMLElement) {
    refs.latest.innerHTML = "";
  }
}

async function refreshLiveNetwork() {
  try {
    const stats = await fetchNetworkStats();
    setCanonicalUptime(stats.node_uptime_seconds ?? stats.network_uptime_seconds);
    renderStats(stats);
    renderLatest(stats);
    setStatus("Live testnet uptime and chain data refresh every 15 seconds.", "success");
  } catch (error) {
    const code = error?.message || "request_failed";
    renderFailure(code);
    setStatus("Live feed unavailable right now.", "error");
  }
}

function startPolling() {
  window.clearInterval(state.pollTimer);
  state.pollTimer = window.setInterval(() => {
    void refreshLiveNetwork();
  }, explorerRefresh.networkStatsMs);
}

function init() {
  if (!(refs.shell instanceof HTMLElement)) {
    return;
  }
  if (refs.footnote instanceof HTMLElement) {
    refs.footnote.textContent = "Live testnet stats refresh every 15 seconds.";
  }
  startUptimeTicker();
  void refreshLiveNetwork();
  startPolling();
}

init();
