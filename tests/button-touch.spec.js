// @ts-check
// Touch-device (pointer: coarse) behaviour for .sf-btn.
//
// The blanket WCAG 44px touch-target floor in core/accessibility.css
// deliberately EXCLUDES .sf-btn (`button:not(.sf-btn)`), so the XS–XL size
// ladder stays visible on phones/tablets instead of every rung collapsing to
// 44px. This is the regression guard for the "all button sizes look identical
// on mobile" report: the ladder rendered correctly with a mouse but flattened
// under a coarse pointer. Bare <button>s and native controls keep the floor;
// consumers opt back into 44px on .sf-btn with
// `--sf-btn-min-height: var(--sf-touch-target)`.
//
// Chromium-only: coarse-pointer / isMobile emulation is Chromium-specific in
// Playwright.
import { test, expect } from '@playwright/test';
import path from 'node:path';

const COMPONENTS_BUNDLE = path.join(process.cwd(), 'dist', 'slashed.full.css');
const NO_TRANSITIONS =
  '*,*::before,*::after{transition:none!important;animation-duration:0s!important}';
const TOUCH_CONTEXT = { hasTouch: true, isMobile: true, viewport: { width: 412, height: 900 } };

const SIZES_HTML = `
  <button class="sf-btn sf-btn--xs" id="xs">A</button>
  <button class="sf-btn sf-btn--s"  id="s">A</button>
  <button class="sf-btn"            id="m">A</button>
  <button class="sf-btn sf-btn--l"  id="l">A</button>
  <button class="sf-btn sf-btn--xl" id="xl">A</button>`;

async function renderTouch(browser, { html = SIZES_HTML, extraCss = '' } = {}) {
  const ctx = await browser.newContext(TOUCH_CONTEXT);
  const page = await ctx.newPage();
  await page.setContent(`<!doctype html><html><body style="margin:0">${html}</body></html>`);
  await page.addStyleTag({ path: COMPONENTS_BUNDLE });
  await page.addStyleTag({ content: NO_TRANSITIONS + extraCss });
  return { ctx, page };
}

const heights = (page, ids) =>
  page.evaluate(
    (list) => list.map((id) => document.getElementById(id).getBoundingClientRect().height),
    ids,
  );

test.describe('.sf-btn on a coarse (touch) pointer', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'coarse-pointer emulation is Chromium-only');

  test('the emulated context really reports a coarse pointer', async ({ browser }) => {
    const { ctx, page } = await renderTouch(browser);
    expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches)).toBe(true);
    await ctx.close();
  });

  test('size ladder stays visible on touch (xs < s < m < l < xl), not flattened to 44px', async ({ browser }) => {
    const { ctx, page } = await renderTouch(browser);
    const h = await heights(page, ['xs', 's', 'm', 'l', 'xl']);
    for (let i = 1; i < h.length; i++) {
      expect(h[i], `#${i} taller than #${i - 1}`).toBeGreaterThan(h[i - 1]);
    }
    // xs sits below the 44px AAA floor — proof .sf-btn is exempt from the
    // blanket coarse-pointer rule — while still clearing the WCAG 2.2 AA 24px.
    expect(h[0]).toBeLessThan(44);
    expect(h[0]).toBeGreaterThanOrEqual(24);
    await ctx.close();
  });

  test('opt-in: --sf-btn-min-height: var(--sf-touch-target) restores the 44px floor on every size', async ({ browser }) => {
    const { ctx, page } = await renderTouch(browser, {
      extraCss: ':root{--sf-btn-min-height:var(--sf-touch-target)}',
    });
    const h = await heights(page, ['xs', 's', 'm', 'l', 'xl']);
    for (const v of h) expect(v).toBeGreaterThanOrEqual(44);
    await ctx.close();
  });

  test('a bare <button> (no .sf-btn) keeps the 44px floor on touch', async ({ browser }) => {
    const { ctx, page } = await renderTouch(browser, { html: `<button id="b">x</button>` });
    const h = await heights(page, ['b']);
    expect(h[0]).toBeGreaterThanOrEqual(44);
    await ctx.close();
  });
});
