const fs = require('fs');
const path = require('path');
const pw = require('playwright');

const dir = path.resolve(__dirname);
const pitch = path.resolve(dir, '..');
const repo = path.resolve(dir, '..', '..');
const pdfDir = path.join(repo, 'pdf');
if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });

const tpl = fs.readFileSync(path.join(dir, 'pitch.template.html'), 'utf8');
const fonts = fs.readFileSync(path.join(dir, 'embedded-fonts.css'), 'utf8');
const lenis = fs.readFileSync(path.join(dir, 'lenis.min.js'), 'utf8').replace(/\/\/#\s*sourceMappingURL=.*$/m, '');
if (tpl.indexOf('/* @@FONTS@@ */') === -1 || tpl.indexOf('/* @@LENIS@@ */') === -1) throw new Error('marker missing');
const finalHtml = tpl.replace('/* @@FONTS@@ */', () => fonts).replace('/* @@LENIS@@ */', () => lenis);
const outHtml = path.join(repo, 'index.html');
fs.writeFileSync(outHtml, finalHtml);
console.log('wrote index.html', (finalHtml.length / 1024).toFixed(0) + 'KB');
const fileUrl = 'file://' + outHtml;

const doQA = process.argv.includes('--qa');

async function loadImages(page) {
  await page.evaluate(async () => {
    document.querySelectorAll('img').forEach((i) => { i.loading = 'eager'; });
    const imgs = Array.from(document.images);
    await Promise.race([
      Promise.all(imgs.map((img) => (img.complete && img.naturalWidth > 0) ? null : img.decode().catch(() => {}))),
      new Promise((r) => setTimeout(r, 12000)),
    ]);
  });
  await page.waitForTimeout(200);
}

function apply(page, lang, killAnim) {
  return page.evaluate(({ lang, killAnim }) => {
    const h = document.documentElement;
    h.classList.remove('lang-cz', 'lang-en', 'lang-de'); h.classList.add('lang-' + lang);
    if (killAnim) { h.classList.remove('anim'); h.setAttribute('lang', lang === 'cz' ? 'cs' : lang); }
    document.querySelectorAll('.reveal,.stagger').forEach((e) => e.classList.add('in'));
    document.querySelectorAll('.pic').forEach((e) => e.classList.add('seen'));
    document.querySelectorAll('.stats .n').forEach((el) => { const to = el.getAttribute('data-to'); const s = el.getAttribute('data-suffix') || ''; el.textContent = parseFloat(to).toFixed(to.indexOf('.') > -1 ? 1 : 0) + s; });
    document.querySelectorAll('[data-par]').forEach((e) => { e.style.transform = 'none'; });
  }, { lang, killAnim });
}

const PDFS = { cz: 'Ippa-Cafe-SiteSpot-navrh-CZ.pdf', en: 'Ippa-Cafe-SiteSpot-proposal-EN.pdf', de: 'Ippa-Cafe-SiteSpot-angebot-DE.pdf' };

(async () => {
  const proxyServer = process.env.HTTPS_PROXY || process.env.https_proxy;
  const browser = await pw.chromium.launch({
    executablePath: '/opt/pw-browsers/chromium',
    args: ['--no-sandbox', '--font-render-hinting=none'],
    proxy: proxyServer ? { server: proxyServer } : undefined,
  });

  // ---- PDFs (print + reduced motion => static, no parallax/Lenis) ----
  const p = await browser.newPage({ viewport: { width: 1200, height: 1600 }, ignoreHTTPSErrors: true });
  p.setDefaultTimeout(90000);
  await p.addInitScript(() => { window.__PDF__ = true; });
  await p.emulateMedia({ media: 'print' });
  await p.goto(fileUrl, { waitUntil: 'load', timeout: 90000 });
  await p.evaluate(() => document.fonts && document.fonts.ready);
  await loadImages(p);
  for (const l of ['cz', 'en', 'de']) {
    await apply(p, l, true);
    await p.pdf({ path: path.join(pdfDir, PDFS[l]), printBackground: true, preferCSSPageSize: true });
    console.log('wrote', PDFS[l]);
  }
  await p.close();

  // ---- QA screenshots (screen media) only with --qa ----
  if (doQA) {
    const d = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1, ignoreHTTPSErrors: true });
    d.setDefaultTimeout(90000);
    await d.goto(fileUrl, { waitUntil: 'load' });
    await d.evaluate(() => document.fonts && document.fonts.ready);
    await loadImages(d);
    for (const l of ['en', 'de']) { await apply(d, l, false); await d.waitForTimeout(150); await d.screenshot({ path: path.join(dir, `qa-desktop-${l}.png`), fullPage: true }); }
    await d.close();
    const m = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, ignoreHTTPSErrors: true });
    m.setDefaultTimeout(90000);
    await m.goto(fileUrl, { waitUntil: 'load' });
    await m.evaluate(() => document.fonts && document.fonts.ready);
    await loadImages(m);
    await apply(m, 'en', false); await m.waitForTimeout(150);
    await m.screenshot({ path: path.join(dir, 'qa-mobile-en.png'), fullPage: true });
    await m.close();
    console.log('qa done');
  }

  await browser.close();
  console.log('done');
})().catch((e) => { console.error(e); process.exit(1); });
