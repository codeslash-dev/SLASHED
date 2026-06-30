// Walk every domain panel, collect the union of token-row names reachable
// through the UI, and capture any failed network requests.
import { chromium } from '@playwright/test';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await b.newPage({ viewport: { width: 1600, height: 1000 } });
const failed = [];
page.on('requestfailed', (r) => failed.push(r.url() + ' :: ' + r.failure()?.errorText));
page.on('response', (r) => { if (r.status() >= 400) failed.push(r.status() + ' ' + r.url()); });
await page.goto('http://127.0.0.1:5180/', { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(1000);

const panels = ['Colors', 'Typography', 'Spacing', 'Layout', 'Borders', 'Shadows', 'Motion', 'Effects', 'Macros', 'Misc', 'Themes', 'WCAG'];
const reachable = new Set();
const perPanel = {};
for (const name of panels) {
  await page.getByRole('button', { name, exact: true }).first().click().catch(async () => {
    await page.getByText(name, { exact: true }).first().click().catch(() => {});
  });
  await page.waitForTimeout(400);
  // some panels have sub-tabs (e.g. "Tokens"); click any tab that says Tokens/All
  const tabs = await page.getByRole('button').allInnerTexts().catch(() => []);
  for (const t of ['Tokens', 'All', 'All tokens', 'Advanced']) {
    const btn = page.getByRole('button', { name: t, exact: true }).first();
    if (await btn.count()) { await btn.click().catch(() => {}); await page.waitForTimeout(250); }
  }
  const names = await page.$$eval('[title^="--sf-"]', (els) => els.map((e) => e.getAttribute('title')));
  perPanel[name] = names.length;
  names.forEach((n) => reachable.add(n));
}
console.log('per-panel token-row counts:', JSON.stringify(perPanel));
console.log('UNION reachable token rows:', reachable.size);
console.log('failed/4xx requests:', JSON.stringify([...new Set(failed)], null, 2));
await b.close();
import fs from 'node:fs';
fs.writeFileSync('/home/user/SLASHED/reports/full-api-audit/results/reachable-ui.json', JSON.stringify([...reachable].sort(), null, 2));
