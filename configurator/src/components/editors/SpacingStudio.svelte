<script>
  import { STUDIO_GROUPS, resolveStudioGroups } from '../../lib/studioSchema.js';
  import StudioFrame from './StudioFrame.svelte';
  import StudioControls from './StudioControls.svelte';
  const steps = ['2xs', 'xs', 's', 'm', 'l', 'xl', '2xl', '3xl'];
  const groups = resolveStudioGroups(STUDIO_GROUPS.spacing);
</script>

<StudioFrame title="Spacing Studio" description="Ruler, rhythm i layout preview zamiast samych wartości liczbowych.">
  <div class="spacing-studio">
    <section class="canvas">
      <div class="ruler">{#each steps as s, i}<div><span style:width={`${18 + i * 18}px`}></span><b>{s}</b></div>{/each}</div>
      <div class="cards"><article><b>Card</b><p>Component padding</p></article><article><b>Stack</b><p>Content rhythm</p></article><article><b>Section</b><p>Large vertical space</p></article></div>
    </section>
    <StudioControls {groups} />
  </div>
</StudioFrame>

<style>
  .spacing-studio { display: grid; gap: 12px; }
  .canvas { display: grid; grid-template-columns: minmax(180px, .7fr) 1fr; gap: 14px; padding: 14px; border: 1px solid var(--cfg-border); border-radius: var(--cfg-radius); background: var(--cfg-bg-2); }
  .ruler { display: grid; gap: 8px; align-content: center; }
  .ruler div { display: grid; grid-template-columns: 1fr 42px; align-items: center; gap: 10px; }
  .ruler span { display: block; height: 12px; border-radius: 999px; background: var(--cfg-accent-strong); justify-self: end; }
  .ruler b { font-size: 11px; text-transform: uppercase; color: var(--cfg-text-muted); }
  .cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--sf-content-gap, 1rem); }
  .cards article { min-height: 112px; border: 1px solid var(--cfg-border); border-radius: var(--cfg-radius); background: var(--cfg-surface); padding: var(--sf-component-pad, 1rem); }
  .cards b, .cards p { margin: 0; }
  .cards p { margin-top: var(--sf-content-gap, .75rem); color: var(--cfg-text-muted); }
  @media (max-width: 760px) { .canvas, .cards { grid-template-columns: 1fr; } }
</style>
