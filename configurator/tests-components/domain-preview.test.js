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
});
