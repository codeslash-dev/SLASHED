// @ts-check
// Behavioural tests for core/layout.css — every layout primitive.
import { test, expect } from '@playwright/test';
import { renderWithBundle } from './render-helpers.js';

async function setup(page, html) {
  await renderWithBundle(page, html, { width: 1200, height: 900 });
}

// ── .sf-section ────────────────────────────────────────────────
test.describe('layout: .sf-section', () => {
  test('has non-zero padding-block', async ({ page }) => {
    await setup(page, `<div id="t" class="sf-section">x</div>`);
    const p = await page.locator('#t').evaluate(el => ({
      top: parseFloat(getComputedStyle(el).paddingBlockStart),
      bot: parseFloat(getComputedStyle(el).paddingBlockEnd),
    }));
    expect(p.top).toBeGreaterThan(0);
    expect(p.bot).toBeGreaterThan(0);
  });

  test('--xl padding is larger than --xs padding', async ({ page }) => {
    await setup(page, `
      <div id="xs" class="sf-section sf-section--xs">x</div>
      <div id="xl" class="sf-section sf-section--xl">x</div>
    `);
    const [xs, xl] = await Promise.all([
      page.locator('#xs').evaluate(el => parseFloat(getComputedStyle(el).paddingBlockStart)),
      page.locator('#xl').evaluate(el => parseFloat(getComputedStyle(el).paddingBlockStart)),
    ]);
    expect(xl).toBeGreaterThan(xs);
  });

  test('sf-section-group collapses adjacent section top padding to 0', async ({ page }) => {
    await setup(page, `
      <div class="sf-section-group">
        <div class="sf-section">First</div>
        <div id="t" class="sf-section">Second</div>
      </div>
    `);
    const pt = await page.locator('#t').evaluate(el =>
      parseFloat(getComputedStyle(el).paddingBlockStart)
    );
    expect(pt).toBe(0);
  });
});

// ── .sf-container ───────────────────────────────────────────────
test.describe('layout: .sf-container', () => {
  test('is horizontally centered (equal left/right gaps)', async ({ page }) => {
    // margin-inline: auto computes to pixel values; verify centering via bounding boxes.
    await setup(page, `
      <div id="wrap" style="width:1400px">
        <div id="t" class="sf-container sf-container--narrow">x</div>
      </div>
    `);
    const gaps = await page.evaluate(() => {
      const wrap = document.getElementById('wrap').getBoundingClientRect();
      const el   = document.getElementById('t').getBoundingClientRect();
      return { left: el.left - wrap.left, right: wrap.right - el.right };
    });
    expect(Math.abs(gaps.left - gaps.right)).toBeLessThan(2);
  });

  test('establishes a named inline-size container (sf-layout)', async ({ page }) => {
    await setup(page, `<div id="t" class="sf-container">x</div>`);
    const cn = await page.locator('#t').evaluate(el => getComputedStyle(el).containerName);
    expect(cn).toContain('sf-layout');
  });

  test('--narrow < default < --wide max-width', async ({ page }) => {
    await setup(page, `
      <div id="n" class="sf-container sf-container--narrow">x</div>
      <div id="d" class="sf-container">x</div>
      <div id="w" class="sf-container sf-container--wide">x</div>
    `);
    const [n, d, w] = await Promise.all([
      page.locator('#n').evaluate(el => parseFloat(getComputedStyle(el).maxWidth)),
      page.locator('#d').evaluate(el => parseFloat(getComputedStyle(el).maxWidth)),
      page.locator('#w').evaluate(el => parseFloat(getComputedStyle(el).maxWidth)),
    ]);
    expect(n).toBeLessThan(d);
    expect(d).toBeLessThan(w);
  });

  test('--full has max-width none or very large', async ({ page }) => {
    await setup(page, `<div id="t" class="sf-container sf-container--full">x</div>`);
    const mw = await page.locator('#t').evaluate(el => getComputedStyle(el).maxWidth);
    // full = no limit (none) or 100%
    expect(['none', '100%']).toContain(mw);
  });
});

// ── .sf-stack ───────────────────────────────────────────────────
test.describe('layout: .sf-stack', () => {
  test('is flex column', async ({ page }) => {
    await setup(page, `<div id="t" class="sf-stack"><div>A</div><div>B</div></div>`);
    const cs = await page.locator('#t').evaluate(el => ({
      display: getComputedStyle(el).display,
      dir:     getComputedStyle(el).flexDirection,
    }));
    expect(cs.display).toBe('flex');
    expect(cs.dir).toBe('column');
  });

  test('gap modifier --s < --l', async ({ page }) => {
    await setup(page, `
      <div id="s" class="sf-stack sf-stack--s"><div>A</div><div>B</div></div>
      <div id="l" class="sf-stack sf-stack--l"><div>A</div><div>B</div></div>
    `);
    const [gs, gl] = await Promise.all([
      page.locator('#s').evaluate(el => parseFloat(getComputedStyle(el).rowGap)),
      page.locator('#l').evaluate(el => parseFloat(getComputedStyle(el).rowGap)),
    ]);
    expect(gl).toBeGreaterThan(gs);
  });

  test('--center aligns children to center', async ({ page }) => {
    await setup(page, `<div id="t" class="sf-stack sf-stack--center"><div>A</div></div>`);
    const ai = await page.locator('#t').evaluate(el => getComputedStyle(el).alignItems);
    expect(ai).toBe('center');
  });
});

