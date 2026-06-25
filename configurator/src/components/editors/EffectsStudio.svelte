<script>
  import { STUDIO_GROUPS, resolveStudioGroups } from '../../lib/studioSchema.js';
  import StudioFrame from './StudioFrame.svelte';
  import StudioControls from './StudioControls.svelte';
  import StudioWorkflow from './StudioWorkflow.svelte';

  const groups = resolveStudioGroups(STUDIO_GROUPS.effects);
  const workflow = ['Glass', 'Opacity', 'Scrim', 'Masks'];
  const states = ['normal', 'muted', 'disabled', 'pending'];
</script>

<StudioFrame title="Effects Studio" description="Blur, opacity, scrim and mask fades shown as ready UI patterns: media cards, disabled states and scroll fade overlays.">
  <div class="effects-studio">
    <StudioWorkflow steps={workflow} ariaLabel="Effects workflow" />

    <section class="glass-lab" aria-label="Glass and blur preview">
      <div class="glass-card"><small>Glass & blur</small><h4>Readable media card</h4><p>Scrim, blur and muted states preview.</p><button>Primary action</button></div>
      <div class="blur-scale"><span>low</span><span>medium</span><span>high</span></div>
    </section>

    <section class="state-lab" aria-label="Opacity states preview">
      {#each states as state}
        <article class={state}><b>{state}</b><span>{state === 'disabled' ? 'Disabled action' : state === 'pending' ? 'Pending feedback' : 'Readable state'}</span></article>
      {/each}
    </section>

    <section class="scrim-lab" aria-label="Scrim direction and media overlay preview">
      <article><small>Scrim overlay</small><h3>Text over image</h3><p>Direction and color keep content readable without manual gradients.</p></article>
      <article class="no-scrim"><small>Without scrim</small><h3>Harder to read</h3><p>Preview makes the difference obvious.</p></article>
    </section>

    <section class="mask-lab" aria-label="Mask fade preview">
      <strong>Mask fade</strong>
      <div class="strip"><span></span><span></span><span></span><span></span><span></span></div>
    </section>

    <StudioControls {groups} />
  </div>
</StudioFrame>

<style>
  .effects-studio { display: grid; gap: 12px; }
  .glass-lab, .state-lab article, .scrim-lab article, .mask-lab { border: 1px solid var(--cfg-border); border-radius: var(--cfg-radius); background: var(--cfg-bg-2); }
  .glass-lab { min-height: 240px; display: grid; grid-template-columns: 1fr minmax(150px, .35fr); gap: 14px; align-items: end; padding: 18px; background: linear-gradient(135deg, var(--cfg-accent), var(--cfg-accent-soft)); overflow: hidden; }
  .glass-card { backdrop-filter: blur(var(--sf-blur, 12px)); background: color-mix(in oklab, var(--cfg-surface) 72%, transparent); border: 1px solid var(--cfg-border); border-radius: 16px; padding: 16px; box-shadow: var(--sf-shadow-m); }
  .glass-card small, .scrim-lab small, .mask-lab strong { text-transform: uppercase; font-size: 11px; font-weight: 900; letter-spacing: .06em; color: var(--cfg-text-muted); }
  .glass-card h4, .glass-card p, .scrim-lab h3, .scrim-lab p { margin: 6px 0 0; }
  .glass-card p { opacity: var(--sf-opacity-muted, .72); }
  .glass-card button { margin-top: 12px; border: 0; border-radius: 999px; padding: 9px 12px; background: var(--cfg-accent-strong); color: white; }
  .blur-scale { display: grid; gap: 8px; }
  .blur-scale span { min-height: 54px; display: grid; place-items: center; border-radius: 12px; color: white; background: color-mix(in oklab, var(--cfg-surface) 35%, transparent); backdrop-filter: blur(var(--sf-blur, 12px)); border: 1px solid color-mix(in oklab, white 35%, transparent); text-transform: uppercase; font-size: 11px; font-weight: 900; }
  .state-lab { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
  .state-lab article { min-height: 98px; display: grid; align-content: end; gap: 4px; padding: 12px; }
  .state-lab b { text-transform: uppercase; font-size: 11px; letter-spacing: .06em; }
  .state-lab span { color: var(--cfg-text-muted); font-size: 12px; }
  .muted { opacity: var(--sf-opacity-muted, .72); }
  .disabled { opacity: var(--sf-opacity-disabled, .45); filter: grayscale(.25); }
  .pending { opacity: var(--sf-state-pending-opacity, .65); background: linear-gradient(90deg, var(--cfg-bg-2), var(--cfg-accent-soft), var(--cfg-bg-2)); background-size: 220% 100%; animation: shimmer 1.4s linear infinite; }
  .scrim-lab { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .scrim-lab article { min-height: 190px; display: grid; align-content: end; padding: 18px; color: white; background: linear-gradient(var(--sf-scrim-direction, to top), var(--sf-scrim-color, rgba(0,0,0,.55)), transparent), linear-gradient(135deg, var(--cfg-accent), #101827); text-shadow: var(--sf-scrim-text-shadow, var(--sf-text-shadow-m)); }
  .scrim-lab .no-scrim { background: linear-gradient(135deg, var(--cfg-accent), #101827); color: color-mix(in oklab, white 72%, transparent); text-shadow: none; }
  .scrim-lab p { color: color-mix(in oklab, white 78%, transparent); }
  .mask-lab { display: grid; gap: 10px; padding: 14px; }
  .strip { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; padding: 12px; border-radius: 14px; background: linear-gradient(90deg, transparent, var(--cfg-surface) var(--sf-mask-scrim-start, 2rem), var(--cfg-surface) calc(100% - var(--sf-mask-scrim-end, 2rem)), transparent); border: 1px solid var(--cfg-border); }
  .strip span { height: 54px; border-radius: 10px; background: var(--cfg-accent-soft); }
  @keyframes shimmer { to { background-position: -220% 0; } }
  @media (prefers-reduced-motion: reduce) { .pending { animation: none; } }
  @media (max-width: 820px) { .glass-lab, .scrim-lab, .state-lab { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 560px) { .glass-lab, .scrim-lab, .state-lab { grid-template-columns: 1fr; } }
</style>
