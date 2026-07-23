// @ts-check
// Full coverage of every .sf-is-* class in core/states.css, plus the two
// visibility helpers (.sf-invisible/.sf-visible, optional/utilities.css)
// that used to live here before docs/states.md's "Prefer native state" pass.
import path from 'node:path';
import { test, expect } from '@playwright/test';
import { renderWithBundle, NO_TRANSITIONS_STYLE } from './render-helpers.js';

// optional/utilities.css isn't in the optimal bundle (see bundle.config.json),
// so the two visibility helpers below need the full bundle — same pattern as
// button.spec.js/card.spec.js's COMPONENTS_BUNDLE.
const FULL_BUNDLE = path.join(process.cwd(), 'dist', 'slashed.full.css');

async function setup(page, html, options = {}) {
  // Disable transitions so computed property reads are stable (no mid-animation values).
  await renderWithBundle(page, html, { width: 800, height: 600, extraStyle: NO_TRANSITIONS_STYLE, ...options });
}

// ── Visibility (optional/utilities.css) ──────────────────────────
// No .sf-is-hidden test: the class was removed (duplicated [hidden]).

test('.sf-invisible: visibility:hidden (stays in flow)', async ({ page }) => {
  await setup(page, `<div id="t" class="sf-invisible">x</div>`, { bundle: FULL_BUNDLE });
  const cs = await page.locator('#t').evaluate(el => ({
    vis: getComputedStyle(el).visibility,
    dis: getComputedStyle(el).display,
  }));
  expect(cs.vis).toBe('hidden');
  expect(cs.dis).not.toBe('none');
});

test('.sf-visible: overrides inherited visibility:hidden', async ({ page }) => {
  await setup(page, `
    <div style="visibility:hidden">
      <div id="t" class="sf-visible">x</div>
    </div>
  `, { bundle: FULL_BUNDLE });
  const vis = await page.locator('#t').evaluate(el => getComputedStyle(el).visibility);
  expect(vis).toBe('visible');
});

// ── Interactivity ───────────────────────────────────────────────
test('.sf-is-disabled: opacity 0.45, pointer-events none, cursor not-allowed', async ({ page, browserName }) => {
  await setup(page, `<button id="t" class="sf-is-disabled">Disabled</button>`);
  const cs = await page.locator('#t').evaluate(el => ({
    opacity: parseFloat(getComputedStyle(el).opacity),
    pe:      getComputedStyle(el).pointerEvents,
    cursor:  getComputedStyle(el).cursor,
    us:      getComputedStyle(el).userSelect ?? getComputedStyle(el).webkitUserSelect,
  }));
  expect(cs.opacity).toBeCloseTo(0.45, 2);
  expect(cs.pe).toBe('none');
  expect(cs.cursor).toBe('not-allowed');
  // WebKit requires -webkit-user-select; the framework only sets user-select (no prefix).
  if (browserName !== 'webkit') expect(cs.us).toBe('none');
});

// No .sf-is-readonly test: the class was removed (duplicated :read-only).

// ── Loading / async ─────────────────────────────────────────────
test('.sf-is-loading: colour transparent, position relative, pointer-events none', async ({ page }) => {
  await setup(page, `<button id="t" class="sf-is-loading">Submit</button>`);
  const cs = await page.locator('#t').evaluate(el => ({
    color: getComputedStyle(el).color,
    pe:    getComputedStyle(el).pointerEvents,
    pos:   getComputedStyle(el).position,
  }));
  expect(cs.color).toBe('rgba(0, 0, 0, 0)');
  expect(cs.pe).toBe('none');
  expect(cs.pos).toBe('relative');
});

// No .sf-is-busy / .sf-is-pending tests: both classes were removed
// (no distinct consumer, trivial to hand-roll — see core/states.css).

test('.sf-is-shimmer: transparent text, shimmer gradient, no pointer-events', async ({ page }) => {
  await setup(page, `<div id="t" class="sf-is-shimmer">Placeholder text</div>`);
  const cs = await page.locator('#t').evaluate(el => ({
    color:   getComputedStyle(el).color,
    bgImage: getComputedStyle(el).backgroundImage,
    pe:      getComputedStyle(el).pointerEvents,
  }));
  expect(cs.color).toBe('rgba(0, 0, 0, 0)');
  expect(cs.bgImage).toContain('linear-gradient');
  expect(cs.pe).toBe('none');
});