// ── .sf-gap ─────────────────────────────────────────────────────
test.describe('layout: .sf-gap', () => {
  test('modifiers set increasing gap values', async ({ page }) => {
    await setup(page, `
      <div id="s" class="sf-gap sf-gap--s" style="display:flex"><div>A</div><div>B</div></div>
      <div id="l" class="sf-gap sf-gap--l" style="display:flex"><div>A</div><div>B</div></div>
    `);
    const [gs, gl] = await Promise.all([
      page.locator('#s').evaluate(el => parseFloat(getComputedStyle(el).gap)),
      page.locator('#l').evaluate(el => parseFloat(getComputedStyle(el).gap)),
    ]);
    expect(gl).toBeGreaterThan(gs);
  });
});

// ── .sf-cluster ─────────────────────────────────────────────────
test.describe('layout: .sf-cluster', () => {
  test('is flex-wrap row', async ({ page }) => {
    await setup(page, `<div id="t" class="sf-cluster"><span>A</span><span>B</span></div>`);
    const cs = await page.locator('#t').evaluate(el => ({
      display: getComputedStyle(el).display,
      wrap:    getComputedStyle(el).flexWrap,
    }));
    expect(cs.display).toBe('flex');
    expect(cs.wrap).toBe('wrap');
  });

  test('--center sets justify-content: center', async ({ page }) => {
    await setup(page, `<div id="t" class="sf-cluster sf-cluster--center"><span>A</span></div>`);
    const jc = await page.locator('#t').evaluate(el => getComputedStyle(el).justifyContent);
    expect(jc).toBe('center');
  });

  test('--end sets justify-content: flex-end', async ({ page }) => {
    await setup(page, `<div id="t" class="sf-cluster sf-cluster--end"><span>A</span></div>`);
    const jc = await page.locator('#t').evaluate(el => getComputedStyle(el).justifyContent);
    expect(jc).toBe('flex-end');
  });

  test('--between sets justify-content: space-between', async ({ page }) => {
    await setup(page, `<div id="t" class="sf-cluster sf-cluster--between"><span>A</span></div>`);
    const jc = await page.locator('#t').evaluate(el => getComputedStyle(el).justifyContent);
    expect(jc).toBe('space-between');
  });

  test('--no-wrap disables flex wrapping', async ({ page }) => {
    await setup(page, `<div id="t" class="sf-cluster sf-cluster--no-wrap"><span>A</span></div>`);
    const fw = await page.locator('#t').evaluate(el => getComputedStyle(el).flexWrap);
    expect(fw).toBe('nowrap');
  });
});

// ── .sf-sidebar ─────────────────────────────────────────────────
test.describe('layout: .sf-sidebar', () => {
  test('is flex-wrap container', async ({ page }) => {
    await setup(page, `
      <div id="t" class="sf-sidebar" style="width: 900px">
        <aside>Sidebar</aside><main>Main</main>
      </div>
    `);
    const cs = await page.locator('#t').evaluate(el => ({
      display: getComputedStyle(el).display,
      wrap:    getComputedStyle(el).flexWrap,
    }));
    expect(cs.display).toBe('flex');
    expect(cs.wrap).toBe('wrap');
  });

  test('--narrow has narrower flex-basis than default', async ({ page }) => {
    await setup(page, `
      <div id="d" class="sf-sidebar" style="width: 900px">
        <aside id="sd">S</aside><main>M</main>
      </div>
      <div id="n" class="sf-sidebar sf-sidebar--narrow" style="width: 900px">
        <aside id="sn">S</aside><main>M</main>
      </div>
    `);
    const [bd, bn] = await Promise.all([
      page.locator('#sd').evaluate(el => parseFloat(getComputedStyle(el).flexBasis)),
      page.locator('#sn').evaluate(el => parseFloat(getComputedStyle(el).flexBasis)),
    ]);
    expect(bn).toBeLessThan(bd);
  });

  test('--right swaps sidebar to the right side', async ({ page }) => {
    await setup(page, `
      <div id="t" class="sf-sidebar sf-sidebar--right" style="width: 900px">
        <main id="m">Main content</main>
        <aside id="a">Sidebar</aside>
      </div>
    `);
    // In --right: first child (main) gets flex-grow:999 (content area)
    // last child (aside) gets flex-basis: sidebar-width (sidebar)
    const [mainGrow, asideGrow] = await Promise.all([
      page.locator('#m').evaluate(el => parseFloat(getComputedStyle(el).flexGrow)),
      page.locator('#a').evaluate(el => parseFloat(getComputedStyle(el).flexGrow)),
    ]);
    expect(mainGrow).toBeGreaterThan(asideGrow);
  });
});

