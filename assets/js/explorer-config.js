const API_VERSION = "v1";

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
  testnetApiBaseUrl: readConfigValue("testnetApiBaseUrl", "https://testnet-node1.atho.io/api/v1"),
  mainnetApiBaseUrl: readConfigValue("mainnetApiBaseUrl", "")
});

export const explorerNetworks = Object.freeze({
  testnet: Object.freeze({
    key: "testnet",
    label: "Testnet",
    network: "testnet",
    networkId: "atho-testnet",
    genesisHash: readConfigValue("testnetGenesisHash", "000025033a2ff4ad6438a6be276303ec5bcbe763aa416bae6469b5982db9e1c7636cd676e9ccf630a3f5508c9970f02f"),
    apiBaseUrl: explorerApiConfig.testnetApiBaseUrl,
    enabled: Boolean(explorerApiConfig.testnetApiBaseUrl),
    statusLabel: "Live Testnet"
  }),
  mainnet: Object.freeze({
    key: "mainnet",
    label: "Mainnet",
    network: "mainnet",
    networkId: "atho-mainnet",
    genesisHash: readConfigValue("mainnetGenesisHash", ""),
    apiBaseUrl: explorerApiConfig.mainnetApiBaseUrl,
    enabled: false,
    statusLabel: "Mainnet API Not Configured"
  })
});

export const defaultExplorerNetwork = "testnet";
