<script>
  import { overrides } from '../../lib/store.svelte.js';
  import { resolveStudioGroups } from '../../lib/studioSchema.js';
  import ScaleGenerator from '../ScaleGenerator.svelte';
  import StudioFrame from './StudioFrame.svelte';
  import StudioControls from './StudioControls.svelte';

  const HEADING_LEVELS = ['All', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
  const PANELS = [
    { id: 'Headings', label: 'Headings', description: 'Framework-style controls for h1–h6 aliases, rhythm, tracking and wrapping.' },
    { id: 'Text', label: 'Text', description: 'Body copy, prose rhythm, text wrapping, line-height and reading measure.' },
    { id: 'Fonts', label: 'Fonts', description: 'Font stacks for body, headings and mono, plus OpenType feature and variation settings.' },
    { id: 'Scale', label: 'Scale', description: 'Generate the fluid type and display ramps directly inside Typography Studio.' },
    { id: 'Advanced', label: 'Advanced', description: 'Fine tune weights, display line heights, numeric variants and size-specific outputs.' },
  ];

  const HEADING_TOKENS = ['size', 'line-height', 'font-weight', 'letter-spacing', 'max-width'];
  const TEXT_GROUPS = [
    { title: 'Body', hint: 'Base paragraph defaults.', tokens: ['--sf-body-font-size', '--sf-body-line-height', '--sf-body-font-weight', '--sf-body-font-family', '--sf-body-color'] },
    { title: 'Prose', hint: 'Long-form content spacing.', tokens: ['--sf-prose-paragraph', '--sf-prose-heading-gap', '--sf-prose-list-gap', '--sf-prose-block-margin', '--sf-prose-media-margin'] },
    { title: 'Wrap', hint: 'Text wrapping behavior.', tokens: ['--sf-body-text-wrap', '--sf-heading-text-wrap'] },
    { title: 'Line-height', hint: 'Reusable leading scale.', tokens: ['--sf-leading-tight', '--sf-leading-snug', '--sf-leading-normal', '--sf-leading-relaxed', '--sf-leading-taper'] },
    { title: 'Measure', hint: 'Readable line lengths by text size.', tokens: ['--sf-text-xs-max-width', '--sf-text-s-max-width', '--sf-text-m-max-width', '--sf-text-l-max-width', '--sf-text-xl-max-width'] },
  ];
  const FONT_GROUPS = [
    { title: 'Font stacks', hint: 'Primary body, heading and monospace families.', tokens: ['--sf-font-body', '--sf-font-heading', '--sf-font-mono', '--sf-font-display'] },
    { title: 'Feature settings', hint: 'OpenType features, variation axes and numeric variants.', tokens: ['--sf-font-features', '--sf-font-variation', '--sf-font-numeric'] },
    { title: 'Role weights', hint: 'Weights applied to type roles.', tokens: ['--sf-font-weight-body', '--sf-font-weight-heading', '--sf-font-weight-display', '--sf-font-weight-strong'] },
  ];
  const ADVANCED_GROUPS = [
    { title: 'Display text', hint: 'Hero/display aliases and line-height.', tokens: ['--sf-text-display-s', '--sf-text-display-m', '--sf-text-display-l', '--sf-display-s-line-height', '--sf-display-m-line-height', '--sf-display-l-line-height', '--sf-text-display-scale'] },
    { title: 'Text outputs', hint: 'Generated text steps and per-size metadata.', tokens: ['--sf-text-2xs', '--sf-text-xs', '--sf-text-s', '--sf-text-m', '--sf-text-l', '--sf-text-xl', '--sf-text-2xl', '--sf-text-3xl', '--sf-text-4xl'] },
    { title: 'Emphasis', hint: 'Strong/em defaults and interactive weight.', tokens: ['--sf-body-strong-weight', '--sf-body-em-style', '--sf-font-weight-interactive'] },
  ];

  let active = $state('Headings');
  let headingScope = $state('All');
  const panel = $derived(PANELS.find((p) => p.id === active) ?? PANELS[0]);
  const headingGroups = $derived(resolveStudioGroups(headingScope === 'All'
    ? [
        { title: 'All headings', hint: 'Shared heading behavior.', tokens: ['--sf-heading-font-family', '--sf-heading-color', '--sf-heading-text-wrap', '--sf-font-weight-heading'] },
        ...['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].map((level) => ({
          title: level,
          hint: `${level} size, leading, weight, tracking and measure.`,
          tokens: HEADING_TOKENS.map((suffix) => `--sf-${level.toLowerCase()}-${suffix}`),
        })),
      ]
    : [{ title: headingScope, hint: `${headingScope} size, leading, weight, tracking and measure.`, tokens: HEADING_TOKENS.map((suffix) => `--sf-${headingScope.toLowerCase()}-${suffix}`) }]
  ));
  const groups = $derived(active === 'Headings' ? headingGroups : active === 'Text' ? resolveStudioGroups(TEXT_GROUPS) : active === 'Fonts' ? resolveStudioGroups(FONT_GROUPS) : active === 'Advanced' ? resolveStudioGroups(ADVANCED_GROUPS) : []);
  const headingFont = $derived(overrides['--sf-font-heading'] || 'var(--sf-font-heading)');
  const bodyFont = $derived(overrides['--sf-font-body'] || 'var(--sf-font-body)');
  const monoFont = $derived(overrides['--sf-font-mono'] || 'var(--sf-font-mono)');
  const scale = $derived(overrides['--sf-text-scale'] || 'var(--sf-text-scale, 1)');
</script>

