# SebCaffe

This repository deploys the **Ippa Café · SiteSpot** pitch as a static site.

- **`/index.html`** — the deployed page (trilingual CZ / EN / DE, self-contained, fonts embedded). Served at the site root.
- **`/pdf/`** — PDF exports of the pitch in each language.
- **`/vercel.json`**, **`/.vercelignore`** — zero-config static hosting for Vercel.
- **`/ippa-cafe-pitch/`** — source and build pipeline, the market-research brief, and docs. See its [README](ippa-cafe-pitch/README.md).
- **`/.claude/skills/`** — the installed `market-research` skill.

## Deploy on Vercel

This is a **zero-config static site** — no build step, no framework. On a Vercel
project connected to this repo, the production branch deploys automatically and
serves `/index.html` at `/`. If the project's **Root Directory** is set to a
subfolder, point it at the repository root (where `index.html` and `vercel.json`
live). To rebuild the HTML/PDFs, see `ippa-cafe-pitch/README.md`.
