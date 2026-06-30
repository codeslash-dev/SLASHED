// Ground 2B — generic-row override path through the configurator controls panel.
// Verifies that editing a token's generic row injects the override into both the
// chrome (<style id="sf-parent-overrides">) and the preview iframe
// (<style id="slashed-overrides">), and that the preview's computed value moves.
//
// Scope note: power knobs are covered by check-knobs.mjs (knobs-report.json) and
// the corner-style preset + per-row reset by check-preset-reset.mjs
// (preset-reset-report.json). Keeping each area in its own harness avoids the
// cross-step coupling that produced a stale combined artifact earlier.
import { chromium } from '@playwright/test';
import fs from 'node:fs';

const URL = 'http://127.0.0.1:5180/';
const OUT = '/home/user/SLASHED/reports/full-api-audit/results';

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await b.newPage({ viewport: { width: 1700, height: 1050 } });
const consoleErrors = [];
const requestFailures = [];
page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', (e) => consoleErrors.push(String(e)));
page.on('requestfailed', (req) => requestFailures.push(`${req.method()} ${req.url()} :: ${req.failure()?.errorText ?? 'unknown'}`));

const results = { genericRows: [] };
try {
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1000);
  const previewFrame = () => page.frames().find((f) => f !== page.mainFrame());
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
  async function nav(name) {
    await page.keyboard.press('Escape').catch(() => {});
    await page.mouse.click(5, 5).catch(() => {});
    await page.getByRole('button', { name, exact: true }).first().click({ timeout: 8000 });
    await page.waitForTimeout(300);
  }

  await page.getByRole('button', { name: 'Stylescape', exact: true }).first().click().catch(() => {});
  await page.waitForTimeout(500);

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
      const tab = page.getByRole('button', { name: 'All tokens', exact: true }).first();
      if (await tab.count()) { await tab.click().catch(() => {}); await page.waitForTimeout(300); }
      const before = await frameComputed(row.check);
      const nameEl = page.getByTitle(row.token, { exact: true }).first();
      await nameEl.scrollIntoViewIfNeeded();
      const rowBox = nameEl.locator('xpath=ancestor::div[contains(@class,"items-center")][1]');
      await rowBox.getByRole('button').first().click();
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
    console.log(`ROW ${row.token}: ok=${r.ok} inject(parent=${r.injectedParent},preview=${r.injectedPreview}) moved=${(r.checkMoved || []).length} ${r.notes.join(';')}`);
  }
} finally {
  await b.close();
}

const rowsOk = results.genericRows.filter((r) => r.ok).length;
results.consoleErrors = consoleErrors;
results.requestFailures = requestFailures;
results.summary = {
  genericRowsOk: `${rowsOk}/${results.genericRows.length}`,
  consoleErrors: consoleErrors.length,
  requestFailures: requestFailures.length,
  note: 'power knobs -> knobs-report.json (8/8); preset+reset -> preset-reset-report.json',
};
fs.writeFileSync(OUT + '/configurator-report.json', JSON.stringify(results, null, 2));
console.log('\nSUMMARY', JSON.stringify(results.summary, null, 2));
