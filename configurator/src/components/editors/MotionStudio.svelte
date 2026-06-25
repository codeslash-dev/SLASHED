<script>
  import { STUDIO_PANELS, resolveStudioPanels } from '../../lib/studioSchema.js';
  import StudioFrame from './StudioFrame.svelte';
  import StudioControls from './StudioControls.svelte';

  const panels = resolveStudioPanels(STUDIO_PANELS.motion);
  const durations = ['instant', 'fast', 'normal', 'slow'];
  const easings = ['linear', 'in', 'out', 'spring'];
</script>

<StudioFrame {panels} title="Motion Studio" description="Durations, easing and animation presets shown as live interactions: see timing, curves and UI states without guessing from token names.">
  <div class="motion-studio">

    <section class="duration-lab" aria-label="Duration scale preview">
      <div class="lab-copy"><strong>Speed scale</strong><span>Motion scale controls the feel of every duration without editing each preset by hand.</span></div>
      <div class="motion-rails">
        {#each durations as duration}
          <div><span class={duration}>{duration}</span><b>--sf-duration-{duration}</b></div>
        {/each}
      </div>
    </section>

    <section class="easing-lab" aria-label="Easing curve preview">
      {#each easings as easing}
        <article><b>{easing}</b><span class={easing}></span><small>--sf-ease-{easing}</small></article>
      {/each}
    </section>

    <section class="preset-lab" aria-label="Animation presets preview">
      <article class="enter">enter</article>
      <article class="hover">hover</article>
      <article class="exit">exit</article>
      <article class="shimmer">shimmer</article>
    </section>

    <section class="reduced-lab" aria-label="Reduced motion preview">
      <b>Reduced motion check</b>
      <p>When motion scale approaches zero, the interface should still communicate state changes with opacity and color.</p>
      <div><span></span><span></span><span></span></div>
    </section>
  </div>

    {#snippet controls(activePanel)}
      <StudioControls groups={activePanel.groups} />
    {/snippet}
</StudioFrame>

<style>
  .motion-studio { display: grid; gap: 12px; }
  .duration-lab, .easing-lab article, .preset-lab article, .reduced-lab { border: 1px solid var(--cfg-border); border-radius: var(--cfg-radius); background: var(--cfg-bg-2); }
  .duration-lab { display: grid; grid-template-columns: minmax(190px, .45fr) 1fr; gap: 14px; padding: 14px; overflow: hidden; }
  .lab-copy { display: grid; align-content: center; gap: 6px; }
  .lab-copy strong, .reduced-lab b { font-size: 13px; text-transform: uppercase; letter-spacing: .06em; }
  .lab-copy span, .reduced-lab p, .easing-lab small { color: var(--cfg-text-muted); font-size: 12px; line-height: 1.45; }
  .motion-rails { display: grid; gap: 12px; overflow: hidden; }
  .motion-rails div { display: grid; grid-template-columns: 1fr minmax(120px, auto); align-items: center; gap: 10px; }
  .motion-rails span { width: 88px; text-align: center; padding: 8px 12px; border-radius: 999px; background: var(--cfg-accent-strong); color: white; animation: move var(--sf-duration-normal, 300ms) var(--sf-ease-in-out, ease-in-out) infinite alternate; }
  .motion-rails .instant { animation-duration: var(--sf-duration-instant, 75ms); }
  .motion-rails .fast { animation-duration: var(--sf-duration-fast, 150ms); }
  .motion-rails .slow { animation-duration: var(--sf-duration-slow, 600ms); }
  .motion-rails b { color: var(--cfg-text-muted); font-size: 11px; }
  .easing-lab { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
  .easing-lab article { display: grid; gap: 8px; padding: 12px; }
  .easing-lab b { text-transform: uppercase; font-size: 11px; letter-spacing: .06em; }
  .easing-lab span { display: block; height: 58px; border-left: 1px solid var(--cfg-border-strong); border-bottom: 1px solid var(--cfg-border-strong); background: linear-gradient(135deg, transparent 48%, var(--cfg-accent-strong) 49% 52%, transparent 53%); border-radius: 8px; }
  .easing-lab .in { background: radial-gradient(circle at 85% 85%, var(--cfg-accent-strong) 0 6px, transparent 7px), linear-gradient(145deg, transparent 58%, var(--cfg-accent-strong) 59% 62%, transparent 63%); }
  .easing-lab .out { background: radial-gradient(circle at 20% 20%, var(--cfg-accent-strong) 0 6px, transparent 7px), linear-gradient(145deg, transparent 38%, var(--cfg-accent-strong) 39% 42%, transparent 43%); }
  .easing-lab .spring { background: repeating-radial-gradient(ellipse at 50% 70%, transparent 0 10px, color-mix(in oklab, var(--cfg-accent-strong) 70%, transparent) 11px 13px); }
  .preset-lab { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
  .preset-lab article { min-height: 96px; display: grid; place-items: center; text-transform: uppercase; font-weight: 900; letter-spacing: .06em; transition: transform var(--sf-duration-normal) var(--sf-ease-out), box-shadow var(--sf-duration-normal) var(--sf-ease-out), opacity var(--sf-duration-fast) var(--sf-ease-in); }
  .enter { animation: enter var(--sf-duration-normal) var(--sf-ease-out) infinite alternate; }
  .hover:hover { transform: translateY(-4px) scale(1.02); box-shadow: var(--sf-shadow-m); }
  .exit { animation: exit var(--sf-duration-slow) var(--sf-ease-in) infinite alternate; }
  .shimmer { background: linear-gradient(90deg, var(--cfg-bg-2), var(--cfg-accent-soft), var(--cfg-bg-2)); background-size: 220% 100%; animation: shimmer var(--sf-duration-slower, 900ms) var(--sf-ease-in-out) infinite; }
  .reduced-lab { display: grid; gap: 8px; padding: 14px; }
  .reduced-lab p { margin: 0; }
  .reduced-lab div { display: flex; gap: 8px; }
  .reduced-lab span { inline-size: 36px; block-size: 10px; border-radius: 999px; background: var(--cfg-accent-soft); opacity: var(--sf-state-pending-opacity, .65); }
  @keyframes move { to { transform: translateX(min(360px, 42vw)); } }
  @keyframes enter { from { transform: translateY(8px); opacity: .4; } to { transform: translateY(0); opacity: 1; } }
  @keyframes exit { from { opacity: 1; } to { opacity: .45; transform: scale(.96); } }
  @keyframes shimmer { to { background-position: -220% 0; } }
  @media (max-width: 860px) { .duration-lab, .easing-lab, .preset-lab { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 560px) { .duration-lab, .easing-lab, .preset-lab { grid-template-columns: 1fr; } }
  @media (prefers-reduced-motion: reduce) {
    .motion-rails span, .enter, .exit, .shimmer { animation: none; }
    .preset-lab article { transition: none; }
  }
</style>
