# Atho Website

Current public site for `atho.io`.

## Live Pages

- `index.html`: main protocol landing page
- `docs.html`: section-based HTML documentation shell
- `explore/index.html`: read-only explorer page wired to the Atho node API
- `join.html`: test batch / Discord onboarding
- `roadmap.html`: status page
- `contact.html`: contact page

## Active Assets

- `assets/css/site.css`: shared design system and layout
- `assets/js/site-data.js`: editable site content and footer links
- `assets/js/site.js`: rendering and interaction logic
- `assets/js/explorer-config.js`: single-source explorer API and network identity config
- `assets/js/live-network.js`: homepage live testnet stats preview
- `assets/js/explore.js`: explorer client, search routing, and API rendering
- `assets/js/docs-content.js`: docs chapter content, aliases, and section metadata
- `assets/js/docs.js`: docs navigation, search, deep-linking, and focused section rendering
- `assets/media/logo 1.png`: primary dark-theme logo
- `assets/media/docs/`: docs diagrams and comparison visuals
- `assets/files/atho-whitepaper.pdf`: downloadable whitepaper

## Docs Architecture

The docs are no longer one long scroll page.

- `docs.html` provides the docs shell
- the left sidebar is the primary table of contents
- only one major docs section is rendered at a time
- `Previous` and `Next` links move through the docs like a book
- hash routes such as `docs.html#monetary-policy` and `docs.html#falcon-512-and-quantum-security` open the correct focused section directly
- client-side search indexes all sections, including ones that are not currently visible
- older docs anchors are mapped forward where possible so older links still land in the right chapter

## Explorer Architecture

- `explore/index.html` is the explorer shell
- the website reads node data over HTTP only; it never touches LMDB directly
- testnet explorer requests are configured in `assets/js/explorer-config.js`
- testnet explorer requests default to the public VPS DNS endpoint `https://testnet-node1.atho.io/api/v1`
- custom deployments can override the API at runtime by setting `window.ATHO_EXPLORER_CONFIG.testnetApiBaseUrl` before `assets/js/explore.js` or `assets/js/live-network.js` loads
- mainnet explorer stays in a `Coming Soon` state until a mainnet API base URL is configured
- the explorer verifies `network`, `network_id`, `genesis_hash`, and `api_version` before it renders data
- search supports block heights, 96-character block hashes or txids, mempool txids, and visible Atho addresses

## Docs Visuals

Current docs diagrams live in `assets/media/docs/` and include:

- Falcon-512 vs classical elliptic curve comparison
- wallet transaction PoW flow
- UTXO transaction lifecycle flow

## Local Preview

```bash
python3 runweb.py --open
```

Default local URL:

- `http://127.0.0.1:8081/`

## Deployment Bundle

```bash
bash scripts/build_ionos_bundle.sh
```

This rebuilds the upload folder and packaged archive:

- `ionos-upload/`
- `ionos-upload.zip`

The generated bundle keeps the explorer pointed at the public VPS API:

- `https://testnet-node1.atho.io/api/v1`
