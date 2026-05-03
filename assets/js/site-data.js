export const siteContent = {
  heroSignals: [
    "public testnet live",
    "build and run locally",
    "wallet sync before mining",
    "email for testnet coins"
  ],
  protocolHighlights: [
    {
      number: "01",
      title: "Public Testnet Repo",
      copy: "Clone Atho-Testnet and run the real client stack.",
      hover: "The public entry point is now the dedicated testnet repo, not a docs-placeholder landing flow."
    },
    {
      number: "02",
      title: "Wallet Then Sync",
      copy: "Create a wallet and wait until the node is fully caught up.",
      hover: "Mining and transaction testing should start only after the client reports full network sync."
    },
    {
      number: "03",
      title: "Email for Coins",
      copy: "Send a screenshot and a testnet address to receive coins.",
      hover: "Coin distribution is routed directly through email while the public testnet surface is still being tightened."
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
          title: "Testnet Join Flow",
          status: "Pending",
          copy: "Public onboarding is now centered on the testnet repo and client.",
          hover: "The website now points users into the testnet build and wallet flow instead of a generic future-facing placeholder.",
          actionLabel: "Join testnet",
          actionHref: "./join.html"
        },
        {
          icon: "spark",
          title: "Testnet Faucet",
          status: "Pending",
          copy: "Coin requests currently route through direct email.",
          hover: "Instead of an open faucet, testers request coins by sending a screenshot and testnet address to the project email.",
          actionLabel: "Request coins",
          actionHref: "./contact.html"
        },
        {
          icon: "terminal",
          title: "Quickstart",
          status: "Live",
          copy: "Clone, build, run, create wallet, sync, and mine.",
          hover: "The public docs path is now a direct testnet quickstart rather than a broad placeholder documentation surface.",
          actionLabel: "Open quickstart",
          actionHref: "./docs.html"
        }
      ]
    },
    {
      title: "Developer Access",
      items: [
        {
          icon: "code",
          title: "Atho-Testnet",
          status: "Live",
          copy: "Public repo for the testnet launch path.",
          hover: "The dedicated testnet repository is the public code surface for joining the current Atho network.",
          actionLabel: "Open testnet repo",
          actionHref: "https://github.com/Atho-Labs/Atho-Testnet",
          external: true
        },
        {
          icon: "database",
          title: "Quickstart Docs",
          status: "Live",
          copy: "Simple clone, build, and run steps.",
          hover: "The docs surface has been reduced to a practical quickstart so users can get onto the testnet without paging through broad placeholder content.",
          actionLabel: "Read quickstart",
          actionHref: "./docs.html"
        },
        {
          icon: "package",
          title: "Coin Request Path",
          status: "Live",
          copy: "Email a screenshot and testnet address to get coins.",
          hover: "The current coin distribution flow is manual and explicit so early public testers can get funded without a broader faucet rollout.",
          actionLabel: "Open contact",
          actionHref: "./contact.html"
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
      text: "clone the public testnet repo"
    },
    {
      kind: "comment",
      text: "https://github.com/Atho-Labs/Atho-Testnet"
    },
    {
      kind: "command",
      prompt: "$",
      text: "cargo build"
    },
    {
      kind: "command",
      prompt: "$",
      text: "python testnet.py"
    },
    {
      kind: "command",
      prompt: "$",
      text: "# create wallet, sync, then mine"
    }
  ],
  statusCards: [
    {
      label: "Now",
      title: "Testnet repo live",
      copy: "The public website now points to the dedicated testnet repo.",
      hover: "The main entry path is now concrete: clone the repo, build the binaries, and run the client."
    },
    {
      label: "Now",
      title: "Working stack",
      copy: "Node, wallet, miner, and client already run end to end on testnet.",
      hover: "The operator path is simple enough for public testers to build locally and join the network."
    },
    {
      label: "In Progress",
      title: "Public network hardening",
      copy: "Bootstrap and broader operator hardening are still underway.",
      hover: "The public testnet is live, but longer soak coverage and broader network hardening still matter."
    },
    {
      label: "Next",
      title: "Coin distribution",
      copy: "Email remains the current testnet coin request path.",
      hover: "The next public improvement is a broader, lower-friction funding path for testers."
    }
  ],
  communityActions: [
    {
      label: "Open Testnet Repo",
      href: "https://github.com/Atho-Labs/Atho-Testnet",
      variant: "primary",
      external: true
    },
    {
      label: "Build + Run Steps",
      href: "./docs.html",
      variant: "secondary",
      external: false
    },
    {
      label: "Email for Coins",
      href: "mailto:genull@proton.me?subject=Atho%20Testnet%20Coins",
      variant: "tertiary",
      external: false
    },
    {
      label: "Join Discord",
      href: "https://discord.gg/W5fV4aGcUR",
      variant: "secondary",
      external: true
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
        { label: "Join Testnet", href: "./join.html", badge: "Live" },
        { label: "Coin Requests", href: "./contact.html", badge: "Live" },
        { label: "Nodes", href: "./index.html#developers" },
        { label: "Status", href: "./roadmap.html", badge: "Live" }
      ]
    },
    {
      title: "Developers",
      links: [
        { label: "Quickstart", href: "./docs.html", badge: "Live" },
        { label: "Testnet Repo", href: "https://github.com/Atho-Labs/Atho-Testnet", external: true },
        { label: "Run Client", href: "./docs.html", badge: "Live" },
        { label: "Mine on Testnet", href: "./join.html", badge: "Live" }
      ]
    },
    {
      title: "Atho",
      links: [
        { label: "About", href: "./index.html#network" },
        { label: "Status", href: "./roadmap.html" },
        { label: "Contact", href: "mailto:genull@proton.me?subject=Atho%20Testnet" },
        { label: "Whitepaper", href: "./assets/files/atho-whitepaper.pdf" }
      ]
    },
    {
      title: "Community",
      links: [
        { label: "Discord", href: "https://discord.gg/W5fV4aGcUR", external: true },
        { label: "X", href: "https://x.com/AthoHQ", external: true },
        { label: "Telegram", href: "https://t.me/atho_labs", external: true },
        { label: "Email", href: "./contact.html" }
      ]
    }
  ]
};
