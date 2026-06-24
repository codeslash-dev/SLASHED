<script>
  import { STUDIO_GROUPS, resolveStudioGroups } from '../../lib/studioSchema.js';
  import StudioFrame from './StudioFrame.svelte';
  import StudioControls from './StudioControls.svelte';
  const levels = ['xs', 's', 'm', 'l', 'xl', '2xl'];
  const groups = resolveStudioGroups(STUDIO_GROUPS.shadows);
</script>

<StudioFrame title="Shadow Studio" description="Elevation stack pokazuje siłę, kolor i dark-mode charakter cieni w kontekście komponentów.">
  <div class="shadow-studio">
    <section class="stack">{#each levels as l}<article style:box-shadow={`var(--sf-shadow-${l}, var(--sf-shadow-m))`}><b>{l}</b><span>surface</span></article>{/each}</section>
    <section class="media"><h4>Media card glow</h4><p>Text and image overlays use the same shadow language.</p></section>
    <StudioControls {groups} />
  </div>
</StudioFrame>

<style>
  .shadow-studio { display: grid; gap: 12px; }
  .stack { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; align-items: end; padding: 14px; border-radius: 16px; background: var(--cfg-bg-2); }
  .stack article { min-height: 76px; border-radius: 14px; background: var(--sf-color-raised); border: 1px solid var(--sf-color-border); display: grid; place-items: center; gap: 2px; }
  .stack b { text-transform: uppercase; color: var(--cfg-text); }
  .stack span { color: var(--cfg-text-muted); font-size: 11px; }
  .media { min-height: 150px; display: grid; align-content: end; padding: 18px; border-radius: 18px; background: linear-gradient(135deg, var(--cfg-accent-soft), var(--cfg-accent)); color: white; text-shadow: var(--sf-text-shadow-m); box-shadow: var(--sf-shadow-glow), var(--sf-shadow-l); }
  .media h4, .media p { margin: 0; }
  @media (max-width: 800px) { .stack { grid-template-columns: repeat(2, 1fr); } }
</style>
