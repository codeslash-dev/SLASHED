// @ts-check
// Deep container-query tests for all CQ-responsive primitives.
// Each grid/layout variant is exercised at all relevant breakpoints:
// below 30em, between 30em–48em, and above 48em (1em = 16px by default).
// setupInContainer pins font-size to 16px so em-based CQ thresholds are stable
// across browsers (WebKit 26+ resolves em against inherited font-size, not 16px).
import { test, expect } from '@playwright/test';
import { BUNDLE } from './render-helpers.js';

// Wraps grid HTML in a container of a known inline-size so anonymous
// @container queries fire against that width, not the viewport.
async function setupInContainer(page, widthPx, innerHtml) {
  await page.setViewportSize({ width: 1400, height: 900 });
  await page.setContent(`
    <!doctype html><html><body style="margin:0">
      <div id="wrap" style="container-type:inline-size;width:${widthPx}px">
        ${innerHtml}
      </div>
    </body></html>
  `);
  await page.addStyleTag({ path: BUNDLE });
  // Pin font-size so em in @container queries resolves consistently across browsers.
  // WebKit 26+ resolves em against the container's inherited font-size (spec-correct),
  // which would be ~20px with the framework's fluid scale; 16px keeps 48em = 768px.
  await page.addStyleTag({ content: ':root, html, body { font-size: 16px !important; }' });
}

function colCount(el) {
  const cols = getComputedStyle(el).gridTemplateColumns;
  return cols === 'none' ? 1 : cols.trim().split(/\s+/).length;
}

// ── .sf-grid-cols-2 ──────────────────────────────────────────────────
test.describe('CQ: .sf-grid-cols-2', () => {
  const GRID = '<div id="g" class="sf-grid-cols-2"><div>A</div><div>B</div></div>';

  test('1 column below 48em (400px container)', async ({ page }) => {
    await setupInContainer(page, 400, GRID);
    const cols = await page.locator('#g').evaluate(colCount);
    expect(cols).toBe(1);
  });

  test('2 columns at ≥ 48em (900px container)', async ({ page }) => {
    await setupInContainer(page, 900, GRID);
    const cols = await page.locator('#g').evaluate(colCount);
    expect(cols).toBe(2);
  });
});

// ── .sf-grid-cols-3 ──────────────────────────────────────────────────
test.describe('CQ: .sf-grid-cols-3', () => {
  const GRID = '<div id="g" class="sf-grid-cols-3"><div>A</div><div>B</div><div>C</div></div>';

  test('1 column below 48em (400px container)', async ({ page }) => {
    await setupInContainer(page, 400, GRID);
    const cols = await page.locator('#g').evaluate(colCount);
    expect(cols).toBe(1);
  });

  test('3 columns at ≥ 48em (900px container)', async ({ page }) => {
    await setupInContainer(page, 900, GRID);
    const cols = await page.locator('#g').evaluate(colCount);
    expect(cols).toBe(3);
  });
});

// ── .sf-grid-cols-4: 3 breakpoints ───────────────────────────────────
test.describe('CQ: .sf-grid-cols-4', () => {
  const GRID = '<div id="g" class="sf-grid-cols-4"><div>A</div><div>B</div><div>C</div><div>D</div></div>';

  test('1 column below 30em (300px container)', async ({ page }) => {
    await setupInContainer(page, 300, GRID);
    const cols = await page.locator('#g').evaluate(colCount);
    expect(cols).toBe(1);
  });

  test('2 columns between 30em and 48em (600px container)', async ({ page }) => {
    await setupInContainer(page, 600, GRID);
    const cols = await page.locator('#g').evaluate(colCount);
    expect(cols).toBe(2);
  });

  test('4 columns at ≥ 48em (900px container)', async ({ page }) => {
    await setupInContainer(page, 900, GRID);
    const cols = await page.locator('#g').evaluate(colCount);
    expect(cols).toBe(4);
  });
});

