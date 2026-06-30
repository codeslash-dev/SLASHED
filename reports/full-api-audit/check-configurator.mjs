// Ground 2B — override application through the configurator controls panel.
// Verifies the shared override path (control -> overrides state -> injected
// <style> -> live preview iframe) end to end across: power-knob sliders (all 6
// domains), generic token rows (color/length/keyword/font), a preset button,
// and reset. The preview iframe is the canonical resolver target.
import { chromium } from '@playwright/test';
import fs from 'node:fs';

const URL = 'http://127.0.0.1:5180/';
const OUT = '/home/user/SLASHED/reports/full-api-audit/results';
const SHOTS = '/home/user/SLASHED/reports/full-api-audit/screenshots';

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await b.newPage({ viewport: { width: 1700, height: 1050 } });
const consoleErrors = [];
page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', (e) => consoleErrors.push(String(e)));
await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(1000);

const previewFrame = () => page.frames().find((f) => f !== page.mainFrame());
async function nav(name) {
  await page.keyboard.press('Escape').catch(() => {});
  await page.mouse.click(5, 5).catch(() => {}); // dismiss any open input/overlay
  await page.getByRole('button', { name, exact: true }).first().click({ timeout: 8000 });
  await page.waitForTimeout(300);
}

// switch preview to the token-dense stylescape template
await page.getByRole('button', { name: 'Stylescape', exact: true }).first().click().catch(() => {});
await page.waitForTimeout(500);

async function frameComputed(tokens) {
  const f = previewFrame();
  if (!f) return {};
  return f.evaluate((ts) => {
    const cs = getComputedStyle(document.documentElement);
    const o = {};
    ts.forEach((t) => { o[t] = cs.getPropertyValue(t).trim(); });
    return o;
  }, tokens);
}
const frameOverrideCss = () => previewFrame()?.evaluate(() => document.getElementById('slashed-overrides')?.textContent || '') ?? '';
const parentOverrideCss = () => page.evaluate(() => document.getElementById('sf-parent-overrides')?.textContent || '');

const results = { powerKnobs: [], genericRows: [], preset: null, reset: null };

// ---------- A. Power knobs (all 6 domains) ----------
const KNOBS = [
  { domain: 'Colors', section: 'Focus ring', label: 'Focus ring width', token: '--sf-focus-ring-width', set: 5, driven: ['--sf-focus-ring-width'] },
  { domain: 'Typography', section: 'Text scale', label: 'Text scale', token: '--sf-text-scale', set: 1.6, driven: ['--sf-text-m', '--sf-text-2xl'] },
  { domain: 'Spacing', section: 'Space scale', label: 'Space scale', token: '--sf-space-scale', set: 1.7, driven: ['--sf-space-m', '--sf-space-2xl'] },
  { domain: 'Borders', section: 'Radius scale', label: 'Radius scale', token: '--sf-radius-scale', set: 1.8, driven: ['--sf-radius-m', '--sf-radius-l'] },
  { domain: 'Shadows', section: 'Shadow strength', label: 'Shadow strength', token: '--sf-shadow-strength', set: 0.4, driven: ['--sf-shadow-m'] },
  { domain: 'Motion', section: 'Motion scale', label: 'Motion scale', token: '--sf-motion-scale', set: 0.3, driven: ['--sf-duration-normal'] },
];

for (const k of KNOBS) {
  const r = { ...k, ok: false, notes: [] };
  try {
    await nav(k.domain);
    const before = await frameComputed(k.driven);
    // ensure the knob's section is expanded so its number input is in the DOM
    const labelVisible = await page.getByText(k.label, { exact: true }).first().isVisible().catch(() => false);
    if (!labelVisible) {
      await page.getByRole('button', { name: new RegExp(k.section, 'i') }).first().click().catch(() => {});
      await page.waitForTimeout(300);
    }
    // number input immediately following the knob label
    const num = page.locator(`xpath=(//*[normalize-space(text())="${k.label}"]/following::input[@type="number"])[1]`);
    await num.waitFor({ timeout: 4000 });
    await num.fill(String(k.set));
    await num.press('Enter');
    await page.waitForTimeout(450);
    const pcss = await parentOverrideCss();
    const fcss = await frameOverrideCss();
    const after = await frameComputed(k.driven);
    r.injectedParent = pcss.includes(k.token);
    r.injectedPreview = fcss.includes(k.token);
    r.drivenMoved = k.driven.filter((t) => before[t] !== after[t]);
    r.ok = (r.injectedParent || r.injectedPreview) && r.drivenMoved.length > 0;
    if (!r.injectedPreview && !r.injectedParent) r.notes.push('token not found in injected css');
    if (r.drivenMoved.length === 0) r.notes.push(`no driven token moved (before=${JSON.stringify(before)} after=${JSON.stringify(after)})`);
  } catch (e) { r.notes.push('ERR ' + String(e).slice(0, 120)); }
  results.powerKnobs.push(r);
  console.log(`KNOB ${k.domain}/${k.token}: ok=${r.ok} inject(parent=${r.injectedParent},preview=${r.injectedPreview}) moved=${(r.drivenMoved||[]).length} ${r.notes.join(';')}`);
}

