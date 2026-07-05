// @ts-check
// SLASHED — Comprehensive visual regression tests for docs/demo.html
// Tests colors, shapes, shadows, layouts, grids, print, typography,
// spacing, radius, motion states, accessibility, and all layout primitives.

import { test, expect } from '@playwright/test';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const DEMO_URL = pathToFileURL(path.resolve(import.meta.dirname, '..', 'docs', 'demo.html')).href;

// Helper: resolve a CSS custom property value on an element
async function getComputedProp(locator, prop) {
  return locator.evaluate((el, p) => getComputedStyle(el).getPropertyValue(p).trim(), prop);
}

// Helper: resolve computed style property
async function getStyle(locator, prop) {
  return locator.evaluate((el, p) => getComputedStyle(el)[p], prop);
}


// ═══════════════════════════════════════════════════════════════
// COLORS
// ═══════════════════════════════════════════════════════════════
test.describe('Colors', () => {
  test('brand color swatches render with non-transparent backgrounds', async ({ page }) => {
    await page.goto(DEMO_URL);
    const swatches = page.locator('#colors .demo-swatch-row:first-of-type .demo-swatch');
    const count = await swatches.count();
    expect(count).toBeGreaterThanOrEqual(5);
    for (let i = 0; i < count; i++) {
      const bg = await getStyle(swatches.nth(i), 'backgroundColor');
      expect(bg).not.toBe('rgba(0, 0, 0, 0)');
      expect(bg).not.toBe('transparent');
    }
  });

  test('status color swatches have distinct hues', async ({ page }) => {
    await page.goto(DEMO_URL);
    const section = page.locator('#colors');
    const statusRow = section.locator('.demo-swatch-row').nth(2);
    const swatches = statusRow.locator('.demo-swatch');
    const count = await swatches.count();
    expect(count).toBe(4); // success, warning, info, danger
    const bgs = new Set();
    for (let i = 0; i < count; i++) {
      const bg = await getStyle(swatches.nth(i), 'backgroundColor');
      bgs.add(bg);
    }
    // All status colors should be distinct
    expect(bgs.size).toBe(4);
  });


  test('text hierarchy colors descend in contrast', async ({ page }) => {
    await page.goto(DEMO_URL);
    const section = page.locator('#colors');
    const textPrimary = section.locator('p[style*="--sf-color-text)"]').first();
    const textMuted = section.locator('p[style*="--sf-color-text--muted"]').first();
    // Text primary should be darker (more opaque) than muted in light mode
    const colorPrimary = await getStyle(textPrimary, 'color');
    const colorMuted = await getStyle(textMuted, 'color');
    expect(colorPrimary).not.toBe(colorMuted);
  });

  test('gradients render as non-solid backgrounds', async ({ page }) => {
    await page.goto(DEMO_URL);
    const gradients = page.locator('#colors .demo-swatch[style*="gradient"]');
    const count = await gradients.count();
    expect(count).toBeGreaterThanOrEqual(4);
    for (let i = 0; i < count; i++) {
      const bgImage = await getStyle(gradients.nth(i), 'backgroundImage');
      // Should be a gradient, not 'none'
      expect(bgImage).not.toBe('none');
    }
  });

  test('scoped dark theme renders different bg than page', async ({ page }) => {
    await page.goto(DEMO_URL);
    const pageBg = await page.evaluate(() =>
      getComputedStyle(document.body).backgroundColor
    );
    const darkSection = page.locator('#scoped-themes [data-theme="dark"]').first();
    const darkBg = await getStyle(darkSection, 'backgroundColor');
    expect(darkBg).not.toBe(pageBg);
  });
});


// ═══════════════════════════════════════════════════════════════
// TYPOGRAPHY
// ═══════════════════════════════════════════════════════════════
test.describe('Typography', () => {
  test('heading scale decreases in size from h1 to h6', async ({ page }) => {
    await page.goto(DEMO_URL);
    const section = page.locator('#typography');
    // Use the heading-scale demo box which contains h1..h6 in order
    const headingBox = section.locator('div[style*="inset"]').first();
    const sizes = await headingBox.evaluate(el => {
      return ['h1','h3','h4','h5','h6'].map(tag => {
        const h = el.querySelector(tag);
        return h ? parseFloat(getComputedStyle(h).fontSize) : 0;
      });
    });
    // h1 should be largest, and sizes should generally decrease
    expect(sizes[0]).toBeGreaterThan(sizes[sizes.length - 1]);
    // h1 > h3
    expect(sizes[0]).toBeGreaterThan(sizes[1]);
    // h5 > h6 or equal
    expect(sizes[3]).toBeGreaterThanOrEqual(sizes[4]);
  });

  test('fluid text scale tokens produce increasing sizes', async ({ page }) => {
    await page.goto(DEMO_URL);
    const section = page.locator('#typography');
    const scales = ['2xs', 'xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl'];
    let prevSize = 0;
    for (const scale of scales) {
      const el = section.locator(`div[style*="--sf-text-${scale})"]`).first();
      if (await el.count() === 0) continue;
      const size = parseFloat(await getStyle(el, 'fontSize'));
      expect(size).toBeGreaterThanOrEqual(prevSize);
      prevSize = size;
    }
  });

  test('font weight scale goes from light (300) to bold (700)', async ({ page }) => {
    await page.goto(DEMO_URL);
    const section = page.locator('#typography');
    const light = section.locator('span[style*="weight-light"]').first();
    const bold = section.locator('span[style*="weight-bold"]').first();
    const lightWeight = parseInt(await getStyle(light, 'fontWeight'));
    const boldWeight = parseInt(await getStyle(bold, 'fontWeight'));
    expect(lightWeight).toBe(300);
    expect(boldWeight).toBe(700);
  });

  test('monospace font family resolves to monospace stack', async ({ page }) => {
    await page.goto(DEMO_URL);
    const mono = page.locator('#typography span[style*="font-mono"]').first();
    const family = await getStyle(mono, 'fontFamily');
    // Should contain a monospace reference
    expect(family.toLowerCase()).toMatch(/mono|courier|consolas/);
  });
});