// ── .sf-grid-cols-6: 3 breakpoints ───────────────────────────────────
test.describe('CQ: .sf-grid-cols-6', () => {
  const GRID = '<div id="g" class="sf-grid-cols-6"><div>A</div><div>B</div><div>C</div><div>D</div><div>E</div><div>F</div></div>';

  test('1 column below 30em (300px container)', async ({ page }) => {
    await setupInContainer(page, 300, GRID);
    const cols = await page.locator('#g').evaluate(colCount);
    expect(cols).toBe(1);
  });

  test('3 columns between 30em and 48em (600px container)', async ({ page }) => {
    await setupInContainer(page, 600, GRID);
    const cols = await page.locator('#g').evaluate(colCount);
    expect(cols).toBe(3);
  });

  test('6 columns at ≥ 48em (900px container)', async ({ page }) => {
    await setupInContainer(page, 900, GRID);
    const cols = await page.locator('#g').evaluate(colCount);
    expect(cols).toBe(6);
  });
});

// ── .sf-grid-cols-1-2 ratio grid ─────────────────────────────────────
test.describe('CQ: .sf-grid-cols-1-2 ratio grid', () => {
  const GRID = '<div id="g" class="sf-grid-cols-1-2"><div id="a">Narrow</div><div id="b">Wide</div></div>';

  test('single column below 48em (400px container)', async ({ page }) => {
    await setupInContainer(page, 400, GRID);
    const cols = await page.locator('#g').evaluate(colCount);
    expect(cols).toBe(1);
  });

  test('second column is ~2× wider than first at ≥ 48em (900px container)', async ({ page }) => {
    await setupInContainer(page, 900, GRID);
    const [wa, wb] = await Promise.all([
      page.locator('#a').evaluate(el => el.getBoundingClientRect().width),
      page.locator('#b').evaluate(el => el.getBoundingClientRect().width),
    ]);
    // 1fr : 2fr → ratio ≈ 2 (allow ±0.15 for rounding/gap)
    expect(wb / wa).toBeGreaterThan(1.85);
    expect(wb / wa).toBeLessThan(2.15);
  });
});

// ── .sf-grid-cols-2-1 ratio grid ─────────────────────────────────────
test.describe('CQ: .sf-grid-cols-2-1 ratio grid', () => {
  test('first column is ~2× wider than second at ≥ 48em', async ({ page }) => {
    await setupInContainer(page, 900,
      '<div id="g" class="sf-grid-cols-2-1"><div id="a">Wide</div><div id="b">Narrow</div></div>'
    );
    const [wa, wb] = await Promise.all([
      page.locator('#a').evaluate(el => el.getBoundingClientRect().width),
      page.locator('#b').evaluate(el => el.getBoundingClientRect().width),
    ]);
    expect(wa / wb).toBeGreaterThan(1.85);
    expect(wa / wb).toBeLessThan(2.15);
  });
});

// ── .sf-grid-cols-1-3 ratio grid ─────────────────────────────────────
test.describe('CQ: .sf-grid-cols-1-3 ratio grid', () => {
  test('second column is ~3× wider than first at ≥ 48em', async ({ page }) => {
    await setupInContainer(page, 900,
      '<div id="g" class="sf-grid-cols-1-3"><div id="a">1</div><div id="b">3</div></div>'
    );
    const [wa, wb] = await Promise.all([
      page.locator('#a').evaluate(el => el.getBoundingClientRect().width),
      page.locator('#b').evaluate(el => el.getBoundingClientRect().width),
    ]);
    expect(wb / wa).toBeGreaterThan(2.7);
    expect(wb / wa).toBeLessThan(3.3);
  });
});

// ── .sf-bento ───────────────────────────────────────────────────
test.describe('CQ: .sf-bento', () => {
  const GRID = '<div id="g" class="sf-bento"><div>A</div><div>B</div><div>C</div><div>D</div></div>';

  test('collapses to 2 columns between 30em and 48em (600px container)', async ({ page }) => {
    await setupInContainer(page, 600, GRID);
    const cols = await page.locator('#g').evaluate(colCount);
    expect(cols).toBe(2);
  });

  test('uses default columns (> 2) at wide container (1000px)', async ({ page }) => {
    await setupInContainer(page, 1000, GRID);
    const cols = await page.locator('#g').evaluate(colCount);
    expect(cols).toBeGreaterThan(2);
  });

  test('below 30em container uses default column count (not 2-col override)', async ({ page }) => {
    await setupInContainer(page, 300, GRID);
    // Below 30em the 2-col CQ does NOT fire, so columns revert to the
    // default --sf-bento-cols-default value (typically 3 or 4).
    const cols = await page.locator('#g').evaluate(colCount);
    // Simply verify it's NOT the 2-col clamp value (it should be the default)
    expect(cols).not.toBe(2);
  });
});

