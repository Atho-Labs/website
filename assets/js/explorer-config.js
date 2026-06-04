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
      "00000e524958487f70cfe350a65093d40e70bd15e2611451995c59c0d5b126e1aea7f51c4b099ea2393e9cfff45f9eb9",
    apiBaseUrl: explorerApiConfig.testnetApiBaseUrl,
    enabled: true,
    comingSoon: false,
    statusLabel: "Testnet Online"
  }),
  mainnet: Object.freeze({
    key: "mainnet",
    label: "Mainnet",
    network: "mainnet",
    networkId: "atho-mainnet",
    genesisHash:
      "000049993ab4e8874c71e35c659756c3f13d17f5e688a1271800704009017a8d0f69d9b5d8da7d7e398f720b037fd2c8",
    apiBaseUrl: explorerApiConfig.mainnetApiBaseUrl,
    enabled: false,
    comingSoon: true,
    statusLabel: "Mainnet Coming Soon"
  })
});

export const defaultExplorerNetwork = "testnet";
