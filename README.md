# Atho Website

Current public site for `atho.io`.

## Live Pages

- `index.html`: main protocol landing page
- `docs.html`: docs status page
- `join.html`: test batch / Discord onboarding
- `roadmap.html`: status page
- `contact.html`: contact page

## Active Assets

- `assets/css/site.css`: shared design system and layout
- `assets/js/site-data.js`: editable site content and footer links
- `assets/js/site.js`: rendering and interaction logic
- `assets/media/logo 1.png`: primary dark-theme logo
- `assets/files/atho-whitepaper.pdf`: downloadable whitepaper

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

This rebuilds:

- `ionos-upload/`
