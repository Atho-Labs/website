import {
  defaultExplorerNetwork,
  explorerApiConfig,
  explorerNetworks
} from "./explorer-config.js";

const HASH_LENGTH = 96;
const ATHO_DECIMALS = 12;
const LOCK_TIME_TIMESTAMP_THRESHOLD = 500_000_000;

const state = {
  activeNetwork: defaultExplorerNetwork,
  route: { page: "home", ref: "" },
  dashboard: null,
  cache: new Map(),
  txInline: new Map(),
  homeBlocksPage: 0,
  homeBlocksPageSize: 10,
  homeTxPage: 0,
  homeTxPageSize: 10,
  refreshTimer: 0,
  uptimeTimer: 0,
  uptimeBaseSeconds: null,
  busyDepth: 0,
  currentJsonTitle: "",
  currentJsonPayload: null
};

const refs = {
  pageRoot: document.getElementById("pageRoot"),
  queryInput: document.getElementById("queryInput"),
  warnBox: document.getElementById("warnBox"),
  networkBadge: document.getElementById("networkBadge"),
  headerStatus: document.getElementById("headerStatus"),
  loadingOverlay: document.getElementById("loadingOverlay"),
  loadingText: document.getElementById("loadingText"),
  jsonModal: document.getElementById("jsonModal"),
  jsonModalTitle: document.getElementById("jsonModalTitle"),
  jsonModalBody: document.getElementById("jsonModalBody"),
  tabs: Array.from(document.querySelectorAll("[data-network-tab]"))
};

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

function escAttr(value) {
  return esc(String(value ?? ""));
}

function toNum(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function clip(value, max = 56) {
  const text = String(value ?? "");
  if (text.length <= max) {
    return text;
  }
  const left = Math.max(8, Math.floor((max - 3) / 2));
  return `${text.slice(0, left)}...${text.slice(-left)}`;
}

function formatNumber(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return "--";
  }
  return new Intl.NumberFormat("en-US").format(numeric);
}

function groupIntegerString(value) {
  const text = String(value ?? "").trim();
  if (!text) {
    return "--";
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
  if (decimals <= 0) {
    return negative ? `-${digits}` : digits;
  }
  const padded = digits.padStart(decimals + 1, "0");
  const whole = padded.slice(0, -decimals) || "0";
  const fraction = padded.slice(-decimals);
  return `${negative ? "-" : ""}${whole}.${fraction}`;
}

function normalizeDecimalString(value) {
  const text = String(value ?? "").trim().replace(/\s*ATHO$/i, "");
  if (!text || !/^-?\d+(\.\d+)?$/.test(text)) {
    return "";
  }
  return text;
}

function formatDecimalString(value, { minDecimals = 0, maxDecimals = ATHO_DECIMALS } = {}) {
  const text = normalizeDecimalString(value);
  if (!text) {
    return "--";
  }
  const negative = text.startsWith("-");
  const unsigned = negative ? text.slice(1) : text;
  const [wholeRaw, fractionRaw = ""] = unsigned.split(".");
  const whole = groupIntegerString(negative ? `-${wholeRaw}` : wholeRaw);
  if (maxDecimals <= 0) {
    return whole;
  }
  let fraction = fractionRaw.slice(0, maxDecimals).replace(/0+$/, "");
  if (fraction.length < minDecimals) {
    fraction = fraction.padEnd(minDecimals, "0");
  }
  return fraction ? `${whole}.${fraction}` : whole;
}

function formatAthoValue(value, atoms, { unit = true, minDecimals = 0, maxDecimals = ATHO_DECIMALS } = {}) {
  const source = atoms != null && atoms !== ""
    ? atomsToDecimalString(atoms, ATHO_DECIMALS)
    : normalizeDecimalString(value);
  const formatted = formatDecimalString(source, { minDecimals, maxDecimals });
  if (formatted === "--") {
    return "--";
  }
  return unit ? `${formatted} ATHO` : formatted;
}

function renderValueWithNote(primary, note = "") {
  if (!note) {
    return esc(primary);
  }
  return `${esc(primary)}<span class="detail-note">${esc(note)}</span>`;
}

function formatLockTimeValue(lockTime) {
  const numeric = Math.max(0, Math.floor(toNum(lockTime, 0)));
  if (!numeric) {
    return {
      primary: "Disabled",
      note: "No lock-time rule"
    };
  }
  if (numeric < LOCK_TIME_TIMESTAMP_THRESHOLD) {
    return {
      primary: `Block ${formatNumber(numeric)}`,
      note: "Height-based lock"
    };
  }
  return {
    primary: `Epoch ${formatNumber(numeric)}`,
    note: formatTimestamp(numeric)
  };
}

function formatTimestamp(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return "--";
  }
  return new Date(numeric * 1000).toLocaleString();
}

function pluralize(value, unit) {
  return `${value} ${unit}${value === 1 ? "" : "s"}`;
}

function formatUptime(seconds) {
  const totalSeconds = Math.max(0, Math.floor(toNum(seconds, 0)));
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
  const uptimeSeconds = Math.max(0, Math.floor(toNum(seconds, NaN)));
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
  const rawSeconds = toNum(stats?.node_uptime_seconds ?? stats?.network_uptime_seconds, NaN);
  if (Number.isFinite(rawSeconds)) {
    return formatUptime(rawSeconds);
  }
  return stats?.node_uptime || stats?.network_uptime || "--";
}

function refreshVisibleUptime() {
  if (!state.dashboard) {
    return;
  }
  const uptime = formatNetworkUptime(state.dashboard.stats);
  document.querySelectorAll("[data-network-uptime]").forEach((node) => {
    node.textContent = uptime;
  });
}

function startUptimeTicker() {
  window.clearInterval(state.uptimeTimer);
  state.uptimeTimer = window.setInterval(refreshVisibleUptime, 1000);
}

function formatAge(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return "--";
  }
  const diff = Math.max(0, Math.floor(Date.now() / 1000) - numeric);
  if (diff < 60) {
    return `${diff}s ago`;
  }
  if (diff < 3600) {
    return `${Math.floor(diff / 60)}m ago`;
  }
  if (diff < 86_400) {
    return `${Math.floor(diff / 3600)}h ago`;
  }
  return `${Math.floor(diff / 86_400)}d ago`;
}

function formatBytes(value) {
  const numeric = Math.max(0, Math.floor(toNum(value, 0)));
  if (!numeric) {
    return "0 B";
  }
  if (numeric >= 1_000_000) {
    return `${(numeric / 1_000_000).toFixed(2)} MB`;
  }
  if (numeric >= 1_000) {
    return `${(numeric / 1_000).toFixed(2)} KB`;
  }
  return `${numeric} B`;
}

function formatVBytes(value) {
  const numeric = Math.max(0, Math.floor(toNum(value, 0)));
  if (!numeric) {
    return "0 vB";
  }
  if (numeric >= 1_000_000) {
    return `${(numeric / 1_000_000).toFixed(2)} MvB`;
  }
  if (numeric >= 1_000) {
    return `${(numeric / 1_000).toFixed(2)} kvB`;
  }
  return `${numeric} vB`;
}

function shortHash(value, left = 18, right = 14) {
  const text = String(value ?? "");
  if (!text || text.length <= left + right + 3) {
    return text || "--";
  }
  return `${text.slice(0, left)}...${text.slice(-right)}`;
}

function classifyQuery(raw) {
  const query = String(raw ?? "").trim();
  if (!query) {
    return { kind: "empty", value: "" };
  }
  if (/^\d+$/.test(query)) {
    return { kind: "height", value: query };
  }
  if (/^[0-9a-fA-F]{96}$/.test(query)) {
    return { kind: "hash96", value: query.toLowerCase() };
  }
  if (/^[A-Za-z0-9]{24,128}$/.test(query)) {
    return { kind: "address", value: query };
  }
  return { kind: "unknown", value: query };
}

function createApiError(code) {
  const error = new Error(code);
  error.code = code;
  return error;
}