// ── .sf-switcher ────────────────────────────────────────────────
test.describe('layout: .sf-switcher', () => {
  test('is flex-wrap', async ({ page }) => {
    await setup(page, `<div id="t" class="sf-switcher"><div>A</div><div>B</div></div>`);
    const cs = await page.locator('#t').evaluate(el => ({
      display: getComputedStyle(el).display,
      wrap:    getComputedStyle(el).flexWrap,
    }));
    expect(cs.display).toBe('flex');
    expect(cs.wrap).toBe('wrap');
  });

  test('--vertical sets flex-direction: column', async ({ page }) => {
    await setup(page, `<div id="t" class="sf-switcher sf-switcher--vertical"><div>A</div></div>`);
    const dir = await page.locator('#t').evaluate(el => getComputedStyle(el).flexDirection);
    expect(dir).toBe('column');
  });

  test('--no-wrap disables wrapping and adds overflow-x: auto', async ({ page }) => {
    await setup(page, `<div id="t" class="sf-switcher sf-switcher--no-wrap"><div>A</div></div>`);
    const cs = await page.locator('#t').evaluate(el => ({
      wrap:     getComputedStyle(el).flexWrap,
      overflow: getComputedStyle(el).overflowX,
    }));
    expect(cs.wrap).toBe('nowrap');
    expect(cs.overflow).toBe('auto');
  });
});

// ── .sf-grid ────────────────────────────────────────────────────
test.describe('layout: .sf-grid', () => {
  test('is a CSS grid', async ({ page }) => {
    await setup(page, `<div id="t" class="sf-grid" style="width:800px"><div>A</div></div>`);
    const display = await page.locator('#t').evaluate(el => getComputedStyle(el).display);
    expect(display).toBe('grid');
  });

  test('size modifier --l produces fewer columns than --s at equal width', async ({ page }) => {
    // Larger min = fewer columns that fit in 1200px
    await setup(page, `
      <div id="s" class="sf-grid sf-grid--s" style="width:1200px">
        <div>A</div><div>B</div><div>C</div><div>D</div><div>E</div><div>F</div>
      </div>
      <div id="l" class="sf-grid sf-grid--l" style="width:1200px">
        <div>A</div><div>B</div><div>C</div><div>D</div><div>E</div><div>F</div>
      </div>
    `);
    const [cs, cl] = await Promise.all([
      page.locator('#s').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length),
      page.locator('#l').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length),
    ]);
    expect(cs).toBeGreaterThanOrEqual(cl);
  });

  test('--dense sets grid-auto-flow: dense', async ({ page }) => {
    await setup(page, `<div id="t" class="sf-grid sf-grid--dense" style="width:800px"><div>A</div></div>`);
    const flow = await page.locator('#t').evaluate(el => getComputedStyle(el).gridAutoFlow);
    expect(flow).toContain('dense');
  });
});

// ── .sf-equal ───────────────────────────────────────────────────
// .sf-equal is CSS multi-column flowing layout, not a grid: content
// distributes across columns like a newspaper instead of sitting in
// discrete grid cells (that's what .sf-grid/.sf-grid--fit is for).
test.describe('layout: .sf-equal', () => {
  test('--3 sets column-count: 3', async ({ page }) => {
    await setup(page, `
      <div id="t" class="sf-equal sf-equal--3" style="width:900px">
        <p>A</p><p>B</p><p>C</p>
      </div>
    `);
    const columnCount = await page.locator('#t').evaluate(el => getComputedStyle(el).columnCount);
    expect(columnCount).toBe('3');
  });

  test('--4 sets column-count: 4', async ({ page }) => {
    await setup(page, `
      <div id="t" class="sf-equal sf-equal--4" style="width:1200px">
        <p>A</p><p>B</p><p>C</p><p>D</p>
      </div>
    `);
    const columnCount = await page.locator('#t').evaluate(el => getComputedStyle(el).columnCount);
    expect(columnCount).toBe('4');
  });

  test('base class sets column-width from --sf-equal-min-col', async ({ page }) => {
    await setup(page, `
      <div id="t" class="sf-equal" style="width:900px; --sf-equal-min-col: 12rem">
        <p>A</p><p>B</p><p>C</p>
      </div>
    `);
    const columnWidth = await page.locator('#t').evaluate(el => getComputedStyle(el).columnWidth);
    expect(columnWidth).toBe('192px'); // 12rem @ default 16px root
  });

  test('children get break-inside: avoid', async ({ page }) => {
    await setup(page, `
      <div id="t" class="sf-equal sf-equal--2" style="width:900px">
        <p id="child">A</p>
      </div>
    `);
    const breakInside = await page.locator('#child').evaluate(el => getComputedStyle(el).breakInside);
    expect(breakInside).toBe('avoid');
  });
});

