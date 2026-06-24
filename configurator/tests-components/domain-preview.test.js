/**
 * Component test for the inline DomainPreview (the generalisation of the Colors
 * "Semantic roles" card to every other token domain).
 *
 * Verifies each curated domain mounts without error and renders a sample for
 * every token in its spec, and that a token override flows into the scoped
 * stage's inline custom-property declarations (so the preview is genuinely
 * live, not a static snapshot).
 */
import { describe, test, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/svelte';
import { tick } from 'svelte';
import DomainPreview from '../src/components/DomainPreview.svelte';
import { DOMAIN_PREVIEWS } from '../src/lib/domainPreviews.js';
import { setOverride, clearAll } from '../src/lib/store.svelte.js';
import apiIndex from '../src/data/api-index.generated.json';
import domainPreviewSource from '../src/components/DomainPreview.svelte?raw';

beforeEach(() => clearAll());

describe('DomainPreview', () => {
  for (const [domain, spec] of Object.entries(DOMAIN_PREVIEWS)) {
    test(`${domain} mounts and renders a sample per spec item`, () => {
      const { container } = render(DomainPreview, { props: { domain } });
      const stage = container.querySelector('.dp__stage');
      expect(stage, `${domain}: scoped stage rendered`).toBeTruthy();
      // Each curated item renders its label as plain text (asserting on labels
      // rather than inline-style tokens avoids jsdom's quirky serialization of
      // backdrop-filter/opacity, which real browsers preserve). Labels are
      // unique within a domain, so each must be findable.
      const text = stage.textContent;
      for (const g of spec.groups) {
        for (const it of g.items) {
          expect(text, `${domain}: "${it.label}" sample present`).toContain(it.label);
        }
      }
    });
  }

  test('layout preview renders proportional container bars (not clamped)', () => {
    const { container } = render(DomainPreview, { props: { domain: 'layout' } });
    // The proportional track is driven by hidden width probes — their presence
    // is what distinguishes the real measurement from the old clamp-to-100%
    // bars that rendered every container identically.
    const probes = container.querySelectorAll('.dp__probes .dp__probe');
    expect(probes.length, 'one width probe per container token').toBe(4);
    // Aspect-ratio tiles and sizing swatches round out the layout panel.
    expect(container.querySelector('.dp__ratios'), 'aspect-ratio tiles present').toBeTruthy();
    expect(container.querySelector('.dp__sizes'), 'sizing swatches present').toBeTruthy();
  });

  test('renders nothing for a domain with no preview spec', () => {
    const { container } = render(DomainPreview, { props: { domain: 'colors' } });
    expect(container.querySelector('.dp')).toBeNull();
  });

  test('an override flows into the scoped stage declarations', async () => {
    setOverride('--sf-radius-m', '20px');
    const { container } = render(DomainPreview, { props: { domain: 'borders' } });
    await tick();
    const style = container.querySelector('.dp__stage')?.getAttribute('style') ?? '';
    expect(style).toContain('--sf-radius-m: 20px');
  });

  test('hard-coded framework var() references point at live tokens', () => {
    const source = domainPreviewSource;
    const liveTokens = new Set(apiIndex.tokens.map((token) => token.name));
    const refs = [...source.matchAll(/var\((--sf-[A-Za-z0-9_-]+(?:--[A-Za-z0-9_-]+)?)/g)]
      .map((match) => match[1])
      // Documentation comments intentionally mention wildcard/pattern examples;
      // this assertion protects actual hard-coded sample styles.
      .filter((name) => !name.endsWith('-'));

    expect([...new Set(refs)].sort()).toEqual(
      [...new Set(refs)].filter((name) => liveTokens.has(name)).sort()
    );
  });
});
