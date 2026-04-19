export const featureCards = [
  {
    title: "Consensus Baseline Snapshot",
    body: "Two-minute blocks, six confirmations, 150-block maturity, and payment-first UTXO rules define the live network.",
    tag: "Protocol",
    href: "./docs.html#policy-baseline",
    cta: "Review Baseline"
  },
  {
    title: "Platinum Shield Flow",
    body: "Public to private, private to private, and private to public transfers stay on one chain with explicit bundle and nullifier checks.",
    tag: "Privacy",
    href: "./platinum-shield.html#flow-engine",
    cta: "Inspect Flow"
  },
  {
    title: "Wallet Recovery Model",
    body: "Seed, path, network, and private bundle identity rebuild the same custody tree without splitting public and private state.",
    tag: "Wallet",
    href: "./wallet-hierarchy.html#recovery",
    cta: "See Recovery"
  },
  {
    title: "Falcon Signing Layer",
    body: "Falcon-512 replaces elliptic-curve assumptions while keeping transaction handling practical through SegWit-style sizing.",
    tag: "Falcon",
    href: "./falcon-512.html",
    cta: "Read Falcon"
  },
  {
    title: "Kyber Routing Path",
    body: "Kyber-backed recipient handling and lockbox usage document how private receive identity is carried safely.",
    tag: "Kyber",
    href: "./kyber.html",
    cta: "Read Kyber"
  },
  {
    title: "Operator Runbook",
    body: "The join guide documents environment setup, node verification, private test checks, and the current troubleshooting path.",
    tag: "Operations",
    href: "./join.html",
    cta: "Open Runbook"
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
    label: "Block Cadence",
    value: 120,
    display: "120 sec",
    foot: "Shared settlement interval"
  },
  {
    label: "Confirmation Rule",
    value: 6,
    display: "6 blocks",
    foot: "Public and private target"
  },
  {
    label: "Coinbase Maturity",
    value: 150,
    display: "150 blocks",
    foot: "Spend delay for miner outputs"
  },
  {
    label: "Throughput",
    value: 60,
    display: "60 TPS",
    foot: "Estimated network throughput"
  },
  {
    label: "Reward Step",
    value: 720,
    display: "720 blocks",
    foot: "Daily emission interval"
  },
  {
    label: "Genesis Reward",
    value: 100,
    display: "100 ATHO",
    foot: "Opening block subsidy"
  },
  {
    label: "Supply Cap",
    value: 1000000000,
    display: "1B ATHO",
    foot: "Single hard cap"
  },
  {
    label: "Max Supply Horizon",
    value: 300,
    display: "300 years",
    foot: "Approximate time to full issuance"
  }
];
