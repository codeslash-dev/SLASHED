/**
 * Selector inventory coverage test.
 *
 * Parses all .sf-* and .sf-is-* selectors from core/*.css, then verifies
 * each appears at least once in docs/demo.html. This eliminates future
 * regressions of the F-14 type (selectors shipped without demo coverage).
 *
 * INTENTIONALLY EXCLUDED:
 * - Internal compound selectors (e.g. .sf-modal.sf-is-open used only as
 *   an example in comments, .sf-nav .sf-is-current — component-layer refs)
 * - BEM children (.sf-cover__center) — checked by their parent
 * - Selectors that only exist in comments
 *
 * Run: node --test tests/coverage.test.js
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');

describe('Selector coverage', () => {
  test('every .sf-* and .sf-is-* class from core/*.css appears in docs/demo.html', () => {
    const coreDir = path.join(ROOT, 'core');
    const demoPath = path.join(ROOT, 'docs', 'demo.html');

    // Read all core CSS files
    const cssFiles = fs.readdirSync(coreDir).filter(f => f.endsWith('.css'));
    const allCSS = cssFiles.map(f => fs.readFileSync(path.join(coreDir, f), 'utf8')).join('\n');

    // Read demo.html
    const demoContent = fs.readFileSync(demoPath, 'utf8');

    // Extract all class selectors (.sf-* and .sf-is-*) from CSS rules (not comments)
    // Remove CSS comments first
    const cssNoComments = allCSS.replace(/\/\*[\s\S]*?\*\//g, '');

    const selectorRegex = /\.(sf-[a-z0-9_-]+|sf-is-[a-z0-9_-]+)/g;
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
    assert.deepEqual(missing, []);
  });
});
