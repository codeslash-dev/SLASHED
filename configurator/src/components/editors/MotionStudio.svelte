<script>
  import { STUDIO_GROUPS, resolveStudioGroups } from '../../lib/studioSchema.js';
  import StudioFrame from './StudioFrame.svelte';
  import StudioControls from './StudioControls.svelte';
  const groups = resolveStudioGroups(STUDIO_GROUPS.motion);
</script>

<StudioFrame title="Motion Studio" description="Durations, easing i animation presets jako żywe interakcje, nie martwe wartości.">
  <div class="motion-studio">
    <section class="motion"><span class="fast">fast</span><span class="normal">normal</span><span class="slow">slow</span></section>
    <section class="cards"><article>enter</article><article>hover</article><article>exit</article></section>
    <StudioControls {groups} />
  </div>
</StudioFrame>

<style>
  .motion-studio { display: grid; gap: 12px; }
  .motion { display: grid; gap: 12px; padding: 16px; border-radius: 14px; background: var(--cfg-bg-2); overflow: hidden; }
  .motion span { width: 92px; text-align: center; padding: 8px 12px; border-radius: 999px; background: var(--cfg-accent-strong); color: white; animation: move var(--sf-duration-normal, 300ms) var(--sf-ease-in-out, ease-in-out) infinite alternate; }
  .motion .fast { animation-duration: var(--sf-duration-fast, 150ms); }
  .motion .slow { animation-duration: var(--sf-duration-slow, 600ms); }
  .cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .cards article { padding: 20px; border-radius: 14px; background: var(--cfg-surface); border: 1px solid var(--cfg-border); transition: transform var(--sf-duration-normal) var(--sf-ease-out), box-shadow var(--sf-duration-normal) var(--sf-ease-out); }
  .cards article:hover { transform: translateY(-4px) scale(1.02); box-shadow: var(--sf-shadow-m); }
  @keyframes move { to { transform: translateX(min(360px, 55vw)); } }
  @media (max-width: 640px) { .cards { grid-template-columns: 1fr; } }
</style>
