<script>
  import { STUDIO_GROUPS, resolveStudioGroups } from '../../lib/studioSchema.js';
  import StudioFrame from './StudioFrame.svelte';
  import StudioControls from './StudioControls.svelte';
  const groups = resolveStudioGroups(STUDIO_GROUPS.effects);
</script>

<StudioFrame title="Effects Studio" description="Blur, opacity, scrim, mask fades i compositing pokazane jako gotowe UI patterns.">
  <div class="effects-studio">
    <section class="fx"><div><h4>Readable media card</h4><p>Scrim, blur and muted states preview.</p><button disabled>Disabled action</button></div></section>
    <section class="strip"><span></span><span></span><span></span><span></span></section>
    <StudioControls {groups} />
  </div>
</StudioFrame>

<style>
  .effects-studio { display: grid; gap: 12px; }
  .fx { min-height: 210px; border-radius: 18px; padding: 18px; display: flex; align-items: end; background: linear-gradient(var(--sf-scrim-direction, to top), var(--sf-scrim-color, rgba(0,0,0,.55)), transparent), linear-gradient(135deg, var(--cfg-accent), var(--cfg-accent-soft)); overflow: hidden; }
  .fx div { backdrop-filter: blur(var(--sf-blur, 12px)); background: color-mix(in oklab, var(--cfg-surface) 70%, transparent); border: 1px solid var(--cfg-border); border-radius: 14px; padding: 14px; box-shadow: var(--sf-shadow-m); }
  .fx h4, .fx p { margin: 0; }
  .fx p { opacity: var(--sf-opacity-muted, .72); }
  .fx button { margin-top: 10px; opacity: var(--sf-opacity-disabled, .45); }
  .strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; padding: 12px; border-radius: 14px; background: linear-gradient(90deg, transparent, var(--cfg-bg-2) var(--sf-mask-scrim-start, 2rem), var(--cfg-bg-2) calc(100% - var(--sf-mask-scrim-end, 2rem)), transparent); border: 1px solid var(--cfg-border); }
  .strip span { height: 54px; border-radius: 10px; background: var(--cfg-accent-soft); }
</style>
