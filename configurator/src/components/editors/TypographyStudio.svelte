<script>
  import { overrides } from '../../lib/store.svelte.js';
  import { TYPOGRAPHY_PANELS, resolveStudioGroups } from '../../lib/studioSchema.js';
  import StudioFrame from './StudioFrame.svelte';
  import StudioControls from './StudioControls.svelte';
  import ScaleGenerator from '../ScaleGenerator.svelte';
  import QuickKnobs from '../QuickKnobs.svelte';
  import { KNOBS_BY_DOMAIN } from '../../lib/domains.js';

  let active = $state('Overview');
  const panel = $derived(TYPOGRAPHY_PANELS.find((p) => p.id === active) ?? TYPOGRAPHY_PANELS[0]);
  const groups = $derived(resolveStudioGroups([{ title: panel.label, hint: panel.description, tokens: panel.tokens }]));
  const headingFont = $derived(overrides['--sf-font-heading'] || 'var(--sf-font-heading)');
  const bodyFont = $derived(overrides['--sf-font-body'] || 'var(--sf-font-body)');
  const monoFont = $derived(overrides['--sf-font-mono'] || 'var(--sf-font-mono)');
  const scale = $derived(overrides['--sf-text-scale'] || 'var(--sf-text-scale, 1)');
  const knobs = KNOBS_BY_DOMAIN.typography ?? [];
</script>

<StudioFrame title="Typography Studio" description="The live specimen is your canvas: pick a scope, set the font, scale, rhythm and wrap — and see the result next to the controls." tone="type">
  <div class="type-studio">
    <div class="type-studio__toolbar">
      <div class="tabs" role="tablist" aria-label="Typography editing scope">
        {#each TYPOGRAPHY_PANELS as p (p.id)}
          <button role="tab" aria-selected={active === p.id} class:active={active === p.id} onclick={() => (active = p.id)}>{p.label}</button>
        {/each}
      </div>
      <p>{panel.description}</p>
    </div>

    <div class="specimen" style:--type-scale={scale}>
      <div class="specimen__measure"><span>mobile</span><span>tablet</span><span>desktop</span></div>
      {#if active === 'Overview' || active === 'Fluid scale' || active === 'Headings'}
        <h1 style:font-family={headingFont}>The quick brown fox</h1>
        <h2 style:font-family={headingFont}>Jumps over the lazy dog</h2>
        <h3 style:font-family={headingFont}>Typography at every scale</h3>
        <h4 style:font-family={headingFont}>Fluid, readable, precise</h4>
      {/if}
      {#if active === 'Overview' || active === 'Body'}
        <p style:font-family={bodyFont}>Body: The quick brown fox jumps over the lazy dog. A short paragraph shows body rhythm, line height, measure and spacing at a glance.</p>
      {/if}
      {#if active === 'Overview' || active === 'Code'}
        <code style:font-family={monoFont}>Pixel-perfect control — const token = true;</code>
      {/if}
    </div>

    <div class="mini-previews">
      <article><b>Heading wrap</b><span>Balanced title blocks reduce awkward one-word lines.</span></article>
      <article><b>Body rhythm</b><span>Line height and content gap define reading comfort.</span></article>
      <article><b>Code / mono</b><code style:font-family={monoFont}>const token = true;</code></article>
    </div>

    <ScaleGenerator kinds={['type', 'display']} collapsible />
    <QuickKnobs {knobs} title="Scaling" blurb="Global text scaling lives inside Typography Studio so the panel stays Header → Studio → All variables." />

    <StudioControls {groups} />
  </div>
</StudioFrame>

<style>
  .type-studio { display: grid; gap: 12px; }
  .type-studio__toolbar { display: grid; gap: 8px; }
  .type-studio__toolbar p { margin: 0; color: var(--cfg-text-muted); font-size: 13px; }
  .tabs { display: flex; gap: 0; overflow: auto; border: 1px solid var(--cfg-border); border-radius: var(--cfg-radius-s); background: var(--cfg-bg-2); }
  .tabs button { border: 0; border-right: 1px solid var(--cfg-border); background: transparent; color: var(--cfg-text-muted); padding: 8px 12px; font-weight: 800; font-size: 11px; text-transform: uppercase; white-space: nowrap; }
  .tabs button.active { background: var(--cfg-accent-strong); color: white; }
  .specimen { padding: clamp(16px, 4vw, 28px); border-radius: var(--cfg-radius); background: var(--sf-color-bg); color: var(--sf-color-text); border: 1px solid var(--cfg-border); overflow: hidden; }
  .specimen__measure { display: grid; grid-template-columns: .5fr .75fr 1fr; gap: 6px; margin-bottom: 16px; color: var(--cfg-text-faint); font-size: 10px; text-transform: uppercase; letter-spacing: .08em; }
  .specimen__measure span { border-top: 2px solid var(--cfg-border-strong); padding-top: 4px; }
  h1,h2,h3,h4,p { margin: 0; }
  h1 { font-size: calc(clamp(42px, 7vw, 74px) * var(--type-scale, 1)); line-height: .95; text-wrap: var(--sf-heading-text-wrap, balance); letter-spacing: var(--sf-h1-letter-spacing, -.02em); }
  h2 { font-size: calc(clamp(32px, 5vw, 54px) * var(--type-scale, 1)); line-height: 1; text-wrap: var(--sf-heading-text-wrap, balance); }
  h3 { font-size: calc(clamp(24px, 3.5vw, 38px) * var(--type-scale, 1)); margin-top: 8px; }
  h4 { font-size: calc(clamp(19px, 2.6vw, 28px) * var(--type-scale, 1)); margin-top: 8px; }
  code { display: block; margin-top: 8px; font-size: 18px; }
  p { margin-top: 12px; color: var(--sf-color-text--muted); font-size: 16px; line-height: var(--sf-leading-normal, 1.5); max-width: 68ch; text-wrap: var(--sf-body-text-wrap, pretty); }
  .mini-previews { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .mini-previews article { padding: 12px; border: 1px solid var(--cfg-border); border-radius: var(--cfg-radius-s); background: var(--cfg-bg-2); display: grid; gap: 4px; }
  .mini-previews b { font-size: 12px; }
  .mini-previews span, .mini-previews code { color: var(--cfg-text-muted); font-size: 12px; margin: 0; }
  @media (max-width: 760px) { .mini-previews { grid-template-columns: 1fr; } }
</style>
