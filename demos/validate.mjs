// Validates the generated demo in a real browser against the locally built
// optimal bundle. Asserts: no console errors, all class + token tiles present,
// JS populates live token values, the dark-mode toggle restyles the page, and
// the runtime override toggle perturbs computed styles.
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CDN = 'https://cdn.jsdelivr.net/gh/codeslash-dev/SLASHED@dist/slashed.optimal.css';
const LOCAL = path.join(ROOT, 'badges/slashed.optimal.css');
const TMP = path.join(ROOT, 'demos/.validate');
fs.mkdirSync(TMP, { recursive: true });
// make the runtime-injected override reachable from the temp copy
fs.copyFileSync(path.join(ROOT, 'ultimate-override.css'), path.join(TMP, 'ultimate-override.css'));

function localCopy(srcName, outName) {
  let html = fs.readFileSync(path.join(ROOT, srcName), 'utf8');
  html = html.replaceAll(CDN, 'file://' + LOCAL);
  const out = path.join(TMP, outName);
  fs.writeFileSync(out, html);
  return 'file://' + out;
}
const baseUrl = localCopy('full-api-demo.html', 'base.html');
const expectClasses = (fs.readFileSync(path.join(ROOT, 'full-api-demo.html'), 'utf8').match(/class="tile"/g) || []).length;
const expectTokens = (fs.readFileSync(path.join(ROOT, 'full-api-demo.html'), 'utf8').match(/data-token="/g) || []).length;

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 1280, height: 1600 } });
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push(String(e)));
await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(800);

const fails = [];
const snap = () => page.evaluate(() => {
  const cs = getComputedStyle(document.documentElement);
  const body = getComputedStyle(document.body);
  const vals = [...document.querySelectorAll('.ttile__val')].map((o) => o.textContent.trim());
  return {
    classTiles: document.querySelectorAll('.tile').length,
    tokenTiles: document.querySelectorAll('[data-token]').length,
    filledVals: vals.filter((v) => v && v !== '…' && v !== '(empty)').length,
    theme: document.documentElement.getAttribute('data-theme'),
    bg: body.backgroundColor,
    text: body.color,
    primary: cs.getPropertyValue('--sf-color-primary').trim(),
    spaceM: cs.getPropertyValue('--sf-space-m').trim(),
    fxSections: ['functions', 'reference'].filter((id) => document.getElementById(id)).length,
  };
});

const click = (sel) => page.evaluate((s) => document.querySelector(s).click(), sel);

const light = await snap();
await page.screenshot({ path: path.join(TMP, 'light.png') });

// dark mode
await click('[data-act="theme:dark"]');
await page.waitForTimeout(300);
const dark = await snap();
await page.screenshot({ path: path.join(TMP, 'dark.png') });

// runtime override toggle (back in light)
await click('[data-act="theme:light"]');
await click('#ovBtn');
await page.waitForTimeout(300);
const overridden = await snap();
await page.screenshot({ path: path.join(TMP, 'override.png') });

// section screenshots for the report
await click('#ovBtn'); // override off
await click('[data-act="theme:light"]');
await page.waitForTimeout(200);
for (const id of ['functions', 'reference']) {
  const el = await page.$('#' + id);
  if (el) await el.screenshot({ path: path.join(TMP, `sec-${id}.png`) }).catch(() => {});
}
await browser.close();

console.log('expected class tiles:', expectClasses, '| token tiles:', expectTokens);
console.log('LIGHT   :', JSON.stringify(light));
console.log('DARK    :', JSON.stringify(dark));
console.log('OVERRIDE:', JSON.stringify(overridden));
console.log('console errors:', errors.length);
errors.slice(0, 10).forEach((e) => console.log('   ⚠', e));

if (light.classTiles !== expectClasses) fails.push(`class tiles ${light.classTiles} != ${expectClasses}`);
if (light.tokenTiles !== expectTokens) fails.push(`token tiles ${light.tokenTiles} != ${expectTokens}`);
if (light.filledVals < expectTokens * 0.6) fails.push(`only ${light.filledVals}/${expectTokens} token values populated by JS`);
if (light.fxSections !== 2) fails.push('functions/reference sections missing');
if (dark.theme !== 'dark') fails.push('dark toggle did not set data-theme=dark');
if (dark.bg === light.bg) fails.push(`dark mode did not change body background (still ${light.bg})`);
if (overridden.primary === light.primary) fails.push('override toggle did not change --sf-color-primary');
if (overridden.spaceM === light.spaceM) fails.push('override toggle did not change --sf-space-m');
if (errors.length) fails.push(`${errors.length} console error(s)`);

if (fails.length) { console.log('\n❌ FAIL:'); fails.forEach((f) => console.log('   ', f)); process.exit(1); }
console.log(`\n✅ PASS — ${expectClasses} classes + ${expectTokens} tokens rendered; JS fills live values; dark mode restyles; override toggles live; 0 console errors.`);