<StudioFrame title="Typography Studio" description="Framework-inspired typography controls: tune headings, text, fonts, fluid scale and advanced details in one focused canvas." tone="type">
  <div class="type-studio">
    <div class="type-studio__toolbar">
      <div class="tabs" role="tablist" aria-label="Typography editing scope">
        {#each PANELS as p (p.id)}
          <button role="tab" aria-selected={active === p.id} class:active={active === p.id} onclick={() => (active = p.id)}>{p.label}</button>
        {/each}
      </div>
      <p>{panel.description}</p>
    </div>

    <div class="specimen" style:--type-scale={scale}>
      <div class="specimen__measure"><span>mobile</span><span>tablet</span><span>desktop</span></div>
      {#if active === 'Headings' || active === 'Scale' || active === 'Advanced'}
        <h1 style:font-family={headingFont}>The quick brown fox</h1>
        <h2 style:font-family={headingFont}>Jumps over the lazy dog</h2>
        <h3 style:font-family={headingFont}>Typography at every scale</h3>
        <h4 style:font-family={headingFont}>Fluid, readable, precise</h4>
        <h5 style:font-family={headingFont}>Composed hierarchy</h5>
        <h6 style:font-family={headingFont}>Small heading label</h6>
      {/if}
      {#if active === 'Text' || active === 'Fonts'}
        <p style:font-family={bodyFont}>Body: The quick brown fox jumps over the lazy dog. A short paragraph shows body rhythm, line height, measure and spacing at a glance.</p>
        <code style:font-family={monoFont}>Pixel-perfect control — const token = true;</code>
      {/if}
    </div>

    {#if active === 'Scale'}
      <ScaleGenerator kinds={['type', 'display']} />
    {:else}
      {#if active === 'Headings'}
        <div class="scope" role="group" aria-label="Heading level">
          {#each HEADING_LEVELS as level (level)}
            <button class:active={headingScope === level} aria-pressed={headingScope === level} onclick={() => (headingScope = level)}>{level}</button>
          {/each}
        </div>
      {/if}
      <div class="mini-previews">
        <article><b>Heading wrap</b><span>Balanced title blocks reduce awkward one-word lines.</span></article>
        <article><b>Body rhythm</b><span>Line height and content gap define reading comfort.</span></article>
        <article><b>Code / mono</b><code style:font-family={monoFont}>const token = true;</code></article>
      </div>
      <StudioControls {groups} />
    {/if}
  </div>
</StudioFrame>

<style>
  .type-studio { display: grid; gap: 12px; }
  .type-studio__toolbar { display: grid; gap: 8px; }
  .type-studio__toolbar p { margin: 0; color: var(--cfg-text-muted); font-size: 13px; }
  .tabs, .scope { display: flex; gap: 0; overflow: auto; border: 1px solid var(--cfg-border); border-radius: var(--cfg-radius-s); background: var(--cfg-bg-2); }
  .tabs button, .scope button { border: 0; border-right: 1px solid var(--cfg-border); background: transparent; color: var(--cfg-text-muted); padding: 8px 12px; font-weight: 800; font-size: 11px; text-transform: uppercase; white-space: nowrap; }
  .tabs button.active, .scope button.active { background: var(--cfg-accent-strong); color: white; }
  .specimen { padding: clamp(16px, 4vw, 28px); border-radius: var(--cfg-radius); background: var(--sf-color-bg); color: var(--sf-color-text); border: 1px solid var(--cfg-border); overflow: hidden; }
  .specimen__measure { display: grid; grid-template-columns: .5fr .75fr 1fr; gap: 6px; margin-bottom: 16px; color: var(--cfg-text-faint); font-size: 10px; text-transform: uppercase; letter-spacing: .08em; }
  .specimen__measure span { border-top: 2px solid var(--cfg-border-strong); padding-top: 4px; }
  h1,h2,h3,h4,h5,h6,p { margin: 0; }
  h1 { font-size: calc(clamp(42px, 7vw, 74px) * var(--type-scale, 1)); line-height: .95; text-wrap: var(--sf-heading-text-wrap, balance); letter-spacing: var(--sf-h1-letter-spacing, -.02em); }
  h2 { font-size: calc(clamp(32px, 5vw, 54px) * var(--type-scale, 1)); line-height: 1; text-wrap: var(--sf-heading-text-wrap, balance); }
  h3 { font-size: calc(clamp(24px, 3.5vw, 38px) * var(--type-scale, 1)); margin-top: 8px; }
  h4 { font-size: calc(clamp(19px, 2.6vw, 28px) * var(--type-scale, 1)); margin-top: 8px; }
  h5 { font-size: calc(clamp(16px, 2vw, 22px) * var(--type-scale, 1)); margin-top: 8px; }
  h6 { font-size: calc(clamp(13px, 1.6vw, 18px) * var(--type-scale, 1)); margin-top: 8px; text-transform: uppercase; letter-spacing: .08em; }
  code { display: block; margin-top: 8px; font-size: 18px; }
  p { margin-top: 12px; color: var(--sf-color-text--muted); font-size: 16px; line-height: var(--sf-leading-normal, 1.5); max-width: 68ch; text-wrap: var(--sf-body-text-wrap, pretty); }
  .mini-previews { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .mini-previews article { padding: 12px; border: 1px solid var(--cfg-border); border-radius: var(--cfg-radius-s); background: var(--cfg-bg-2); display: grid; gap: 4px; }
  .mini-previews b { font-size: 12px; }
  .mini-previews span, .mini-previews code { color: var(--cfg-text-muted); font-size: 12px; margin: 0; }
  @media (max-width: 760px) { .mini-previews { grid-template-columns: 1fr; } }
</style>