function isNotFoundCode(code) {
  const text = String(code ?? "").trim().toLowerCase();
  return (
    text === "not_found"
    || text === "http_404"
    || text.endsWith("_not_found")
    || text.includes("not found")
  );
}

function getNetworkConfig(networkKey = state.activeNetwork) {
  return explorerNetworks[networkKey];
}

function setBusy(active, message = "") {
  if (!(refs.loadingOverlay instanceof HTMLElement)) {
    return;
  }
  if (active) {
    state.busyDepth += 1;
    if (refs.loadingText instanceof HTMLElement && message) {
      refs.loadingText.textContent = message;
    }
    refs.loadingOverlay.classList.add("open");
    document.body.classList.add("busy");
    return;
  }
  state.busyDepth = Math.max(0, state.busyDepth - 1);
  if (state.busyDepth > 0) {
    return;
  }
  refs.loadingOverlay.classList.remove("open");
  document.body.classList.remove("busy");
  if (refs.loadingText instanceof HTMLElement) {
    refs.loadingText.textContent = "Loading explorer data...";
  }
}

async function withBusy(message, work) {
  setBusy(true, message);
  try {
    return await work();
  } finally {
    setBusy(false);
  }
}

function showWarn(message = "", tone = "warn") {
  if (!(refs.warnBox instanceof HTMLElement)) {
    return;
  }
  if (!message) {
    refs.warnBox.style.display = "none";
    refs.warnBox.textContent = "";
    refs.warnBox.classList.remove("error");
    return;
  }
  refs.warnBox.style.display = "block";
  refs.warnBox.textContent = message;
  refs.warnBox.classList.toggle("error", tone === "error");
}

function setHeaderStatus(message) {
  if (refs.headerStatus instanceof HTMLElement) {
    refs.headerStatus.textContent = message;
  }
}

function setNetworkBadge(message) {
  if (refs.networkBadge instanceof HTMLElement) {
    refs.networkBadge.textContent = message;
  }
}

function toPrettyJson(payload) {
  try {
    return JSON.stringify(payload, null, 2);
  } catch (_error) {
    return String(payload ?? "");
  }
}

function openJsonModal(title, payload) {
  if (
    !(refs.jsonModal instanceof HTMLElement)
    || !(refs.jsonModalTitle instanceof HTMLElement)
    || !(refs.jsonModalBody instanceof HTMLElement)
  ) {
    return;
  }
  state.currentJsonTitle = String(title || "JSON View");
  state.currentJsonPayload = payload ?? null;
  refs.jsonModalTitle.textContent = state.currentJsonTitle;
  refs.jsonModalBody.textContent = toPrettyJson(payload);
  refs.jsonModal.classList.add("open");
  refs.jsonModal.setAttribute("aria-hidden", "false");
}

function closeJsonModal() {
  if (!(refs.jsonModal instanceof HTMLElement)) {
    return;
  }
  refs.jsonModal.classList.remove("open");
  refs.jsonModal.setAttribute("aria-hidden", "true");
}

function verifyPayloadIdentity(payload, networkKey = state.activeNetwork) {
  const expected = getNetworkConfig(networkKey);
  if (!expected) {
    throw createApiError("unknown_network");
  }
  if (payload?.api_version !== explorerApiConfig.apiVersion) {
    throw createApiError("unsupported_api_version");
  }
  if (payload?.network_id !== expected.networkId) {
    throw createApiError("network_mismatch");
  }
  if (payload?.network !== expected.network) {
    throw createApiError("network_mismatch");
  }
  if (payload?.genesis_hash !== expected.genesisHash) {
    throw createApiError("genesis_mismatch");
  }
}

