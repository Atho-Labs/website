# Atho Website

Static public site for `atho.io`.

## Current Pages

- `index.html`: protocol homepage and current network status
- `docs.html`: searchable, section-based implementation documentation
- `networks.html`: isolated network modes, ports, and current availability
- `join.html`: desktop and headless build guide
- `roadmap.html`: project status and launch gates
- `explore/index.html`: standalone Explorer interface and public-feed notice
- `contact.html`: security, source, and community channels

## Source-Grounded Content

The public copy tracks the current Atho source repository:

- 75-second target blocks
- Falcon-512 transaction authorization
- SHA3-384 block proof of work
- eight 1,680,000-block bootstrap reward eras beginning at 16 ATHO
- finite 0.0625 ATHO tail reward from height 13,440,001 through 1,844,640,000
- 53,550,000 ATHO bootstrap issuance and a consensus-enforced 168,000,000 ATHO cap
- mandatory X25519 + ML-KEM-768 encrypted P2P transport on public modes
- loopback-only raw RPC and HTTP API boundaries
- desktop and headless operator/wallet binaries

The previous public testnet is retired. The site does not configure a live node
or explorer endpoint. Regnet is the documented local development mode until a
new compatible public testnet is announced.

## Documentation Architecture

- `assets/js/docs-content.js`: documentation sections, aliases, and HTML content
- `assets/js/docs.js`: navigation, search, hash routing, and previous/next flow
- `assets/js/site-data.js`: homepage cards, network constants, links, and footer
- `assets/js/site.js`: shared rendering, social actions, interaction, and navigation
- `assets/js/explore.js`: Explorer routes, searches, tables, paging, and detail views
- `assets/js/explorer-config.js`: runtime-verified Explorer endpoint configuration
- `assets/js/explorer-offline.js`: first-entry network notice and offline search state
- `assets/css/site.css`: shared responsive design system

Older hash routes are mapped to the closest current section where practical.

## Public Download

`assets/files/atho-whitepaper.pdf` is copied from the current source repository
and is the only protocol PDF published in the deployment bundle. Research-only
private-layer and channel papers are intentionally excluded from implemented
feature claims and downloads.

## Local Preview

```bash
python3 runweb.py --open
```

Default URL: `http://127.0.0.1:8081/`

## IONOS Bundle

```bash
bash scripts/build_ionos_bundle.sh
```

This rebuilds:

- `ionos-upload/`
- `ionos-upload.zip`

The generated static bundle contains no live testnet API address.
