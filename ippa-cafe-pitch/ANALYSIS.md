# Website analysis — Ippa × SiteSpot pitch

*Full audit run 2026-07-18: automated technical checks (Playwright), a trilingual copy proofread, an independent pitch-effectiveness critique, and live-site fact-checking. Fixes applied are marked ✅; open items for SiteSpot are marked ⚠️.*

---

## 1. Verdict (TL;DR)

**This is a strong, above-average pitch — and it's now materially stronger.** The *story* (problem → proof → offer → roadmap) was already excellent and the *build* is clean. The weaknesses were in the *sell* and one factual claim. Both are fixed:

- **Technical:** clean — 0 console errors, 0 broken assets, no horizontal overflow at any width, toggle + phone interactivity work.
- **Copy:** effectively publication-ready across CZ/EN/DE — one real Czech error found and fixed.
- **Pitch:** had a brilliant setup but **no close** and a **factual landmine** (the "0 English" claim). Both fixed, plus tone and price-anchoring improvements.

---

## 2. Technical audit (automated)

| Check | Result |
|-------|--------|
| Console errors / page errors | **0** ✅ |
| Images | 8/8 load, **0 broken, 0 missing `alt`** ✅ |
| Horizontal overflow @ 360/390/414/768/1024/1280 | **none** ✅ (blobs + marquee overflow their own clipped containers by design; page never scrolls sideways) |
| Language toggle CZ / EN / DE | all correct ✅ |
| Phone app (tab switch + add-to-cart) | works (cart → "1 · 90 Kč") ✅ |
| Fonts | embedded (Playfair + Manrope), load cleanly ✅ |
| Links / CTA | **was 1 footer mailto → now a CTA button + signature + footer** ✅ |

---

## 3. Copy review (trilingual, native-level proof)

All figures verified **consistent across all three languages** (2.7M, 77%, 0, 4, 62k, 30–40%, +25/+19/60/+32%, 45 000 Kč, 2–3 weeks). Locale number formatting is correct per language.

- ✅ **Fixed (real error):** Czech badge `doporučeně další` → `doporučené`. (`doporučeně` actually means "by registered mail" — it couldn't modify the noun.)
- ✅ **Fixed (minor):** phone label `1 to a free coffee` → `1 more for a free coffee`; Czech hero "Mezinárodní" now bold, matching EN/DE.
- Czech, German and English are otherwise clean and native (diacritics, quotation marks, agreement all correct).

**Copy verdict: publication-ready.**

---

## 4. Factual accuracy — the important finding ⚠️→✅

The pitch leaned on a broad claim: *"an International academy… on a website only Czech speakers can read"* and *"0 pages in English."* Fact-checking the live sites:

- `ippacafe.cz` (café + e-shop) → **verified Czech-only, no language switch** ✅ — this is exactly what the browser mock shows, so it holds.
- `old.ippa-academy.cz/en/` → **returns English with `hreflang="en"`** — i.e. **the academy already has an English site.** The broad "0 pages in English" was therefore **inaccurate** and a savvy owner could have rebutted it instantly.

✅ **Fix applied:** every claim narrowed to the **café site + e-shop (`ippacafe.cz`)**, which is verified Czech-only — the hero lede, the "0" stat + caption, and the "one gap" copy. The pitch is now unassailable on this point.

⚠️ **Pre-send:** re-confirm on the exact live pages the day you send (sites change), and check whether the *current* `ippacafe.cz` gains any language switch.

---

## 5. Pitch effectiveness (independent critique)

**Biggest strengths (keep):**
1. The problem is *proven experientially* — the live toggle, the real Czech-only nav mock, the before/after from Ippa's own copy, the sourced stat band.
2. **The page itself is the credential** — a hand-built, trilingual, animated, sourced proposal is the best proof-of-craft a studio can send.
3. Smart commercial architecture — a small, low-risk 45k wedge + a sequenced roadmap ("you pick the next one"), with the honesty ("directional, not a promise") that flatters a savvy owner.

**Improvements applied ✅:**
- **A real close** — the #1 gap. Added a "Ready when you are" section: a 3-step *what-happens-next* timeline, a prominent **CTA button**, and a **named signature** (was a dead-end footer mailto).
- **A credibility line** — honest and true: *"this page is the sample; your translation is written and checked by a native speaker, not machine output."*
- **App repositioned** — eyebrow "The flagship" → **"Phase 2 · after English"**, and a **"from ~120,000 Kč, scoped separately"** anchor so the flashy demo stops reading as a blank cheque (consistent with `PRICING-APP.md`).
- **Softer tone** — the "You're behind smaller shops" header (which wounded a proud academy) → **"You have the brand and the location. You're just missing the one thing they all have."** Same facts, same table, no sting.
- **An English-specific ROI figure** — the 45k wedge now has a number behind it (2.7M × 77% foreign), clearly labelled *illustrative*.

**Open items for SiteSpot ⚠️ (your call — I won't fabricate these):**
- **A real proof point** — a portfolio link or a genuine testimonial. I deliberately did **not** invent clients or reviews; add a true one if you have it.
- **Optional:** move the app demo to *after* the price (I relabeled + anchored it instead, as the lower-risk change), and/or add a few "from ~Xk" ranges in the 6-group menu if it reads as a land-grab.
- Set the CTA's email subject / add a booking-link if you use one.

---

## 6. What I intentionally did **not** change
- No fabricated testimonials, client names, or "we've shipped N sites" claims — that would be dishonest and could backfire.
- Kept the competitor comparison table (strong, fair evidence).
- Kept the app demo where it is (relabeled, not relocated) to avoid disturbing the otherwise-clean flow.

---

## 7. Pre-send checklist
- [ ] Re-confirm `ippacafe.cz` still Czech-only + note the academy's English status on the day.
- [ ] Confirm the "native-speaker translation" line is true for your process.
- [ ] Add one real work sample or testimonial.
- [ ] Point the CTA at the right inbox / booking link and set the subject line.
- [ ] Decide whether to show the app price on-page or hand it over only when asked (see `PRICING-APP.md §7`).

**Bottom line:** the pitch was already good; it now proves the *seller* and gives the buyer somewhere to go, and it no longer contains a claim the client could disprove. With one real proof point added, this is a genuinely strong, deal-ready proposal.
