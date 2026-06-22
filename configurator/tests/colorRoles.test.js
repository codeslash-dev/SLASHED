/**
 * Tests for the curated semantic color-role map (lib/colorRoles.js).
 *
 * The role swatches in the Colors panel map human labels (Body text, Border,
 * Link…) to the framework's semantic consumption tokens. That mapping is
 * hand-curated — it cannot be auto-derived, since "Body text → --sf-color-text"
 * is a human judgement — so it is the one place a framework rename could
 * silently produce a blank swatch. This suite pins every role token to the
 * baked catalogue: a token that vanishes fails CI instead of rendering a dead
 * swatch, keeping the curated map honest as the framework grows (the same
 * tripwire philosophy as tests/basics.test.js).
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { COLOR_ROLE_GROUPS, ALL_ROLE_TOKENS } from '../src/lib/colorRoles.js';
import data from '../src/data/api-index.generated.json' with { type: 'json' };

const tokenByName = new Map(data.tokens.map((t) => [t.name, t]));

describe('COLOR_ROLE_GROUPS structure', () => {
  test('every group has a section title and ≥ 1 role', () => {
    assert.ok(COLOR_ROLE_GROUPS.length > 0, 'at least one role group');
    for (const g of COLOR_ROLE_GROUPS) {
      assert.ok(g.section?.trim(), 'group has a section title');
      assert.ok(Array.isArray(g.roles) && g.roles.length > 0, `${g.section} has ≥ 1 role`);
    }
  });

  test('every role has a non-empty label and token', () => {
    for (const g of COLOR_ROLE_GROUPS) {
      for (const r of g.roles) {
        assert.ok(r.label?.trim(), `${g.section}: role has a label`);
        assert.ok(
          typeof r.token === 'string' && r.token.startsWith('--sf-'),
          `${g.section} / ${r.label}: role token looks like a framework var`
        );
      }
    }
  });

  test('section titles are unique', () => {
    const sections = COLOR_ROLE_GROUPS.map((g) => g.section);
    assert.equal(new Set(sections).size, sections.length, 'duplicate section titles');
  });
});

describe('ALL_ROLE_TOKENS', () => {
  test('is the flattened list of every role token', () => {
    const flat = COLOR_ROLE_GROUPS.flatMap((g) => g.roles.map((r) => r.token));
    assert.deepEqual(ALL_ROLE_TOKENS, flat);
  });

  test('no duplicate role tokens across the whole map', () => {
    assert.equal(new Set(ALL_ROLE_TOKENS).size, ALL_ROLE_TOKENS.length);
  });
});

describe('Color roles are wired to real framework tokens', () => {
  for (const name of ALL_ROLE_TOKENS) {
    test(`${name} exists in the catalogue`, () => {
      const t = tokenByName.get(name);
      assert.ok(t, `${name} not in api-index — fix lib/colorRoles.js`);
      assert.ok(
        typeof t.value === 'string' && t.value.trim().length > 0,
        `${name} has an empty default value — the role swatch would render blank`
      );
    });
  }
});
