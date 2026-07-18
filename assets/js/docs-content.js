export const docsSectionOrder = [
  "overview",
  "what-is-atho",
  "design-philosophy",
  "falcon-512-and-quantum-security",
  "atho-vs-bitcoin",
  "monetary-policy",
  "units-and-fees",
  "setup",
  "wallets",
  "headless-wallet-and-cli",
  "message-signing",
  "transactions",
  "wallet-transaction-pow",
  "mempool",
  "mining",
  "mining-rpc-and-operator-endpoints",
  "nodes",
  "configuration",
  "peer-network",
  "storage-and-sync",
  "http-api",
  "command-catalog",
  "production-deployment",
  "release-verification",
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
    ids: ["overview", "what-is-atho", "design-philosophy", "falcon-512-and-quantum-security", "atho-vs-bitcoin", "monetary-policy", "units-and-fees", "setup"]
  },
  {
    title: "Payments and Wallets",
    ids: ["wallets", "headless-wallet-and-cli", "message-signing", "transactions", "wallet-transaction-pow", "mempool"]
  },
  {
    title: "Mining and Nodes",
    ids: ["mining", "mining-rpc-and-operator-endpoints", "nodes", "configuration", "peer-network", "storage-and-sync"]
  },
  {
    title: "APIs and Operations",
    ids: ["http-api", "command-catalog", "production-deployment", "release-verification"]
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
      { label: "Atho vs Bitcoin", href: "#atho-vs-bitcoin" },
      { label: "Units and Fees", href: "#units-and-fees" },
      { label: "Setup", href: "#setup" },
      { label: "HTTP API", href: "#http-api" }
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
          <li>Atho is a post-quantum-aware proof-of-work payment network built around a public UTXO model.</li>
          <li>The current software uses 100-second blocks, 8-decimal atom precision, a 100-atom dust floor, a required fee floor of <code>max(600 atoms, 1 atom per serialized byte)</code>, and 10-to-16-bit wallet transaction PoW.</li>
          <li>Genesis is a zero-emission anchor at height <code>0</code>. Ordinary subsidy starts at height <code>1</code> with four bootstrap eras and a permanent tail reward.</li>
          <li>Testnet ATHO is distributed manually by the Atho founders or development team. There is no software faucet in the client or website.</li>
        </ul>
      </section>
    `
  },
  "what-is-atho": {
    title: "What Is Atho?",
    eyebrow: "Start Here",
    summary: "Atho is a post-quantum-aware proof-of-work payment blockchain designed for simple, secure, low-fee digital settlement.",
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
      { label: "Wallets", href: "#wallets" },
      { label: "Setup", href: "#setup" }
    ],
    content: `
      <section class="docs-section" id="what-is-atho">
        <h2>What Is Atho?</h2>
        <p>Atho is a payment-first blockchain. It is not trying to be a general-purpose application platform. Its job is to move value with explicit rules: wallets build and sign transactions, nodes validate them, miners include valid transactions in blocks, and every full node independently verifies the same outcome.</p>
        <p>Atho uses a public UTXO model, exact integer atom accounting, post-quantum-aware transaction signatures, and a thin desktop client over backend-owned chain truth. That combination keeps the system legible for people who have to operate it, debug it, and trust it.</p>
      </section>
      <section class="docs-section" id="core-network-summary">
        <h2>Core Network Summary</h2>
        <div class="docs-table-wrap">
          <table>
            <tbody>
              <tr><th>Ledger Model</th><td>Public UTXO chain</td></tr>
              <tr><th>Block Proof of Work</th><td>SHA3-384</td></tr>
              <tr><th>Transaction Authorization</th><td>Falcon-512 signatures</td></tr>
              <tr><th>Block Time</th><td>100 seconds</td></tr>
              <tr><th>Genesis Subsidy</th><td>0 ATHO at height <code>0</code></td></tr>
              <tr><th>Starting Reward</th><td>8 ATHO from height <code>1</code></td></tr>
              <tr><th>Bootstrap Eras</th><td>8, 4, 2, and 1 ATHO for 1,250,000 blocks each</td></tr>
              <tr><th>Bootstrap Issuance</th><td>18,750,000 ATHO through height <code>5,000,000</code></td></tr>
              <tr><th>Tail Reward</th><td>0.50 ATHO forever from height <code>5,000,001</code></td></tr>
              <tr><th>Normal Confirmations</th><td>1 confirmation at consensus; official wallet default 3 confirmations; users and apps choose their risk policy</td></tr>
              <tr><th>Coinbase Maturity</th><td>100 confirmations</td></tr>
              <tr><th>Max Supply Cap</th><td>None. Atho uses permanent tail emission.</td></tr>
              <tr><th>Smallest Unit</th><td>1 atom</td></tr>
              <tr><th>Required Fee Floor</th><td><code>max(600 atoms, 1 atom per serialized byte)</code></td></tr>
              <tr><th>Transaction Spam Deterrent</th><td>SHA3-256 wallet transaction PoW</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      <section class="docs-section" id="what-makes-atho-different">
        <h2>What Makes Atho Different?</h2>
        <ul>
          <li>Post-quantum-aware transaction signing with Falcon-512.</li>
          <li>One ATHO contains 100,000,000 atoms, so the system keeps Bitcoin-style E-8 precision.</li>
          <li>Wallet transaction PoW adds sender-side spam friction without forcing high base fees.</li>
          <li>A four-era bootstrap schedule plus permanent tail emission keeps a long-term miner security budget instead of relying on a hard supply cap and fee-only security later.</li>
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
        <p>Atho is built around a narrow claim: payment networks are easier to secure when their rules are explicit, local, and auditable. The protocol leans into simple UTXO payments, low fees, proof-of-work mining, post-quantum-aware signatures, and a permanent miner reward budget.</p>
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
    summary: "Atho uses Falcon-512 transaction signatures to keep wallet authorization on a post-quantum-aware footing, accepting larger keys and signatures as the tradeoff.",
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
      { label: "Atho vs Bitcoin", href: "#atho-vs-bitcoin" },
      { label: "Security", href: "#security" }
    ],
    content: `
      <section class="docs-section" id="post-quantum-signatures">
        <h2>What Falcon-512 Does in Atho</h2>
        <p>Falcon-512 is Atho's transaction authorization scheme. When a wallet spends funds, Falcon-512 is the signature system that proves the spender controls the relevant keys. Atho chose it because the project wants the authorization layer to be built around a post-quantum-aware signature design instead of a classical elliptic-curve assumption.</p>
        <p>This does not mean block mining changed. Falcon-512 protects transaction authorization. Proof of Work still secures block production separately.</p>
      </section>
      <section class="docs-section" id="falcon-vs-elliptic-curve">
        <h2>Falcon-512 vs Elliptic Curve Signatures</h2>
        <figure class="docs-figure docs-figure-wide">
          <img src="./assets/media/docs/falcon-512-vs-ecc.svg?v=20260718b" alt="Comparison diagram showing Falcon-512 next to classical elliptic curve signatures, including size tradeoffs and threat-model differences.">
          <figcaption>Falcon-512 is materially larger than a compact classical elliptic-curve signature stack, but Atho accepts that cost for a stronger long-range signature posture.</figcaption>
        </figure>
        <div class="docs-table-wrap">
          <table>
            <thead><tr><th>Property</th><th>Classical Elliptic Curve</th><th>Falcon-512</th></tr></thead>
            <tbody>
              <tr><td>Typical compressed public key</td><td>about 33 bytes</td><td>897 bytes</td></tr>
              <tr><td>Typical signature</td><td>about 64 bytes fixed-width schnorr, or slightly larger variable ECDSA</td><td>about 666 bytes</td></tr>
              <tr><td>Threat posture</td><td>Efficient and compact, but vulnerable to sufficiently capable large-scale quantum attacks</td><td>Larger artifacts, chosen for post-quantum-aware authorization</td></tr>
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
  "atho-vs-bitcoin": {
    title: "Atho vs Bitcoin",
    eyebrow: "Start Here",
    summary: "Atho is best understood as a modern, opinionated Bitcoin-style payment chain: UTXO and proof-of-work at the base layer, but different signatures, emission, block sizing, and anti-spam policy.",
    keywords: [
      "atho vs bitcoin",
      "bitcoin comparison",
      "proof of work comparison",
      "utxo comparison",
      "sha3 384",
      "falcon 512",
      "tail reward"
    ],
    topics: [
      { id: "atho-vs-bitcoin", title: "Atho vs Bitcoin", aliases: ["bitcoin comparison", "like bitcoin"] },
      { id: "comparison-summary", title: "Comparison Summary" },
      { id: "what-atho-changes", title: "What Atho Changes" },
      { id: "comparison-pdf", title: "Full Comparison PDF" }
    ],
    related: [
      { label: "What Is Atho?", href: "#what-is-atho" },
      { label: "Monetary Policy", href: "#monetary-policy" },
      { label: "Wallet Transaction PoW", href: "#wallet-transaction-pow" },
      { label: "Developer Reference", href: "#developer-reference" }
    ],
    content: `
      <section class="docs-section" id="comparison-summary">
        <h2>Comparison Summary</h2>
        <p>Atho shares Bitcoin's payment-chain fundamentals: proof-of-work ordering, public UTXOs, local full-node validation, coinbase issuance, and wallet construction separated from consensus truth. It is not a broad smart-contract platform.</p>
        <p>The major differences are deliberate: Atho uses SHA3-384 block proof-of-work, Falcon-512 transaction authorization, wallet TX-PoW anti-spam friction, a deterministic adaptive block limit, and bootstrap-plus-tail miner rewards instead of Bitcoin's SHA-256d mining, elliptic-curve signatures, fee-market-only spam pressure, fixed block-weight policy, and finite hard cap.</p>
      </section>
      <section class="docs-section" id="what-atho-changes">
        <h2>What Atho Changes</h2>
        <div class="docs-table-wrap">
          <table>
            <thead><tr><th>Area</th><th>Bitcoin</th><th>Atho</th></tr></thead>
            <tbody>
              <tr><td>Base Model</td><td>Proof-of-work UTXO money</td><td>Proof-of-work UTXO money</td></tr>
              <tr><td>Block Hash</td><td>SHA-256d</td><td>SHA3-384</td></tr>
              <tr><td>Transaction Signatures</td><td>secp256k1 ECDSA/Schnorr families</td><td>Falcon-512</td></tr>
              <tr><td>Block Cadence</td><td>About 10 minutes</td><td>100 seconds</td></tr>
              <tr><td>Emission</td><td>Finite 21 million BTC cap</td><td>No cap; 18,750,000 ATHO bootstrap plus 0.50 ATHO tail reward</td></tr>
              <tr><td>Anti-Spam</td><td>Fee market and relay policy</td><td>Required fee floor plus wallet TX-PoW</td></tr>
              <tr><td>Ownership Surface</td><td>Script ecosystem</td><td>Canonical lock-digest ownership model</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      <section class="docs-section" id="comparison-pdf">
        <h2>Full Comparison PDF</h2>
        <p>The full repository-grounded comparison expands the tradeoffs across mining, transaction policy, signature assumptions, network maturity, ecosystem readiness, and long-run miner economics.</p>
        <p><a class="docs-inline-action" href="./assets/files/atho-bitcoin-comparison.pdf">Download Atho vs Bitcoin Comparison</a></p>
      </section>
    `
  },
  "monetary-policy": {
    title: "Monetary Policy",
    eyebrow: "Economics",
    summary: "Atho uses four bootstrap reward eras and a permanent 0.50 ATHO tail reward to support long-term proof-of-work security while keeping fees low for normal payments.",
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
        <p>There is no fixed max supply cap and no premine. Genesis at height <code>0</code> pays no subsidy. Ordinary miner subsidy begins at height <code>1</code>, follows four bootstrap eras of <code>8</code>, <code>4</code>, <code>2</code>, and <code>1</code> ATHO for <code>1,250,000</code> blocks each, then continues forever at a <code>0.50 ATHO</code> tail reward.</p>
        <p>That model is designed for payment-network continuity. Instead of forcing long-term proof-of-work security entirely into fees, Atho keeps a predictable miner subsidy floor in place while optional miner tips can still reward priority inclusion.</p>
      </section>
      <section class="docs-section" id="reward-schedule">
        <h2>Reward Schedule</h2>
        <div class="docs-table-wrap">
          <table>
            <thead><tr><th>Era</th><th>Reward</th><th>Blocks</th><th>Issuance</th></tr></thead>
            <tbody>
              <tr><td>Genesis</td><td>0 ATHO</td><td>Height 0</td><td>0 ATHO</td></tr>
              <tr><td>Bootstrap Era 1</td><td>8 ATHO</td><td>1 ..= 1,250,000</td><td>10,000,000 ATHO</td></tr>
              <tr><td>Bootstrap Era 2</td><td>4 ATHO</td><td>1,250,001 ..= 2,500,000</td><td>5,000,000 ATHO</td></tr>
              <tr><td>Bootstrap Era 3</td><td>2 ATHO</td><td>2,500,001 ..= 3,750,000</td><td>2,500,000 ATHO</td></tr>
              <tr><td>Bootstrap Era 4</td><td>1 ATHO</td><td>3,750,001 ..= 5,000,000</td><td>1,250,000 ATHO</td></tr>
              <tr><td>Tail</td><td>0.50 ATHO</td><td>Height 5,000,001 onward</td><td>157,680 ATHO/year</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      <section class="docs-section" id="tail-emission">
        <h2>Tail Emission</h2>
        <p>For a proof-of-work payment network, relying only on fees can make long-term security harder. Atho's tail reward keeps miners incentivized without forcing high user fees. The percentage impact of new issuance declines over time as total supply grows.</p>
        <pre><code>Blocks per year = 31,536,000 / 100 = 315,360
Annual tail = 0.50 * 315,360 = 157,680 ATHO/year
Tail issuance every 10 years = 1,576,800 ATHO</code></pre>
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
              <tr><td>Tail Start</td><td>18,750,000 ATHO through height 5,000,000, then 0.50 ATHO tail blocks begin at height 5,000,001</td></tr>
              <tr><td>Year 20</td><td>about 19,403,600 ATHO at nominal 100-second cadence</td></tr>
              <tr><td>Year 50</td><td>about 24,134,000 ATHO at nominal 100-second cadence</td></tr>
            </tbody>
          </table>
        </div>
        <p>Tail issuance begins after 5,000,000 reward-bearing bootstrap blocks, roughly year 15.85 at the 100-second target cadence. After that, issuance continues, but its percentage impact declines as total supply grows.</p>
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
        <p>The fee model is simple on purpose: exact atoms, no floats, a mandatory 600-atom floor, and a serialized-byte floor. Wallets may add positive optional tips above the required floor when they want stronger inclusion priority.</p>
        <pre><code>MIN_TX_FEE_ATOMS = 600
MIN_TX_FEE_PER_SERIALIZED_BYTE_ATOMS = 1
MIN_RELAY_FEE_RATE_ATOMS_PER_VBYTE = 1
required_fee_atoms = max(600, serialized_size_bytes * 1)</code></pre>
      </section>
      <section class="docs-section" id="minimum-transaction-fee">
        <h2>Minimum Transaction Fee</h2>
        <p>Every non-coinbase transaction must pay at least <code>max(600 atoms, 1 atom per serialized byte)</code>. A 590-byte transaction therefore pays 600 atoms, while a 650-byte transaction pays 650 atoms.</p>
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
              <tr><td>250 bytes</td><td>600 atoms</td></tr>
              <tr><td>500 bytes</td><td>600 atoms</td></tr>
              <tr><td>650 bytes</td><td>650 atoms</td></tr>
              <tr><td>1,000 bytes</td><td>1,000 atoms</td></tr>
              <tr><td>2,500 bytes</td><td>2,500 atoms</td></tr>
            </tbody>
          </table>
        </div>
        <p>API estimate fields with <code>vbyte</code> in the name are retained for compatibility and priority guidance, but the consensus fee floor is the serialized-byte rule above.</p>
      </section>
    `
  },
  setup: {
    title: "Setup",
    eyebrow: "Start Here",
    summary: "Install the required tools, build Atho, launch the desktop client or a headless node, and verify the local API and CLI are responding.",
    keywords: [
      "setup",
      "install",
      "requirements",
      "clone",
      "build",
      "launcher",
      "headless setup",
      "verify api",
      "first run"
    ],
    topics: [
      { id: "setup", title: "Setup" },
      { id: "setup-requirements", title: "Requirements", aliases: ["dependencies", "install dependencies"] },
      { id: "setup-clone-and-build", title: "Clone and Build", aliases: ["cargo build"] },
      { id: "setup-launchers", title: "Launchers", aliases: ["runmainnet", "runtestnet", "runregnet"] },
      { id: "setup-direct-node", title: "Run a Node Directly", aliases: ["athod", "headless node"] },
      { id: "setup-verify", title: "Verify It Works", aliases: ["health", "status", "api smoke"] },
      { id: "setup-headless-path", title: "Headless Wallet and Miner Path", aliases: ["headless miner", "headless wallet"] }
    ],
    related: [
      { label: "Command Catalog", href: "#command-catalog" },
      { label: "Configuration", href: "#configuration" },
      { label: "HTTP API", href: "#http-api" },
      { label: "Headless Wallet and CLI", href: "#headless-wallet-and-cli" }
    ],
    content: `
      <section class="docs-section" id="setup-requirements">
        <h2>Requirements</h2>
        <p>Use testnet or regnet for evaluation. Mainnet mode exists in the software, but the current deployment guide is preparation material, not a final real-value launch runbook.</p>
        <ul>
          <li>Rust and Cargo from the stable toolchain.</li>
          <li>Git and <code>curl</code> for checkout and Rust installation.</li>
          <li>Python 3 for <code>run/runmainnet.py</code>, <code>run/runtestnet.py</code>, and <code>run/runregnet.py</code>.</li>
          <li>A C/C++ toolchain for native builds.</li>
          <li>Optional OpenCL headers/runtime for GPU mining builds.</li>
        </ul>
        <pre><code>sudo apt-get update
sudo apt-get install -y build-essential ca-certificates curl git pkg-config python3</code></pre>
        <pre><code>git --version
curl --version
rustc --version
cargo --version
python3 --version
cc --version</code></pre>
        <p>If Rust is missing, install it with <code>rustup</code> and reload the shell environment.</p>
        <pre><code>curl https://sh.rustup.rs -sSf | sh
source "$HOME/.cargo/env"</code></pre>
      </section>
      <section class="docs-section" id="setup-clone-and-build">
        <h2>Clone and Build</h2>
        <pre><code>git clone https://github.com/Atho-Labs/Atho-Alpha.git
cd Atho-Alpha
cargo build</code></pre>
        <p>The quick build creates debug binaries under <code>target/debug/</code>. For operator use, build release binaries.</p>
        <pre><code>cargo build --release -p atho-node -p atho-wallet</code></pre>
        <p>For GPU-capable node/miner builds, include the native GPU feature and the desktop client when needed.</p>
        <pre><code>cargo build --release -p atho-node -p atho-wallet -p atho-qt --features gpu-native</code></pre>
      </section>
      <section class="docs-section" id="setup-launchers">
        <h2>Launchers</h2>
        <p>The Python launchers build missing or stale release binaries, prepare runtime directories, and open <code>atho-qt</code> with a managed local node.</p>
        <pre><code>python3 run/runmainnet.py
python3 run/runtestnet.py
python3 run/runregnet.py</code></pre>
        <p>Useful launcher controls:</p>
        <pre><code>python3 run/runtestnet.py --dry-run
python3 run/runtestnet.py --help
python3 run/runtestnet.py --rebuild
python3 run/runtestnet.py --data-dir "$HOME/.local/share/Atho-testnet"</code></pre>
        <p>Use <code>--no-build</code> to require existing current release binaries. Use <code>--network-overrides-local</code> only when intentionally discarding local chain databases before a fresh sync; wallet files are preserved.</p>
      </section>
      <section class="docs-section" id="setup-direct-node">
        <h2>Run a Node Directly</h2>
        <p><code>athod</code> is the standalone node binary. It can run without opening the desktop client.</p>
        <pre><code>cargo run -p atho-node --bin athod -- --network testnet
cargo run -p atho-node --bin athod -- --network regnet --data-dir /tmp/atho-regnet</code></pre>
        <p>For a strictly headless node runtime with no embedded wallet assumptions, disable the wallet runtime.</p>
        <pre><code>ATHO_WALLET_ENABLED=0 cargo run -p atho-node --bin athod -- --network testnet</code></pre>
      </section>
      <section class="docs-section" id="setup-verify">
        <h2>Verify It Works</h2>
        <pre><code>cargo run -p atho-node --bin athod -- status --network testnet
curl http://127.0.0.1:8080/api/v1/health
cargo run -p atho-node --bin atho-cli -- --network testnet getstatus
cargo run -p atho-node --bin atho-cli -- --network testnet getinflationinfo
curl http://127.0.0.1:8080/api/v1/inflation</code></pre>
        <p>Mining/operator HTTP routes are disabled unless explicitly enabled.</p>
        <pre><code>ATHO_API_MINING_ENABLED=1 cargo run -p atho-node --bin athod -- --network testnet
curl http://127.0.0.1:8080/api/v1/mining/info
curl http://127.0.0.1:8080/api/v1/metrics</code></pre>
      </section>
      <section class="docs-section" id="setup-headless-path">
        <h2>Headless Wallet and Miner Path</h2>
        <p>Create an encrypted wallet datafile, issue a receive address, run a walletless node, and mine from a separate terminal.</p>
        <pre><code>read -rsp 'Wallet password: ' ATHO_WALLET_PASSWORD
printf '\n'
export ATHO_WALLET_PASSWORD
export ATHO_WALLET_FILE="$HOME/atho-testnet-wallet.datafile"
cargo run -p atho-wallet --bin atho-wallet -- \
  create testnet --out "$ATHO_WALLET_FILE" \
  --wallet-password-env ATHO_WALLET_PASSWORD
cargo run -p atho-wallet --bin atho-wallet -- \
  getnewaddress --wallet "$ATHO_WALLET_FILE" \
  --wallet-password-env ATHO_WALLET_PASSWORD</code></pre>
        <pre><code>ATHO_WALLET_ENABLED=0 cargo run -p atho-node --bin athod -- --network testnet</code></pre>
        <pre><code>REWARD_ADDRESS='paste-the-issued-testnet-address-here'
cargo run -p atho-node --bin atho-mine -- \
  --network testnet --reward-address "$REWARD_ADDRESS" --loop</code></pre>
        <p>When finished with wallet commands, clear the password material from the terminal.</p>
        <pre><code>unset ATHO_WALLET_PASSWORD</code></pre>
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
      { label: "Headless Wallet and CLI", href: "#headless-wallet-and-cli" },
      { label: "Message Signing", href: "#message-signing" },
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
  "headless-wallet-and-cli": {
    title: "Headless Wallet and CLI",
    eyebrow: "Payments and Wallets",
    summary: "Atho includes standalone binaries for node, RPC, mining, wallet, and address workflows, so operators can run without the desktop client.",
    keywords: [
      "headless",
      "cli",
      "binaries",
      "atho-wallet",
      "atho-address",
      "atho-cli",
      "athod",
      "atho-mine",
      "wallet password",
      "sendmany",
      "listunspent"
    ],
    topics: [
      { id: "headless-wallet-and-cli", title: "Headless Wallet and CLI" },
      { id: "headless-binaries", title: "Headless Binaries", aliases: ["binaries", "release binaries"] },
      { id: "headless-wallet-setup", title: "Wallet Setup", aliases: ["create wallet", "restore wallet"] },
      { id: "headless-wallet-queries", title: "Wallet Queries", aliases: ["getwalletinfo", "getbalance", "listunspent"] },
      { id: "headless-wallet-sends", title: "Headless Sends", aliases: ["send", "sendmany", "dry run"] },
      { id: "address-helper", title: "Address Helper", aliases: ["atho-address"] },
      { id: "cli-rpc-discovery", title: "CLI RPC Discovery", aliases: ["atho-cli help", "rpc commands"] }
    ],
    related: [
      { label: "Setup", href: "#setup" },
      { label: "Command Catalog", href: "#command-catalog" },
      { label: "HTTP API", href: "#http-api" },
      { label: "Message Signing", href: "#message-signing" }
    ],
    content: `
      <section class="docs-section" id="headless-binaries">
        <h2>Headless Binaries</h2>
        <div class="docs-table-wrap">
          <table>
            <thead><tr><th>Binary</th><th>Role</th><th>Common Use</th></tr></thead>
            <tbody>
              <tr><td><code>athod</code></td><td>Standalone node</td><td>Sync, validate, serve local RPC/API, provide templates</td></tr>
              <tr><td><code>atho-cli</code></td><td>Command-style RPC client</td><td>Status, fees, mining info, templates, submit block/header</td></tr>
              <tr><td><code>atho-mine</code></td><td>Standalone miner</td><td>CPU/GPU mining against a running local node</td></tr>
              <tr><td><code>atho-wallet</code></td><td>Standalone wallet</td><td>Create, restore, inspect, sign, query, send</td></tr>
              <tr><td><code>atho-address</code></td><td>Address helper</td><td>Inspect addresses and derive addresses from a mnemonic</td></tr>
              <tr><td><code>atho-qt</code></td><td>Desktop client</td><td>Native wallet UI with managed local-node mode</td></tr>
            </tbody>
          </table>
        </div>
        <pre><code>cargo build --release -p atho-node -p atho-wallet
cargo build --release -p atho-node -p atho-wallet -p atho-qt --features gpu-native</code></pre>
      </section>
      <section class="docs-section" id="headless-wallet-setup">
        <h2>Wallet Setup</h2>
        <p>Run wallet examples from the repository root. Operational systems should supply <code>ATHO_WALLET_PASSWORD</code> from a secret manager rather than an interactive shell.</p>
        <pre><code>export ATHO_NETWORK=testnet
export ATHO_WALLET_FILE="$HOME/atho-testnet-wallet.datafile"
read -rsp 'Wallet password: ' ATHO_WALLET_PASSWORD
printf '\n'
export ATHO_WALLET_PASSWORD</code></pre>
        <pre><code>cargo run -p atho-wallet --bin atho-wallet -- \
  create "$ATHO_NETWORK" --out "$ATHO_WALLET_FILE" \
  --wallet-password-env ATHO_WALLET_PASSWORD</code></pre>
        <pre><code>read -rsp 'Mnemonic phrase: ' ATHO_MNEMONIC
printf '\n'
cargo run -p atho-wallet --bin atho-wallet -- \
  restore "$ATHO_NETWORK" --out "$ATHO_WALLET_FILE" \
  --phrase "$ATHO_MNEMONIC" \
  --wallet-password-env ATHO_WALLET_PASSWORD
unset ATHO_MNEMONIC</code></pre>
      </section>
      <section class="docs-section" id="headless-wallet-queries">
        <h2>Wallet Queries</h2>
        <pre><code>cargo run -p atho-wallet --bin atho-wallet -- \
  getwalletinfo --wallet "$ATHO_WALLET_FILE" \
  --wallet-password-env ATHO_WALLET_PASSWORD
cargo run -p atho-wallet --bin atho-wallet -- \
  getnewaddress --wallet "$ATHO_WALLET_FILE" \
  --wallet-password-env ATHO_WALLET_PASSWORD
cargo run -p atho-wallet --bin atho-wallet -- \
  getrawchangeaddress --wallet "$ATHO_WALLET_FILE" \
  --wallet-password-env ATHO_WALLET_PASSWORD</code></pre>
        <pre><code>cargo run -p atho-wallet --bin atho-wallet -- \
  listaddresses --wallet "$ATHO_WALLET_FILE" \
  --generated --kind receive --count 10 \
  --wallet-password-env ATHO_WALLET_PASSWORD
cargo run -p atho-wallet --bin atho-wallet -- \
  getbalance --network "$ATHO_NETWORK" --cookie-auth \
  --wallet "$ATHO_WALLET_FILE" \
  --wallet-password-env ATHO_WALLET_PASSWORD
cargo run -p atho-wallet --bin atho-wallet -- \
  listunspent --network "$ATHO_NETWORK" --cookie-auth \
  --wallet "$ATHO_WALLET_FILE" --discovery-limit 0 \
  --wallet-password-env ATHO_WALLET_PASSWORD</code></pre>
      </section>
      <section class="docs-section" id="headless-wallet-sends">
        <h2>Headless Sends</h2>
        <p>The wallet pays the required consensus fee floor of <code>max(600 atoms, 1 atom per serialized byte)</code>. Add <code>--tip-rate N</code> only when you want extra priority above that floor.</p>
        <pre><code>RECIPIENT_ADDRESS='paste-a-testnet-address-here'
cargo run -p atho-wallet --bin atho-wallet -- \
  send --network "$ATHO_NETWORK" --cookie-auth \
  --wallet "$ATHO_WALLET_FILE" \
  --address "$RECIPIENT_ADDRESS" --amount 1.25000000 \
  --wallet-password-env ATHO_WALLET_PASSWORD</code></pre>
        <pre><code>cargo run -p atho-wallet --bin atho-wallet -- \
  send --network "$ATHO_NETWORK" --cookie-auth \
  --wallet "$ATHO_WALLET_FILE" \
  --address "$RECIPIENT_ADDRESS" --amount 1.25000000 --dry-run \
  --wallet-password-env ATHO_WALLET_PASSWORD</code></pre>
        <pre><code>RECIPIENT_A='paste-the-first-testnet-address-here'
RECIPIENT_B='paste-the-second-testnet-address-here'
cargo run -p atho-wallet --bin atho-wallet -- \
  sendmany --network "$ATHO_NETWORK" --cookie-auth \
  --wallet "$ATHO_WALLET_FILE" \
  --recipient "$RECIPIENT_A=1.25000000" \
  --recipient "$RECIPIENT_B=0.50000000" \
  --wallet-password-env ATHO_WALLET_PASSWORD</code></pre>
      </section>
      <section class="docs-section" id="address-helper">
        <h2>Address Helper</h2>
        <pre><code>ADDRESS='paste-an-atho-address-here'
cargo run -p atho-wallet --bin atho-address -- inspect "$ADDRESS"</code></pre>
        <pre><code>read -rsp 'Mnemonic phrase: ' ATHO_MNEMONIC
printf '\n'
cargo run -p atho-wallet --bin atho-address -- \
  generate prunetest --phrase "$ATHO_MNEMONIC" --count 3
unset ATHO_MNEMONIC</code></pre>
      </section>
      <section class="docs-section" id="cli-rpc-discovery">
        <h2>CLI RPC Discovery</h2>
        <p><code>atho-cli</code> discovers and runs the command-style RPC surface. Use cookie auth for local nodes when available, and avoid putting RPC passwords directly in shell history.</p>
        <pre><code>cargo run -p atho-node --bin atho-cli -- --help
cargo run -p atho-node --bin atho-cli -- help
cargo run -p atho-node --bin atho-cli -- help getblocktemplate
cargo run -p atho-node --bin atho-cli -- help mining
cargo run -p atho-node --bin atho-cli -- --network testnet --cookie-auth getstatus</code></pre>
        <pre><code>unset ATHO_WALLET_PASSWORD</code></pre>
      </section>
    `
  },
  "message-signing": {
    title: "Message Signing",
    eyebrow: "Payments and Wallets",
    summary: "Atho wallets can sign and verify local address ownership proofs without creating a payment or exposing keys through HTTP.",
    keywords: [
      "message signing",
      "signmessage",
      "verifymessage",
      "operator proof",
      "address proof",
      "ATHO_MESSAGE_SIGN_V1"
    ],
    topics: [
      { id: "message-signing", title: "Message Signing" },
      { id: "message-sign", title: "Sign a Message", aliases: ["signmessage"] },
      { id: "message-proof-format", title: "Proof Format", aliases: ["signed message block"] },
      { id: "message-verify", title: "Verify a Message", aliases: ["verifymessage"] },
      { id: "message-signing-boundary", title: "Security Boundary" }
    ],
    related: [
      { label: "Wallets", href: "#wallets" },
      { label: "Headless Wallet and CLI", href: "#headless-wallet-and-cli" },
      { label: "HTTP API", href: "#http-api" },
      { label: "Security", href: "#security" }
    ],
    content: `
      <section class="docs-section" id="message-sign">
        <h2>Sign a Message</h2>
        <p>The desktop client exposes message signing in Settings. The same workflow is available headlessly through <code>atho-wallet signmessage</code>.</p>
        <pre><code>export ATHO_WALLET_FILE="$HOME/atho-wallet.datafile"
export SIGNING_ADDRESS='paste-a-wallet-owned-address-here'
read -rsp 'Wallet password: ' ATHO_WALLET_PASSWORD
printf '\n'
export ATHO_WALLET_PASSWORD
cargo run -p atho-wallet --bin atho-wallet -- \
  signmessage --wallet "$ATHO_WALLET_FILE" \
  --address "$SIGNING_ADDRESS" --message "Atho operator proof" \
  --out "$HOME/atho-proof.txt" \
  --wallet-password-env ATHO_WALLET_PASSWORD
unset ATHO_WALLET_PASSWORD</code></pre>
      </section>
      <section class="docs-section" id="message-proof-format">
        <h2>Proof Format</h2>
        <pre><code>-----BEGIN ATHO SIGNED MESSAGE-----
Version: 1
Network: atho-mainnet
Address: A...
PublicKeyHex: ...
MessageHex: ...
SignatureHex: ...
-----END ATHO SIGNED MESSAGE-----</code></pre>
        <p>The proof includes address, network, Falcon public key, exact message bytes, and Falcon signature. It proves address control; it does not authorize a payment.</p>
      </section>
      <section class="docs-section" id="message-verify">
        <h2>Verify a Message</h2>
        <pre><code>cargo run -p atho-wallet --bin atho-wallet -- verifymessage --proof-file "$HOME/atho-proof.txt"</code></pre>
        <p>Verification checks the address checksum and network, that the public key derives to the address payment digest, that the signature uses the <code>ATHO_MESSAGE_SIGN_V1</code> domain, and that the message bytes match exactly.</p>
      </section>
      <section class="docs-section" id="message-signing-boundary">
        <h2>Security Boundary</h2>
        <p>Signing stays local to the wallet. Atho does not expose private-key message signing through the public HTTP API, and message proofs are never valid transaction signatures.</p>
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
TX_POW_MIN_BITS = 10
TX_POW_MAX_BITS = 16
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
        <p>The target starts at 10 bits, adds work at transaction-vsize thresholds above 500, 1,000, and 2,000 vbytes, adds smaller increments for larger input and output counts, and clamps to 16 bits. Larger or more complex transactions work a little harder without turning the send flow into full mining.</p>
        <div class="docs-example">
          <h3>Example</h3>
          <p>The 2026-07-15 benchmark shows ordinary signed Falcon payments naturally landing at 12 bits, with low-end reference-host P95 latency under 14 ms. Maximum-output and large consolidation shapes hit the 16-bit ceiling and measured roughly 55-85 ms P95 in automatic mode on that host.</p>
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
      { label: "Mining RPC and Operator Endpoints", href: "#mining-rpc-and-operator-endpoints" },
      { label: "Command Catalog", href: "#command-catalog" },
      { label: "Mainnet vs Testnet", href: "#mainnet-vs-testnet" }
    ],
    content: `
      <section class="docs-section" id="proof-of-work">
        <h2>Proof of Work</h2>
        <p>Miners search for a block header nonce that satisfies the active target. Every full node independently verifies the block hash against that target before accepting the block.</p>
      </section>
      <section class="docs-section" id="block-rewards">
        <h2>Block Rewards</h2>
        <p>Genesis pays 0 ATHO at height <code>0</code>. Ordinary rewards begin at height <code>1</code>: 8 ATHO, 4 ATHO, 2 ATHO, and 1 ATHO across four 1,250,000-block bootstrap eras, then a permanent 0.50 ATHO tail reward from height <code>5,000,001</code>. Valid transaction fees and optional tips are added on top.</p>
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
  "mining-rpc-and-operator-endpoints": {
    title: "Mining RPC and Operator Endpoints",
    eyebrow: "Mining and Nodes",
    summary: "Atho exposes node-side mining templates, readiness, submission, and metrics, while pool software owns worker auth, shares, payouts, and dashboards.",
    keywords: [
      "mining rpc",
      "operator endpoints",
      "getblocktemplate",
      "getmininginfo",
      "submitblock",
      "submitheader",
      "pool integration",
      "metrics"
    ],
    topics: [
      { id: "mining-rpc-and-operator-endpoints", title: "Mining RPC and Operator Endpoints" },
      { id: "operator-boundary", title: "Operator Boundary", aliases: ["pool software"] },
      { id: "operator-start-node", title: "Start a Node for Operator Use" },
      { id: "operator-cli-commands", title: "RPC and CLI Commands", aliases: ["getblocktemplate", "getmininginfo", "submitblock"] },
      { id: "operator-http-routes", title: "HTTP Routes", aliases: ["mining api"] },
      { id: "operator-pool-loop", title: "Typical Pool Loop" },
      { id: "operator-errors", title: "Common Operator Errors" }
    ],
    related: [
      { label: "Mining", href: "#mining" },
      { label: "HTTP API", href: "#http-api" },
      { label: "Command Catalog", href: "#command-catalog" },
      { label: "Production Deployment", href: "#production-deployment" }
    ],
    content: `
      <section class="docs-section" id="operator-boundary">
        <h2>Operator Boundary</h2>
        <p><code>athod</code> provides the validated node contract: candidate block templates, mining readiness, solved-block submission, header validation, and metrics. Pool software still owns Stratum, share accounting, vardiff, payouts, worker authentication, and operator dashboards.</p>
      </section>
      <section class="docs-section" id="operator-start-node">
        <h2>Start a Node for Operator Use</h2>
        <pre><code>cargo run -p atho-node --bin athod -- --network testnet</code></pre>
        <p>Enable mining/operator HTTP routes only for local operator tooling or a controlled pool daemon.</p>
        <pre><code>ATHO_API_MINING_ENABLED=1 cargo run -p atho-node --bin athod -- --network testnet</code></pre>
      </section>
      <section class="docs-section" id="operator-cli-commands">
        <h2>RPC and CLI Commands</h2>
        <div class="docs-table-wrap">
          <table>
            <thead><tr><th>Command</th><th>Purpose</th><th>Important Fields or Result</th></tr></thead>
            <tbody>
              <tr><td><code>getblocktemplate</code></td><td>Full candidate block template</td><td>height, previous hash, target, transaction count, fees, header bytes, nonce offset, block</td></tr>
              <tr><td><code>gettemplateinfo</code></td><td>Lightweight template summary</td><td>height, target, fees, header bytes, coinbase txid</td></tr>
              <tr><td><code>getmininginfo</code></td><td>Readiness and sync status</td><td>safe_to_mine, mining_allowed, blocked reason, sync mode, reward address</td></tr>
              <tr><td><code>getnetworkhashps</code></td><td>Recent chain-work hashrate estimate</td><td>optional nblocks and height arguments</td></tr>
              <tr><td><code>setminingrewardaddress</code></td><td>Set payout address on a running node</td><td>rejects wrong-network addresses</td></tr>
              <tr><td><code>submitheader</code></td><td>Header-level validation and sync-view update</td><td>does not advance UTXO state by itself</td></tr>
              <tr><td><code>submitblock</code></td><td>Full solved-block validation and connection</td><td>accepted, stale, or rejected</td></tr>
            </tbody>
          </table>
        </div>
        <pre><code>cargo run -p atho-node --bin atho-cli -- --network testnet getmininginfo