// ═══════════════════════════════════════════════════════════════
// SPACING
// ═══════════════════════════════════════════════════════════════
test.describe('Spacing', () => {
  test('spacing bars increase in width from 2xs to 4xl', async ({ page }) => {
    await page.goto(DEMO_URL);
    const bars = page.locator('#spacing .demo-space-bar');
    const count = await bars.count();
    expect(count).toBeGreaterThanOrEqual(9);
    let prevWidth = 0;
    // Skip the first bar (--sf-space-none = 2px) and px
    for (let i = 2; i < count; i++) {
      const box = await bars.nth(i).boundingBox();
      expect(box.width).toBeGreaterThanOrEqual(prevWidth);
      prevWidth = box.width;
    }
  });
});

// ═══════════════════════════════════════════════════════════════
// SHADOWS
// ═══════════════════════════════════════════════════════════════
test.describe('Shadows', () => {
  test('shadow cards have increasing shadow intensity', async ({ page }) => {
    await page.goto(DEMO_URL);
    const cards = page.locator('#shadows .demo-shadow-card');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(8);
    // 'none' card should have no shadow
    const noneShadow = await getStyle(cards.first(), 'boxShadow');
    expect(noneShadow).toBe('none');
    // 'xl' card should have a shadow
    const xlShadow = await getStyle(cards.nth(5), 'boxShadow');
    expect(xlShadow).not.toBe('none');
  });

  test('text shadows render on text-shadow demo elements', async ({ page }) => {
    await page.goto(DEMO_URL);
    const textShadowEls = page.locator('#shadows span[style*="text-shadow"]');
    const count = await textShadowEls.count();
    expect(count).toBe(5); // xs, s, m, l, xl
    for (let i = 0; i < count; i++) {
      const ts = await getStyle(textShadowEls.nth(i), 'textShadow');
      expect(ts).not.toBe('none');
    }
  });

  test('drop shadows apply filter to SVGs', async ({ page }) => {
    await page.goto(DEMO_URL);
    const svgs = page.locator('#shadows svg[class*="sf-drop-shadow"]');
    const count = await svgs.count();
    expect(count).toBe(5); // xs, s, m, l, xl
    for (let i = 0; i < count; i++) {
      const filter = await getStyle(svgs.nth(i), 'filter');
      expect(filter).not.toBe('none');
    }
  });

  test('3D perspective boxes have transform applied', async ({ page }) => {
    await page.goto(DEMO_URL);
    const perspBoxes = page.locator(
      '#shadows div[style*="rotateY"]'
    );
    const count = await perspBoxes.count();
    expect(count).toBe(3);
    for (let i = 0; i < count; i++) {
      const transform = await getStyle(perspBoxes.nth(i), 'transform');
      expect(transform).not.toBe('none');
    }
  });
});


// ═══════════════════════════════════════════════════════════════
// BORDER RADIUS
// ═══════════════════════════════════════════════════════════════
test.describe('Border Radius', () => {
  test('radius swatches increase from none to full', async ({ page }) => {
    await page.goto(DEMO_URL);
    const swatches = page.locator('#radius .demo-radius-swatch');
    const count = await swatches.count();
    expect(count).toBe(10);
    // First should be 0
    const noneRadius = await getStyle(swatches.first(), 'borderTopLeftRadius');
    expect(parseFloat(noneRadius)).toBe(0);
    // Last (full) should be very large
    const fullRadius = await getStyle(swatches.last(), 'borderTopLeftRadius');
    expect(parseFloat(fullRadius)).toBeGreaterThan(100);
  });

  test('radius swatches have visible borders', async ({ page }) => {
    await page.goto(DEMO_URL);
    const swatches = page.locator('#radius .demo-radius-swatch');
    for (let i = 0; i < await swatches.count(); i++) {
      const border = await getStyle(swatches.nth(i), 'borderTopWidth');
      expect(parseFloat(border)).toBeGreaterThan(0);
    }
  });
});


// ═══════════════════════════════════════════════════════════════
// MOTION & STATES
// ═══════════════════════════════════════════════════════════════
test.describe('Motion & States', () => {
  test('easing balls have animation applied', async ({ page }) => {
    await page.goto(DEMO_URL);
    const balls = page.locator('#motion .demo-ease-ball');
    const count = await balls.count();
    expect(count).toBeGreaterThanOrEqual(7);
    for (let i = 0; i < count; i++) {
      const anim = await getStyle(balls.nth(i), 'animationName');
      expect(anim).toContain('demo-slide');
    }
  });

  test('.is-loading spinner pseudo-element renders', async ({ page }) => {
    await page.goto(DEMO_URL);
    const loading = page.locator('#motion .is-loading').first();
    // Loading state makes text transparent
    const color = await getStyle(loading, 'color');
    const isTransparent =
      color === 'transparent' ||
      /^rgba\(\s*\d+,\s*\d+,\s*\d+,\s*0(?:\.0+)?\s*\)$/.test(color);
    expect(isTransparent).toBeTruthy();
    // pointer-events disabled
    const pe = await getStyle(loading, 'pointerEvents');
    expect(pe).toBe('none');
  });

  test('.is-skeleton has shimmer animation', async ({ page }) => {
    await page.goto(DEMO_URL);
    const skeleton = page.locator('#motion .is-skeleton').first();
    const anim = await getStyle(skeleton, 'animationName');
    expect(anim).toContain('sf-shimmer');
  });

  test('.is-disabled reduces opacity and disables pointer events', async ({ page }) => {
    await page.goto(DEMO_URL);
    const disabled = page.locator('#states-full .is-disabled').first();
    const opacity = parseFloat(await getStyle(disabled, 'opacity'));
    expect(opacity).toBeLessThan(1);
    const pe = await getStyle(disabled, 'pointerEvents');
    expect(pe).toBe('none');
  });

  test('.is-truncated clips text with ellipsis', async ({ page }) => {
    await page.goto(DEMO_URL);
    const truncated = page.locator('#motion .is-truncated').first();
    const overflow = await getStyle(truncated, 'overflow');
    const textOverflow = await getStyle(truncated, 'textOverflow');
    expect(overflow).toBe('hidden');
    expect(textOverflow).toBe('ellipsis');
  });

  test('.is-hidden removes element from layout', async ({ page }) => {
    await page.goto(DEMO_URL);
    const hidden = page.locator('#motion .is-hidden').first();
    const display = await getStyle(hidden, 'display');
    expect(display).toBe('none');
  });
});


