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
      copy: "Falcon-512 and SHA3-384 secure long-lived balances.",
      hover: "Signatures and message binding stay explicit so wallets, miners, and nodes verify the same cryptographic path."
    },
    {
      number: "02",
      title: "Public UTXO Settlement",
      copy: "Readable UTXO accounting keeps ownership and spendability public.",
      hover: "Outputs remain the settlement layer, so balances, maturity, and spend paths stay easy to audit."
    },
    {
      number: "03",
      title: "Deterministic Validation",
      copy: "Explicit validation boundaries keep every node on the same rules.",
      hover: "Consensus, storage, and runtime responsibilities stay separated so operators can inspect the trust surface."
    }
  ],
  runtimePills: [
    {
      label: "Mempool prevalidation",
      value: "Validate once, reuse safely",
      copy: "Admission checks reuse safe results.",
      hover: "The fast path stays efficient without relaxing consensus or wallet safety."
    },
    {
      label: "Batched chainstate I/O",
      value: "Less churn on the hot path",
      copy: "UTXO work is grouped on the hot path.",
      hover: "Batching reduces repeated database churn when blocks and mempool traffic are dense."
    },
    {
      label: "Parallel Falcon checks",
      value: "Multi-core signature work",
      copy: "Independent Falcon checks fan across cores.",
      hover: "Parallelism raises throughput without softening message binding or consensus validation."
    },
    {
      label: "Compact network sync",
      value: "Relay less, move faster",
      copy: "Compact relay cuts wasted bandwidth.",
      hover: "Headers-first sync and compact relay keep propagation efficient when more operators join."
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
      detail: "Fixed cap.",
      hover: "The supply cap stays public, finite, and easy to verify.",
      badge: "Published"
    },
    {
      key: "baseReward",
      label: "Base Reward",
      value: "50 ATHO",
      detail: "Base subsidy.",
      hover: "Base issuance begins with a visible subsidy instead of hidden monetary logic.",
      badge: "Published"
    },
    {
      key: "throughput",
      label: "Throughput Target",
      value: "65-80 TPS",
      detail: "Payment target range.",
      hover: "The target is based on the current block model for simple 1-in/1-out payment flow.",
      badge: "Published"
    },
    {
      key: "settlement",
      label: "Settlement Time",
      value: "75 SEC",
      detail: "Block target.",
      hover: "The public target is 75 seconds per block in the current documented consensus shape.",
      badge: "Published"
    },
    {
      key: "blockCap",
      label: "Block Capacity",
      value: "3,000,000 VB",
      detail: "Weighted cap.",
      hover: "Witness-aware sizing keeps block usage explicit instead of hiding weight behind vague throughput claims.",
      badge: "Published"
    },
    {
      key: "rawCap",
      label: "Raw Cap",
      value: "~12,000,000 B",
      detail: "Approximate ceiling.",
      hover: "The current block shape yields an approximate raw byte ceiling near 12 million bytes.",
      badge: "Published"
    }
  ],
  coreFeatures: [
    {
      icon: "shield",
      title: "Falcon-512 Signatures",
      copy: "Post-quantum signing across wallet and transaction flows.",
      hover: "Domain separation keeps transaction and wallet contexts explicit instead of collapsing them into one loose signature path."
    },
    {
      icon: "hash",
      title: "SHA3 Hashing",
      copy: "SHA3-256 and SHA3-384 back commitments and signing prehashes.",
      hover: "Commitments, checksums, and signing prehashes use modern hash choices that stay visible in the protocol surface."
    },
    {
      icon: "grid",
      title: "Public UTXO Model",
      copy: "Outputs remain the public accounting layer.",
      hover: "Spendability, maturity, and balance all resolve through the same UTXO truth model."
    },
    {
      icon: "layers",
      title: "SigWit-Style Sizing",
      copy: "Witness-aware sizing keeps block usage explicit.",
      hover: "Transaction weight stays visible instead of being hidden behind generic block-size marketing."
    },
    {
      icon: "pickaxe",
      title: "Proof-of-Work Mining",
      copy: "Blocks stay independently verifiable on every node.",
      hover: "Proof-of-work metadata and block validity remain readable to miners, node operators, and outside auditors."
    },
    {
      icon: "bolt",
      title: "Runtime Efficiency",
      copy: "Efficiency work raises throughput without softening consensus.",
      hover: "Prevalidation, UTXO batching, compact relay, low-copy parsing, and Falcon parallelism all stay on the canonical path."
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
          copy: "Canonical full node.",
          hover: "The full node owns runtime behavior, mempool admission, chainstate updates, and the canonical validation path.",
          actionLabel: "See network",
          actionHref: "#network"
        },
        {
          icon: "pickaxe",
          title: "atho-mine",
          status: "Live",
          copy: "Dedicated miner client.",
          hover: "Mining stays separate from consensus ownership instead of replacing the node’s validation logic.",
          actionLabel: "See technology",
          actionHref: "#technology"
        },
        {
          icon: "monitor",
          title: "atho-qt",
          status: "Live",
          copy: "Thin desktop client.",
          hover: "The GUI renders backend truth instead of inventing local chainstate during sync, restart, or recovery.",
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
          copy: "Public explorer in rollout.",
          hover: "The public explorer is part of the rollout path, but it is being tightened before broader mainnet-facing use.",
          actionLabel: "View pending status",
          actionHref: "./roadmap.html"
        },
        {
          icon: "spark",
          title: "Testnet Faucet",
          status: "Pending",
          copy: "Access opens through the next batch.",
          hover: "Testnet access will route through the next community batch rather than an always-open faucet flow.",
          actionLabel: "Join the batch",
          actionHref: "./join.html"
        },
        {
          icon: "terminal",
          title: "Public Status Page",
          status: "Pending",
          copy: "Public status surface in rollout.",
          hover: "A clearer public status surface will land as the broader public-network phase gets closer.",
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
          copy: "Public repo and code surface.",
          hover: "The public repository is the visible developer surface while docs and broader onboarding are refined.",
          actionLabel: "Open GitHub",
          actionHref: "https://github.com/Atho-Labs/",
          external: true
        },
        {
          icon: "database",
          title: "Public Docs",
          status: "Pending",
          copy: "Docs are being tightened.",
          hover: "The docs hub is being simplified so public onboarding is clearer before a broader release.",
          actionLabel: "Read docs status",
          actionHref: "./docs.html"
        },
        {
          icon: "package",
          title: "Mining Guide",
          status: "Pending",
          copy: "Setup notes are being refined.",
          hover: "Mining guidance will land in a cleaner operator path once the public onboarding surface is ready.",
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
      note: "Public, finite supply.",
      hover: "The supply cap stays explicit so long-term holders can audit the monetary surface without interpretation."
    },
    {
      label: "Base Block Reward",
      value: "50 ATHO",
      badge: "Published",
      note: "Clear starting subsidy.",
      hover: "Issuance begins with a visible base reward instead of hidden monetary logic."
    },
    {
      label: "Issuance Model",
      value: "Subsidy + halving logic",
      badge: "Published",
      note: "Consensus-owned reward logic.",
      hover: "The reward path lives in the consensus core rather than in off-chain narrative or discretionary policy."
    },
    {
      label: "Proof-of-Work Issuance",
      value: "Public and auditable",
      badge: "Published",
      note: "Every node can verify new supply.",
      hover: "New issuance enters through proof-of-work blocks that stay independently auditable."
    },
    {
      label: "Fee Accounting",
      value: "Block-level totals",
      badge: "Published",
      note: "Explicit fee totals per block.",
      hover: "Blocks carry visible fee totals instead of hiding settlement math behind abstract system counters."
    },
    {
      label: "Maturity Rules",
      value: "Consensus-enforced",
      badge: "Published",
      note: "Visible spendability rules.",
      hover: "Reward handling, maturity checks, and spendability stay in the validation path where operators can inspect them."
    }
  ],
  developerPoints: [
    "Core, node, wallet, GUI, RPC, and installer layers stay clearly separated.",
    "Fast-path work stays on the canonical validation path.",
    "The GUI stays thin so backend truth stays canonical."
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
      title: "Payments-first voice",
      copy: "The public message is being narrowed around payments and rules.",
      hover: "Messaging is being tightened so the public surface matches the actual payment-first protocol posture."
    },
    {
      label: "Now",
      title: "Working stack",
      copy: "Node, miner, and client already run end to end.",
      hover: "The architecture, wallet path, client path, and release flow are usable today."
    },
    {
      label: "In Progress",
      title: "Network hardening",
      copy: "Bootstrap and public operator hardening are still underway.",
      hover: "Longer soak coverage, broader bootstrap confidence, and a stronger operator story still need more work."
    },
    {
      label: "Next",
      title: "Discord intake",
      copy: "The next public batch will route through Discord.",
      hover: "Early testers will join through the community path before broader mainnet-facing access opens."
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