// ── .sf-cover ───────────────────────────────────────────────────
test.describe('layout: .sf-cover', () => {
  test('is flex column with min-height', async ({ page }) => {
    await setup(page, `<div id="t" class="sf-cover"><p>x</p></div>`);
    const cs = await page.locator('#t').evaluate(el => ({
      display: getComputedStyle(el).display,
      dir:     getComputedStyle(el).flexDirection,
      minH:    parseFloat(getComputedStyle(el).minHeight),
    }));
    expect(cs.display).toBe('flex');
    expect(cs.dir).toBe('column');
    expect(cs.minH).toBeGreaterThan(0);
  });

  test('.sf-cover__center child is vertically centered in the cover', async ({ page }) => {
    // margin-block: auto computes to a pixel value; verify centering via bounding boxes.
    await setup(page, `
      <div id="cover" class="sf-cover" style="height:400px; min-height:0">
        <div id="c" class="sf-cover__center" style="height:50px">center</div>
      </div>
    `);
    const gaps = await page.evaluate(() => {
      const cover = document.getElementById('cover').getBoundingClientRect();
      const el    = document.getElementById('c').getBoundingClientRect();
      return { top: el.top - cover.top, bottom: cover.bottom - el.bottom };
    });
    expect(Math.abs(gaps.top - gaps.bottom)).toBeLessThan(2);
  });

  test('--min has smaller min-height than default', async ({ page }) => {
    await setup(page, `
      <div id="d" class="sf-cover">x</div>
      <div id="m" class="sf-cover sf-cover--min">x</div>
    `);
    const [hd, hm] = await Promise.all([
      page.locator('#d').evaluate(el => parseFloat(getComputedStyle(el).minHeight)),
      page.locator('#m').evaluate(el => parseFloat(getComputedStyle(el).minHeight)),
    ]);
    expect(hm).toBeLessThan(hd);
  });
});

// ── .sf-frame ───────────────────────────────────────────────────
test.describe('layout: .sf-frame', () => {
  test('--video has 16:9 aspect ratio (width=320 → height≈180)', async ({ page }) => {
    await setup(page, `<div id="t" class="sf-frame sf-frame--video" style="width:320px"></div>`);
    const box = await page.locator('#t').boundingBox();
    expect(box.height).toBeCloseTo(180, 0);
  });

  test('--square has 1:1 aspect ratio', async ({ page }) => {
    await setup(page, `<div id="t" class="sf-frame sf-frame--square" style="width:200px"></div>`);
    const box = await page.locator('#t').boundingBox();
    expect(box.height).toBeCloseTo(200, 0);
  });

  test('--portrait is taller than wide (3:4)', async ({ page }) => {
    await setup(page, `<div id="t" class="sf-frame sf-frame--portrait" style="width:300px"></div>`);
    const box = await page.locator('#t').boundingBox();
    expect(box.height).toBeGreaterThan(box.width);
  });

  test('media children fill the frame (same px width, object-fit:cover)', async ({ page }) => {
    // CSS width:100% computes to a pixel value equal to the frame's clientWidth.
    await setup(page, `
      <div id="frame" class="sf-frame sf-frame--video" style="width:320px">
        <img id="img" src="" alt="">
      </div>
    `);
    const cs = await page.evaluate(() => ({
      imgW:   document.getElementById('img').clientWidth,
      frameW: document.getElementById('frame').clientWidth,
      fit:    getComputedStyle(document.getElementById('img')).objectFit,
    }));
    expect(cs.imgW).toBe(cs.frameW);
    expect(cs.fit).toBe('cover');
  });
});

// ── .sf-reel ────────────────────────────────────────────────────
test.describe('layout: .sf-reel', () => {
  test('is flex with horizontal scroll-snap', async ({ page }) => {
    await setup(page, `
      <div id="t" class="sf-reel" style="width:300px">
        <div style="min-width:200px">A</div>
        <div style="min-width:200px">B</div>
      </div>
    `);
    const cs = await page.locator('#t').evaluate(el => ({
      display:  getComputedStyle(el).display,
      overflow: getComputedStyle(el).overflowX,
      snap:     getComputedStyle(el).scrollSnapType,
    }));
    expect(cs.display).toBe('flex');
    expect(cs.overflow).toBe('auto');
    expect(cs.snap).toContain('inline');
    expect(cs.snap).toContain('mandatory');
  });

  test('children have scroll-snap-align: start', async ({ page }) => {
    await setup(page, `
      <div class="sf-reel" style="width:300px">
        <div id="c" style="min-width:200px">A</div>
      </div>
    `);
    const snap = await page.locator('#c').evaluate(el => getComputedStyle(el).scrollSnapAlign);
    expect(snap).toBe('start');
  });
});

// ── .sf-pancake ─────────────────────────────────────────────────
test.describe('layout: .sf-pancake', () => {
  test('is grid with exactly 3 rows', async ({ page }) => {
    // Computed gridTemplateRows resolves to pixel values ("40px 820px 40px"),
    // so we count tokens rather than matching "auto"/"1fr" keywords.
    await setup(page, `
      <div id="t" class="sf-pancake" style="height:400px">
        <header style="height:40px">H</header>
        <main>M</main>
        <footer style="height:40px">F</footer>
      </div>
    `);
    const rowCount = await page.locator('#t').evaluate(el =>
      getComputedStyle(el).gridTemplateRows.trim().split(/\s+/).length
    );
    expect(rowCount).toBe(3);
  });

  test('main row is taller than header and footer', async ({ page }) => {
    await setup(page, `
      <div class="sf-pancake" style="height:400px">
        <header id="hd">H</header>
        <main id="mn">M</main>
        <footer id="ft">F</footer>
      </div>
    `);
    const [hh, hm, hf] = await Promise.all([
      page.locator('#hd').evaluate(el => el.clientHeight),
      page.locator('#mn').evaluate(el => el.clientHeight),
      page.locator('#ft').evaluate(el => el.clientHeight),
    ]);
    expect(hm).toBeGreaterThan(hh);
    expect(hm).toBeGreaterThan(hf);
  });
});