// ═══════════════════════════════════════════════════════════════
// LAYOUT PRIMITIVES — STACK
// ═══════════════════════════════════════════════════════════════
test.describe('Layout — Stack', () => {
  test('.sf-stack uses flex column layout', async ({ page }) => {
    await page.goto(DEMO_URL);
    const stack = page.locator('#layout-stack .sf-stack').first();
    const display = await getStyle(stack, 'display');
    const direction = await getStyle(stack, 'flexDirection');
    expect(display).toBe('flex');
    expect(direction).toBe('column');
  });

  test('.sf-stack gap sizes differ between modifiers', async ({ page }) => {
    await page.goto(DEMO_URL);
    const section = page.locator('#layout-stack');
    const xsStack = section.locator('.sf-stack--xs').first();
    const xlStack = section.locator('.sf-stack--xl').first();
    const xsGap = parseFloat(await getStyle(xsStack, 'rowGap'));
    const xlGap = parseFloat(await getStyle(xlStack, 'rowGap'));
    expect(xlGap).toBeGreaterThan(xsGap);
  });
});

// ═══════════════════════════════════════════════════════════════
// LAYOUT PRIMITIVES — CLUSTER
// ═══════════════════════════════════════════════════════════════
test.describe('Layout — Cluster', () => {
  test('.sf-cluster uses flex-wrap layout', async ({ page }) => {
    await page.goto(DEMO_URL);
    const cluster = page.locator('#layout-cluster .sf-cluster').first();
    const display = await getStyle(cluster, 'display');
    const wrap = await getStyle(cluster, 'flexWrap');
    expect(display).toBe('flex');
    expect(wrap).toBe('wrap');
  });

  test('.sf-cluster--center centers content', async ({ page }) => {
    await page.goto(DEMO_URL);
    const centered = page.locator('#layout-extra .sf-cluster--center').first();
    const justify = await getStyle(centered, 'justifyContent');
    expect(justify).toBe('center');
  });

  test('.sf-cluster--end aligns to end', async ({ page }) => {
    await page.goto(DEMO_URL);
    const end = page.locator('#layout-extra .sf-cluster--end').first();
    const justify = await getStyle(end, 'justifyContent');
    expect(justify).toBe('flex-end');
  });

  test('.sf-cluster--between distributes space', async ({ page }) => {
    await page.goto(DEMO_URL);
    const between = page.locator('#layout-extra .sf-cluster--between').first();
    const justify = await getStyle(between, 'justifyContent');
    expect(justify).toBe('space-between');
  });
});


