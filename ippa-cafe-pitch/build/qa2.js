const pw = require('playwright');
const path = require('path');
const dir = __dirname;
const fileUrl = 'file://' + path.join(dir, '..', 'index.html');

function reveal(page, lang, killAnim) {
  return page.evaluate(({ lang, killAnim }) => {
    const h = document.documentElement;
    h.classList.remove('lang-en', 'lang-cz');
    h.classList.add('lang-' + lang);
    if (killAnim) h.classList.remove('anim');
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
    document.querySelectorAll('.stats .n').forEach((el) => {
      const to = el.getAttribute('data-to'); const s = el.getAttribute('data-suffix') || '';
      const dec = to.indexOf('.') > -1 ? 1 : 0;
      el.textContent = parseFloat(to).toFixed(dec) + s;
    });
  }, { lang, killAnim });
}

(async () => {
  const browser = await pw.chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });

  const d = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1.5 });
  await d.goto(fileUrl, { waitUntil: 'networkidle' });
  await d.evaluate(() => document.fonts && document.fonts.ready);
  await reveal(d, 'cz', true); await d.waitForTimeout(200);
  await d.screenshot({ path: dir + '/qa-desktop-cz.png', fullPage: true });
  await reveal(d, 'en', true); await d.waitForTimeout(200);
  await d.screenshot({ path: dir + '/qa-desktop-en.png', fullPage: true });
  await d.close();

  const m = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true });
  await m.goto(fileUrl, { waitUntil: 'networkidle' });
  await m.evaluate(() => document.fonts && document.fonts.ready);
  await reveal(m, 'cz', true); await m.waitForTimeout(200);
  await m.screenshot({ path: dir + '/qa-mobile-cz.png', fullPage: true });
  await m.close();

  // print-media preview (approximates the PDF look; A4 width ~794px @96dpi)
  const p = await browser.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 1.5 });
  await p.goto(fileUrl, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts && document.fonts.ready);
  await p.emulateMedia({ media: 'print' });
  await reveal(p, 'cz', true); await p.waitForTimeout(200);
  await p.screenshot({ path: dir + '/qa-print-cz.png', fullPage: true });
  await p.close();

  await browser.close();
  console.log('qa done');
})().catch((e) => { console.error(e); process.exit(1); });
