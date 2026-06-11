/**
 * Tests for lib/stylePresets.js — the one-click Basic border/shadow looks.
 *
 * Sync tripwires: every patch key must exist in the baked catalogue and
 * every non-null value must survive the store's sanitizer, so a framework
 * rename or a malformed preset value fails CI instead of rendering a dead
 * (or worse, half-applied) preset button.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  BORDER_STYLE_PRESETS,
  SHADOW_STYLE_PRESETS,
  STYLE_PRESETS_BY_DOMAIN,
  presetActive,
} from '../src/lib/stylePresets.js';
import { sanitizeValue } from '../src/lib/css.js';
import data from '../src/data/api-index.generated.json' with { type: 'json' };

const tokenByName = new Map(data.tokens.map((t) => [t.name, t]));
const ALL_LISTS = [
  ['border', BORDER_STYLE_PRESETS],
  ['shadow', SHADOW_STYLE_PRESETS],
];

describe('preset patches are wired to real tokens', () => {
  for (const [list, presets] of ALL_LISTS) {
    for (const p of presets) {
      test(`${list}/${p.id}: every patch token exists in the catalogue`, () => {
        for (const name of Object.keys(p.patch)) {
          assert.ok(tokenByName.has(name), `${name} not in api-index — fix lib/stylePresets.js`);
        }
      });

      test(`${list}/${p.id}: every non-null value survives sanitisation`, () => {
        for (const [name, value] of Object.entries(p.patch)) {
          if (value === null) continue;
          const safe = sanitizeValue(value);
          assert.equal(safe, value, `${name}: value would be mangled by sanitizeValue`);
          assert.ok(safe.length > 0, `${name}: value sanitises to empty`);
        }
      });
    }
  }
});

describe('preset list invariants', () => {
  for (const [list, presets] of ALL_LISTS) {
    test(`${list}: ids unique, labels and hints present`, () => {
      const ids = presets.map((p) => p.id);
      assert.equal(new Set(ids).size, ids.length);
      for (const p of presets) {
        assert.ok(p.label?.trim(), `${list}/${p.id} has a label`);
        assert.ok(p.hint?.trim(), `${list}/${p.id} has a hint`);
      }
    });

    test(`${list}: exactly one all-null "framework default" preset`, () => {
      const defaults = presets.filter((p) => Object.values(p.patch).every((v) => v === null));
      assert.equal(defaults.length, 1, `${list} needs exactly one all-null default preset`);
    });

    test(`${list}: all presets patch the same token set (no masking leftovers)`, () => {
      const keySet = (p) => Object.keys(p.patch).sort().join('|');
      // Border presets patch only the radius trio; shadow presets always
      // cover strength + all four steps. Within a list the key set must be
      // identical so switching presets can never leave stale overrides.
      const sets = new Set(presets.map(keySet));
      assert.equal(sets.size, 1, `${list}: presets patch differing token sets`);
    });
  }

  test('border presets stay anchored to the framework default radii', () => {
    // The preset semantics encode knowledge of the defaults: Subtle is half
    // of 4/8/12px, Rounded IS 4/8/12px, Pill scales beyond them. If the
    // framework retunes its radius steps this must fail so the presets get
    // redesigned alongside (same parity idea as the fluid-engine defaults).
    assert.equal(tokenByName.get('--sf-radius-s').value, 'calc(4px * var(--sf-radius-scale))');
    assert.equal(tokenByName.get('--sf-radius-m').value, 'calc(8px * var(--sf-radius-scale))');
    assert.equal(tokenByName.get('--sf-radius-l').value, 'calc(12px * var(--sf-radius-scale))');
  });

  test('STYLE_PRESETS_BY_DOMAIN keys are borders + shadows with titles', () => {
    assert.deepEqual(Object.keys(STYLE_PRESETS_BY_DOMAIN).sort(), ['borders', 'shadows']);
    for (const def of Object.values(STYLE_PRESETS_BY_DOMAIN)) {
      assert.ok(def.title?.trim());
      assert.ok(Array.isArray(def.presets) && def.presets.length >= 2);
    }
  });
});

describe('presetActive', () => {
  const subtle = BORDER_STYLE_PRESETS.find((p) => p.id === 'subtle');
  const rounded = BORDER_STYLE_PRESETS.find((p) => p.id === 'rounded');

  test('all-null default preset is active on a clean slate', () => {
    assert.equal(presetActive(rounded, {}), true);
    assert.equal(presetActive(subtle, {}), false);
  });

  test('value preset is active only on an exact match', () => {
    const live = { ...subtle.patch };
    assert.equal(presetActive(subtle, live), true);
    live['--sf-radius-m'] = '3px'; // hand-edited
    assert.equal(presetActive(subtle, live), false);
    assert.equal(presetActive(rounded, live), false);
  });
});