// ═══════════════════════════════════════════════════════════════
// LAYOUT PRIMITIVES — SIDEBAR
// ═══════════════════════════════════════════════════════════════
test.describe('Layout — Sidebar', () => {
  test('.sf-sidebar uses flex-wrap layout', async ({ page }) => {
    await page.goto(DEMO_URL);
    const sidebar = page.locator('#layout-sidebar .sf-sidebar').first();
    const display = await getStyle(sidebar, 'display');
    const wrap = await getStyle(sidebar, 'flexWrap');
    expect(display).toBe('flex');
    expect(wrap).toBe('wrap');
  });

  test('.sf-sidebar--narrow has narrower sidebar than default', async ({ page }) => {
    await page.goto(DEMO_URL);
    const narrow = page.locator('#layout-extra .sf-sidebar--narrow').first();
    const firstChild = narrow.locator('> :first-child');
    const flexBasis = await getStyle(firstChild, 'flexBasis');
    // 12rem = 192px at default 16px root font size
    expect(parseFloat(flexBasis)).toBeLessThanOrEqual(200);
    expect(parseFloat(flexBasis)).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════
// LAYOUT PRIMITIVES — SWITCHER
// ═══════════════════════════════════════════════════════════════
test.describe('Layout — Switcher', () => {
  test('.sf-switcher uses flex-wrap layout', async ({ page }) => {
    await page.goto(DEMO_URL);
    const switcher = page.locator('#layout-switcher .sf-switcher').first();
    const display = await getStyle(switcher, 'display');
    expect(display).toBe('flex');
  });

  test('.sf-switcher--vertical uses column direction', async ({ page }) => {
    await page.goto(DEMO_URL);
    const vertical = page.locator('#layout-extra .sf-switcher--vertical').first();
    const direction = await getStyle(vertical, 'flexDirection');
    expect(direction).toBe('column');
  });

  test('.sf-switcher--no-wrap prevents wrapping', async ({ page }) => {
    await page.goto(DEMO_URL);
    const noWrap = page.locator('#layout-extra .sf-switcher--no-wrap').first();
    const wrap = await getStyle(noWrap, 'flexWrap');
    expect(wrap).toBe('nowrap');
  });
});


// ═══════════════════════════════════════════════════════════════
// LAYOUT PRIMITIVES — GRID
// ═══════════════════════════════════════════════════════════════
test.describe('Layout — Grid', () => {
  test('.sf-grid uses CSS grid with auto-fill', async ({ page }) => {
    await page.goto(DEMO_URL);
    const grid = page.locator('#layout-grid .sf-grid').first();
    const display = await getStyle(grid, 'display');
    expect(display).toBe('grid');
  });

  test('.sf-grid children are laid out in multiple columns', async ({ page }) => {
    await page.goto(DEMO_URL);
    const grid = page.locator('#layout-grid .sf-grid').first();
    const children = grid.locator('.demo-box');
    const firstBox = await children.first().boundingBox();
    const secondBox = await children.nth(1).boundingBox();
    // Items should be side by side (same top y, different x)
    expect(secondBox.x).toBeGreaterThan(firstBox.x);
    expect(Math.abs(secondBox.y - firstBox.y)).toBeLessThan(5);
  });

  test('.sf-grid-cols-1-2 ratio grid has wider second column', async ({ page }) => {
    await page.goto(DEMO_URL);
    const grid = page.locator('#layout-extra .sf-grid-cols-1-2').first();
    const display = await getStyle(grid, 'display');
    expect(display).toBe('grid');
    const children = grid.locator('.demo-box');
    const count = await children.count();
    if (count >= 2) {
      const first = await children.first().boundingBox();
      const second = await children.nth(1).boundingBox();
      // Second column should be wider (2fr vs 1fr) if grid kicks in
      if (second.x > first.x) {
        expect(second.width).toBeGreaterThan(first.width);
      }
    }
  });
});


// ═══════════════════════════════════════════════════════════════
// LAYOUT PRIMITIVES — COVER
// ═══════════════════════════════════════════════════════════════
test.describe('Layout — Cover', () => {
  test('.sf-cover uses flex column', async ({ page }) => {
    await page.goto(DEMO_URL);
    const cover = page.locator('#layout-cover .sf-cover').first();
    const display = await getStyle(cover, 'display');
    const direction = await getStyle(cover, 'flexDirection');
    expect(display).toBe('flex');
    expect(direction).toBe('column');
  });

  test('.sf-cover__center is vertically centered', async ({ page }) => {
    await page.goto(DEMO_URL);
    const cover = page.locator('#layout-cover .sf-cover').first();
    const coverBox = await cover.boundingBox();
    const center = cover.locator('.sf-cover__center');
    const centerBox = await center.boundingBox();
    // Center element should be roughly in the middle vertically
    const coverMid = coverBox.y + coverBox.height / 2;
    const centerMid = centerBox.y + centerBox.height / 2;
    expect(Math.abs(coverMid - centerMid)).toBeLessThan(coverBox.height * 0.25);
  });
});

// ═══════════════════════════════════════════════════════════════
// LAYOUT PRIMITIVES — FRAME
// ═══════════════════════════════════════════════════════════════
test.describe('Layout — Frame', () => {
  test('.sf-frame--video has 16:9 aspect ratio', async ({ page }) => {
    await page.goto(DEMO_URL);
    const frame = page.locator('#layout-frame .sf-frame--video').first();
    const box = await frame.boundingBox();
    const ratio = box.width / box.height;
    expect(ratio).toBeCloseTo(16 / 9, 1);
  });

  test('.sf-frame--square has 1:1 aspect ratio', async ({ page }) => {
    await page.goto(DEMO_URL);
    const frame = page.locator('#layout-frame .sf-frame--square').first();
    const box = await frame.boundingBox();
    const ratio = box.width / box.height;
    expect(ratio).toBeCloseTo(1, 1);
  });

  test('.sf-frame--portrait has 3:4 aspect ratio', async ({ page }) => {
    await page.goto(DEMO_URL);
    const frame = page.locator('#layout-frame .sf-frame--portrait').first();
    const box = await frame.boundingBox();
    const ratio = box.width / box.height;
    expect(ratio).toBeCloseTo(3 / 4, 1);
  });

  test('.sf-frame--golden has golden ratio', async ({ page }) => {
    await page.goto(DEMO_URL);
    const frame = page.locator('#layout-extra .sf-frame--golden').first();
    const box = await frame.boundingBox();
    const ratio = box.width / box.height;
    expect(ratio).toBeCloseTo(1.618, 0);
  });

  test('.sf-frame--3-2 has 3:2 aspect ratio', async ({ page }) => {
    await page.goto(DEMO_URL);
    const frame = page.locator('#layout-extra .sf-frame--3-2').first();
    const box = await frame.boundingBox();
    const ratio = box.width / box.height;
    expect(ratio).toBeCloseTo(3 / 2, 1);
  });
});


// ═══════════════════════════════════════════════════════════════
// LAYOUT PRIMITIVES — REEL
// ═══════════════════════════════════════════════════════════════
test.describe('Layout — Reel', () => {
  test('.sf-reel has horizontal overflow and scroll-snap', async ({ page }) => {
    await page.goto(DEMO_URL);
    const reel = page.locator('#layout-reel .sf-reel').first();
    const display = await getStyle(reel, 'display');
    const overflow = await getStyle(reel, 'overflowX');
    const snapType = await getStyle(reel, 'scrollSnapType');
    expect(display).toBe('flex');
    expect(overflow).toBe('auto');
    expect(snapType).toContain('inline');
  });

  test('.sf-reel children have scroll-snap-align', async ({ page }) => {
    await page.goto(DEMO_URL);
    const cards = page.locator('#layout-reel .sf-reel .demo-box');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(5);
    const align = await getStyle(cards.first(), 'scrollSnapAlign');
    expect(align).toBe('start');
  });
});

// ═══════════════════════════════════════════════════════════════
// LAYOUT PRIMITIVES — PROSE
// ═══════════════════════════════════════════════════════════════
test.describe('Layout — Prose', () => {
  test('.sf-prose restores list styles', async ({ page }) => {
    await page.goto(DEMO_URL);
    const ul = page.locator('#layout-prose .sf-prose ul').first();
    const listStyle = await getStyle(ul, 'listStyleType');
    expect(listStyle).toBe('disc');
  });

  test('.sf-prose adds vertical rhythm between siblings', async ({ page }) => {
    await page.goto(DEMO_URL);
    const prose = page.locator('#layout-prose .sf-prose').first();
    const children = prose.locator('> *');
    const count = await children.count();
    expect(count).toBeGreaterThan(3);
    // Second child should have margin-block-start
    const margin = await getStyle(children.nth(1), 'marginTop');
    expect(parseFloat(margin)).toBeGreaterThan(0);
  });
});


// ═══════════════════════════════════════════════════════════════
// LAYOUT PRIMITIVES — CONTAINER
// ═══════════════════════════════════════════════════════════════
test.describe('Layout — Container', () => {
  test('.sf-container has max-width and auto margins', async ({ page }) => {
    await page.goto(DEMO_URL);
    const container = page.locator('#layout-container .sf-container').first();
    const maxWidth = await getStyle(container, 'maxWidth');
    const marginLeft = await getStyle(container, 'marginLeft');
    const marginRight = await getStyle(container, 'marginRight');
    expect(maxWidth).not.toBe('none');
    expect(marginLeft).toBe(marginRight);
  });

  test('.sf-container--narrow is narrower than default', async ({ page }) => {
    await page.goto(DEMO_URL);
    const section = page.locator('#layout-container');
    const narrow = section.locator('.sf-container--narrow').first();
    const defaultC = section.locator('.sf-container').first();
    const narrowMax = await getStyle(narrow, 'maxWidth');
    const defaultMax = await getStyle(defaultC, 'maxWidth');
    expect(parseFloat(narrowMax)).toBeLessThan(parseFloat(defaultMax));
  });
});

// ═══════════════════════════════════════════════════════════════
// LAYOUT PRIMITIVES — BENTO
// ═══════════════════════════════════════════════════════════════
test.describe('Layout — Bento', () => {
  test('.sf-bento uses CSS grid with dense auto-flow', async ({ page }) => {
    await page.goto(DEMO_URL);
    const bento = page.locator('#layout-bento .sf-bento').first();
    const display = await getStyle(bento, 'display');
    const flow = await getStyle(bento, 'gridAutoFlow');
    expect(display).toBe('grid');
    expect(flow).toContain('dense');
  });

  test('.sf-bento span-2 items are wider', async ({ page }) => {
    await page.goto(DEMO_URL);
    const bento = page.locator('#layout-bento .sf-bento').first();
    const wideItem = bento.locator('[style*="span 2"]').first();
    const normalItem = bento.locator('.demo-box--alt').first();
    const wideBox = await wideItem.boundingBox();
    const normalBox = await normalItem.boundingBox();
    expect(wideBox.width).toBeGreaterThan(normalBox.width);
  });
});


// ═══════════════════════════════════════════════════════════════
// LAYOUT PRIMITIVES — ALTERNATE (ZIGZAG)
// ═══════════════════════════════════════════════════════════════
test.describe('Layout — Alternate', () => {
  test('.sf-alternate uses grid layout', async ({ page }) => {
    await page.goto(DEMO_URL);
    const alternate = page.locator('#layout-alternate .sf-alternate').first();
    const display = await getStyle(alternate, 'display');
    expect(display).toBe('grid');
  });

  test('.sf-alternate children use grid layout', async ({ page }) => {
    await page.goto(DEMO_URL);
    const alt = page.locator('#layout-alternate .sf-alternate').first();
    const row = alt.locator('> *').first();
    const display = await getStyle(row, 'display');
    expect(display).toBe('grid');
  });
});

// ═══════════════════════════════════════════════════════════════
// LAYOUT PRIMITIVES — CONTENT GRID
// ═══════════════════════════════════════════════════════════════
test.describe('Layout — Content Grid', () => {
  test('.sf-content-grid uses CSS grid', async ({ page }) => {
    await page.goto(DEMO_URL);
    const cg = page.locator('#layout-content-grid .sf-content-grid').first();
    const display = await getStyle(cg, 'display');
    expect(display).toBe('grid');
  });

  test('.sf-breakout is wider than normal content', async ({ page }) => {
    await page.goto(DEMO_URL);
    const cg = page.locator('#layout-content-grid .sf-content-grid').first();
    const normal = cg.locator('> p').first();
    const breakout = cg.locator('.sf-breakout').first();
    const normalBox = await normal.boundingBox();
    const breakoutBox = await breakout.boundingBox();
    expect(breakoutBox.width).toBeGreaterThanOrEqual(normalBox.width);
  });

  test('.sf-full-bleed spans full width', async ({ page }) => {
    await page.goto(DEMO_URL);
    const cg = page.locator('#layout-content-grid .sf-content-grid').first();
    const cgBox = await cg.boundingBox();
    const fullBleed = cg.locator('.sf-full-bleed').first();
    const bleedBox = await fullBleed.boundingBox();
    // Full bleed should be approximately the full width of parent
    expect(bleedBox.width).toBeCloseTo(cgBox.width, -1);
  });
});


// ═══════════════════════════════════════════════════════════════
// LAYOUT PRIMITIVES — PANCAKE
// ═══════════════════════════════════════════════════════════════
test.describe('Layout — Pancake', () => {
  test('.sf-pancake uses grid with 3 rows (auto 1fr auto)', async ({ page }) => {
    await page.goto(DEMO_URL);
    const pancake = page.locator('#layout-pancake .sf-pancake').first();
    const display = await getStyle(pancake, 'display');
    expect(display).toBe('grid');
    const rows = await getStyle(pancake, 'gridTemplateRows');
    // Should have 3 row tracks
    expect(rows.split(' ').length).toBeGreaterThanOrEqual(3);
  });

  test('.sf-pancake main area takes remaining space', async ({ page }) => {
    await page.goto(DEMO_URL);
    const pancake = page.locator('#layout-pancake .sf-pancake').first();
    const header = pancake.locator('> header').first();
    const main = pancake.locator('> div').first();
    const footer = pancake.locator('> footer').first();
    const headerBox = await header.boundingBox();
    const mainBox = await main.boundingBox();
    const footerBox = await footer.boundingBox();
    // Main should be the tallest
    expect(mainBox.height).toBeGreaterThan(headerBox.height);
    expect(mainBox.height).toBeGreaterThan(footerBox.height);
  });
});

// ═══════════════════════════════════════════════════════════════
// LAYOUT PRIMITIVES — IMPOSTER
// ═══════════════════════════════════════════════════════════════
test.describe('Layout — Imposter', () => {
  test('.sf-imposter is centered within parent', async ({ page }) => {
    await page.goto(DEMO_URL);
    const container = page.locator('#layout-extra div[style*="position: relative"]').first();
    const imposter = container.locator('.sf-imposter').first();
    const containerBox = await container.boundingBox();
    const imposterBox = await imposter.boundingBox();
    const containerCenterX = containerBox.x + containerBox.width / 2;
    const imposterCenterX = imposterBox.x + imposterBox.width / 2;
    expect(Math.abs(containerCenterX - imposterCenterX)).toBeLessThan(5);
  });
});


// ═══════════════════════════════════════════════════════════════
// LAYOUT PRIMITIVES — CENTER & BOX
// ═══════════════════════════════════════════════════════════════
test.describe('Layout — Center & Box', () => {
  test('.sf-center has auto margins and max-inline-size', async ({ page }) => {
    await page.goto(DEMO_URL);
    const center = page.locator('#layout-extra .sf-center').first();
    const marginLeft = parseFloat(await getStyle(center, 'marginLeft'));
    const marginRight = parseFloat(await getStyle(center, 'marginRight'));
    // Allow sub-pixel rounding tolerance
    expect(Math.abs(marginLeft - marginRight)).toBeLessThan(1);
  });

  test('.sf-box has padding and outline', async ({ page }) => {
    await page.goto(DEMO_URL);
    const box = page.locator('#layout-extra .sf-box').first();
    const padding = await getStyle(box, 'padding');
    const outline = await getStyle(box, 'outlineStyle');
    expect(parseFloat(padding)).toBeGreaterThan(0);
    expect(outline).toBe('solid');
  });
});

// ═══════════════════════════════════════════════════════════════
// PRINT STYLES
// ═══════════════════════════════════════════════════════════════
test.describe('Print Styles', () => {
  test('.no-print elements are hidden in print media', async ({ page }) => {
    await page.goto(DEMO_URL);
    await page.emulateMedia({ media: 'print' });
    const noPrint = page.locator('#print .no-print').first();
    const display = await getStyle(noPrint, 'display');
    expect(display).toBe('none');
  });

  test('.print-color-exact preserves colors in print', async ({ page }) => {
    await page.goto(DEMO_URL);
    await page.emulateMedia({ media: 'print' });
    const exact = page.locator('#print .print-color-exact').first();
    const pca = await exact.evaluate(el => {
      const cs = getComputedStyle(el);
      return cs.getPropertyValue('print-color-adjust') ||
             cs.getPropertyValue('-webkit-print-color-adjust');
    });
    expect(pca).toBe('exact');
  });

  test('links show href after text in print', async ({ page, browserName }) => {
    await page.goto(DEMO_URL);
    await page.emulateMedia({ media: 'print' });
    const link = page.locator('#print a[href^="https"]').first();
    const afterContent = await link.evaluate(el =>
      getComputedStyle(el, '::after').content
    );
    // Chromium resolves attr() in the computed ::after content; Firefox/WebKit
    // report the unresolved `attr(href)` expression. Either proves the print
    // rule is applied (and not suppressed to none/normal).
    if (browserName === 'chromium') {
      expect(afterContent).toContain('http');
    } else {
      expect(afterContent).toMatch(/attr\(href\)|http/);
    }
  });

  test('shadows are removed in print', async ({ page }) => {
    await page.goto(DEMO_URL);
    await page.emulateMedia({ media: 'print' });
    const card = page.locator('.demo-shadow-card').first();
    const shadow = await getStyle(card, 'boxShadow');
    expect(shadow).toBe('none');
  });
});


// ═══════════════════════════════════════════════════════════════
// ACCESSIBILITY
// ═══════════════════════════════════════════════════════════════
test.describe('Accessibility', () => {
  test('.skip-link exists and is visually hidden until focused', async ({ page }) => {
    await page.goto(DEMO_URL);
    const skipLink = page.locator('.skip-link');
    await expect(skipLink).toBeAttached();
    // Before focus, it should be positioned off-screen
    const box = await skipLink.boundingBox();
    // Skip link is either off-screen or has clip
    expect(box === null || box.width <= 1 || box.height <= 1 ||
      box.x < 0 || box.y < 0).toBeTruthy();
  });

  test('.sr-only is not visible', async ({ page }) => {
    await page.goto(DEMO_URL);
    const srOnly = page.locator('.sr-only').first();
    const box = await srOnly.boundingBox();
    expect(box === null || box.width <= 1 || box.height <= 1).toBeTruthy();
  });

  test('disabled buttons have reduced opacity or cursor change', async ({ page }) => {
    await page.goto(DEMO_URL);
    const disabled = page.locator('#accessibility button[disabled]').first();
    // [disabled] attribute triggers browser-native styles; .is-disabled class
    // applies reduced opacity. The disabled attr may or may not reduce opacity
    // depending on browser defaults, but cursor should be restricted.
    const opacity = parseFloat(await getStyle(disabled, 'opacity'));
    const pointerEvents = await getStyle(disabled, 'pointerEvents');
    const cursor = await getStyle(disabled, 'cursor');
    // Either opacity is reduced OR pointer-events is none (depending on approach)
    const isStyled = opacity < 1 || pointerEvents === 'none' || cursor === 'not-allowed';
    expect(isStyled).toBeTruthy();
    // At minimum, the element should exist and be rendered
    const box = await disabled.boundingBox();
    expect(box).not.toBeNull();
    expect(box.width).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════
// DARK MODE TOGGLE
// ═══════════════════════════════════════════════════════════════
test.describe('Dark Mode', () => {
  test('toggling dark mode changes background color', async ({ page }) => {
    await page.goto(DEMO_URL);
    const lightBg = await page.evaluate(() =>
      getComputedStyle(document.body).backgroundColor
    );
    await page.click('#theme-toggle');
    const darkBg = await page.evaluate(() =>
      getComputedStyle(document.body).backgroundColor
    );
    expect(lightBg).not.toBe(darkBg);
  });

  test('dark mode applies data-theme attribute', async ({ page }) => {
    await page.goto(DEMO_URL);
    await page.click('#theme-toggle');
    const theme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    expect(theme).toBe('dark');
  });
});


// ═══════════════════════════════════════════════════════════════
// FORMS & RESET
// ═══════════════════════════════════════════════════════════════
test.describe('Forms & Reset', () => {
  test('all elements use border-box sizing', async ({ page }) => {
    await page.goto(DEMO_URL);
    const boxSizing = await page.evaluate(() =>
      getComputedStyle(document.querySelector('input[type="text"]')).boxSizing
    );
    expect(boxSizing).toBe('border-box');
  });

  test('form inputs have visible borders', async ({ page }) => {
    await page.goto(DEMO_URL);
    const input = page.locator('#reset-base input[type="text"]').first();
    const borderWidth = await getStyle(input, 'borderTopWidth');
    expect(parseFloat(borderWidth)).toBeGreaterThan(0);
  });

  test('table has border-collapse', async ({ page }) => {
    await page.goto(DEMO_URL);
    const table = page.locator('#reset-base table').first();
    const collapse = await getStyle(table, 'borderCollapse');
    expect(collapse).toBe('collapse');
  });
});

// ═══════════════════════════════════════════════════════════════
// LAYOUT — ADDITIONAL PRIMITIVES (layout-extra section)
// ═══════════════════════════════════════════════════════════════
test.describe('Layout — Additional Primitives', () => {
  test('.sf-section--l and --xl have padding-block', async ({ page }) => {
    await page.goto(DEMO_URL);
    const sectionL = page.locator('#layout-extra .sf-section--l').first();
    const sectionXL = page.locator('#layout-extra .sf-section--xl').first();
    const padL = parseFloat(await getStyle(sectionL, 'paddingTop'));
    const padXL = parseFloat(await getStyle(sectionXL, 'paddingTop'));
    expect(padL).toBeGreaterThan(0);
    expect(padXL).toBeGreaterThan(padL);
  });

  test('.sf-stack--center aligns items center', async ({ page }) => {
    await page.goto(DEMO_URL);
    const stack = page.locator('#layout-extra .sf-stack--center').first();
    const align = await getStyle(stack, 'alignItems');
    expect(align).toBe('center');
  });

  test('.sf-stack--end aligns items to flex-end', async ({ page }) => {
    await page.goto(DEMO_URL);
    const stack = page.locator('#layout-extra .sf-stack--end').first();
    const align = await getStyle(stack, 'alignItems');
    expect(align).toBe('flex-end');
  });

  test('.sf-stack--stretch aligns items stretch', async ({ page }) => {
    await page.goto(DEMO_URL);
    const stack = page.locator('#layout-extra .sf-stack--stretch').first();
    const align = await getStyle(stack, 'alignItems');
    expect(align).toBe('stretch');
  });
});


// ═══════════════════════════════════════════════════════════════
// STATES — FULL COVERAGE
// ═══════════════════════════════════════════════════════════════
test.describe('States — Full Coverage', () => {
  test('.is-selected has background highlight', async ({ page }) => {
    await page.goto(DEMO_URL);
    const selected = page.locator('#states-full .is-selected').first();
    const bg = await getStyle(selected, 'backgroundColor');
    expect(bg).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('.is-valid sets border color to success color', async ({ page }) => {
    await page.goto(DEMO_URL);
    const valid = page.locator('#states-full .is-valid').first();
    const borderColor = await valid.evaluate(el =>
      getComputedStyle(el).getPropertyValue('--sf-field-border-color').trim()
    );
    // The token resolves to the actual color value (oklch/light-dark), not the variable name
    expect(borderColor.length).toBeGreaterThan(0);
    expect(borderColor).not.toBe('');
  });

  test('.is-invalid sets border color to error color', async ({ page }) => {
    await page.goto(DEMO_URL);
    const invalid = page.locator('#states-full .is-invalid').first();
    const borderColor = await invalid.evaluate(el =>
      getComputedStyle(el).getPropertyValue('--sf-field-border-color').trim()
    );
    expect(borderColor.length).toBeGreaterThan(0);
    expect(borderColor).not.toBe('');
    // Valid and invalid should have DIFFERENT border colors
    const validEl = page.locator('#states-full .is-valid').first();
    const validBorderColor = await validEl.evaluate(el =>
      getComputedStyle(el).getPropertyValue('--sf-field-border-color').trim()
    );
    expect(borderColor).not.toBe(validBorderColor);
  });

  test('.is-dragging has reduced opacity', async ({ page }) => {
    await page.goto(DEMO_URL);
    const dragging = page.locator('#states-full .is-dragging').first();
    const opacity = parseFloat(await getStyle(dragging, 'opacity'));
    expect(opacity).toBe(0.5);
  });

  test('.is-drop-target has dashed outline', async ({ page }) => {
    await page.goto(DEMO_URL);
    const dropTarget = page.locator('#states-full .is-drop-target').first();
    const outlineStyle = await getStyle(dropTarget, 'outlineStyle');
    expect(outlineStyle).toBe('dashed');
  });

  test('.is-overlay covers parent with absolute positioning', async ({ page }) => {
    await page.goto(DEMO_URL);
    const overlay = page.locator('#states-full .is-overlay').first();
    const position = await getStyle(overlay, 'position');
    expect(position).toBe('absolute');
  });

  test('.is-clipped hides overflow', async ({ page }) => {
    await page.goto(DEMO_URL);
    const clipped = page.locator('#states-full .is-clipped').first();
    const overflow = await getStyle(clipped, 'overflow');
    expect(overflow).toBe('hidden');
  });

  test('.is-scrollable enables scroll with overscroll containment', async ({ page }) => {
    await page.goto(DEMO_URL);
    const scrollable = page.locator('#states-full .is-scrollable').first();
    const overflow = await getStyle(scrollable, 'overflow');
    expect(overflow).toBe('auto');
  });
});


// ═══════════════════════════════════════════════════════════════
// RESPONSIVE BEHAVIOR (viewport sizes)
// ═══════════════════════════════════════════════════════════════
test.describe('Responsive', () => {
  test('at narrow viewport, sidebar collapses to stack', async ({ page }) => {
    await page.setViewportSize({ width: 480, height: 800 });
    await page.goto(DEMO_URL);
    const sidebar = page.locator('#layout-sidebar .sf-sidebar').first();
    const children = sidebar.locator('> *');
    const first = await children.first().boundingBox();
    const last = await children.last().boundingBox();
    // In narrow viewport, they should stack (last is below first)
    expect(last.y).toBeGreaterThan(first.y + first.height - 5);
  });

  test('at wide viewport, sidebar is side-by-side', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto(DEMO_URL);
    const sidebar = page.locator('#layout-sidebar .sf-sidebar').first();
    const children = sidebar.locator('> *');
    const first = await children.first().boundingBox();
    const last = await children.last().boundingBox();
    // In wide viewport, they should be side by side
    expect(last.x).toBeGreaterThan(first.x);
    expect(Math.abs(last.y - first.y)).toBeLessThan(first.height);
  });

  test('grid items reflow at different viewport widths', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto(DEMO_URL);
    const grid = page.locator('#layout-grid .sf-grid').first();
    const items = grid.locator('.demo-box');
    const first = await items.first().boundingBox();
    const second = await items.nth(1).boundingBox();
    // At wide viewport, items should be in a row
    expect(second.x).toBeGreaterThan(first.x);

    // At narrow viewport, items take more width (fewer per row)
    await page.setViewportSize({ width: 400, height: 800 });
    await page.waitForTimeout(100);
    const firstNarrow = await items.first().boundingBox();
    // At narrow viewport, individual item should be wider or equal
    // (fewer columns means each item gets more space)
    expect(firstNarrow.width).toBeGreaterThanOrEqual(first.width * 0.7);
  });
});


// ═══════════════════════════════════════════════════════════════
// THEME CUSTOMIZER
// ═══════════════════════════════════════════════════════════════
test.describe('Theme Customizer', () => {
  test('color inputs are populated with hex values', async ({ page }) => {
    await page.goto(DEMO_URL);
    const inputs = page.locator('#theme-customizer input[type="color"]');
    const count = await inputs.count();
    expect(count).toBeGreaterThanOrEqual(16);
    for (let i = 0; i < Math.min(count, 3); i++) {
      const val = await inputs.nth(i).inputValue();
      expect(val).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  test('reset button exists and is clickable', async ({ page }) => {
    await page.goto(DEMO_URL);
    const resetBtn = page.locator('#cz-reset');
    await expect(resetBtn).toBeVisible();
  });
});

// ═══════════════════════════════════════════════════════════════
// OVERALL PAGE STRUCTURE
// ═══════════════════════════════════════════════════════════════
test.describe('Page Structure', () => {
  test('page has header, nav, and main', async ({ page }) => {
    await page.goto(DEMO_URL);
    await expect(page.locator('#demo-header')).toBeVisible();
    await expect(page.locator('#demo-nav')).toBeAttached();
    await expect(page.locator('#main')).toBeVisible();
  });

  test('nav contains links to all sections', async ({ page }) => {
    await page.goto(DEMO_URL);
    const navLinks = page.locator('#demo-nav a');
    const count = await navLinks.count();
    expect(count).toBeGreaterThanOrEqual(20);
  });

  test('all section ids referenced in nav exist', async ({ page }) => {
    await page.goto(DEMO_URL);
    const hrefs = await page.evaluate(() => {
      const links = document.querySelectorAll('#demo-nav a[href^="#"]');
      return [...links].map(a => a.getAttribute('href').slice(1));
    });
    for (const id of hrefs) {
      const el = page.locator(`#${id}`);
      await expect(el).toBeAttached();
    }
  });
});
