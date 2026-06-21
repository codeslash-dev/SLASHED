/**
 * Tests for the domain classifier.
 *
 * The user-facing promise is "every framework token has a domain — none
 * are hidden". This suite enforces that against the actual baked catalogue
 * (api-index.generated.json) so the build fails the moment a future
 * framework release adds a token shape the classifier can't place.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { domainOf, DOMAINS, DOMAIN_BY_ID, OVERVIEW_DOMAIN_IDS, KNOBS_BY_DOMAIN } from '../src/lib/domains.js';
import data from '../src/data/api-index.generated.json' with { type: 'json' };

const tokens = data.tokens;

describe('DOMAINS metadata', () => {
  test('every domain has id + label + icon + blurb', () => {
    for (const d of DOMAINS) {
      assert.ok(d.id, `domain has id`);
      assert.ok(d.label, `${d.id} has a label`);
      assert.ok(d.icon, `${d.id} has an icon`);
      assert.ok(d.blurb, `${d.id} has a blurb`);
    }
  });

  test('domain ids are unique', () => {
    const ids = DOMAINS.map((d) => d.id);
    assert.equal(new Set(ids).size, ids.length);
  });

  test('DOMAIN_BY_ID exposes every domain', () => {
    for (const d of DOMAINS) {
      assert.equal(DOMAIN_BY_ID.get(d.id), d);
    }
  });
});

describe('Overview surface', () => {
  test('every OVERVIEW_DOMAIN_IDS entry is a real domain id', () => {
    for (const id of OVERVIEW_DOMAIN_IDS) {
      assert.ok(DOMAIN_BY_ID.has(id), `${id} is a known domain`);
    }
  });

  test('overview ids are unique', () => {
    assert.equal(new Set(OVERVIEW_DOMAIN_IDS).size, OVERVIEW_DOMAIN_IDS.length);
  });

  test('every non-tool overview domain has intro copy', () => {
    for (const id of OVERVIEW_DOMAIN_IDS) {
      const d = DOMAIN_BY_ID.get(id);
      if (d.tool) continue;
      assert.ok(
        typeof d.intro === 'string' && d.intro.trim().length > 0,
        `${id} has non-empty intro copy for its panel`
      );
    }
  });

  test('every domain with scaling knobs has scaleIntro copy', () => {
    for (const [id, knobs] of Object.entries(KNOBS_BY_DOMAIN)) {
      if (!knobs.length) continue;
      const d = DOMAIN_BY_ID.get(id);
      assert.ok(d, `${id} (KNOBS_BY_DOMAIN key) is a known domain`);
      assert.ok(
        typeof d.scaleIntro === 'string' && d.scaleIntro.trim().length > 0,
        `${id} has non-empty scaleIntro for its Scaling group`
      );
    }
  });

  test('every scaling knob token exists in the catalogue', () => {
    const known = new Set(tokens.map((t) => t.name));
    for (const knobs of Object.values(KNOBS_BY_DOMAIN)) {
      for (const k of knobs) {
        assert.ok(known.has(k.name), `${k.name} not in api-index — fix KNOBS_BY_DOMAIN`);
      }
    }
  });
});

describe('domainOf — every token is classified', () => {
  test('no token returns an unknown domain id', () => {
    const validIds = new Set(DOMAINS.map((d) => d.id));
    const failures = tokens.filter((t) => !validIds.has(domainOf(t)));
    assert.equal(failures.length, 0, `unmapped: ${failures.map((t) => t.name).slice(0, 5).join(', ')}`);
  });

  test('coverage spans every non-tool domain', () => {
    const counts = {};
    for (const t of tokens) {
      const d = domainOf(t);
      counts[d] = (counts[d] || 0) + 1;
    }
    for (const d of DOMAINS) {
      if (d.tool) continue;
      assert.ok(counts[d.id] > 0, `${d.id} owns ≥ 1 token (got ${counts[d.id] || 0})`);
    }
  });

  test('the WCAG tool domain owns no tokens (it is not a token domain)', () => {
    const wcagTokens = tokens.filter((t) => domainOf(t) === 'wcag');
    assert.equal(wcagTokens.length, 0);
  });
});

describe('domainOf — known compound names route correctly', () => {
  const cases = [
    // [token name, expected domain]
    ['--sf-color-primary', 'colors'],
    ['--sf-primary-h', 'colors'],
    ['--sf-color-secondary-100', 'colors'],
    ['--sf-link-underline-offset', 'colors'],
    ['--sf-focus-ring-color', 'colors'],
    ['--sf-gradient-brand', 'gradients'],
    ['--sf-gradient-primary', 'gradients'],
    ['--sf-scrollbar-thumb', 'colors'],
    ['--sf-caret-color', 'colors'],

    ['--sf-font-body', 'typography'],
    ['--sf-text-l', 'typography'],
    ['--sf-text-display-l', 'typography'],
    ['--sf-h1-size', 'typography'],
    ['--sf-leading-tight', 'typography'],
    ['--sf-prose-block-margin', 'typography'],
    ['--sf-line-clamp', 'typography'],
    ['--sf-current-font-weight', 'typography'],

    ['--sf-space-m', 'spacing'],
    ['--sf-section-pad', 'spacing'],
    ['--sf-flow-space', 'spacing'],
    ['--sf-component-pad', 'spacing'],
    ['--sf-content-gap', 'spacing'],

    ['--sf-container-prose', 'layout'],
    ['--sf-grid-min', 'layout'],
    ['--sf-icon-l', 'layout'],
    ['--sf-z-modal', 'layout'],
    ['--sf-touch-target', 'layout'],
    ['--sf-aspect', 'layout'],
    ['--sf-ratio-golden', 'layout'],
    ['--sf-field-block', 'layout'],

    ['--sf-radius-m', 'borders'],
    ['--sf-border-width-1', 'borders'],
    ['--sf-divider-color', 'borders'],

    ['--sf-shadow-m', 'shadows'],
    ['--sf-text-shadow-m', 'shadows'], // <-- the compound-name case
    ['--sf-drop-shadow-l', 'shadows'],
    ['--sf-scroll-shadow-size', 'shadows'],
    ['--sf-shadow-glow', 'shadows'],

    ['--sf-duration-fast', 'motion'],
    ['--sf-ease-in-out', 'motion'],
    ['--sf-transition-form-field', 'motion'],
    ['--sf-animation-blink', 'motion'],

    ['--sf-blur', 'effects'],
    ['--sf-opacity-muted', 'effects'],
    ['--sf-scrim-color', 'effects'],
    ['--sf-mask-scrim-end', 'effects'],
    ['--sf-state-pending-opacity', 'effects'],

    ['--sf-print-page-margin', 'misc'],
    ['--sf-is-active', 'misc'],
    ['--sf-is-dark', 'misc'], // explicit override
  ];

  for (const [name, expected] of cases) {
    test(`${name} → ${expected}`, () => {
      assert.equal(domainOf({ name }), expected);
    });
  }
});

describe('domainOf — defensive cases', () => {
  test('null/undefined token yields misc (never throws)', () => {
    assert.equal(domainOf(null), 'misc');
    assert.equal(domainOf(undefined), 'misc');
    assert.equal(domainOf({}), 'misc');
  });
});

describe('essentials are real tokens', () => {
  // Catches typos in the curated list that would otherwise just render as
  // empty rows — the panel filters absentees silently.
  const known = new Set(tokens.map((t) => t.name));
  for (const d of DOMAINS) {
    if (!d.essentials) continue;
    for (const name of d.essentials) {
      test(`${d.id}: ${name} exists in the catalogue`, () => {
        assert.ok(known.has(name), `${name} not in api-index — fix the essentials list`);
      });
    }
  }
});
