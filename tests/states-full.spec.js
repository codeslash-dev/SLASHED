// @ts-check
// Full coverage of every .is-* class in core/states.css.
import { test, expect } from '@playwright/test';
import path from 'node:path';

const BUNDLE = path.join(process.cwd(), 'dist', 'slashed.essential.css');

async function setup(page, html) {
  await page.setViewportSize({ width: 800, height: 600 });
  await page.setContent(`<!doctype html><html><body style="margin:0">${html}</body></html>`);
  await page.addStyleTag({ path: BUNDLE });
  // Disable transitions so computed property reads are stable (no mid-animation values).
  await page.addStyleTag({ content: '*, *::before, *::after { transition: none !important; animation-duration: 0s !important; }' });
}

// ── Visibility ──────────────────────────────────────────────────
test('.is-hidden: display:none (important)', async ({ page }) => {
  await setup(page, `<div id="t" class="is-hidden">x</div>`);
  const d = await page.locator('#t').evaluate(el => getComputedStyle(el).display);
  expect(d).toBe('none');
});

test('.is-invisible: visibility:hidden (stays in flow)', async ({ page }) => {
  await setup(page, `<div id="t" class="is-invisible">x</div>`);
  const cs = await page.locator('#t').evaluate(el => ({
    vis: getComputedStyle(el).visibility,
    dis: getComputedStyle(el).display,
  }));
  expect(cs.vis).toBe('hidden');
  expect(cs.dis).not.toBe('none');
});

test('.is-visible: overrides inherited visibility:hidden', async ({ page }) => {
  await setup(page, `
    <div style="visibility:hidden">
      <div id="t" class="is-visible">x</div>
    </div>
  `);
  const vis = await page.locator('#t').evaluate(el => getComputedStyle(el).visibility);
  expect(vis).toBe('visible');
});