cargo run -p atho-node --bin atho-cli -- --network testnet getblocktemplate
cargo run -p atho-node --bin atho-cli -- --network testnet gettemplateinfo</code></pre>
        <pre><code>REWARD_ADDRESS='paste-a-testnet-address-here'
cargo run -p atho-node --bin atho-cli -- \
  --network testnet setminingrewardaddress "$REWARD_ADDRESS"</code></pre>
        <pre><code>RAW_HEADER_HEX='paste-canonical-header-hex-here'
cargo run -p atho-node --bin atho-cli -- \
  --network testnet submitheader "$RAW_HEADER_HEX"
RAW_BLOCK_HEX='paste-canonical-block-hex-here'
cargo run -p atho-node --bin atho-cli -- \
  --network testnet submitblock "$RAW_BLOCK_HEX"</code></pre>
      </section>
      <section class="docs-section" id="operator-http-routes">
        <h2>HTTP Routes</h2>
        <p>The mining routes are JSON-wrapped like the rest of the Atho HTTP API and require <code>ATHO_API_MINING_ENABLED=1</code>.</p>
        <div class="docs-table-wrap">
          <table>
            <thead><tr><th>Route</th><th>Purpose</th></tr></thead>
            <tbody>
              <tr><td><code>GET /api/v1/mining/info</code></td><td>Mining readiness and blocked reason view</td></tr>
              <tr><td><code>GET /api/v1/mining/template</code></td><td>Full current candidate block template</td></tr>
              <tr><td><code>GET /api/v1/mining/template/summary</code></td><td>Lightweight mining template summary</td></tr>
              <tr><td><code>GET /api/v1/metrics</code></td><td>Read-only operator metrics snapshot</td></tr>
              <tr><td><code>POST /api/v1/mining/submitblock</code></td><td>Submit solved raw block</td></tr>
              <tr><td><code>POST /api/v1/submitblock</code></td><td>Compatibility alias for solved-block submit</td></tr>
              <tr><td><code>POST /api/v1/mining/submitheader</code></td><td>Submit raw block header</td></tr>
              <tr><td><code>POST /api/v1/submitheader</code></td><td>Compatibility alias for header submit</td></tr>
            </tbody>
          </table>
        </div>
        <pre><code>curl http://127.0.0.1:8080/api/v1/mining/info
