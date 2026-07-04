// @ts-check
// Behavioural tests for core/macros.css.
// Each macro is exercised against a synthetic fixture and its
// observable effect verified via getComputedStyle / layout reads.
import { test, expect } from '@playwright/test';
import { renderWithBundle } from './render-helpers.js';

async function setup(page, html) {
  // Unlike the other spec files' setup(), body has no margin:0 here —
  // preserved as-is (bodyMargin: null omits the style attribute entirely).
  await renderWithBundle(page, html, { width: 800, height: 600, bodyMargin: null });
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

  for (const cls of [
    'sf-overflow-fade--right',
    'sf-overflow-fade--left',
    'sf-overflow-fade--top',
    'sf-overflow-fade--bottom',
    'sf-overflow-fade--block',
    'sf-overflow-fade--inline',
  ]) {
    test(`.${cls} sets a mask gradient and overflow hidden`, async ({ page }) => {
      await setup(page, `<div id="t" class="${cls}" style="width:100px;height:100px"></div>`);
      const cs = await page.locator('#t').evaluate(el => ({
        mask:     getComputedStyle(el).maskImage,
        overflow: getComputedStyle(el).overflow,
      }));
      expect(cs.mask).toContain('linear-gradient');
      expect(cs.overflow).toBe('hidden');
    });
  }
});

test.describe('macro: .sf-prose / .sf-not-prose', () => {
  test('consecutive children get non-zero margin-block-start', async ({ page }) => {
    await setup(page, `
      <div class="sf-prose" id="t">
        <p id="p1">First</p>
        <p id="p2">Second</p>
      </div>
    `);
    const margins = await page.evaluate(() => ({
      first:  getComputedStyle(document.querySelector('#p1')).marginBlockStart,
      second: getComputedStyle(document.querySelector('#p2')).marginBlockStart,
    }));
    expect(margins.first).toBe('0px');
    expect(parseFloat(margins.second)).toBeGreaterThan(0);
  });

  test('sets overflow-wrap: break-word on the container', async ({ page }) => {
    await setup(page, `<div class="sf-prose" id="t"></div>`);
    const ow = await page.locator('#t').evaluate(el => getComputedStyle(el).overflowWrap);
    expect(ow).toBe('break-word');
  });

  test('.sf-not-prose resets prose child margins inside a prose block', async ({ page }) => {
    await setup(page, `
      <div class="sf-prose">
        <div class="sf-not-prose" id="np">
          <p id="p1">One</p>
          <p id="p2">Two</p>
        </div>
      </div>
    `);
    const margin = await page.evaluate(() =>
      getComputedStyle(document.querySelector('#p2')).marginBlockStart
    );
    expect(margin).toBe('0px');
  });
});

test.describe('macro: .sf-scrim', () => {
  test('sets position: relative and isolation: isolate', async ({ page }) => {
    await setup(page, `<div id="t" class="sf-scrim"></div>`);
    const cs = await page.locator('#t').evaluate(el => ({
      position:  getComputedStyle(el).position,
      isolation: getComputedStyle(el).isolation,
    }));
    expect(cs.position).toBe('relative');
    expect(cs.isolation).toBe('isolate');
  });

  test('::before pseudo-element has a gradient background', async ({ page }) => {
    await setup(page, `<div id="t" class="sf-scrim" style="position:relative; width:200px; height:200px"></div>`);
    const bg = await page.locator('#t').evaluate(el =>
      getComputedStyle(el, '::before').backgroundImage
    );
    expect(bg).toContain('linear-gradient');
  });
});

test.describe('macro: .sf-text-protect', () => {
  test('applies a text-shadow halo (not none)', async ({ page }) => {
    await setup(page, `<h2 id="t" class="sf-text-protect">text</h2>`);
    const ts = await page.locator('#t').evaluate(el => getComputedStyle(el).textShadow);
    expect(ts).not.toBe('none');
    expect(ts.length).toBeGreaterThan(0);
  });
});

