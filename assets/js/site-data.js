export const siteContent = {
  heroSignals: [
    "simplicity first",
    "security before novelty",
    "payment + store of value",
    "75 second settlement"
  ],
  protocolHighlights: [
    {
      number: "01",
      title: "Post-Quantum Security",
      copy: "Falcon-512 and SHA3-384 message binding are built around long-lived cryptographic assumptions."
    },
    {
      number: "02",
      title: "Public UTXO Settlement",
      copy: "Atho keeps payments on a public UTXO ledger so spendability, ownership, and chain truth stay readable."
    },
    {
      number: "03",
      title: "Deterministic Validation",
      copy: "Consensus, storage, and runtime boundaries stay explicit so independent nodes can verify the same rules."
    }
  ],
  runtimePills: [
    {
      label: "Mempool prevalidation",
      value: "Validate once, reuse safely",
      copy: "Transactions are checked on admission and reused only when the exact bytes and exact validation context still match."
    },
    {
      label: "Batched chainstate I/O",
      value: "Less churn on the hot path",
      copy: "UTXO reads and writes are staged in batches so the database does not thrash on per-transaction work."
    },
    {
      label: "Parallel Falcon checks",
      value: "Multi-core signature work",
      copy: "Independent Falcon-512 verification can fan out across cores without relaxing message binding or consensus safety."
    },
    {
      label: "Compact network sync",
      value: "Relay less, move faster",
      copy: "Compact relay, headers-first sync, and low-copy parsing reduce wasted bandwidth and repeated serialization."
    }
  ],
  networkConstants: [
    {
      name: "Mainnet",
      detail: "atho-mainnet",
      value: "<span class=\"stack-line\">P2P 56000</span><span class=\"stack-line\">RPC 9010</span>",
      copy: "CLI tag: mainnet"
    },
    {
      name: "Testnet",
      detail: "atho-testnet",
      value: "<span class=\"stack-line\">P2P 9100</span><span class=\"stack-line\">RPC 9110</span>",
      copy: "CLI tag: testnet"
    },
    {
      name: "Regnet",
      detail: "atho-regnet",
      value: "<span class=\"stack-line\">P2P 9200</span><span class=\"stack-line\">RPC 9210</span>",
      copy: "CLI tag: regnet"
    }
  ],
  stats: [
    {
      key: "maxSupply",
      label: "Max Supply",
      value: "168M ATHO",
      detail: "Fixed maximum supply for the network.",
      badge: "Published"
    },
    {
      key: "baseReward",
      label: "Base Reward",
      value: "50 ATHO",
      detail: "Current base block reward.",
      badge: "Published"
    },
    {
      key: "throughput",
      label: "Throughput Target",
      value: "65-80 TPS",
      detail: "Target range for small 1-in/1-out payments on the current block model.",
      badge: "Published"
    },
    {
      key: "settlement",
      label: "Settlement Time",
      value: "75 SEC",
      detail: "Current block time target stated in about-atho.md.",
      badge: "Published"
    },
    {
      key: "blockCap",
      label: "Block Capacity",
      value: "3,000,000 VB",
      detail: "Current block cap in the documented consensus shape.",
      badge: "Published"
    },
    {
      key: "rawCap",
      label: "Raw Cap",
      value: "~12,000,000 B",
      detail: "Approximate raw byte ceiling for the current block shape.",
      badge: "Published"
    }
  ],
  coreFeatures: [
    {
      icon: "shield",
      title: "Falcon-512 Signatures",
      copy: "Post-quantum signing with explicit domain separation across transaction and wallet contexts."
    },
    {
      icon: "hash",
      title: "SHA3 Hashing",
      copy: "SHA3-256 and SHA3-384 are used for commitments, checksums, and signing prehashes."
    },
    {
      icon: "grid",
      title: "Public UTXO Model",
      copy: "Outputs remain the authoritative accounting layer for spendability, maturity, and balance."
    },
    {
      icon: "layers",
      title: "SigWit-Style Sizing",
      copy: "Witness-aware sizing keeps transaction weight and block usage explicit."
    },
    {
      icon: "pickaxe",
      title: "Proof-of-Work Mining",
      copy: "Blocks commit to proof-of-work metadata and stay independently verifiable on every node."
    },
    {
      icon: "bolt",
      title: "Runtime Efficiency",
      copy: "Mempool prevalidation, UTXO batching, compact relay, low-copy parsing, and Falcon parallelism keep throughput high without softening consensus."
    }
  ],
  ecosystemGroups: [
    {
      title: "Core Stack",
      items: [
        {
          icon: "server",
          title: "athod Full Node",
          status: "Live",
          copy: "Owns runtime behavior, mempool admission, chainstate updates, and the canonical validation path.",
          actionLabel: "See network",
          actionHref: "#network"
        },
        {
          icon: "pickaxe",
          title: "atho-mine",
          status: "Live",
          copy: "Dedicated miner client that requests valid templates from the node instead of replacing consensus logic.",
          actionLabel: "See technology",
          actionHref: "#technology"
        },
        {
          icon: "monitor",
          title: "atho-qt",
          status: "Live",
          copy: "Thin desktop client built to render backend truth rather than invent local chainstate.",
          actionLabel: "See developers",
          actionHref: "#developers"
        }
      ]
    },
    {
      title: "Public Access",
      items: [
        {
          icon: "globe",
          title: "Block Explorer",
          status: "Pending",
          copy: "Public explorer surface is being cleaned up for the next test batch before mainnet.",
          actionLabel: "View pending status",
          actionHref: "./roadmap.html"
        },
        {
          icon: "spark",
          title: "Testnet Faucet",
          status: "Pending",
          copy: "Testnet distribution flow will open through the next coordinated community batch.",
          actionLabel: "Join the batch",
          actionHref: "./join.html"
        },
        {
          icon: "terminal",
          title: "Public Status Page",
          status: "Pending",
          copy: "External status and rollout checkpoints are being prepared for the public network phase.",
          actionLabel: "Read status",
          actionHref: "./roadmap.html"
        }
      ]
    },
    {
      title: "Developer Access",
      items: [
        {
          icon: "code",
          title: "GitHub",
          status: "Live",
          copy: "Public repository for the current Atho website and project surface.",
          actionLabel: "Open GitHub",
          actionHref: "https://github.com/Atho-Labs/",
          external: true
        },
        {
          icon: "database",
          title: "Public Docs",
          status: "Pending",
          copy: "The public docs hub is being tightened before the next test batch and broader release.",
          actionLabel: "Read docs status",
          actionHref: "./docs.html"
        },
        {
          icon: "package",
          title: "Mining Guide",
          status: "Pending",
          copy: "Operator-facing mining setup notes are being refined for a cleaner public onboarding path.",
          actionLabel: "See onboarding",
          actionHref: "./join.html"
        }
      ]
    }
  ],
  economics: [
    {
      label: "Max Supply",
      value: "168 million ATHO",
      badge: "Published",
      note: "Supply is designed to stay public, finite, and easy to audit."
    },
    {
      label: "Base Block Reward",
      value: "50 ATHO",
      badge: "Published",
      note: "Base issuance begins with a clear subsidy instead of hidden monetary rules."
    },
    {
      label: "Issuance Model",
      value: "Subsidy + halving logic",
      badge: "Published",
      note: "about-atho.md confirms subsidy and halving logic live in the consensus core."
    },
    {
      label: "Proof-of-Work Issuance",
      value: "Public and auditable",
      badge: "Published",
      note: "New supply enters through proof-of-work blocks that every node can verify."
    },
    {
      label: "Fee Accounting",
      value: "Block-level totals",
      badge: "Published",
      note: "Blocks carry explicit fee accounting totals instead of hiding settlement math."
    },
    {
      label: "Maturity Rules",
      value: "Consensus-enforced",
      badge: "Published",
      note: "Spendability, reward handling, and maturity checks stay visible in validation."
    }
  ],
  developerPoints: [
    "Clear crate ownership across atho-core, atho-storage, atho-node, atho-wallet, atho-p2p, atho-rpc, atho-qt, and atho-installer.",
    "Mempool prevalidation, validation batching, compact relay, and headers-first sync keep the network fast without relaxing checks.",
    "The GUI stays thin so backend truth remains canonical during startup, sync, restart, and recovery."
  ],
  developerCommands: [
    {
      kind: "comment",
      text: "public GitHub surface"
    },
    {
      kind: "comment",
      text: "https://github.com/Atho-Labs/"
    },
    {
      kind: "command",
      prompt: "$",
      text: "athod"
    },
    {
      kind: "command",
      prompt: "$",
      text: "atho-mine"
    },
    {
      kind: "command",
      prompt: "$",
      text: "atho-qt"
    }
  ],
  statusCards: [
    {
      label: "Now",
      title: "Cleaner public posture",
      copy: "Atho is being repositioned as a payment-first protocol with explicit rules and a tighter product voice."
    },
    {
      label: "Now",
      title: "Usable local stack",
      copy: "The local architecture is strong, the wallet and client path are usable, and the release pipeline exists."
    },
    {
      label: "In Progress",
      title: "Public-network hardening",
      copy: "Bootstrap, longer soak coverage, and a broader public operator story still need more work."
    },
    {
      label: "Next",
      title: "Next test batch",
      copy: "Community onboarding will center on Discord so early testers can join before mainnet and follow progress directly."
    }
  ],
  communityActions: [
    {
      label: "Join Discord",
      href: "https://discord.gg/W5fV4aGcUR",
      variant: "primary",
      external: true
    },
    {
      label: "Follow on X",
      href: "https://x.com/AthoHQ",
      variant: "secondary",
      external: true
    },
    {
      label: "Contact Labs",
      href: "mailto:labs@atho.io",
      variant: "tertiary",
      external: false
    },
    {
      label: "View Status",
      href: "./roadmap.html",
      variant: "secondary",
      external: false
    }
  ],
  footerColumns: [
    {
      title: "Network",
      links: [
        { label: "Explorer", href: "./roadmap.html", badge: "Pending" },
        { label: "Faucet", href: "./join.html", badge: "Pending" },
        { label: "Nodes", href: "./index.html#developers" },
        { label: "Status", href: "./roadmap.html", badge: "Pending" }
      ]
    },
    {
      title: "Developers",
      links: [
        { label: "Docs", href: "./docs.html", badge: "Pending" },
        { label: "GitHub", href: "https://github.com/Atho-Labs/", external: true },
        { label: "API", href: "./docs.html", badge: "Pending" },
        { label: "Mining Guide", href: "./join.html", badge: "Pending" }
      ]
    },
    {
      title: "Atho",
      links: [
        { label: "About", href: "./index.html#network" },
        { label: "Status", href: "./roadmap.html" },
        { label: "Brand Kit", href: "mailto:labs@atho.io?subject=Brand%20Kit" },
        { label: "Whitepaper", href: "./assets/files/atho-whitepaper.pdf" }
      ]
    },
    {
      title: "Community",
      links: [
        { label: "Discord", href: "https://discord.gg/W5fV4aGcUR", external: true },
        { label: "X", href: "https://x.com/AthoHQ", external: true },
        { label: "Telegram", href: "https://t.me/atho_labs", external: true },
        { label: "Contact", href: "./contact.html" }
      ]
    }
  ]
};
