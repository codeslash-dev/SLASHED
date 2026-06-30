// Ground 1B — class behaviour + visual correctness against the baseline demo.
// For all 239 class tiles: confirm the selector ships in the loaded bundle, the
// stage element renders, and (for categories with a clear contract) the class
// applies its defining computed property. Also captures responsive screenshots.
import { localDemo, oracle, browser, save, SHOTS, ROOT } from './lib.mjs';
import fs from 'node:fs';
import path from 'node:path';

const { classes } = oracle();
const byName = new Map(classes.map((c) => [c.name, c]));
const bundleCss = fs.readFileSync(path.join(ROOT, 'badges/slashed.optimal.css'), 'utf8');
const url = localDemo('full-api-demo.html', 'classes-base.html');

const b = await browser();
const page = await b.newPage({ viewport: { width: 1280, height: 1600 } });
const consoleErrors = [];
page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', (e) => consoleErrors.push(String(e)));
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(800);

// Pull computed style snapshots for the element carrying each class.
const data = await page.evaluate(() => {
  const out = {};
  document.querySelectorAll('.tile[data-class]').forEach((tile) => {
    const cls = tile.getAttribute('data-class');
    const stage = tile.querySelector('.tile__stage');
    let el = stage?.querySelector('.' + CSS.escape(cls));
    if (!el && stage) el = stage.firstElementChild;
    if (!el) { out[cls] = null; return; }
    const cs = getComputedStyle(el);
    out[cls] = {
      display: cs.display,
      visibility: cs.visibility,
      opacity: cs.opacity,
      pointerEvents: cs.pointerEvents,
      overflow: cs.overflow,
      overflowX: cs.overflowX,
      textOverflow: cs.textOverflow,
      whiteSpace: cs.whiteSpace,
      cursor: cs.cursor,
      gridTemplateColumns: cs.gridTemplateColumns,
      gap: cs.gap,
      aspectRatio: cs.aspectRatio,
      maxWidth: cs.maxWidth,
      position: cs.position,
      backgroundColor: cs.backgroundColor,
      userSelect: cs.userSelect,
      width: el.offsetWidth,
      height: el.offsetHeight,
      isActive: cs.getPropertyValue('--sf-is-active').trim(),
      rendered: !!(el.offsetWidth || el.offsetHeight || cs.display === 'none'),
    };
  });
  return out;
});

// responsive screenshots for the visual-evidence section
for (const [w, h, tag] of [[1280, 2000, 'desktop'], [820, 2000, 'tablet'], [390, 2000, 'mobile']]) {
  await page.setViewportSize({ width: w, height: h });
  await page.waitForTimeout(150);
  await page.screenshot({ path: path.join(SHOTS, `baseline-${tag}.png`), fullPage: tag !== 'desktop' });
}
await b.close();

// ---- expectations ----
const expect = {
  'is-hidden': (s) => s.display === 'none',
  'is-invisible': (s) => s.visibility === 'hidden',
  'is-visible': (s) => s.visibility === 'visible',
  'is-disabled': (s) => s.pointerEvents === 'none' && Number(s.opacity) < 1,
  'is-readonly': (s) => s.pointerEvents === 'none',
  'is-loading': (s) => s.pointerEvents === 'none',
  'is-clipped': (s) => s.overflow === 'hidden',
  'is-scrollable': (s) => s.overflowX === 'auto' || s.overflow === 'auto',
  'is-truncated': (s) => s.textOverflow === 'ellipsis' && s.whiteSpace === 'nowrap',
  'is-draggable': (s) => s.cursor === 'grab',
  'is-active': (s) => s.isActive === '1',
  'is-selected': (s) => s.backgroundColor && s.backgroundColor !== 'rgba(0, 0, 0, 0)',
  'sf-grid': (s) => s.display === 'grid',
  'sf-equal': (s) => s.display === 'grid',
  'sf-content-grid': (s) => s.display === 'grid',
  'sf-bento': (s) => s.display === 'grid',
  'sf-cluster': (s) => s.display === 'flex',
  'sf-stack': (s) => s.display === 'flex',
  'sf-switcher': (s) => s.display === 'flex',
  'sf-frame': (s) => s.aspectRatio && s.aspectRatio !== 'auto',
  'sf-container': (s) => s.maxWidth && s.maxWidth !== 'none',
  'sf-truncate': (s) => s.textOverflow === 'ellipsis',
  'sr-only': (s) => s.position === 'absolute' && s.width <= 1,
  'sf-sr-only': (s) => s.position === 'absolute' && s.width <= 1,
};
// family fallbacks by prefix for variants (e.g. sf-grid--dense, sf-bento--2)
const familyExpect = (cls) => {
  // containers only (base or `--variant`); single-dash names like sf-bento-wide
  // are item span modifiers (grid-column/row) and stay display:block.
  if (/^sf-(grid|equal|content-grid|bento)(--|$)/.test(cls)) return (s) => s.display === 'grid' || s.display === 'flex';
  if (/^sf-(cluster|stack|switcher|reel)(--|$)/.test(cls)) return (s) => s.display === 'flex';
  if (/^sf-frame(--|$)/.test(cls)) return (s) => s.aspectRatio && s.aspectRatio !== 'auto';
  return null;
};

const rows = [];
for (const c of classes) {
  const cls = c.name;
  const s = data[cls];
  const r = { name: cls, category: c.category, kind: c.kind, bundles: c.bundles || [], issues: [] };
  if (!(bundleCss.includes('.' + cls))) r.issues.push('SELECTOR_NOT_IN_OPTIMAL_BUNDLE');
  if (!s) { r.issues.push('NO_STAGE_ELEMENT'); rows.push(r); continue; }
  r.display = s.display;
  // rendered: visible-area or intentionally display:none
  if (!s.rendered) r.issues.push('STAGE_NOT_RENDERED');
  const fn = expect[cls] || familyExpect(cls);
  if (fn) {
    r.checked = true;
    if (!fn(s)) r.issues.push('BEHAVIOUR_MISMATCH');
    else r.behaviourOk = true;
  } else {
    r.checked = false; // no strong contract; presence+render only
  }
  rows.push(r);
}

const notInBundle = rows.filter((r) => r.issues.includes('SELECTOR_NOT_IN_OPTIMAL_BUNDLE'));
const noStage = rows.filter((r) => r.issues.includes('NO_STAGE_ELEMENT'));
const behaviourMismatch = rows.filter((r) => r.issues.includes('BEHAVIOUR_MISMATCH'));
const checked = rows.filter((r) => r.checked);

const summary = {
  totalClasses: classes.length,
  consoleErrors: consoleErrors.length,
  selectorPresentInBundle: classes.length - notInBundle.length,
  notInOptimalBundle: notInBundle.map((r) => `${r.name} [bundles=${r.bundles.join('|') || 'none'}]`),
  noStageElement: noStage.map((r) => r.name),
  behaviourChecked: checked.length,
  behaviourPassed: checked.length - behaviourMismatch.length,
  behaviourMismatch: behaviourMismatch.map((r) => `${r.name} (display=${r.display})`),
};

save('classes-report.json', { summary, consoleErrors, rows });
console.log('CLASSES SUMMARY', JSON.stringify(summary, null, 2));