// ── .sf-alternate ───────────────────────────────────────────────
// .sf-alternate itself establishes the named `sf-alternate` container,
// so the CQ fires on the element's own inline-size.
test.describe('CQ: .sf-alternate', () => {
  test('children stack (1 column) when element is narrow (400px)', async ({ page }) => {
    await page.setViewportSize({ width: 1400, height: 900 });
    await page.setContent(`
      <!doctype html><html><body style="margin:0">
        <div id="alt" class="sf-alternate" style="width:400px">
          <div id="row"><div>Image</div><div>Text</div></div>
        </div>
      </body></html>
    `);
    await page.addStyleTag({ path: BUNDLE });
    const cols = await page.locator('#row').evaluate(colCount);
    expect(cols).toBe(1);
  });

  test('children become 2-column when element is wide (1200px)', async ({ page }) => {
    await page.setViewportSize({ width: 1400, height: 900 });
    await page.setContent(`
      <!doctype html><html><body style="margin:0">
        <div id="alt" class="sf-alternate" style="width:1200px">
          <div id="row"><div>Image</div><div>Text</div></div>
        </div>
      </body></html>
    `);
    await page.addStyleTag({ path: BUNDLE });
    const cols = await page.locator('#row').evaluate(colCount);
    expect(cols).toBe(2);
  });

  test('even rows reverse child order at wide width', async ({ page }) => {
    await page.setViewportSize({ width: 1400, height: 900 });
    await page.setContent(`
      <!doctype html><html><body style="margin:0">
        <div class="sf-alternate" style="width:1200px">
          <div id="row1"><div id="r1c1">Image</div><div>Text</div></div>
          <div id="row2"><div id="r2c1">Image</div><div>Text</div></div>
        </div>
      </body></html>
    `);
    await page.addStyleTag({ path: BUNDLE });
    // Even row (nth-child(even)) first child gets order:2 (moved to end)
    const orderEven = await page.locator('#r2c1').evaluate(el =>
      parseInt(getComputedStyle(el).order)
    );
    const orderOdd = await page.locator('#r1c1').evaluate(el =>
      parseInt(getComputedStyle(el).order)
    );
    expect(orderEven).toBe(2); // reversed
    expect(orderOdd).toBe(0);  // normal (default)
  });
});

// ── .sf-container: named CQ inheritance ─────────────────────────
test.describe('CQ: .sf-container named container', () => {
  test('child can target sf-layout by name', async ({ page }) => {
    await page.setViewportSize({ width: 1400, height: 900 });
    await page.setContent(`
      <!doctype html><html>
      <head>
        <style>
          @container sf-layout (min-width: 600px) {
            #probe { color: rgb(0,128,0); }
          }
        </style>
      </head>
      <body>
        <div class="sf-container" style="width:900px">
          <div id="probe">probe</div>
        </div>
      </body></html>
    `);
    await page.addStyleTag({ path: BUNDLE });
    const color = await page.locator('#probe').evaluate(el => getComputedStyle(el).color);
    expect(color).toBe('rgb(0, 128, 0)');
  });

  test('child CQ does not fire when container is below threshold', async ({ page }) => {
    await page.setViewportSize({ width: 1400, height: 900 });
    await page.setContent(`
      <!doctype html><html>
      <head>
        <style>
          #probe { color: rgb(255,0,0); }
          @container sf-layout (min-width: 600px) {
            #probe { color: rgb(0,128,0); }
          }
        </style>
      </head>
      <body>
        <div class="sf-container" style="width:400px">
          <div id="probe">probe</div>
        </div>
      </body></html>
    `);
    await page.addStyleTag({ path: BUNDLE });
    const color = await page.locator('#probe').evaluate(el => getComputedStyle(el).color);
    expect(color).toBe('rgb(255, 0, 0)');
  });
});