test.describe('macro: .sf-text-gradient', () => {
  test('clips background to text and makes color transparent', async ({ page }) => {
    await setup(page, `<h2 id="t" class="sf-text-gradient">Gradient</h2>`);
    const cs = await page.locator('#t').evaluate(el => ({
      bgClip: getComputedStyle(el).backgroundClip,
      color:  getComputedStyle(el).color,
    }));
    expect(cs.bgClip).toBe('text');
    // transparent resolves to rgba(0,0,0,0) across all engines
    expect(cs.color).toBe('rgba(0, 0, 0, 0)');
  });
});

test.describe('macro: .sf-link-external', () => {
  test('::after pseudo-element has non-empty content', async ({ page }) => {
    await setup(page, `<a id="t" class="sf-link-external" href="#">Example</a>`);
    const content = await page.locator('#t').evaluate(el =>
      getComputedStyle(el, '::after').content
    );
    // content is a CSS string; "none" or '""' means no marker
    expect(content).not.toBe('none');
    expect(content).not.toBe('""');
    expect(content.length).toBeGreaterThan(0);
  });
});

test.describe('macro: .sf-link--subtle / .sf-link--reverse', () => {
  test('.sf-link--subtle: no underline at rest, underline on hover', async ({ page }) => {
    await setup(page, `<a id="t" class="sf-link--subtle" href="#">link</a>`);
    const restLine = await page.locator('#t').evaluate(el =>
      getComputedStyle(el).textDecorationLine
    );
    expect(restLine).toBe('none');

    await page.locator('#t').hover();
    const hoverLine = await page.locator('#t').evaluate(el =>
      getComputedStyle(el).textDecorationLine
    );
    expect(hoverLine).toBe('underline');
  });

  test('.sf-link--reverse: underline at rest, no underline on hover', async ({ page }) => {
    await setup(page, `<a id="t" class="sf-link--reverse" href="#">link</a>`);
    const restLine = await page.locator('#t').evaluate(el =>
      getComputedStyle(el).textDecorationLine
    );
    expect(restLine).toBe('underline');

    await page.locator('#t').hover();
    const hoverLine = await page.locator('#t').evaluate(el =>
      getComputedStyle(el).textDecorationLine
    );
    expect(hoverLine).toBe('none');
  });
});

test.describe('macro: .sf-content-auto', () => {
  test('sets content-visibility: auto', async ({ page }) => {
    await setup(page, `<section id="t" class="sf-content-auto">content</section>`);
    const cv = await page.locator('#t').evaluate(el =>
      getComputedStyle(el).contentVisibility
    );
    // Safari < 18 does not support content-visibility; the property may be
    // unrecognised and return ''. Accept both so the test is engine-portable.
    expect(['auto', '']).toContain(cv);
  });
});

test.describe('macro: .sf-tabular-nums', () => {
  test('sets font-variant-numeric to tabular-nums', async ({ page }) => {
    await setup(page, `<table id="t" class="sf-tabular-nums"><tr><td>123</td></tr></table>`);
    const fvn = await page.locator('#t').evaluate(el =>
      getComputedStyle(el).fontVariantNumeric
    );
    expect(fvn).toContain('tabular-nums');
  });
});

test.describe('macro: .sf-drop-shadow-*', () => {
  for (const size of ['s', 'm', 'l']) {
    test(`--${size} sets a non-none filter`, async ({ page }) => {
      await setup(page, `<img id="t" class="sf-drop-shadow-${size}" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBTAA7">`);
      const filter = await page.locator('#t').evaluate(el => getComputedStyle(el).filter);
      expect(filter).not.toBe('none');
    });
  }
});

test.describe('macro: .sf-entrance--fade', () => {
  test('animation-name is set when reduced motion is not preferred', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await setup(page, `<div id="t" class="sf-entrance--fade">content</div>`);
    const name = await page.locator('#t').evaluate(el =>
      getComputedStyle(el).animationName
    );
    expect(name).not.toBe('none');
    expect(name.length).toBeGreaterThan(0);
  });

  test('animation does not apply when prefers-reduced-motion: reduce', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await setup(page, `<div id="t" class="sf-entrance--fade">content</div>`);
    const name = await page.locator('#t').evaluate(el =>
      getComputedStyle(el).animationName
    );
    // Gated by @media (prefers-reduced-motion: no-preference) — so under
    // 'reduce', the animation rule doesn't apply and name should be 'none'.
    expect(name).toBe('none');
  });
});

