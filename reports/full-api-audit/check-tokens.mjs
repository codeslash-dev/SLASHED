// Ground 1A — token correctness against the baseline demo.
// Reads the live computed value of all 691 tokens, cross-checks the demo's own
// displayed value, compares literals to the oracle's declared default, verifies
// aliases resolve to their target, and confirms dark mode re-resolves colours.
import { localDemo, oracle, browser, save, SHOTS } from './lib.mjs';
import path from 'node:path';

const { tokens } = oracle();
const byName = new Map(tokens.map((t) => [t.name, t]));
const url = localDemo('full-api-demo.html', 'tokens-base.html');

const b = await browser();
const page = await b.newPage({ viewport: { width: 1280, height: 1600 } });
const consoleErrors = [];
page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', (e) => consoleErrors.push(String(e)));
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(900);

const read = () => page.evaluate(() => {
  const cs = getComputedStyle(document.documentElement);
  const out = {};
  document.querySelectorAll('[data-token]').forEach((el) => {
    const name = el.getAttribute('data-token');
    const shown = el.querySelector('.ttile__val')?.textContent.trim() ?? null;
    out[name] = { computed: cs.getPropertyValue(name).trim(), shown };
  });
  return out;
});

const light = await read();
await page.evaluate(() => document.querySelector('[data-act="theme:dark"]').click());
await page.waitForTimeout(300);
const dark = await read();
await b.close();

// ---- analysis ----
const isDerived = (v) => /var\(|calc\(|clamp\(|color-mix\(|oklch\(|light-dark\(|min\(|max\(|env\(|pow\(/.test(v || '');
const norm = (s) => (s || '').replace(/\s+/g, ' ').trim();

const rows = [];
for (const t of tokens) {
  const name = t.name;
  const live = light[name];
  const r = { name, tier: t.tier, role: t.role, category: t.category, declared: t.value, aliasOf: t.aliasOf || null, issues: [] };
  if (!live) { r.computed = null; r.issues.push('NOT_RENDERED'); rows.push(r); continue; }
  r.computed = live.computed;
  r.shown = live.shown;

  // 1. demo must report what the browser actually computed
  if (norm(live.shown) !== norm(live.computed) && live.shown !== '(empty)') {
    r.issues.push('DEMO_SHOWN_MISMATCH');
  }
  // 2. emptiness
  if (!live.computed) r.issues.push('EMPTY_COMPUTED');
  // 3. literal default must match the declared oracle value
  if (live.computed && t.value && !isDerived(t.value)) {
    if (norm(live.computed) !== norm(t.value)) r.issues.push('LITERAL_DEFAULT_MISMATCH');
  }
  // 4. dark mode delta (informational): did this token change under dark?
  r.darkComputed = dark[name]?.computed ?? null;
  r.changedInDark = r.darkComputed != null && norm(r.darkComputed) !== norm(live.computed);
  rows.push(r);
}

// 5. alias resolution: a token with aliasOf should compute equal to its target
for (const r of rows) {
  if (r.aliasOf && byName.has(r.aliasOf)) {
    const target = rows.find((x) => x.name === r.aliasOf);
    if (target && r.computed && target.computed && norm(r.computed) !== norm(target.computed)) {
      r.issues.push(`ALIAS_MISMATCH(->${r.aliasOf}=${target.computed})`);
    }
  }
}

const empties = rows.filter((r) => r.issues.includes('EMPTY_COMPUTED'));
const shownMismatch = rows.filter((r) => r.issues.includes('DEMO_SHOWN_MISMATCH'));
const literalMismatch = rows.filter((r) => r.issues.includes('LITERAL_DEFAULT_MISMATCH'));
const aliasMismatch = rows.filter((r) => r.issues.some((i) => i.startsWith('ALIAS_MISMATCH')));
const notRendered = rows.filter((r) => r.issues.includes('NOT_RENDERED'));
const darkChanges = rows.filter((r) => r.changedInDark).length;

const summary = {
  totalTokens: tokens.length,
  rendered: rows.length - notRendered.length,
  consoleErrors: consoleErrors.length,
  empties: empties.length,
  demoShownMismatch: shownMismatch.length,
  literalDefaultMismatch: literalMismatch.length,
  aliasMismatch: aliasMismatch.length,
  notRendered: notRendered.length,
  changedInDarkMode: darkChanges,
};

save('tokens-report.json', { summary, consoleErrors, rows });
console.log('TOKENS SUMMARY', JSON.stringify(summary, null, 2));
console.log('\nEMPTY tokens:', empties.map((r) => r.name).join(', ') || '(none)');
console.log('\nDEMO shown!=computed:', shownMismatch.map((r) => `${r.name}[shown=${r.shown}|computed=${r.computed}]`).slice(0, 20).join('\n  ') || '(none)');
console.log('\nLITERAL default mismatch:', literalMismatch.map((r) => `${r.name}: declared=${r.declared} computed=${r.computed}`).slice(0, 30).join('\n  ') || '(none)');
console.log('\nALIAS mismatch:', aliasMismatch.map((r) => `${r.name} ${r.issues.find((i) => i.startsWith('ALIAS'))} computed=${r.computed}`).slice(0, 20).join('\n  ') || '(none)');
