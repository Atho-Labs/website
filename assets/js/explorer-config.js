const API_VERSION = "v1";
const TESTNET_VPS_API_BASE_URL = "https://testnet-node1.atho.io/api/v1";

function readRuntimeConfig() {
  if (typeof window !== "undefined" && window.ATHO_EXPLORER_CONFIG) {
    return window.ATHO_EXPLORER_CONFIG;
  }
  return {};
}

const runtimeConfig = readRuntimeConfig();

function readConfigValue(key, fallback) {
  const value = runtimeConfig[key];
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  return fallback;
}

export const explorerRefresh = Object.freeze({
  networkStatsMs: 15_000,
  mempoolMs: 10_000,
  latestBlocksMs: 15_000,
  searchDebounceMs: 250
});

export const explorerApiConfig = Object.freeze({
  apiVersion: API_VERSION,
  testnetApiBaseUrl: readConfigValue(
    "testnetApiBaseUrl",
    TESTNET_VPS_API_BASE_URL
  ),
  mainnetApiBaseUrl: readConfigValue("mainnetApiBaseUrl", "")
});

export const explorerNetworks = Object.freeze({
  testnet: Object.freeze({
    key: "testnet",
    label: "Testnet",
    network: "testnet",
    networkId: "atho-testnet",
    genesisHash:
      "00002eb00a5fc1d177b03a8b77348c5c1faef451fa9367a337863df7af37f61734ed202e321353fd80a319843bcfef6b",
    apiBaseUrl: explorerApiConfig.testnetApiBaseUrl,
    enabled: true,
    statusLabel: "Testnet Online"
  }),
  mainnet: Object.freeze({
    key: "mainnet",
    label: "Mainnet",
    network: "mainnet",
    networkId: "atho-mainnet",
    genesisHash:
      "0000f1fc7e66238f4068201c3c25b80fa9e2ce8a6df744ee4fd1e0984c7fa9ebd546028acd3d81d0c4a7e8c0d17a9b1e",
    apiBaseUrl: explorerApiConfig.mainnetApiBaseUrl,
    enabled: false,
    statusLabel: "Mainnet API Not Configured"
  })
});

export const defaultExplorerNetwork = "testnet";
