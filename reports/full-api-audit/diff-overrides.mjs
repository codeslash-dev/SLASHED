// Ground 1C — override-wiring proof.
// Loads the baseline demo and the always-on overrides demo, diffs the computed
// value of every token, and confirms each of the 202 perturbed knobs actually
// moved while the 23 documented skips and the consumption layer behave sanely.
import { localDemo, oracle, browser, save, SHOTS } from './lib.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { DEMOS } from './lib.mjs';

const { tokens } = oracle();
const knobs = tokens.filter((t) => t.role === 'knob').map((t) => t.name);

// tokens the override file explicitly sets
const ovCss = fs.readFileSync(path.join(DEMOS, 'ultimate-override.css'), 'utf8');
const perturbed = new Set(
  [...ovCss.matchAll(/^\s*(--sf-[a-z0-9-]+)\s*:/gim)].map((m) => m[1]),
);
// documented skip list lives in the trailing comment block
const skipBlock = ovCss.slice(ovCss.indexOf('Intentionally NOT overridden'));
const skips = new Set([...skipBlock.matchAll(/(--sf-[a-z0-9-]+)\s+—/g)].map((m) => m[1]));

async function readAll(srcName, outName) {
  const url = localDemo(srcName, outName);
  const b = await browser();
  const page = await b.newPage({ viewport: { width: 1280, height: 1600 } });
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push(String(e)));
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(900);
  if (outName.includes('ov')) {
    await page.screenshot({ path: path.join(SHOTS, 'overrides-desktop.png') });
  }
  const vals = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    const o = {};
    document.querySelectorAll('[data-token]').forEach((el) => {
      o[el.getAttribute('data-token')] = cs.getPropertyValue(el.getAttribute('data-token')).trim();
    });
    return o;
  });
  await b.close();
  return { vals, errs };
}

const base = await readAll('full-api-demo.html', 'diff-base.html');
const over = await readAll('full-api-demo-with-overrides.html', 'diff-ov.html');

const norm = (s) => (s || '').replace(/\s+/g, ' ').trim();
const changed = (n) => norm(base.vals[n]) !== norm(over.vals[n]);

// 1. every perturbed knob must change its computed value
const perturbedNotMoved = [...perturbed].filter((n) => !changed(n));
// 2. skip list reconciliation
const knobSet = new Set(knobs);
const knobsNotPerturbed = knobs.filter((n) => !perturbed.has(n));
const skipsNotKnob = [...skips].filter((n) => !knobSet.has(n));
const undocumentedSkips = knobsNotPerturbed.filter((n) => !skips.has(n));
// 3. consumption tokens that moved (downstream wiring works)
const consumptionMoved = tokens.filter((t) => t.role === 'consumption' && changed(t.name)).length;
const totalChanged = tokens.filter((t) => changed(t.name)).length;

const summary = {
  knobTotal: knobs.length,
  perturbedDeclared: perturbed.size,
  perturbedThatMoved: perturbed.size - perturbedNotMoved.length,
  perturbedNotMoved,
  documentedSkips: skips.size,
  knobsNotPerturbed: knobsNotPerturbed.length,
  undocumentedSkips,
  skipsNotMatchingAKnob: skipsNotKnob,
  consumptionTokensMoved: consumptionMoved,
  totalTokensChanged: totalChanged,
  baseConsoleErrors: base.errs.length,
  overConsoleErrors: over.errs.length,
};

const detail = knobs.map((n) => ({
  name: n,
  perturbed: perturbed.has(n),
  skipped: skips.has(n),
  base: base.vals[n],
  override: over.vals[n],
  moved: changed(n),
}));

save('overrides-report.json', { summary, knobs: detail });
console.log('OVERRIDE DIFF SUMMARY', JSON.stringify(summary, null, 2));
