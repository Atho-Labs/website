export const siteContent = {
  heroSignals: [
    "UTXO Settlement",
    "Falcon-512 Signatures",
    "SHA3-384 Mining",
    "0.50 ATHO Tail Reward"
  ],
  protocolHighlights: [
    {
      number: "01",
      title: "Payment-First UTXO Design",
      copy: "Atho keeps settlement explicit with public UTXOs, deterministic full-node validation, and backend-owned chain truth.",
      hover: "Wallets build transactions, miners order blocks, and full nodes independently verify the same UTXO state before accepting chain updates."
    },
    {
      number: "02",
      title: "Low Fee Floor, Real Spam Friction",
      copy: "Every non-coinbase transaction pays at least max(600 atoms, 1 atom per serialized byte) and solves wallet TX-PoW.",
      hover: "The mandatory fee floor keeps accounting exact, while 10-to-16-bit transaction PoW makes bulk spam carry a sender-side cost."
    },
    {
      number: "03",
      title: "Bootstrap Plus Tail Rewards",
      copy: "Atho pays 8, 4, 2, and 1 ATHO across four bootstrap eras, then 0.50 ATHO per block forever.",
      hover: "There is no premine and no maximum supply cap. Bootstrap issuance reaches 18,750,000 ATHO before the permanent tail reward starts at height 5,000,001."
    }
  ],
  runtimePills: [
    {
      label: "Mempool Prevalidation",
      value: "Validate once, reuse safely",
      copy: "Admission checks reject invalid transactions before they reach block templates.",
      hover: "The fast path stays efficient without relaxing consensus or wallet safety."
    },
    {
      label: "Wallet Transaction PoW",
      value: "SHA3-256, 10-16 bits",
      copy: "Wallets sign first, then solve a lightweight anti-spam nonce.",
      hover: "Transaction PoW is not block mining. The required bit target is shape-derived and clamped from 10 to 16 bits on every network."
    },
    {
      label: "Batched Chainstate I/O",
      value: "Less churn on the hot path",
      copy: "UTXO work is grouped on the hot path.",
      hover: "Batching reduces repeated database churn when blocks and mempool traffic are dense."
    },
    {
      label: "Parallel Falcon Checks",
      value: "Multi-core signature work",
      copy: "Independent Falcon checks fan across cores.",
      hover: "Parallelism raises throughput without softening message binding or consensus validation."
    }
  ],
  networkConstants: [
    {
      name: "Mainnet",
      detail: "atho-mainnet",
      value: "<span class=\"stack-line\">P2P 56000</span><span class=\"stack-line\">RPC 9010</span>",
      copy: "Mainnet mode keeps reviewed deployments isolated from every other Atho network.",
      hover: "Mainnet uses its own consensus ID, address prefix, ports, storage, and genesis anchor. Operators should use signed releases, backups, monitoring, and deployment controls before handling real value.",
      href: "./docs.html#network-modes",
      actionLabel: "Read network docs"
    },
    {
      name: "Testnet",
      detail: "atho-testnet",
      value: "<span class=\"stack-line\">P2P 9100</span><span class=\"stack-line\">RPC 9110</span>",
      copy: "Public network for wallet, mining, sync, explorer, and API evaluation.",
      hover: "Testnet is the public place to try wallets, mining, sync, explorer, and API changes safely.",
      href: "./docs.html#testnet",
      actionLabel: "Read testnet docs"
    },
    {
      name: "Regnet",
      detail: "atho-regnet",
      value: "<span class=\"stack-line\">P2P 9200</span><span class=\"stack-line\">RPC 9210</span>",
      copy: "Local deterministic network for disposable test runs.",
      hover: "Regnet is for local workflows where you want to test behavior without using public testnet.",
      href: "./docs.html#network-modes",
      actionLabel: "Read network docs"
    },
    {
      name: "Prunetest",
      detail: "atho-prunetest",
      value: "<span class=\"stack-line\">P2P 9300</span><span class=\"stack-line\">RPC 9310</span>",
      copy: "Low-difficulty pruning and storage test network.",
      hover: "Prunetest is isolated from mainnet, testnet, and regnet so storage and pruning behavior can be tested without touching public network state.",
      href: "./docs.html#network-modes",
      actionLabel: "Read network docs"
    }
  ],
  stats: [
    {
      key: "blockTime",
      label: "Block Time",
      value: "100 SEC",
      detail: "Target spacing.",
      hover: "Atho targets 100 second proof-of-work blocks.",
      badge: "Published"
    },
    {
      key: "baseReward",
      label: "Starting Reward",
      value: "8 ATHO",
      detail: "Initial subsidy.",
      hover: "The first ordinarily mineable block is height 1. Bootstrap rewards are 8, 4, 2, and 1 ATHO for 1,250,000 blocks each.",
      badge: "Published"
    },
    {
      key: "tailReward",
      label: "Tail Reward",
      value: "0.50 ATHO",
      detail: "Permanent per block.",
      hover: "Tail emission starts at height 5,000,001 and annualizes to 157,680 ATHO at the 100-second target cadence.",
      badge: "Published"
    },
    {
      key: "bootstrapSupply",
      label: "Bootstrap Issuance",
      value: "18.75M ATHO",
      detail: "Through height 5,000,000.",
      hover: "Atho has no premine. The bootstrap milestone is scheduled issuance before the permanent tail reward begins.",
      badge: "Published"
    },
    {
      key: "atoms",
      label: "Atomic Precision",
      value: "100M atoms",
      detail: "1 ATHO.",
      hover: "Atho is scarce at the coin level and highly divisible at the atom level.",
      badge: "Published"
    },
    {
      key: "minFee",
      label: "Minimum Fee",
      value: "max(600, 1/B)",
      detail: "Serialized bytes.",
      hover: "Consensus requires max(600 atoms, 1 atom per serialized byte). Any positive amount above that floor is an optional miner tip.",
      badge: "Published"
    },
    {
      key: "minOutput",
      label: "Minimum Output",
      value: "100 atoms",
      detail: "Dust floor.",
      hover: "Normal outputs below 100 atoms are rejected by standard policy.",
      badge: "Published"
    }
  ],
  coreFeatures: [
    {
      icon: "shield",
      title: "Post-Quantum-Aware Signatures",
      copy: "Falcon-512 authorizes wallet spends with a lattice-based signature model.",
      hover: "Atho uses Falcon-512 transaction signatures instead of relying on classical elliptic-curve authorization.",
      href: "./docs.html#falcon-512-and-quantum-security",
      actionLabel: "Read security docs"
    },
    {
      icon: "grid",
      title: "Public UTXO Payments",
      copy: "Outputs stay explicit, readable, and easy to verify across wallets and nodes.",
      hover: "Balances, confirmations, and spending all resolve through the same public UTXO model.",
      href: "./docs.html#utxo-model",
      actionLabel: "Read transaction docs"
    },
    {
      icon: "pickaxe",
      title: "Long-Term Miner Security",
      copy: "Tail rewards keep a permanent proof-of-work subsidy floor as the network matures.",
      hover: "Atho trades away fixed-cap branding for explicit bootstrap issuance and a permanent 0.50 ATHO miner reward floor.",
      href: "./docs.html#miner-security-budget",
      actionLabel: "Read monetary docs"
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
          copy: "Canonical node runtime for validation, storage, mempool, mining interfaces, and RPC.",
          hover: "The full node owns chain truth and validates everything before acceptance.",
          actionLabel: "Read the Docs",
          actionHref: "./docs.html#nodes"
        },
        {
          icon: "pickaxe",
          title: "atho-mine",
          status: "Live",
          copy: "Dedicated miner client for proof-of-work block production.",
          hover: "Mining uses block templates from the node and still relies on full block validation.",
          actionLabel: "Mining Docs",
          actionHref: "./docs.html#mining"
        },
        {
          icon: "monitor",
          title: "atho-qt Desktop Client",
          status: "Live",
          copy: "Thin desktop wallet and operator client over backend truth.",
          hover: "The GUI renders wallet, mempool, mining, and network state without becoming a second consensus owner.",
          actionLabel: "Wallet Docs",
          actionHref: "./docs.html#wallets"
        }
      ]
    },
    {
      title: "Public Access",
      items: [
        {
          icon: "globe",
          title: "Testnet",
          status: "Live",
          copy: "Testing network for wallets, mining, transactions, sync, and operator feedback.",
          hover: "The client has no software faucet. Testnet ATHO is issued by the Atho team for wallet, mining, and transaction testing.",
          actionLabel: "Testnet Docs",
          actionHref: "./docs.html#testnet"
        },
        {
          icon: "database",
          title: "HTML Docs",
          status: "Live",
          copy: "Readable technical documentation for users, miners, node operators, and contributors.",
          hover: "The docs are a real website page with sidebar navigation, search, and internal links.",
          actionLabel: "Open Docs",
          actionHref: "./docs.html"
        },
        {
          icon: "globe",
          title: "Explorer",
          status: "Live",
          copy: "Read-only chain explorer for live testnet blocks, transactions, addresses, fees, and network status.",
          hover: "The explorer reads from the node API and never touches LMDB directly from the website.",
          actionLabel: "Open Explorer",
          actionHref: "./explore/"
        },
        {
          icon: "package",
          title: "Whitepaper",
          status: "Published",
          copy: "Downloadable PDF whitepaper generated from the Atho source document.",
          hover: "The website docs do not depend on the PDF, but the PDF is available as a formal reference.",
          actionLabel: "Download PDF",
          actionHref: "./assets/files/atho-whitepaper.pdf"
        },
        {
          icon: "hash",
          title: "Monetary Supply Model",
          status: "Published",
          copy: "Download the 500-year Atho monetary policy model with rewards, fees, tail emission, and long-range supply views.",
          hover: "The model explains the 8/4/2/1 ATHO bootstrap eras, 0.50 ATHO tail reward, atom fee floor, optional tips, and long-run issuance behavior.",
          actionLabel: "Download PDF",
          actionHref: "./assets/files/atho-monetary-supply-model-500-years.pdf"
        }
      ]
    }
  ],
  homepageAccess: [
    {
      icon: "monitor",
      title: "Read the Docs",
      copy: "Wallet, node, mining, fee, and security details live in the docs.",
      hover: "Use the docs when you want the full explanation behind any homepage term or network rule.",
      href: "./docs.html#overview",
      actionLabel: "Open docs"
    },
    {
      icon: "globe",
      title: "Open the Explorer",
      copy: "Follow live testnet blocks, transactions, addresses, and mempool activity.",
      hover: "The explorer is the read-only chain view for live network activity and search.",
      href: "./explore/",
      actionLabel: "Open explorer"
    },
    {
      icon: "server",
      title: "Join Testnet",
      copy: "Set up the client, request testnet ATHO, and start testing the network.",
      hover: "Testnet setup, storage behavior, mining notes, and testnet ATHO requests are covered in the docs.",
      href: "./docs.html#testnet",
      actionLabel: "Read testnet docs"
    },
    {
      icon: "package",
      title: "Download the Papers",
      copy: "Open the whitepaper or the 500-year monetary supply model.",
      hover: "The whitepaper explains the protocol design. The monetary model focuses on rewards, fees, issuance, and long-range supply.",
      href: "./docs.html#overview-downloads",
      actionLabel: "Open downloads"
    }
  ],
  economics: [
    {
      label: "Atomic Precision",
      value: "1 ATHO = 100M atoms",
      badge: "Published",
      note: "8 decimal places.",
      hover: "Atho supports precise low fees with 100,000,000 atoms per ATHO."
    },
    {
      label: "Starting Reward",
      value: "8 ATHO",
      badge: "Published",
      note: "First reward era.",
      hover: "The first era issues 10,000,000 ATHO across 1,250,000 blocks after the zero-emission genesis anchor."
    },
    {
      label: "Tail Reward",
      value: "0.50 ATHO",
      badge: "Published",
      note: "Permanent miner budget.",
      hover: "Tail emission starts at height 5,000,001 and continues forever."
    },
    {
      label: "Bootstrap Issuance",
      value: "18,750,000 ATHO",
      badge: "Published",
      note: "Before tail activation.",
      hover: "Four 1,250,000-block bootstrap eras pay 8, 4, 2, and 1 ATHO before the permanent tail reward begins."
    },
    {
      label: "Max Supply Cap",
      value: "None",
      badge: "Published",
      note: "Permanent tail emission.",
      hover: "Atho uses declining-percentage tail issuance rather than a fixed max supply cap."
    },
    {
      label: "Required Fee",
      value: "max(600 atoms, 1 atom/B)",
      badge: "Published",
      note: "Atoms, no floats.",
      hover: "A 250-byte transaction pays 600 atoms; a 650-byte transaction pays 650 atoms. Optional miner tips can be added above the floor."
    },
    {
      label: "Spam Deterrent",
      value: "Wallet Transaction PoW",
      badge: "Published",
      note: "SHA3-256, 10-16 bits.",
      hover: "Transaction PoW helps keep fees low without leaving the mempool open to free spam."
    }
  ],
  developerPoints: [
    "Core, crypto, storage, P2P, RPC, node, wallet, GUI, GPU, and installer layers stay clearly separated.",
    "Normal sends use exact atom parsing, Falcon-512 signatures, wallet TX-PoW, mempool validation, and block inclusion.",
    "The GUI stays thin while backend node validation owns durable chain truth."
  ],
  developerCommands: [
    {
      kind: "comment",
      text: "Run the local testnet client"
    },
    {
      kind: "command",
      prompt: "$",
      text: "python3 run/runtestnet.py"
    },
    {
      kind: "command",
      prompt: "$",
      text: "cargo build --release -p atho-node -p atho-wallet -p atho-qt"
    },
    {
      kind: "command",
      prompt: "$",
      text: "./target/release/atho-qt --network testnet --local-node"
    },
    {
      kind: "comment",
      text: "Create or import a wallet, sync, then mine or send"
    }
  ],
  statusCards: [
    {
      label: "Protocol",
      title: "V1 Ruleset",
      copy: "Atho V1 centers on UTXO payments, Falcon-512 authorization, SHA3-384 mining, and wallet TX-PoW.",
      hover: "Core rules are documented in the whitepaper and searchable docs."
    },
    {
      label: "Economics",
      title: "Published Monetary Model",
      copy: "Rewards follow the 8/4/2/1 ATHO bootstrap schedule and 0.50 ATHO tail reward.",
      hover: "The 500-year model explains issuance, minimum fees, optional tips, and the no-fee-burn policy."
    },
    {
      label: "Reference",
      title: "Whitepaper and Supply PDF",
      copy: "The whitepaper and 500-year monetary model are available as focused downloads.",
      hover: "These documents give readers the technical design, reward schedule, fee model, and long-range supply path."
    },
    {
      label: "Network",
      title: "Explorer and Docs",
      copy: "The website links directly to live testnet explorer data and searchable operator docs.",
      hover: "Explorer reads the public API; docs cover wallets, nodes, mining, API, and deployment controls."
    },
    {
      label: "Operations",
      title: "Mainnet Controls",
      copy: "Mainnet operation uses isolated network identity, signed release artifacts, and conservative deployment checks.",
      hover: "Real-value operation should follow release verification, backups, monitoring, and deployment docs."
    }
  ],
  communityActions: [
    {
      label: "Read the Docs",
      href: "./docs.html",
      variant: "primary",
      external: false
    },
    {
      label: "Open Explorer",
      href: "./explore/",
      variant: "secondary",
      external: false
    },
    {
      label: "Join Testnet",
      href: "./join.html",
      variant: "secondary",
      external: false
    }
  ],
  footerColumns: [
    {
      title: "Docs",
      links: [
        { label: "Overview", href: "./docs.html#overview", badge: "Live" },
        { label: "Falcon-512", href: "./docs.html#falcon-512-and-quantum-security" },
        { label: "Wallets", href: "./docs.html#wallets" },
        { label: "Mining", href: "./docs.html#mining" },
        { label: "Monetary Policy", href: "./docs.html#monetary-policy" },
        { label: "Developer Reference", href: "./docs.html#developer-reference" }
      ]
    },
    {
      title: "Network",
      links: [
        { label: "Join Testnet", href: "./join.html", badge: "Live" },
        { label: "Explorer", href: "./explore/", badge: "Live" },
        { label: "Testnet Funds", href: "./docs.html#getting-testnet-atho" },
        { label: "Nodes", href: "./docs.html#nodes" },
        { label: "Status", href: "./roadmap.html" }
      ]
    },
    {
      title: "Atho",
      links: [
        { label: "Home", href: "./index.html" },
        { label: "Whitepaper", href: "./assets/files/atho-whitepaper.pdf" },
        { label: "Monetary Supply Model", href: "./assets/files/atho-monetary-supply-model-500-years.pdf" },
        { label: "Contact", href: "./contact.html" },
        { label: "Security", href: "./docs.html#security" }
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
