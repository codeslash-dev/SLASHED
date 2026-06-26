/**
 * Tests for the curated Basic surface (lib/basics.js).
 *
 * The Basic panels are hand-curated forms, so they are the one place a
 * framework rename could silently produce dead controls. This suite pins
 * every curated control to the actual baked catalogue: a token that
 * vanishes (or ships an empty default) fails CI instead of rendering a
 * broken row.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { BASIC_BY_DOMAIN, basicControlTokens, basicTokenNames } from '../src/lib/basics.js';
import { OVERVIEW_DOMAIN_IDS, DOMAIN_BY_ID } from '../src/lib/domains.js';
import data from '../src/data/api-index.generated.json' with { type: 'json' };

const tokenByName = new Map(data.tokens.map((t) => [t.name, t]));

describe('BASIC_BY_DOMAIN structure', () => {
  test('every key is an overview domain id', () => {
    for (const id of Object.keys(BASIC_BY_DOMAIN)) {
      assert.ok(OVERVIEW_DOMAIN_IDS.includes(id), `${id} is in OVERVIEW_DOMAIN_IDS`);
      assert.ok(DOMAIN_BY_ID.has(id), `${id} is a known domain`);
    }
  });

  test('every non-color, non-tool curated domain has groups', () => {
    for (const id of OVERVIEW_DOMAIN_IDS) {
      const d = DOMAIN_BY_ID.get(id);
      if (d.tool || d.brandColors) continue; // themes (tool) + colors (brand rows)
      const def = BASIC_BY_DOMAIN[id];
      assert.ok(def && def.groups.length > 0, `${id} has ≥ 1 curated group`);
      for (const g of def.groups) {
        assert.ok(g.title?.trim(), `${id} group has a title`);
        assert.ok(g.controls.length > 0, `${id} / ${g.title} has ≥ 1 control`);
      }
    }
  });

  test('labels are non-empty and unique per domain', () => {
    for (const [id, def] of Object.entries(BASIC_BY_DOMAIN)) {
      const labels = def.groups.flatMap((g) => g.controls.map((c) => c.label));
      for (const l of labels) {
        assert.ok(typeof l === 'string' && l.trim().length > 0, `${id}: empty label`);
      }
      assert.equal(new Set(labels).size, labels.length, `${id}: duplicate labels`);
    }
  });

  test('every control carries help text', () => {
    for (const [id, def] of Object.entries(BASIC_BY_DOMAIN)) {
      for (const g of def.groups) {
        for (const c of g.controls) {
          assert.ok(
            typeof c.help === 'string' && c.help.trim().length > 0,
            `${id}: ${c.token} has help text`
          );
        }
      }
    }
  });
});

describe('Basic controls are wired to real framework tokens', () => {
  for (const name of basicTokenNames()) {
    test(`${name} exists in the catalogue with a non-empty default`, () => {
      const t = tokenByName.get(name);
      assert.ok(t, `${name} not in api-index — fix lib/basics.js`);
      assert.ok(
        typeof t.value === 'string' && t.value.trim().length > 0,
        `${name} has an empty default value — the Basic row would render dead`
      );
    });
  }

  test('no duplicate tokens across the whole Basic surface', () => {
    const names = basicTokenNames();
    assert.equal(new Set(names).size, names.length);
  });
});

describe('domains.js essentials stay in sync with basics.js', () => {
  // The checklist domains derive `essentials` from basicControlTokens(), so
  // the curated card and the search surface can never drift apart.
  for (const id of Object.keys(BASIC_BY_DOMAIN)) {
    test(`${id}: domain.essentials === basicControlTokens('${id}')`, () => {
      const d = DOMAIN_BY_ID.get(id);
      assert.deepEqual(d.essentials, basicControlTokens(id));
    });
  }
});
