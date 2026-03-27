export const featureCards = [
  {
    title: "Quantum-First Design",
    body: "Atho is designed for a future where quantum attacks are real, not as a last-minute patch later.",
    tag: "Mission"
  },
  {
    title: "Falcon-512 Signatures",
    body: "Transactions use post-quantum signatures designed to stay secure beyond classical cryptography.",
    tag: "Signatures"
  },
  {
    title: "SHA3-384 Core Hashing",
    body: "Core IDs and signing payloads use SHA3-384 for a stronger long-term security margin.",
    tag: "Hashing"
  },
  {
    title: "BPoW + Wallet Staking",
    body: "Bonded Proof of Work secures block production while wallet staking remains a separate deterministic reward role.",
    tag: "Consensus"
  },
  {
    title: "UTXO by Design",
    body: "Atho keeps state simple and verifiable with a UTXO model that reduces complexity and attack surface.",
    tag: "Ledger"
  },
  {
    title: "Tighten-Only Upgrades",
    body: "Protocol changes are meant to increase rigor over time, not quietly loosen core safety rules.",
    tag: "Policy"
  },
  {
    title: "Binary Integrity Pinning",
    body: "Critical cryptographic binaries are verified by digest before use to reduce supply-chain risk.",
    tag: "Integrity"
  },
  {
    title: "Base56 Addresses",
    body: "Ambiguous characters are removed to reduce human mistakes when reading or sharing addresses.",
    tag: "UX Safety"
  },
  {
    title: "Dual-Layer Key Protection",
    body: "AES-256-GCM plus Kyber-based key wrapping protects wallet secrets with independent security layers.",
    tag: "Wallet Security"
  },
  {
    title: "Mnemonic Phrase Recovery",
    body: "Deterministic mnemonic recovery keeps wallet portability practical while preserving local custody boundaries.",
    tag: "Recovery"
  },
  {
    title: "SegWit Transaction Layout",
    body: "SegWit-style structure reduces malleability risk and keeps transaction handling cleaner for signing and relay paths.",
    tag: "SegWit"
  },
  {
    title: "Deterministic Fee Routing",
    body: "Fee uplift, pool routing, burn, and miner/stake splits are consensus-accounted so reward flows can be independently audited.",
    tag: "Tokenomics"
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
    label: "Target Block Time",
    value: 120,
    suffix: " sec",
    foot: "Fast, steady chain cadence"
  },
  {
    label: "Peak Policy Throughput",
    value: 40.6,
    suffix: " TPS",
    foot: "High-headroom throughput under the current policy model"
  },
  {
    label: "Bootstrap Budget",
    value: 50000,
    suffix: " ATHO",
    foot: "Consensus bootstrap allocation at block 1"
  },
  {
    label: "Bond Requirement",
    value: 25,
    suffix: " ATHO",
    foot: "Required for miner eligibility under BPoW"
  },
  {
    label: "Base Emission Supply",
    value: 30000000,
    suffix: " ATHO",
    foot: "Pre-tail supply path before tail emission"
  },
  {
    label: "Transaction Confirmations",
    value: 10,
    suffix: "",
    foot: "Recommended finality target"
  }
];