// ── .sf-center ──────────────────────────────────────────────────
test.describe('layout: .sf-center', () => {
  test('is horizontally centered with a positive max-inline-size', async ({ page }) => {
    // margin-inline: auto computes to pixels; verify via bounding boxes.
    await setup(page, `
      <div id="wrap" style="width:1400px">
        <div id="t" class="sf-center">content</div>
      </div>
    `);
    const result = await page.evaluate(() => {
      const wrap  = document.getElementById('wrap').getBoundingClientRect();
      const el    = document.getElementById('t').getBoundingClientRect();
      const maxIs = parseFloat(getComputedStyle(document.getElementById('t')).maxInlineSize);
      return { left: el.left - wrap.left, right: wrap.right - el.right, maxIs };
    });
    expect(result.maxIs).toBeGreaterThan(0);
    expect(Math.abs(result.left - result.right)).toBeLessThan(2);
  });

  test('--intrinsic adds flex column with align-items: center', async ({ page }) => {
    await setup(page, `<div id="t" class="sf-center sf-center--intrinsic"><p>x</p></div>`);
    const cs = await page.locator('#t').evaluate(el => ({
      display: getComputedStyle(el).display,
      align:   getComputedStyle(el).alignItems,
    }));
    expect(cs.display).toBe('flex');
    expect(cs.align).toBe('center');
  });
});

// ── .sf-box ─────────────────────────────────────────────────────
test.describe('layout: .sf-box', () => {
  test('has non-zero padding', async ({ page }) => {
    await setup(page, `<div id="t" class="sf-box">x</div>`);
    const p = await page.locator('#t').evaluate(el => parseFloat(getComputedStyle(el).padding));
    expect(p).toBeGreaterThan(0);
  });
});

// ── .sf-divider ─────────────────────────────────────────────────
test.describe('layout: .sf-divider', () => {
  test('renders a visible block-start border', async ({ page }) => {
    await setup(page, `<div id="t" class="sf-divider"></div>`);
    const bw = await page.locator('#t').evaluate(el =>
      parseFloat(getComputedStyle(el).borderBlockStartWidth)
    );
    expect(bw).toBeGreaterThan(0);
  });

  test('--vertical uses inline-start border instead', async ({ page }) => {
    await setup(page, `<div id="t" class="sf-divider sf-divider--vertical" style="align-self:stretch"></div>`);
    const cs = await page.locator('#t').evaluate(el => ({
      block:  parseFloat(getComputedStyle(el).borderBlockStartWidth),
      inline: parseFloat(getComputedStyle(el).borderInlineStartWidth),
    }));
    expect(cs.inline).toBeGreaterThan(0);
    expect(cs.block).toBe(0);
  });

  test('spans its container width in normal (block) flow', async ({ page }) => {
    await setup(page, `<div style="inline-size:400px"><hr id="t" class="sf-divider"></div>`);
    const w = await page.locator('#t').evaluate(el => el.getBoundingClientRect().width);
    expect(w).toBeGreaterThan(300);
  });

  test('--vertical stays a narrow rule inside a flex row, not stretched to the row width', async ({ page }) => {
    await setup(page, `
      <div style="display:flex;inline-size:400px">
        <span>Left</span>
        <hr id="t" class="sf-divider sf-divider--vertical">
        <span>Right</span>
      </div>
    `);
    const w = await page.locator('#t').evaluate(el => el.getBoundingClientRect().width);
    expect(w).toBeLessThan(20);
  });
});

// ── .sf-divide ──────────────────────────────────────────────────
test.describe('layout: .sf-divide', () => {
  test('places a border only between children, not before the first', async ({ page }) => {
    await setup(page, `
      <div id="t" class="sf-divide">
        <p id="first">one</p>
        <p id="second">two</p>
      </div>
    `);
    const bw = await page.evaluate(() => ({
      first:  parseFloat(getComputedStyle(document.getElementById('first')).borderBlockStartWidth),
      second: parseFloat(getComputedStyle(document.getElementById('second')).borderBlockStartWidth),
    }));
    expect(bw.first).toBe(0);
    expect(bw.second).toBeGreaterThan(0);
  });

  test('--vertical uses an inline-start border instead', async ({ page }) => {
    await setup(page, `
      <div id="t" class="sf-divide sf-divide--vertical">
        <span id="first">one</span>
        <span id="second">two</span>
      </div>
    `);
    const cs = await page.evaluate(() => {
      const el = document.getElementById('second');
      return {
        block:  parseFloat(getComputedStyle(el).borderBlockStartWidth),
        inline: parseFloat(getComputedStyle(el).borderInlineStartWidth),
      };
    });
    expect(cs.inline).toBeGreaterThan(0);
    expect(cs.block).toBe(0);
  });
});

// ── .sf-imposter ────────────────────────────────────────────────
test.describe('layout: .sf-imposter', () => {
  test('is position: absolute and visually centered in its parent', async ({ page }) => {
    // inset 50% computes to pixel values; verify via bounding boxes.
    await setup(page, `
      <div id="wrap" style="position:relative; width:200px; height:200px">
        <div id="t" class="sf-imposter" style="width:50px; height:50px">center</div>
      </div>
    `);
    const result = await page.evaluate(() => {
      const wrap = document.getElementById('wrap').getBoundingClientRect();
      const el   = document.getElementById('t').getBoundingClientRect();
      return {
        pos:    getComputedStyle(document.getElementById('t')).position,
        // After translate(-50%,-50%) the element should be centered
        centerX: el.left + el.width  / 2,
        centerY: el.top  + el.height / 2,
        wrapCX:  wrap.left + wrap.width  / 2,
        wrapCY:  wrap.top  + wrap.height / 2,
      };
    });
    expect(result.pos).toBe('absolute');
    expect(Math.abs(result.centerX - result.wrapCX)).toBeLessThan(2);
    expect(Math.abs(result.centerY - result.wrapCY)).toBeLessThan(2);
  });
});