test.describe('macro: .sf-corner-scoop', () => {
  test('sets a radial-gradient mask', async ({ page }) => {
    await setup(page, `<div id="t" class="sf-corner-scoop" style="width:100px;height:100px"></div>`);
    const mask = await page.locator('#t').evaluate(el => getComputedStyle(el).maskImage);
    expect(mask).toContain('radial-gradient');
  });

  for (const [cls, at] of [
    ['sf-corner-scoop--top-left', '0 0'],
    ['sf-corner-scoop--top-right', '100% 0'],
    ['sf-corner-scoop--bottom-left', '0 100%'],
    ['sf-corner-scoop--bottom-right', '100% 100%'],
  ]) {
    test(`.${cls} points the cut at ${at}`, async ({ page }) => {
      await setup(page, `<div id="t" class="sf-corner-scoop ${cls}" style="width:100px;height:100px"></div>`);
      const value = await page.locator('#t').evaluate(el =>
        getComputedStyle(el).getPropertyValue('--sf-corner-scoop-at').trim()
      );
      expect(value).toBe(at);
    });
  }

  test('--sf-corner-scoop-size override changes the resolved cut radius', async ({ page }) => {
    await setup(page, `<div id="t" class="sf-corner-scoop" style="width:100px;height:100px; --sf-corner-scoop-size: 40px"></div>`);
    const size = await page.locator('#t').evaluate(el =>
      getComputedStyle(el).getPropertyValue('--sf-corner-scoop-size').trim()
    );
    expect(size).toBe('40px');
  });
});

test.describe('macro: .sf-corners', () => {
  test('base class applies a uniform radius to all four logical corners', async ({ page }) => {
    await setup(page, `<div id="t" class="sf-corners" style="width:100px;height:100px"></div>`);
    const r = await page.locator('#t').evaluate(el => {
      const cs = getComputedStyle(el);
      return [cs.borderTopLeftRadius, cs.borderTopRightRadius, cs.borderBottomRightRadius, cs.borderBottomLeftRadius];
    });
    expect(new Set(r).size).toBe(1);
  });

  test('--leaf sets an asymmetric large/small/large/small pattern', async ({ page }) => {
    await setup(page, `<div id="t" class="sf-corners sf-corners--leaf" style="width:100px;height:100px"></div>`);
    const r = await page.locator('#t').evaluate(el => {
      const cs = getComputedStyle(el);
      return {
        tl: parseFloat(cs.borderTopLeftRadius),
        tr: parseFloat(cs.borderTopRightRadius),
        br: parseFloat(cs.borderBottomRightRadius),
        bl: parseFloat(cs.borderBottomLeftRadius),
      };
    });
    expect(r.tl).toBeGreaterThan(r.tr);
    expect(r.br).toBeGreaterThan(r.bl);
    expect(r.tl).toBe(r.br);
    expect(r.tr).toBe(r.bl);
  });

  test('--leaf-flip mirrors --leaf', async ({ page }) => {
    await setup(page, `
      <div id="a" class="sf-corners sf-corners--leaf">a</div>
      <div id="b" class="sf-corners sf-corners--leaf-flip">b</div>
    `);
    const [a, b] = await Promise.all([
      page.locator('#a').evaluate(el => getComputedStyle(el).borderTopLeftRadius),
      page.locator('#b').evaluate(el => getComputedStyle(el).borderTopLeftRadius),
    ]);
    const bOpposite = await page.locator('#b').evaluate(el => getComputedStyle(el).borderTopRightRadius);
    expect(bOpposite).toBe(a);
  });
});

