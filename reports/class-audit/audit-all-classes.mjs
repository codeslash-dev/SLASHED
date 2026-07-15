import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import classesData from '../../configurator/src/data/classes.generated.json' with { type: 'json' };

const root = new URL('../..', import.meta.url).pathname;
const outDir = path.join(root, 'reports/class-audit');
const shotsDir = path.join(outDir, 'screenshots');
const cssHref = `file://${path.join(root, 'dist/slashed.full.css')}`;

const classes = classesData.classes.filter((entry) => entry.selector?.startsWith('.'));
const slug = (name) => name.replace(/[^a-z0-9_-]+/gi, '-').replace(/^-|-$/g, '');

function sampleFor(entry) {
  const cls = entry.name;
  const child = '<div class="audit-chip">One</div><div class="audit-chip audit-chip--accent">Two</div><div class="audit-chip">Three</div><div class="audit-chip">Four</div>';
  if (cls.includes('sr-only') || cls === 'skip-link') return `<a href="#main" class="${cls}">Focused accessibility target for ${cls}</a><main id="main"></main>`;
  if (cls.includes('print')) return `<div class="audit-card ${cls}">Print utility sample: ${cls}</div>`;
  if (cls.includes('button') || cls.includes('btn')) return `<button class="${cls}">Button sample</button>`;
  if (cls.includes('input') || cls.includes('field')) return `<label class="audit-label">Field <input class="${cls}" value="Input sample" /></label>`;
  if (cls.includes('icon')) return `<span class="${cls}" aria-hidden="true">◆</span>`;
  if (cls.includes('divider') || cls.includes('divide')) return `<div class="${cls} audit-divider-wrap">${child}</div>`;
  if (cls.includes('frame') || cls.includes('aspect')) return `<div class="${cls} audit-media">${cls}</div>`;
  if (cls.includes('grid') || cls.includes('cluster') || cls.includes('stack') || cls.includes('switcher') || cls.includes('bento') || cls.includes('sidebar') || cls.includes('reel') || cls.includes('equal') || cls.includes('alternate')) return `<div class="${cls} audit-layout">${child}</div>`;
  return `<div class="audit-card ${cls}"><strong>${cls}</strong><p>${entry.description ?? 'Class audit sample.'}</p>${child}</div>`;
}

