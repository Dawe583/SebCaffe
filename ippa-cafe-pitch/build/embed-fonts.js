// Build a self-contained @font-face stylesheet: keep only latin + latin-ext
// subsets, inline each woff2 as a base64 data URI.
const fs = require('fs');
const path = require('path');

const css = fs.readFileSync(path.join(__dirname, 'gf.css'), 'utf8');
const urls = fs.readFileSync(path.join(__dirname, 'urls.txt'), 'utf8')
  .split('\n').map(s => s.trim()).filter(Boolean);

// url -> local downloaded file (urls.txt order == f1..fN download order)
const urlToFile = new Map();
urls.forEach((u, i) => urlToFile.set(u, path.join(__dirname, 'fonts', `f${i + 1}.woff2`)));

const KEEP = new Set(['latin', 'latin-ext']);

// Match "/* subset */\n@font-face { ... }"
const re = /\/\*\s*([\w-]+)\s*\*\/\s*(@font-face\s*\{[^}]*\})/g;
let out = [];
let m;
let kept = 0, total = 0;
while ((m = re.exec(css)) !== null) {
  total++;
  const subset = m[1];
  let block = m[2];
  if (!KEEP.has(subset)) continue;
  const urlMatch = block.match(/url\((https:\/\/fonts\.gstatic\.com[^)]+\.woff2)\)/);
  if (!urlMatch) continue;
  const file = urlToFile.get(urlMatch[1]);
  if (!file || !fs.existsSync(file)) { console.error('missing file for', urlMatch[1]); continue; }
  const b64 = fs.readFileSync(file).toString('base64');
  block = block.replace(urlMatch[1], `data:font/woff2;base64,${b64}`);
  // tidy whitespace
  block = block.replace(/\s+/g, ' ').replace(/\{ /g, '{').replace(/ \}/g, '}').replace(/; /g, ';').replace(/: /g, ':');
  out.push(`/* ${subset} */\n${block}`);
  kept++;
}
fs.writeFileSync(path.join(__dirname, 'embedded-fonts.css'), out.join('\n'));
console.error(`kept ${kept}/${total} @font-face blocks (latin + latin-ext)`);
const bytes = fs.statSync(path.join(__dirname, 'embedded-fonts.css')).size;
console.error(`embedded-fonts.css = ${(bytes/1024).toFixed(0)} KB`);
