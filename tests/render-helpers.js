// Shared Playwright test-fixture helpers (SL-033). The optimal bundle path
// and the viewport/doctype/addStyleTag boilerplate were duplicated across
// a11y-patterns.spec.js, layout.spec.js, macros.spec.js, states-full.spec.js,
// and typography.spec.js with near-identical setup() functions. The three
// real differences between them (viewport size, whether <body> gets
// style="margin:0", and whether transitions are disabled) are now the
// options renderWithBundle() takes — see each call site for its values.
//
// container-queries.spec.js's setupInContainer() wraps content in a sized
// container div and pins font-size for @container em thresholds; that shape
// is genuinely different from the flat case here, so it keeps its own local
// function, but imports BUNDLE from here instead of redefining it.
//
// layers.spec.js and print.spec.js inline page.setContent per-test (each
// test stages different competing rules in its own <style> block) — only
// their repeated BUNDLE path.join() is shared here.
import path from 'node:path';

export const BUNDLE = path.join(process.cwd(), 'badges', 'slashed.optimal.css');

export const NO_TRANSITIONS_STYLE =
  '*, *::before, *::after { transition: none !important; animation-duration: 0s !important; }';

/**
 * Load the optimal bundle and set page content inside a minimal
 * <!doctype html><html><body> wrapper.
 * @param {import('@playwright/test').Page} page
 * @param {string} html
 * @param {{ width?: number, height?: number, bodyMargin?: string | null, extraStyle?: string, bundle?: string }} [options]
 */
export async function renderWithBundle(page, html, options = {}) {
  const { width = 1200, height = 900, bodyMargin = '0', extraStyle, bundle = BUNDLE } = options;
  await page.setViewportSize({ width, height });
  const bodyAttr = bodyMargin != null ? ` style="margin:${bodyMargin}"` : '';
  await page.setContent(`<!doctype html><html><body${bodyAttr}>${html}</body></html>`);
  await page.addStyleTag({ path: bundle });
  if (extraStyle) {
    await page.addStyleTag({ content: extraStyle });
  }
}