// ---------- B. Generic token rows (varied types) ----------
const ROWS = [
  { domain: 'Colors', token: '--sf-color-primary-source-light', value: 'oklch(0.6 0.25 20)', check: ['--sf-color-primary'] },
  { domain: 'Borders', token: '--sf-border-style', value: 'dotted', check: ['--sf-border-style'] },
  { domain: 'Borders', token: '--sf-border-width-1', value: '4px', check: ['--sf-border-width-1'] },
  { domain: 'Typography', token: '--sf-font-body', value: '"Georgia", serif', check: ['--sf-font-body'] },
  { domain: 'Spacing', token: '--sf-gutter', value: '5rem', check: ['--sf-gutter'] },
];

for (const row of ROWS) {
  const r = { ...row, ok: false, notes: [] };
  try {
    await nav(row.domain);
    await page.waitForTimeout(300);
    const tab = page.getByRole('button', { name: 'All tokens', exact: true }).first();
    if (await tab.count()) { await tab.click().catch(() => {}); await page.waitForTimeout(300); }
    const before = await frameComputed(row.check);
    // locate the row by the token name (title attr) → climb to row → value button
    const nameEl = page.getByTitle(row.token, { exact: true }).first();
    await nameEl.scrollIntoViewIfNeeded();
    const rowBox = nameEl.locator('xpath=ancestor::div[contains(@class,"items-center")][1]');
    await rowBox.getByRole('button').first().click(); // expand
    await page.waitForTimeout(150);
    const input = rowBox.getByRole('textbox').first();
    await input.fill(row.value);
    await input.press('Enter');
    await page.waitForTimeout(400);
    const pcss = await parentOverrideCss();
    const fcss = await frameOverrideCss();
    const after = await frameComputed(row.check);
    r.injectedParent = pcss.includes(row.token);
    r.injectedPreview = fcss.includes(row.token);
    r.checkMoved = row.check.filter((t) => before[t] !== after[t]);
    r.ok = (r.injectedParent || r.injectedPreview) && r.checkMoved.length > 0;
    if (r.checkMoved.length === 0) r.notes.push(`computed unchanged before=${JSON.stringify(before)} after=${JSON.stringify(after)}`);
  } catch (e) { r.notes.push('ERR ' + String(e).slice(0, 140)); }
  results.genericRows.push(r);
  console.log(`ROW ${row.token}: ok=${r.ok} inject(parent=${r.injectedParent},preview=${r.injectedPreview}) moved=${(r.checkMoved||[]).length} ${r.notes.join(';')}`);
}

// ---------- C. Preset button (corner style) ----------
try {
  await nav('Borders');
  await page.waitForTimeout(300);
  const before = await frameComputed(['--sf-radius-scale', '--sf-radius-m']);
  await page.getByRole('button', { name: 'Pill', exact: true }).first().click();
  await page.waitForTimeout(450);
  const after = await frameComputed(['--sf-radius-scale', '--sf-radius-m']);
  const pcss = await parentOverrideCss();
  results.preset = { name: 'Pill', injected: /radius/.test(pcss), moved: JSON.stringify(before) !== JSON.stringify(after), before, after };
  console.log('PRESET Pill:', JSON.stringify(results.preset));
} catch (e) { results.preset = { error: String(e).slice(0, 120) }; }

// ---------- D. Reset a single override via the row ✕ ----------
try {
  await nav('Colors');
  const tab = page.getByRole('button', { name: 'All tokens', exact: true }).first();
  if (await tab.count()) { await tab.click().catch(() => {}); await page.waitForTimeout(300); }
  const token = '--sf-color-primary-source-light';
  const had = (await parentOverrideCss()).includes(token);
  const rowBox = page.getByTitle(token, { exact: true }).first().locator('xpath=ancestor::div[contains(@class,"items-center")][1]');
  await rowBox.getByRole('button', { name: '✕' }).first().click({ timeout: 4000 });
  await page.waitForTimeout(300);
  const now = (await parentOverrideCss()).includes(token);
  results.reset = { token, wasOverridden: had, removed: had && !now };
  console.log('RESET:', JSON.stringify(results.reset));
} catch (e) { results.reset = { error: String(e).slice(0, 140) }; }

await page.screenshot({ path: SHOTS + '/configurator-overridden.png' });
results.consoleErrors = consoleErrors;
const knobsOk = results.powerKnobs.filter((r) => r.ok).length;
const rowsOk = results.genericRows.filter((r) => r.ok).length;
results.summary = {
  powerKnobsOk: `${knobsOk}/${results.powerKnobs.length}`,
  genericRowsOk: `${rowsOk}/${results.genericRows.length}`,
  presetOk: !!(results.preset && results.preset.injected && results.preset.moved),
  consoleErrors: consoleErrors.length,
};
fs.writeFileSync(OUT + '/configurator-report.json', JSON.stringify(results, null, 2));
console.log('\nSUMMARY', JSON.stringify(results.summary, null, 2));
await b.close();
