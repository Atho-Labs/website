export const siteContent = {
  heroSignals: [
    "UTXO Payments",
    "Post-Quantum Signatures",
    "Low Atom-Based Fees",
    "Permanent Tail Reward"
  ],
  protocolHighlights: [
    {
      number: "01",
      title: "Simple UTXO Payments",
      copy: "Atho keeps value movement explicit with public UTXOs, deterministic validation, and backend-owned chain truth.",
      hover: "UTXO accounting keeps ownership, confirmations, and spending rules easier for users, wallets, miners, and node operators to audit."
    },
    {
      number: "02",
      title: "Low Atom-Based Fees",
      copy: "Normal transactions use exact atom accounting, a 500-atom minimum fee, and 1 atom per vbyte fee rate.",
      hover: "Atho combines low fees with wallet transaction PoW so spam is not free while users are not pushed into high fee pressure."
    },
    {
      number: "03",
      title: "Long-Term Miner Security",
      copy: "Permanent 0.78125 ATHO tail rewards keep a predictable proof-of-work security budget.",
      hover: "Atho has no fixed max supply cap. Tail emission naturally declines as a percentage of supply while keeping miners incentivized."
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
      value: "SHA3-256 send proof",
      copy: "Wallets sign first, then generate a lightweight anti-spam proof.",
      hover: "Transaction PoW is not mining. It is a cheap-to-verify proof that helps keep fees low without making spam free."
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
      copy: "No faucet, no automatic storage reset, strict replay protection."
    },
    {
      name: "Testnet",
      detail: "atho-testnet",
      value: "<span class=\"stack-line\">P2P 9100</span><span class=\"stack-line\">RPC 9110</span>",
      copy: "Manual testnet funds, development resets, testnet-only recovery features."
    },
    {
      name: "Regnet",
      detail: "atho-regnet",
      value: "<span class=\"stack-line\">P2P 9200</span><span class=\"stack-line\">RPC 9210</span>",
      copy: "Local testing network for disposable development workflows."
    }
  ],
  stats: [
    {
      key: "blockTime",
      label: "Block Time",
      value: "75 SEC",
      detail: "Target spacing.",
      hover: "Atho targets 75 second proof-of-work blocks.",
      badge: "Published"
    },
    {
      key: "baseReward",
      label: "Starting Reward",
      value: "6.25 ATHO",
      detail: "Initial subsidy.",
      hover: "The reward halves every 1,680,000 blocks until the permanent tail reward.",
      badge: "Published"
    },
    {
      key: "tailReward",
      label: "Tail Reward",
      value: "0.78125 ATHO",
      detail: "Permanent per block.",
      hover: "Tail emission provides long-term miner incentives while keeping fees low.",
      badge: "Published"
    },
    {
      key: "atoms",
      label: "Atomic Precision",
      value: "1T atoms",
      detail: "1 ATHO.",
      hover: "Atho is scarce at the coin level and highly divisible at the atom level.",
      badge: "Published"
    },
    {
      key: "minFee",
      label: "Minimum Fee",
      value: "500 atoms",
      detail: "Plus 1 atom/vbyte.",
      hover: "Required fee is max(500 atoms, tx_vbytes * 1 atom).",
      badge: "Published"
    },
    {
      key: "minOutput",
      label: "Minimum Output",
      value: "1,000 atoms",
      detail: "1 nATHO.",
      hover: "Normal outputs below 1,000 atoms are rejected by standard policy.",
      badge: "Published"
    }
  ],
  coreFeatures: [
    {
      icon: "shield",
      title: "Falcon-512 Signatures",
      copy: "Post-quantum transaction signatures secure wallet spends.",
      hover: "Atho uses post-quantum-focused transaction signing rather than classical elliptic-curve signatures."
    },
    {
      icon: "hash",
      title: "SHA3 Transaction PoW",
      copy: "Wallets generate a lightweight send proof before broadcast.",
      hover: "Nodes can verify transaction PoW cheaply before expensive signature checks when possible."
    },
    {
      icon: "grid",
      title: "Public UTXO Model",
      copy: "Outputs remain the public accounting layer.",
      hover: "Spendability, maturity, and balance all resolve through the same UTXO truth model."
    },
    {
      icon: "layers",
      title: "Network Isolation",
      copy: "Addresses, signatures, transaction PoW, peers, storage, and blocks are network-scoped.",
      hover: "Testnet transactions cannot be replayed on mainnet, and mainnet coins cannot be spent on testnet."
    },
    {
      icon: "pickaxe",
      title: "Proof-of-Work Mining",
      copy: "Blocks stay independently verifiable on every node.",
      hover: "Coinbase transactions pay the current subsidy plus valid transaction fees and must not overpay."
    },
    {
      icon: "wallet",
      title: "Multiple HD Wallets",
      copy: "Wallet names, 12/24/48 word phrases, wallet switching, and per-wallet address books.",
      hover: "Each wallet keeps separate addresses, UTXOs, history, address book entries, and derivation state."
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
          hover: "The client has no software faucet. Testnet ATHO is distributed manually by the Atho founders or development team.",
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
          icon: "package",
          title: "Whitepaper",
          status: "Published",
          copy: "Downloadable PDF whitepaper generated from the current source document.",
          hover: "The website docs do not depend on the PDF, but the PDF is available as a formal reference.",
          actionLabel: "Download PDF",
          actionHref: "./assets/files/atho-whitepaper.pdf"
        }
      ]
    }
  ],
  economics: [
    {
      label: "Atomic Precision",
      value: "1 ATHO = 1T atoms",
      badge: "Published",
      note: "12 decimal places.",
      hover: "Atho supports small payments and low fees with one trillion atoms per ATHO."
    },
    {
      label: "Starting Reward",
      value: "6.25 ATHO",
      badge: "Published",
      note: "First reward era.",
      hover: "The first era issues 10,500,000 ATHO across 1,680,000 blocks."
    },
    {
      label: "Tail Reward",
      value: "0.78125 ATHO",
      badge: "Published",
      note: "Permanent miner budget.",
      hover: "Tail emission starts around block 5,040,000 and continues forever."
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
      value: "max(500, vB)",
      badge: "Published",
      note: "Atoms, no floats.",
      hover: "A 650 vB transaction requires 650 atoms; a 250 vB transaction requires 500 atoms."
    },
    {
      label: "Spam Deterrent",
      value: "Wallet Transaction PoW",
      badge: "Published",
      note: "SHA3-256 send proof.",
      hover: "Transaction PoW helps keep fees low without leaving the mempool open to free spam."
    }
  ],
  developerPoints: [
    "Core, node, wallet, GUI, RPC, P2P, storage, and installer layers stay clearly separated.",
    "Normal sends use exact atom parsing, Falcon signatures, wallet transaction PoW, mempool validation, and mining.",
    "The GUI stays thin so backend truth stays canonical."
  ],
  developerCommands: [
    {
      kind: "comment",
      text: "Run the local testnet client"
    },
    {
      kind: "command",
      prompt: "$",
      text: "python runtestnet.py"
    },
    {
      kind: "command",
      prompt: "$",
      text: "cargo build --release -p atho-node -p atho-qt"
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
      label: "Now",
      title: "Docs Are HTML",
      copy: "The website now includes a full documentation page with sidebar navigation and search.",
      hover: "The docs are readable in-browser and do not require the PDF."
    },
    {
      label: "Now",
      title: "Manual Testnet Funds",
      copy: "Testnet ATHO is distributed manually by the founders or development team.",
      hover: "The client and website do not advertise a software faucet."
    },
    {
      label: "Now",
      title: "Tail Emission Policy",
      copy: "Atho has no fixed max supply cap and uses a permanent miner tail reward.",
      hover: "This replaces the old fixed-cap language on the website."
    },
    {
      label: "Next",
      title: "Operator Hardening",
      copy: "Broader node, peer, storage, and wallet docs should keep tracking active software changes.",
      hover: "Docs should be updated whenever consensus, wallet, or deployment behavior changes."
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
      label: "Join Testnet",
      href: "./join.html",
      variant: "secondary",
      external: false
    },
    {
      label: "Download Whitepaper",
      href: "./assets/files/atho-whitepaper.pdf",
      variant: "tertiary",
      external: false
    },
    {
      label: "Join Discord",
      href: "https://discord.gg/W5fV4aGcUR",
      variant: "secondary",
      external: true
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
        { label: "Developer Reference", href: "./docs.html#developer-reference" }
      ]
    },
    {
      title: "Network",
      links: [
        { label: "Join Testnet", href: "./join.html", badge: "Live" },
        { label: "Testnet Funds", href: "./docs.html#getting-testnet-atho-manually" },
        { label: "Nodes", href: "./docs.html#nodes" },
        { label: "Status", href: "./roadmap.html" }
      ]
    },
    {
      title: "Atho",
      links: [
        { label: "Home", href: "./index.html" },
        { label: "Whitepaper", href: "./assets/files/atho-whitepaper.pdf" },
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
