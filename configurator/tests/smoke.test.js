/**
 * End-to-end smoke test for the configurator's editing pipeline.
 *
 * Exercises the full chain — token catalogue → editor inference →
 * sanitisation → CSS generation → CSS parse → re-application — for one
 * representative token from EVERY domain, against the actual baked
 * api-index.generated.json. If a future framework release renames a
 * representative token, the test fails fast (the bridge is broken).
 *
 * This is the closest we get to a UI integration test without a browser.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import data from '../src/data/api-index.generated.json' with { type: 'json' };
import { domainOf, DOMAINS } from '../src/lib/domains.js';
import { inferControl } from '../src/lib/model.js';
import { generateCSS, parseCSS, sanitizeValue } from '../src/lib/css.js';

const tokenByName = new Map(data.tokens.map((t) => [t.name, t]));

/** One realistic edit per domain. */
const edits = {
  '--sf-color-primary-light': 'oklch(0.55 0.22 264)',
  '--sf-font-body': 'Inter, system-ui, sans-serif',
  '--sf-space-m': 'clamp(1rem, 0.8rem + 0.6vw, 1.5rem)',
  '--sf-container-default': '72rem',
  '--sf-radius-m': '10px',
  '--sf-shadow-m': '0 4px 16px rgba(0, 0, 0, 0.16)',
  '--sf-duration-fast': '120ms',
  '--sf-blur-m': '12px',
  '--sf-print-page-margin': '2cm',
};

describe('smoke: every editable token routes through the full pipeline', () => {
  test('every chosen edit token exists in the catalogue', () => {
    for (const name of Object.keys(edits)) {
      assert.ok(tokenByName.has(name), `${name} present`);
    }
  });

  test('every edit covers a different domain', () => {
    const seen = new Set();
    for (const name of Object.keys(edits)) {
      const t = tokenByName.get(name);
      const d = domainOf(t);
      assert.ok(!seen.has(d), `domain ${d} should appear at most once`);
      seen.add(d);
    }
    // Every non-tool, non-misc-only domain represented (misc is optional —
    // print is the misc rep here).
    const expected = DOMAINS.filter((d) => !d.tool).map((d) => d.id);
    for (const id of expected) {
      assert.ok(seen.has(id), `domain ${id} represented in smoke set`);
    }
  });

  test('inferControl picks a reasonable control per token', () => {
    // Most framework defaults are calc() / oklch() / system-stack expressions
    // — i.e. the catalogue's primary value type is "text" by design.
    // Hard-classified controls: only color tokens (oklch/hex) and tokens whose
    // default is a bare length (e.g. blur-m: 16px).
    const expectedControl = {
      '--sf-color-primary-light': 'color',
      '--sf-blur-m': 'length',
      // Anything calc()-based renders as a free-text editor:
      '--sf-radius-m': 'text',
      '--sf-duration-fast': 'text',
      '--sf-shadow-m': 'text',
      '--sf-font-body': 'text',
      '--sf-space-m': 'text',
    };
    for (const [name, expected] of Object.entries(expectedControl)) {
      const meta = inferControl(tokenByName.get(name));
      assert.equal(meta.control, expected, `${name} control: ${meta.control}`);
    }
  });

  test('generated CSS round-trips through parseCSS losslessly', () => {
    const sanitised = {};
    for (const [name, value] of Object.entries(edits)) {
      sanitised[name] = sanitizeValue(value);
    }
    for (const mode of ['layer', 'root']) {
      const css = generateCSS(sanitised, { mode });
      const parsed = parseCSS(css);
      assert.deepEqual(parsed, sanitised, `${mode}: round-trip preserves every edit`);
    }
  });

  test('the layer-mode output declares overrides inside @layer slashed.overrides { :root {…} }', () => {
    const css = generateCSS(edits, { mode: 'layer' });
    // Strip the banner comment so the structural assertion isn't fooled by it.
    const body = css.replace(/^\/\*[\s\S]*?\*\/\n/, '');
    assert.match(body, /^@layer slashed\.overrides \{\n\t:root \{\n/);
    assert.match(body, /\n\t\}\n\}\n$/);
    // Every edited token appears as a declaration line.
    for (const name of Object.keys(edits)) {
      assert.match(body, new RegExp(`\\t\\t${name.replace(/-/g, '\\-')}: `));
    }
  });

  test('clamp() / oklch() values survive end-to-end (no rogue paren splitting)', () => {
    const css = generateCSS(edits, { mode: 'layer' });
    // The clamp() with its commas inside parens must round-trip, not split.
    assert.match(css, /--sf-space-m: clamp\(1rem, 0\.8rem \+ 0\.6vw, 1\.5rem\);/);
    // The oklch() with three space-separated args must round-trip.
    assert.match(css, /--sf-color-primary-light: oklch\(0\.55 0\.22 264\);/);
  });
});
