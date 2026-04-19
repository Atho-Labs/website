export const featureCards = [
  {
    title: "Payments-Only Core",
    body: "Atho keeps the product surface narrow: proof-of-work payments with public settlement and privacy when it is actually needed.",
    tag: "Mission"
  },
  {
    title: "Falcon-512 Security",
    body: "Transaction signatures are post-quantum by default, giving the chain a long-horizon security posture instead of a classical-only fallback.",
    tag: "Security"
  },
  {
    title: "Public + Private Payments",
    body: "Standard UTXO transfers and Platinum Shield private flows live on the same chain, so users do not have to switch networks to switch privacy modes.",
    tag: "Payments"
  },
  {
    title: "Deterministic Emissions",
    body: "Issuance starts at 100 ATHO, decays once per day across 720 blocks, and stays easy to audit from docs to runtime constants.",
    tag: "Policy"
  },
  {
    title: "Finite Max Supply",
    body: "The active model points to a single one-billion ATHO cap, replacing older mixed messaging with a cleaner long-run monetary story.",
    tag: "Supply"
  },
  {
    title: "Wallet Recovery Discipline",
    body: "Wallet custody keeps payment addresses, private receive material, encryption, and deterministic recovery in one readable model.",
    tag: "Wallet"
  }
];

export const roadmapItems = [
  {
    phase: "Phase 1 - Reliability",
    state: "active",
    summary: "Consensus safety hardening, startup validation, and clearer runtime health checks."
  },
  {
    phase: "Phase 2 - Network Resilience",
    state: "next",
    summary: "Faster tip switching, stronger peer persistence, and restart-safe sync behavior."
  },
  {
    phase: "Phase 3 - Operator Surface",
    state: "planning",
    summary: "Deeper docs hub, explorer enhancements, and release verification tooling."
  },
  {
    phase: "Phase 4 - Ecosystem Expansion",
    state: "planning",
    summary: "Developer integrations, broader deployment options, and public infrastructure scale-up."
  }
];

export const metricCards = [
  {
    label: "Block Time",
    value: 120,
    display: "120 sec",
    foot: "Steady two-minute block cadence"
  },
  {
    label: "Confirmations",
    value: 6,
    display: "6",
    foot: "Standard and private confirmation target"
  },
  {
    label: "Starting Reward",
    value: 100,
    display: "100 ATHO",
    foot: "Initial block subsidy at genesis"
  },
  {
    label: "Daily Decay",
    value: 720,
    display: "720 blocks",
    foot: "Reward steps down once per day"
  },
  {
    label: "Max Supply",
    value: 1000000000,
    display: "1B ATHO",
    foot: "Single hard-cap supply model"
  }
];
