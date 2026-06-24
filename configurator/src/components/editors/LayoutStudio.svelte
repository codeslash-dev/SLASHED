<script>
  import { STUDIO_GROUPS, resolveStudioGroups } from '../../lib/studioSchema.js';
  import StudioFrame from './StudioFrame.svelte';
  import StudioControls from './StudioControls.svelte';
  const groups = resolveStudioGroups(STUDIO_GROUPS.layout);
</script>

<StudioFrame title="Layout Studio" description="Container, reading width, grid i global anchors pokazane na jednym canvasie.">
  <div class="layout-studio">
    <section class="viewport"><div class="chrome"></div><div class="wide"><aside></aside><div class="content"><span></span><span></span><span></span></div></div><div class="measure prose"></div></section>
    <div class="legend"><b>viewport</b><b>container</b><b>grid columns</b><b>reading width</b></div>
    <StudioControls {groups} />
  </div>
</StudioFrame>

<style>
  .layout-studio { display: grid; gap: 12px; }
  .viewport { padding: 18px; border: 1px dashed var(--cfg-border-strong); border-radius: 16px; background: var(--cfg-bg-2); display: grid; gap: 14px; }
  .chrome { height: var(--sf-header-height-mobile, 3.5rem); border-radius: 12px; background: linear-gradient(90deg, var(--cfg-accent-soft), var(--cfg-surface-3)); border: 1px solid var(--cfg-border); }
  .wide { max-width: 92%; margin: auto; padding: 18px; border: 2px solid var(--cfg-accent); border-radius: 14px; display: grid; grid-template-columns: minmax(80px, 18rem) 1fr; gap: var(--sf-gutter, 1rem); }
  aside { border-radius: 10px; background: var(--cfg-surface-3); min-height: 90px; }
  .content { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
  .content span { min-height: 90px; border-radius: 10px; background: linear-gradient(135deg, var(--cfg-accent-soft), var(--cfg-surface-3)); border: 1px solid var(--cfg-border); }
  .measure { width: min(100%, var(--sf-container-prose, 65ch)); height: 12px; border-radius: 99px; background: var(--cfg-accent-strong); margin: auto; opacity: .75; }
  .legend { display: flex; gap: 10px; flex-wrap: wrap; }
  .legend b { font-size: 11px; color: var(--cfg-text-muted); text-transform: uppercase; }
  @media (max-width: 760px) { .wide, .content { grid-template-columns: 1fr; } }
</style>
