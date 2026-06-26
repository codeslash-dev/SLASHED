<script>
  import { tokenByName } from '../../lib/model.js';
  import StudioFrame from './StudioFrame.svelte';
  import StudioControls from './StudioControls.svelte';

  const panel = (label, description, tokens) => ({ label, description, groups: [{ title: label, hint: description, tokens: tokens.map((name) => tokenByName.get(name)).filter(Boolean) }] });
  const panels = [
    panel('Radius', 'Corner scale from utility chips to cards.', ['--sf-radius-scale', '--sf-radius-xs', '--sf-radius-s', '--sf-radius-m', '--sf-radius-l', '--sf-radius-xl', '--sf-radius-full']),
    panel('Borders', 'Stroke weight and style for framed components.', ['--sf-border-scale', '--sf-border-style', '--sf-border-width-hairline', '--sf-border-width-1', '--sf-border-width-2']),
    panel('Dividers', 'Rule width and style for separating content.', ['--sf-divider-width', '--sf-divider-style']),
    panel('Focus', 'Keyboard focus ring width, offset and color.', ['--sf-focus-ring-width', '--sf-focus-ring-offset', '--sf-color-border--focus']),
  ];
  const radii = ['xs', 's', 'm', 'l', 'xl', 'full'];
  const components = ['Button', 'Input', 'Card', 'Badge'];
</script>

<StudioFrame {panels} title="Shape Studio" description="Radius, border, divider and focus ring shown as a complete shape system — from the corner scale down to accessible focus outlines.">
  <div class="shape-studio">

    <section class="radius-lab" aria-label="Radius scale preview">
      <div class="lab-copy"><strong>Radius system</strong><span>One scale controls components from sharp utility chips to fully pill-shaped actions.</span></div>
      <div class="radius-grid">
        {#each radii as radius (radius)}
          <article style:border-radius={`var(--sf-radius-${radius}, 1rem)`}><b>{radius}</b><span>--sf-radius-{radius}</span></article>
        {/each}
      </div>
    </section>

    <section class="component-lab" aria-label="Component shape preview">
      {#each components as item (item)}
        <article class:item-input={item === 'Input'} class:item-card={item === 'Card'}>
          <small>{item}</small>
          <span>{item === 'Input' ? 'Field outline' : item === 'Card' ? 'Surface radius' : 'Interactive shape'}</span>
        </article>
      {/each}
    </section>

    <section class="border-lab" aria-label="Border and divider preview">
      <article><b>Border stack</b><span class="line hairline"></span><span class="line one"></span><span class="line two"></span></article>
      <article><b>Divider rhythm</b><p>Content before divider</p><hr /><p>Content after divider</p></article>
      <article class="focus-card"><b>Focus ring</b><button>Focused action</button><small>Width + offset preview</small></article>
    </section>
  </div>

    {#snippet controls(activePanel)}
      <StudioControls groups={activePanel.groups} />
    {/snippet}
</StudioFrame>

<style>
  .shape-studio { display: grid; gap: 12px; }
  .radius-lab, .border-lab, .component-lab article { border: 1px solid var(--cfg-border); border-radius: var(--cfg-radius); background: var(--cfg-bg-2); }
  .radius-lab { display: grid; grid-template-columns: minmax(180px, .5fr) 1fr; gap: 14px; padding: 14px; }
  .lab-copy { display: grid; align-content: center; gap: 6px; }
  .lab-copy strong { font-size: 13px; text-transform: uppercase; letter-spacing: .06em; }
  .lab-copy span { color: var(--cfg-text-muted); font-size: 12px; line-height: 1.45; }
  .radius-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .radius-grid article { min-height: 76px; display: grid; align-content: end; gap: 2px; padding: 10px; border: var(--sf-border-width-1, 1px) var(--sf-border-style, solid) var(--sf-color-border); background: var(--sf-color-raised); }
  .radius-grid b, .component-lab small, .border-lab b { text-transform: uppercase; font-size: 11px; letter-spacing: .06em; }
  .radius-grid span, .component-lab span, .border-lab small, .border-lab p { color: var(--cfg-text-muted); font-size: 12px; }
  .component-lab { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
  .component-lab article { min-height: 104px; display: grid; align-content: end; gap: 4px; padding: var(--sf-component-pad, 1rem); border: var(--sf-border-width-1, 1px) var(--sf-border-style, solid) var(--sf-color-border); background: var(--sf-color-raised); }
  .component-lab article:nth-child(1) { border-radius: var(--sf-radius-full); }
  .component-lab .item-input { border-radius: var(--sf-radius-s); }
  .component-lab .item-card { border-radius: var(--sf-radius-xl); min-height: 132px; }
  .component-lab article:nth-child(4) { border-radius: var(--sf-radius-m); }
  .border-lab { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; padding: 14px; }
  .border-lab article { display: grid; gap: 10px; padding: 12px; border-radius: var(--sf-radius-l); background: var(--cfg-surface); border: var(--sf-border-width-1, 1px) var(--sf-border-style, solid) var(--sf-color-border); }
  .line { display: block; border-top-style: var(--sf-border-style, solid); border-color: var(--sf-color-border); }
  .hairline { border-top-width: var(--sf-border-width-hairline, .5px); }
  .one { border-top-width: var(--sf-border-width-1, 1px); }
  .two { border-top-width: var(--sf-border-width-2, 2px); }
  .border-lab hr { inline-size: 100%; border: 0; border-top: var(--sf-divider-width, 1px) var(--sf-divider-style, solid) var(--sf-color-border); }
  .border-lab p { margin: 0; }
  .focus-card button { justify-self: start; border: 0; border-radius: var(--sf-radius-m); background: var(--cfg-accent-strong); color: #fff; padding: 10px 14px; box-shadow: 0 0 0 var(--sf-focus-ring-width, 2px) var(--sf-color-border--focus), 0 0 0 calc(var(--sf-focus-ring-width, 2px) + var(--sf-focus-ring-offset, 2px)) var(--cfg-bg-2); }
  @media (max-width: 860px) { .radius-lab, .border-lab { grid-template-columns: 1fr; } .component-lab { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 560px) { .radius-grid, .component-lab { grid-template-columns: 1fr; } }
</style>
