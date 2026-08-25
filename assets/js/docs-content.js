export const docsSectionOrder = [
  "overview",
  "protocol",
  "cryptography",
  "monetary-policy",
  "transactions-fees",
  "wallets",
  "headless-binaries",
  "nodes-mining",
  "encrypted-p2p",
  "rpc-api",
  "network-status",
  "storage-sync",
  "security",
  "operations",
  "developer-reference",
  "faq"
];

export const docsNavGroups = [
  {
    title: "Start Here",
    ids: ["overview", "protocol", "cryptography", "monetary-policy", "transactions-fees"]
  },
  {
    title: "Wallets and Tools",
    ids: ["wallets", "headless-binaries"]
  },
  {
    title: "Nodes and Network",
    ids: ["nodes-mining", "encrypted-p2p", "rpc-api", "network-status", "storage-sync"]
  },
  {
    title: "Build and Review",
    ids: ["security", "operations", "developer-reference", "faq"]
  }
];

export const docsSections = {
  overview: {
    title: "Overview",
    eyebrow: "Atho Docs",
    summary: "Current, source-grounded documentation for the Atho pre-mainnet reference implementation.",
    keywords: ["overview", "start", "status", "whitepaper", "documentation"],
    topics: [
      { id: "overview", title: "Documentation Overview" },
      { id: "current-state", title: "Current Project State", aliases: ["testnet-status"] },
      { id: "current-whitepaper", title: "Current Whitepaper", aliases: ["overview-downloads", "downloads"] }
    ],
    related: [
      { label: "Protocol", href: "#protocol" },
      { label: "Encrypted P2P", href: "#encrypted-p2p" },
      { label: "Headless Binaries", href: "#headless-binaries" },
      { label: "Network Status", href: "#network-status" }
    ],
    content: `
      <section class="docs-section docs-callout" id="current-state">
        <span class="docs-callout-label">Current state</span>
        <h2>Pre-mainnet development is active.</h2>
        <p>Mainnet has not launched. The previous public testnet completed its test cycle and is now offline while updated chain rules are prepared. Its bootstrap nodes, explorer endpoint, and old block data should not be treated as current infrastructure.</p>
        <p>Use <strong>regnet</strong> for local development until a new public testnet is announced.</p>
      </section>
      <section class="docs-section" id="overview-routing">
        <h2>Choose a Path</h2>
        <div class="docs-overview-grid" data-docs-overview-grid></div>
      </section>
      <section class="docs-section" id="source-of-truth">
        <h2>Source of Truth</h2>
        <p>These pages summarize the current repository, but consensus code remains authoritative. Monetary values, network identities, validation rules, and transport behavior should be checked against the matching release before real-value use.</p>
        <ul>
          <li>Current software status: pre-mainnet alpha.</li>
          <li>Current public network status: no public Atho network is presented as live.</li>
          <li>Current implemented ledger: transparent public UTXOs.</li>
          <li>Research-only private transaction and channel designs are not described here as shipped functionality.</li>
        </ul>
      </section>
      <section class="docs-section" id="current-whitepaper">
        <h2>Current Whitepaper</h2>
        <p>The August 23, 2026 technical whitepaper is the sole current protocol PDF published on this website. It contains 80 pages covering architecture, consensus, networking, wallet behavior, operations, and limitations.</p>
        <p><a class="docs-inline-action" href="./assets/files/atho-whitepaper.pdf">Download the Atho Whitepaper</a></p>
      </section>
    `
  },

  protocol: {
    title: "Protocol",
    eyebrow: "Core Rules",
    summary: "Atho is a payment-focused proof-of-work Layer 1 with public UTXOs, exact atom accounting, and deterministic node validation.",
    keywords: ["what is atho", "protocol", "utxo", "consensus", "architecture", "design philosophy"],
    aliases: ["what-is-atho", "design-philosophy", "core-network-summary"],
    topics: [
      { id: "protocol", title: "Protocol Summary" },
      { id: "protocol-constants", title: "Core Constants" },
      { id: "responsibility-boundaries", title: "Responsibility Boundaries" },
      { id: "implemented-scope", title: "Implemented Scope" }
    ],
    related: [
      { label: "Cryptography", href: "#cryptography" },
      { label: "Transactions and Fees", href: "#transactions-fees" },
      { label: "Nodes and Mining", href: "#nodes-mining" },
      { label: "Security", href: "#security" }
    ],
    content: `
      <section class="docs-section" id="protocol-summary">
        <h2>Payment-First Layer 1</h2>
        <p>Atho focuses its base layer on ownership, payments, proof-of-work ordering, and deterministic settlement. Wallets construct and authorize transactions; miners propose blocks; full nodes independently validate every accepted state transition.</p>
        <p>The current implementation does not ship a general-purpose virtual machine, shielded transaction pool, or payment-channel system. Those ideas may exist in separate research, but they are not part of the implemented public payment chain described here.</p>
      </section>
      <section class="docs-section" id="protocol-constants">
        <h2>Core Constants</h2>
        <div class="docs-table-wrap">
          <table>
            <tbody>
              <tr><th>Ledger</th><td>Public UTXO chain</td></tr>
              <tr><th>Target block time</th><td>75 seconds</td></tr>
              <tr><th>Block proof of work</th><td>SHA3-384</td></tr>
              <tr><th>Transaction authorization</th><td>Falcon-512</td></tr>
              <tr><th>Smallest unit</th><td>1 atom; 100,000,000 atoms = 1 ATHO</td></tr>
              <tr><th>Genesis subsidy</th><td>0 ATHO at height 0</td></tr>
              <tr><th>Normal spendability</th><td>1 confirmation at consensus; official wallet default 3</td></tr>
              <tr><th>Coinbase maturity</th><td>100 blocks</td></tr>
              <tr><th>Standard block budget</th><td>Adaptive 1,000,000 to 2,000,000 vbytes</td></tr>
              <tr><th>Hard block bounds</th><td>8,000,000 weight units, 8,000,000 serialized bytes, 5,000 Falcon checks</td></tr>
              <tr><th>Standard transaction bounds</th><td>250,000 bytes/vbytes, 1,024 inputs, 64 outputs</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      <section class="docs-section" id="responsibility-boundaries">
        <h2>Responsibility Boundaries</h2>
        <div class="docs-table-wrap">
          <table>
            <thead><tr><th>Component</th><th>Owns</th><th>Does not own</th></tr></thead>
            <tbody>
              <tr><td>Wallet</td><td>Keys, derivation, local signing, coin selection, transaction PoW</td><td>Consensus truth or block acceptance</td></tr>
              <tr><td>Full node</td><td>Mempool admission, chain validation, storage, peer sync, canonical state</td><td>User recovery secrets</td></tr>
              <tr><td>Miner</td><td>Template work, nonce search, candidate block submission</td><td>A bypass around full block validation</td></tr>
              <tr><td>Desktop client</td><td>User interface over wallet and node state</td><td>A second consensus engine</td></tr>
              <tr><td>Explorer</td><td>Read-only presentation of indexed node data</td><td>Spendability or chain authority</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      <section class="docs-section" id="implemented-scope">
        <h2>Implemented Scope</h2>
        <ul>
          <li>Four isolated network modes: mainnet, testnet, regnet, and prunetest.</li>
          <li>Headers-first sync, compact-block relay, reorg handling, pruning, and archive operation.</li>
          <li>Desktop and headless wallet workflows, local message signing, mining, RPC, and HTTP reads.</li>
          <li>Mandatory authenticated encrypted P2P transport on public network modes.</li>
          <li>Public transaction amounts and a visible UTXO graph; P2P encryption does not turn the ledger private.</li>
        </ul>
      </section>
    `
  },

  cryptography: {
    title: "Cryptography",
    eyebrow: "Core Rules",
    summary: "Falcon-512 authorizes transactions, SHA3 hashes consensus data, and a hybrid key exchange protects direct P2P sessions.",
    keywords: ["falcon", "sha3", "post quantum", "ml-kem", "x25519", "chacha20"],
    aliases: ["falcon-512-and-quantum-security", "falcon-512", "quantum-security"],
    topics: [
      { id: "cryptography", title: "Cryptographic Roles" },
      { id: "falcon-512", title: "Falcon-512 Authorization" },
      { id: "quantum-scope", title: "Post-Quantum Scope" }
    ],
    related: [
      { label: "Encrypted P2P", href: "#encrypted-p2p" },
      { label: "Wallets", href: "#wallets" },
      { label: "Security", href: "#security" }
    ],
    content: `
      <section class="docs-section" id="cryptographic-roles">
        <h2>Different Jobs, Different Primitives</h2>
        <div class="docs-table-wrap">
          <table>
            <thead><tr><th>Role</th><th>Current primitive</th></tr></thead>
            <tbody>
              <tr><td>Transaction and message authorization</td><td>Falcon-512</td></tr>
              <tr><td>Block proof of work and block identifiers</td><td>SHA3-384</td></tr>
              <tr><td>Wallet transaction anti-spam work</td><td>SHA3-256</td></tr>
              <tr><td>P2P hybrid key establishment</td><td>Ephemeral X25519 + ML-KEM-768</td></tr>
              <tr><td>P2P key derivation</td><td>HKDF-SHA3-256</td></tr>
              <tr><td>P2P record protection</td><td>ChaCha20-Poly1305</td></tr>
              <tr><td>Encrypted wallet datafile</td><td>PBKDF2-HMAC-SHA256 + AES-256-GCM</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      <section class="docs-section" id="falcon-512">
        <h2>Falcon-512 Authorization</h2>
        <p>Falcon-512 signatures prove control of spend keys and local address-ownership messages. Wallet and transaction keys are separate from the automatic Falcon node identity used to authenticate a P2P connection.</p>
        <p>The current consensus profile uses 897-byte public keys and 666-byte signatures. Larger artifacts increase bandwidth and storage cost relative to compact classical signatures, so Atho also enforces byte, weight, and signature-check budgets.</p>
      </section>
      <section class="docs-section" id="quantum-scope">
        <h2>Post-Quantum Scope</h2>
        <p>"Post-quantum-aware" is a deliberately bounded claim. Falcon-512 and ML-KEM-768 reduce dependence on classical-only public-key assumptions in their assigned roles. X25519 remains in the P2P handshake as a hybrid component, and no software can guarantee that every dependency, endpoint, password, operating system, or future cryptanalytic result is secure.</p>
        <p>Atho does not claim that encrypted P2P makes public transactions private or that implementation choices replace independent cryptographic review.</p>
      </section>
    `
  },

  "monetary-policy": {
    title: "Monetary Policy",
    eyebrow: "Core Rules",
    summary: "Six fixed bootstrap eras lead into a permanent 0.125 ATHO tail reward, with no premine and no fixed maximum supply.",
    keywords: ["reward", "supply", "tail", "halving", "issuance", "26.46 million"],
    topics: [
      { id: "monetary-policy", title: "Emission Schedule" },
      { id: "tail-emission", title: "Tail Emission" },
      { id: "supply-cap", title: "Supply Model" }
    ],
    related: [
      { label: "Protocol", href: "#protocol" },
      { label: "Transactions and Fees", href: "#transactions-fees" },
      { label: "Whitepaper", href: "#current-whitepaper" }
    ],
    content: `
      <section class="docs-section" id="emission-schedule">
        <h2>Current Emission Schedule</h2>
        <p>Height 0 is a zero-emission genesis identity anchor. Each bootstrap era contains 1,680,000 reward-bearing blocks.</p>
        <div class="docs-table-wrap">
          <table>
            <thead><tr><th>Heights</th><th>Reward</th><th>Era issuance</th><th>Cumulative</th></tr></thead>
            <tbody>
              <tr><td>1-1,680,000</td><td>8 ATHO</td><td>13,440,000</td><td>13,440,000</td></tr>
              <tr><td>1,680,001-3,360,000</td><td>4 ATHO</td><td>6,720,000</td><td>20,160,000</td></tr>
              <tr><td>3,360,001-5,040,000</td><td>2 ATHO</td><td>3,360,000</td><td>23,520,000</td></tr>
              <tr><td>5,040,001-6,720,000</td><td>1 ATHO</td><td>1,680,000</td><td>25,200,000</td></tr>
              <tr><td>6,720,001-8,400,000</td><td>0.50 ATHO</td><td>840,000</td><td>26,040,000</td></tr>
              <tr><td>8,400,001-10,080,000</td><td>0.25 ATHO</td><td>420,000</td><td>26,460,000</td></tr>
              <tr><td>10,080,001 onward</td><td>0.125 ATHO</td><td>52,560/year at target cadence</td><td>Continues</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      <section class="docs-section" id="tail-emission">
        <h2>Permanent Tail Reward</h2>
        <p>At the 75-second target, Atho projects 420,480 blocks per nominal year. A 0.125 ATHO tail therefore projects 52,560 ATHO of annual base issuance. Actual calendar issuance follows blocks produced, not a wall-clock minting process.</p>
      </section>
      <section class="docs-section" id="supply-cap">
        <h2>No Premine, No Fixed Cap</h2>
        <p>The current rules schedule 26,460,000 ATHO through the final bootstrap block and then continue the tail reward. There is no premine and no fixed maximum supply. The tail is intended to preserve a base miner security budget while its percentage inflation declines as total issuance grows.</p>
      </section>
    `
  },

  "transactions-fees": {
    title: "Transactions and Fees",
    eyebrow: "Payments",
    summary: "Atho transactions spend public UTXOs, use exact atom values, pay a deterministic fee floor, and include wallet transaction PoW.",
    keywords: ["transactions", "fees", "atoms", "utxo", "tx pow", "mempool", "dust"],
    aliases: ["units-and-fees", "transactions", "wallet-transaction-pow", "mempool", "utxo-model"],
    topics: [
      { id: "transactions-fees", title: "Transaction Lifecycle" },
      { id: "fee-rules", title: "Fee Rules" },
      { id: "transaction-pow", title: "Wallet Transaction PoW" },
      { id: "confirmation-policy", title: "Confirmation Policy" }
    ],
    related: [
      { label: "Wallets", href: "#wallets" },
      { label: "Monetary Policy", href: "#monetary-policy" },
      { label: "Nodes and Mining", href: "#nodes-mining" }
    ],
    content: `
      <section class="docs-section" id="transaction-lifecycle">
        <h2>Transaction Lifecycle</h2>
        <pre><code>wallet selects mature UTXOs
  -&gt; builds outputs and change
  -&gt; signs the network-bound transaction with Falcon-512
  -&gt; solves required SHA3-256 transaction PoW
  -&gt; submits through local RPC/API
  -&gt; node performs mempool validation
  -&gt; peers relay inside encrypted P2P sessions
  -&gt; miner includes the transaction
  -&gt; every node validates the containing block</code></pre>
        <p>Multi-recipient sends, custom or rotated change, coin control, optional tips, and dry-run workflows are available through the wallet stack.</p>
      </section>
      <section class="docs-section" id="fee-rules">
        <h2>Fee and Output Rules</h2>
        <ul>
          <li>Required fee: <code>max(600 atoms, 1 atom per serialized byte)</code>.</li>
          <li>Optional miner tips may be added above the required floor.</li>
          <li>Standard output minimum: 100 atoms.</li>
          <li>Consensus amounts are integer atoms; clients must not use floating-point values for acceptance logic.</li>
          <li>Fees are paid to the miner and are not burned by the current rules.</li>
        </ul>
      </section>
      <section class="docs-section" id="transaction-pow">
        <h2>Wallet Transaction PoW</h2>
        <p>Every normal transaction declares and satisfies a deterministic SHA3-256 anti-spam target between 10 and 16 bits. Difficulty grows with transaction size, input count, and output count. This sender-side work is generated after signing and is separate from SHA3-384 block mining.</p>
      </section>
      <section class="docs-section" id="confirmation-policy">
        <h2>Confirmation Policy</h2>
        <p>Consensus permits a normal UTXO to become spendable after one confirmation. The official wallet defaults to three confirmations; higher-value workflows can choose a stricter policy. Coinbase outputs require 100 blocks before spending.</p>
      </section>
    `
  },

  wallets: {
    title: "Wallets",
    eyebrow: "Wallets and Tools",
    summary: "Desktop and headless wallets derive addresses, protect local secrets, build transactions, sign messages, and query node-owned chain state.",
    keywords: ["wallet", "encryption", "aes", "pbkdf2", "mnemonic", "coin control", "message signing"],
    aliases: ["message-signing"],
    topics: [
      { id: "wallets", title: "Wallet Model" },
      { id: "wallet-encryption", title: "Wallet Encryption at Rest" },
      { id: "wallet-backups", title: "Recovery and Backups" },
      { id: "wallet-privacy", title: "Wallet Privacy Limits" }
    ],
    related: [
      { label: "Headless Binaries", href: "#headless-binaries" },
      { label: "Transactions and Fees", href: "#transactions-fees" },
      { label: "Security", href: "#security" }
    ],
    content: `
      <section class="docs-section" id="wallet-model">
        <h2>Wallet Model</h2>
        <p>Atho supports 12-, 24-, and 48-word recovery phrases, HD receive and change paths, multiple named wallets, wallet-specific address books, coin control, multi-recipient sends, and local message signing. The wallet owns keys; it asks the node for validated UTXOs and activity instead of treating local UI state as chain truth.</p>
      </section>
      <section class="docs-section" id="wallet-encryption">
        <h2>Wallet Encryption at Rest</h2>
        <div class="docs-table-wrap">
          <table>
            <tbody>
              <tr><th>Cipher</th><td>AES-256-GCM authenticated encryption</td></tr>
              <tr><th>Password derivation</th><td>PBKDF2-HMAC-SHA256, 600,000 iterations</td></tr>
              <tr><th>Per-file randomness</th><td>16-byte salt and 12-byte nonce</td></tr>
              <tr><th>Write behavior</th><td>Temporary file, sync, atomic rename, directory sync</td></tr>
              <tr><th>Unix permissions</th><td>Owner-only mode 0600</td></tr>
            </tbody>
          </table>
        </div>
        <p>The current desktop create/import flow requires a non-empty wallet password. The headless CLI also requires a password unless an operator explicitly requests plaintext with <code>--allow-plaintext</code>. That escape hatch should be reserved for controlled disposable workflows.</p>
        <p>Encryption protects a stolen file against offline reading only to the strength of the password and implementation. It cannot protect an unlocked wallet on a compromised running computer, screen capture, keylogging, memory extraction, or a stolen recovery phrase.</p>
      </section>
      <section class="docs-section" id="wallet-backups">
        <h2>Recovery and Backups</h2>
        <ul>
          <li>Record the recovery phrase offline and verify it before funding a wallet.</li>
          <li>Use a strong unique wallet password; it is not a replacement for the recovery phrase.</li>
          <li>Keep encrypted backups on more than one device or medium.</li>
          <li>Never place phrases, passwords, or decrypted wallet files in source control, chat, screenshots, shell history, or cloud notes.</li>
        </ul>
      </section>
      <section class="docs-section" id="wallet-privacy">
        <h2>Wallet Privacy Limits</h2>
        <p>Receive/change rotation and coin control can reduce avoidable address reuse, but Atho currently settles on a transparent ledger. Amounts, output relationships, and confirmed transaction history remain public. P2P transport encryption hides wire content from passive observers; it does not hide the final chain graph.</p>
      </section>
    `
  },

  "headless-binaries": {
    title: "Headless Binaries",
    eyebrow: "Wallets and Tools",
    summary: "Five focused binaries cover full-node, RPC, mining, wallet, and address workflows without launching the desktop client.",
    keywords: ["headless", "binaries", "athod", "atho-cli", "atho-mine", "atho-wallet", "atho-address"],
    aliases: ["headless-wallet-and-cli", "command-catalog", "setup", "setup-launchers"],
    topics: [
      { id: "headless-binaries", title: "Binary Overview" },
      { id: "build-headless", title: "Build the Headless Stack" },
      { id: "athod", title: "athod Full Node" },
      { id: "atho-cli", title: "atho-cli RPC Client" },
      { id: "atho-mine", title: "atho-mine Miner" },
      { id: "atho-wallet", title: "atho-wallet" },
      { id: "atho-address", title: "atho-address" },
      { id: "headless-security", title: "Headless Security Boundaries" }
    ],
    related: [
      { label: "Nodes and Mining", href: "#nodes-mining" },
      { label: "RPC and API", href: "#rpc-api" },
      { label: "Operations", href: "#operations" }
    ],
    content: `
      <section class="docs-section" id="binary-overview">
        <h2>Binary Overview</h2>
        <div class="docs-table-wrap">
          <table>
            <thead><tr><th>Binary</th><th>Purpose</th><th>Typical host</th></tr></thead>
            <tbody>
              <tr><td><code>athod</code></td><td>Validation, storage, mempool, encrypted P2P, RPC, HTTP API, templates</td><td>Server or workstation</td></tr>
              <tr><td><code>atho-cli</code></td><td>Authenticated local RPC commands and formatted operator output</td><td>Same host as the node</td></tr>
              <tr><td><code>atho-mine</code></td><td>CPU/GPU template work and block submission</td><td>Miner host with protected node access</td></tr>
              <tr><td><code>atho-wallet</code></td><td>Create, restore, inspect, query, send, and sign without a GUI</td><td>Protected wallet workstation</td></tr>
              <tr><td><code>atho-address</code></td><td>Inspect or deterministically derive Base56 addresses</td><td>Offline or controlled tooling host</td></tr>
            </tbody>
          </table>
        </div>
        <p><code>atho-qt</code> is the desktop client and <code>atho-setup</code> is the graphical installer. Development-only attack and benchmark binaries require the <code>devtools</code> feature and are not normal operator tools.</p>
      </section>
      <section class="docs-section" id="build-headless">
        <h2>Build the Headless Stack</h2>
        <pre><code>cargo build --release -p atho-node -p atho-wallet

./target/release/athod --help
./target/release/atho-cli --help
./target/release/atho-mine --help
./target/release/atho-wallet --help
./target/release/atho-address --help</code></pre>
        <p>While the public testnet is offline, use regnet for local operation:</p>
        <pre><code>./target/release/athod --network regnet
./target/release/atho-cli --network regnet getblockchaininfo</code></pre>
      </section>
      <section class="docs-section" id="athod">
        <h2>athod: Full Node Runtime</h2>
        <pre><code>./target/release/athod \
  --network regnet \
  --data-dir /srv/atho/regnet \
  --rpc-addr 127.0.0.1:9210 \
  --p2p-addr 0.0.0.0:9200</code></pre>
        <p>Operator subcommands include <code>status</code>, <code>logs</code>, <code>verify</code>, and an explicit destructive <code>wipe</code> flow. <code>--archive</code> retains full historical block data. The obsolete <code>--public-rpc</code> flag is rejected.</p>
      </section>
      <section class="docs-section" id="atho-cli">
        <h2>atho-cli: Local RPC Control</h2>
        <pre><code>./target/release/atho-cli --network regnet --cookie-auth getblockchaininfo
./target/release/atho-cli --network regnet --cookie-auth getpeerinfo --format table
./target/release/atho-cli help getblocktemplate</code></pre>
        <p>The CLI supports cookie authentication or configured HMAC RPC credentials and can format results as JSON, pretty JSON, or tables. Keep it on the same trusted host or inside an encrypted operator tunnel.</p>
      </section>
      <section class="docs-section" id="atho-mine">
        <h2>atho-mine: Dedicated Miner</h2>
        <pre><code>./target/release/atho-mine \
  --network regnet \
  --rpc-addr 127.0.0.1:9210 \
  --reward-address &lt;REGNET_BASE56_ADDRESS&gt; \
  --backend auto \
  --cores 4 \
  --loop</code></pre>
        <p>Backends are <code>cpu</code>, <code>gpu</code>, and <code>auto</code>. GPU support depends on the matching build feature and compatible hardware. Mining still submits candidate blocks through the node's full validation path.</p>
      </section>
      <section class="docs-section" id="atho-wallet">
        <h2>atho-wallet: Headless Wallet</h2>
        <pre><code>read -rsp 'Wallet password: ' ATHO_WALLET_PASSWORD
export ATHO_WALLET_PASSWORD

./target/release/atho-wallet create regnet \
  --out ./regnet-wallet.datafile \
  --words 24 \
  --wallet-password-env ATHO_WALLET_PASSWORD

./target/release/atho-wallet receive \
  --wallet ./regnet-wallet.datafile \
  --wallet-password-env ATHO_WALLET_PASSWORD

./target/release/atho-wallet balance \
  --wallet ./regnet-wallet.datafile \
  --network regnet \
  --cookie-auth \
  --wallet-password-env ATHO_WALLET_PASSWORD</code></pre>
        <p>The wallet also supports restore, inspect, address lists, UTXO lists, multi-recipient sends, message signing/verification, custom inputs, optional tips, custom change, confirmation policy, and dry-run transaction review.</p>
      </section>
      <section class="docs-section" id="atho-address">
        <h2>atho-address: Address Tooling</h2>
        <pre><code>./target/release/atho-address inspect &lt;BASE56_ADDRESS&gt;
./target/release/atho-address generate regnet \
  --phrase '&lt;MNEMONIC&gt;' \
  --count 5</code></pre>
        <p>Passing a mnemonic on the command line can expose it through process lists or shell history. Prefer a protected offline environment and clear history when sensitive material has been handled.</p>
      </section>
      <section class="docs-section" id="headless-security">
        <h2>Headless Security Boundaries</h2>
        <ul>
          <li>Bind raw RPC and the in-process HTTP API to loopback only.</li>
          <li>Use cookie auth locally; keep cookie and config files owner-only.</li>
          <li>Use SSH, WireGuard, or a same-host TLS gateway for remote administration.</li>
          <li>Run the wallet separately from public node infrastructure when operational risk justifies isolation.</li>
          <li>Use service users, explicit data directories, backups, log rotation, monitoring, and verified release hashes.</li>
        </ul>
      </section>
    `
  },

  "nodes-mining": {
    title: "Nodes and Mining",
    eyebrow: "Nodes and Network",
    summary: "athod owns validation and chain state; miners consume node templates and submit complete candidate blocks for validation.",
    keywords: ["node", "mining", "athod", "templates", "cpu", "gpu", "peers"],
    aliases: ["nodes", "mining", "mining-rpc-and-operator-endpoints", "configuration"],
    topics: [
      { id: "nodes-mining", title: "Node Responsibilities" },
      { id: "mining-flow", title: "Mining Flow" },
      { id: "node-configuration", title: "Node Configuration" }
    ],
    related: [
      { label: "Headless Binaries", href: "#headless-binaries" },
      { label: "Encrypted P2P", href: "#encrypted-p2p" },
      { label: "Storage and Sync", href: "#storage-sync" }
    ],
    content: `
      <section class="docs-section" id="node-responsibilities">
        <h2>Full Node Responsibilities</h2>
        <ul>
          <li>Decode and validate canonical transactions and blocks.</li>
          <li>Maintain UTXO, transaction, block, peer, mempool, and chain indexes.</li>
          <li>Synchronize headers first, recover compact blocks, and fall back to full blocks safely.</li>
          <li>Enforce network identity, proof of work, signatures, transaction PoW, fees, maturity, and resource limits.</li>
          <li>Expose authenticated loopback RPC and a loopback HTTP API.</li>
        </ul>
      </section>
      <section class="docs-section" id="mining-flow">
        <h2>Mining Flow</h2>
        <pre><code>miner requests template
  -&gt; node selects validated mempool entries
  -&gt; miner searches SHA3-384 proof of work
  -&gt; miner submits candidate block
  -&gt; node performs complete block validation
  -&gt; accepted block updates durable state and relays</code></pre>
        <p>Mainnet and testnet mining require an explicit same-network reward address. The coinbase claims the scheduled subsidy plus included fees and matures after 100 blocks.</p>
      </section>
      <section class="docs-section" id="node-configuration">
        <h2>Configuration Sources</h2>
        <p>Atho accepts command-line flags, environment variables, and an optional owner-only <code>atho.conf</code>. Use explicit per-network data roots and never point two incompatible rule sets at the same storage.</p>
        <p>Public P2P may bind a reachable interface. RPC and HTTP control interfaces may not.</p>
      </section>
    `
  },

  "encrypted-p2p": {
    title: "Encrypted P2P",
    eyebrow: "Nodes and Network",
    summary: "Public network modes require authenticated PQC-hybrid transport for every direct Atho peer connection.",
    keywords: ["p2p", "end to end", "encryption", "ml-kem", "x25519", "chacha", "rekey", "peerauth"],
    aliases: ["peer-network", "p2p-encryption", "network-privacy"],
    topics: [
      { id: "encrypted-p2p", title: "Encrypted Transport" },
      { id: "p2p-handshake", title: "Handshake Sequence" },
      { id: "p2p-protections", title: "Transport Protections" },
      { id: "privacy-limits", title: "What Encryption Does Not Hide" },
      { id: "ip-privacy-deployment", title: "Optional IP-Privacy Layers" },
      { id: "p2p-policy", title: "Required Encryption Policy" }
    ],
    related: [
      { label: "Cryptography", href: "#cryptography" },
      { label: "RPC and API", href: "#rpc-api" },
      { label: "Security", href: "#security" }
    ],
    content: `
      <section class="docs-section docs-callout" id="encrypted-p2p-summary">
        <span class="docs-callout-label">Implemented</span>
        <h2>Protocol messages are encrypted before exchange.</h2>
        <p>A direct Atho node-to-node connection establishes transport keys first. Version negotiation, peer authentication, inventory, transactions, blocks, headers, compact relay, and sync messages then travel as authenticated encrypted records.</p>
      </section>
      <section class="docs-section" id="p2p-handshake">
        <h2>Handshake Sequence</h2>
        <pre><code>TCP connection
  -&gt; fixed-size X25519 + ML-KEM-768 transport handshake
  -&gt; network-bound HKDF-SHA3-256 key derivation
  -&gt; ChaCha20-Poly1305 encrypted records begin
  -&gt; encrypted Falcon-512 peerauth exchange
  -&gt; encrypted version / verack
  -&gt; encrypted sync and relay traffic</code></pre>
        <p>The initial fixed-size key-establishment records are not Atho application frames. They carry ephemeral public material and randomness needed to derive the encrypted session.</p>
      </section>
      <section class="docs-section" id="p2p-protections">
        <h2>Transport Protections</h2>
        <div class="docs-table-wrap">
          <table>
            <thead><tr><th>Layer</th><th>Current behavior</th></tr></thead>
            <tbody>
              <tr><td>Hybrid agreement</td><td>X25519 and ML-KEM-768 secrets are combined in a network-bound transcript.</td></tr>
              <tr><td>Authenticated records</td><td>ChaCha20-Poly1305 detects ciphertext modification and authenticates each record.</td></tr>
              <tr><td>Directional keys</td><td>Client-to-server and server-to-client keys, nonce prefixes, and length masks are separated.</td></tr>
              <tr><td>Node identity</td><td>Falcon-512 signs the transcript, role, feature block, and node fingerprint inside the encrypted session.</td></tr>
              <tr><td>Fingerprint reduction</td><td>No plaintext Atho frame header; encrypted lengths are masked and small records receive up to 31 bytes of random padding.</td></tr>
              <tr><td>Rekeying</td><td>Each direction rekeys after 1,000,000 records or 1 GiB.</td></tr>
              <tr><td>Origin timing</td><td>Small encrypted transaction-inventory batches reduce exact first-seen timing.</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      <section class="docs-section" id="privacy-limits">
        <h2>What "End to End" Means Here</h2>
        <p>The transport is end-to-end for the <strong>two endpoints of one direct TCP peer connection</strong>. Every relay hop decrypts the message it received, validates it, and creates a separately encrypted connection to another peer. It is not origin-to-final-recipient onion encryption across the whole network.</p>
        <p>The transport hides message content from passive observers and detects tampering on that link. It does not hide:</p>
        <ul>
          <li>the IP addresses of directly connected peers;</li>
          <li>connection timing, duration, and total byte volume;</li>
          <li>data from the peer after that peer decrypts its own hop;</li>
          <li>public transaction amounts, addresses, or the confirmed UTXO graph;</li>
          <li>compromise of either endpoint, its memory, logs, or operating system.</li>
        </ul>
      </section>
      <section class="docs-section" id="ip-privacy-deployment">
        <h2>Optional IP-Privacy Layers</h2>
        <p>Atho protects P2P message content, but it does not include a built-in Tor, SOCKS, VPN, or proxy mode. Operators can add a deployment-layer boundary by running a public node on a VPS, or keeping it on a local machine and routing outbound TCP through an operator-managed VPN, TCP proxy, or properly configured Tor-compatible transparent gateway.</p>
        <p>Direct peers see the egress endpoint used for that connection. Confirm that listen, advertise, firewall, DNS, and routing settings do not reveal or bypass a protected home address. A VPS or VPN with controlled port forwarding is generally the clearest option for a publicly reachable node; transparent proxy or Tor gateway configurations require platform-specific testing before use.</p>
      </section>
      <section class="docs-section" id="p2p-policy">
        <h2>Required Encryption Policy</h2>
        <p>Mainnet, testnet, and prunetest require encrypted transport and ignore plaintext downgrade attempts. Only regnet protocol diagnostics can explicitly set <code>ATHO_P2P_TRANSPORT_ENCRYPTION=off</code>. Peers must advertise the full-block, full-witness, and <code>NODE_PQC_TRANSPORT</code> capabilities needed by the current protocol.</p>
      </section>
    `
  },

  "rpc-api": {
    title: "RPC and API",
    eyebrow: "Nodes and Network",
    summary: "RPC and HTTP are local control interfaces, not part of the encrypted P2P transport, and the runtime enforces loopback binding.",
    keywords: ["rpc", "api", "http", "tls", "loopback", "cookie", "authentication"],
    aliases: ["http-api", "api", "rpc"],
    topics: [
      { id: "rpc-api", title: "Control-Plane Boundary" },
      { id: "rpc-security", title: "RPC Security" },
      { id: "http-api", title: "HTTP API" },
      { id: "remote-operations", title: "Remote Operations" }
    ],
    related: [
      { label: "Headless Binaries", href: "#headless-binaries" },
      { label: "Encrypted P2P", href: "#encrypted-p2p" },
      { label: "Security", href: "#security" }
    ],
    content: `
      <section class="docs-section docs-callout" id="control-plane-boundary">
        <span class="docs-callout-label">Important boundary</span>
        <h2>P2P is encrypted; raw RPC and HTTP are not.</h2>
        <p>The runtime therefore refuses non-loopback RPC and in-process HTTP API binds. Password or cookie authentication controls who may issue RPC commands, but authentication by itself does not encrypt network traffic.</p>
      </section>
      <section class="docs-section" id="rpc-security">
        <h2>RPC Security</h2>
        <ul>
          <li>Default address: <code>127.0.0.1</code> with a network-specific RPC port.</li>
          <li>Cookie authentication or configured HMAC credentials protect local requests.</li>
          <li><code>--public-rpc</code> is no longer supported and is rejected.</li>
          <li>Wallet, admin, mining, and node commands must remain inside a trusted operator boundary.</li>
        </ul>
      </section>
      <section class="docs-section" id="http-api">
        <h2>HTTP API</h2>
        <p>The HTTP API defaults to <code>127.0.0.1:8080</code>. Read endpoints cover health, chain status, explorer indexes, mempool, fees, supply, peers, mining status, and metrics. Write routes are feature-gated, but the server remains loopback-only regardless of route selection.</p>
      </section>
      <section class="docs-section" id="remote-operations">
        <h2>Remote Operations</h2>
        <p>Use an encrypted boundary such as SSH port forwarding, WireGuard, or a same-host TLS reverse proxy that forwards only to loopback. Apply least privilege, rate limits, origin controls, and route restrictions at that boundary. Never expose raw Atho RPC directly to the public internet.</p>
      </section>
    `
  },

  "network-status": {
    title: "Network Status",
    eyebrow: "Nodes and Network",
    summary: "All four network modes exist in code, but mainnet is unlaunched and the previous public testnet is retired.",
    keywords: ["network", "status", "mainnet", "testnet", "regnet", "prunetest", "ports"],
    aliases: ["mainnet-vs-testnet", "testnet", "getting-testnet-atho", "network-modes"],
    topics: [
      { id: "network-status", title: "Current Network Status" },
      { id: "network-modes", title: "Network Modes" },
      { id: "testnet-retirement", title: "Retired Testnet" }
    ],
    related: [
      { label: "Storage and Sync", href: "#storage-sync" },
      { label: "Operations", href: "#operations" },
      { label: "Explorer Status", href: "./explore/" }
    ],
    content: `
      <section class="docs-section" id="current-network-status">
        <h2>Current Status</h2>
        <div class="docs-table-wrap">
          <table>
            <thead><tr><th>Mode</th><th>P2P / RPC</th><th>Current public status</th></tr></thead>
            <tbody>
              <tr><td>Mainnet</td><td>56000 / 9010</td><td>Implemented mode; not publicly launched</td></tr>
              <tr><td>Testnet</td><td>9100 / 9110</td><td>Previous public cycle retired; no public endpoint advertised</td></tr>
              <tr><td>Regnet</td><td>9200 / 9210</td><td>Available for local deterministic development</td></tr>
              <tr><td>Prunetest</td><td>9300 / 9310</td><td>Available for isolated storage/pruning tests</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      <section class="docs-section" id="network-modes">
        <h2>Isolation</h2>
        <p>Each mode has a distinct consensus ID, visible address prefix, P2P magic, genesis anchor, default ports, and storage root. Transactions and signatures bind to network identity so artifacts cannot be replayed as valid payments on another mode.</p>
      </section>
      <section class="docs-section" id="testnet-retirement">
        <h2>Retired Testnet Data</h2>
        <p>The former testnet bootstrap nodes and explorer API are offline. Because chain rules have changed, old testnet block data should be removed before joining a future incompatible testnet. Wait for an official network announcement, genesis/ruleset identity, release hash, and bootstrap configuration before reconnecting public infrastructure.</p>
      </section>
    `
  },

  "storage-sync": {
    title: "Storage and Sync",
    eyebrow: "Nodes and Network",
    summary: "Nodes validate before committing, isolate every network's data, and support pruned or archive operation.",
    keywords: ["storage", "sync", "lmdb", "pruning", "archive", "reorg", "data directory"],
    aliases: ["storage-and-sync"],
    topics: [
      { id: "storage-sync", title: "Storage Model" },
      { id: "sync-path", title: "Sync Path" },
      { id: "data-safety", title: "Data Safety" }
    ],
    related: [
      { label: "Nodes and Mining", href: "#nodes-mining" },
      { label: "Network Status", href: "#network-status" },
      { label: "Operations", href: "#operations" }
    ],
    content: `
      <section class="docs-section" id="storage-model">
        <h2>Storage Model</h2>
        <p>Atho combines flat block archives with LMDB-backed indexed state for UTXOs, headers, blocks, transactions, peers, mempool data, and metadata. Archive mode retains full history; pruned operation can discard old block bodies while preserving current validated state and retained recent history.</p>
      </section>
      <section class="docs-section" id="sync-path">
        <h2>Validation-First Sync</h2>
        <p>Nodes synchronize contextual headers, request compact or full blocks, validate consensus and UTXO effects, and only then commit durable state. Peer messages are inputs to local validation, never authority by themselves.</p>
      </section>
      <section class="docs-section" id="data-safety">
        <h2>Data Safety</h2>
        <ul>
          <li>Use a different data root for every network and incompatible ruleset.</li>
          <li>Back up wallet files independently from replaceable chain data.</li>
          <li>Use <code>athod verify</code> and clean shutdowns before assuming local state is healthy.</li>
          <li>Use the explicit <code>athod wipe</code> flow only after checking network and data-directory targets.</li>
          <li>Do not reuse the retired testnet database for a future network with new chain rules.</li>
        </ul>
      </section>
    `
  },

  security: {
    title: "Security",
    eyebrow: "Build and Review",
    summary: "Atho layers strict validation, encrypted P2P, wallet datafile protection, network isolation, and conservative control-plane defaults without claiming perfect security.",
    keywords: ["security", "audit", "privacy", "replay", "threat model", "wallet theft"],
    aliases: ["replay-protection"],
    topics: [
      { id: "security", title: "Security Model" },
      { id: "replay-protection", title: "Replay Protection" },
      { id: "security-assurance", title: "Assurance Status" },
      { id: "responsible-disclosure", title: "Responsible Disclosure" }
    ],
    related: [
      { label: "Encrypted P2P", href: "#encrypted-p2p" },
      { label: "Wallets", href: "#wallets" },
      { label: "Operations", href: "#operations" }
    ],
    content: `
      <section class="docs-section" id="security-model">
        <h2>Layered Security Model</h2>
        <ul>
          <li>Canonical parsing and fail-closed transaction/block validation.</li>
          <li>Falcon-512 authorization bound to transaction and network context.</li>
          <li>SHA3-384 proof of work with contextual target and timestamp rules.</li>
          <li>Mandatory encrypted authenticated P2P on public network modes.</li>
          <li>Loopback-only RPC and HTTP control interfaces.</li>
          <li>Authenticated AES-256-GCM wallet files, password stretching, atomic writes, and owner-only permissions.</li>
          <li>Resource budgets for peers, messages, blocks, transactions, and expensive validation work.</li>
        </ul>
      </section>
      <section class="docs-section" id="replay-protection">
        <h2>Replay Protection</h2>
        <p>Network IDs, genesis anchors, domain tags, address prefixes, P2P magic, signatures, transaction PoW, blocks, storage, and peer handshakes are network-scoped. A valid test artifact is not automatically valid on mainnet or another mode.</p>
      </section>
      <section class="docs-section" id="security-assurance">
        <h2>Assurance Status</h2>
        <p>Passing local tests, internal audits, fuzz targets, and a stable testnet run are useful evidence, but they are not the same as completed independent security assurance. Atho is pre-production software. Mainnet readiness should require reproducible releases, independent cryptographic and consensus review, hostile-network testing, incident procedures, and remediation of material findings.</p>
      </section>
      <section class="docs-section" id="responsible-disclosure">
        <h2>Responsible Disclosure</h2>
        <p>Do not post live exploit details or private keys in public channels. Send a concise report with affected version, reproduction steps, impact, and logs to <a href="mailto:genull@proton.me">genull@proton.me</a>.</p>
      </section>
    `
  },

  operations: {
    title: "Operations",
    eyebrow: "Build and Review",
    summary: "Build reproducibly, run locally on regnet, protect control interfaces, and treat mainnet launch as a gated release process.",
    keywords: ["build", "operations", "production", "release", "checksums", "deployment", "regnet"],
    aliases: ["production-deployment", "release-verification", "troubleshooting"],
    topics: [
      { id: "operations", title: "Local Build" },
      { id: "verification", title: "Verification" },
      { id: "launch-gates", title: "Launch Gates" }
    ],
    related: [
      { label: "Headless Binaries", href: "#headless-binaries" },
      { label: "Security", href: "#security" },
      { label: "Network Status", href: "#network-status" }
    ],
    content: `
      <section class="docs-section" id="local-build">
        <h2>Local Build</h2>
        <pre><code>cargo build --release --workspace
cargo test --workspace --no-fail-fast
cargo fmt --all --check
cargo clippy --workspace --all-targets -- -D warnings</code></pre>
        <p>Use the exact release commit and toolchain documented for a published artifact. Build output from an arbitrary development checkout should not be presented as an official release.</p>
      </section>
      <section class="docs-section" id="verification">
        <h2>Artifact Verification</h2>
        <p>Production distributions should include deterministic checksums, a signed release manifest, source revision, build environment, supported platforms, and upgrade notes. Verify signatures and hashes before running downloaded binaries.</p>
      </section>
      <section class="docs-section" id="launch-gates">
        <h2>Mainnet Launch Gates</h2>
        <ul>
          <li>Frozen consensus and genesis parameters with published test vectors.</li>
          <li>Independent review of cryptography, consensus, wallet storage, P2P, RPC, and release tooling.</li>
          <li>Fresh hostile public testnet evidence under the final compatible rules.</li>
          <li>Independent bootstrap/DNS infrastructure, monitoring, backups, and recovery drills.</li>
          <li>Signed reproducible releases and documented upgrade/rollback procedures.</li>
          <li>No unresolved critical or high-severity findings.</li>
        </ul>
      </section>
    `
  },

  "developer-reference": {
    title: "Developer Reference",
    eyebrow: "Build and Review",
    summary: "A concise map of the Rust workspace, network identifiers, public resources, and Apache-2.0 project terms.",
    keywords: ["developer", "crates", "github", "license", "apache", "source"],
    topics: [
      { id: "developer-reference", title: "Workspace Map" },
      { id: "network-identifiers", title: "Network Identifiers" },
      { id: "project-links", title: "Project Links" },
      { id: "license", title: "License" }
    ],
    related: [
      { label: "Protocol", href: "#protocol" },
      { label: "RPC and API", href: "#rpc-api" },
      { label: "Operations", href: "#operations" }
    ],
    content: `
      <section class="docs-section" id="workspace-map">
        <h2>Workspace Map</h2>
        <div class="docs-table-wrap">
          <table>
            <tbody>
              <tr><th><code>atho-core</code></th><td>Canonical objects, consensus constants, addresses, hashing, signatures</td></tr>
              <tr><th><code>atho-crypto</code></th><td>Falcon-512 and hashing primitives</td></tr>
              <tr><th><code>atho-storage</code></th><td>Validated chainstate and persistent indexes</td></tr>
              <tr><th><code>atho-p2p</code></th><td>Wire protocol, encrypted transport, peers, identity, resource policy</td></tr>
              <tr><th><code>atho-rpc</code></th><td>Local command protocol and client/server types</td></tr>
              <tr><th><code>atho-node</code></th><td>Runtime composition, API, mining, synchronization, operator binaries</td></tr>
              <tr><th><code>atho-wallet</code></th><td>HD wallets, encrypted datafiles, transaction construction, wallet binaries</td></tr>
              <tr><th><code>atho-qt</code></th><td>Lightweight desktop client</td></tr>
              <tr><th><code>atho-gpu-native</code></th><td>Optional native GPU mining support</td></tr>
              <tr><th><code>atho-installer</code></th><td>Graphical installer</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      <section class="docs-section" id="network-identifiers">
        <h2>Network Identifiers</h2>
        <div class="docs-table-wrap">
          <table>
            <thead><tr><th>Network</th><th>Consensus ID</th><th>Address prefix</th><th>P2P / RPC</th></tr></thead>
            <tbody>
              <tr><td>mainnet</td><td>1</td><td>A</td><td>56000 / 9010</td></tr>
              <tr><td>testnet</td><td>2</td><td>T</td><td>9100 / 9110</td></tr>
              <tr><td>regnet</td><td>3</td><td>R</td><td>9200 / 9210</td></tr>
              <tr><td>prunetest</td><td>4</td><td>P</td><td>9300 / 9310</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      <section class="docs-section" id="project-links">
        <h2>Project Links</h2>
        <ul>
          <li><a href="https://atho.io/">atho.io</a></li>
          <li><a href="https://github.com/Atho-Labs" target="_blank" rel="noopener noreferrer">Atho Labs on GitHub</a></li>
          <li><a href="https://github.com/Atho-Labs/website" target="_blank" rel="noopener noreferrer">Website source</a></li>
          <li><a href="https://discord.gg/W5fV4aGcUR" target="_blank" rel="noopener noreferrer">Atho Discord</a></li>
          <li><a href="mailto:genull@proton.me">genull@proton.me</a></li>
        </ul>
      </section>
      <section class="docs-section" id="license">
        <h2>License</h2>
        <p>The Atho source workspace is licensed under Apache License 2.0. Review the license and each dependency's terms before redistributing binaries or derivative work. Project names and logos may have separate branding considerations from the source-code license.</p>
      </section>
    `
  },

  faq: {
    title: "FAQ",
    eyebrow: "Build and Review",
    summary: "Direct answers about launch status, encrypted traffic, wallet files, public transaction data, and research-only features.",
    keywords: ["faq", "testnet", "mainnet", "everything encrypted", "privacy", "audit", "wallet stolen"],
    topics: [
      { id: "faq", title: "Frequently Asked Questions" },
      { id: "faq-encryption", title: "Is Everything End-to-End Encrypted?" },
      { id: "faq-network", title: "Is a Public Network Live?" },
      { id: "faq-wallet", title: "Can a Stolen Wallet File Be Read?" }
    ],
    related: [
      { label: "Network Status", href: "#network-status" },
      { label: "Encrypted P2P", href: "#encrypted-p2p" },
      { label: "Wallets", href: "#wallets" },
      { label: "Security", href: "#security" }
    ],
    content: `
      <section class="docs-section" id="faq-encryption">
        <h2>Is Everything End-to-End Encrypted?</h2>
        <p>Every Atho P2P application message on mainnet, testnet, and prunetest is required to travel inside an authenticated encrypted session for that direct peer connection. This is per-hop link encryption, not onion encryption across multiple relays. Raw RPC and HTTP are separate local interfaces and stay loopback-only because they do not provide transport encryption themselves.</p>
        <p>Operators may add a VPS, VPN, TCP proxy, or tested Tor-compatible gateway to change the IP address visible to direct peers. That routing layer is external to Atho and does not make the public ledger private.</p>
      </section>
      <section class="docs-section" id="faq-network">
        <h2>Is Mainnet or Testnet Live?</h2>
        <p>Mainnet has not launched. The previous public testnet is retired, and its old explorer and bootstrap endpoints are offline. Use regnet locally and wait for an official compatible public-network announcement.</p>
      </section>
      <section class="docs-section" id="faq-ledger-privacy">
        <h2>Does P2P Encryption Hide Transactions on the Blockchain?</h2>
        <p>No. It protects network traffic while it crosses a direct peer connection. Atho currently uses a transparent UTXO ledger, so confirmed amounts and transaction relationships remain public.</p>
      </section>
      <section class="docs-section" id="faq-wallet">
        <h2>Can a Stolen Wallet File Be Read?</h2>
        <p>A password-encrypted datafile is protected with PBKDF2-HMAC-SHA256 and AES-256-GCM, so the file is not readable without attacking the password or implementation. A weak password can still be guessed offline, and an unlocked or compromised computer can expose secrets before disk encryption helps.</p>
      </section>
      <section class="docs-section" id="faq-research">
        <h2>Are Private Transactions or State Channels Implemented?</h2>
        <p>No. The current implementation is a transparent public UTXO payment chain. Separate research documents are not evidence that private transaction or channel systems ship in the current code.</p>
      </section>
      <section class="docs-section" id="faq-audit">
        <h2>Does a Stable Testnet Mean the Code Is Fully Audited?</h2>
        <p>No. Stable operation is valuable soak-test evidence, but it does not prove the absence of consensus, cryptographic, wallet, networking, or deployment defects. Independent review and remediation remain launch gates.</p>
      </section>
      <section class="docs-section" id="faq-fees">
        <h2>Is Wallet Transaction PoW the Same as Mining?</h2>
        <p>No. Wallet transaction PoW is lightweight SHA3-256 anti-spam work attached to a normal transaction. Mining is SHA3-384 proof of work used to produce blocks and order settlement.</p>
      </section>
    `
  }
};

const sectionGroupById = {};
docsNavGroups.forEach((group) => {
  group.ids.forEach((id) => {
    sectionGroupById[id] = group.title;
  });
});

Object.entries(docsSections).forEach(([id, section]) => {
  if (!section.eyebrow) {
    section.eyebrow = sectionGroupById[id] || "Atho Docs";
  }
});

export const docsAliasMap = Object.entries(docsSections).reduce((map, [sectionId, section]) => {
  map[sectionId] = { sectionId, anchorId: sectionId };
  (section.aliases || []).forEach((alias) => {
    map[alias] = { sectionId, anchorId: sectionId };
  });
  (section.topics || []).forEach((topic) => {
    map[topic.id] = { sectionId, anchorId: topic.id };
    (topic.aliases || []).forEach((alias) => {
      map[alias] = { sectionId, anchorId: topic.id };
    });
  });
  return map;
}, {});
