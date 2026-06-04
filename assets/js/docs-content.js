export const docsSectionOrder = [
  "overview",
  "what-is-atho",
  "design-philosophy",
  "falcon-512-and-quantum-security",
  "monetary-policy",
  "units-and-fees",
  "wallets",
  "transactions",
  "wallet-transaction-pow",
  "mempool",
  "mining",
  "nodes",
  "peer-network",
  "storage-and-sync",
  "mainnet-vs-testnet",
  "security",
  "replay-protection",
  "developer-reference",
  "troubleshooting",
  "faq"
];

export const docsNavGroups = [
  {
    title: "Start Here",
    ids: ["overview", "what-is-atho", "design-philosophy", "falcon-512-and-quantum-security", "monetary-policy", "units-and-fees"]
  },
  {
    title: "Payments and Wallets",
    ids: ["wallets", "transactions", "wallet-transaction-pow", "mempool"]
  },
  {
    title: "Mining and Nodes",
    ids: ["mining", "nodes", "peer-network", "storage-and-sync"]
  },
  {
    title: "Security",
    ids: ["mainnet-vs-testnet", "security", "replay-protection"]
  },
  {
    title: "Developers",
    ids: ["developer-reference", "troubleshooting", "faq"]
  }
];

export const docsSections = {
  overview: {
    title: "Overview",
    eyebrow: "Atho Docs",
    summary: "Start here and then move through the docs like a book. Each section opens as its own focused reading view instead of one long technical wall.",
    keywords: [
      "overview",
      "start here",
      "new to atho",
      "guided docs",
      "book navigation",
      "contents"
    ],
    topics: [
      { id: "overview", title: "Docs Overview", aliases: ["docs", "start", "guide"] }
    ],
    related: [
      { label: "What Is Atho?", href: "#what-is-atho" },
      { label: "Design Philosophy", href: "#design-philosophy" },
      { label: "Falcon-512 and Quantum Security", href: "#falcon-512-and-quantum-security" },
      { label: "Units and Fees", href: "#units-and-fees" }
    ],
    content: `
      <section class="docs-section" id="overview-start">
        <h2>How to Use These Docs</h2>
        <p>The docs are organized as a guided sequence. Use the <strong>Overview</strong> cards, the sidebar, search, or the <strong>Previous</strong> and <strong>Next</strong> buttons to move through the topics. The goal is to make Atho readable for users, miners, node operators, testers, and developers without dumping every topic into one endless page.</p>
      </section>
      <section class="docs-section" id="overview-routing">
        <h2>Choose a Path</h2>
        <div class="docs-overview-grid" data-docs-overview-grid></div>
      </section>
      <section class="docs-section" id="overview-notes">
        <h2>Current Network Notes</h2>
        <ul>
          <li>Atho is a post-quantum-focused proof-of-work payment network built around a public UTXO model.</li>
          <li>The software uses 8-decimal atom precision, 1 atom/vbyte fees, a 100-atom dust floor, and wallet transaction PoW for anti-spam protection.</li>
          <li>Testnet ATHO is distributed manually by the Atho founders or development team. There is no software faucet in the client or website.</li>
        </ul>
      </section>
    `
  },
  "what-is-atho": {
    title: "What Is Atho?",
    eyebrow: "Start Here",
    summary: "Atho is a post-quantum-focused proof-of-work payment blockchain designed for simple, secure, low-fee digital settlement.",
    keywords: [
      "what is atho",
      "payment network",
      "utxo blockchain",
      "post quantum",
      "core network summary",
      "what makes atho different"
    ],
    topics: [
      { id: "what-is-atho", title: "What Is Atho?" },
      { id: "core-network-summary", title: "Core Network Summary", aliases: ["network summary"] },
      { id: "what-makes-atho-different", title: "What Makes Atho Different?", aliases: ["different", "why atho different"] }
    ],
    related: [
      { label: "Design Philosophy", href: "#design-philosophy" },
      { label: "Falcon-512 and Quantum Security", href: "#falcon-512-and-quantum-security" },
      { label: "Monetary Policy", href: "#monetary-policy" },
      { label: "Wallets", href: "#wallets" }
    ],
    content: `
      <section class="docs-section" id="what-is-atho">
        <h2>What Is Atho?</h2>
        <p>Atho is a payment-first blockchain. It is not trying to be a general-purpose application platform. Its job is to move value with explicit rules: wallets build and sign transactions, nodes validate them, miners include valid transactions in blocks, and every full node independently verifies the same outcome.</p>
        <p>Atho uses a public UTXO model, exact integer atom accounting, post-quantum-focused transaction signatures, and a thin desktop client over backend-owned chain truth. That combination keeps the system legible for people who have to operate it, debug it, and trust it.</p>
      </section>
      <section class="docs-section" id="core-network-summary">
        <h2>Core Network Summary</h2>
        <div class="docs-table-wrap">
          <table>
            <tbody>
              <tr><th>Ledger Model</th><td>Public UTXO chain</td></tr>
              <tr><th>Block Time</th><td>100 seconds</td></tr>
              <tr><th>Starting Reward</th><td>50 ATHO</td></tr>
              <tr><th>Halving Interval</th><td>1,260,000 blocks</td></tr>
              <tr><th>Tail Reward</th><td>0.390625 ATHO forever</td></tr>
              <tr><th>Normal Confirmations</th><td>1 confirmation at consensus; official wallet default 3 confirmations; users and apps choose their risk policy</td></tr>
              <tr><th>Coinbase Maturity</th><td>100 confirmations</td></tr>
              <tr><th>Max Supply Cap</th><td>None. Atho uses permanent tail emission.</td></tr>
              <tr><th>Smallest Unit</th><td>1 atom</td></tr>
              <tr><th>Transaction Spam Deterrent</th><td>SHA3-256 wallet transaction PoW</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      <section class="docs-section" id="what-makes-atho-different">
        <h2>What Makes Atho Different?</h2>
        <ul>
          <li>Post-quantum-focused transaction signing with Falcon-512.</li>
          <li>One ATHO contains 100,000,000 atoms, so the system keeps Bitcoin-style E-8 precision.</li>
          <li>Wallet transaction PoW makes spam computationally expensive without forcing high fees.</li>
          <li>Permanent tail emission keeps a long-term miner security budget instead of relying on a hard supply cap and fee-only security later.</li>
        </ul>
      </section>
    `
  },
  "design-philosophy": {
    title: "Design Philosophy",
    eyebrow: "Start Here",
    summary: "Atho favors explicit validation, exact accounting, backend-owned consensus truth, and clear boundaries between wallet work and node work.",
    keywords: [
      "design philosophy",
      "why atho",
      "validation",
      "exact atoms",
      "thin client",
      "backend truth"
    ],
    topics: [
      { id: "design-philosophy", title: "Design Philosophy" },
      { id: "why-atho", title: "Why Atho?", aliases: ["why"] }
    ],
    related: [
      { label: "What Is Atho?", href: "#what-is-atho" },
      { label: "Falcon-512 and Quantum Security", href: "#falcon-512-and-quantum-security" },
      { label: "Transactions", href: "#transactions" },
      { label: "Security", href: "#security" }
    ],
    content: `
      <section class="docs-section" id="why-atho">
        <h2>Why Atho?</h2>
        <p>Atho is built around a narrow claim: payment networks are easier to secure when their rules are explicit, local, and auditable. The protocol leans into simple UTXO payments, low fees, proof-of-work mining, post-quantum-focused signatures, and a permanent miner reward budget.</p>
        <p>This matters because complexity tends to leak into operations. Atho would rather make the boundaries obvious than try to hide them behind feature sprawl.</p>
      </section>
      <section class="docs-section" id="design-philosophy">
        <h2>Design Philosophy</h2>
        <ul>
          <li>Keep consensus logic backend-owned and deterministic.</li>
          <li>Use exact integer atoms, never floats, for monetary values.</li>
          <li>Keep wallets responsible for keys, derivation, signing, and wallet transaction PoW generation.</li>
          <li>Keep nodes responsible for mempool admission, block validation, storage, peer sync, and chain truth.</li>
          <li>Keep testnet flexible for testing while keeping mainnet stricter and more conservative.</li>
        </ul>
      </section>
      <section class="docs-section" id="system-boundaries">
        <h2>System Boundaries</h2>
        <p>The wallet is not a second consensus engine. The GUI exists to manage keys, build transactions, show wallet state, and interact with the node. The node owns the durable chain view, mempool state, block validation, storage, and peer behavior.</p>
        <p>That split makes bugs easier to reason about and keeps the protocol state authoritative in one place.</p>
      </section>
    `
  },
  "falcon-512-and-quantum-security": {
    title: "Falcon-512 and Quantum Security",
    eyebrow: "Start Here",
    summary: "Atho uses Falcon-512 transaction signatures to keep wallet authorization on a post-quantum-focused footing, accepting larger keys and signatures as the tradeoff.",
    keywords: [
      "falcon 512",
      "quantum security",
      "post quantum signatures",
      "elliptic curve comparison",
      "signature size",
      "lattice signatures"
    ],
    aliases: ["falcon-512", "quantum-security"],
    topics: [
      { id: "falcon-512-and-quantum-security", title: "Falcon-512 and Quantum Security" },
      { id: "post-quantum-signatures", title: "Post-Quantum Signatures", aliases: ["falcon", "falcon signatures"] },
      { id: "falcon-vs-elliptic-curve", title: "Falcon-512 vs Elliptic Curve Signatures", aliases: ["ecc comparison", "elliptic curve signatures"] },
      { id: "why-signature-sizes-differ", title: "Why the Signature Sizes Differ", aliases: ["size difference", "larger signatures"] }
    ],
    related: [
      { label: "Design Philosophy", href: "#design-philosophy" },
      { label: "Wallet Transaction PoW", href: "#wallet-transaction-pow" },
      { label: "Security", href: "#security" }
    ],
    content: `
      <section class="docs-section" id="post-quantum-signatures">
        <h2>What Falcon-512 Does in Atho</h2>
        <p>Falcon-512 is Atho's transaction authorization scheme. When a wallet spends funds, Falcon-512 is the signature system that proves the spender controls the relevant keys. Atho chose it because the project wants the authorization layer to be built around a post-quantum-focused signature design instead of a classical elliptic-curve assumption.</p>
        <p>This does not mean block mining changed. Falcon-512 protects transaction authorization. Proof of Work still secures block production separately.</p>
      </section>
      <section class="docs-section" id="falcon-vs-elliptic-curve">
        <h2>Falcon-512 vs Elliptic Curve Signatures</h2>
        <figure class="docs-figure docs-figure-wide">
          <img src="./assets/media/docs/falcon-512-vs-ecc.svg" alt="Comparison diagram showing Falcon-512 next to classical elliptic curve signatures, including size tradeoffs and threat-model differences.">
          <figcaption>Falcon-512 is materially larger than a compact classical elliptic-curve signature stack, but Atho accepts that cost for a stronger long-range signature posture.</figcaption>
        </figure>
        <div class="docs-table-wrap">
          <table>
            <thead><tr><th>Property</th><th>Classical Elliptic Curve</th><th>Falcon-512</th></tr></thead>
            <tbody>
              <tr><td>Typical compressed public key</td><td>about 33 bytes</td><td>897 bytes</td></tr>
              <tr><td>Typical signature</td><td>about 64 bytes fixed-width schnorr, or slightly larger variable ECDSA</td><td>about 666 bytes</td></tr>
              <tr><td>Threat posture</td><td>Efficient and compact, but vulnerable to large-scale quantum attacks</td><td>Larger artifacts, chosen for post-quantum-focused security</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      <section class="docs-section" id="why-signature-sizes-differ">
        <h2>Why the Signature Sizes Differ</h2>
        <p>Classical elliptic-curve systems encode a compact point and signature scalar relationship. Falcon-512 comes from lattice-based cryptography, so it carries a different mathematical structure and more serialized data. That is why Falcon artifacts are larger on disk and on the wire.</p>
        <p>The engineering tradeoff is straightforward: smaller classical signatures are easier on transaction size, but Atho is willing to spend more bytes per authorization in exchange for a signature design chosen with post-quantum resilience in mind.</p>
      </section>
      <section class="docs-section" id="falcon-operational-impact">
        <h2>Operational Impact</h2>
        <p>Larger signatures mean transaction payloads are heavier than a comparable classical-curve payment network. That affects storage, bandwidth, and fee sensitivity. Atho offsets that with exact atom accounting, low base fees, a UTXO model that stays simple to verify, and wallet transaction PoW to make spam expensive without leaning only on fees.</p>
        <div class="docs-example">
          <h3>Example</h3>
          <p>A wallet send in Atho carries more signature data than a compact secp256k1 payment system, but the network keeps the send path readable: build transaction, sign with Falcon-512, generate wallet transaction PoW, broadcast, validate, mine, confirm.</p>
        </div>
      </section>
    `
  },
  "monetary-policy": {
    title: "Monetary Policy",
    eyebrow: "Economics",
    summary: "Atho uses a permanent tail reward to support long-term proof-of-work security while keeping fees low for normal payments.",
    keywords: [
      "monetary policy",
      "tail emission",
      "reward schedule",
      "year 20",
      "year 50",
      "no fixed max supply",
      "miner security budget"
    ],
    topics: [
      { id: "monetary-policy", title: "Monetary Policy" },
      { id: "emissions-overview", title: "Emissions Overview" },
      { id: "reward-schedule", title: "Reward Schedule" },
      { id: "tail-emission", title: "Tail Emission" },
      { id: "miner-security-budget", title: "Miner Security Budget" },
      { id: "supply-examples", title: "Year 20 and Year 50 Supply", aliases: ["year 20", "year 50", "tail start"] },
      { id: "why-no-fixed-max-supply", title: "Why No Fixed Max Supply" }
    ],
    related: [
      { label: "Units and Fees", href: "#units-and-fees" },
      { label: "Mining", href: "#mining" },
      { label: "Developer Reference", href: "#developer-reference" }
    ],
    content: `
      <section class="docs-section" id="emissions-overview">
        <h2>Emissions Overview</h2>
        <p>There is no fixed max supply cap. Atho starts at 50 ATHO per block, halves every 1,260,000 blocks for seven pre-tail eras, and then continues forever at a 0.390625 ATHO tail reward.</p>
        <p>The policy changed to match Atho's long-term payment-network goals. Instead of trying to force security entirely into fees later, Atho keeps a predictable miner budget in place.</p>
      </section>
      <section class="docs-section" id="reward-schedule">
        <h2>Reward Schedule</h2>
        <div class="docs-table-wrap">
          <table>
            <thead><tr><th>Era</th><th>Reward</th><th>Blocks</th><th>Issuance</th></tr></thead>
            <tbody>
              <tr><td>Era 1</td><td>50 ATHO</td><td>1,260,000</td><td>63,000,000 ATHO</td></tr>
              <tr><td>Era 2</td><td>25 ATHO</td><td>1,260,000</td><td>31,500,000 ATHO</td></tr>
              <tr><td>Era 3</td><td>12.5 ATHO</td><td>1,260,000</td><td>15,750,000 ATHO</td></tr>
              <tr><td>Era 4</td><td>6.25 ATHO</td><td>1,260,000</td><td>7,875,000 ATHO</td></tr>
              <tr><td>Era 5</td><td>3.125 ATHO</td><td>1,260,000</td><td>3,937,500 ATHO</td></tr>
              <tr><td>Era 6</td><td>1.5625 ATHO</td><td>1,260,000</td><td>1,968,750 ATHO</td></tr>
              <tr><td>Era 7</td><td>0.78125 ATHO</td><td>1,260,000</td><td>984,375 ATHO</td></tr>
              <tr><td>Tail</td><td>0.390625 ATHO</td><td>Forever</td><td>123,187.5 ATHO/year</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      <section class="docs-section" id="tail-emission">
        <h2>Tail Emission</h2>
        <p>For a proof-of-work payment network, relying only on fees can make long-term security harder. Atho's tail reward keeps miners incentivized without forcing high user fees. The inflation rate declines over time as total supply grows.</p>
        <pre><code>Blocks per year = 31,536,000 / 100 = 315,360
Annual tail = 0.390625 * 315,360 = 123,187.5 ATHO/year
Tail issuance every 10 years = 1,231,875 ATHO</code></pre>
      </section>
      <section class="docs-section" id="miner-security-budget">
        <h2>Miner Security Budget</h2>
        <p>The security budget is the combination of block subsidy and fees that keeps miners economically engaged. Atho uses tail emission because it wants that budget to remain predictable even when fee demand is low.</p>
        <p>This is the practical reason behind the policy: low-fee payments and long-term proof-of-work security are easier to reconcile when miners do not depend on fee spikes alone.</p>
      </section>
      <section class="docs-section" id="supply-examples">
        <h2>Year 20 and Year 50 Supply</h2>
        <div class="docs-table-wrap">
          <table>
            <thead><tr><th>Milestone</th><th>Supply</th></tr></thead>
            <tbody>
              <tr><td>Tail Start</td><td>125,015,625 ATHO</td></tr>
              <tr><td>Year 20</td><td>about 122,073,750 ATHO</td></tr>
              <tr><td>Year 50</td><td>about 127,728,125 ATHO</td></tr>
            </tbody>
          </table>
        </div>
        <p>Tail issuance begins around year 28. After that, issuance continues, but its percentage impact declines as total supply grows.</p>
      </section>
      <section class="docs-section" id="why-no-fixed-max-supply">
        <h2>Why No Fixed Max Supply</h2>
        <p>A fixed cap can push a proof-of-work payment network toward fee-only security. Atho chooses a permanent tail reward so miners keep predictable incentives while users can still rely on low fees and small denomination support.</p>
      </section>
    `
  },
  "units-and-fees": {
    title: "Units and Fees",
    eyebrow: "Economics",
    summary: "Consensus stores integer atoms only. Display units are UI-only, and the fee rules stay intentionally simple and exact.",
    keywords: [
      "units",
      "fees",
      "atoms",
      "mATHO",
      "muATHO",
      "atoms",
      "minimum fee",
      "minimum output",
      "max outputs"
    ],
    topics: [
      { id: "units-and-fees", title: "Units and Fees" },
      { id: "atoms-and-display-units", title: "Atoms and Display Units", aliases: ["atoms", "display units", "mATHO", "microATHO"] },
      { id: "fee-model", title: "Fee Model", aliases: ["fees"] },
      { id: "minimum-transaction-fee", title: "Minimum Transaction Fee", aliases: ["minimum fee"] },
      { id: "minimum-output", title: "Minimum Output", aliases: ["dust", "100 atoms"] },
      { id: "max-outputs", title: "Max Outputs", aliases: ["64 outputs"] },
      { id: "example-fees", title: "Example Fees" }
    ],
    related: [
      { label: "Monetary Policy", href: "#monetary-policy" },
      { label: "Wallet Transaction PoW", href: "#wallet-transaction-pow" },
      { label: "Transactions", href: "#transactions" }
    ],
    content: `
      <section class="docs-section" id="atoms-and-display-units">
        <h2>Atoms and Display Units</h2>
        <p>Atho is scarce at the coin level and divisible at the atom level. One ATHO contains 100,000,000 atoms, which keeps fees precise while using Bitcoin-style E-8 accounting.</p>
        <div class="docs-table-wrap">
          <table>
            <thead><tr><th>Unit</th><th>Symbol</th><th>Atom Value</th><th>ATHO Value</th></tr></thead>
            <tbody>
              <tr><td>Atho</td><td>ATHO</td><td>100,000,000 atoms</td><td>1 ATHO</td></tr>
              <tr><td>MilliAtho</td><td>mATHO</td><td>100,000 atoms</td><td>0.001 ATHO</td></tr>
              <tr><td>MicroAtho</td><td>&mu;ATHO</td><td>100 atoms</td><td>0.000001 ATHO</td></tr>
              <tr><td>Atom</td><td>atom</td><td>1 atom</td><td>0.00000001 ATHO</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      <section class="docs-section" id="fee-model">
        <h2>Fee Model</h2>
        <p>The fee model is simple on purpose: exact atoms, no floats, a one-atom guard floor, and a linear relay rate. That keeps wallet behavior predictable across the GUI, CLI, and RPC surfaces.</p>
        <pre><code>MIN_TX_FEE_ATOMS = 1
MIN_RELAY_FEE_RATE_ATOMS_PER_VBYTE = 1
required_fee_atoms = max(1, tx_vbytes * 1)</code></pre>
      </section>
      <section class="docs-section" id="minimum-transaction-fee">
        <h2>Minimum Transaction Fee</h2>
        <p>The base fee rate is 1 atom per virtual byte. A 590 vB transaction therefore pays 590 atoms, or 0.00000590 ATHO.</p>
      </section>
      <section class="docs-section" id="minimum-output">
        <h2>Minimum Output</h2>
        <p>Every normal output must be at least 100 atoms, which equals 1 &mu;ATHO. Outputs below that threshold are not allowed under normal policy, and dust-like change should be rolled into the fee instead of producing a tiny output.</p>
      </section>
      <section class="docs-section" id="max-outputs">
        <h2>Max Outputs</h2>
        <p>Standard policy allows up to 64 outputs. That keeps large fan-out transactions from becoming a cheap way to stress wallet rendering, mempool admission, or block template selection.</p>
      </section>
      <section class="docs-section" id="example-fees">
        <h2>Example Fees</h2>
        <div class="docs-table-wrap">
          <table>
            <thead><tr><th>Tx Size</th><th>Required Fee</th></tr></thead>
            <tbody>
              <tr><td>250 vB</td><td>250 atoms</td></tr>
              <tr><td>500 vB</td><td>500 atoms</td></tr>
              <tr><td>650 vB</td><td>650 atoms</td></tr>
              <tr><td>1,000 vB</td><td>1,000 atoms</td></tr>
              <tr><td>2,500 vB</td><td>2,500 atoms</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    `
  },
  wallets: {
    title: "Wallets",
    eyebrow: "Payments and Wallets",
    summary: "Atho supports multiple HD wallets with required wallet names, 12/24/48-word recovery phrases, wallet switching, per-wallet address books, and wallet-specific balance state.",
    keywords: [
      "wallets",
      "mnemonic",
      "import wallet",
      "switch wallet",
      "address book",
      "utxo selection",
      "available balance"
    ],
    topics: [
      { id: "wallets", title: "Wallets" },
      { id: "creating-a-wallet", title: "Creating a Wallet", aliases: ["new wallet"] },
      { id: "recovery-word-counts", title: "12 / 24 / 48 Word Recovery", aliases: ["mnemonic words", "12 words", "24 words", "48 words"] },
      { id: "importing-a-wallet", title: "Importing a Wallet", aliases: ["import wallet"] },
      { id: "multiple-hd-wallets", title: "Multiple HD Wallets" },
      { id: "switching-wallets", title: "Switching Wallets", aliases: ["open switch wallet"] },
      { id: "address-book", title: "Address Book" },
      { id: "utxo-selection", title: "UTXO Selection" },
      { id: "utxos-and-available-balance", title: "UTXOs and Available Balance", aliases: ["wallet balance", "wallet utxos"] },
      { id: "available-balance", title: "Available Balance" }
    ],
    related: [
      { label: "Transactions", href: "#transactions" },
      { label: "Wallet Transaction PoW", href: "#wallet-transaction-pow" },
      { label: "Security", href: "#security" }
    ],
    content: `
      <section class="docs-section" id="creating-a-wallet">
        <h2>Creating a Wallet</h2>
        <p>Wallet creation requires a wallet name and a mnemonic word-count choice. The default is 24 words. Names make multi-wallet operation practical, while the underlying wallet identity should remain unique so one wallet never overwrites another on disk.</p>
      </section>
      <section class="docs-section" id="recovery-word-counts">
        <h2>12 / 24 / 48 Word Recovery</h2>
        <div class="docs-table-wrap">
          <table>
            <thead><tr><th>Word Count</th><th>Use</th></tr></thead>
            <tbody>
              <tr><td>12 words</td><td>Shorter recovery phrase</td></tr>
              <tr><td>24 words</td><td>Default recovery phrase</td></tr>
              <tr><td>48 words</td><td>Longer recovery phrase</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      <section class="docs-section" id="importing-a-wallet">
        <h2>Importing a Wallet</h2>
        <p>Import works directly and does not require creating a wallet first. The client accepts one-line phrases, newline-separated phrases, numbered phrases, and extra whitespace. It validates word count, spelling, and phrase structure before deriving the wallet root and the first receive addresses.</p>
        <p>That matters because deterministic recovery should be boring and reliable. A clean install should be able to go straight from mnemonic input to a loaded wallet without workarounds.</p>
      </section>
      <section class="docs-section" id="multiple-hd-wallets">
        <h2>Multiple HD Wallets</h2>
        <div class="docs-table-wrap">
          <table>
            <thead><tr><th>Feature</th><th>Current Behavior</th></tr></thead>
            <tbody>
              <tr><td>Mnemonic Options</td><td>12 / 24 / 48 words</td></tr>
              <tr><td>Default Mnemonic</td><td>24 words</td></tr>
              <tr><td>Wallet Names</td><td>Required</td></tr>
              <tr><td>Wallet Switching</td><td>File menu</td></tr>
              <tr><td>Address Book</td><td>Per-wallet</td></tr>
            </tbody>
          </table>
        </div>
        <p>Each wallet keeps separate metadata, addresses, UTXOs, transaction history, address book entries, and derivation state. That separation prevents cross-wallet leakage.</p>
      </section>
      <section class="docs-section" id="switching-wallets">
        <h2>Switching Wallets</h2>
        <p>Users switch wallets from the File menu through <strong>Open / Switch Wallet</strong>. Switching clears stale send state, selected UTXOs, receive-address display, transaction history, balance view, and address book context before the newly selected wallet becomes active.</p>
      </section>
      <section class="docs-section" id="address-book">
        <h2>Address Book</h2>
        <p>The Address Book is per-wallet. It stores labels, public addresses, optional notes, and timestamps. It does not store private keys, and wrong-network addresses should be rejected before they are saved.</p>
      </section>
      <section class="docs-section" id="utxo-selection">
        <h2>UTXO Selection</h2>
        <p>Wallets should select only current-wallet spendable UTXOs. That means no foreign outputs, no reserved or pending outputs, no immature coinbase rewards, and no locked outputs. Sends may combine multiple UTXOs when one output is not enough.</p>
      </section>
      <section class="docs-section" id="utxos-and-available-balance">
        <h2>UTXOs and Available Balance</h2>
        <p>Available balance is a view over spendable UTXOs, not a separate source of truth. When a wallet changes, rescans, or receives confirmations, the displayed balance should track the active wallet's spendable outputs only.</p>
      </section>
      <section class="docs-section" id="available-balance">
        <h2>Available Balance</h2>
        <p>Available balance is wallet-specific. It sums spendable current-wallet UTXOs after policy filtering. The value should refresh after rescans, confirmations, wallet switching, and coinbase maturity changes.</p>
      </section>
    `
  },
  transactions: {
    title: "Transactions",
    eyebrow: "Payments and Wallets",
    summary: "Transactions move value from existing UTXOs into new outputs and pass through wallet building, signing, transaction PoW, mempool validation, mining, and final block validation.",
    keywords: [
      "transactions",
      "utxo model",
      "transaction lifecycle",
      "confirmations",
      "outputs",
      "wallet to mempool to block"
    ],
    topics: [
      { id: "transactions", title: "Transactions" },
      { id: "utxo-model", title: "UTXO Model" },
      { id: "transaction-lifecycle", title: "Transaction Lifecycle" },
      { id: "signing", title: "Signing Flow", aliases: ["signing"] },
      { id: "confirmations", title: "Confirmations" }
    ],
    related: [
      { label: "Wallets", href: "#wallets" },
      { label: "Mempool", href: "#mempool" },
      { label: "Replay Protection", href: "#replay-protection" }
    ],
    content: `
      <section class="docs-section" id="utxo-model">
        <h2>UTXO Model</h2>
        <p>A UTXO is an unspent transaction output. Spending removes previous outputs and creates new outputs. Atho uses this model because it keeps amount conservation, ownership, rollback, and spendability explicit instead of burying state changes inside mutable account balances.</p>
        <figure class="docs-figure docs-figure-wide">
          <img src="./assets/media/docs/utxo-transaction-lifecycle.svg" alt="Flowchart showing existing UTXOs moving through wallet build, mempool admission, block inclusion, and new UTXOs.">
          <figcaption>The transaction path is deliberately linear: existing outputs become inputs, nodes validate the send, miners include it, and the chain produces a fresh set of spendable outputs.</figcaption>
        </figure>
      </section>
      <section class="docs-section" id="transaction-lifecycle">
        <h2>Transaction Lifecycle</h2>
        <ol>
          <li>The wallet selects spendable current-wallet UTXOs.</li>
          <li>The wallet builds outputs and calculates the required fee.</li>
          <li>The wallet signs the transaction with Falcon-512.</li>
          <li>The wallet generates wallet transaction PoW.</li>
          <li>The node validates policy, ownership, signatures, and transaction PoW.</li>
          <li>The mempool stores valid unconfirmed transactions.</li>
          <li>Miners include valid transactions in block templates.</li>
          <li>Full nodes validate the block and update the UTXO set atomically.</li>
        </ol>
        <div class="docs-example">
          <h3>Example</h3>
          <p>If a wallet controls two UTXOs worth 2 ATHO and 1 ATHO, and the user sends 2.4 ATHO, the wallet can combine both inputs, create the recipient output, create change back to the wallet if it is still above the minimum output, then attach the required fee and wallet transaction PoW before broadcast.</p>
        </div>
      </section>
      <section class="docs-section" id="signing">
        <h2>Signing Flow</h2>
        <p>The wallet signs the transaction before transaction PoW is solved. That order matters because the proof preimage is derived from the signed transaction without PoW fields, which lets nodes verify the anti-spam proof against the exact payload being authorized.</p>
      </section>
      <section class="docs-section" id="confirmations">
        <h2>Confirmations</h2>
        <p>Normal transactions are confirmed by consensus once they are included in a valid block. The official wallet defaults to a 3-confirmation spendable-balance filter, and users, merchants, exchanges, and applications can choose stricter thresholds for their own risk policy. Coinbase rewards require 100 confirmations before they are spendable.</p>
      </section>
    `
  },
  "wallet-transaction-pow": {
    title: "Wallet Transaction PoW",
    eyebrow: "Payments and Wallets",
    summary: "Wallet transaction PoW is a lightweight anti-spam proof generated before broadcast. It is not block mining.",
    keywords: [
      "wallet transaction pow",
      "transaction pow",
      "anti spam",
      "sha3",
      "tx_pow_nonce",
      "tx_pow_bits"
    ],
    topics: [
      { id: "wallet-transaction-pow", title: "Wallet Transaction PoW" },
      { id: "transaction-pow-spam-deterrent", title: "Why Wallet Transaction PoW Exists", aliases: ["spam deterrent", "anti spam"] },
      { id: "transaction-pow", title: "How Wallet Transaction PoW Works", aliases: ["tx pow"] }
    ],
    related: [
      { label: "Units and Fees", href: "#units-and-fees" },
      { label: "Mempool", href: "#mempool" },
      { label: "Developer Reference", href: "#developer-reference" }
    ],
    content: `
      <section class="docs-section" id="transaction-pow-spam-deterrent">
        <h2>Why Wallet Transaction PoW Exists</h2>
        <p>Wallet transaction PoW exists because low fees alone are not enough to make spam expensive. Atho wants normal payments to stay cheap, so it adds a lightweight computational cost before broadcast instead of forcing users into high fee pressure.</p>
        <p>It is important not to call this mining in user docs. Wallet transaction PoW is a send-proof step, not the network's block-production mechanism.</p>
      </section>
      <section class="docs-section" id="transaction-pow">
        <h2>How Wallet Transaction PoW Works</h2>
        <pre><code>TX_POW_HASH = SHA3-256
TX_POW_MIN_BITS = 16
TX_POW_MAX_BITS = 28
TX_POW_DOMAIN = ATHO_TX_POW_V1</code></pre>
        <pre><code>Wallet signs transaction.
Wallet builds PoW preimage from signed transaction without PoW fields.
Wallet solves nonce.
Transaction includes tx_pow_nonce and tx_pow_bits.
Node verifies nonce before expensive checks when possible.</code></pre>
        <figure class="docs-figure docs-figure-wide">
          <img src="./assets/media/docs/wallet-tx-pow-flow.svg" alt="Flowchart showing wallet transaction PoW from UTXO selection, signing, proof construction, nonce solving, broadcast, and node verification.">
          <figcaption>Wallet transaction PoW is part of the send lifecycle. The wallet does the work once, then the node can verify it cheaply during admission.</figcaption>
        </figure>
        <p>The target can scale with transaction size, fee rate, and output count. That makes larger, lower-fee, or more complex transactions work a little harder without turning the send flow into full mining.</p>
        <div class="docs-example">
          <h3>Example</h3>
          <p>If a transaction is larger, pays only the minimum fee, or fans out into more outputs, the wallet may need to search longer for a valid nonce. That extra work is intentional: it makes bulk spam less attractive while leaving ordinary sends predictable.</p>
        </div>
      </section>
    `
  },
  mempool: {
    title: "Mempool",
    eyebrow: "Payments and Wallets",
    summary: "The mempool is a validated staging area for unconfirmed transactions. It is not final settlement.",
    keywords: [
      "mempool",
      "mempool flow",
      "block inclusion",
      "double spend",
      "low fee rejection"
    ],
    topics: [
      { id: "mempool", title: "Mempool" },
      { id: "mempool-flow", title: "Mempool Flow", aliases: ["mempool"] },
      { id: "block-inclusion", title: "Block Inclusion" }
    ],
    related: [
      { label: "Transactions", href: "#transactions" },
      { label: "Wallet Transaction PoW", href: "#wallet-transaction-pow" },
      { label: "Mining", href: "#mining" }
    ],
    content: `
      <section class="docs-section" id="mempool-flow">
        <h2>Mempool Flow</h2>
        <p>The mempool stores unconfirmed transactions that already passed local policy and contextual checks. It rejects low-fee transactions, outputs below 100 atoms, missing or bad transaction PoW, bad signatures, duplicate inputs, and local double spends.</p>
      </section>
      <section class="docs-section" id="block-inclusion">
        <h2>Block Inclusion</h2>
        <p>Once a transaction is accepted into the mempool, miners can consider it for block templates built from a stable snapshot. After the transaction is mined into a valid block, it leaves the mempool and the UTXO set changes atomically.</p>
      </section>
    `
  },
  mining: {
    title: "Mining",
    eyebrow: "Mining and Nodes",
    summary: "Mining produces proof-of-work blocks, collects the current block reward plus fees, and is fully separable from wallet transaction PoW.",
    keywords: [
      "mining",
      "proof of work",
      "block rewards",
      "coinbase",
      "block templates",
      "difficulty targets"
    ],
    topics: [
      { id: "mining", title: "Mining" },
      { id: "proof-of-work", title: "Proof of Work" },
      { id: "block-rewards", title: "Block Rewards" },
      { id: "coinbase-transactions", title: "Coinbase Transactions", aliases: ["coinbase"] },
      { id: "block-templates", title: "Block Templates" },
      { id: "difficulty", title: "Difficulty Targets", aliases: ["difficulty"] },
      { id: "mining-on-testnet", title: "Mining on Testnet", aliases: ["testnet mining"] },
      { id: "testnet-difficulty-reset", title: "Testnet Difficulty Reset" }
    ],
    related: [
      { label: "Monetary Policy", href: "#monetary-policy" },
      { label: "Nodes", href: "#nodes" },
      { label: "Mainnet vs Testnet", href: "#mainnet-vs-testnet" }
    ],
    content: `
      <section class="docs-section" id="proof-of-work">
        <h2>Proof of Work</h2>
        <p>Miners search for a block header nonce that satisfies the active target. Every full node independently verifies the block hash against that target before accepting the block.</p>
      </section>
      <section class="docs-section" id="block-rewards">
        <h2>Block Rewards</h2>
        <p>The initial block reward is 50 ATHO, then 25, 12.5, 6.25, 3.125, 1.5625, 0.78125, then a permanent 0.390625 ATHO tail reward. Valid transaction fees are added on top.</p>
      </section>
      <section class="docs-section" id="coinbase-transactions">
        <h2>Coinbase Transactions</h2>
        <p>Coinbase transactions create the block reward and collect valid fees. They do not require wallet transaction PoW, but they must not overpay.</p>
        <pre><code>coinbase_total_output &lt;= block_reward + total_block_fees</code></pre>
      </section>
      <section class="docs-section" id="block-templates">
        <h2>Block Templates</h2>
        <p>Block templates use a stable mempool snapshot, include valid transactions, exclude invalid policy candidates, and freeze the candidate while miners search for a winning block hash.</p>
      </section>
      <section class="docs-section" id="difficulty">
        <h2>Difficulty Targets</h2>
        <p>Mainnet follows normal difficulty rules only. The difficulty target defines how hard it is to produce a valid block, and nodes verify the claimed target when blocks arrive.</p>
      </section>
      <section class="docs-section" id="mining-on-testnet">
        <h2>Mining on Testnet</h2>
        <p>Testnet mining is for exercise and validation, not for economic value. It is useful for confirming wallet flows, mempool admission, block template selection, and node sync behavior under realistic conditions while still allowing testnet-only recovery features when development resets happen.</p>
      </section>
      <section class="docs-section" id="testnet-difficulty-reset">
        <h2>Testnet Difficulty Reset</h2>
        <p>On testnet only, if more than 10 minutes pass after the previous block, the next block difficulty may reset to minimum if that feature is enabled. This recovery behavior does not apply to mainnet.</p>
      </section>
    `
  },
  nodes: {
    title: "Nodes",
    eyebrow: "Mining and Nodes",
    summary: "Nodes validate blocks and transactions, own durable chain truth, expose local RPC, manage peers, and provide wallet-visible state and mining templates.",
    keywords: [
      "nodes",
      "run node",
      "athod",
      "local node",
      "network modes"
    ],
    topics: [
      { id: "nodes", title: "Nodes" },
      { id: "running-a-node", title: "Running a Node", aliases: ["run node"] }
    ],
    related: [
      { label: "Peer Network", href: "#peer-network" },
      { label: "Storage and Sync", href: "#storage-and-sync" },
      { label: "Developer Reference", href: "#developer-reference" }
    ],
    content: `
      <section class="docs-section" id="running-a-node">
        <h2>Running a Node</h2>
        <pre><code>python runmainnet.py
python runtestnet.py
./target/release/athod --network testnet</code></pre>
        <p>The Qt client can manage a local node with <code>--local-node</code>. Public RPC should be protected and intentionally configured.</p>
      </section>
      <section class="docs-section" id="node-responsibilities">
        <h2>What the Node Owns</h2>
        <p>The node owns transaction validation, mempool policy, block validation, peer sync, chain selection, and durable storage. Wallets and UIs can display that state, but they should not redefine it.</p>
      </section>
    `
  },
  "peer-network": {
    title: "Peer Network",
    eyebrow: "Mining and Nodes",
    summary: "Peer discovery, peer quality tracking, and message handling help nodes find the network without letting the network bypass local validation.",
    keywords: [
      "peer network",
      "peer discovery",
      "peer quality",
      "p2p",
      "network messages"
    ],
    topics: [
      { id: "peer-network", title: "Peer Network" },
      { id: "peer-discovery", title: "Peer Discovery" },
      { id: "peer-quality-scores", title: "Peer Quality Scores", aliases: ["peer quality"] }
    ],
    related: [
      { label: "Nodes", href: "#nodes" },
      { label: "Storage and Sync", href: "#storage-and-sync" },
      { label: "Replay Protection", href: "#replay-protection" }
    ],
    content: `
      <section class="docs-section" id="peer-discovery">
        <h2>Peer Discovery</h2>
        <p>Nodes can use configured peers and DNS seed infrastructure when available. Discovery only helps find the network; it does not grant trust. Every message is still subject to full local validation.</p>
      </section>
      <section class="docs-section" id="peer-quality-scores">
        <h2>Peer Quality Scores</h2>
        <p>Peer diagnostics can expose direction, endpoint, height, protocol version, traffic, readiness, and persisted peer-quality information. That helps operators understand which peers are healthy without letting reputation replace validation.</p>
      </section>
      <section class="docs-section" id="peer-safety">
        <h2>Why Atho Keeps Peer Logic Conservative</h2>
        <p>Peer logic is intentionally conservative because the peer layer is an input surface. Nodes should be able to discover and use peers while still treating the network as untrusted until blocks, transactions, and chain data pass local checks.</p>
      </section>
    `
  },
  "storage-and-sync": {
    title: "Storage and Sync",
    eyebrow: "Mining and Nodes",
    summary: "Storage is per-network, syncing is validation-first, and testnet-only storage recovery features do not apply to mainnet.",
    keywords: [
      "storage",
      "sync",
      "storage metadata",
      "self healing",
      "ATHO_DATA_DIR",
      "LMDB"
    ],
    topics: [
      { id: "storage-and-sync", title: "Storage and Sync" },
      { id: "storage", title: "Storage Paths", aliases: ["storage paths", "storage"] },
      { id: "storage-metadata", title: "Storage Metadata" },
      { id: "testnet-storage-self-healing", title: "Testnet Storage Self-Healing", aliases: ["self healing"] },
      { id: "syncing", title: "Syncing", aliases: ["sync"] }
    ],
    related: [
      { label: "Nodes", href: "#nodes" },
      { label: "Mainnet vs Testnet", href: "#mainnet-vs-testnet" },
      { label: "Troubleshooting", href: "#troubleshooting" }
    ],
    content: `
      <section class="docs-section" id="storage">
        <h2>Storage Paths</h2>
        <p>Storage is per-network. Raw blocks live in flat block files and indexed chainstate lives in LMDB. Keep mainnet and testnet roots separate so a disposable test flow never collides with production data.</p>
      </section>
      <section class="docs-section" id="storage-metadata">
        <h2>Storage Metadata</h2>
        <p>Storage metadata tracks things like configured genesis, network magic, storage magic, chain ID, and schema version. Those markers help the node decide whether an existing database belongs to the current network configuration.</p>
      </section>
      <section class="docs-section" id="testnet-storage-self-healing">
        <h2>Testnet Storage Self-Healing</h2>
        <p>Testnet may self-heal local chain storage when configured testnet genesis, network magic, storage magic, chain ID, or schema version changes. This is a testnet-only recovery path and does not apply to mainnet.</p>
      </section>
      <section class="docs-section" id="syncing">
        <h2>Syncing</h2>
        <p>Nodes sync headers and blocks from peers, validate everything locally, and update the best tip only after validation succeeds. The client status bar should reflect node height, target height, mempool count, and connectivity.</p>
        <pre><code>ATHO_DATA_DIR=/path/to/runtime-root</code></pre>
      </section>
    `
  },
  "mainnet-vs-testnet": {
    title: "Mainnet vs Testnet",
    eyebrow: "Security",
    summary: "Mainnet stays strict and durable. Testnet stays flexible enough for development, resets, manual funding, and recovery features that must never spill into production.",
    keywords: [
      "mainnet vs testnet",
      "testnet",
      "manual testnet funds",
      "no faucet",
      "testnet resets",
      "regtest"
    ],
    topics: [
      { id: "mainnet-vs-testnet", title: "Mainnet vs Testnet" },
      { id: "network-modes", title: "Network Modes", aliases: ["mainnet", "testnet", "regtest", "regnet"] },
      { id: "what-testnet-is", title: "What Testnet Is" },
      { id: "getting-testnet-atho-manually", title: "Getting Testnet ATHO Manually", aliases: ["manual testnet funds", "testnet funds"] },
      { id: "testnet-resets", title: "Testnet Resets", aliases: ["testnet reset"] },
      { id: "reporting-bugs", title: "Reporting Bugs", aliases: ["report bugs", "bug reports"] }
    ],
    aliases: ["testnet"],
    related: [
      { label: "Mining", href: "#mining" },
      { label: "Storage and Sync", href: "#storage-and-sync" },
      { label: "Replay Protection", href: "#replay-protection" }
    ],
    content: `
      <section class="docs-section" id="network-modes">
        <h2>Network Modes</h2>
        <div class="docs-table-wrap">
          <table>
            <thead><tr><th>Feature</th><th>Mainnet</th><th>Testnet</th></tr></thead>
            <tbody>
              <tr><td>Faucet</td><td>No</td><td>No software faucet, manual distribution</td></tr>
              <tr><td>Storage Self-Heal</td><td>No</td><td>Testnet-only if configured</td></tr>
              <tr><td>Difficulty Stall Reset</td><td>No</td><td>Testnet-only if configured</td></tr>
              <tr><td>Genesis Changes</td><td>No</td><td>May happen during development</td></tr>
            </tbody>
          </table>
        </div>
        <p>Regtest or regnet is a disposable local network for development workflows. It is separate from both public mainnet and public testnet.</p>
      </section>
      <section class="docs-section" id="what-testnet-is">
        <h2>What Testnet Is</h2>
        <p>Testnet supports normal mining, wallet testing, transactions, mempool validation, syncing, and node operations. It is for testing only. Testnet coins have no mainnet value.</p>
      </section>
      <section class="docs-section" id="getting-testnet-atho-manually">
        <h2>Getting Testnet ATHO Manually</h2>
        <p>The Atho client does not include an automated faucet. Testnet ATHO is distributed manually by the Atho founders or development team. Contact the Atho team to request testnet funds.</p>
      </section>
      <section class="docs-section" id="testnet-resets">
        <h2>Testnet Resets</h2>
        <p>Testnet may reset during development, may receive new genesis data, and may use recovery features that are intentionally blocked on mainnet. These tradeoffs make development easier without weakening production rules.</p>
      </section>
      <section class="docs-section" id="reporting-bugs">
        <h2>Reporting Bugs</h2>
        <p>When you hit a testnet issue, capture the active network mode, wallet state, local height, target height, recent logs, and the exact action that triggered the problem. Good reports make it much easier to separate wallet bugs, sync bugs, mining bugs, and ordinary testnet reset behavior.</p>
      </section>
    `
  },
  security: {
    title: "Security",
    eyebrow: "Security",
    summary: "Atho's security model covers post-quantum signatures, wallet safety, anti-spam policy, mainnet safety, and clear protocol boundaries between wallets, nodes, and miners.",
    keywords: [
      "security",
      "post quantum signatures",
      "wallet safety",
      "anti spam model",
      "mainnet safety",
      "security model"
    ],
    topics: [
      { id: "security", title: "Security" },
      { id: "security-model", title: "Security Model" },
      { id: "wallet-safety", title: "Wallet Safety" },
      { id: "mainnet-safety", title: "Mainnet Safety" },
      { id: "spam-protection", title: "Anti-Spam Model", aliases: ["spam protection"] }
    ],
    related: [
      { label: "Falcon-512 and Quantum Security", href: "#falcon-512-and-quantum-security" },
      { label: "Replay Protection", href: "#replay-protection" },
      { label: "Wallet Transaction PoW", href: "#wallet-transaction-pow" },
      { label: "Mainnet vs Testnet", href: "#mainnet-vs-testnet" }
    ],
    content: `
      <section class="docs-section" id="security-model">
        <h2>Security Model</h2>
        <p>Atho keeps its security model legible. Wallets own key material, derivation, signing, and send-proof generation. Nodes own mempool policy, transaction validation, block validation, peer sync, and durable chain truth. Miners can only extend the chain with blocks that every full node will still verify independently.</p>
      </section>
      <section class="docs-section" id="wallet-safety">
        <h2>Wallet Safety</h2>
        <p>Never share a seed phrase. Do not store mnemonic material insecurely. Do not log mnemonics, seeds, wallet passwords, private keys, or derived private keys. Address books must never store private keys.</p>
      </section>
      <section class="docs-section" id="mainnet-safety">
        <h2>Mainnet Safety</h2>
        <p>Mainnet has no faucet, no automatic storage self-healing, no testnet difficulty reset, no genesis churn, and strict replay protection. Testnet recovery features do not apply to mainnet.</p>
      </section>
      <section class="docs-section" id="spam-protection">
        <h2>Anti-Spam Model</h2>
        <p>Atho combines minimum fees, the 1,000-atom output rule, the 64-output policy cap, duplicate-input checks, mempool double-spend checks, and wallet transaction PoW to deter spam while keeping fees low for real users.</p>
      </section>
    `
  },
  "replay-protection": {
    title: "Replay Protection",
    eyebrow: "Security",
    summary: "Transactions, signatures, transaction PoW preimages, addresses, peers, storage, UTXOs, mempool entries, and blocks are all network-scoped.",
    keywords: [
      "replay protection",
      "network isolation",
      "mainnet testnet isolation",
      "cross network",
      "transaction replay"
    ],
    topics: [
      { id: "replay-protection", title: "Replay Protection" },
      { id: "replay-protection-transactions", title: "Transactions and Replay Protection", aliases: ["transaction replay protection"] },
      { id: "network-isolation", title: "Network Isolation" }
    ],
    related: [
      { label: "Mainnet vs Testnet", href: "#mainnet-vs-testnet" },
      { label: "Security", href: "#security" },
      { label: "Developer Reference", href: "#developer-reference" }
    ],
    content: `
      <section class="docs-section" id="replay-protection-transactions">
        <h2>Transactions and Replay Protection</h2>
        <p>Transactions, signatures, transaction PoW preimages, addresses, UTXOs, mempool entries, and blocks are network-scoped. A testnet transaction must not be valid on mainnet, and a mainnet transaction must not be valid on testnet.</p>
      </section>
      <section class="docs-section" id="network-isolation">
        <h2>Network Isolation</h2>
        <p>Testnet coins cannot be spent on mainnet. Mainnet coins cannot be spent on testnet. Wrong-network peers and wrong-network addresses should be rejected. Network-scoped storage and chain metadata are part of the same isolation story.</p>
        <div class="docs-example">
          <h3>Example</h3>
          <p>If a user copies a testnet address into a mainnet wallet send flow, the wallet should reject it before the transaction is even built. If a signed testnet transaction reaches a mainnet node anyway, the network-scoped signing and proof domains should still stop replay.</p>
        </div>
      </section>
      <section class="docs-section" id="replay-protection-details">
        <h2>Why Atho Treats Replay Protection as a First-Class Rule</h2>
        <p>Cross-network replay attacks can turn development features into production problems. Atho avoids that by binding transaction data, signing domains, storage identity, and peer/network behavior to the active network context from the start.</p>
      </section>
    `
  },
  "developer-reference": {
    title: "Developer Reference",
    eyebrow: "Developers",
    summary: "Use these constants, formulas, and validation notes when writing tools, docs, tests, API clients, CLI wrappers, or integrations around Atho.",
    keywords: [
      "developer reference",
      "constants",
      "transaction validation",
      "block validation",
      "api notes",
      "cli notes",
      "config paths"
    ],
    topics: [
      { id: "developer-reference", title: "Developer Reference" },
      { id: "constants", title: "Constants" },
      { id: "transaction-validation", title: "Transaction Validation" },
      { id: "block-validation", title: "Block Validation" },
      { id: "wallet-tx-pow-formula", title: "Wallet Transaction PoW Formula" },
      { id: "implementation-language", title: "Implementation Language and Tooling", aliases: ["language choice", "rust", "qt", "python launchers"] },
      { id: "api-notes", title: "API Notes" },
      { id: "cli-notes", title: "CLI Notes" },
      { id: "config-and-paths", title: "Config and Paths" }
    ],
    related: [
      { label: "Wallet Transaction PoW", href: "#wallet-transaction-pow" },
      { label: "Troubleshooting", href: "#troubleshooting" },
      { label: "FAQ", href: "#faq" }
    ],
    content: `
      <section class="docs-section" id="constants">
        <h2>Constants</h2>
        <pre><code>DECIMALS = 8
ATOMS_PER_ATHO = 100_000_000
TARGET_BLOCK_TIME_SECONDS = 100
INITIAL_BLOCK_REWARD_ATOMS = 5_000_000_000
HALVING_INTERVAL_BLOCKS = 1_260_000
TAIL_REWARD_ATOMS = 39_062_500
NORMAL_TX_VALID_AFTER_CONFIRMATIONS = 1
DEFAULT_WALLET_MIN_CONFIRMATIONS = 3
COINBASE_MATURITY_BLOCKS = 100
MIN_TX_FEE_ATOMS = 1
MIN_RELAY_FEE_RATE_ATOMS_PER_VBYTE = 1
MIN_OUTPUT_AMOUNT_ATOMS = 100
MAX_STANDARD_OUTPUTS = 64
TX_POW_HASH = SHA3-256
TX_POW_MIN_BITS = 16
TX_POW_MAX_BITS = 28
TX_POW_DOMAIN = ATHO_TX_POW_V1
TX_SIGN_DOMAIN = ATHO_TX_SIGN_V1</code></pre>
        <pre><code>1 ATHO = 100,000,000 atoms
Blocks per year = 31,536,000 / 100 = 315,360
Annual tail = 0.390625 * 315,360 = 123,187.5 ATHO/year</code></pre>
      </section>
      <section class="docs-section" id="transaction-validation">
        <h2>Transaction Validation</h2>
        <p>Validation rejects unsupported versions, empty outputs, oversized transactions, zero-value outputs, outputs below 100 atoms, more than 64 outputs, duplicate inputs, missing or invalid transaction PoW, malformed witnesses, bad signatures, missing UTXOs, wrong ownership, immature coinbase spends, and fee mismatches.</p>
      </section>
      <section class="docs-section" id="block-validation">
        <h2>Block Validation</h2>
        <p>Block validation checks network ID, height, parent hash, target, proof-of-work, timestamp, merkle and witness roots, coinbase correctness, fees, duplicate transactions, duplicate inputs, transaction validity, and atomic UTXO updates.</p>
      </section>
      <section class="docs-section" id="wallet-tx-pow-formula">
        <h2>Wallet Transaction PoW Formula</h2>
        <p>The implementation chooses policy bits within configured bounds and uses the signed transaction without PoW fields as the proof preimage. The target can scale with transaction size, fee rate, and output count. The resulting transaction carries <code>tx_pow_nonce</code> and <code>tx_pow_bits</code>.</p>
      </section>
      <section class="docs-section" id="implementation-language">
        <h2>Implementation Language and Tooling</h2>
        <p>The core node, mining, storage, validation, and wallet logic live in Rust. That choice gives Atho a systems language with strong memory-safety defaults, predictable performance, and a good fit for cryptography, networking, and storage-heavy validation code.</p>
        <p>The desktop experience uses Qt for a native application surface, while small Python launchers make local mainnet, testnet, and regnet workflows easier to start without asking users to remember long command lines. The website and docs stay static HTML, CSS, and JavaScript so deployment is simple and hosting stays lightweight.</p>
      </section>
      <section class="docs-section" id="api-notes">
        <h2>API Notes</h2>
        <p>API and RPC clients should parse amounts exactly into atoms. Do not send floats for consensus amounts. Address and UTXO endpoints accept <code>min_confirmations</code> or <code>minconf</code>, defaulting to 3 for official-wallet policy while preserving the 1-confirmation consensus floor. Explorer uptime should read <code>node_uptime_seconds</code>; chain age from genesis is exposed separately as <code>chain_uptime_seconds</code>.</p>
      </section>
      <section class="docs-section" id="cli-notes">
        <h2>CLI Notes</h2>
        <pre><code>python runmainnet.py
python runtestnet.py
./target/release/athod --network testnet
./target/release/atho-qt --network testnet --local-node
./target/release/atho-mine --network testnet</code></pre>
      </section>
      <section class="docs-section" id="config-and-paths">
        <h2>Config and Paths</h2>
        <p>Use <code>ATHO_DATA_DIR</code> for an explicit runtime root when needed. Keep mainnet and testnet storage paths separate. Do not point production mainnet at disposable or resettable testnet data.</p>
      </section>
    `
  },
  troubleshooting: {
    title: "Troubleshooting",
    eyebrow: "Developers",
    summary: "Use these focused checks when wallets, nodes, mining, syncing, or testnet state do not behave as expected.",
    keywords: [
      "troubleshooting",
      "wallet issue",
      "sync issue",
      "mining issue",
      "testnet issue",
      "storage mismatch"
    ],
    topics: [
      { id: "troubleshooting", title: "Troubleshooting" }
    ],
    related: [
      { label: "Nodes", href: "#nodes" },
      { label: "Storage and Sync", href: "#storage-and-sync" },
      { label: "FAQ", href: "#faq" }
    ],
    content: `
      <section class="docs-section" id="troubleshooting-wallets">
        <h2>Wallet and Balance Issues</h2>
        <ul>
          <li>If a balance looks wrong after switching wallets, refresh or rescan the active wallet only.</li>
          <li>If imported funds do not appear, confirm the wallet is on the correct network and the node is synced.</li>
          <li>If send selection looks odd, check whether coinbase rewards are still immature or whether selected UTXOs are reserved.</li>
        </ul>
      </section>
      <section class="docs-section" id="troubleshooting-sync">
        <h2>Node and Sync Issues</h2>
        <ul>
          <li>Check network mode, peer count, local height, target height, and recent log output.</li>
          <li>Make sure mainnet data is not pointed at a testnet or regtest storage path.</li>
          <li>If testnet storage changed after a development reset, verify whether the local database still matches the current testnet metadata.</li>
        </ul>
      </section>
      <section class="docs-section" id="troubleshooting-mining">
        <h2>Mining and Testnet Issues</h2>
        <ul>
          <li>If mining appears idle, make sure the node is fully synced and the miner is pointed at the right network.</li>
          <li>If testnet seems stalled, check whether the testnet-only difficulty reset condition should have triggered.</li>
          <li>If you need funds on testnet, request them manually from the Atho team. There is no automated faucet.</li>
        </ul>
      </section>
    `
  },
  faq: {
    title: "FAQ",
    eyebrow: "Developers",
    summary: "Short answers to common questions about fees, mining, wallets, testnet behavior, and network isolation.",
    keywords: [
      "faq",
      "fees",
      "tx pow",
      "faucet",
      "testnet",
      "wallets",
      "sync"
    ],
    topics: [
      { id: "faq", title: "FAQ" }
    ],
    related: [
      { label: "Overview", href: "#overview" },
      { label: "Troubleshooting", href: "#troubleshooting" },
      { label: "Developer Reference", href: "#developer-reference" }
    ],
    content: `
      <section class="docs-section" id="faq-fees">
        <h2>Why Are Fees So Small?</h2>
        <p>Atho combines low atom-denominated fees with wallet transaction PoW, so spam still carries a computational cost without forcing high user fees.</p>
      </section>
      <section class="docs-section" id="faq-faucet">
        <h2>Does Atho Have a Faucet?</h2>
        <p>No. The software has no testnet faucet. Testnet ATHO is distributed manually by the Atho founders or development team.</p>
      </section>
      <section class="docs-section" id="faq-tx-pow">
        <h2>Is Transaction PoW Mining?</h2>
        <p>No. Wallet transaction PoW is a lightweight anti-spam proof generated before broadcast. Block mining is separate proof-of-work for producing blocks.</p>
      </section>
      <section class="docs-section" id="faq-network-isolation">
        <h2>Can Testnet Coins Move to Mainnet?</h2>
        <p>No. Mainnet and testnet are strictly isolated.</p>
      </section>
      <section class="docs-section" id="faq-sync">
        <h2>What Should I Check When Sync Looks Stuck?</h2>
        <p>Check network mode, peer count, reported height, local logs, and whether your storage belongs to the same network. On testnet, resets may require local recovery. Mainnet storage should never auto-reset.</p>
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