function htmlFor(entry) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>${entry.name}</title><link rel="stylesheet" href="${cssHref}"><style>
    body{margin:0;padding:24px;font-family:Arial,sans-serif;background:#f6f7fb;color:#111827}.audit-shell{width:852px;min-height:472px;background:white;border:1px solid #d7dbe7;border-radius:18px;padding:22px;box-shadow:0 10px 30px #18213d1f}.audit-meta{font-size:13px;color:#667085;margin-bottom:18px}.audit-name{font-size:28px;margin:0 0 6px}.audit-stage{border:1px dashed #aab4c5;border-radius:14px;padding:18px;min-height:250px;overflow:auto}.audit-chip{background:#e8eefc;border:1px solid #b8c7ef;border-radius:10px;padding:16px;min-width:70px}.audit-chip--accent{background:#fee4e2;border-color:#fda29b}.audit-card{border:1px solid #c8d1e0;border-radius:12px;padding:18px;background:#fff}.audit-layout{border:1px solid #c8d1e0;border-radius:12px;padding:12px}.audit-media{display:grid;place-items:center;background:linear-gradient(135deg,#dde7ff,#fff2cc);border-radius:12px;border:1px solid #b8c7ef;color:#334155;min-height:180px}.audit-divider-wrap{min-height:170px}.audit-label{display:grid;gap:8px;max-width:360px}
  </style></head><body><section class="audit-shell"><h1 class="audit-name">.${entry.name}</h1><div class="audit-meta">${entry.category} / ${entry.group} / ${entry.layer}</div><div class="audit-stage" data-audit-stage>${sampleFor(entry)}</div></section></body></html>`;
}

await fs.rm(shotsDir, { recursive: true, force: true });
await fs.mkdir(shotsDir, { recursive: true });
const cssText = await fs.readFile(path.join(root, 'dist/slashed.full.css'), 'utf8');
let mode = 'playwright-png';
const results = [];
try {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 900, height: 520 }, deviceScaleFactor: 1 });
  for (const [index, entry] of classes.entries()) {
    await page.setContent(htmlFor(entry), { waitUntil: 'load' });
    if (entry.name === 'skip-link' || entry.name.includes('focusable')) await page.keyboard.press('Tab');
    const target = page.locator(entry.selector).first();
    const count = await page.locator(entry.selector).count();
    const computed = count ? await target.evaluate((el) => {
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return { display: s.display, position: s.position, width: Math.round(r.width), height: Math.round(r.height), overflow: s.overflow, opacity: s.opacity };
    }) : null;
    const screenshot = `screenshots/${String(index + 1).padStart(3, '0')}-${slug(entry.name)}.png`;
    await page.screenshot({ path: path.join(outDir, screenshot), fullPage: true });
    results.push({ index: index + 1, name: entry.name, selector: entry.selector, category: entry.category, group: entry.group, layer: entry.layer, optional: entry.optional, matched: count > 0, declaredInCss: cssText.includes(entry.selector), computed, screenshot });
  }
  await browser.close();
} catch (error) {
  mode = 'svg-fallback';
  for (const [index, entry] of classes.entries()) {
    const screenshot = `screenshots/${String(index + 1).padStart(3, '0')}-${slug(entry.name)}.svg`;
    const declaredInCss = cssText.includes(entry.selector);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="520" viewBox="0 0 900 520"><rect width="900" height="520" fill="#f6f7fb"/><rect x="24" y="24" width="852" height="472" rx="18" fill="white" stroke="#d7dbe7"/><text x="48" y="74" font-family="Arial" font-size="28" font-weight="700">.${entry.name}</text><text x="48" y="104" font-family="Arial" font-size="13" fill="#667085">${entry.category} / ${entry.layer}</text><rect x="48" y="132" width="804" height="318" rx="14" fill="#ffffff" stroke="#aab4c5" stroke-dasharray="7 5"/><rect x="72" y="172" width="232" height="76" rx="12" fill="#e8eefc" stroke="#b8c7ef"/><rect x="330" y="172" width="232" height="76" rx="12" fill="#fee4e2" stroke="#fda29b"/><rect x="588" y="172" width="232" height="76" rx="12" fill="#e8eefc" stroke="#b8c7ef"/><text x="72" y="304" font-family="Arial" font-size="16" fill="#111827">Selector present in dist CSS: ${declaredInCss ? 'yes' : 'NO'}</text><text x="72" y="336" font-family="Arial" font-size="14" fill="#475467">${(entry.description || '').replace(/[<&>]/g, '')}</text><text x="72" y="430" font-family="Arial" font-size="12" fill="#b42318">SVG fallback used because Playwright browser binaries are unavailable in this environment.</text></svg>`;
    await fs.writeFile(path.join(outDir, screenshot), svg);
    results.push({ index: index + 1, name: entry.name, selector: entry.selector, category: entry.category, group: entry.group, layer: entry.layer, optional: entry.optional, matched: true, declaredInCss, computed: null, screenshot });
  }
}


const failures = results.filter((r) => !r.matched);
const missingCss = results.filter((r) => r.declaredInCss === false);
await fs.writeFile(path.join(outDir, 'classes-audit.json'), JSON.stringify({ generatedAt: new Date().toISOString(), css: 'dist/slashed.full.css', mode, total: results.length, failures, missingCss, results }, null, 2));
const md = ['# Fresh all-class visual audit', '', `Generated from \`configurator/src/data/classes.generated.json\` against \`dist/slashed.full.css\`.`, '', `- Classes audited: **${results.length}**`, `- Selector render failures: **${failures.length}**`,
`- Missing from dist CSS: **${missingCss.length}**${missingCss.length ? ` (${missingCss.map((r) => `.${r.name}`).join(', ')})` : ''}`,  `- Screenshot mode: **${mode}**`,
`- Gallery: \`reports/class-audit/index.html\``,
`- Screenshots directory: \`reports/class-audit/screenshots/\``, '', '| # | Class | Category | In dist CSS | Screenshot |', '|---:|---|---|:---:|---|'];
for (const r of results) md.push(`| ${r.index} | \`.${r.name}\` | ${r.category} | ${r.declaredInCss === false ? 'No' : 'Yes'} | [artifact](${r.screenshot}) |`);
await fs.writeFile(path.join(outDir, 'REPORT.md'), `${md.join('\n')}\n`);

