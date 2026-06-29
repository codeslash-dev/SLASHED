// Validates the generated demo pages in a real browser against the locally
// built optimal bundle. Asserts: no console errors, all class tiles present,
// and that the override actually changes computed styles.
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CDN = 'https://cdn.jsdelivr.net/gh/codeslash-dev/SLASHED@dist/slashed.optimal.css';
const LOCAL = path.join(ROOT, 'badges/slashed.optimal.css');
const TMP = path.join(ROOT, 'demos/.validate');
fs.mkdirSync(TMP, { recursive: true });

function localCopy(srcName, outName) {
  let html = fs.readFileSync(path.join(ROOT, srcName), 'utf8');
  html = html.replace(CDN, 'file://' + LOCAL);
  html = html.replace('href="ultimate-override.css"', `href="file://${path.join(ROOT, 'ultimate-override.css')}"`);
  const out = path.join(TMP, outName);
  fs.writeFileSync(out, html);
  return 'file://' + out;
}

const baseUrl = localCopy('full-api-demo.html', 'base.html');
const ovUrl = localCopy('full-api-demo-with-overrides.html', 'ov.html');
const expectedTiles = (fs.readFileSync(path.join(ROOT, 'full-api-demo.html'), 'utf8').match(/class="tile"/g) || []).length;

const PROBES = `(() => {
  const cs = getComputedStyle(document.documentElement);
  const body = getComputedStyle(document.body);
  const dbox = document.querySelector('.dbox');
  const h1 = document.querySelector('h1');
  return {
    primary: cs.getPropertyValue('--sf-color-primary').trim(),
    spaceM: cs.getPropertyValue('--sf-space-m').trim(),
    bodyFont: body.fontFamily,
    dboxPad: dbox ? getComputedStyle(dbox).paddingTop : null,
    h1Size: h1 ? getComputedStyle(h1).fontSize : null,
    tiles: document.querySelectorAll('.tile').length,
  };
})()`;

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const fails = [];
async function load(url, label) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 1600 } });
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(400);
  const probes = await page.evaluate(PROBES);
  await page.screenshot({ path: path.join(TMP, label + '.png'), fullPage: false });
  await page.close();
  return { probes, errors };
}

const base = await load(baseUrl, 'baseline');
const ov = await load(ovUrl, 'override');
await browser.close();

console.log('expected tiles:', expectedTiles);
console.log('\nBASELINE probes:', JSON.stringify(base.probes, null, 0));
console.log('OVERRIDE probes:', JSON.stringify(ov.probes, null, 0));
console.log('\nbaseline console errors:', base.errors.length);
base.errors.slice(0, 10).forEach((e) => console.log('   ⚠', e));
console.log('override console errors:', ov.errors.length);
ov.errors.slice(0, 10).forEach((e) => console.log('   ⚠', e));

// assertions
if (base.probes.tiles !== expectedTiles) fails.push(`baseline tiles ${base.probes.tiles} != ${expectedTiles}`);
if (ov.probes.tiles !== expectedTiles) fails.push(`override tiles ${ov.probes.tiles} != ${expectedTiles}`);
const changed = [];
for (const k of ['primary', 'spaceM', 'bodyFont', 'dboxPad', 'h1Size']) {
  if (base.probes[k] !== ov.probes[k]) changed.push(k);
  else fails.push(`override did NOT change "${k}" (still ${base.probes[k]})`);
}
console.log('\ntokens visibly changed by override:', changed.join(', ') || '(none!)');

if (fails.length) { console.log('\n❌ FAIL:'); fails.forEach((f) => console.log('   ', f)); process.exit(1); }
console.log('\n✅ PASS — pages render, all tiles present, override perturbs computed styles.');