// ── Interactivity ───────────────────────────────────────────────
test('.is-disabled: opacity 0.45, pointer-events none, cursor not-allowed', async ({ page, browserName }) => {
  await setup(page, `<button id="t" class="is-disabled">Disabled</button>`);
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

test('.is-readonly: pointer-events none, user-select none', async ({ page, browserName }) => {
  await setup(page, `<div id="t" class="is-readonly">Read only</div>`);
  const cs = await page.locator('#t').evaluate(el => ({
    pe: getComputedStyle(el).pointerEvents,
    us: getComputedStyle(el).userSelect ?? getComputedStyle(el).webkitUserSelect,
  }));
  expect(cs.pe).toBe('none');
  // WebKit requires -webkit-user-select; the framework only sets user-select (no prefix).
  if (browserName !== 'webkit') expect(cs.us).toBe('none');
});

// ── Loading / async ─────────────────────────────────────────────
test('.is-loading: colour transparent, position relative, pointer-events none', async ({ page }) => {
  await setup(page, `<button id="t" class="is-loading">Submit</button>`);
  const cs = await page.locator('#t').evaluate(el => ({
    color: getComputedStyle(el).color,
    pe:    getComputedStyle(el).pointerEvents,
    pos:   getComputedStyle(el).position,
  }));
  expect(cs.color).toBe('rgba(0, 0, 0, 0)');
  expect(cs.pe).toBe('none');
  expect(cs.pos).toBe('relative');
});

test('.is-busy: cursor progress', async ({ page }) => {
  await setup(page, `<div id="t" class="is-busy">Loading…</div>`);
  const cursor = await page.locator('#t').evaluate(el => getComputedStyle(el).cursor);
  expect(cursor).toBe('progress');
});

test('.is-pending: opacity < 1, cursor progress', async ({ page }) => {
  await setup(page, `<button id="t" class="is-pending">Save</button>`);
  const cs = await page.locator('#t').evaluate(el => ({
    opacity: parseFloat(getComputedStyle(el).opacity),
    cursor:  getComputedStyle(el).cursor,
  }));
  expect(cs.opacity).toBeLessThan(1);
  expect(cs.cursor).toBe('progress');
});

test('.is-skeleton: transparent text, shimmer gradient, no pointer-events', async ({ page }) => {
  await setup(page, `<div id="t" class="is-skeleton">Placeholder text</div>`);
  const cs = await page.locator('#t').evaluate(el => ({
    color:   getComputedStyle(el).color,
    bgImage: getComputedStyle(el).backgroundImage,
    pe:      getComputedStyle(el).pointerEvents,
  }));
  expect(cs.color).toBe('rgba(0, 0, 0, 0)');
  expect(cs.bgImage).toContain('linear-gradient');
  expect(cs.pe).toBe('none');
});

// ── Active / selected ───────────────────────────────────────────
test('.is-active: sets --sf-is-active CSS variable to 1', async ({ page }) => {
  await setup(page, `<div id="t" class="is-active">Active</div>`);
  const v = await page.locator('#t').evaluate(el =>
    getComputedStyle(el).getPropertyValue('--sf-is-active').trim()
  );
  expect(v).toBe('1');
});

test('.is-selected: has a non-transparent background', async ({ page }) => {
  await setup(page, `<li id="t" class="is-selected">Selected</li>`);
  const bg = await page.locator('#t').evaluate(el => getComputedStyle(el).backgroundColor);
  expect(bg).not.toBe('rgba(0, 0, 0, 0)');
  expect(bg).not.toBe('transparent');
});

test('.is-current: bold font-weight (≥ 700)', async ({ page }) => {
  await setup(page, `<a id="t" href="#" class="is-current">Current</a>`);
  const fw = await page.locator('#t').evaluate(el =>
    parseInt(getComputedStyle(el).fontWeight, 10)
  );
  expect(fw).toBeGreaterThanOrEqual(700);
});

test('.is-highlighted: has a non-transparent background', async ({ page }) => {
  await setup(page, `<div id="t" class="is-highlighted">Highlighted</div>`);
  const bg = await page.locator('#t').evaluate(el => getComputedStyle(el).backgroundColor);
  expect(bg).not.toBe('rgba(0, 0, 0, 0)');
});

test('.is-pressed: sets --sf-is-pressed to 1 and non-transparent background', async ({ page }) => {
  await setup(page, `<button id="t" class="is-pressed">Toggle</button>`);
  const cs = await page.locator('#t').evaluate(el => ({
    flag: getComputedStyle(el).getPropertyValue('--sf-is-pressed').trim(),
    bg:   getComputedStyle(el).backgroundColor,
  }));
  expect(cs.flag).toBe('1');
  expect(cs.bg).not.toBe('rgba(0, 0, 0, 0)');
});

// ── Open / collapsed ────────────────────────────────────────────
test('.is-open: sets --sf-is-open to 1', async ({ page }) => {
  await setup(page, `<div id="t" class="is-open">open</div>`);
  const v = await page.locator('#t').evaluate(el =>
    getComputedStyle(el).getPropertyValue('--sf-is-open').trim()
  );
  expect(v).toBe('1');
});

test('.is-collapsed: sets --sf-is-open to 0', async ({ page }) => {
  await setup(page, `<div id="t" class="is-collapsed">closed</div>`);
  const v = await page.locator('#t').evaluate(el =>
    getComputedStyle(el).getPropertyValue('--sf-is-open').trim()
  );
  expect(v).toBe('0');
});

// ── Validation ──────────────────────────────────────────────────
for (const [cls, status] of [
  ['is-valid',   'success'],
  ['is-invalid', 'error'],
  ['is-warning', 'warning'],
  ['is-success', 'success'],
  ['is-error',   'error'],
  ['is-info',    'info'],
  ['is-danger',  'danger'],
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

// ── Position / stickiness ───────────────────────────────────────
test('.is-sticky: position sticky with positive z-index', async ({ page }) => {
  await setup(page, `<div id="t" class="is-sticky">sticky</div>`);
  const cs = await page.locator('#t').evaluate(el => ({
    pos: getComputedStyle(el).position,
    z:   parseInt(getComputedStyle(el).zIndex, 10),
  }));
  expect(cs.pos).toBe('sticky');
  expect(cs.z).toBeGreaterThan(0);
});

test('.is-pinned: position sticky, top 0', async ({ page }) => {
  await setup(page, `<div id="t" class="is-pinned">pinned</div>`);
  const cs = await page.locator('#t').evaluate(el => ({
    pos: getComputedStyle(el).position,
    top: getComputedStyle(el).top,
  }));
  expect(cs.pos).toBe('sticky');
  expect(cs.top).toBe('0px');
});

test('.is-fixed: position fixed', async ({ page }) => {
  await setup(page, `<div id="t" class="is-fixed">fixed</div>`);
  const pos = await page.locator('#t').evaluate(el => getComputedStyle(el).position);
  expect(pos).toBe('fixed');
});

test('.is-fullscreen: position fixed, inset 0, high z-index', async ({ page }) => {
  await setup(page, `<div id="t" class="is-fullscreen">fullscreen</div>`);
  const cs = await page.locator('#t').evaluate(el => ({
    pos:   getComputedStyle(el).position,
    inset: getComputedStyle(el).inset,
    z:     parseInt(getComputedStyle(el).zIndex, 10),
  }));
  expect(cs.pos).toBe('fixed');
  expect(cs.inset).toBe('0px');
  expect(cs.z).toBeGreaterThan(0);
});

// ── Overflow ────────────────────────────────────────────────────
test('.is-clipped: overflow hidden (important)', async ({ page }) => {
  await setup(page, `<div id="t" class="is-clipped">x</div>`);
  const overflow = await page.locator('#t').evaluate(el => getComputedStyle(el).overflow);
  expect(overflow).toBe('hidden');
});

test('.is-scrollable: overflow auto, overscroll-behavior contain', async ({ page }) => {
  await setup(page, `<div id="t" class="is-scrollable" style="height:100px">x</div>`);
  const cs = await page.locator('#t').evaluate(el => ({
    overflow:    getComputedStyle(el).overflow,
    overscroll:  getComputedStyle(el).overscrollBehavior,
  }));
  expect(cs.overflow).toBe('auto');
  expect(cs.overscroll).toBe('contain');
});

test('.is-truncated: text-overflow ellipsis, white-space nowrap', async ({ page }) => {
  await setup(page, `<div id="t" class="is-truncated" style="width:2rem">long text here</div>`);
  const cs = await page.locator('#t').evaluate(el => ({
    to:       getComputedStyle(el).textOverflow,
    ws:       getComputedStyle(el).whiteSpace,
    overflow: getComputedStyle(el).overflow,
  }));
  expect(cs.to).toBe('ellipsis');
  expect(cs.ws).toBe('nowrap');
  expect(cs.overflow).toBe('hidden');
});

test('.is-resizable: resize both, overflow auto', async ({ page }) => {
  await setup(page, `<div id="t" class="is-resizable" style="width:200px;height:100px">x</div>`);
  const cs = await page.locator('#t').evaluate(el => ({
    resize:   getComputedStyle(el).resize,
    overflow: getComputedStyle(el).overflow,
  }));
  expect(cs.resize).toBe('both');
  expect(cs.overflow).toBe('auto');
});

// ── Drag & drop ─────────────────────────────────────────────────
test('.is-draggable: cursor grab', async ({ page }) => {
  await setup(page, `<div id="t" class="is-draggable">drag me</div>`);
  const cursor = await page.locator('#t').evaluate(el => getComputedStyle(el).cursor);
  expect(cursor).toBe('grab');
});

test('.is-dragging: opacity 0.5, cursor grabbing', async ({ page }) => {
  await setup(page, `<div id="t" class="is-dragging">dragging</div>`);
  const cs = await page.locator('#t').evaluate(el => ({
    opacity: parseFloat(getComputedStyle(el).opacity),
    cursor:  getComputedStyle(el).cursor,
  }));
  expect(cs.opacity).toBeCloseTo(0.5, 1);
  expect(cs.cursor).toBe('grabbing');
});

test('.is-drop-target: dashed outline', async ({ page }) => {
  await setup(page, `<div id="t" class="is-drop-target">drop zone</div>`);
  const style = await page.locator('#t').evaluate(el => getComputedStyle(el).outlineStyle);
  expect(style).toBe('dashed');
});

// ── Interaction ─────────────────────────────────────────────────
test('.is-clickable: cursor pointer', async ({ page }) => {
  await setup(page, `<div id="t" class="is-clickable">click me</div>`);
  const cursor = await page.locator('#t').evaluate(el => getComputedStyle(el).cursor);
  expect(cursor).toBe('pointer');
});

test('.is-unselectable: user-select none', async ({ page, browserName }) => {
  await setup(page, `<div id="t" class="is-unselectable">unselectable</div>`);
  const us = await page.locator('#t').evaluate(el =>
    getComputedStyle(el).userSelect ?? getComputedStyle(el).webkitUserSelect
  );
  // WebKit requires -webkit-user-select; the framework only sets user-select (no prefix).
  if (browserName !== 'webkit') expect(us).toBe('none');
});

test('.is-focused: shows outline ring (programmatic focus)', async ({ page }) => {
  await setup(page, `<div id="t" class="is-focused" tabindex="0">focused</div>`);
  const style = await page.locator('#t').evaluate(el => getComputedStyle(el).outlineStyle);
  expect(style).not.toBe('none');
});

// ── Overlay ─────────────────────────────────────────────────────
test('.is-overlay: position absolute, inset 0', async ({ page }) => {
  await setup(page, `
    <div style="position:relative;width:200px;height:200px">
      <div id="t" class="is-overlay">overlay</div>
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
test('.is-empty:empty — hides itself when no content', async ({ page }) => {
  await setup(page, `<div id="t" class="is-empty"></div>`);
  const display = await page.locator('#t').evaluate(el => getComputedStyle(el).display);
  expect(display).toBe('none');
});

test('.is-empty with children stays visible', async ({ page }) => {
  await setup(page, `<div id="t" class="is-empty"><span>child</span></div>`);
  const display = await page.locator('#t').evaluate(el => getComputedStyle(el).display);
  expect(display).not.toBe('none');
});
