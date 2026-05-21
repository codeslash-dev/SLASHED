// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

/**
 * Selector inventory coverage test.
 *
 * Parses all .sf-* and .is-* selectors from core/*.css, then verifies
 * each appears at least once in docs/demo.html. This eliminates future
 * regressions of the F-14 type (selectors shipped without demo coverage).
 *
 * INTENTIONALLY EXCLUDED:
 * - Internal compound selectors (e.g. .sf-modal.is-open used only as
 *   an example in comments, .sf-nav .is-current — component-layer refs)
 * - BEM children (.sf-cover__center) — checked by their parent
 * - Selectors that only exist in comments
 */
test.describe('Selector coverage', () => {
  test('every .sf-* and .is-* class from core/*.css appears in docs/demo.html', async () => {
    const coreDir = path.resolve(process.cwd(), 'core');
    const demoPath = path.resolve(process.cwd(), 'docs', 'demo.html');

    // Read all core CSS files
    const cssFiles = fs.readdirSync(coreDir).filter(f => f.endsWith('.css'));
    const allCSS = cssFiles.map(f => fs.readFileSync(path.join(coreDir, f), 'utf8')).join('\n');

    // Read demo.html
    const demoContent = fs.readFileSync(demoPath, 'utf8');

    // Extract all class selectors (.sf-* and .is-*) from CSS rules (not comments)
    // Remove CSS comments first
    const cssNoComments = allCSS.replace(/\/\*[\s\S]*?\*\//g, '');

    const selectorRegex = /\.(sf-[a-z0-9_-]+|is-[a-z0-9_-]+)/g;
    const selectors = new Set();
    let match;
    while ((match = selectorRegex.exec(cssNoComments)) !== null) {
      selectors.add(match[1]); // without the dot
    }

    // Classes that are intentionally internal / compound-only and don't need
    // their own standalone demo occurrence. Document why each is excluded.
    const EXCLUDED = new Set([
      // BEM child — demoed via parent .sf-cover
      'sf-cover__center',
      // Component-layer reference selectors — only used in CSS comments
      // or as compound selectors that require the component layer
      'sf-modal',
      'sf-nav',
      // .is-visible is the logical inverse of .is-invisible — not separately demoed
      'is-visible',
    ]);

    const missing = [];
    for (const sel of selectors) {
      if (EXCLUDED.has(sel)) continue;
      // Check if the class name appears in demo.html (as class attribute value or in text)
      if (!demoContent.includes(sel)) {
        missing.push(sel);
      }
    }

    if (missing.length > 0) {
      console.log('Missing from demo.html:', missing.sort().join(', '));
    }
    expect(missing).toEqual([]);
  });
});
