/**
 * Tests for the curated inline domain previews (lib/domainPreviews.js).
 *
 * Each token domain (Typography, Spacing, Borders, Shadows, …) renders a
 * compact, hand-curated live preview of a handful of its tokens. That mapping
 * is human judgement — "show --sf-radius-m here" — so it is a place a framework
 * rename could silently produce a dead sample. This suite pins every previewed
 * token to the baked catalogue: a vanished token fails CI instead of rendering
 * blank, the same tripwire philosophy as tests/colorRoles.test.js and
 * tests/basics.test.js.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { DOMAIN_PREVIEWS, allPreviewTokens } from '../src/lib/domainPreviews.js';
import { DOMAIN_BY_ID } from '../src/lib/domains.js';
import data from '../src/data/api-index.generated.json' with { type: 'json' };

const tokenByName = new Map(data.tokens.map((t) => [t.name, t]));

describe('DOMAIN_PREVIEWS structure', () => {
  test('every key is a known token domain', () => {
    for (const id of Object.keys(DOMAIN_PREVIEWS)) {
      const d = DOMAIN_BY_ID.get(id);
      assert.ok(d, `${id} is a known domain`);
      assert.ok(!d.tool, `${id} is a token domain, not a tool`);
    }
  });

  test('every spec has a kind, blurb and ≥ 1 group with items', () => {
    for (const [id, spec] of Object.entries(DOMAIN_PREVIEWS)) {
      assert.ok(spec.kind?.trim(), `${id}: spec has a kind`);
      assert.ok(spec.blurb?.trim(), `${id}: spec has a blurb`);
      assert.ok(Array.isArray(spec.groups) && spec.groups.length > 0, `${id}: has ≥ 1 group`);
      for (const g of spec.groups) {
        assert.ok(Array.isArray(g.items) && g.items.length > 0, `${id}: group has ≥ 1 item`);
        for (const it of g.items) {
          assert.ok(it.label?.trim(), `${id}: item has a label`);
          assert.ok(
            typeof it.token === 'string' && it.token.startsWith('--sf-'),
            `${id}: item token looks like a framework var`
          );
        }
      }
    }
  });
});

describe('allPreviewTokens', () => {
  test('is the flattened list of every preview item token', () => {
    const flat = [];
    for (const spec of Object.values(DOMAIN_PREVIEWS)) {
      for (const g of spec.groups) for (const it of g.items) flat.push(it.token);
    }
    assert.deepEqual(allPreviewTokens(), flat);
  });

  test('no duplicate tokens within any single domain', () => {
    for (const [id, spec] of Object.entries(DOMAIN_PREVIEWS)) {
      const names = spec.groups.flatMap((g) => g.items.map((it) => it.token));
      assert.equal(new Set(names).size, names.length, `${id}: duplicate preview tokens`);
    }
  });
});

describe('Preview samples are wired to real framework tokens', () => {
  for (const name of new Set(allPreviewTokens())) {
    test(`${name} exists in the catalogue with a non-empty default`, () => {
      const t = tokenByName.get(name);
      assert.ok(t, `${name} not in api-index — fix lib/domainPreviews.js`);
      assert.ok(
        typeof t.value === 'string' && t.value.trim().length > 0,
        `${name} has an empty default value — the preview sample would render dead`
      );
    });
  }
});