// ── .sf-bento ───────────────────────────────────────────────────
test.describe('layout: .sf-bento', () => {
  test('is CSS grid with dense auto-flow', async ({ page }) => {
    await setup(page, `
      <div id="t" style="container-type:inline-size; width:1000px">
        <div id="g" class="sf-bento"><div>A</div><div>B</div><div>C</div></div>
      </div>
    `);
    const cs = await page.locator('#g').evaluate(el => ({
      display: getComputedStyle(el).display,
      flow:    getComputedStyle(el).gridAutoFlow,
    }));
    expect(cs.display).toBe('grid');
    expect(cs.flow).toContain('dense');
  });

  test('--2 sets 2 explicit columns', async ({ page }) => {
    await setup(page, `
      <div style="container-type:inline-size; width:900px">
        <div id="g" class="sf-bento sf-bento--2"><div>A</div><div>B</div></div>
      </div>
    `);
    const cols = await page.locator('#g').evaluate(el =>
      getComputedStyle(el).gridTemplateColumns.split(' ').length
    );
    expect(cols).toBe(2);
  });

  // .sf-bento's own @container breakpoints must resolve against an ANCESTOR
  // container, not itself — a size container cannot be the subject of its
  // own @container query (SL-034); .sf-bento used to declare `container`
  // on itself, which made these breakpoints a permanent silent no-op at
  // every viewport, mobile included.
  test('collapses to 1 column below the mobile breakpoint (ancestor container)', async ({ page }) => {
    await setup(page, `
      <div style="container-type:inline-size; width:300px">
        <div id="g" class="sf-bento"><div>A</div><div>B</div></div>
      </div>
    `);
    const cols = await page.locator('#g').evaluate(el =>
      getComputedStyle(el).gridTemplateColumns.split(' ').length
    );
    expect(cols).toBe(1);
  });

  test('a spanning child does not force a phantom 2nd column at the mobile breakpoint', async ({ page }) => {
    await setup(page, `
      <div style="container-type:inline-size; width:300px">
        <div class="sf-bento">
          <div id="w" class="sf-bento-wide">wide</div>
          <div>B</div>
        </div>
      </div>
    `);
    const [gridWidth, itemWidth] = await Promise.all([
      page.locator('.sf-bento').evaluate(el => el.getBoundingClientRect().width),
      page.locator('#w').evaluate(el => el.getBoundingClientRect().width),
    ]);
    expect(itemWidth).toBeLessThanOrEqual(gridWidth + 1);
  });

  test('--featured (span 2/2) also does not force a phantom 2nd column at the mobile breakpoint', async ({ page }) => {
    await setup(page, `
      <div style="container-type:inline-size; width:300px">
        <div class="sf-bento">
          <div id="f" class="sf-bento-featured">featured</div>
          <div>B</div>
        </div>
      </div>
    `);
    const [gridWidth, itemWidth] = await Promise.all([
      page.locator('.sf-bento').evaluate(el => el.getBoundingClientRect().width),
      page.locator('#f').evaluate(el => el.getBoundingClientRect().width),
    ]);
    expect(itemWidth).toBeLessThanOrEqual(gridWidth + 1);
  });

  test('uses the wider column count once past the mobile breakpoint', async ({ page }) => {
    await setup(page, `
      <div style="container-type:inline-size; width:1600px">
        <div id="g" class="sf-bento"><div>A</div><div>B</div></div>
      </div>
    `);
    const cols = await page.locator('#g').evaluate(el =>
      getComputedStyle(el).gridTemplateColumns.split(' ').length
    );
    expect(cols).toBeGreaterThan(1);
  });

  // `em` inside an @container condition resolves against the container's
  // (fluid, viewport-driven) inherited font-size here — not a fixed 16px —
  // so the effective pixel breakpoint isn't identical across engines. 750px
  // sits comfortably between every observed 30em/48em interpretation; 900px
  // was measured to land right on that boundary and flipped between 2 and 4
  // columns depending on the browser (see the grid-cols-4 test below).
  test('uses 2 columns in the mid-range between 30em and 48em', async ({ page }) => {
    await setup(page, `
      <div style="container-type:inline-size; width:750px">
        <div id="g" class="sf-bento"><div>A</div><div>B</div></div>
      </div>
    `);
    const cols = await page.locator('#g').evaluate(el =>
      getComputedStyle(el).gridTemplateColumns.split(' ').length
    );
    expect(cols).toBe(2);
  });
});

