/**
 * Tests for the bundle picker model (src/lib/bundles.js) and its synced
 * manifest (src/data/bundles.generated.json).
 *
 * The picker must never recommend or link a bundle that doesn't ship, so the
 * manifest is cross-checked against the framework's own bundle.config.json and
 * the files on disk. The curation maps (labels, module blurbs) are tripwires:
 * a new bundle or optional module added upstream fails here until it's
 * described, so the picker can't render a bare filename.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  BUNDLES,
  BUNDLE_ORDER,
  DEFAULT_BUNDLE_ID,
  bundleById,
  recommendBundle,
  embedSnippets,
} from '../src/lib/bundles.js';
import { allTokens } from '../src/lib/model.js';

const FRAMEWORK_ROOT = path.resolve(import.meta.dirname, '..', '..');
const bundleConfig = JSON.parse(
  fs.readFileSync(path.join(FRAMEWORK_ROOT, 'bundle.config.json'), 'utf8')
);
const logicalConfigBundles = bundleConfig.bundles.filter((b) => !b.flat);

describe('manifest integrity', () => {
  test('every logical (non-flat) bundle is represented', () => {
    assert.equal(BUNDLES.length, logicalConfigBundles.length);
  });

  test('every bundle references modules that exist on disk', () => {
    for (const b of logicalConfigBundles) {
      for (const f of b.files) {
        const p = path.join(FRAMEWORK_ROOT, f);
        assert.ok(fs.existsSync(p), `${f} (in ${b.output}) exists`);
      }
    }
  });

  test('bundles are ordered smallest → largest footprint', () => {
    const counts = BUNDLES.map((b) => b.fileCount);
    const sorted = [...counts].sort((a, z) => a - z);
    assert.deepEqual(counts, sorted);
  });

  test('the default bundle id exists', () => {
    assert.ok(bundleById(DEFAULT_BUNDLE_ID), `${DEFAULT_BUNDLE_ID} is a real bundle`);
  });
});

describe('curation completeness (tripwires)', () => {
  test('every bundle has a curated label + tagline', () => {
    for (const b of BUNDLES) {
      assert.ok(b.label && b.label.length > 0, `${b.id} has a label`);
      assert.ok(b.tagline && b.tagline.length > 0, `${b.id} has a tagline`);
    }
  });

  test('every optional module has a human blurb (not the bare filename fallback)', () => {
    for (const b of BUNDLES) {
      for (const feat of b.features) {
        // The fallback (used when MODULE_META lacks an entry) is the basename.
        const fallback = feat.module.replace(/^optional\//, '').replace(/\.css$/, '');
        assert.ok(feat.blurb && feat.blurb !== fallback, `${feat.module} described`);
      }
    }
  });
});

describe('recommendBundle', () => {
  test('no overrides → the default bundle', () => {
    assert.equal(recommendBundle({}), DEFAULT_BUNDLE_ID);
  });

  test('a core-only config recommends the leanest bundle', () => {
    // A token that belongs to every bundle (core) → essential covers it.
    const core = allTokens.find((t) => (t.bundles ?? []).length === BUNDLES.length && !t.optional);
    if (!core) return; // catalogue without full coverage data — skip silently
    assert.equal(recommendBundle({ [core.name]: '1rem' }), BUNDLE_ORDER[0]);
  });

  test('an optional-only token narrows to a bundle that ships it', () => {
    const optional = allTokens.find((t) => t.optional && (t.bundles ?? []).length > 0);
    if (!optional) return;
    const rec = recommendBundle({ [optional.name]: 'red' });
    const recBundle = bundleById(rec);
    assert.ok(recBundle, 'recommended a real bundle');
    assert.ok((optional.bundles ?? []).includes(rec), 'recommended bundle ships the token');
  });

  test('an unknown token falls back to the full superset', () => {
    assert.equal(recommendBundle({ '--sf-not-a-real-token': '1rem' }), 'full');
  });
});

describe('embedSnippets', () => {
  test('produces a <link> and an @import pointing at the bundle CDN', () => {
    const b = bundleById(DEFAULT_BUNDLE_ID);
    const snip = embedSnippets(b);
    assert.ok(snip.link.includes(b.cdn) && snip.link.includes('<link'));
    assert.ok(snip.import.includes(b.cdn) && snip.import.includes('@import'));
  });
});