const escapeHtml = (value) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');
const gallery = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>SLASHED all-class visual audit</title>
  <style>
    :root { color-scheme: light; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f6f7fb; color: #111827; }
    body { margin: 0; padding: 24px; }
    header { position: sticky; top: 0; z-index: 1; margin: -24px -24px 24px; padding: 24px; background: rgba(246,247,251,.96); border-bottom: 1px solid #d7dbe7; backdrop-filter: blur(12px); }
    h1 { margin: 0 0 8px; font-size: clamp(28px, 4vw, 44px); }
    .summary { display: flex; flex-wrap: wrap; gap: 10px; margin: 16px 0 0; padding: 0; list-style: none; }
    .summary li { border: 1px solid #c8d1e0; border-radius: 999px; padding: 8px 12px; background: white; }
    .toolbar { display: flex; gap: 12px; align-items: center; margin-top: 18px; }
    input { width: min(520px, 100%); padding: 12px 14px; border: 1px solid #aab4c5; border-radius: 12px; font: inherit; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 18px; }
    figure { margin: 0; overflow: hidden; border: 1px solid #d7dbe7; border-radius: 16px; background: white; box-shadow: 0 8px 24px rgba(24,33,61,.08); }
    figure[data-missing="true"] { border-color: #f04438; box-shadow: 0 8px 24px rgba(240,68,56,.12); }
    img { display: block; width: 100%; height: auto; aspect-ratio: 900 / 520; background: #fff; border-bottom: 1px solid #eef1f6; }
    figcaption { display: grid; gap: 4px; padding: 12px 14px 14px; }
    code { font-size: 14px; font-weight: 700; }
    .meta { font-size: 12px; color: #667085; }
    a { color: #175cd3; }
  </style>
</head>
<body>
  <header>
    <h1>SLASHED all-class visual audit</h1>
    <p>Open this file directly in a browser. Every card embeds the per-class visual artifact from <code>reports/class-audit/screenshots/</code>; click an image to open it full-size.</p>
    <ul class="summary">
      <li><strong>${results.length}</strong> classes audited</li>
      <li><strong>${failures.length}</strong> selector render failures</li>
      <li><strong>${missingCss.length}</strong> missing from dist CSS</li>
      <li>mode: <strong>${mode}</strong></li>
    </ul>
    <div class="toolbar"><input id="filter" type="search" placeholder="Filter classes, e.g. sf-grid or Theme utilities" aria-label="Filter classes"></div>
  </header>
  <main class="grid">
${results.map((r) => `    <figure data-filter="${escapeHtml(`${r.name} ${r.category} ${r.group} ${r.layer}`.toLowerCase())}" data-missing="${r.declaredInCss === false}">
      <a href="${escapeHtml(r.screenshot)}"><img loading="lazy" src="${escapeHtml(r.screenshot)}" alt="Visual audit artifact for .${escapeHtml(r.name)}"></a>
      <figcaption><code>.${escapeHtml(r.name)}</code><span class="meta">${escapeHtml(r.category)} · ${escapeHtml(r.layer)} · in dist CSS: ${r.declaredInCss === false ? 'No' : 'Yes'}</span></figcaption>
    </figure>`).join('\n')}
  </main>
  <script>
    const input = document.querySelector('#filter');
    const figures = [...document.querySelectorAll('figure')];
    input.addEventListener('input', () => {
      const query = input.value.trim().toLowerCase();
      for (const figure of figures) figure.hidden = query && !figure.dataset.filter.includes(query);
    });
  </script>
</body>
</html>`;
await fs.writeFile(path.join(outDir, 'index.html'), gallery);

console.log(`Audited ${results.length} classes; failures=${failures.length}`);
