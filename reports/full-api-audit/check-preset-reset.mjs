// Focused: corner-style preset button, per-row reset (✕), and capture any 404.
import { chromium } from '@playwright/test';
import fs from 'node:fs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await b.newPage({ viewport: { width: 1700, height: 1050 } });
const bad = [];
page.on('response', (r) => { if (r.status() >= 400) bad.push(r.status() + ' ' + r.url()); });
page.on('requestfailed', (r) => bad.push('FAIL ' + r.url()));
await page.goto('http://127.0.0.1:5180/', { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(800);
await page.getByRole('button', { name: 'Stylescape', exact: true }).first().click().catch(() => {});
await page.waitForTimeout(400);
const frame = () => page.frames().find((f) => f !== page.mainFrame());
const computed = (ts) => frame().evaluate((a) => { const cs = getComputedStyle(document.documentElement); const o = {}; a.forEach((t) => o[t] = cs.getPropertyValue(t).trim()); return o; }, ts);
const parentCss = () => page.evaluate(() => document.getElementById('sf-parent-overrides')?.textContent || '');

const out = {};
// --- Preset: corner style "Pill" ---
await page.getByRole('button', { name: 'Borders', exact: true }).first().click();
await page.waitForTimeout(400);
const beforeP = await computed(['--sf-radius-scale', '--sf-radius-m']);
await page.getByRole('button', { name: 'Pill', exact: true }).first().click();
await page.waitForTimeout(500);
const afterP = await computed(['--sf-radius-scale', '--sf-radius-m']);
const pcss = await parentCss();
out.preset = { name: 'Pill', injectedRadius: /radius/.test(pcss), changed: JSON.stringify(beforeP) !== JSON.stringify(afterP), before: beforeP, after: afterP };

// --- Reset a single override via row ✕ ---
await page.getByRole('button', { name: 'Colors', exact: true }).first().click();
await page.waitForTimeout(400);
const tab = page.getByRole('button', { name: 'All tokens', exact: true }).first();
if (await tab.count()) { await tab.click().catch(() => {}); await page.waitForTimeout(300); }
const token = '--sf-color-primary-source-light';
const rowBox = page.getByTitle(token, { exact: true }).first().locator('xpath=ancestor::div[contains(@class,"items-center")][1]');
await rowBox.getByRole('button').first().click(); // expand value editor
await page.waitForTimeout(150);
const input = rowBox.getByRole('textbox').first();
await input.fill('oklch(0.55 0.2 300)');
await input.press('Enter');
await page.waitForTimeout(350);
const overriddenHas = (await parentCss()).includes(token);
// now reset via ✕
await rowBox.getByRole('button', { name: '✕' }).first().click({ timeout: 4000 }).catch(async () => {
  // fallback: any button in row that's not the value
  const btns = rowBox.getByRole('button');
  await btns.last().click().catch(() => {});
});
await page.waitForTimeout(350);
const afterResetHas = (await parentCss()).includes(token);
out.reset = { token, overriddenAfterEdit: overriddenHas, removedAfterReset: overriddenHas && !afterResetHas };

out.badRequests = [...new Set(bad)];
fs.writeFileSync('/home/user/SLASHED/reports/full-api-audit/results/preset-reset-report.json', JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
await b.close();
