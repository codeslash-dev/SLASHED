/**
 * Property 7: After stripping @supports blocks from the built bundle,
 * no ungated declarations contain light-dark(), oklch(from…), or color-mix().
 *
 * This is the build-time complement to tier1-p2-coverage.test.js (which
 * checks the same invariant at source level). P7 verifies the invariant
 * holds in the final built artifact after bundling and minification.
 *
 * Run: node --test tests/tier1-p7-oldengine.test.js
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs   from 'node:fs';
import path from 'node:path';
import fc   from 'fast-check';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'badges/slashed.full.css');

/**
 * Simulate an engine with no @supports by stripping all @supports blocks.
 * Returns only declarations that survive (ungated ones).
 */
function stripSupports(css) {
  let result = '';
  let depth = 0;
  let inSupports = false;
  let supportsDepth = 0;
  for (const line of css.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('@supports')) {
      inSupports = true;
      supportsDepth = depth;
    }
    if (!inSupports) result += line + '\n';
    for (const ch of line) {
      if (ch === '{') depth++;
      else if (ch === '}') {
        depth--;
        if (inSupports && depth <= supportsDepth) inSupports = false;
      }
    }
  }
  return result;
}

function extractCustomDecls(css) {
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const decls = new Map();
  for (const m of stripped.matchAll(/(--sf-[\w-]+)\s*:\s*([^;]+);/g)) {
    decls.set(m[1], m[2].replace(/\s+/g, ' ').trim());
  }
  return decls;
}

const CHECKED_TOKENS = [
  '--sf-color-primary', '--sf-color-secondary', '--sf-color-action',
  '--sf-color-neutral', '--sf-color-base', '--sf-color-text',
  '--sf-color-border', '--sf-color-success', '--sf-color-warning',
  '--sf-color-danger',
];

describe('P7: @supports gating — no modern expressions in ungated bundle declarations', () => {
  let oldEngineDecls;

  test('setup: build artifact exists and @supports stripping yields declarations', () => {
    assert.ok(fs.existsSync(DIST), 'badges/slashed.full.css missing — run npm run build first');
    const css = fs.readFileSync(DIST, 'utf8');
    const stripped = stripSupports(css);
    oldEngineDecls = extractCustomDecls(stripped);
    assert.ok(oldEngineDecls.size > 0, 'No declarations survived @supports stripping');
  });

  test('no light-dark() survives @supports stripping', () => {
    const violations = [...oldEngineDecls.entries()]
      .filter(([, v]) => v.includes('light-dark'));
    if (violations.length > 0) {
      assert.fail('Ungated light-dark() in bundle: ' + violations.map(([k]) => k).join(', '));
    }
  });

  test('no oklch(from…) survives @supports stripping', () => {
    const violations = [...oldEngineDecls.entries()]
      .filter(([, v]) => v.includes('oklch(from'));
    if (violations.length > 0) {
      assert.fail('Ungated oklch(from…) in bundle: ' + violations.map(([k]) => k).join(', '));
    }
  });

  test('no color-mix() in core semantic tokens survives @supports stripping', () => {
    const CORE = /^--sf-color-(?!.+-\d{2,3}$|.+-a\d+$)/;
    const violations = [...oldEngineDecls.entries()]
      .filter(([k, v]) => CORE.test(k) && v.includes('color-mix('));
    if (violations.length > 0) {
      assert.fail('Ungated color-mix() in core tokens: ' + violations.map(([k]) => k).join(', '));
    }
  });

  // fast-check: random sample from the checked set — none contain modern expressions
  test('fast-check: sampled core tokens have no modern expressions when ungated (100 iterations)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: CHECKED_TOKENS.length - 1 }),
        (idx) => {
          const val = oldEngineDecls.get(CHECKED_TOKENS[idx]) ?? '';
          return !val.includes('light-dark') &&
                 !val.includes('oklch(from') &&
                 !val.includes('color-mix(');
        }
      ),
      { numRuns: 100 }
    );
  });
});
