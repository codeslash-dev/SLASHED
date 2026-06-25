/**
 * Tripwires for the visual Studio configuration layer.
 *
 * The studios are curated by hand, so every listed token must exist and every
 * group needs enough metadata to render a useful visual editing section.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { TYPOGRAPHY_PANELS, STUDIO_GROUPS, STUDIO_PANELS, resolveStudioGroups, resolveStudioPanels } from '../src/lib/studioSchema.js';
import data from '../src/data/api-index.generated.json' with { type: 'json' };

const known = new Set(data.tokens.map((token) => token.name));

describe('studio schema', () => {
  test('typography panels have labels, descriptions and real tokens', () => {
    assert.ok(TYPOGRAPHY_PANELS.length >= 5, 'typography exposes multiple editing scopes');
    const ids = TYPOGRAPHY_PANELS.map((panel) => panel.id);
    assert.equal(new Set(ids).size, ids.length, 'typography panel ids are unique');

    for (const panel of TYPOGRAPHY_PANELS) {
      assert.ok(panel.label?.trim(), `${panel.id} has a label`);
      assert.ok(panel.description?.trim(), `${panel.id} has a description`);
      assert.ok(panel.tokens.length > 0, `${panel.id} has tokens`);
      for (const name of panel.tokens) {
        assert.ok(known.has(name), `${panel.id}: ${name} is in api-index`);
      }
    }
  });

  test('every studio group has a title, hint and real tokens', () => {
    for (const [domain, groups] of Object.entries(STUDIO_GROUPS)) {
      assert.ok(groups.length > 0, `${domain} has studio groups`);
      const titles = groups.map((group) => group.title);
      assert.equal(new Set(titles).size, titles.length, `${domain} group titles are unique`);

      for (const group of groups) {
        assert.ok(group.title?.trim(), `${domain}: group has a title`);
        assert.ok(group.hint?.trim(), `${domain}/${group.title}: group has a hint`);
        assert.ok(group.tokens.length > 0, `${domain}/${group.title}: group has tokens`);
        for (const name of group.tokens) {
          assert.ok(known.has(name), `${domain}/${group.title}: ${name} is in api-index`);
        }
      }
    }
  });

  test('every shared studio panel has metadata and real tokens', () => {
    for (const [domain, panels] of Object.entries(STUDIO_PANELS)) {
      assert.ok(panels.length > 0, `${domain} has studio panels`);
      const labels = panels.map((panel) => panel.label);
      assert.equal(new Set(labels).size, labels.length, `${domain} panel labels are unique`);

      for (const panel of panels) {
        assert.ok(panel.label?.trim(), `${domain}: panel has a label`);
        assert.ok(panel.description?.trim(), `${domain}/${panel.label}: panel has a description`);
        assert.ok(panel.tokens.length > 0, `${domain}/${panel.label}: panel has tokens`);
        for (const name of panel.tokens) {
          assert.ok(known.has(name), `${domain}/${panel.label}: ${name} is in api-index`);
        }
      }
    }
  });

  test('resolveStudioPanels creates one scoped group per active panel', () => {
    const resolved = resolveStudioPanels([
      { label: 'Mixed', description: 'Contains one valid token and one stale token.', tokens: ['--sf-space-scale', '--sf-not-real'] },
      { label: 'Empty', description: 'Should disappear.', tokens: ['--sf-not-real'] },
    ]);

    assert.equal(resolved.length, 1);
    assert.equal(resolved[0].id, 'Mixed');
    assert.equal(resolved[0].groups[0].title, 'Mixed');
    assert.deepEqual(resolved[0].groups[0].tokens.map((token) => token.name), ['--sf-space-scale']);
  });

  test('resolveStudioGroups removes dead token references without mutating labels', () => {
    const resolved = resolveStudioGroups([
      { title: 'Mixed', hint: 'Contains one valid token and one stale token.', tokens: ['--sf-space-scale', '--sf-not-real'] },
      { title: 'Empty', hint: 'Should disappear.', tokens: ['--sf-not-real'] },
    ]);

    assert.equal(resolved.length, 1);
    assert.equal(resolved[0].title, 'Mixed');
    assert.deepEqual(resolved[0].tokens.map((token) => token.name), ['--sf-space-scale']);
  });
});
