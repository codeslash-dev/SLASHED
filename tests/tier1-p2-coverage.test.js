/**
 * Property 2: every CSS source file @supports-gates its modern colour
 *             expressions — no bare light-dark(), oklch(from…) or color-mix()
 *             declaration sits outside an @supports block.
 *
 * This is the source-level complement to tier1-p7-oldengine.test.js (which
 * proves the same invariant on the built, bundled+minified artifact). P2 gives
 * the early, per-file signal; both share one robust scanner
 * (tests/supports-helpers.js) so they can never drift apart.
 *
 * Coverage: ALL of core/*.css and optional/*.css — not just tokens.css. A
 * modern expression used directly in a component/utility rule (e.g.
 * `background: color-mix(...)`) is caught here, not only in colour tokens.
 *
 * The P2/P7/P8/P10 numbering gaps (no P1, P3-P6, P9 test files) are
 * explained in tests/README.md — not dead history, don't renumber.
 *
 * Run: node --test tests/tier1-p2-coverage.test.js
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs   from 'node:fs';
import path from 'node:path';
import { findUngatedModernExpressions } from './supports-helpers.js';

const ROOT = path.resolve(import.meta.dirname, '..');

const SOURCE_FILES = ['core', 'optional'].flatMap((dir) =>
  fs
    .readdirSync(path.join(ROOT, dir))
    .filter((f) => f.endsWith('.css'))
    .map((f) => `${dir}/${f}`),
);

describe('P2: source CSS modern expressions are @supports-gated', () => {
  for (const rel of SOURCE_FILES) {
    test(`${rel} has no ungated modern colour expression`, () => {
      const css = fs.readFileSync(path.join(ROOT, rel), 'utf8');
      const hits = findUngatedModernExpressions(css);
      assert.deepEqual(
        hits,
        [],
        `Ungated modern colour expression(s) in ${rel} — wrap them in ` +
          `@supports:\n  ${hits.join('\n  ')}`,
      );
    });
  }
});
