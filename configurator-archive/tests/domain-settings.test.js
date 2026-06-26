/**
 * Tests for lib/domainSettings.js — the semantic, DX-friendly panels that sit
 * above each domain's raw configure/consume catalogue.
 *
 * These settings are curated by hand, so pin every referenced token and every
 * preset patch to the baked catalogue. A framework rename should fail CI
 * instead of silently rendering a dead control in the beginner-friendly UI.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { SMART_SETTINGS_BY_DOMAIN, sectionTokenNames, smartSettingsFor, smartTokensFor } from '../src/lib/domainSettings.js';
import { DOMAIN_BY_ID } from '../src/lib/domains.js';
import { sanitizeValue } from '../src/lib/css.js';
import data from '../src/data/api-index.generated.json' with { type: 'json' };

const tokenByName = new Map(data.tokens.map((t) => [t.name, t]));
const REQUIRED = ['colors', 'typography', 'spacing', 'layout', 'borders', 'shadows', 'motion', 'effects'];

describe('smart domain settings coverage', () => {
  test('high-impact token domains have at least one smart panel', () => {
    for (const id of REQUIRED) {
      assert.ok(DOMAIN_BY_ID.has(id), `${id} is a known domain`);
      assert.ok(smartSettingsFor(id).length > 0, `${id} has a smart settings panel`);
    }
  });

  test('every section has display copy and a supported kind', () => {
    const kinds = new Set(['tokens', 'sliders', 'gradient', 'motion']);
    for (const [id, sections] of Object.entries(SMART_SETTINGS_BY_DOMAIN)) {
      for (const section of sections) {
        assert.ok(section.id?.trim(), `${id}: section id present`);
        assert.ok(section.title?.trim(), `${id}/${section.id}: title present`);
        assert.ok(section.hint?.trim(), `${id}/${section.id}: hint present`);
        assert.ok(kinds.has(section.kind), `${id}/${section.id}: supported kind`);
      }
    }
  });
});

describe('smart settings are wired to real tokens', () => {
  for (const id of Object.keys(SMART_SETTINGS_BY_DOMAIN)) {
    test(`${id}: every referenced token exists`, () => {
      for (const name of smartTokensFor(id)) {
        assert.ok(tokenByName.has(name), `${id}: ${name} missing from api-index`);
      }
    });

    test(`${id}: no duplicate controls in smart surface`, () => {
      const names = smartTokensFor(id);
      assert.equal(new Set(names).size, names.length, `${id}: duplicate token references`);
    });
  }
});


describe('smart setting reset coverage', () => {
  for (const [id, sections] of Object.entries(SMART_SETTINGS_BY_DOMAIN)) {
    for (const section of sections) {
      test(`${id}/${section.id}: default/reset can clear every preset-touched token`, () => {
        const sectionNames = new Set(sectionTokenNames(section));
        for (const preset of section.presets ?? []) {
          for (const name of Object.keys(preset.patch ?? {})) {
            assert.ok(sectionNames.has(name), `${id}/${section.id}: ${name} must be reset by the section`);
          }
        }
      });
    }
  }
});

describe('smart setting presets are safe', () => {
  for (const [id, sections] of Object.entries(SMART_SETTINGS_BY_DOMAIN)) {
    for (const section of sections) {
      for (const preset of section.presets ?? []) {
        test(`${id}/${section.id}/${preset.label}: patch references known tokens and sanitises`, () => {
          if (preset.patch == null) return;
          for (const [name, value] of Object.entries(preset.patch)) {
            assert.ok(tokenByName.has(name), `${name} missing from api-index`);
            const safe = sanitizeValue(value);
            assert.equal(safe, value, `${name}: preset value would be mangled by sanitizeValue`);
            assert.ok(safe.length > 0, `${name}: preset value sanitises to empty`);
          }
        });
      }
    }
  }
});