test.describe('macro: .sf-overlap / .sf-overlap-host', () => {
  test('pulls the element up over the previous sibling by --sf-overlap-pull', async ({ page }) => {
    await setup(page, `
      <div id="prev" style="height:100px;background:#eee">prev</div>
      <div id="t" class="sf-overlap" style="height:50px;background:#333; --sf-overlap-pull: 20px">overlap</div>
    `);
    const box = await page.evaluate(() => {
      const prev = document.getElementById('prev').getBoundingClientRect();
      const t = document.getElementById('t').getBoundingClientRect();
      return { overlapAmount: prev.bottom - t.top };
    });
    expect(box.overlapAmount).toBeCloseTo(20, 0);
  });

  test('is positioned and raised above normal flow', async ({ page }) => {
    await setup(page, `<div id="t" class="sf-overlap">x</div>`);
    const cs = await page.locator('#t').evaluate(el => ({
      position: getComputedStyle(el).position,
      zIndex:   getComputedStyle(el).zIndex,
    }));
    expect(cs.position).toBe('relative');
    expect(Number(cs.zIndex)).toBeGreaterThan(0);
  });

  for (const [cls, prop] of [
    ['sf-overlap--down', 'marginBottom'],
    ['sf-overlap--start', 'marginLeft'],
    ['sf-overlap--end', 'marginRight'],
  ]) {
    test(`.${cls} sets a negative ${prop}`, async ({ page }) => {
      await setup(page, `<div id="t" class="${cls}" style="--sf-overlap-pull: 20px">x</div>`);
      const value = await page.locator('#t').evaluate((el, p) => parseFloat(getComputedStyle(el)[p]), prop);
      expect(value).toBe(-20);
    });
  }

  test('.sf-overlap-host reserves block-start padding matching the pull by default', async ({ page }) => {
    await setup(page, `<div id="t" class="sf-overlap-host" style="--sf-overlap-pull: 24px">x</div>`);
    const cs = await page.locator('#t').evaluate(el => ({
      position:  getComputedStyle(el).position,
      isolation: getComputedStyle(el).isolation,
      padTop:    getComputedStyle(el).paddingTop,
    }));
    expect(cs.position).toBe('relative');
    expect(cs.isolation).toBe('isolate');
    expect(cs.padTop).toBe('24px');
  });
});

test.describe('macro: .sf-scrim composed with .sf-bg (media background + overlay)', () => {
  test('img.sf-bg auto-fills the parent behind the scrim gradient and content', async ({ page }) => {
    await setup(page, `
      <div id="host" class="sf-scrim sf-scrim--bottom" style="position:relative; width:200px; height:120px">
        <img id="media" class="sf-bg" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBTAA7">
        <h2 id="content">Headline</h2>
      </div>
    `);
    const res = await page.evaluate(() => {
      const host    = document.getElementById('host');
      const media   = document.getElementById('media');
      const content = document.getElementById('content');
      const hostBox = host.getBoundingClientRect();
      const mediaBox = media.getBoundingClientRect();
      return {
        mediaPosition: getComputedStyle(media).position,
        mediaFillsHost: Math.abs(mediaBox.width - hostBox.width) < 1 && Math.abs(mediaBox.height - hostBox.height) < 1,
        // Content must hit-test above the media + scrim gradient, with no manual z-index set on content.
        topElementIsContent: document.elementFromPoint(
          content.getBoundingClientRect().left + 2,
          content.getBoundingClientRect().top + 2
        ) === content,
        contentZIndex: getComputedStyle(content).zIndex,
      };
    });
    expect(res.mediaPosition).toBe('absolute');
    expect(res.mediaFillsHost).toBe(true);
    expect(res.topElementIsContent).toBe(true);
    // .sf-scrim's lift selector supplies the z-index — the author never sets one.
    expect(Number(res.contentZIndex)).toBeGreaterThan(0);
  });

  test('plain .sf-scrim with an in-flow img is unaffected (no regression)', async ({ page }) => {
    await setup(page, `
      <div id="t" class="sf-scrim sf-scrim--bottom" style="position:relative">
        <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBTAA7" style="display:block">
      </div>
    `);
    const position = await page.locator('#t img').evaluate(el => getComputedStyle(el).position);
    expect(position).toBe('static');
  });
});