// ── .sf-grid-cols-2/3/4/6 ──────────────────────────────────────────
test.describe('layout: .sf-grid-cols-2/3/4/6', () => {
  // Same SL-034 constraint as .sf-bento above: these used to establish and
  // then query their own container, so the breakpoint below was dead code
  // at every viewport — only an ancestor container makes it fire.
  // A width of 900px (56.25em at a fixed 16px basis) originally lived here
  // and was flaky in CI: `em` inside an @container condition resolves
  // against the container's inherited font-size, which here is the fluid
  // `--sf-text-m` (~19px at this viewport, not 16px), and engines don't
  // agree on the resulting effective breakpoint down to the pixel — 900px
  // sat close enough to the 48em boundary that Chromium read it as past the
  // breakpoint while Firefox/WebKit read it as short of it. 1600px clears
  // every observed interpretation.
  test('resolves its column count against an ancestor container, not itself', async ({ page }) => {
    await setup(page, `
      <div style="container-type:inline-size; width:1600px">
        <div id="g" class="sf-grid-cols-4"><div>1</div><div>2</div><div>3</div><div>4</div></div>
      </div>
    `);
    const cols = await page.locator('#g').evaluate(el =>
      getComputedStyle(el).gridTemplateColumns.split(' ').length
    );
    expect(cols).toBe(4);
  });

  test('stays 1 column below the breakpoint', async ({ page }) => {
    await setup(page, `
      <div style="container-type:inline-size; width:300px">
        <div id="g" class="sf-grid-cols-4"><div>1</div><div>2</div><div>3</div><div>4</div></div>
      </div>
    `);
    const cols = await page.locator('#g').evaluate(el =>
      getComputedStyle(el).gridTemplateColumns.split(' ').length
    );
    expect(cols).toBe(1);
  });

  // Below 30em NEITHER @container rule matches, so gridTemplateColumns falls
  // back to the unset "none" (still 1 "column" by construction) — the case
  // above alone can't distinguish a working ancestor container from a
  // completely absent one. This mid-range case only passes if the 30em
  // breakpoint's ancestor-container query actually fired.
  test('uses the 2-column mid breakpoint between 30em and 48em', async ({ page }) => {
    await setup(page, `
      <div style="container-type:inline-size; width:750px">
        <div id="g" class="sf-grid-cols-4"><div>1</div><div>2</div><div>3</div><div>4</div></div>
      </div>
    `);
    const cols = await page.locator('#g').evaluate(el =>
      getComputedStyle(el).gridTemplateColumns.split(' ').length
    );
    expect(cols).toBe(2);
  });
});

// ── .sf-alternate ───────────────────────────────────────────────
test.describe('layout: .sf-alternate', () => {
  test('is CSS grid that establishes sf-alternate container', async ({ page }) => {
    await setup(page, `<div id="t" class="sf-alternate" style="width:600px"><div>A</div></div>`);
    const cs = await page.locator('#t').evaluate(el => ({
      display: getComputedStyle(el).display,
      cn:      getComputedStyle(el).containerName,
    }));
    expect(cs.display).toBe('grid');
    expect(cs.cn).toContain('sf-alternate');
  });
});

// ── .sf-content-grid ────────────────────────────────────────────
test.describe('layout: .sf-content-grid', () => {
  test('default children land in the content column', async ({ page }) => {
    await setup(page, `
      <div id="t" class="sf-content-grid" style="width:1200px">
        <div id="c">content</div>
      </div>
    `);
    const col = await page.locator('#c').evaluate(el => getComputedStyle(el).gridColumn);
    expect(col).toMatch(/content/);
  });

  test('.sf-breakout spans the breakout column', async ({ page }) => {
    await setup(page, `
      <div class="sf-content-grid" style="width:1200px">
        <div id="b" class="sf-breakout">breakout</div>
      </div>
    `);
    const col = await page.locator('#b').evaluate(el => getComputedStyle(el).gridColumn);
    expect(col).toMatch(/breakout/);
  });

  test('.sf-full-bleed spans the full column', async ({ page }) => {
    await setup(page, `
      <div class="sf-content-grid" style="width:1200px">
        <div id="f" class="sf-full-bleed">full</div>
      </div>
    `);
    const col = await page.locator('#f').evaluate(el => getComputedStyle(el).gridColumn);
    expect(col).toMatch(/full/);
  });

  // .sf-content-grid establishes its own inline-size query container, at parity
  // with .sf-container. Before this, switching a section wrapper from
  // .sf-container to .sf-content-grid (to get breakout/full-bleed) silently
  // removed the CQ scope that .sf-grid-cols-* / .sf-bento depend on, leaving
  // them stuck at their 1-column fallback at every width.
  test('establishes an inline-size query container', async ({ page }) => {
    await setup(page, `<div id="t" class="sf-content-grid">x</div>`);
    const ct = await page.locator('#t').evaluate(el => getComputedStyle(el).containerType);
    expect(ct).toContain('inline-size');
  });

  test('a .sf-grid-cols-* child responds to the content grid as its CQ ancestor', async ({ page }) => {
    await setup(page, `
      <div class="sf-content-grid" style="width:1200px">
        <div id="g" class="sf-grid-cols-3"><div>1</div><div>2</div><div>3</div></div>
      </div>
    `);
    const cols = await page.locator('#g').evaluate(el =>
      getComputedStyle(el).gridTemplateColumns.trim().split(/\s+/).length
    );
    expect(cols).toBe(3);
  });

  test('becoming a CQ container does not shrink full-bleed reach', async ({ page }) => {
    await setup(page, `
      <div id="cg" class="sf-content-grid" style="width:1200px">
        <div id="f" class="sf-full-bleed">full</div>
        <div id="c">content</div>
      </div>
    `);
    const res = await page.evaluate(() => {
      const cg = document.getElementById('cg').getBoundingClientRect();
      const f  = document.getElementById('f').getBoundingClientRect();
      const c  = document.getElementById('c').getBoundingClientRect();
      return { cgW: cg.width, fW: f.width, cW: c.width };
    });
    // full-bleed still spans the whole grid; the content track stays narrower.
    expect(Math.abs(res.fW - res.cgW)).toBeLessThan(1);
    expect(res.cW).toBeLessThan(res.fW);
  });
});