async function apiRequest(path, { networkKey = state.activeNetwork, ttlMs = 0, force = false } = {}) {
  const network = getNetworkConfig(networkKey);
  if (!network?.apiBaseUrl) {
    throw createApiError("api_unavailable");
  }

  const cacheKey = `${networkKey}:${path}`;
  const cached = state.cache.get(cacheKey);
  if (!force && ttlMs > 0 && cached && Date.now() - cached.ts < ttlMs) {
    return cached.value;
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 12_000);

  try {
    const response = await fetch(`${network.apiBaseUrl}${path}`, {
      headers: { Accept: "application/json" },
      signal: controller.signal
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload?.success) {
      throw createApiError(payload?.error || `http_${response.status}`);
    }
    verifyPayloadIdentity(payload, networkKey);
    const value = { payload, data: payload.data || {} };
    if (ttlMs > 0) {
      state.cache.set(cacheKey, { ts: Date.now(), value });
    }
    return value;
  } catch (error) {
    if (error?.name === "AbortError") {
      throw createApiError("timeout");
    }
    if (error?.code) {
      throw error;
    }
    throw createApiError("request_failed");
  } finally {
    window.clearTimeout(timeout);
  }
}

function clearExplorerCaches() {
  state.dashboard = null;
  state.cache.clear();
  state.txInline.clear();
}

function updateUrlQuery({ replace = false } = {}) {
  const url = new URL(window.location.href);
  url.searchParams.set("network", state.activeNetwork);
  const historyState = { network: state.activeNetwork };
  if (replace) {
    window.history.replaceState(historyState, "", url);
  } else {
    window.history.pushState(historyState, "", url);
  }
}

function parseRoute() {
  const raw = String(window.location.hash || "").replace(/^#/, "").trim();
  if (!raw) {
    return { page: "home", ref: "" };
  }
  const [pageRaw, ...rest] = raw.split("/");
  const page = String(pageRaw || "home").toLowerCase();
  const ref = decodeURIComponent(rest.join("/") || "").trim();
  if (!["home", "block", "tx", "address", "mempool", "network", "supply"].includes(page)) {
    return { page: "home", ref: "" };
  }
  return { page, ref };
}

function setRoute(page, ref = "") {
  const route = ref ? `#${page}/${encodeURIComponent(ref)}` : `#${page}`;
  if (window.location.hash !== route) {
    window.location.hash = route;
    return;
  }
  void renderCurrentRoute({ force: true });
}

function setActiveTabs() {
  refs.tabs.forEach((tab) => {
    const active = tab.dataset.networkTab === state.activeNetwork;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
  });
}

function copyMini(value) {
  const text = String(value ?? "").trim();
  if (!text || text === "--") {
    return "";
  }
  return `<button class="copy-mini" type="button" data-action="copy" data-copy="${escAttr(text)}">Copy</button>`;
}

function linkWithCopy(action, ref, label, extraClass = "") {
  const text = String(ref ?? "").trim();
  if (!text || text === "--") {
    return esc(label ?? "--");
  }
  return `
    <span class="inline-actions">
      <span class="link ${extraClass}" data-action="${escAttr(action)}" data-ref="${escAttr(text)}">${esc(label)}</span>
      ${copyMini(text)}
    </span>
  `;
}

function linkOnly(action, ref, label, extraClass = "") {
  const text = String(ref ?? "").trim();
  if (!text || text === "--") {
    return esc(label ?? "--");
  }
  return `<span class="link ${extraClass}" data-action="${escAttr(action)}" data-ref="${escAttr(text)}">${esc(label)}</span>`;
}

function getOutputAddress(output) {
  return output?.address_hint || output?.address || "";
}

function getFirstAddressFromTransaction(transaction) {
  const outputs = Array.isArray(transaction?.outputs) ? transaction.outputs : [];
  return outputs.find((output) => getOutputAddress(output))?.address_hint || outputs.find((output) => getOutputAddress(output))?.address || "";
}

function cacheInlineTransaction(transaction, meta = {}) {
  const txid = String(transaction?.txid || "").trim();
  if (!txid) {
    return;
  }
  state.txInline.set(txid, {
    transaction,
    pending: false,
    block_hash: meta.blockHash || "",
    height: meta.height ?? null,
    received_at_unix: meta.timestamp || 0
  });
}

async function fetchBlockDetailByHeight(height) {
  const { data } = await apiRequest(`/block/height/${encodeURIComponent(String(height))}`, { ttlMs: 300_000 });
  return data;
}

function summarizeHomeTransaction(transaction, meta = {}) {
  cacheInlineTransaction(transaction, meta);
  return {
    txid: transaction.txid,
    timestamp: meta.timestamp || 0,
    height: meta.height || 0,
    isCoinbase: Boolean(transaction.is_coinbase),
    vsize: transaction.vsize_bytes || 0,
    outputCount: Array.isArray(transaction.outputs) ? transaction.outputs.length : 0,
    firstAddress: getFirstAddressFromTransaction(transaction),
    feeAtoms: transaction.fee_atoms ?? null,
    feeAtho: transaction.fee_atho || ""
  };
}

async function loadHomeBlocksPage(tipHeight, page, pageSize) {
  const totalItems = Math.max(0, Math.floor(toNum(tipHeight, 0)) + 1);
  const safePage = clampPage(page, Math.max(totalItems, 1), pageSize);
  const newestHeight = Math.max(0, Math.floor(toNum(tipHeight, 0)) - safePage * pageSize);
  const oldestHeight = Math.max(0, newestHeight - pageSize + 1);
  const heights = [];
  for (let height = newestHeight; height >= oldestHeight; height -= 1) {
    heights.push(height);
  }
  const items = await Promise.all(
    heights.map(async (height) => {
      const block = await fetchBlockDetailByHeight(height);
      const header = block.header || {};
      const transactions = Array.isArray(block.transactions) ? block.transactions : [];
      return {
        height: toNum(header.height, height),
        hash: block.hash || header.hash || "",
        timestamp: header.timestamp || 0,
        transaction_count: toNum(block.transaction_count, transactions.length),
        vsize_bytes: toNum(block.vsize_bytes, 0)
      };
    })
  );
  return { items, page: safePage, totalItems };
}

async function loadHomeTransactionsPage(tipHeight, page, pageSize, totalTransactions) {
  const totalItems = Math.max(0, Math.floor(toNum(totalTransactions, 0)));
  const safePage = clampPage(page, Math.max(totalItems, 1), pageSize);
  const skip = safePage * pageSize;
  if (totalItems === 0) {
    return { items: [], page: safePage, totalItems };
  }

  let seen = 0;
  const items = [];
  for (let height = Math.max(0, Math.floor(toNum(tipHeight, 0))); height >= 0 && items.length < pageSize; height -= 1) {
    const block = await fetchBlockDetailByHeight(height);
    const header = block.header || {};
    const transactions = Array.isArray(block.transactions) ? block.transactions : [];
    if (!transactions.length) {
      continue;
    }
    if (seen + transactions.length <= skip) {
      seen += transactions.length;
      continue;
    }
    const meta = {
      blockHash: block.hash || header.hash || "",
      height: toNum(header.height, height),
      timestamp: header.timestamp || 0
    };
    for (const transaction of transactions) {
      if (seen < skip) {
        seen += 1;
        continue;
      }
      items.push(summarizeHomeTransaction(transaction, meta));
      seen += 1;
      if (items.length >= pageSize) {
        break;
      }
    }
  }

  return { items, page: safePage, totalItems };
}

async function loadDashboard({ force = false } = {}) {
  const [statusResult, statsResult, mempoolResult, supplyResult, networkResult] = await Promise.all([
    apiRequest("/status", { force, ttlMs: 8_000 }),
    apiRequest("/network/stats", { force, ttlMs: 10_000 }),
    apiRequest("/mempool/summary", { force, ttlMs: 8_000 }),
    apiRequest("/supply", { force, ttlMs: 12_000 }),
    apiRequest("/network", { force, ttlMs: 15_000 })
  ]);
  const dashboard = {
    status: statusResult.data,
    stats: statsResult.data,
    mempool: mempoolResult.data,
    supply: supplyResult.data,
    network: networkResult.data
  };

  setCanonicalUptime(
    dashboard.stats?.node_uptime_seconds ??
      dashboard.stats?.network_uptime_seconds ??
      dashboard.network?.node_uptime_seconds ??
      dashboard.network?.uptime_seconds
  );
  state.dashboard = dashboard;
  return dashboard;
}

function updateHeaderFromDashboard(dashboard) {
  const network = getNetworkConfig();
  if (!dashboard) {
    setNetworkBadge(`${network.label.toUpperCase()} · Loading`);
    return;
  }

  const height = dashboard.stats?.height;
  setNetworkBadge(
    `${network.label.toUpperCase()} · Height ${formatNumber(height)}`
  );
}

function renderDetailGrid(items) {
  return `
    <div class="detail-grid">
      ${items
        .map(
          (item) => `
            <div class="detail-row">
              <div class="detail-key">${esc(item.label)}</div>
              <div class="detail-value ${esc(item.className || "")}">${item.valueHtml}</div>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function renderDetailSection(title, rows) {
  return `
    <section class="detail-section">
      <div class="detail-section-head">${esc(title)}</div>
      <div class="detail-list">
        ${rows
          .map(
            (row) => `
              <div class="detail-list-row">
                <div class="detail-list-label">${esc(row.label)}</div>
                <div class="detail-list-value ${esc(row.className || "")}">${row.valueHtml}</div>
              </div>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderStatsGrid(dashboard) {
  const stats = dashboard.stats;
  const mempool = dashboard.mempool;
  const cards = [
    {
      key: "Network Uptime",
      value: formatNetworkUptime(stats),
      valueAttr: 'data-network-uptime=""',
      meta: `Block time ${stats.average_block_time || "--"}`
    },
    {
      key: "Height",
      value: formatNumber(stats.height),
      meta: stats.latest_block_hash ? shortHash(stats.latest_block_hash, 14, 10) : "No tip hash",
      action: "go-block",
      ref: String(stats.height || "")
    },
    {
      key: "Latest Block",
      value: shortHash(stats.latest_block_hash, 14, 10),
      meta: formatTimestamp(dashboard.status?.tip_timestamp || 0),
      action: "go-block",
      ref: String(stats.height || "")
    },
    {
      key: "Estimated Hashrate",
      value: stats.estimated_hashrate || "--",
      meta: "Recent block estimate"
    },
    {
      key: "Active Peers",
      value: formatNumber(stats.active_peers),
      meta: `${formatNumber(stats.known_nodes)} known`
    },
    {
      key: "Mempool TXs",
      value: formatNumber(stats.mempool_transactions),
      meta: `Avg fee ${formatAthoValue(mempool.average_fee, mempool.average_fee_atoms ?? stats.average_fee_atoms)}`,
      action: "go-mempool",
      ref: ""
    },
    {
      key: "Circulating Supply",
      value: stats.circulating_supply || "--",
      meta: `Reward ${formatAthoValue(stats.current_block_reward, stats.current_block_reward_atoms)}`,
      action: "go-supply",
      ref: ""
    },
    {
      key: "Next Halving",
      value:
        stats.blocks_until_halving != null
          ? `${formatNumber(stats.blocks_until_halving)} blocks`
          : "Tail Emission",
      meta:
        stats.next_halving_height != null
          ? `Height ${formatNumber(stats.next_halving_height)}`
          : "Tail emission",
      action: "go-supply",
      ref: ""
    }
  ];

  return `
    <div class="metric-strip">
      ${cards
        .map(
          (card) => `
            <div class="metric-cell ${card.action ? "clickable" : ""}" ${card.action ? `data-action="${card.action}" data-ref="${escAttr(card.ref || "")}"` : ""}>
              <div class="metric-k">${esc(card.key)}</div>
              <div class="metric-v" ${card.valueAttr || ""}>${esc(card.value)}</div>
              <div class="metric-m">${esc(card.meta)}</div>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function clampPage(page, totalItems, pageSize) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  return Math.max(0, Math.min(page, totalPages - 1));
}

function renderPager(actionPrefix, page, totalItems, pageSize) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  return `
    <div class="panel-nav">
      <select class="panel-size-select" data-action="${actionPrefix}-size" aria-label="Rows per page">
        <option value="10" ${pageSize === 10 ? "selected" : ""}>10</option>
        <option value="25" ${pageSize === 25 ? "selected" : ""}>25</option>
        <option value="50" ${pageSize === 50 ? "selected" : ""}>50</option>
      </select>
      <button class="btn-ghost mini panel-nav-arrow" type="button" data-action="${actionPrefix}-prev" aria-label="Previous page" ${page <= 0 ? "disabled" : ""}>&lsaquo;</button>
      <div class="panel-nav-label">${page + 1} / ${totalPages}</div>
      <button class="btn-ghost mini panel-nav-arrow" type="button" data-action="${actionPrefix}-next" aria-label="Next page" ${page >= totalPages - 1 ? "disabled" : ""}>&rsaquo;</button>
    </div>
  `;
}

function renderHomeBlocksTable(blocks) {
  if (!blocks.length) {
    return `<div class="empty">No recent blocks available.</div>`;
  }
  return `
    <div class="x-scroll">
      <table class="table compact">
        <thead>
          <tr>
            <th>Height</th>
            <th>Block Hash</th>
            <th>Transactions</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          ${blocks
            .map((block) => {
              const timestamp = block.timestamp || 0;
              return `
                <tr data-action="go-block" data-ref="${escAttr(block.height)}">
                  <td>${linkOnly("go-block", block.height, `#${formatNumber(block.height)}`)}</td>
                  <td class="mono">${linkOnly("go-block", block.hash, shortHash(block.hash, 22, 14), "mono")}</td>
                  <td>${esc(formatNumber(block.transaction_count || 0))}</td>
                  <td>${esc(formatAge(timestamp))}</td>
                </tr>
              `;
            })
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderHomeTransactionTable(transactions) {
  if (!transactions.length) {
    return `<div class="empty">No recent transactions available.</div>`;
  }
  return `
    <div class="x-scroll">
      <table class="table compact">
        <thead>
          <tr>
            <th>Txid</th>
            <th>Block</th>
            <th>Fee</th>
            <th>Outputs</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          ${transactions
            .map(
              (tx) => `
                <tr data-action="go-tx" data-ref="${escAttr(tx.txid)}">
                  <td class="mono">${linkOnly("go-tx", tx.txid, clip(tx.txid, 30), "mono")}</td>
                  <td>${linkOnly("go-block", tx.height, `#${formatNumber(tx.height)}`)}</td>
                  <td>${esc(formatAthoValue(tx.feeAtho, tx.feeAtoms, { maxDecimals: ATHO_DECIMALS }))}</td>
                  <td>${esc(formatNumber(tx.outputCount || 0))}</td>
                  <td>${esc(formatAge(tx.timestamp))}</td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

async function renderHomePage(dashboard) {
  state.currentJsonTitle = "";
  state.currentJsonPayload = null;
  const stats = dashboard.stats;
  const tipHeight = Math.max(0, Math.floor(toNum(stats.height, 0)));
  const totalTransactions = Math.max(0, Math.floor(toNum(stats.total_transactions, 0)));
  const [blockPage, txPage] = await Promise.all([
    loadHomeBlocksPage(tipHeight, state.homeBlocksPage, state.homeBlocksPageSize),
    loadHomeTransactionsPage(tipHeight, state.homeTxPage, state.homeTxPageSize, totalTransactions)
  ]);
  state.homeBlocksPage = blockPage.page;
  state.homeTxPage = txPage.page;

  refs.pageRoot.innerHTML = `
    <section class="panel">
      <div class="panel-body">
        <div class="overview-shell">
          <div>
            <div class="overview-kicker">Testnet Explorer</div>
            <div class="overview-title">Atho Testnet Explorer</div>
            <p class="overview-lead">
              Live chain data with block, transaction, mempool, and supply detail.
            </p>
          </div>
          <div class="overview-side">
            <span class="status-chip">Uptime <span data-network-uptime>${esc(formatNetworkUptime(stats))}</span></span>
          </div>
        </div>
        ${renderStatsGrid(dashboard)}
      </div>
    </section>

    <section class="page-grid-home">
      <section class="panel">
        <div class="panel-head">
          <span class="section-title">Latest Blocks</span>
          ${renderPager("home-blocks", state.homeBlocksPage, blockPage.totalItems, state.homeBlocksPageSize)}
        </div>
        <div class="panel-body">
          ${renderHomeBlocksTable(blockPage.items)}
        </div>
      </section>

      <section class="panel">
        <div class="panel-head">
          <span class="section-title">Recent Transactions</span>
          ${renderPager("home-txs", state.homeTxPage, txPage.totalItems, state.homeTxPageSize)}
        </div>
        <div class="panel-body">
          ${renderHomeTransactionTable(txPage.items)}
        </div>
      </section>
    </section>
  `;
}

function renderDetailError(title, copy) {
  refs.pageRoot.innerHTML = `
    <section class="panel">
      <div class="panel-head">
        <button class="btn-ghost" type="button" data-action="go-home">Explorer</button>
        <span class="section-title">${esc(title)}</span>
      </div>
      <div class="panel-body">
        <div class="empty">${esc(copy)}</div>
      </div>
    </section>
  `;
}

function renderEmptyAddressPage(address) {
  const safeAddress = String(address || "").trim();
  refs.pageRoot.innerHTML = `
    <section class="panel">
      <div class="panel-head">
        <button class="btn-ghost" type="button" data-action="go-home">Explorer</button>
        <span class="section-title">Address</span>
      </div>
      <div class="panel-body">
        ${renderDetailGrid([
          { label: "Address", valueHtml: linkWithCopy("go-address", safeAddress, safeAddress, "mono"), className: "mono" },
          { label: "Balance", valueHtml: esc("0 ATHO") },
          { label: "Spendable", valueHtml: esc("0 ATHO") },
          { label: "Immature", valueHtml: esc("0 ATHO") },
          { label: "Pending Delta", valueHtml: esc("0 ATHO") },
          { label: "UTXO Count", valueHtml: esc("0") }
        ])}
      </div>
    </section>

    <section class="panel">
      <div class="panel-body">
        <div class="empty">No indexed chain activity was found for this address yet.</div>
      </div>
    </section>
  `;
}

function rerenderHomePage() {
  if (!state.dashboard) {
    return;
  }
  void withBusy("Loading explorer data...", () => renderHomePage(state.dashboard)).catch((error) => {
    const code = error?.code || error?.message || "request_failed";
    showWarn("Explorer unavailable. Confirm the selected Atho API is running.", "error");
    renderDetailError("Explorer Unavailable", `Current error: ${code}`);
  });
}

function renderMainnetPlaceholder() {
  setNetworkBadge("MAINNET · COMING SOON");
  setHeaderStatus("Coming Soon");
  showWarn("", "warn");
  refs.pageRoot.innerHTML = `
    <section class="panel">
      <div class="panel-head">
        <span class="section-title">Mainnet Explorer Coming Soon</span>
      </div>
      <div class="panel-body">
        <div class="empty">
          Mainnet data will appear here when mainnet is enabled.
        </div>
      </div>
    </section>
  `;
}

function blockActionButtons(block, currentHeight) {
  const height = Number(block.header?.height || 0);
  const prev = height > 0
    ? `<button class="btn-ghost mini" type="button" data-action="go-block" data-ref="${escAttr(height - 1)}">&lsaquo; Prev</button>`
    : "";
  const next = currentHeight != null && height < Number(currentHeight)
    ? `<button class="btn-ghost mini" type="button" data-action="go-block" data-ref="${escAttr(height + 1)}">Next &rsaquo;</button>`
    : "";
  return `${prev}${next}`;
}

async function renderBlockPage(ref) {
  const byHeight = /^\d+$/.test(String(ref || ""));
  const endpoint = byHeight
    ? `/block/height/${encodeURIComponent(String(ref))}`
    : `/block/hash/${encodeURIComponent(String(ref))}`;
  const result = await apiRequest(endpoint, { ttlMs: 20_000 });
  const block = result.data;
  const header = block.header || {};
  const txs = Array.isArray(block.transactions) ? block.transactions : [];
  txs.forEach((transaction) =>
    cacheInlineTransaction(transaction, {
      blockHash: block.hash || header.hash || "",
      height: header.height || null,
      timestamp: header.timestamp || 0
    })
  );
  const currentHeight = state.dashboard?.stats?.height ?? null;

  refs.pageRoot.innerHTML = `
    <section class="panel">
      <div class="panel-head">
        <button class="btn-ghost" type="button" data-action="go-home">Explorer</button>
        <span class="section-title">Block #${esc(formatNumber(header.height || 0))}</span>
        <span class="head-spacer"></span>
        <button class="btn-ghost mini" type="button" data-action="view-block-json">View Full JSON</button>
        ${blockActionButtons(block, currentHeight)}
      </div>
      <div class="panel-body">
        <div class="chips">
          <span class="chip">${esc(formatAge(header.timestamp || 0))}</span>
          <span class="chip">${esc(formatTimestamp(header.timestamp || 0))}</span>
          <span class="chip">${esc(formatNumber(block.transaction_count || txs.length))} transactions</span>
          <span class="chip">${esc(formatVBytes(block.vsize_bytes || 0))}</span>
          <span class="chip">${esc(formatBytes(block.size_bytes || 0))}</span>
        </div>
        ${renderDetailGrid([
          { label: "Block Hash", valueHtml: linkWithCopy("go-block", block.hash, block.hash, "mono"), className: "mono" },
          { label: "Previous Hash", valueHtml: linkWithCopy("go-block", header.previous_block_hash, header.previous_block_hash, "mono"), className: "mono" },
          { label: "Coinbase Txid", valueHtml: linkWithCopy("go-tx", block.coinbase_txid, block.coinbase_txid, "mono"), className: "mono" },
          { label: "Total Fees", valueHtml: esc(formatAthoValue(block.fees_total_atho, block.fees_total_atoms, { maxDecimals: ATHO_DECIMALS })) },
          { label: "Difficulty Target", valueHtml: esc(header.difficulty_target || "--"), className: "mono" },
          { label: "Nonce", valueHtml: esc(formatNumber(header.nonce || 0)) },
          { label: "Merkle Root", valueHtml: `<span class="inline-actions"><span class="mono">${esc(clip(header.merkle_root || "--", 62))}</span>${copyMini(header.merkle_root || "")}</span>`, className: "mono" }
        ])}
      </div>
    </section>

    <section class="panel">
      <div class="panel-head">
        <span class="section-title">Transactions</span>
      </div>
      <div class="panel-body">
        <div class="x-scroll">
          <table class="table mobile-stack">
            <thead>
              <tr>
                <th>Txid</th>
                <th>Type</th>
                <th>Primary Address</th>
                <th>Fee</th>
                <th>Outputs</th>
                <th>VSize</th>
                <th>PoW Bits</th>
              </tr>
            </thead>
            <tbody>
                ${
                  txs.length
                    ? txs
                      .map((tx) => {
                        const firstAddress = getFirstAddressFromTransaction(tx);
                        return `
                          <tr data-action="go-tx" data-ref="${escAttr(tx.txid)}">
                            <td class="mono" data-label="Txid">${linkOnly("go-tx", tx.txid, clip(tx.txid, 88), "mono")}</td>
                            <td data-label="Type">${esc(tx.is_coinbase ? "Coinbase" : "Standard")}</td>
                            <td class="mono" data-label="Primary Address">${firstAddress ? linkWithCopy("go-address", firstAddress, clip(firstAddress, 54), "mono") : "--"}</td>
                            <td data-label="Fee">${esc(formatAthoValue(tx.fee_atho, tx.fee_atoms, { maxDecimals: ATHO_DECIMALS }))}</td>
                            <td data-label="Outputs">${esc(formatNumber(Array.isArray(tx.outputs) ? tx.outputs.length : 0))}</td>
                            <td data-label="VSize">${esc(formatVBytes(tx.vsize_bytes || 0))}</td>
                            <td data-label="PoW Bits">${esc(formatNumber(tx.tx_pow_bits || 0))}</td>
                          </tr>
                        `;
                      })
                      .join("")
                  : '<tr><td colspan="7" class="muted">No decoded transactions were available for this block.</td></tr>'
              }
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;
  state.currentJsonTitle = `Block #${formatNumber(header.height || 0)} JSON`;
  state.currentJsonPayload = result.data;
}

async function loadTxRecord(txid) {
  try {
    const result = await apiRequest(`/tx/${encodeURIComponent(txid)}`, { ttlMs: 20_000 });
    return {
      ...result.data,
      fee_atoms: result.data.fee_atoms ?? result.data.transaction?.fee_atoms ?? null,
      fee_atho: result.data.fee_atho || result.data.transaction?.fee_atho || "",
      pending: false,
      rawJson: result.data
    };
  } catch (error) {
    const code = error?.code || error?.message;
    if (!isNotFoundCode(code)) {
      throw error;
    }
  }
  if (state.txInline.has(txid)) {
    return {
      ...state.txInline.get(txid),
      rawJson: state.txInline.get(txid)
    };
  }
  const result = await apiRequest(`/mempool/tx/${encodeURIComponent(txid)}`, { ttlMs: 10_000 });
  return {
    ...result.data,
    fee_atoms: result.data.fee_atoms ?? result.data.entry?.fee_atoms ?? null,
    fee_atho: result.data.fee_atho || result.data.entry?.fee_atho || "",
    pending: true,
    rawJson: result.data
  };
}

async function renderTxPage(ref) {
  const record = await loadTxRecord(ref);
  const tx = record.transaction || {};
  const inputs = Array.isArray(tx.inputs) ? tx.inputs : [];
  const outputs = Array.isArray(tx.outputs) ? tx.outputs : [];
  const lockTime = formatLockTimeValue(tx.lock_time);
  const txTimestamp =
    record.received_at_unix
    || record.received_at
    || record.timestamp
    || record.block_timestamp
    || 0;
  const txFee = formatAthoValue(record.fee_atho || record.fee, record.fee_atoms, { unit: true });
  const chips = [
    record.pending ? "Pending" : "Confirmed",
    formatVBytes(tx.vsize_bytes || 0),
    formatBytes(tx.size_bytes || 0),
    txTimestamp ? formatAge(txTimestamp) : "",
    record.fee_atoms != null ? txFee : "",
    tx.tx_pow_bits ? `${formatNumber(tx.tx_pow_bits || 0)} tx pow bits` : ""
  ].filter(Boolean);

  refs.pageRoot.innerHTML = `
    <section class="panel">
      <div class="panel-head">
        <button class="btn-ghost" type="button" data-action="go-home">Explorer</button>
        <span class="section-title">${record.pending ? "Pending Transaction" : "Transaction Detail"}</span>
        <span class="head-spacer"></span>
        <button class="btn-ghost mini" type="button" data-action="view-tx-json">View Full JSON</button>
        ${record.block_hash ? `<button class="btn-ghost mini" type="button" data-action="go-block" data-ref="${escAttr(record.block_hash)}">Open Block</button>` : ""}
      </div>
      <div class="panel-body">
        <div class="chips">
          ${chips.map((chip) => `<span class="chip">${esc(chip)}</span>`).join("")}
        </div>
        ${renderDetailGrid([
          { label: "Txid", valueHtml: linkWithCopy("go-tx", tx.txid, tx.txid, "mono"), className: "mono" },
          { label: "Wtxid", valueHtml: tx.wtxid ? `<span class="inline-actions"><span class="mono">${esc(tx.wtxid)}</span>${copyMini(tx.wtxid)}</span>` : "--", className: "mono" },
          { label: "Block Hash", valueHtml: record.block_hash ? linkWithCopy("go-block", record.block_hash, record.block_hash, "mono") : "--", className: "mono" },
          { label: "Height", valueHtml: record.height != null ? esc(formatNumber(record.height)) : "--" },
          { label: "Fee", valueHtml: esc(txFee) },
          { label: "Version", valueHtml: esc(formatNumber(tx.version || 0)) },
          { label: "Lock Time", valueHtml: renderValueWithNote(lockTime.primary, lockTime.note) },
          { label: "Inputs", valueHtml: esc(formatNumber(inputs.length)) },
          { label: "Outputs", valueHtml: esc(formatNumber(outputs.length)) }
        ])}
      </div>
    </section>

    <section class="page-grid page-grid-equal">
      <section class="panel">
        <div class="panel-head">
          <span class="section-title">Inputs</span>
        </div>
        <div class="panel-body">
          <div class="x-scroll">
            <table class="table mobile-stack">
              <thead>
                <tr>
                  <th>Previous Txid</th>
                  <th>Vout</th>
                  <th>Unlocking Script Bytes</th>
                </tr>
              </thead>
              <tbody>
                ${
                  inputs.length
                    ? inputs
                        .map(
                          (input) => `
                            <tr>
                              <td class="mono" data-label="Previous Txid">${linkWithCopy("go-tx", input.previous_txid, clip(input.previous_txid, 84), "mono")}</td>
                              <td data-label="Vout">${esc(formatNumber(input.output_index || 0))}</td>
                              <td data-label="Unlocking Script Bytes">${esc(formatNumber(input.unlocking_script_bytes || 0))}</td>
                            </tr>
                          `
                        )
                        .join("")
                    : '<tr><td colspan="3" class="muted">Coinbase transactions do not consume previous outputs.</td></tr>'
                }
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section class="panel">
        <div class="panel-head">
          <span class="section-title">Outputs</span>
        </div>
        <div class="panel-body">
          <div class="x-scroll">
            <table class="table mobile-stack">
              <thead>
                <tr>
                  <th>Index</th>
                  <th>Value</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                ${
                  outputs.length
                    ? outputs
                        .map((output) => {
                          const address = getOutputAddress(output);
                          return `
                            <tr>
                              <td data-label="Index">${esc(formatNumber(output.index || 0))}</td>
                              <td data-label="Value">${esc(formatAthoValue(output.value_atho, output.value_atoms))}</td>
                              <td class="mono" data-label="Address">${address ? linkWithCopy("go-address", address, clip(address, 64), "mono") : "--"}</td>
                            </tr>
                          `;
                        })
                        .join("")
                    : '<tr><td colspan="3" class="muted">No decoded outputs were returned for this transaction.</td></tr>'
                }
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </section>
  `;
  state.currentJsonTitle = `${record.pending ? "Pending Transaction" : "Transaction"} JSON`;
  state.currentJsonPayload = record.rawJson || record;
}

async function renderAddressPage(ref) {
  state.currentJsonTitle = "";
  state.currentJsonPayload = null;
  const address = String(ref || "").trim();
  let summaryResult;
  try {
    summaryResult = await apiRequest(`/address/${encodeURIComponent(address)}?limit=25&offset=0`, { ttlMs: 10_000 });
  } catch (error) {
    const code = error?.code || error?.message;
    if (isNotFoundCode(code)) {
      renderEmptyAddressPage(address);
      return;
    }
    throw error;
  }

  let utxosResult = null;
  try {
    utxosResult = await apiRequest(`/address/${encodeURIComponent(address)}/utxos?limit=50&offset=0`, { ttlMs: 10_000 });
  } catch (error) {
    const code = error?.code || error?.message;
    if (!isNotFoundCode(code)) {
      throw error;
    }
  }

  const summary = summaryResult.data;
  const utxos = Array.isArray(utxosResult?.data?.utxos) ? utxosResult.data.utxos : [];
  const transactions = Array.isArray(summary.transactions) ? summary.transactions : [];

  refs.pageRoot.innerHTML = `
    <section class="panel">
      <div class="panel-head">
        <button class="btn-ghost" type="button" data-action="go-home">Explorer</button>
        <span class="section-title">Address</span>
      </div>
      <div class="panel-body">
        ${renderDetailGrid([
          { label: "Address", valueHtml: linkWithCopy("go-address", summary.address || address, summary.address || address, "mono"), className: "mono" },
          { label: "Balance", valueHtml: esc(formatAthoValue(summary.balance_atho, summary.balance_atoms)) },
          { label: "Spendable", valueHtml: esc(formatAthoValue(summary.spendable_atho, summary.spendable_atoms)) },
          { label: "Immature", valueHtml: esc(formatAthoValue(summary.immature_atho, summary.immature_atoms)) },
          { label: "Pending Delta", valueHtml: esc(formatAthoValue(summary.pending_delta_atho, summary.pending_delta_atoms)) },
          { label: "UTXO Count", valueHtml: esc(formatNumber(summary.utxo_count || utxos.length)) }
        ])}
      </div>
    </section>

    <section class="panel">
      <div class="panel-head">
        <span class="section-title">Current UTXOs</span>
      </div>
      <div class="panel-body">
        <div class="x-scroll">
          <table class="table mobile-stack">
            <thead>
              <tr>
                <th>Txid</th>
                <th>Vout</th>
                <th>Value</th>
                <th>Confirmations</th>
                <th>Spendable</th>
              </tr>
            </thead>
            <tbody>
              ${
                utxos.length
                  ? utxos
                      .map(
                        (utxo) => `
                          <tr>
                            <td class="mono" data-label="Txid">${linkWithCopy("go-tx", utxo.txid, clip(utxo.txid, 84), "mono")}</td>
                            <td data-label="Vout">${esc(formatNumber(utxo.vout || 0))}</td>
                            <td data-label="Value">${esc(formatAthoValue(utxo.value_atho, utxo.value_atoms))}</td>
                            <td data-label="Confirmations">${esc(formatNumber(utxo.confirmations || 0))}</td>
                            <td data-label="Spendable">${esc(utxo.spendable ? "Yes" : "No")}</td>
                          </tr>
                        `
                      )
                      .join("")
                  : '<tr><td colspan="5" class="muted">No indexed UTXOs were returned for this address.</td></tr>'
              }
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-head">
        <span class="section-title">Transactions</span>
      </div>
      <div class="panel-body">
        <div class="x-scroll">
          <table class="table mobile-stack">
            <thead>
              <tr>
                <th>Txid</th>
                <th>Kind</th>
                <th>Height</th>
                <th>Net</th>
              </tr>
            </thead>
            <tbody>
              ${
                transactions.length
                  ? transactions
                      .map(
                        (tx) => `
                          <tr>
                            <td class="mono" data-label="Txid">${linkWithCopy("go-tx", tx.txid, clip(tx.txid, 84), "mono")}</td>
                            <td data-label="Kind">${esc(tx.kind || tx.source || "observed")}</td>
                            <td data-label="Height">${linkOnly("go-block", tx.height, `#${formatNumber(tx.height || 0)}`)}</td>
                            <td data-label="Net">${esc(formatAthoValue(tx.net_atho, tx.net_atoms))}</td>
                          </tr>
                        `
                      )
                      .join("")
                  : '<tr><td colspan="4" class="muted">No indexed transactions were returned for this address.</td></tr>'
              }
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;
}

async function renderMempoolPage() {
  state.currentJsonTitle = "";
  state.currentJsonPayload = null;
  const { data: summary } = await apiRequest("/mempool/summary", { ttlMs: 8_000 });
  const recent = Array.isArray(summary.recent_transactions) ? summary.recent_transactions : [];

  refs.pageRoot.innerHTML = `
    <section class="panel">
      <div class="panel-head">
        <button class="btn-ghost" type="button" data-action="go-home">Explorer</button>
        <span class="section-title">Mempool</span>
      </div>
      <div class="panel-body">
        <div class="stats">
          <div class="stat"><div class="k">Pending TXs</div><div class="v">${esc(formatNumber(summary.pending_transactions || 0))}</div><div class="m">${esc(summary.status || "Unknown")}</div></div>
          <div class="stat"><div class="k">Mempool Size</div><div class="v">${esc(formatBytes(summary.mempool_size_bytes || 0))}</div><div class="m">${esc(formatVBytes(summary.mempool_vsize_bytes || 0))}</div></div>
          <div class="stat"><div class="k">Average Fee</div><div class="v">${esc(formatAthoValue(summary.average_fee, summary.average_fee_atoms))}</div><div class="m">Recent average</div></div>
          <div class="stat"><div class="k">Est. Next Block TXs</div><div class="v">${esc(formatNumber(summary.estimated_next_block_tx_count || 0))}</div><div class="m">Policy estimate</div></div>
        </div>
        ${renderDetailGrid([
          { label: "Highest Fee", valueHtml: esc(formatAthoValue(summary.highest_fee?.fee, summary.highest_fee?.fee_atoms)) },
          { label: "Lowest Fee", valueHtml: esc(formatAthoValue(summary.lowest_fee?.fee, summary.lowest_fee?.fee_atoms)) }
        ])}
      </div>
    </section>

    <section class="panel">
      <div class="panel-head">
        <span class="section-title">Recent Pending Transactions</span>
      </div>
      <div class="panel-body">
        ${
          recent.length
            ? `
                <div class="x-scroll">
                  <table class="table mobile-stack">
                    <thead>
                      <tr>
                        <th>Txid</th>
                        <th>Fee</th>
                        <th>VSize</th>
                        <th>Received</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${recent
                        .map(
                          (tx) => `
                            <tr data-action="go-tx" data-ref="${escAttr(tx.txid)}">
                              <td class="mono" data-label="Txid">${linkOnly("go-tx", tx.txid, clip(tx.txid, 36), "mono")}</td>
                              <td data-label="Fee">${esc(formatAthoValue(tx.fee, tx.fee_atoms))}</td>
                              <td data-label="VSize">${esc(formatVBytes(tx.size_vbytes || 0))}</td>
                              <td data-label="Received">${esc(formatAge(tx.received_at || 0))}</td>
                            </tr>
                          `
                        )
                        .join("")}
                    </tbody>
                  </table>
                </div>
              `
            : '<div class="empty">The mempool is currently empty.</div>'
        }
      </div>
    </section>
  `;
}

async function renderSupplyPage() {
  state.currentJsonTitle = "";
  state.currentJsonPayload = null;
  const { data: supply } = await apiRequest("/supply", { ttlMs: 12_000 });

  refs.pageRoot.innerHTML = `
    <section class="panel">
      <div class="panel-head">
        <button class="btn-ghost" type="button" data-action="go-home">Explorer</button>
        <span class="section-title">Supply</span>
      </div>
      <div class="panel-body">
        <div class="stats">
          <div class="stat"><div class="k">Circulating Supply</div><div class="v">${esc(formatAthoValue(supply.circulating_supply, supply.circulating_supply_atoms))}</div><div class="m">Live network</div></div>
          <div class="stat"><div class="k">Total Mined</div><div class="v">${esc(formatAthoValue(supply.total_mined_supply, supply.total_mined_supply_atoms))}</div><div class="m">Emission schedule</div></div>
          <div class="stat"><div class="k">Current Reward</div><div class="v">${esc(formatAthoValue(supply.current_block_reward, supply.current_block_reward_atoms))}</div><div class="m">Current subsidy</div></div>
          <div class="stat"><div class="k">Next Halving</div><div class="v">${supply.blocks_until_halving != null ? esc(formatNumber(supply.blocks_until_halving)) : "Tail Era"}</div><div class="m">${supply.next_halving_height != null ? `Height ${formatNumber(supply.next_halving_height)}` : "Tail emission"}</div></div>
        </div>
        ${renderDetailGrid([
          { label: "Max Supply", valueHtml: esc(supply.max_supply_label || "No Fixed Cap") },
          { label: "Burned Supply", valueHtml: esc(formatAthoValue(supply.burned_supply, supply.burned_supply_atoms)) },
          { label: "Emission Epoch", valueHtml: esc(formatNumber(supply.emission_epoch || 0)) },
          { label: "Coinbase Maturity", valueHtml: `${esc(formatNumber(supply.coinbase_maturity_blocks || 0))} blocks` }
        ])}
      </div>
    </section>
  `;
}

async function renderNetworkPage() {
  state.currentJsonTitle = "";
  state.currentJsonPayload = null;
  const dashboard = state.dashboard || (await loadDashboard());
  const network = dashboard.network;
  const stats = dashboard.stats;
  const status = dashboard.status;

  refs.pageRoot.innerHTML = `
    <section class="panel">
      <div class="panel-head">
        <button class="btn-ghost" type="button" data-action="go-home">Explorer</button>
        <span class="section-title">Network</span>
      </div>
      <div class="panel-body">
        ${renderDetailGrid([
          { label: "Network", valueHtml: esc(network.network_name || network.network || "--") },
          { label: "Network ID", valueHtml: `<span class="mono">${esc(network.network_id || "--")}</span>`, className: "mono" },
          { label: "Genesis Hash", valueHtml: `<span class="mono">${esc(network.genesis_hash || "--")}</span>`, className: "mono" },
          { label: "Chain Uptime", valueHtml: esc(formatNetworkUptime(stats)) },
          { label: "API Version", valueHtml: esc(network.api_version || explorerApiConfig.apiVersion) },
          { label: "Node Version", valueHtml: esc(network.node_version || "--") },
          { label: "Sync Status", valueHtml: esc(status.chain_synced ? "Synced" : "Syncing") },
          { label: "Tip Height", valueHtml: esc(formatNumber(stats.height || 0)) },
          { label: "Latest Block Hash", valueHtml: linkWithCopy("go-block", stats.latest_block_hash, clip(stats.latest_block_hash, 62), "mono"), className: "mono" }
        ])}
      </div>
    </section>
  `;
}

function scheduleRefresh() {
  window.clearTimeout(state.refreshTimer);
  if (state.activeNetwork !== "testnet") {
    return;
  }
  const delay = state.route.page === "mempool" ? 10_000 : 15_000;
  state.refreshTimer = window.setTimeout(() => {
    if (document.hidden) {
      scheduleRefresh();
      return;
    }
    void refreshCurrentRoute({ force: true, busy: false });
  }, delay);
}

async function refreshCurrentRoute({ force = false, busy = true } = {}) {
  const route = parseRoute();
  state.route = route;
  closeJsonModal();
  setActiveTabs();

  if (state.activeNetwork === "mainnet") {
    renderMainnetPlaceholder();
    scheduleRefresh();
    return;
  }

  const runner = async () => {
    try {
      showWarn("", "warn");
      const dashboard = await loadDashboard({ force });
      updateHeaderFromDashboard(dashboard);

      switch (route.page) {
        case "home":
          await renderHomePage(dashboard);
          break;
        case "block":
          await renderBlockPage(route.ref);
          break;
        case "tx":
          await renderTxPage(route.ref);
          break;
        case "address":
          await renderAddressPage(route.ref);
          break;
        case "mempool":
          await renderMempoolPage();
          break;
        case "network":
          await renderNetworkPage();
          break;
        case "supply":
          await renderSupplyPage();
          break;
        default:
          await renderHomePage(dashboard);
          break;
      }
    } catch (error) {
      const code = error?.code || error?.message || "request_failed";
      if (code === "network_mismatch" || code === "genesis_mismatch" || code === "unsupported_api_version") {
        showWarn("Network mismatch detected. This API does not match the selected Atho network.", "error");
        setHeaderStatus("Mismatch");
        renderDetailError("Wrong API for Selected Network", "Selected API does not match this network.");
      } else if (isNotFoundCode(code) && route.page === "address" && route.ref) {
        showWarn("", "warn");
        renderEmptyAddressPage(route.ref);
      } else if (isNotFoundCode(code)) {
        showWarn("", "warn");
        renderDetailError("Not Found", "No matching block, transaction, address, or mempool record was found.");
      } else {
        showWarn("Explorer unavailable. Confirm the selected Atho API is running.", "error");
        setHeaderStatus("API Offline");
        renderDetailError("Explorer Unavailable", `Current error: ${code}`);
      }
    } finally {
      scheduleRefresh();
    }
  };

  if (busy) {
    await withBusy("Loading explorer data...", runner);
  } else {
    await runner();
  }
}

async function searchAndNavigate(rawQuery) {
  const query = String(rawQuery ?? "").trim();
  if (!query) {
    setRoute("home");
    return;
  }

  const kind = classifyQuery(query);
  if (kind.kind === "unknown" || kind.kind === "empty") {
    showWarn("Enter a block height, block hash, txid, or Atho address.", "error");
    renderDetailError("Unsupported Search", "The search input is not recognized.");
    return;
  }

  await withBusy("Searching explorer...", async () => {
    try {
      if (kind.kind === "height") {
        setRoute("block", kind.value);
        return;
      }
      if (kind.kind === "address") {
        setRoute("address", kind.value);
        return;
      }
      if (kind.kind === "hash96") {
        try {
          await loadTxRecord(kind.value);
          setRoute("tx", kind.value);
          return;
        } catch (error) {
          const code = error?.code || error?.message;
          if (!isNotFoundCode(code)) {
            throw error;
          }
        }
        setRoute("block", kind.value);
      }
    } catch (error) {
      const code = error?.code || error?.message || "request_failed";
      showWarn("", "warn");
      renderDetailError("No Explorer Match", `Nothing matched "${query}". Error: ${code}`);
    }
  });
}

function copyText(text) {
  const raw = String(text ?? "");
  if (!raw) {
    return Promise.resolve();
  }
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(raw);
  }
  const textarea = document.createElement("textarea");
  textarea.value = raw;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  try {
    document.execCommand("copy");
  } finally {
    document.body.removeChild(textarea);
  }
  return Promise.resolve();
}

function handleActionClick(event) {
  const target = event.target.closest("[data-action]");
  if (!(target instanceof HTMLElement)) {
    return;
  }
  const action = target.dataset.action || "";
  const ref = target.dataset.ref || "";

  if (action === "copy") {
    event.preventDefault();
    void copyText(target.dataset.copy || "");
    return;
  }

  if (action === "copy-json-modal") {
    event.preventDefault();
    void copyText(toPrettyJson(state.currentJsonPayload));
    return;
  }

  if (action === "close-json-modal") {
    event.preventDefault();
    closeJsonModal();
    return;
  }

  if (action === "submit-search") {
    event.preventDefault();
    void searchAndNavigate(refs.queryInput?.value || "");
    return;
  }

  if (action === "refresh-current") {
    event.preventDefault();
    clearExplorerCaches();
    void refreshCurrentRoute({ force: true, busy: true });
    return;
  }

  if (action === "go-home") {
    event.preventDefault();
    setRoute("home");
    return;
  }

  if (action === "view-block-json") {
    event.preventDefault();
    openJsonModal(state.currentJsonTitle || "Block JSON", state.currentJsonPayload);
    return;
  }

  if (action === "view-tx-json") {
    event.preventDefault();
    openJsonModal(state.currentJsonTitle || "Transaction JSON", state.currentJsonPayload);
    return;
  }

  if (action === "go-block") {
    event.preventDefault();
    if (ref && ref !== "open") {
      setRoute("block", ref);
    }
    return;
  }

  if (action === "go-tx") {
    event.preventDefault();
    if (ref) {
      setRoute("tx", ref);
    }
    return;
  }

  if (action === "go-address") {
    event.preventDefault();
    if (ref) {
      setRoute("address", ref);
    }
    return;
  }

  if (action === "go-mempool") {
    event.preventDefault();
    setRoute("mempool");
    return;
  }

  if (action === "home-blocks-prev") {
    event.preventDefault();
    state.homeBlocksPage = Math.max(0, state.homeBlocksPage - 1);
    rerenderHomePage();
    return;
  }

  if (action === "home-blocks-next") {
    event.preventDefault();
    const totalBlocks = Math.max(0, Math.floor(toNum(state.dashboard?.stats?.height, 0)) + 1);
    const maxPage = Math.max(0, Math.ceil(totalBlocks / state.homeBlocksPageSize) - 1);
    state.homeBlocksPage = Math.min(maxPage, state.homeBlocksPage + 1);
    rerenderHomePage();
    return;
  }

  if (action === "home-txs-prev") {
    event.preventDefault();
    state.homeTxPage = Math.max(0, state.homeTxPage - 1);
    rerenderHomePage();
    return;
  }

  if (action === "home-txs-next") {
    event.preventDefault();
    const totalTransactions = Math.max(0, Math.floor(toNum(state.dashboard?.stats?.total_transactions, 0)));
    const maxPage = Math.max(0, Math.ceil(totalTransactions / state.homeTxPageSize) - 1);
    state.homeTxPage = Math.min(maxPage, state.homeTxPage + 1);
    rerenderHomePage();
    return;
  }

  if (action === "go-network") {
    event.preventDefault();
    setRoute("network");
    return;
  }

  if (action === "go-supply") {
    event.preventDefault();
    setRoute("supply");
  }
}

function handleActionChange(event) {
  const target = event.target.closest("[data-action]");
  if (!(target instanceof HTMLElement)) {
    return;
  }
  const action = target.dataset.action || "";
  const value = Math.floor(toNum(target.value, 0));

  if (action === "home-blocks-size" && [10, 25, 50].includes(value)) {
    state.homeBlocksPageSize = value;
    state.homeBlocksPage = 0;
    rerenderHomePage();
    return;
  }

  if (action === "home-txs-size" && [10, 25, 50].includes(value)) {
    state.homeTxPageSize = value;
    state.homeTxPage = 0;
    rerenderHomePage();
  }
}

function handleKeySearch(event) {
  if (event.key !== "Enter") {
    return;
  }
  event.preventDefault();
  void searchAndNavigate(refs.queryInput?.value || "");
}

function handleNetworkTabClick(event) {
  const target = event.target.closest("[data-network-tab]");
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const networkKey = target.dataset.networkTab;
  if (!networkKey || networkKey === state.activeNetwork) {
    return;
  }

  state.activeNetwork = networkKey === "mainnet" ? "mainnet" : "testnet";
  clearExplorerCaches();
  updateUrlQuery();
  void refreshCurrentRoute({ force: true, busy: true });
}

function initHistory() {
  window.addEventListener("hashchange", () => {
    void refreshCurrentRoute({ force: false, busy: true });
  });
  window.addEventListener("popstate", () => {
    const url = new URL(window.location.href);
    state.activeNetwork = url.searchParams.get("network") === "mainnet" ? "mainnet" : "testnet";
    setActiveTabs();
    void refreshCurrentRoute({ force: false, busy: true });
  });
}

function init() {
  const url = new URL(window.location.href);
  state.activeNetwork = url.searchParams.get("network") === "mainnet" ? "mainnet" : defaultExplorerNetwork;
  setActiveTabs();
  updateUrlQuery({ replace: true });

  document.addEventListener("click", handleActionClick);
  document.addEventListener("change", handleActionChange);
  refs.queryInput?.addEventListener("keydown", handleKeySearch);
  refs.jsonModal?.addEventListener("click", (event) => {
    if (event.target === refs.jsonModal) {
      closeJsonModal();
    }
  });
  refs.tabs.forEach((tab) => tab.addEventListener("click", handleNetworkTabClick));
  initHistory();
  startUptimeTicker();

  refs.pageRoot.innerHTML = `
    <section class="panel">
      <div class="panel-head">
        <span class="section-title">Loading Explorer</span>
      </div>
      <div class="panel-body">
        <div class="empty">Loading explorer data...</div>
      </div>
    </section>
  `;

  void refreshCurrentRoute({ force: true, busy: true });
}

init();
