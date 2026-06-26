/**
 * Tests for the theme-preset library and the per-domain quick-knob registry.
 *
 * Themes own a curated set of overrides — every name they reference must
 * still exist in the live api-index, and every value must survive
 * `sanitizeValue`. The same goes for knob defaults: the slider can't drag a
 * non-existent token, so the registry has to stay in lockstep with the
 * baked catalogue.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import data from '../src/data/api-index.generated.json' with { type: 'json' };
import { PRESETS, PRESET_BY_ID, sanitisePreset, slugify } from '../src/lib/themes.js';
import { KNOBS_BY_DOMAIN, DOMAIN_BY_ID } from '../src/lib/domains.js';

const known = new Set(data.tokens.map((t) => t.name));

describe('PRESETS metadata', () => {
  test('every preset has id + name + icon + blurb + overrides', () => {
    for (const p of PRESETS) {
      assert.ok(p.id, 'has id');
      assert.ok(p.name, `${p.id} has a name`);
      assert.ok(p.icon, `${p.id} has an icon`);
      assert.ok(p.blurb, `${p.id} has a blurb`);
      assert.equal(typeof p.overrides, 'object', `${p.id}.overrides is an object`);
    }
  });

  test('preset ids are unique', () => {
    const ids = PRESETS.map((p) => p.id);
    assert.equal(new Set(ids).size, ids.length);
  });

  test('the first preset is the "default" reset slot', () => {
    assert.equal(PRESETS[0].id, 'default');
    assert.equal(Object.keys(PRESETS[0].overrides).length, 0);
  });

  test('PRESET_BY_ID exposes every preset', () => {
    for (const p of PRESETS) assert.equal(PRESET_BY_ID.get(p.id), p);
  });
});

describe('PRESETS overrides reference real tokens', () => {
  for (const p of PRESETS) {
    test(`${p.id}: every overridden token exists in the catalogue`, () => {
      for (const name of Object.keys(p.overrides)) {
        assert.ok(known.has(name), `${name} (preset ${p.id}) is not in api-index`);
      }
    });
  }
});

describe('sanitisePreset', () => {
  test('keeps known tokens with safe values', () => {
    const { map, applied, skipped } = sanitisePreset({
      '--sf-radius-scale': '1.2',
      '--sf-color-primary-source-light': 'oklch(0.5 0.2 220)',
    });
    assert.equal(applied, 2);
    assert.equal(skipped.length, 0);
    assert.equal(map['--sf-radius-scale'], '1.2');
    assert.equal(map['--sf-color-primary-source-light'], 'oklch(0.5 0.2 220)');
  });

  test('drops unknown tokens', () => {
    const { applied, skipped } = sanitisePreset({
      '--sf-radius-scale': '1',
      '--sf-not-a-real-token': 'oops',
    });
    assert.equal(applied, 1);
    assert.deepEqual(skipped, ['--sf-not-a-real-token']);
  });

  test('drops values that sanitise to an empty string', () => {
    const { applied, skipped } = sanitisePreset({ '--sf-radius-scale': '   ' });
    assert.equal(applied, 0);
    assert.deepEqual(skipped, ['--sf-radius-scale']);
  });

  test('handles a missing/null overrides argument without throwing', () => {
    assert.deepEqual(sanitisePreset(null), { map: {}, applied: 0, skipped: [] });
    assert.deepEqual(sanitisePreset(undefined), { map: {}, applied: 0, skipped: [] });
  });
});

describe('slugify', () => {
  test('handles common cases', () => {
    assert.equal(slugify('Marketing site v2'), 'marketing-site-v2');
    assert.equal(slugify('  Bold!  '), 'bold');
    assert.equal(slugify('My Theme — 2026'), 'my-theme-2026');
    assert.equal(slugify(''), 'theme'); // graceful fallback
    assert.equal(slugify(null), 'theme');
  });
  test('caps length so a slot key never balloons', () => {
    const long = 'a'.repeat(200);
    const slug = slugify(long);
    assert.ok(slug.length <= 40, `slug length ${slug.length} should be ≤ 40`);
  });
});

describe('KNOBS_BY_DOMAIN registry', () => {
  test('every knob points at a real catalogue token', () => {
    for (const [domainId, knobs] of Object.entries(KNOBS_BY_DOMAIN)) {
      // The domain id must itself be a real domain.
      assert.ok(DOMAIN_BY_ID.has(domainId), `${domainId} is a real domain`);
      for (const k of knobs) {
        assert.ok(known.has(k.name), `${k.name} (${domainId} knob) is in api-index`);
      }
    }
  });

  test('every knob has a coherent min/default/max + step', () => {
    for (const [domainId, knobs] of Object.entries(KNOBS_BY_DOMAIN)) {
      for (const k of knobs) {
        assert.ok(k.label, `${k.name} has a label`);
        assert.ok(typeof k.default === 'number', `${domainId}:${k.name} default is numeric`);
        assert.ok(k.max > k.min, `${domainId}:${k.name} max>min`);
        assert.ok(k.default >= k.min && k.default <= k.max, `${domainId}:${k.name} default within range`);
        assert.ok(k.step > 0, `${domainId}:${k.name} step>0`);
      }
    }
  });

  test('each knob name is unique across all domains', () => {
    const seen = new Set();
    for (const knobs of Object.values(KNOBS_BY_DOMAIN)) {
      for (const k of knobs) {
        assert.ok(!seen.has(k.name), `${k.name} listed twice in KNOBS_BY_DOMAIN`);
        seen.add(k.name);
      }
    }
  });

  test('every knob default matches the live framework default', () => {
    // Default parity is the sync tripwire: if the framework retunes a knob
    // (e.g. a new base shadow strength), this fails CI instead of letting
    // the slider open at a stale "default" position.
    const valueByName = new Map(data.tokens.map((t) => [t.name, t.value]));
    for (const [domainId, knobs] of Object.entries(KNOBS_BY_DOMAIN)) {
      for (const k of knobs) {
        const catalogue = valueByName.get(k.name);
        if (k.encode) {
          assert.equal(
            k.encode(k.default),
            catalogue,
            `${domainId}:${k.name} encode(default) drifted from the catalogue value`
          );
          if (k.decode) {
            assert.equal(k.decode(catalogue), k.default, `${domainId}:${k.name} decode(catalogue) !== default`);
          }
        } else {
          assert.equal(
            parseFloat(catalogue),
            k.default,
            `${domainId}:${k.name} default drifted (catalogue ${catalogue} vs knob ${k.default})`
          );
        }
      }
    }
  });
});
