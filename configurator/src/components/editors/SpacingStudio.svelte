<script>
  import { STUDIO_GROUPS, resolveStudioGroups } from '../../lib/studioSchema.js';
  import StudioFrame from './StudioFrame.svelte';
  import StudioControls from './StudioControls.svelte';
  import ScaleGenerator from '../ScaleGenerator.svelte';
  import QuickKnobs from '../QuickKnobs.svelte';
  import { KNOBS_BY_DOMAIN } from '../../lib/domains.js';

  const steps = ['2xs', 'xs', 's', 'm', 'l', 'xl', '2xl', '3xl'];
  const workflow = ['Scale', 'Rhythm', 'Components', 'Sections'];
  const groups = resolveStudioGroups(STUDIO_GROUPS.spacing);
  const knobs = KNOBS_BY_DOMAIN.spacing ?? [];
</script>

<StudioFrame title="Spacing Studio" description="Scale ruler, rhythm and layout preview — from the global space multiplier down to real component and section gaps.">
  <div class="spacing-studio">
    <nav class="workflow" aria-label="Spacing workflow">
      {#each workflow as step, index (step)}<span><b>{index + 1}</b>{step}</span>{/each}
    </nav>

    <section class="scale-lab" aria-label="Space map">
      <div class="scale-lab__intro">
        <strong>Space map</strong>
        <span>Every step uses the same multiplier, so the whole framework keeps one rhythm.</span>
      </div>
      <div class="ruler">
        {#each steps as s, i}
          <div><span style:width={`calc(${18 + i * 18}px * var(--sf-space-scale, 1))`}></span><b>{s}</b></div>
        {/each}
      </div>
    </section>

    <section class="rhythm-preview" aria-label="Rhythm preview">
      <article class="section-card">
        <small>Section padding</small>
        <div class="section-card__inner">
          <h3>Marketing section</h3>
          <p>Large vertical space should feel intentional, not random.</p>
        </div>
      </article>
      <article class="stack-card">
        <small>Content gap</small>
        <h4>Stack rhythm</h4>
        <p>Paragraph spacing</p>
        <p>List spacing</p>
        <button>Action spacing</button>
      </article>
    </section>

    <section class="component-grid" aria-label="Component spacing preview">
      <article><b>Card</b><p>Component padding</p></article>
      <article><b>Form</b><label for="spacing-field">Input gap</label><input id="spacing-field" placeholder="Field spacing" /></article>
      <article><b>Cluster</b><div><span>A</span><span>B</span><span>C</span></div></article>
    </section>

    <ScaleGenerator kinds={['space']} collapsible />
    <QuickKnobs {knobs} title="Scaling" blurb="Global spacing multipliers live inside Spacing Studio so All variables can remain the only section below it." />

    <StudioControls {groups} />
  </div>
</StudioFrame>

<style>
  .spacing-studio { display: grid; gap: 12px; }
  .workflow { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
  .workflow span { display: flex; align-items: center; gap: 8px; padding: 9px 10px; border: 1px solid var(--cfg-border); border-radius: var(--cfg-radius-s); background: var(--cfg-bg-2); color: var(--cfg-text-muted); font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; }
  .workflow b { display: grid; place-items: center; inline-size: 20px; block-size: 20px; border-radius: 999px; background: var(--cfg-accent-strong); color: white; font-size: 10px; }
  .scale-lab { display: grid; grid-template-columns: minmax(190px, .5fr) 1fr; gap: 14px; padding: 14px; border: 1px solid var(--cfg-border); border-radius: var(--cfg-radius); background: var(--cfg-bg-2); }
  .scale-lab__intro { display: grid; align-content: center; gap: 6px; }
  .scale-lab__intro strong { font-size: 13px; text-transform: uppercase; letter-spacing: .06em; }
  .scale-lab__intro span { color: var(--cfg-text-muted); font-size: 12px; line-height: 1.45; }
  .ruler { display: grid; gap: 8px; align-content: center; }
  .ruler div { display: grid; grid-template-columns: 1fr 42px; align-items: center; gap: 10px; }
  .ruler span { display: block; height: 12px; border-radius: 999px; background: linear-gradient(90deg, var(--cfg-accent-strong), var(--cfg-accent-soft)); justify-self: end; }
  .ruler b { font-size: 11px; text-transform: uppercase; color: var(--cfg-text-muted); }
  .rhythm-preview { display: grid; grid-template-columns: 1.15fr .85fr; gap: var(--sf-content-gap, 1rem); }
  .section-card, .stack-card, .component-grid article { border: 1px solid var(--cfg-border); border-radius: var(--cfg-radius); background: var(--cfg-surface); }
  .section-card { padding: var(--sf-section-pad, clamp(2rem, 6vw, 5rem)); }
  .section-card__inner { padding: var(--sf-component-pad, 1rem); border-radius: var(--cfg-radius-s); background: var(--cfg-bg-2); }
  .stack-card { display: grid; gap: var(--sf-content-gap, .75rem); align-content: start; padding: var(--sf-component-pad, 1rem); }
  .section-card small, .stack-card small { color: var(--cfg-text-muted); text-transform: uppercase; font-weight: 800; letter-spacing: .06em; }
  h3, h4, p { margin: 0; }
  .stack-card button { justify-self: start; border: 0; border-radius: 999px; padding: .7em 1em; background: var(--cfg-accent-strong); color: white; }
  .component-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--sf-gap, 1rem); }
  .component-grid article { min-height: 120px; display: grid; align-content: start; gap: var(--sf-content-gap, .75rem); padding: var(--sf-component-pad, 1rem); }
  .component-grid input { min-width: 0; border: 1px solid var(--cfg-border-strong); border-radius: var(--cfg-radius-s); padding: .75em; background: var(--cfg-bg-2); color: var(--cfg-text); }
  .component-grid div { display: flex; flex-wrap: wrap; gap: var(--sf-gap, .75rem); }
  .component-grid span { display: grid; place-items: center; inline-size: 34px; block-size: 34px; border-radius: 999px; background: var(--cfg-accent-soft); }
  @media (max-width: 820px) { .scale-lab, .rhythm-preview, .component-grid { grid-template-columns: 1fr; } }
  @media (max-width: 640px) { .workflow { grid-template-columns: 1fr 1fr; } }
</style>
