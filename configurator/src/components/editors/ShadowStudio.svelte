<script>
  import { tokenByName } from '../../lib/model.js';
  import StudioFrame from './StudioFrame.svelte';
  import StudioControls from './StudioControls.svelte';

  const panel = (label, description, tokens) => ({ label, description, groups: [{ title: label, hint: description, tokens: tokens.map((name) => tokenByName.get(name)).filter(Boolean) }] });
  const levels = ['xs', 's', 'm', 'l', 'xl', '2xl'];
  const panels = [
    panel('Elevation', 'Global shadow strength, color and elevation outputs.', ['--sf-shadow-strength', '--sf-shadow-lightness', '--sf-shadow-color', '--sf-shadow-xs', '--sf-shadow-s', '--sf-shadow-m', '--sf-shadow-l', '--sf-shadow-xl', '--sf-shadow-2xl']),
    panel('Surfaces', 'Depth for cards and raised surfaces.', ['--sf-shadow-s', '--sf-shadow-m', '--sf-shadow-l']),
    panel('Overlays', 'Modal and popover depth plus glow color.', ['--sf-shadow-xl', '--sf-shadow-2xl', '--sf-shadow-glow-color']),
    panel('Text & media', 'Text, drop and media glow shadows.', ['--sf-text-shadow-s', '--sf-text-shadow-m', '--sf-text-shadow-l', '--sf-drop-shadow-s', '--sf-drop-shadow-m', '--sf-drop-shadow-l', '--sf-shadow-glow-color']),
  ];
</script>

<StudioFrame {panels} title="Shadow Studio" description="Elevation stack shows strength, colour and dark-mode character across cards, popovers, dialogs and media.">
  <div class="shadow-studio">

    <section class="elevation-lab" aria-label="Elevation scale preview">
      <div class="lab-copy"><strong>Elevation stack</strong><span>Compare every shadow level on the same surface and tune global strength/lightness once.</span></div>
      <div class="stack">
        {#each levels as level}<article style:box-shadow={`var(--sf-shadow-${level}, var(--sf-shadow-m))`}><b>{level}</b><span>surface</span></article>{/each}
      </div>
    </section>

    <section class="surface-lab" aria-label="Surface and overlay preview">
      <article class="base-card"><small>Card</small><b>Surface shadow</b><p>Subtle depth for normal content.</p></article>
      <article class="popover"><small>Popover</small><b>Floating layer</b><p>Medium elevation above UI.</p></article>
      <article class="dialog"><small>Dialog</small><b>Modal overlay</b><p>Strong depth for interruption.</p></article>
    </section>

    <section class="media-lab" aria-label="Text and media shadow preview">
      <article class="media"><h4>Media card glow</h4><p>Text and image overlays use the same shadow language.</p></article>
      <article class="text-shadow"><small>Text shadows</small><h3>Readable over media</h3><p>Drop and text shadows protect contrast on rich backgrounds.</p></article>
    </section>
  </div>

    {#snippet controls(activePanel)}
      <StudioControls groups={activePanel.groups} />
    {/snippet}
</StudioFrame>

<style>
  .shadow-studio { display: grid; gap: 12px; }
  .elevation-lab, .surface-lab article, .media-lab article { border: 1px solid var(--cfg-border); border-radius: var(--cfg-radius); background: var(--cfg-bg-2); }
  .elevation-lab { display: grid; grid-template-columns: minmax(190px, .45fr) 1fr; gap: 14px; padding: 14px; }
  .lab-copy { display: grid; align-content: center; gap: 6px; }
  .lab-copy strong { font-size: 13px; text-transform: uppercase; letter-spacing: .06em; }
  .lab-copy span { color: var(--cfg-text-muted); font-size: 12px; line-height: 1.45; }
  .stack { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; align-items: end; padding: 8px; border-radius: 16px; background: var(--cfg-surface); }
  .stack article { min-height: 76px; border-radius: 14px; background: var(--sf-color-raised); border: 1px solid var(--sf-color-border); display: grid; place-items: center; gap: 2px; }
  .stack b, .surface-lab small, .media-lab small { text-transform: uppercase; color: var(--cfg-text); font-size: 11px; letter-spacing: .06em; }
  .stack span, .surface-lab p, .media-lab p { color: var(--cfg-text-muted); font-size: 12px; }
  .surface-lab { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; padding: 18px; border-radius: 18px; background: radial-gradient(circle at 20% 10%, var(--cfg-accent-soft), transparent 32%), var(--cfg-bg-2); }
  .surface-lab article { min-height: 142px; display: grid; align-content: end; gap: 4px; padding: 14px; background: var(--sf-color-raised); }
  .base-card { box-shadow: var(--sf-shadow-s); }
  .popover { transform: translateY(-8px); box-shadow: var(--sf-shadow-l); }
  .dialog { transform: translateY(-18px); box-shadow: var(--sf-shadow-2xl); }
  .surface-lab b, .surface-lab p, .media-lab h3, .media-lab h4, .media-lab p { margin: 0; }
  .media-lab { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .media { min-height: 170px; display: grid; align-content: end; padding: 18px; border-radius: 18px; background: linear-gradient(135deg, var(--cfg-accent-soft), var(--cfg-accent)); color: white; text-shadow: var(--sf-text-shadow-m); box-shadow: var(--sf-shadow-glow), var(--sf-shadow-l); }
  .media p { color: color-mix(in oklab, white 82%, transparent); }
  .text-shadow { min-height: 170px; display: grid; align-content: center; gap: 8px; padding: 18px; background: linear-gradient(135deg, #151923, var(--cfg-accent)); color: white; }
  .text-shadow h3 { text-shadow: var(--sf-text-shadow-l); }
  .text-shadow p { color: color-mix(in oklab, white 75%, transparent); text-shadow: var(--sf-text-shadow-s); }
  @media (max-width: 900px) { .elevation-lab, .media-lab { grid-template-columns: 1fr; } .stack { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 640px) { .surface-lab, .stack { grid-template-columns: 1fr; } .popover, .dialog { transform: none; } }
</style>
