# Ippa Café — SiteSpot pitch

A bilingual (CZ / EN) sales proposal from **SiteSpot** for **Ippa Café / IPPA –
International Prague Pastry Academy**. The lead offer is a proper English version
of their currently Czech-only website; the deck then lays out a researched,
sequenced menu of follow-on work.

## Deliverables

| File | What it is |
|------|------------|
| `index.html` | The interactive page — self-contained (fonts embedded), CZ/EN toggle, minimalist, responsive, with light motion. Open in any browser. Add `#en` to the URL to load in English. |
| `Ippa-Cafe-SiteSpot-navrh-CZ.pdf` | Print/PDF export, **Czech** (the audience's language). |
| `Ippa-Cafe-SiteSpot-proposal-EN.pdf` | Print/PDF export, **English**. |
| `RESEARCH.md` | The market-research brief behind the pitch (sources, sizing, competitor scan, the expanded offer, risks, recommendation). |

## Highlights

- **Minimalist editorial design** — Fraunces + Hanken Grotesk, warm paper palette,
  generous whitespace. Fonts are embedded as base64 (latin + latin-ext, so Czech
  diacritics render), making the HTML fully portable and offline-safe.
- **Custom SVG artwork** (Prague Castle silhouette + coffee + macarons + EN chip)
  and subtle motion (steam, float, scroll reveals, count-up stats, a language
  marquee). All motion respects `prefers-reduced-motion` and is disabled in print.
- **Responsive** from ~360 px phones to desktop; wide blocks never overflow.
- **Research-backed** additions vs. the original: a stat band (Prague Castle 2025,
  77 % foreign), a "you're behind smaller shops" competitor comparison, and new
  menu items (allergen info in every language, TripAdvisor/reviews, masterclass
  ticketing, WhatsApp ordering), plus a "recommended next" steer on the two
  highest-margin follow-ons. Every number on the page is sourced in the footer.

## Rebuilding

The final `index.html` and both PDFs are generated from `build/`:

```bash
cd build
NODE_PATH="$(npm root -g)" node render.js   # injects embedded-fonts.css into
                                            # pitch.template.html -> ../index.html,
                                            # then exports the CZ + EN PDFs (Chromium)
```

- `build/pitch.template.html` — the authored page, with a `/* @@FONTS@@ */` marker.
- `build/embedded-fonts.css` — base64 @font-face rules injected at build time.
- `build/embed-fonts.js` — regenerates `embedded-fonts.css` from downloaded Google
  Fonts woff2 files (latin + latin-ext only).
- `build/render.js` — builds the HTML and renders the PDFs.

## Note

The Czech text in the before/after demo is Ippa Café's own current site copy; the
English is the proposed translation. This is a proposal, not a live change to their
website. Market benchmarks in the footer are industry figures (directional), not a
promise for this specific venue.