// ── Selected / highlighted ────────────────────────────────────────
// No .sf-is-active / .sf-is-current / .sf-is-pressed / .sf-is-open /
// .sf-is-collapsed tests: all five were removed (speculative --sf-is-*
// custom-property flags with zero consumers — see core/states.css).

test('.sf-is-selected: has a non-transparent background', async ({ page }) => {
  await setup(page, `<li id="t" class="sf-is-selected">Selected</li>`);
  const bg = await page.locator('#t').evaluate(el => getComputedStyle(el).backgroundColor);
  expect(bg).not.toBe('rgba(0, 0, 0, 0)');
  expect(bg).not.toBe('transparent');
});

test('.sf-is-highlighted: has a non-transparent background', async ({ page }) => {
  await setup(page, `<div id="t" class="sf-is-highlighted">Highlighted</div>`);
  const bg = await page.locator('#t').evaluate(el => getComputedStyle(el).backgroundColor);
  expect(bg).not.toBe('rgba(0, 0, 0, 0)');
});

// ── Validation ──────────────────────────────────────────────────
// No .sf-is-danger case: removed (identical implementation to
// .sf-is-invalid/.sf-is-error — see core/states.css).
for (const [cls, status] of [
  ['sf-is-valid',   'success'],
  ['sf-is-invalid', 'error'],
  ['sf-is-warning', 'warning'],
  ['sf-is-success', 'success'],
  ['sf-is-error',   'error'],
  ['sf-is-info',    'info'],
]) {
  test(`.${cls}: sets --sf-field-border-color token`, async ({ page }) => {
    await setup(page, `<input id="t" class="${cls}" type="text">`);
    const v = await page.locator('#t').evaluate(el =>
      getComputedStyle(el).getPropertyValue('--sf-field-border-color').trim()
    );
    expect(v).toBeTruthy();
    expect(v).not.toBe('');
  });
}

// ── Drag & drop ─────────────────────────────────────────────────
test('.sf-is-draggable: cursor grab', async ({ page }) => {
  await setup(page, `<div id="t" class="sf-is-draggable">drag me</div>`);
  const cursor = await page.locator('#t').evaluate(el => getComputedStyle(el).cursor);
  expect(cursor).toBe('grab');
});

test('.sf-is-dragging: opacity 0.5, cursor grabbing', async ({ page }) => {
  await setup(page, `<div id="t" class="sf-is-dragging">dragging</div>`);
  const cs = await page.locator('#t').evaluate(el => ({
    opacity: parseFloat(getComputedStyle(el).opacity),
    cursor:  getComputedStyle(el).cursor,
  }));
  expect(cs.opacity).toBeCloseTo(0.5, 1);
  expect(cs.cursor).toBe('grabbing');
});

test('.sf-is-drop-target: dashed outline', async ({ page }) => {
  await setup(page, `<div id="t" class="sf-is-drop-target">drop zone</div>`);
  const style = await page.locator('#t').evaluate(el => getComputedStyle(el).outlineStyle);
  expect(style).toBe('dashed');
});

// ── Overlay ─────────────────────────────────────────────────────
test('.sf-overlay: position absolute, inset 0', async ({ page }) => {
  await setup(page, `
    <div style="position:relative;width:200px;height:200px">
      <div id="t" class="sf-overlay">overlay</div>
    </div>
  `);
  const cs = await page.locator('#t').evaluate(el => ({
    pos:   getComputedStyle(el).position,
    inset: getComputedStyle(el).inset,
  }));
  expect(cs.pos).toBe('absolute');
  expect(cs.inset).toBe('0px');
});

// ── Empty state ─────────────────────────────────────────────────
test('.sf-is-empty:empty — hides itself when no content', async ({ page }) => {
  await setup(page, `<div id="t" class="sf-is-empty"></div>`);
  const display = await page.locator('#t').evaluate(el => getComputedStyle(el).display);
  expect(display).toBe('none');
});

test('.sf-is-empty with children stays visible', async ({ page }) => {
  await setup(page, `<div id="t" class="sf-is-empty"><span>child</span></div>`);
  const display = await page.locator('#t').evaluate(el => getComputedStyle(el).display);
  expect(display).not.toBe('none');
});
