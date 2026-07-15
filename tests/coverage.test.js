/**
 * Framework coverage gate for the consolidated demo (demo/index.html).
 *
 * demo/index.html is SLASHED's single demo + coverage surface. Its
 * "Full API coverage" section embeds a machine-generated inventory of every
 * design token and every documented class, alongside the hand-authored,
 * visually-tested sections. These tests assert that inventory stays complete:
 *
 *  1. every .sf-* / .sf-is-* selector from core/*.css appears in the demo
 *     (guards against the F-14 regression — a selector shipped without demo
 *     coverage);
 *  2. every token in docs/api-index.json appears in the demo;
 *  3. the embedded #cov-data token list is EXACTLY the current API token set
 *     (no stale/removed tokens linger — folds in the old
 *     docs-artifacts-sync token-reference check).
 *
 * Run: node --test tests/coverage.test.js
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DEMO_PATH = path.join(ROOT, 'demo', 'index.html');
const API_INDEX_PATH = path.join(ROOT, 'docs', 'api-index.json');

const demoContent = fs.readFileSync(DEMO_PATH, 'utf8');

describe('Selector coverage', () => {
  test('every .sf-* and .sf-is-* class from core/*.css appears in demo/index.html', () => {
    const coreDir = path.join(ROOT, 'core');

    // Read all core CSS files
    const cssFiles = fs.readdirSync(coreDir).filter(f => f.endsWith('.css'));
    const allCSS = cssFiles.map(f => fs.readFileSync(path.join(coreDir, f), 'utf8')).join('\n');

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
      // Check if the class name appears in the demo (class attribute value,
      // the coverage reference list, or descriptive text)
      if (!demoContent.includes(sel)) {
        missing.push(sel);
      }
    }

    if (missing.length > 0) {
      console.log('Missing from demo/index.html:', missing.sort().join(', '));
    }
    assert.deepEqual(missing, []);
  });
});

describe('Token coverage', () => {
  const apiTokens = JSON.parse(fs.readFileSync(API_INDEX_PATH, 'utf8'))
    .entries
    .filter(e => e.type === 'token')
    .map(e => e.name);

  test('every token in docs/api-index.json appears in demo/index.html', () => {
    const missing = apiTokens.filter(name => !demoContent.includes(name));
    if (missing.length > 0) {
      console.log('Tokens missing from demo/index.html:', missing.sort().join(', '));
    }
    assert.deepEqual(missing, []);
  });

  test('embedded #cov-data token list equals the current API token set', () => {
    const m = demoContent.match(/<script type="application\/json" id="cov-data">([\s\S]*?)<\/script>/);
    assert.ok(m, 'demo/index.html must embed <script id="cov-data">…</script>');
    const embedded = JSON.parse(m[1]).tokens;
    assert.deepEqual([...embedded].sort(), [...apiTokens].sort());
  });
});
