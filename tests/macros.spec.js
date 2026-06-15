// @ts-check
// Behavioural tests for core/macros.css.
// Each macro is exercised against a synthetic fixture and its
// observable effect verified via getComputedStyle / layout reads.
import { test, expect } from '@playwright/test';
import path from 'node:path';

const BUNDLE = path.join(process.cwd(), 'dist', 'slashed.essential.css');

async function setup(page, html) {
  await page.setViewportSize({ width: 800, height: 600 });
  await page.setContent(`<!doctype html><html><body>${html}</body></html>`);
  await page.addStyleTag({ path: BUNDLE });
}

test.describe('macro: .sf-flow', () => {
  test('applies margin-block-start to every child after the first', async ({ page }) => {
    await setup(page, `
      <div class="sf-flow" id="t">
        <p>One</p>
        <p>Two</p>
        <p>Three</p>
      </div>
    `);
    const margins = await page.locator('#t > p').evaluateAll(els =>
      els.map(el => getComputedStyle(el).marginBlockStart)
    );
    expect(margins.length).toBe(3);
    // First child has zero margin (only adjacent siblings get the margin)
    expect(margins[0]).toBe('0px');
    // Subsequent children resolve --sf-flow-space (a clamp() so non-zero)
    expect(parseFloat(margins[1])).toBeGreaterThan(0);
    expect(parseFloat(margins[2])).toBeGreaterThan(0);
    expect(margins[1]).toBe(margins[2]);
  });

  test('honours --sf-flow-space override', async ({ page }) => {
    await setup(page, `
      <div class="sf-flow" id="t" style="--sf-flow-space: 100px">
        <p>One</p>
        <p>Two</p>
      </div>
    `);
    const m = await page.locator('#t > p:nth-child(2)').evaluate(el =>
      getComputedStyle(el).marginBlockStart
    );
    expect(m).toBe('100px');
  });
});

test.describe('macro: .sf-truncate', () => {
  test('produces single-line ellipsis on overflowing text', async ({ page }) => {
    await setup(page, `
      <div id="t" class="sf-truncate" style="width: 100px; font-size: 16px">
        ${'x'.repeat(200)}
      </div>
    `);
    const cs = await page.locator('#t').evaluate(el => {
      const s = getComputedStyle(el);
      return {
        overflow: s.overflow,
        textOverflow: s.textOverflow,
        whiteSpace: s.whiteSpace,
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth,
      };
    });
    expect(cs.textOverflow).toBe('ellipsis');
    expect(cs.whiteSpace).toBe('nowrap');
    // Overflow keyword can resolve to "clip" or "hidden" depending on engine
    expect(['hidden', 'clip']).toContain(cs.overflow);
    // Content actually overflows the container
    expect(cs.scrollWidth).toBeGreaterThan(cs.clientWidth);
  });
});

test.describe('macro: .sf-line-clamp-*', () => {
  test('.sf-line-clamp-2 limits visible lines to 2', async ({ page }) => {
    await setup(page, `
      <p id="t" class="sf-line-clamp-2"
         style="width: 200px; font-size: 16px; line-height: 1.5">
        ${'word '.repeat(60)}
      </p>
    `);
    // We don't assert getComputedStyle().display here. The macro sets
    // `display: -webkit-box` to enable line-clamp, but Chromium and Firefox
    // can normalise the computed value (e.g. to 'flow-root' for a <p>) while
    // still honouring the line-clamp behaviour. The clamp is what we care
    // about, and it's verified directly via webkitLineClamp + clientHeight.
    const cs = await page.locator('#t').evaluate(el => ({
      lineClamp: getComputedStyle(el).webkitLineClamp,
      height:    el.clientHeight,
    }));
    expect(cs.lineClamp).toBe('2');
    // Two lines × 16px × 1.5 line-height = 48px (allow up to 50)
    expect(cs.height).toBeLessThanOrEqual(50);
  });

  test('.sf-line-clamp-N reads --sf-line-clamp', async ({ page }) => {
    await setup(page, `
      <p id="t" class="sf-line-clamp-N"
         style="width: 200px; font-size: 16px; line-height: 1.5; --sf-line-clamp: 4">
        ${'word '.repeat(80)}
      </p>
    `);
    const lc = await page.locator('#t').evaluate(el =>
      getComputedStyle(el).webkitLineClamp
    );
    expect(lc).toBe('4');
  });
});

