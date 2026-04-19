# Atho Website

This folder is a modular static website starter for the Atho public domain.

## Brand Direction

- Network name: `Atho`
- Slogan: `Atho — Private. Secure. The Platinum Standard of the Quantum Age`
- Visual language: explorer-inspired, white/green, clean/futuristic
- Logo assets copied from: `Src/GUI/logo.png` and `Src/GUI/logo/logo white trasnaparent .png`

## Pages

- `home.html`: Main marketing home page (mission + technology + security + privacy layer + policy + launch narrative).
- `index.html`: Redirect-compatible mirror of `home.html` for root entry compatibility.
- `platinum-shield.html`: Platinum Shield privacy layer deep dive (public/private coexistence, workflow engine, controls).
- `wallet.html`: Wallet architecture, lockbox security, private-send flow guidance, and recovery.
- `join.html`: Guided node setup and private-layer testnet validation runbook.
- `docs.html`: PDF-first searchable documentation hub with privacy/protocol/economics coverage.
- `rewards.html`: Retired rewards landing page that points visitors to the live economics baseline.
- `bpow-docs.html`: Retired legacy-consensus landing page that points visitors to current docs.
- `falcon-512.html`: Post-quantum Falcon documentation and efficiency references.
- `inflation-deflation.html`: Monetary policy and supply-control references.
- `changelog.html`: Release thread for version releases and security releases.
- `contact.html`: Contact/disclosure page for bugs, security issues, and general communication.

All pages share the same top tab navigation.

## Structure

- `assets/css/`
  - `variables.css`: Color, spacing, radius, typography tokens.
  - `base.css`: Global foundation styles.
  - `layout.css`: Page/section layout grids.
  - `components.css`: Navigation, cards, badges, buttons.
  - `motion.css`: Reveal/motion effects.
  - `responsive.css`: Mobile/tablet breakpoints.
- `assets/js/`
  - `app.js`: Bootstraps rendering + nav + motion modules.
  - `data/site-data.js`: Home page cards/metrics copy.
  - `data/docs-catalog.js`: Generated searchable PDF catalog with keyword aliases.
  - `modules/render.js`: Card rendering utilities.
  - `modules/docs.js`: Docs search/filter/catalog renderer.
  - `modules/nav.js`: Multi-page nav + hash active-state behavior.
  - `modules/reveal.js`: Intersection-based reveal effects.
  - `modules/counters.js`: Animated metric counters.
  - `modules/year.js`: Footer year auto-update.
- `assets/media/`
  - `atho-logo.png`: Atho logo (copied from GUI assets).
  - Other static visual assets.

## Fast Content Edits

- Home page content sections: `home.html` and `index.html`
- Platinum Shield content: `platinum-shield.html`
- Docs page sections: `docs.html`
- Join instructions: `join.html`
- Release stream entries: `changelog.html`
- Feature/roadmap/metric cards: `assets/js/data/site-data.js`
- Palette/spacing: `assets/css/variables.css`

## Docs Pipeline (PDF-first)

Generate the PDF docs bundle and searchable docs catalog from the root `Docs/` tree:

```bash
python3 Website/atho.io/scripts/generate_docs_catalog.py
```

This script:

- reads source docs from `<repo>/Docs/`
- generates/normalizes PDF artifacts into `assets/docs/pdf/`
- removes date suffixes from generated PDF filenames
- regenerates `assets/js/data/docs-catalog.js` with keyword aliases

## Local Preview

From repo root:

```bash
python3 Website/atho.io/runweb.py --open
```

Or from inside `Website/atho.io`:

```bash
python3 runweb.py --open
```

Default URL:

- `http://127.0.0.1:8081/`

Optional flags:

- `--host 0.0.0.0` (LAN testing)
- `--port 9000` (custom port)
- `--no-auto-port` (fail instead of fallback)

## IONOS Deployment (Static)

Upload the contents of `Website/atho.io/` to your domain web root.
No backend runtime is required for this site scaffold.

To build a clean upload-ready folder:

```bash
bash Website/atho.io/scripts/build_ionos_bundle.sh
```

This generates:

- `Website/atho.io/ionos-upload/`

Upload the contents of `ionos-upload/` to your IONOS web root.
