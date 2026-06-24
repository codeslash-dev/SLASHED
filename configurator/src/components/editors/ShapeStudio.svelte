<script>
  import { STUDIO_GROUPS, resolveStudioGroups } from '../../lib/studioSchema.js';
  import StudioFrame from './StudioFrame.svelte';
  import StudioControls from './StudioControls.svelte';
  const samples = ['Button', 'Input', 'Card', 'Badge'];
  const groups = resolveStudioGroups(STUDIO_GROUPS.borders);
</script>

<StudioFrame title="Shape Studio" description="Radius, border, divider i focus ring na realnych kształtach komponentów.">
  <div class="shape-studio">
    <section class="shapes">{#each samples as n}<div><span>{n}</span></div>{/each}</section>
    <section class="focus-demo"><button>Focused action</button><hr /><p>Divider and border rhythm preview</p></section>
    <StudioControls {groups} />
  </div>
</StudioFrame>

<style>
  .shape-studio { display: grid; gap: 12px; }
  .shapes { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  .shapes div { min-height: 92px; display: grid; place-items: center; border: var(--sf-border-width-1, 1px) var(--sf-border-style, solid) var(--sf-color-border); border-radius: var(--sf-radius-l); background: var(--sf-color-raised); }
  .shapes span { padding: 8px 12px; border-radius: var(--sf-radius-m); background: var(--cfg-bg-2); }
  .focus-demo { padding: 14px; border: var(--sf-border-width-1, 1px) solid var(--sf-color-border); border-radius: var(--sf-radius-xl); background: var(--cfg-bg-2); }
  .focus-demo button { border: 0; border-radius: var(--sf-radius-m); background: var(--cfg-accent-strong); color: #fff; padding: 10px 14px; box-shadow: 0 0 0 var(--sf-focus-ring-width, 2px) var(--sf-color-border--focus), 0 0 0 calc(var(--sf-focus-ring-width, 2px) + var(--sf-focus-ring-offset, 2px)) var(--cfg-bg-2); }
  .focus-demo hr { margin: 18px 0; border: 0; border-top: var(--sf-divider-width, 1px) var(--sf-divider-style, solid) var(--sf-color-border); }
  .focus-demo p { margin: 0; color: var(--cfg-text-muted); }
  @media (max-width: 640px) { .shapes { grid-template-columns: repeat(2, 1fr); } }
</style>