test.describe('CQ: .sf-cq unnamed container', () => {
  test('establishes an anonymous inline-size container', async ({ page }) => {
    // Place a narrow .sf-cq (200px) inside a wide viewport (1400px).
    // @container queries on children should resolve against the .sf-cq width,
    // not the viewport. We confirm this by checking which breakpoints fire:
    //   ≥10em (160px): must fire   (200 > 160)
    //   ≥30em (480px): must not fire (200 < 480)
    await page.setViewportSize({ width: 1400, height: 900 });
    await page.setContent(`
      <!doctype html><html>
      <head>
        <style>
          :root, html, body { font-size: 16px !important; }
          /* Base colour applied by selector — lower specificity than @container block */
          .probe { color: rgb(255, 0, 0); }
          /* 10em = 160px — should fire since .sf-cq is 200px */
          @container (min-width: 10em) {
            .probe.at-10em { color: rgb(0, 0, 255); }
          }
          /* 30em = 480px — must NOT fire since .sf-cq is 200px */
          @container (min-width: 30em) {
            .probe.at-30em { color: rgb(0, 128, 0); }
          }
        </style>
      </head>
      <body>
        <div class="sf-cq" style="width:200px">
          <div id="at-10em" class="probe at-10em">probe</div>
          <div id="at-30em" class="probe at-30em">probe</div>
        </div>
      </body></html>
    `);
    await page.addStyleTag({ path: BUNDLE });

    const color10em = await page.locator('#at-10em').evaluate(el => getComputedStyle(el).color);
    const color30em = await page.locator('#at-30em').evaluate(el => getComputedStyle(el).color);

    // 200px ≥ 160px → 10em query fires → blue
    expect(color10em).toBe('rgb(0, 0, 255)');
    // 200px < 480px → 30em query does NOT fire → stays red
    expect(color30em).toBe('rgb(255, 0, 0)');
  });
});

// ── .sf-fluid-cq — container-relative fluid scale (#497) ─────────────────
// The fluid type/space scales interpolate against 100vw by default; .sf-fluid-cq
// re-declares them against 100cqi so a subtree scales to its container width,
// not the viewport. Verified via computed font-size of --sf-text-2xl.
test.describe('CQ: .sf-fluid-cq container-relative fluid', () => {
  async function fontSizeIn(page, widthPx, { deep = false } = {}) {
    await page.setViewportSize({ width: 1400, height: 900 });
    const inner = deep
      ? '<div><section><p id="t" style="font-size:var(--sf-text-2xl)">x</p></section></div>'
      : '<p id="t" style="font-size:var(--sf-text-2xl)">x</p>';
    await page.setContent(`
      <!doctype html><html><body style="margin:0">
        <div class="sf-fluid-cq" style="width:${widthPx}px">${inner}</div>
      </body></html>
    `);
    await page.addStyleTag({ path: BUNDLE });
    await page.addStyleTag({ content: ':root, html, body { font-size: 16px !important; }' });
    return page.locator('#t').evaluate(el => parseFloat(getComputedStyle(el).fontSize));
  }

  test('a narrow (300px) container clamps 2xl to its floor', async ({ page }) => {
    const size = await fontSizeIn(page, 300);
    // 300px < 360px (min viewport) → clamp floor = 1.25^3 rem = 31.25px
    expect(size).toBeCloseTo(31.25, 1);
  });

  test('a wider container yields a larger 2xl than a narrow one', async ({ page }) => {
    const narrow = await fontSizeIn(page, 300);
    const wide = await fontSizeIn(page, 1000);
    expect(wide).toBeGreaterThan(narrow);
  });

  test('deep descendants inherit the container-relative size', async ({ page }) => {
    const deep = await fontSizeIn(page, 300, { deep: true });
    expect(deep).toBeCloseTo(31.25, 1);
  });

  test('outside .sf-fluid-cq the scale stays viewport-relative (larger at 1400px viewport)', async ({ page }) => {
    await page.setViewportSize({ width: 1400, height: 900 });
    await page.setContent(`
      <!doctype html><html><body style="margin:0">
        <p id="vp" style="font-size:var(--sf-text-2xl)">x</p>
        <div class="sf-fluid-cq" style="width:300px"><p id="cq" style="font-size:var(--sf-text-2xl)">x</p></div>
      </body></html>
    `);
    await page.addStyleTag({ path: BUNDLE });
    await page.addStyleTag({ content: ':root, html, body { font-size: 16px !important; }' });
    const vp = await page.locator('#vp').evaluate(el => parseFloat(getComputedStyle(el).fontSize));
    const cq = await page.locator('#cq').evaluate(el => parseFloat(getComputedStyle(el).fontSize));
    // viewport (1400px, near max) must be larger than a 300px container (floor)
    expect(vp).toBeGreaterThan(cq);
  });
});
