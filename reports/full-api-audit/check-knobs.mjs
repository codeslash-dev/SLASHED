// Focused Ground 2B check for the 6 power knobs. Each knob's RangeWithNumber
// renders an <input type=number> with the knob's exact min/max/step, which
// uniquely identifies it within its panel. We expand all accordion sections,
// set the knob, and confirm the override is injected and driven tokens move in
// the live preview iframe.
import { chromium } from '@playwright/test';
import fs from 'node:fs';

const URL = 'http://127.0.0.1:5180/';
const OUT = '/home/user/SLASHED/reports/full-api-audit/results';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await b.newPage({ viewport: { width: 1700, height: 1050 } });
await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(800);
await page.getByRole('button', { name: 'Stylescape', exact: true }).first().click().catch(() => {});
await page.waitForTimeout(400);
const frame = () => page.frames().find((f) => f !== page.mainFrame());
const computed = (ts) => frame().evaluate((a) => { const cs = getComputedStyle(document.documentElement); const o = {}; a.forEach((t) => o[t] = cs.getPropertyValue(t).trim()); return o; }, ts);
const parentCss = () => page.evaluate(() => document.getElementById('sf-parent-overrides')?.textContent || '');
const previewCss = () => frame().evaluate(() => document.getElementById('slashed-overrides')?.textContent || '');

// knob -> {panel, accordion section header, min/max/step attrs, driven tokens}
const KNOBS = [
  { token: '--sf-focus-ring-width', panel: 'Borders', section: /focus ring/i, min: '0', max: '6', step: '0.5', set: '5', driven: ['--sf-focus-ring-width'] },
  { token: '--sf-radius-scale', panel: 'Borders', section: /radius scale/i, min: '0', max: '2', step: '0.05', set: '1.8', driven: ['--sf-radius-m', '--sf-radius-l'] },
  { token: '--sf-text-scale', panel: 'Typography', section: /modular scale/i, min: '0.5', max: '2', step: '0.05', set: '1.6', driven: ['--sf-text-m', '--sf-text-2xl'] },
  { token: '--sf-text-display-scale', panel: 'Typography', section: /display type/i, min: '0.5', max: '2', step: '0.05', set: '1.7', driven: ['--sf-text-display-l'], pickLast: true },
  { token: '--sf-space-scale', panel: 'Spacing', section: /modular scale/i, min: '0.5', max: '2', step: '0.05', set: '1.7', driven: ['--sf-space-m', '--sf-space-2xl'] },
  { token: '--sf-section-scale', panel: 'Spacing', section: /density presets/i, min: '0.5', max: '2', step: '0.05', set: '1.6', driven: ['--sf-section-pad--m'], pickLast: true },
  { token: '--sf-shadow-strength', panel: 'Shadows', section: /shadow appearance/i, min: '0', max: '0.5', step: '0.01', set: '0.4', driven: ['--sf-shadow-m'] },
  { token: '--sf-motion-scale', panel: 'Motion', section: /global scale/i, min: '0', max: '2', step: '0.05', set: '0.3', driven: ['--sf-duration-normal'] },
];

const results = [];
for (const k of KNOBS) {
  const r = { ...k, section: String(k.section), ok: false, notes: [] };
  try {
    await page.keyboard.press('Escape').catch(() => {});
    await page.getByRole('button', { name: k.panel, exact: true }).first().click();
    await page.waitForTimeout(350);
    const before = await computed(k.driven);
    const sel = `input[type=number][min="${k.min}"][max="${k.max}"][step="${k.step}"]`;
    // expand the knob's section if its input isn't present yet
    if (await page.locator(sel).count() === 0) {
      await page.getByRole('button', { name: k.section }).first().click({ timeout: 4000 }).catch(() => {});
      await page.waitForTimeout(300);
    }
    const inputs = page.locator(sel);
    const cnt = await inputs.count();
    const num = k.pickLast && cnt > 1 ? inputs.nth(cnt - 1) : inputs.first();
    await num.waitFor({ timeout: 4000 });
    await num.fill(k.set);
    await num.press('Enter');
    await page.waitForTimeout(450);
    const pcss = await parentCss(); const fcss = await previewCss();
    const after = await computed(k.driven);
    r.matchingInputs = cnt;
    r.injectedParent = pcss.includes(k.token);
    r.injectedPreview = fcss.includes(k.token);
    r.drivenMoved = k.driven.filter((t) => before[t] !== after[t]);
    r.ok = (r.injectedParent || r.injectedPreview) && r.drivenMoved.length > 0;
    if (!r.ok) r.notes.push(`before=${JSON.stringify(before)} after=${JSON.stringify(after)}`);
  } catch (e) { r.notes.push('ERR ' + String(e).slice(0, 120)); }
  results.push(r);
  console.log(`KNOB ${k.token} (${k.panel}): ok=${r.ok} inputs=${r.matchingInputs} inject(p=${r.injectedParent},prev=${r.injectedPreview}) moved=${(r.drivenMoved || []).length} ${r.notes.join(';')}`);
}
const okN = results.filter((r) => r.ok).length;
fs.writeFileSync(OUT + '/knobs-report.json', JSON.stringify({ summary: `${okN}/${results.length}`, results }, null, 2));
console.log('\nKNOBS SUMMARY', `${okN}/${results.length}`);
await b.close();
