export const siteContent = {
  socialLinks: [
    { label: "GitHub", href: "https://github.com/Atho-Labs", icon: "github" },
    { label: "Discord", href: "https://discord.gg/W5fV4aGcUR", icon: "discord" },
    { label: "X (@AthoHQ)", href: "https://x.com/AthoHQ", icon: "x" }
  ],
  heroSignals: [
    "75-second blocks",
    "Falcon-512 authorization",
    "Encrypted P2P transport",
    "Rust reference stack"
  ],
  protocolHighlights: [
    {
      number: "01",
      title: "Payment-first settlement",
      copy: "Public UTXOs, integer atom accounting, and deterministic full-node validation keep settlement explicit.",
      hover: "Wallets build and sign candidate transactions. Nodes independently validate every transaction and block before state changes become durable."
    },
    {
      number: "02",
      title: "Post-quantum-aware ownership",
      copy: "Falcon-512 authorizes spends while SHA3-384 secures proof-of-work block production.",
      hover: "Falcon-512 protects transaction authorization. It does not make every part of a computer or network quantum-proof."
    },
    {
      number: "03",
      title: "Encrypted peer traffic",
      copy: "Public network modes require authenticated hybrid encryption before Atho protocol messages are exchanged.",
      hover: "X25519 and ML-KEM-768 feed HKDF-SHA3-256; ChaCha20-Poly1305 protects the peer session. RPC and HTTP stay loopback-only because they are separate control interfaces."
    }
  ],
  runtimePills: [
    {
      label: "Peer transport",
      value: "Required on public modes",
      copy: "P2P frames are encrypted and authenticated before version negotiation.",
      hover: "Only regnet diagnostics can opt into plaintext transport. Mainnet, testnet, and prunetest reject downgrade attempts."
    },
    {
      label: "Wallet transaction PoW",
      value: "SHA3-256, 10-16 bits",
      copy: "Wallets sign first, then solve lightweight anti-spam work.",
      hover: "Transaction PoW is separate from block mining and is derived from transaction shape."
    },
    {
      label: "Adaptive block budget",
      value: "1M-2M vbytes",
      copy: "Capacity moves gradually inside fixed consensus bounds.",
      hover: "Blocks are also bounded by 8M weight units, 8M serialized bytes, and 5,000 Falcon signature checks."
    },
    {
      label: "Headless operation",
      value: "Seven focused CLI tools",
      copy: "Run nodes, RPC, mining, wallets, and address inspection without the desktop client.",
      hover: "athod, atho-cli, atho-mine, atho-wallet, atho-address, atho-snapshot, and atho-pool can be built and operated independently."
    }
  ],
  networkConstants: [
    {
      name: "Mainnet",
      detail: "atho-mainnet",
      value: "<span class=\"stack-line\">P2P 56000</span><span class=\"stack-line\">RPC 9010</span>",
      copy: "Implemented network mode; public launch has not occurred.",
      hover: "Mainnet has its own consensus ID, genesis anchor, address prefix, ports, storage, and P2P magic. Launch remains gated by release review and deployment readiness.",
      href: "./docs.html#network-status",
      actionLabel: "Read network status"
    },
    {
      name: "Testnet",
      detail: "atho-testnet",
      value: "<span class=\"stack-line\">P2P 9100</span><span class=\"stack-line\">RPC 9110</span>",
      copy: "The previous public testnet cycle is retired while updated chain rules are prepared.",
      hover: "The network mode remains in the software, but the former public bootstrap nodes and explorer endpoint are offline. Old testnet chain data is obsolete.",
      href: "./roadmap.html",
      actionLabel: "View current status"
    },
    {
      name: "Regnet",
      detail: "atho-regnet",
      value: "<span class=\"stack-line\">P2P 9200</span><span class=\"stack-line\">RPC 9210</span>",
      copy: "Local deterministic mode for disposable development and integration work.",
      hover: "Regnet is the only mode where protocol diagnostics can explicitly disable encrypted P2P transport.",
      href: "./docs.html#network-modes",
      actionLabel: "Read network modes"
    },
    {
      name: "Prunetest",
      detail: "atho-prunetest",
      value: "<span class=\"stack-line\">P2P 9300</span><span class=\"stack-line\">RPC 9310</span>",
      copy: "Isolated low-difficulty mode for pruning and storage validation.",
      hover: "Prunetest keeps storage experiments separate from mainnet, testnet, and regnet state.",
      href: "./docs.html#network-modes",
      actionLabel: "Read network modes"
    }
  ],
  stats: [
    {
      key: "blockTime",
      label: "Block Time",
      value: "75 SEC",
      detail: "Target spacing.",
      hover: "Atho targets one proof-of-work block every 75 seconds.",
      badge: "Current"
    },
    {
      key: "baseReward",
      label: "Starting Reward",
      value: "16 ATHO",
      detail: "First bootstrap era.",
      hover: "Height 0 is a zero-emission genesis anchor. Ordinary subsidy begins at height 1.",
      badge: "Current"
    },
    {
      key: "tailReward",
      label: "Tail Reward",
      value: "0.0625 ATHO",
      detail: "Until the supply cap.",
      hover: "Tail emission starts at height 13,440,001, annualizes to 26,280 ATHO at target cadence, and ends at height 1,844,640,000.",
      badge: "Current"
    },
    {
      key: "bootstrapSupply",
      label: "Bootstrap Issuance",
      value: "53.55M ATHO",
      detail: "Through height 13,440,000.",
      hover: "Eight 1,680,000-block eras pay 16, 8, 4, 2, 1, 0.50, 0.25, and 0.125 ATHO. There is no premine.",
      badge: "Current"
    },
    {
      key: "atoms",
      label: "Atomic Precision",
      value: "100M atoms",
      detail: "1 ATHO.",
      hover: "All consensus accounting uses integers; display units use eight decimal places.",
      badge: "Current"
    },
    {
      key: "minFee",
      label: "Minimum Fee",
      value: "max(600, 1/B)",
      detail: "Atoms per serialized bytes.",
      hover: "Every non-coinbase transaction pays at least 600 atoms and at least one atom per serialized byte.",
      badge: "Current"
    },
    {
      key: "minOutput",
      label: "Minimum Output",
      value: "100 atoms",
      detail: "Standard dust floor.",
      hover: "Standard outputs below 100 atoms are rejected.",
      badge: "Current"
    }
  ],
  coreFeatures: [
    {
      icon: "shield",
      title: "Authenticated encrypted P2P",
      copy: "Peer messages travel inside mandatory hybrid-encrypted sessions on public network modes.",
      hover: "The transport protects content and authenticates node identity, while IP addresses and timing remain visible to connected peers and network observers.",
      href: "./docs.html#encrypted-p2p",
      actionLabel: "Read P2P privacy docs"
    },
    {
      icon: "grid",
      title: "Public UTXO payments",
      copy: "Outputs, confirmations, and spending rules stay explicit and independently verifiable.",
      hover: "Atho is a public ledger. P2P encryption does not hide confirmed transaction amounts or the UTXO graph.",
      href: "./docs.html#transactions-fees",
      actionLabel: "Read transaction docs"
    },
    {
      icon: "terminal",
      title: "Desktop or headless",
      copy: "Use the lightweight desktop client or compose focused command-line binaries.",
      hover: "The headless stack separates node, control, mining, wallet, and address workflows for servers and automation.",
      href: "./docs.html#headless-binaries",
      actionLabel: "Read headless docs"
    }
  ],
  ecosystemGroups: [
    {
      title: "Reference stack",
      items: [
        {
          icon: "server",
          title: "athod",
          status: "Implemented",
          copy: "Full-node runtime for validation, storage, mempool, encrypted P2P, RPC, API, and mining templates.",
          hover: "The node owns canonical chain truth and keeps RPC/API control interfaces on loopback.",
          actionLabel: "Node docs",
          actionHref: "./docs.html#nodes-mining"
        },
        {
          icon: "terminal",
          title: "Headless suite",
          status: "Implemented",
          copy: "CLI, miner, wallet, and address binaries for servers and scripted workflows.",
          hover: "Each binary has a focused responsibility and can be built without launching the GUI.",
          actionLabel: "Binary guide",
          actionHref: "./docs.html#headless-binaries"
        },
        {
          icon: "monitor",
          title: "atho-qt",
          status: "Implemented",
          copy: "Lightweight desktop wallet and operator client over backend-owned node state.",
          hover: "The desktop client provides wallet, transaction, mining, peer, history, console, and settings views.",
          actionLabel: "Wallet docs",
          actionHref: "./docs.html#wallets"
        }
      ]
    }
  ],
  homepageAccess: [
    {
      icon: "database",
      title: "Read the docs",
      copy: "Current protocol rules, privacy boundaries, commands, wallets, nodes, and mining.",
      hover: "The website docs are synchronized to the current source constants and runtime behavior.",
      href: "./docs.html",
      actionLabel: "Open docs"
    },
    {
      icon: "globe",
      title: "Open the Explorer",
      copy: "Use the familiar Explorer interface while the public data feed remains offline.",
      hover: "A first-entry notice clearly explains that live search and network data will return with the next compatible public network.",
      href: "./explore/",
      actionLabel: "Open Explorer"
    },
    {
      icon: "server",
      title: "Compare network modes",
      copy: "Review mainnet, testnet, regnet, and prunetest identities, ports, and current availability.",
      hover: "Each mode has isolated identity, storage, ports, and genesis state. Software support does not imply a public network is online.",
      href: "./networks.html",
      actionLabel: "View networks"
    },
    {
      icon: "code",
      title: "Review the source",
      copy: "Browse Atho Labs projects and follow implementation work on GitHub.",
      hover: "Code is the final authority when a summary and the implementation disagree.",
      href: "https://github.com/Atho-Labs",
      actionLabel: "Open GitHub"
    }
  ],
  economics: [
    {
      label: "Target cadence",
      value: "75 seconds",
      badge: "Current",
      note: "420,480 target blocks/year.",
      hover: "The target cadence is used for issuance projections; actual wall-clock production can vary."
    },
    {
      label: "Bootstrap rewards",
      value: "16 / 8 / 4 / 2 / 1 / 0.50 / 0.25 / 0.125",
      badge: "Current",
      note: "ATHO per block.",
      hover: "Each bootstrap era lasts 1,680,000 blocks."
    },
    {
      label: "Tail reward",
      value: "0.0625 ATHO",
      badge: "Current",
      note: "Heights 13,440,001-1,844,640,000.",
      hover: "The long tail provides a base miner security budget until the hard supply cap is reached."
    },
    {
      label: "Bootstrap issuance",
      value: "53,550,000 ATHO",
      badge: "Current",
      note: "No premine.",
      hover: "This is scheduled issuance through the final 0.25 ATHO bootstrap block."
    },
    {
      label: "Maximum supply",
      value: "168,000,000 ATHO",
      badge: "Current",
      note: "Consensus-enforced hard cap.",
      hover: "Subsidy becomes zero after height 1,844,640,000; integer atom accounting prevents issuance beyond the cap."
    },
    {
      label: "Required fee",
      value: "max(600 atoms, 1 atom/B)",
      badge: "Current",
      note: "Optional tips above the floor.",
      hover: "Consensus amount arithmetic never uses floating-point values."
    }
  ],
  developerPoints: [
    "Focused crates separate consensus, cryptography, storage, P2P, RPC, node, wallet, GUI, GPU, and installer responsibilities.",
    "Public-network P2P requires encrypted authenticated sessions; RPC and HTTP remain loopback-only control boundaries.",
    "Normal sends use exact atom parsing, Falcon-512 authorization, wallet TX-PoW, mempool validation, and block inclusion."
  ],
  developerCommands: [
    { kind: "comment", text: "Build the operator and wallet binaries" },
    { kind: "command", prompt: "$", text: "cargo build --release -p atho-node -p atho-wallet -p atho-qt" },
    { kind: "command", prompt: "$", text: "./target/release/athod --network regnet" },
    { kind: "command", prompt: "$", text: "./target/release/atho-cli --network regnet getblockchaininfo" },
    { kind: "comment", text: "Use regnet for local work while the public testnet is offline" }
  ],
  statusCards: [
    {
      label: "Protocol",
      title: "Pre-mainnet alpha",
      copy: "The current code implements the public UTXO chain, capped eight-era monetary schedule, Falcon-512 authorization, and encrypted P2P.",
      hover: "Mainnet has not launched. Production-readiness claims require independent review and release evidence."
    },
    {
      label: "Network",
      title: "Public testnet retired",
      copy: "The previous public testnet and explorer endpoints are offline while updated chain rules are prepared.",
      hover: "Old testnet block data should not be treated as compatible with the next ruleset."
    },
    {
      label: "Documentation",
      title: "Source-grounded references",
      copy: "The website tracks current consensus constants, privacy boundaries, and shipped binaries.",
      hover: "The whitepaper is published as the sole current protocol PDF on this site."
    }
  ],
  communityActions: [
    { label: "Read the docs", href: "./docs.html", variant: "primary", external: false },
    { label: "View GitHub", href: "https://github.com/Atho-Labs", variant: "secondary", external: true },
    { label: "Join Discord", href: "https://discord.gg/W5fV4aGcUR", variant: "secondary", external: true },
    { label: "Follow @AthoHQ", href: "https://x.com/AthoHQ", variant: "tertiary", external: true }
  ],
  footerColumns: [
    {
      title: "Documentation",
      links: [
        { label: "Overview", href: "./docs.html#overview", badge: "Current" },
        { label: "Protocol", href: "./docs.html#protocol" },
        { label: "Encrypted P2P", href: "./docs.html#encrypted-p2p" },
        { label: "Headless Binaries", href: "./docs.html#headless-binaries" },
        { label: "RPC and API", href: "./docs.html#rpc-api" }
      ]
    },
    {
      title: "Project",
      links: [
        { label: "Current Status", href: "./roadmap.html" },
        { label: "Network Modes", href: "./networks.html" },
        { label: "Build Atho", href: "./join.html" },
        { label: "Whitepaper", href: "./assets/files/atho-whitepaper.pdf" },
        { label: "Explorer", href: "./explore/" },
        { label: "Contact", href: "./contact.html" }
      ]
    },
    {
      title: "Source",
      links: [
        { label: "Atho Labs", href: "https://github.com/Atho-Labs", external: true, badge: "GitHub" },
        { label: "Website Repository", href: "https://github.com/Atho-Labs/website", external: true },
        { label: "Developer Reference", href: "./docs.html#developer-reference" },
        { label: "Apache 2.0", href: "./docs.html#license" }
      ]
    },
    {
      title: "Community",
      links: [
        { label: "Discord", href: "https://discord.gg/W5fV4aGcUR", external: true },
        { label: "X", href: "https://x.com/AthoHQ", external: true },
        { label: "Telegram", href: "https://t.me/atho_labs", external: true },
        { label: "Email", href: "mailto:genull@proton.me", external: true }
      ]
    }
  ]
};
