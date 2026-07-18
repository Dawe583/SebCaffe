const fs = require('fs');
const path = require('path');
const pw = require('playwright');

const dir = __dirname;
const root = path.join(dir, '..');

// 1) Build final self-contained HTML: inject embedded fonts into template.
const tpl = fs.readFileSync(path.join(dir, 'pitch.template.html'), 'utf8');
const fonts = fs.readFileSync(path.join(dir, 'embedded-fonts.css'), 'utf8');
if (tpl.indexOf('/* @@FONTS@@ */') === -1) throw new Error('font marker missing');
const finalHtml = tpl.replace('/* @@FONTS@@ */', () => fonts);
const outHtml = path.join(root, 'index.html');
fs.writeFileSync(outHtml, finalHtml);
console.log('wrote index.html', (finalHtml.length / 1024).toFixed(0) + 'KB');
const fileUrl = 'file://' + outHtml;

function freeze(page, lang) {
  return page.evaluate((lang) => {
    const h = document.documentElement;
    h.classList.remove('lang-en', 'lang-cz', 'anim');
    h.classList.add('lang-' + lang);
    h.setAttribute('lang', lang === 'cz' ? 'cs' : 'en');
    document.querySelectorAll('.stats .n').forEach((el) => {
      const to = el.getAttribute('data-to'); const s = el.getAttribute('data-suffix') || '';
      const dec = to.indexOf('.') > -1 ? 1 : 0;
      el.textContent = parseFloat(to).toFixed(dec) + s;
    });
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
  }, lang);
}

(async () => {
  const browser = await pw.chromium.launch({
    executablePath: '/opt/pw-browsers/chromium',
    args: ['--no-sandbox', '--font-render-hinting=none'],
  });

  // ---- QA screenshots (screen media) ----
  const dtp = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
  await dtp.goto(fileUrl, { waitUntil: 'networkidle' });
  await dtp.evaluate(() => document.fonts && document.fonts.ready);
  await dtp.waitForTimeout(400);
  await dtp.screenshot({ path: path.join(dir, 'qa-desktop-cz.png'), fullPage: true });
  await dtp.evaluate(() => { const h = document.documentElement; h.classList.add('lang-en'); h.classList.remove('lang-cz'); });
  await dtp.waitForTimeout(150);
  await dtp.screenshot({ path: path.join(dir, 'qa-desktop-en.png'), fullPage: true });
  await dtp.close();

  const mob = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true });
  await mob.goto(fileUrl, { waitUntil: 'networkidle' });
  await mob.evaluate(() => document.fonts && document.fonts.ready);
  await mob.waitForTimeout(400);
  await mob.screenshot({ path: path.join(dir, 'qa-mobile-cz.png'), fullPage: true });
  await mob.close();

  // ---- PDFs (print media) ----
  const p = await browser.newPage();
  await p.goto(fileUrl, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts && document.fonts.ready);
  await p.emulateMedia({ media: 'print' });

  await freeze(p, 'cz');
  await p.pdf({ path: path.join(root, 'Ippa-Cafe-SiteSpot-navrh-CZ.pdf'), printBackground: true, preferCSSPageSize: true });
  console.log('wrote CZ pdf');

  await freeze(p, 'en');
  await p.pdf({ path: path.join(root, 'Ippa-Cafe-SiteSpot-proposal-EN.pdf'), printBackground: true, preferCSSPageSize: true });
  console.log('wrote EN pdf');

  await browser.close();
  console.log('done');
})().catch((e) => { console.error(e); process.exit(1); });
