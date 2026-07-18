const fs = require('fs');
const path = require('path');
const pw = require('playwright');

const dir = path.resolve(__dirname);          // .../ippa-cafe-pitch/build
const pitch = path.resolve(dir, '..');        // .../ippa-cafe-pitch
const repo = path.resolve(dir, '..', '..');   // repo root (deployed site)
const pdfDir = path.join(repo, 'pdf');
if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });

// 1) Build final self-contained HTML: inject embedded fonts into template.
const tpl = fs.readFileSync(path.join(dir, 'pitch.template.html'), 'utf8');
const fonts = fs.readFileSync(path.join(dir, 'embedded-fonts.css'), 'utf8');
if (tpl.indexOf('/* @@FONTS@@ */') === -1) throw new Error('font marker missing');
const finalHtml = tpl.replace('/* @@FONTS@@ */', () => fonts);
const outHtml = path.join(repo, 'index.html');   // deployed at repo root (zero-config Vercel)
fs.writeFileSync(outHtml, finalHtml);
// keep a copy inside the pitch folder too, so that folder stays self-describing
fs.writeFileSync(path.join(pitch, 'index.html'), finalHtml);
console.log('wrote index.html', (finalHtml.length / 1024).toFixed(0) + 'KB');
const fileUrl = 'file://' + outHtml;

function freeze(page, lang) {
  return page.evaluate((lang) => {
    const h = document.documentElement;
    h.classList.remove('lang-en', 'lang-cz', 'lang-de', 'anim');
    h.classList.add('lang-' + lang);
    h.setAttribute('lang', lang === 'cz' ? 'cs' : lang);
    document.querySelectorAll('.stats .n').forEach((el) => {
      const to = el.getAttribute('data-to'); const s = el.getAttribute('data-suffix') || '';
      const dec = to.indexOf('.') > -1 ? 1 : 0;
      el.textContent = parseFloat(to).toFixed(dec) + s;
    });
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
  }, lang);
}

const PDFS = {
  cz: 'Ippa-Cafe-SiteSpot-navrh-CZ.pdf',
  en: 'Ippa-Cafe-SiteSpot-proposal-EN.pdf',
  de: 'Ippa-Cafe-SiteSpot-angebot-DE.pdf',
};

(async () => {
  const browser = await pw.chromium.launch({
    executablePath: '/opt/pw-browsers/chromium',
    args: ['--no-sandbox', '--font-render-hinting=none'],
  });

  // ---- QA screenshots (screen media), revealed state ----
  const dtp = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1.5 });
  await dtp.goto(fileUrl, { waitUntil: 'networkidle' });
  await dtp.evaluate(() => document.fonts && document.fonts.ready);
  for (const l of ['cz', 'en', 'de']) {
    await dtp.evaluate((lang) => {
      const h = document.documentElement; h.classList.remove('lang-cz','lang-en','lang-de','anim'); h.classList.add('lang-'+lang);
      document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in'));
      document.querySelectorAll('.stats .n').forEach(el=>{const to=el.getAttribute('data-to');const s=el.getAttribute('data-suffix')||'';el.textContent=parseFloat(to).toFixed(to.indexOf('.')>-1?1:0)+s;});
    }, l);
    await dtp.waitForTimeout(180);
    await dtp.screenshot({ path: path.join(dir, `qa-desktop-${l}.png`), fullPage: true });
  }
  await dtp.close();

  const mob = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true });
  await mob.goto(fileUrl, { waitUntil: 'networkidle' });
  await mob.evaluate(() => document.fonts && document.fonts.ready);
  await mob.evaluate(() => { const h=document.documentElement; h.classList.remove('anim'); h.classList.add('lang-de'); document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in')); });
  await mob.waitForTimeout(200);
  await mob.screenshot({ path: path.join(dir, 'qa-mobile-de.png'), fullPage: true });
  await mob.close();

  // ---- PDFs (print media) in all three languages ----
  const p = await browser.newPage();
  await p.goto(fileUrl, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts && document.fonts.ready);
  await p.emulateMedia({ media: 'print' });
  for (const l of ['cz', 'en', 'de']) {
    await freeze(p, l);
    await p.pdf({ path: path.join(pdfDir, PDFS[l]), printBackground: true, preferCSSPageSize: true });
    console.log('wrote', PDFS[l]);
  }

  await browser.close();
  console.log('done');
})().catch((e) => { console.error(e); process.exit(1); });