curl http://127.0.0.1:8080/api/v1/mining/template/summary
curl http://127.0.0.1:8080/api/v1/metrics</code></pre>
        <pre><code>RAW_BLOCK_HEX='paste-canonical-block-hex-here'
curl -X POST http://127.0.0.1:8080/api/v1/mining/submitblock \
  -H 'Content-Type: application/json' \
  -d "{\"raw_block_hex\":\"$RAW_BLOCK_HEX\"}"</code></pre>
      </section>
      <section class="docs-section" id="operator-pool-loop">
        <h2>Typical Pool Loop</h2>
        <ol>
          <li>Call <code>getblocktemplate</code>.</li>
          <li>Distribute work using pool-owned software.</li>
          <li>Receive a winning worker result.</li>
          <li>Rebuild the solved block locally.</li>
          <li>Call <code>submitblock</code>.</li>
          <li>Handle accepted, stale, or rejected outcomes.</li>
        </ol>
      </section>
      <section class="docs-section" id="operator-errors">
        <h2>Common Operator Errors</h2>
        <ul>
          <li><code>mining_api_disabled</code>: enable <code>ATHO_API_MINING_ENABLED=1</code>.</li>
          <li><code>node_not_synced</code>: wait until the node is safe to mine.</li>
          <li><code>stale_block</code>: the solved block no longer extends the active tip.</li>
          <li><code>rejected_block</code> or <code>rejected_header</code>: validation rejected the submitted data.</li>
          <li><code>ATHO-MINE-003</code>: configure a valid same-network mining reward address.</li>
        </ul>
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
      { label: "Configuration", href: "#configuration" },
      { label: "HTTP API", href: "#http-api" },
      { label: "Developer Reference", href: "#developer-reference" }
    ],
    content: `
      <section class="docs-section" id="running-a-node">
        <h2>Running a Node</h2>
        <pre><code>python3 run/runmainnet.py
python3 run/runtestnet.py
cargo run -p atho-node --bin athod -- --network testnet</code></pre>
        <p>The Qt client can manage a local node with <code>--local-node</code>. Public RPC should be protected and intentionally configured.</p>
      </section>
      <section class="docs-section" id="node-responsibilities">
        <h2>What the Node Owns</h2>
        <p>The node owns transaction validation, mempool policy, block validation, peer sync, chain selection, and durable storage. Wallets and UIs can display that state, but they should not redefine it.</p>
      </section>
    `
  },
  configuration: {
    title: "Configuration",
    eyebrow: "Mining and Nodes",
    summary: "Atho uses CLI flags, environment variables, and an optional owner-only atho.conf file for network, storage, RPC, API, P2P, mining, wallet, and TX-PoW settings.",
    keywords: [
      "configuration",
      "atho.conf",
      "environment variables",
      "ports",
      "data directory",
      "p2p advertise",
      "api flags",
      "wallet flags",
      "tx pow threads"
    ],
    topics: [
      { id: "configuration", title: "Configuration" },
      { id: "configuration-networks", title: "Networks and Ports", aliases: ["ports", "network ids"] },
      { id: "configuration-data-paths", title: "Data Paths", aliases: ["ATHO_DATA_DIR", "ATHO_WALLET_DIR"] },
      { id: "configuration-file", title: "Operator Config File", aliases: ["atho.conf"] },
      { id: "configuration-node-flags", title: "Node Flags" },
      { id: "configuration-p2p", title: "P2P" },
      { id: "configuration-api", title: "API Flags" },
      { id: "configuration-mining-wallet", title: "Mining and Headless Wallet" },
      { id: "configuration-tx-pow-solver", title: "Transaction PoW Solver" }
    ],
    related: [
      { label: "Setup", href: "#setup" },
      { label: "Nodes", href: "#nodes" },
      { label: "HTTP API", href: "#http-api" },
      { label: "Production Deployment", href: "#production-deployment" }
    ],
    content: `
      <section class="docs-section" id="configuration-networks">
        <h2>Networks and Ports</h2>
        <div class="docs-table-wrap">
          <table>
            <thead><tr><th>Network</th><th>CLI Value</th><th>P2P Port</th><th>RPC Port</th><th>Use</th></tr></thead>
            <tbody>
              <tr><td>Mainnet</td><td><code>mainnet</code></td><td>56000</td><td>9010</td><td>Reviewed deployment preparation</td></tr>
              <tr><td>Testnet</td><td><code>testnet</code></td><td>9100</td><td>9110</td><td>Public evaluation</td></tr>
              <tr><td>Regnet</td><td><code>regnet</code> or <code>regtest</code></td><td>9200</td><td>9210</td><td>Local deterministic testing</td></tr>
              <tr><td>Prunetest</td><td><code>prunetest</code></td><td>9300</td><td>9310</td><td>Low-difficulty pruning/storage testing</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      <section class="docs-section" id="configuration-data-paths">
        <h2>Data Paths</h2>
        <p><code>ATHO_DATA_DIR</code> sets the runtime root for node databases, logs, chain exports, audit files, and quarantine data. If unset, Atho uses the platform data directory: Linux <code>$XDG_DATA_HOME/Atho</code> or <code>$HOME/.local/share/Atho</code>, macOS <code>$HOME/Library/Application Support/Atho</code>, and Windows <code>%APPDATA%\\Atho</code>.</p>
        <p><code>ATHO_WALLET_DIR</code> can override the wallet directory. Wallet data is intentionally separate from ordinary chain wipes.</p>
        <pre><code>export ATHO_DATA_DIR="$HOME/.local/share/Atho-testnet"
export ATHO_WALLET_DIR="$HOME/.local/share/Atho-testnet/wallet"</code></pre>
      </section>
      <section class="docs-section" id="configuration-file">
        <h2>Operator Config File</h2>
        <p>When <code>atho.conf</code> does not exist, the node creates an owner-only file. Configuration precedence is built-in defaults, then <code>atho.conf</code>, then environment variables, then explicit CLI flags where a flag exists.</p>
        <pre><code>network=testnet
rpcbind=127.0.0.1
rpcport=9110
rpccookieauth=1
wallet=0
api=1
apiwallet=0
apimining=0</code></pre>
        <p>Common keys include <code>network</code>, <code>rpcbind</code>, <code>rpcport</code>, <code>rpcauth</code>, <code>rpccookieauth</code>, <code>miningrewardaddress</code>, <code>wallet</code>, <code>walletrequireencryption</code>, <code>maxmempool</code>, <code>maxmempooltx</code>, <code>prune</code>, <code>dbcache</code>, <code>maxconnections</code>, <code>fastsync</code>, <code>backgroundvalidation</code>, <code>checkpointsync</code>, <code>api</code>, <code>apiwallet</code>, and <code>apimining</code>. Do not store plaintext RPC passwords in the file.</p>
      </section>
      <section class="docs-section" id="configuration-node-flags">
        <h2>Node Flags</h2>
        <pre><code>export ATHO_NETWORK=testnet
export ATHO_DATA_DIR="$HOME/.local/share/Atho-testnet"
export ATHO_WALLET_ENABLED=0
export ATHO_RPC_ADDR=127.0.0.1:9110
export ATHO_P2P_ADDR=0.0.0.0:9100
cargo run -p atho-node --bin athod -- --network "$ATHO_NETWORK"</code></pre>
        <p>Useful flags include <code>--network &lt;mainnet|testnet|regnet|prunetest&gt;</code>, <code>--data-dir PATH</code>, <code>--rpc-addr HOST:PORT</code>, <code>--p2p-addr HOST:PORT</code>, <code>--peer HOST:PORT</code>, <code>--public-rpc</code>, and <code>--network-overrides-local</code>. RPC binds to loopback by default; public RPC requires explicit opt-in.</p>
      </section>
      <section class="docs-section" id="configuration-p2p">
        <h2>P2P</h2>
        <p><code>ATHO_P2P_ADDR</code> overrides the local P2P bind. <code>ATHO_P2P_ADVERTISE_ADDR</code> declares the reachable address relayed to peers, which matters for NAT, port-forwarding, or translated deployments.</p>
        <pre><code>export ATHO_P2P_ADDR=0.0.0.0:9100
export ATHO_P2P_ADVERTISE_ADDR="203.0.113.10:9100"
export ATHO_P2P_PEERS="127.0.0.1:9200,127.0.0.1:9201"</code></pre>
        <p>If no explicit peers are set, testnet uses DNS seeds and built-in bootstrap peers. Sync peers must advertise both full-block and full-witness service bits.</p>
      </section>
      <section class="docs-section" id="configuration-api">
        <h2>API Flags</h2>
        <p>The HTTP API is enabled by default on <code>127.0.0.1:8080</code>, local, read-only, rate-limited, and CORS-restricted.</p>
        <div class="docs-table-wrap">
          <table>
            <thead><tr><th>Variable</th><th>Purpose</th></tr></thead>
            <tbody>
              <tr><td><code>ATHO_API_ENABLED</code></td><td>Enable or disable HTTP API</td></tr>
              <tr><td><code>ATHO_API_BIND</code></td><td>Bind address</td></tr>
              <tr><td><code>ATHO_API_PORT</code></td><td>TCP port</td></tr>
              <tr><td><code>ATHO_API_PUBLIC_READ_ONLY</code></td><td>Read-only public profile flag</td></tr>
              <tr><td><code>ATHO_API_WALLET_ENABLED</code></td><td>Enable raw transaction broadcast routes</td></tr>
              <tr><td><code>ATHO_API_MINING_ENABLED</code></td><td>Enable mining/operator routes</td></tr>
              <tr><td><code>ATHO_API_ALLOWED_ORIGINS</code></td><td>Comma-separated CORS allowlist</td></tr>
              <tr><td><code>ATHO_API_RATE_LIMIT_ENABLED</code></td><td>Enable request throttling</td></tr>
              <tr><td><code>ATHO_API_RATE_LIMIT_RPM</code></td><td>Standard request rate</td></tr>
              <tr><td><code>ATHO_API_HEAVY_RATE_LIMIT_RPM</code></td><td>Heavy endpoint request rate</td></tr>
              <tr><td><code>ATHO_API_MAX_RESPONSE_BYTES</code></td><td>Response cap</td></tr>
              <tr><td><code>ATHO_EXPLORER_INDEX_ENABLED</code></td><td>Explorer index maintenance</td></tr>
              <tr><td><code>ATHO_EXPLORER_SNAPSHOT_ENABLED</code></td><td>Explorer snapshot persistence</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      <section class="docs-section" id="configuration-mining-wallet">
        <h2>Mining and Headless Wallet</h2>
        <p><code>atho-mine</code> accepts <code>--network</code>, <code>--rpc-addr</code>, <code>--reward-address</code>, <code>--cores</code>, <code>--backend &lt;cpu|gpu|auto&gt;</code>, <code>--probe-gpu</code>, <code>--loop</code>, and <code>--retry-delay SECS</code>.</p>
        <p><code>atho-wallet</code> accepts wallet password material through <code>--wallet-password</code>, <code>--wallet-password-env VAR</code>, or <code>--wallet-password-stdin</code>. It accepts RPC access controls including <code>--network</code>, <code>--rpc-url</code>, <code>--cookie-auth</code>, <code>--cookie-file</code>, <code>--rpcuser</code>, and <code>--rpcpassword</code>.</p>
        <p>Wallet scan controls include <code>--discovery-limit N</code>, <code>--discovery-limit 0</code> for recorded addresses only, and <code>--min-confirmations N</code> to raise local spendability above consensus minimums.</p>
      </section>
      <section class="docs-section" id="configuration-tx-pow-solver">
        <h2>Transaction PoW Solver</h2>
        <p>TX-PoW bits are consensus-derived and cannot be changed locally. These variables only control how much local CPU the wallet uses while searching for the required nonce.</p>
        <div class="docs-table-wrap">
          <table>
            <thead><tr><th>Variable</th><th>Meaning</th></tr></thead>
            <tbody>
              <tr><td><code>ATHO_TX_POW_AUTO_THREADS</code></td><td>Automatic thread selection, default true</td></tr>
              <tr><td><code>ATHO_TX_POW_THREAD_PERCENT</code></td><td>Logical CPU percentage, default 75</td></tr>
              <tr><td><code>ATHO_TX_POW_MAX_THREADS</code></td><td>Optional hard worker cap</td></tr>
              <tr><td><code>ATHO_TX_POW_MIN_THREADS</code></td><td>Minimum workers, default 1</td></tr>
            </tbody>
          </table>
        </div>
        <pre><code>export ATHO_TX_POW_MAX_THREADS=2
python3 run/runtestnet.py</code></pre>
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
  "http-api": {
    title: "HTTP API",
    eyebrow: "APIs and Operations",
    summary: "Atho includes a local HTTP API for health, status, explorer data, mempool, fees, supply, peer data, mining/operator reads, metrics, and gated write routes.",
    keywords: [
      "http api",
      "api",
      "endpoints",
      "curl",
      "health",
      "status",
      "fees",
      "supply",
      "mempool",
      "broadcast",
      "metrics"
    ],
    topics: [
      { id: "http-api", title: "HTTP API" },
      { id: "api-start", title: "Start the API", aliases: ["base url", "health check"] },
      { id: "api-production-posture", title: "Production Posture", aliases: ["auth", "exposure"] },
      { id: "api-read-endpoints", title: "Read Endpoints", aliases: ["get endpoints"] },
      { id: "api-write-endpoints", title: "Write Endpoints", aliases: ["post endpoints", "broadcast"] },
      { id: "api-field-semantics", title: "Field Semantics", aliases: ["confirmations", "uptime", "supply", "fees"] },
      { id: "api-common-errors", title: "Common API Errors" }
    ],
    related: [
      { label: "Configuration", href: "#configuration" },
      { label: "Mining RPC and Operator Endpoints", href: "#mining-rpc-and-operator-endpoints" },
      { label: "Command Catalog", href: "#command-catalog" },
      { label: "Production Deployment", href: "#production-deployment" }
    ],
    content: `
      <section class="docs-section" id="api-start">
        <h2>Start the API</h2>
        <p>The API starts with <code>athod</code> by default and binds to <code>127.0.0.1:8080</code>.</p>
        <pre><code>cargo run -p atho-node --bin athod -- --network testnet</code></pre>
        <pre><code>API_URL='http://127.0.0.1:8080'
curl --fail --silent --show-error "$API_URL/api/v1/health"
curl --fail --silent --show-error "$API_URL/api/v1/status"
curl --fail --silent --show-error "$API_URL/api/v1/fees"
curl --fail --silent --show-error "$API_URL/api/v1/supply"
curl --fail --silent --show-error "$API_URL/api/v1/metrics"</code></pre>
      </section>
      <section class="docs-section" id="api-production-posture">
        <h2>Production Posture</h2>
        <div class="docs-table-wrap">
          <table>
            <tbody>
              <tr><th>Default Bind</th><td><code>127.0.0.1</code></td></tr>
              <tr><th>Default Mode</th><td>Read-only</td></tr>
              <tr><th>Wallet/Admin/Mining HTTP Routes</th><td>Disabled by default</td></tr>
              <tr><th>Default CORS Allowlist</th><td><code>https://atho.io</code>, <code>https://www.atho.io</code></td></tr>
              <tr><th>Default Rate Limit</th><td>180 requests/minute</td></tr>
              <tr><th>Default Heavy Rate Limit</th><td>90 requests/minute</td></tr>
              <tr><th>Default Max Response Size</th><td>1,048,576 bytes</td></tr>
              <tr><th>Built-in HTTP Auth</th><td>None in the current repo</td></tr>
            </tbody>
          </table>
        </div>
        <p>Use the API locally by default. Public read-only exposure should sit behind TLS, request limits, response caching where appropriate, and external access controls. Do not expose wallet, seed, mnemonic, private-key, or privileged mining controls directly to the internet.</p>
      </section>
      <section class="docs-section" id="api-read-endpoints">
        <h2>Read Endpoints</h2>
        <div class="docs-table-wrap">
          <table>
            <thead><tr><th>Endpoint</th><th>Purpose</th></tr></thead>
            <tbody>
              <tr><td><code>GET /api/v1/health</code></td><td>Health/readiness snapshot</td></tr>
              <tr><td><code>GET /api/v1/status</code></td><td>Full status overview</td></tr>
              <tr><td><code>GET /api/v1/tip</code></td><td>Canonical chain tip summary</td></tr>
              <tr><td><code>GET /api/v1/blocks/latest?limit=10</code></td><td>Recent block summaries</td></tr>
              <tr><td><code>GET /api/v1/block/height/&lt;height&gt;</code></td><td>Block detail by height</td></tr>
              <tr><td><code>GET /api/v1/block/hash/&lt;hash&gt;</code></td><td>Block detail by hash</td></tr>
              <tr><td><code>GET /api/v1/tx/&lt;txid&gt;</code></td><td>Transaction detail</td></tr>
              <tr><td><code>GET /api/v1/address/&lt;address&gt;?limit=25&amp;offset=0&amp;min_confirmations=3</code></td><td>Address summary and activity</td></tr>
              <tr><td><code>GET /api/v1/address/&lt;address&gt;/utxos?limit=25&amp;offset=0&amp;min_confirmations=3</code></td><td>Address UTXOs</td></tr>
              <tr><td><code>GET /api/v1/mempool</code></td><td>Mempool listing view</td></tr>
              <tr><td><code>GET /api/v1/mempool/summary</code></td><td>Lightweight mempool summary</td></tr>
              <tr><td><code>GET /api/v1/mempool/fee-estimate?tx_vsize=590</code></td><td>Required floor plus priority-fee guidance</td></tr>
              <tr><td><code>GET /api/v1/mempool/tx/&lt;txid&gt;</code></td><td>Single mempool transaction if present</td></tr>
              <tr><td><code>GET /api/v1/metrics</code></td><td>Operator metrics snapshot</td></tr>
              <tr><td><code>GET /api/v1/fees</code></td><td>Fee, dust, tip, and TX-PoW policy summary</td></tr>
              <tr><td><code>GET /api/v1/network/fees</code></td><td>Compatibility alias of <code>/api/v1/fees</code></td></tr>
              <tr><td><code>GET /api/v1/inflation</code></td><td>Focused annualized inflation snapshot</td></tr>
              <tr><td><code>GET /api/v1/supply</code></td><td>Supply, emission, and adaptive block-limit view</td></tr>
              <tr><td><code>GET /api/v1/mining/info</code></td><td>Mining readiness, gated by <code>ATHO_API_MINING_ENABLED=1</code></td></tr>
              <tr><td><code>GET /api/v1/mining/template</code></td><td>Full block template, gated by mining API flag</td></tr>
              <tr><td><code>GET /api/v1/mining/template/summary</code></td><td>Light block template summary, gated by mining API flag</td></tr>
              <tr><td><code>GET /api/v1/peers/summary</code></td><td>Peer counts and health summary</td></tr>
              <tr><td><code>GET /api/v1/network</code></td><td>Network overview</td></tr>
              <tr><td><code>GET /api/v1/network/inflation</code></td><td>Inflation alias route</td></tr>
              <tr><td><code>GET /api/v1/network/stats</code></td><td>Aggregated network stats</td></tr>
              <tr><td><code>GET /api/v1/network/hashrate</code></td><td>Hashrate summary</td></tr>
              <tr><td><code>GET /api/v1/network/uptime</code></td><td>Uptime summary</td></tr>
              <tr><td><code>GET /api/v1/network/peers</code></td><td>Peer list view</td></tr>
              <tr><td><code>GET /api/v1/network/supply</code></td><td>Supply alias route</td></tr>
              <tr><td><code>GET /api/v1/network/difficulty</code></td><td>Difficulty summary</td></tr>
              <tr><td><code>GET /api/v1/network/blocktime</code></td><td>Block interval summary</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      <section class="docs-section" id="api-write-endpoints">
        <h2>Write Endpoints</h2>
        <p>Transaction broadcast routes are disabled unless <code>ATHO_API_WALLET_ENABLED=1</code>. Mining submission routes are disabled unless <code>ATHO_API_MINING_ENABLED=1</code>.</p>
        <div class="docs-table-wrap">
          <table>
            <thead><tr><th>Endpoint</th><th>Purpose</th><th>Recommended Exposure</th></tr></thead>
            <tbody>
              <tr><td><code>POST /api/v1/tx/broadcast</code></td><td>Submit raw transaction</td><td>Local only</td></tr>
              <tr><td><code>POST /api/v1/tx/sendraw</code></td><td>Broadcast alias</td><td>Local only</td></tr>
              <tr><td><code>POST /api/v1/sendrawtransaction</code></td><td>Broadcast alias</td><td>Local only</td></tr>
              <tr><td><code>POST /api/v1/mining/submitblock</code></td><td>Submit solved raw block</td><td>Local only</td></tr>
              <tr><td><code>POST /api/v1/submitblock</code></td><td>Solved-block alias</td><td>Local only</td></tr>
              <tr><td><code>POST /api/v1/mining/submitheader</code></td><td>Submit raw block header</td><td>Local only</td></tr>
              <tr><td><code>POST /api/v1/submitheader</code></td><td>Header-submit alias</td><td>Local only</td></tr>
            </tbody>
          </table>
        </div>
        <pre><code>RAW_TX_HEX='paste-canonical-transaction-hex-here'
curl -X POST http://127.0.0.1:8080/api/v1/tx/broadcast \
  -H 'Content-Type: application/json' \
  -d "{\"raw_tx_hex\":\"$RAW_TX_HEX\"}"</code></pre>
      </section>
      <section class="docs-section" id="api-field-semantics">
        <h2>Field Semantics</h2>
        <ul>
          <li>Normal transactions are consensus-spendable after 1 confirmation. Address and UTXO endpoints default to the official wallet policy of 3 confirmations when <code>min_confirmations</code> or <code>minconf</code> is omitted.</li>
          <li>Coinbase outputs remain unspendable until 100 confirmations, regardless of caller policy.</li>
          <li><code>node_uptime_seconds</code> is process uptime. Chain age from genesis is exposed separately through <code>chain_uptime_seconds</code>.</li>
          <li>Supply routes expose bootstrap-plus-tail fields including tail start, tail reward, annual issuance, current reward, and adaptive block-limit state.</li>
          <li>Fee routes report <code>required_fee_atoms: 600</code>, <code>zero_tip_allowed: true</code>, 1 atom per serialized byte, and TX-PoW min/max bits.</li>
          <li>The node HTTP API does not expose private-key wallet signing or message-signing routes. Build and sign locally, then broadcast final raw transactions only when write routes are enabled.</li>
        </ul>
      </section>
      <section class="docs-section" id="api-common-errors">
        <h2>Common API Errors</h2>
        <p>Common JSON error codes include <code>origin_not_allowed</code>, <code>method_not_allowed</code>, <code>wallet_api_disabled</code>, <code>mining_api_disabled</code>, <code>node_not_synced</code>, <code>stale_block</code>, <code>rejected_transaction</code>, <code>rejected_block</code>, <code>rejected_header</code>, <code>request_too_large</code>, <code>rate_limited</code>, <code>response_too_large</code>, <code>explorer_index_not_ready</code>, <code>invalid_input</code>, and <code>not_found</code>.</p>
      </section>
    `
  },
  "command-catalog": {
    title: "Command Catalog",
    eyebrow: "APIs and Operations",
    summary: "Copy-paste command coverage for builds, launchers, headless nodes, miners, wallets, addresses, RPC commands, tests, and safe data wipes.",
    keywords: [
      "commands",
      "command catalog",
      "copy paste",
      "cargo",
      "athod",
      "atho-cli",
      "atho-mine",
      "atho-wallet",
      "atho-address",
      "wipe"
    ],
    topics: [
      { id: "command-catalog", title: "Command Catalog" },
      { id: "commands-setup-env", title: "Copy-Paste Setup" },
      { id: "commands-build", title: "Build Commands" },
      { id: "commands-launch", title: "Launch Commands" },
      { id: "commands-node-miner", title: "Node and Miner Commands" },
      { id: "commands-wallet-address", title: "Wallet and Address Commands" },
      { id: "commands-rpc", title: "RPC Commands" },
      { id: "commands-tests-wipe", title: "Tests and Data Wipe" }
    ],
    related: [
      { label: "Setup", href: "#setup" },
      { label: "Headless Wallet and CLI", href: "#headless-wallet-and-cli" },
      { label: "HTTP API", href: "#http-api" },
      { label: "Troubleshooting", href: "#troubleshooting" }
    ],
    content: `
      <section class="docs-section" id="commands-setup-env">
        <h2>Copy-Paste Setup</h2>
        <pre><code>export ATHO_NETWORK=testnet
export ATHO_WALLET_FILE="$HOME/atho-testnet-wallet.datafile"
read -rsp 'Wallet password: ' ATHO_WALLET_PASSWORD
printf '\n'
export ATHO_WALLET_PASSWORD</code></pre>
        <p>Clear wallet password material when done.</p>
        <pre><code>unset ATHO_WALLET_PASSWORD</code></pre>
      </section>
      <section class="docs-section" id="commands-build">
        <h2>Build Commands</h2>
        <pre><code>rustc --version
cargo --version
python3 --version
cargo build
cargo build --release -p atho-node -p atho-wallet
cargo build --release -p atho-node -p atho-wallet -p atho-qt --features gpu-native</code></pre>
      </section>
      <section class="docs-section" id="commands-launch">
        <h2>Launch Commands</h2>
        <pre><code>python3 run/runmainnet.py
python3 run/runtestnet.py
python3 run/runregnet.py
python3 run/runtestnet.py --help
python3 run/runtestnet.py --dry-run
python3 run/runtestnet.py --rebuild</code></pre>
      </section>
      <section class="docs-section" id="commands-node-miner">
        <h2>Node and Miner Commands</h2>
        <pre><code>cargo run -p atho-node --bin athod -- --network testnet
ATHO_WALLET_ENABLED=0 cargo run -p atho-node --bin athod -- --network testnet
cargo run -p atho-node --bin athod -- status --network testnet
cargo run -p atho-node --bin athod -- verify --network testnet</code></pre>
        <pre><code>REWARD_ADDRESS='paste-a-testnet-address-here'
cargo run -p atho-node --bin atho-mine -- \
  --network testnet --reward-address "$REWARD_ADDRESS" --backend cpu --loop
cargo run -p atho-node --features gpu-native --bin atho-mine -- --network testnet --probe-gpu</code></pre>
      </section>
      <section class="docs-section" id="commands-wallet-address">
        <h2>Wallet and Address Commands</h2>
        <pre><code>cargo run -p atho-wallet --bin atho-wallet -- --help
cargo run -p atho-wallet --bin atho-address -- --help
cargo run -p atho-wallet --bin atho-wallet -- \
  create "$ATHO_NETWORK" --out "$ATHO_WALLET_FILE" \
  --wallet-password-env ATHO_WALLET_PASSWORD
cargo run -p atho-wallet --bin atho-wallet -- \
  getwalletinfo --wallet "$ATHO_WALLET_FILE" \
  --wallet-password-env ATHO_WALLET_PASSWORD
cargo run -p atho-wallet --bin atho-wallet -- \
  getnewaddress --wallet "$ATHO_WALLET_FILE" \
  --wallet-password-env ATHO_WALLET_PASSWORD</code></pre>
        <pre><code>RECIPIENT_ADDRESS='paste-a-testnet-address-here'
cargo run -p atho-wallet --bin atho-wallet -- \
  send --network "$ATHO_NETWORK" --cookie-auth \
  --wallet "$ATHO_WALLET_FILE" \
  --address "$RECIPIENT_ADDRESS" --amount 1.25000000 \
  --wallet-password-env ATHO_WALLET_PASSWORD
ADDRESS='paste-an-atho-address-here'
cargo run -p atho-wallet --bin atho-address -- inspect "$ADDRESS"</code></pre>
      </section>
      <section class="docs-section" id="commands-rpc">
        <h2>RPC Commands</h2>
        <pre><code>cargo run -p atho-node --bin atho-cli -- --help
cargo run -p atho-node --bin atho-cli -- help
cargo run -p atho-node --bin atho-cli -- help mining
cargo run -p atho-node --bin atho-cli -- --network testnet --cookie-auth getstatus
cargo run -p atho-node --bin atho-cli -- --network testnet getinflationinfo
cargo run -p atho-node --bin atho-cli -- --network testnet getmempoolfeeestimate 590
cargo run -p atho-node --bin atho-cli -- --network testnet geterrorcodes ATHO-DB-009
cargo run -p atho-node --bin atho-cli -- --network testnet getmininginfo
cargo run -p atho-node --bin atho-cli -- --network testnet getblocktemplate
cargo run -p atho-node --bin atho-cli -- --network testnet gettemplateinfo</code></pre>
      </section>
      <section class="docs-section" id="commands-tests-wipe">
        <h2>Tests and Data Wipe</h2>
        <pre><code>python3 -m unittest discover -s tests -v
cargo test -p atho-errors -p atho-core -p atho-crypto -p atho-storage -p atho-p2p -p atho-rpc -p atho-wallet -p atho-node</code></pre>
        <pre><code>ATHO_DATA_DIR="\${ATHO_DATA_DIR:-$HOME/.local/share/Atho}"
cargo run -p atho-node --bin athod -- wipe --network mainnet --data-dir "$ATHO_DATA_DIR" --all</code></pre>
        <p>Stop the node before wiping. Do not add <code>--include-wallets</code> unless you intentionally want to delete wallet files.</p>
      </section>
    `
  },
  "production-deployment": {
    title: "Production Deployment",
    eyebrow: "APIs and Operations",
    summary: "Atho is deployable for local development, regnet, and extended testnet operations; mainnet-style operations require conservative deployment controls and remaining release work.",
    keywords: [
      "production deployment",
      "systemd",
      "reverse proxy",
      "firewall",
      "p2p advertise",
      "operator deployment",
      "mainnet blockers"
    ],
    topics: [
      { id: "production-deployment", title: "Production Deployment" },
      { id: "deployment-build", title: "Build" },
      { id: "deployment-network-separation", title: "Network Separation" },
      { id: "deployment-safe-binds", title: "Safe Bind Defaults" },
      { id: "deployment-systemd", title: "systemd Example" },
      { id: "deployment-health", title: "Health and Readiness" },
      { id: "deployment-ops", title: "Operations" },
      { id: "deployment-blockers", title: "Current Operational Blockers" }
    ],
    related: [
      { label: "Configuration", href: "#configuration" },
      { label: "HTTP API", href: "#http-api" },
      { label: "Release Verification", href: "#release-verification" },
      { label: "Mainnet vs Testnet", href: "#mainnet-vs-testnet" }
    ],
    content: `
      <section class="docs-section" id="deployment-build">
        <h2>Build</h2>
        <pre><code>cargo build
cargo build --release</code></pre>
        <p>If you need standalone binaries for operations, prefer release builds. Full release candidates should pass audit and release checks before packaging.</p>
      </section>
      <section class="docs-section" id="deployment-network-separation">
        <h2>Network Separation</h2>
        <p>Always set the network intentionally and use one data directory per network.</p>
        <pre><code>ATHO_DATA_DIR=/var/lib/atho/mainnet \
cargo run -p atho-node --bin athod --release -- --network mainnet</code></pre>
        <pre><code>/var/lib/atho/
  mainnet/
    db/
    logs/
    wallet/
    audit/
    quarantine/</code></pre>
      </section>
      <section class="docs-section" id="deployment-safe-binds">
        <h2>Safe Bind Defaults</h2>
        <pre><code>export ATHO_RPC_ADDR=127.0.0.1:9010
export ATHO_API_BIND=127.0.0.1
export ATHO_API_PORT=8080
export ATHO_P2P_ADDR=0.0.0.0:56000
export ATHO_P2P_ADVERTISE_ADDR=203.0.113.10:56000</code></pre>
        <p>Keep RPC and API on loopback unless there is a deliberate access-control design. If exposing read-only API publicly, keep Atho bound to loopback and put TLS, request limits, and caching in front of it.</p>
      </section>
      <section class="docs-section" id="deployment-systemd">
        <h2>systemd Example</h2>
        <pre><code>id -u atho >/dev/null 2>&1 || \
  sudo useradd --system --home /var/lib/atho --shell /usr/sbin/nologin atho
sudo install -d -o root -g root -m 0755 /opt/atho/bin
sudo install -d -o atho -g atho -m 0750 /var/lib/atho/mainnet
sudo install -m 0755 target/release/athod /opt/atho/bin/athod</code></pre>
        <pre><code>[Unit]
Description=Atho Node
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=atho
WorkingDirectory=/opt/atho
Environment=ATHO_DATA_DIR=/var/lib/atho/mainnet
Environment=ATHO_RPC_ADDR=127.0.0.1:9010
Environment=ATHO_P2P_ADDR=0.0.0.0:56000
Environment=ATHO_P2P_ADVERTISE_ADDR=203.0.113.10:56000
Environment=ATHO_API_BIND=127.0.0.1
Environment=ATHO_API_PORT=8080
ExecStart=/opt/atho/bin/athod --network mainnet
Restart=on-failure
RestartSec=5
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target</code></pre>
        <pre><code>sudo systemd-analyze verify /etc/systemd/system/athod.service
sudo systemctl daemon-reload
sudo systemctl enable --now athod
sudo systemctl status athod --no-pager
sudo journalctl -u athod -f</code></pre>
      </section>
      <section class="docs-section" id="deployment-health">
        <h2>Health and Readiness</h2>
        <pre><code>curl --fail --silent --show-error http://127.0.0.1:8080/api/v1/health
curl --fail --silent --show-error http://127.0.0.1:8080/api/v1/status</code></pre>
        <p>Watch local height versus target height, peer count, topology health, mempool size, API responsiveness, and recent validation warnings.</p>
      </section>
      <section class="docs-section" id="deployment-ops">
        <h2>Operations</h2>
        <ul>
          <li>Keep hosts on reliable time sync such as NTP or chrony.</li>
          <li>Retain startup, shutdown, sync, and validation rejection logs, but never log seeds or private keys.</li>
          <li>Back up wallet data first, then operator config/service files, then explorer/index snapshots if used.</li>
          <li>For upgrades: build, stop cleanly, back up wallet/config, deploy binaries, start, then verify health, network, peers, and sync.</li>
          <li>Do not blindly roll back across schema or consensus transitions without checking storage compatibility.</li>
        </ul>
      </section>
      <section class="docs-section" id="deployment-blockers">
        <h2>Current Operational Blockers</h2>
        <ul>
          <li>Mainnet seed/bootstrap infrastructure is not provisioned in-repo yet.</li>
          <li>Wallet plaintext persistence is still possible when password is empty.</li>
          <li>No built-in HTTP auth layer exists.</li>
          <li>Independent consensus and cryptography review is not complete.</li>
          <li>Full workspace Clippy and dependency-audit gates are not green.</li>
          <li>Cross-OS, native OpenCL GPU, sustained fuzz, mutation, and long hostile-network evidence is incomplete.</li>
          <li>Signed reproducible release artifacts, SBOM, provenance, incident response, and tested rollback ownership are not complete.</li>
        </ul>
        <p>For local development, regnet, and extended testnet operations, Atho is deployable with the current launcher and node stack. For mainnet-style production operations, treat this as preparation material rather than final launch approval.</p>
      </section>
    `
  },
  "release-verification": {
    title: "Release Verification",
    eyebrow: "APIs and Operations",
    summary: "Release artifacts should ship with deterministic checksums and a detached signature so users can verify downloaded binaries before running them.",
    keywords: [
      "release",
      "checksums",
      "signature",
      "ATHO_CHECKSUMS",
      "release artifacts",
      "verify download",
      "gpg"
    ],
    topics: [
      { id: "release-verification", title: "Release Verification" },
      { id: "release-artifacts", title: "Release Artifacts" },
      { id: "release-maintainer-flow", title: "Maintainer Flow" },
      { id: "release-user-verification", title: "User Verification" },
      { id: "release-upgrade-note", title: "Upgrade Notes" }
    ],
    related: [
      { label: "Production Deployment", href: "#production-deployment" },
      { label: "Command Catalog", href: "#command-catalog" },
      { label: "Security", href: "#security" }
    ],
    content: `
      <section class="docs-section" id="release-artifacts">
        <h2>Release Artifacts</h2>
        <p>A real release should publish binaries, <code>release_checksums.py</code>, <code>ATHO_CHECKSUMS.json</code>, and <code>ATHO_CHECKSUMS.json.asc</code> together. No current tag is approval for a real-value mainnet launch.</p>
      </section>
      <section class="docs-section" id="release-maintainer-flow">
        <h2>Maintainer Flow</h2>
        <pre><code>export RELEASE_TAG='v0.1.0-alpha-rc1'
cargo build --release -p atho-node -p atho-wallet -p atho-qt
mkdir -p dist
cp target/release/athod dist/
cp target/release/atho-cli dist/
cp target/release/atho-mine dist/
cp target/release/atho-wallet dist/
cp target/release/atho-address dist/
cp target/release/atho-qt dist/
cp scripts/release_checksums.py dist/</code></pre>
        <pre><code>python3 scripts/release_checksums.py create \
  --release-tag "$RELEASE_TAG" \
  --base-dir dist \
  --output dist/ATHO_CHECKSUMS.json \
  athod atho-cli atho-mine atho-wallet atho-address atho-qt release_checksums.py
gpg --armor --detach-sign dist/ATHO_CHECKSUMS.json</code></pre>
      </section>
      <section class="docs-section" id="release-user-verification">
        <h2>User Verification</h2>
        <p>A real release must publish its signing-key fingerprint through an independent official channel. Import a release key only after the fingerprint matches.</p>
        <pre><code>RELEASE_KEY_FILE='ATHO_RELEASE_KEY.asc'
gpg --show-keys --with-fingerprint "$RELEASE_KEY_FILE"
gpg --import "$RELEASE_KEY_FILE"
gpg --verify ATHO_CHECKSUMS.json.asc ATHO_CHECKSUMS.json
python3 release_checksums.py verify ATHO_CHECKSUMS.json</code></pre>
      </section>
      <section class="docs-section" id="release-upgrade-note">
        <h2>Upgrade Notes</h2>
        <p>The current pre-production line includes bootstrap-plus-tail policy, adaptive block-limit state, exact coinbase-height rules, and the 10-to-16-bit mandatory TX-PoW schedule. Upgrade nodes, miners, and wallets together, clear pending transactions created under older policy, and rebuild development chains when schema or consensus changes require it.</p>
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
            <thead><tr><th>Feature</th><th>Mainnet</th><th>Testnet</th><th>Regnet</th><th>Prunetest</th></tr></thead>
            <tbody>
              <tr><td>Network ID</td><td>atho-mainnet</td><td>atho-testnet</td><td>atho-regnet</td><td>atho-prunetest</td></tr>
              <tr><td>Address Prefix</td><td>A</td><td>T</td><td>R</td><td>P</td></tr>
              <tr><td>P2P / RPC</td><td>56000 / 9010</td><td>9100 / 9110</td><td>9200 / 9210</td><td>9300 / 9310</td></tr>
              <tr><td>Faucet</td><td>No</td><td>No software faucet, manual distribution</td><td>Local only</td><td>Local only</td></tr>
              <tr><td>Primary Use</td><td>Reviewed deployment preparation</td><td>Public evaluation</td><td>Local deterministic testing</td><td>Pruning and storage testing</td></tr>
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
        <p>Atho combines the required fee floor, the 100-atom output rule, the 64-output policy cap, duplicate-input checks, mempool double-spend checks, peer rate controls, and wallet transaction PoW to deter spam while keeping fees low for real users.</p>
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
      { label: "HTTP API", href: "#http-api" },
      { label: "Command Catalog", href: "#command-catalog" },
      { label: "Troubleshooting", href: "#troubleshooting" },
      { label: "FAQ", href: "#faq" }
    ],
    content: `
      <section class="docs-section" id="constants">
        <h2>Constants</h2>
        <pre><code>DECIMALS = 8
ATOMS_PER_ATHO = 100_000_000
TARGET_BLOCK_TIME_SECONDS = 100
INITIAL_BLOCK_REWARD_ATOMS = 800_000_000
SECOND_ERA_BLOCK_REWARD_ATOMS = 400_000_000
THIRD_ERA_BLOCK_REWARD_ATOMS = 200_000_000
FOURTH_ERA_BLOCK_REWARD_ATOMS = 100_000_000
HALVING_INTERVAL_BLOCKS = 1_250_000
BOOTSTRAP_BLOCKS = 5_000_000
BOOTSTRAP_SUPPLY_ATOMS = 1_875_000_000_000_000
TAIL_START_HEIGHT = 5_000_001
TAIL_REWARD_ATOMS = 50_000_000
NORMAL_TX_VALID_AFTER_CONFIRMATIONS = 1
DEFAULT_WALLET_MIN_CONFIRMATIONS = 3
COINBASE_MATURITY_BLOCKS = 100
MIN_TX_FEE_ATOMS = 600
MIN_TX_FEE_PER_SERIALIZED_BYTE_ATOMS = 1
MIN_RELAY_FEE_RATE_ATOMS_PER_VBYTE = 1
MIN_OUTPUT_AMOUNT_ATOMS = 100
MAX_STANDARD_OUTPUTS = 64
TX_POW_HASH = SHA3-256
TX_POW_MIN_BITS = 10
TX_POW_MAX_BITS = 16
TX_POW_DOMAIN = ATHO_TX_POW_V1
TX_SIGN_DOMAIN = ATHO_TX_SIGN_V1</code></pre>
        <pre><code>1 ATHO = 100,000,000 atoms
Blocks per year = 31,536,000 / 100 = 315,360
Annual first-era issuance = 8 * 315,360 = 2,522,880 ATHO/year
Annual tail = 0.50 * 315,360 = 157,680 ATHO/year</code></pre>
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
        <pre><code>python3 run/runmainnet.py
python3 run/runtestnet.py
cargo run -p atho-node --bin athod -- --network testnet
cargo run -p atho-qt --bin atho-qt -- --network testnet --local-node
cargo run -p atho-node --bin atho-mine -- --network testnet</code></pre>
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
      { label: "Configuration", href: "#configuration" },
      { label: "Command Catalog", href: "#command-catalog" },
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