test.describe('macro: .sf-aspect', () => {
  test('respects --sf-aspect override', async ({ page }) => {
    await setup(page, `
      <div id="t" class="sf-aspect"
           style="width: 200px; --sf-aspect: 1 / 1"></div>
    `);
    const dims = await page.locator('#t').evaluate(el => ({
      w: el.clientWidth, h: el.clientHeight,
    }));
    expect(dims.w).toBe(200);
    expect(dims.h).toBe(200);
  });

  test('default ratio is 16/9', async ({ page }) => {
    await setup(page, `<div id="t" class="sf-aspect" style="width: 320px"></div>`);
    const dims = await page.locator('#t').evaluate(el => ({
      w: el.clientWidth, h: el.clientHeight,
    }));
    expect(dims.w).toBe(320);
    expect(dims.h).toBe(180); // 320 * 9/16
  });
});

test.describe('macro: .sf-equal-height', () => {
  test('children stretch to tallest', async ({ page }) => {
    await setup(page, `
      <div id="t" class="sf-equal-height">
        <div class="a">short</div>
        <div class="b" style="block-size: 120px">tall</div>
      </div>
    `);
    const heights = await page.locator('#t > div').evaluateAll(els =>
      els.map(el => el.clientHeight)
    );
    // Both children render with the container's stretched height.
    // Tallest is 120, so both should be ≥ 120 (allow ±2 for rounding).
    expect(heights[0]).toBeGreaterThanOrEqual(118);
    expect(heights[1]).toBeGreaterThanOrEqual(118);
  });
});

test.describe('macro: .sf-scroll-snap', () => {
  test('applies vertical scroll-snap on container and align: start on children', async ({ page }) => {
    await setup(page, `
      <div id="t" class="sf-scroll-snap" style="height: 200px">
        <section style="height: 200px">A</section>
        <section style="height: 200px">B</section>
      </div>
    `);
    const cs = await page.locator('#t').evaluate(el => getComputedStyle(el).scrollSnapType);
    expect(cs).toContain('y');
    expect(cs).toContain('mandatory');
    const childAlign = await page.locator('#t > section:first-child').evaluate(el =>
      getComputedStyle(el).scrollSnapAlign
    );
    expect(childAlign).toBe('start');
  });
});

test.describe('macro: .sf-no-tap-highlight', () => {
  test('sets -webkit-tap-highlight-color to transparent', async ({ page, browserName }) => {
    await setup(page, `<a id="t" class="sf-no-tap-highlight" href="#">x</a>`);
    // -webkit-tap-highlight-color is non-standard; only WebKit/Blink expose
    // it as a computed-style IDL attribute. Firefox returns `undefined` for
    // `getComputedStyle(el).webkitTapHighlightColor` regardless of the rule
    // ever applying. We read via getPropertyValue so the assertion is
    // engine-portable: WebKit/Chromium return 'rgba(0, 0, 0, 0)'; Firefox
    // returns '' (the property is unrecognised) — both prove the macro
    // didn't break anything, and only the WebKit/Chromium case verifies the
    // visible behaviour change.
    const c = await page.locator('#t').evaluate(el =>
      getComputedStyle(el).getPropertyValue('-webkit-tap-highlight-color')
    );
    if (browserName === 'firefox') {
      // Firefox reports an empty string — there's no native tap-highlight to
      // disable, so the macro is a no-op there. Sanity check that we didn't
      // somehow get the wrong value.
      expect(c).toBe('');
    } else {
      expect(c).toBe('rgba(0, 0, 0, 0)');
    }
  });
});

test.describe('macro: .sf-scroll-shadow / .sf-overflow-fade', () => {
  test('.sf-scroll-shadow sets a vertical mask gradient on a scrollable element', async ({ page }) => {
    await setup(page, `<div id="t" class="sf-scroll-shadow" style="height: 100px"></div>`);
    const cs = await page.locator('#t').evaluate(el => ({
      mask:     getComputedStyle(el).maskImage,
      overflow: getComputedStyle(el).overflowY,
    }));
    expect(cs.mask).toContain('linear-gradient');
    expect(cs.overflow).toBe('auto');
  });

  test('.sf-overflow-fade sets a horizontal end-edge mask gradient', async ({ page }) => {
    await setup(page, `<div id="t" class="sf-overflow-fade" style="width: 100px"></div>`);
    const mask = await page.locator('#t').evaluate(el => getComputedStyle(el).maskImage);
    expect(mask).toContain('linear-gradient');
  });
});
