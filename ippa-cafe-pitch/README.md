# Ippa Café — SiteSpot pitch

A **trilingual (CZ / EN / DE)** sales proposal from **SiteSpot** for **Ippa Café /
IPPA – International Prague Pastry Academy**. The lead offer is a proper English
(and German) version of their currently Czech-only website; the deck then lays out
a researched, sequenced menu of follow-on work.

## Where the files live

The **deployed site** is at the repository root so Vercel serves it zero-config:

| Path | What it is |
|------|------------|
| `/index.html` | The deployed page — self-contained (fonts embedded), CZ/EN/DE toggle, minimalist, responsive, with light motion. `#en` / `#de` in the URL loads that language. |
| `/pdf/Ippa-Cafe-SiteSpot-navrh-CZ.pdf` | PDF export, **Czech**. |
| `/pdf/Ippa-Cafe-SiteSpot-proposal-EN.pdf` | PDF export, **English**. |
| `/pdf/Ippa-Cafe-SiteSpot-angebot-DE.pdf` | PDF export, **German**. |
| `ippa-cafe-pitch/index.html` | Identical copy kept next to the source, for convenience. |
| `ippa-cafe-pitch/RESEARCH.md` | The market-research brief behind the pitch. |
| `ippa-cafe-pitch/build/` | Template + build/render pipeline. |

## Highlights

- **Trilingual** — one clean CZ/EN/DE toggle drives the whole page. In the German
  view the before/after demo even shows the *German* translation of the sample copy.
- **Minimalist editorial design** — Fraunces + Hanken Grotesk, warm paper palette.
  Fonts are embedded as base64 (latin + latin-ext, so Czech diacritics and German
  umlauts render), making the HTML fully portable and offline-safe.
- **Custom SVG artwork** (Prague Castle silhouette + coffee + macarons + EN chip)
  and subtle motion (steam, float, scroll reveals, count-up stats, a language
  marquee). All motion respects `prefers-reduced-motion` and is disabled in print.
- **Responsive** from ~360 px phones to desktop; wide blocks never overflow.
- **Research-backed** additions: a stat band (Prague Castle 2025, 77 % foreign), a
  competitor comparison, and new menu items (allergen info in every language,
  TripAdvisor/reviews, masterclass ticketing, WhatsApp ordering), plus a
  "recommended next" steer. Every number on the page is sourced in the footer.

## Rebuilding

```bash
cd ippa-cafe-pitch/build
NODE_PATH="$(npm root -g)" node render.js   # injects embedded-fonts.css into
                                            # pitch.template.html -> /index.html,
                                            # then exports CZ + EN + DE PDFs to /pdf/
```

- `build/pitch.template.html` — the authored page, with a `/* @@FONTS@@ */` marker.
- `build/embedded-fonts.css` — base64 @font-face rules injected at build time.
- `build/embed-fonts.js` — regenerates `embedded-fonts.css` from Google Fonts woff2
  (latin + latin-ext only).
- `build/render.js` — builds the HTML and renders the PDFs.

## Note

The Czech text in the before/after demo is Ippa Café's own current site copy; the
English/German are the proposed translations. This is a proposal, not a live change
to their website. Market benchmarks in the footer are industry figures (directional),
not a promise for this specific venue.