// ── .sf-subgrid ─────────────────────────────────────────────────
test.describe('layout: .sf-subgrid', () => {
  test('uses subgrid for columns', async ({ page }) => {
    await setup(page, `
      <div class="sf-content-grid" style="width:1200px">
        <div id="t" class="sf-subgrid" style="grid-column:full">x</div>
      </div>
    `);
    const cols = await page.locator('#t').evaluate(el => getComputedStyle(el).gridTemplateColumns);
    expect(cols).toContain('subgrid');
  });
});

// ── .sf-icon ────────────────────────────────────────────────────
test.describe('layout: .sf-icon', () => {
  test('is inline-block with equal inline and block size', async ({ page }) => {
    await setup(page, `<span id="t" class="sf-icon">★</span>`);
    const cs = await page.locator('#t').evaluate(el => ({
      display: getComputedStyle(el).display,
      w:       getComputedStyle(el).inlineSize,
      h:       getComputedStyle(el).blockSize,
    }));
    expect(cs.display).toBe('inline-block');
    expect(cs.w).toBe(cs.h);
  });

  test('size modifier --l is larger than --s', async ({ page }) => {
    await setup(page, `
      <span id="s" class="sf-icon sf-icon--s">★</span>
      <span id="l" class="sf-icon sf-icon--l">★</span>
    `);
    const [ws, wl] = await Promise.all([
      page.locator('#s').evaluate(el => parseFloat(getComputedStyle(el).inlineSize)),
      page.locator('#l').evaluate(el => parseFloat(getComputedStyle(el).inlineSize)),
    ]);
    expect(wl).toBeGreaterThan(ws);
  });

  test('--boxed adds padding around the icon', async ({ page }) => {
    await setup(page, `<span id="t" class="sf-icon sf-icon--boxed">★</span>`);
    const p = await page.locator('#t').evaluate(el => parseFloat(getComputedStyle(el).padding));
    expect(p).toBeGreaterThan(0);
  });
});

// ── .sf-grid-flex ───────────────────────────────────────────────
test.describe('layout: .sf-grid-flex', () => {
  const FIVE = (cls = '') => `
    <div id="t" class="sf-grid-flex ${cls}" style="width:640px; --sf-grid-min: 200px">
      <div>1</div><div>2</div><div>3</div><div>4</div><div id="last">5</div>
    </div>
  `;

  test('wraps into rows and stretches last-row leftovers by default', async ({ page }) => {
    await setup(page, FIVE());
    const res = await page.locator('#t').evaluate(el => {
      const kids = [...el.children];
      const rows = new Set(kids.map(k => k.offsetTop)).size;
      const last = kids[kids.length - 1];
      return { rows, lastWidth: last.getBoundingClientRect().width, hostWidth: el.clientWidth };
    });
    // 5 items at min 200px in 640px → 3 rows (2+2+1); the orphan fills its row.
    expect(res.rows).toBe(3);
    expect(res.lastWidth).toBeGreaterThan(res.hostWidth * 0.9);
  });

  test('--center keeps leftover items fixed-width and centered', async ({ page }) => {
    await setup(page, FIVE('sf-grid-flex--center'));
    const res = await page.locator('#t').evaluate(el => {
      const last = el.querySelector('#last').getBoundingClientRect();
      const host = el.getBoundingClientRect();
      const centerDelta = Math.abs((last.left - host.left) - (host.right - last.right));
      return { lastWidth: last.width, centerDelta };
    });
    expect(res.lastWidth).toBeLessThan(320);   // fixed basis, not stretched
    expect(res.centerDelta).toBeLessThan(1);   // horizontally centered in the host
  });

  test('size modifiers re-point --sf-grid-min', async ({ page }) => {
    await setup(page, `
      <div id="t" class="sf-grid-flex sf-grid-flex--xs" style="width:640px">
        <div id="k">x</div><div>y</div><div>z</div><div>w</div>
      </div>
    `);
    const min = await page.locator('#t').evaluate(el =>
      getComputedStyle(el).getPropertyValue('--sf-grid-min').trim());
    expect(min).toBe('10rem');
  });

  test('gap comes from --sf-grid-gap', async ({ page }) => {
    await setup(page, `
      <div id="t" class="sf-grid-flex" style="width:640px; --sf-grid-gap: 17px">
        <div>x</div><div>y</div>
      </div>
    `);
    const gap = await page.locator('#t').evaluate(el => getComputedStyle(el).columnGap);
    expect(gap).toBe('17px');
  });
});
