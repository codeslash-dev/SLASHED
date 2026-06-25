<script>
  import { STUDIO_GROUPS, resolveStudioGroups } from '../../lib/studioSchema.js';
  import StudioFrame from './StudioFrame.svelte';
  import StudioControls from './StudioControls.svelte';

  const groups = resolveStudioGroups(STUDIO_GROUPS.layout);
  const workflow = ['Containers', 'Grid', 'Measure', 'Anchors'];
  const devices = ['Mobile', 'Tablet', 'Desktop'];
</script>

<StudioFrame title="Layout Studio" description="Container, reading width, grid i global anchors pokazane jako system layoutu: od viewportu po realne sekcje, sidebar i sticky offsets.">
  <div class="layout-studio">
    <nav class="workflow" aria-label="Layout workflow">
      {#each workflow as step, index (step)}<span><b>{index + 1}</b>{step}</span>{/each}
    </nav>

    <section class="viewport-lab" aria-label="Viewport and container preview">
      <div class="viewport-lab__header">
        <strong>Container map</strong>
        <span>Compare narrow, prose, default and wide widths against the same viewport.</span>
      </div>
      <div class="device-strip">
        {#each devices as device (device)}<span>{device}</span>{/each}
      </div>
      <div class="container-rails">
        <span class="rail rail--wide"><b>wide</b></span>
        <span class="rail rail--default"><b>default</b></span>
        <span class="rail rail--prose"><b>prose</b></span>
        <span class="rail rail--narrow"><b>narrow</b></span>
      </div>
    </section>

    <section class="composition" aria-label="Grid and sidebar composition">
      <aside><b>Sidebar</b><small>Uses sidebar width and gutter</small></aside>
      <div class="grid-preview">
        <article><b>Card 1</b></article>
        <article><b>Card 2</b></article>
        <article><b>Card 3</b></article>
        <article class="wide-card"><b>Responsive grid</b><span>Cards collapse from multi-column to readable stacks.</span></article>
      </div>
    </section>

    <section class="measure-lab" aria-label="Reading measure and anchors">
      <article class="prose-card">
        <small>Reading width</small>
        <h3>Readable prose stays constrained</h3>
        <p>Text should not stretch across the full container. The prose rail keeps editorial content comfortable.</p>
      </article>
      <article class="anchor-card">
        <small>Global anchors</small>
        <div class="sticky-demo">Sticky offset</div>
        <button>Touch target</button>
      </article>
    </section>

    <div class="legend"><b>viewport</b><b>container</b><b>grid columns</b><b>reading width</b><b>sticky offsets</b></div>
    <StudioControls {groups} />
  </div>
</StudioFrame>

<style>
  .layout-studio { display: grid; gap: 12px; }
  .workflow { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
  .workflow span { display: flex; align-items: center; gap: 8px; padding: 9px 10px; border: 1px solid var(--cfg-border); border-radius: var(--cfg-radius-s); background: var(--cfg-bg-2); color: var(--cfg-text-muted); font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; }
  .workflow b { display: grid; place-items: center; inline-size: 20px; block-size: 20px; border-radius: 999px; background: var(--cfg-accent-strong); color: white; font-size: 10px; }
  .viewport-lab { display: grid; gap: 12px; padding: 16px; border: 1px dashed var(--cfg-border-strong); border-radius: 16px; background: var(--cfg-bg-2); }
  .viewport-lab__header { display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; align-items: baseline; }
  .viewport-lab__header strong { font-size: 13px; text-transform: uppercase; letter-spacing: .06em; }
  .viewport-lab__header span { color: var(--cfg-text-muted); font-size: 12px; }
  .device-strip { display: grid; grid-template-columns: .45fr .75fr 1fr; gap: 8px; align-items: end; }
  .device-strip span { border-top: 2px solid var(--cfg-border-strong); padding-top: 5px; color: var(--cfg-text-muted); font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: .08em; }
  .container-rails { position: relative; min-height: 180px; border-radius: 14px; border: 1px solid var(--cfg-border); background: linear-gradient(180deg, var(--cfg-surface), var(--cfg-bg-2)); overflow: hidden; }
  .rail { position: absolute; inset-block: 16px; left: 50%; transform: translateX(-50%); border: 2px solid color-mix(in oklab, var(--cfg-accent) 70%, transparent); border-radius: 14px; display: grid; align-items: start; justify-items: center; padding-top: 8px; color: var(--cfg-text-muted); font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: .08em; }
  .rail--wide { width: min(94%, var(--sf-container-wide, 90rem)); }
  .rail--default { width: min(82%, var(--sf-container-default, 72rem)); inset-block: 36px; }
  .rail--prose { width: min(62%, var(--sf-container-prose, 65ch)); inset-block: 56px; }
  .rail--narrow { width: min(42%, var(--sf-container-narrow, 48rem)); inset-block: 76px; }
  .composition { display: grid; grid-template-columns: minmax(140px, var(--sf-sidebar-width, 18rem)) 1fr; gap: var(--sf-gutter, 1rem); padding: 16px; border: 1px solid var(--cfg-border); border-radius: var(--cfg-radius); background: var(--cfg-bg-2); }
  aside { display: grid; align-content: end; min-height: 170px; padding: 14px; border-radius: 12px; background: var(--cfg-surface-3); }
  aside small { color: var(--cfg-text-muted); margin-top: 4px; }
  .grid-preview { display: grid; grid-template-columns: repeat(auto-fit, minmax(var(--sf-grid-min, 14rem), 1fr)); gap: var(--sf-gutter, 1rem); }
  .grid-preview article { min-height: 86px; border-radius: 12px; border: 1px solid var(--cfg-border); background: linear-gradient(135deg, var(--cfg-accent-soft), var(--cfg-surface)); padding: 14px; }
  .wide-card { grid-column: 1 / -1; display: grid; gap: 4px; }
  .wide-card span { color: var(--cfg-text-muted); }
  .measure-lab { display: grid; grid-template-columns: 1fr minmax(180px, .45fr); gap: 12px; }
  .prose-card, .anchor-card { padding: 16px; border: 1px solid var(--cfg-border); border-radius: var(--cfg-radius); background: var(--cfg-surface); }
  .prose-card { max-width: var(--sf-container-prose, 65ch); justify-self: center; }
  .prose-card small, .anchor-card small { color: var(--cfg-text-muted); text-transform: uppercase; font-weight: 900; letter-spacing: .06em; }
  .prose-card h3, .prose-card p { margin: 8px 0 0; }
  .prose-card p { color: var(--cfg-text-muted); line-height: 1.55; }
  .anchor-card { display: grid; gap: 10px; align-content: start; }
  .sticky-demo { position: relative; padding: 10px; border-radius: 10px; background: var(--cfg-bg-2); border-top: var(--sf-sticky-offset-mobile, 1rem) solid var(--cfg-accent-soft); }
  .anchor-card button { min-height: var(--sf-touch-target, 44px); border: 0; border-radius: 999px; background: var(--cfg-accent-strong); color: white; padding-inline: 16px; }
  .legend { display: flex; gap: 10px; flex-wrap: wrap; }
  .legend b { font-size: 11px; color: var(--cfg-text-muted); text-transform: uppercase; }
  @media (max-width: 840px) { .composition, .measure-lab { grid-template-columns: 1fr; } }
  @media (max-width: 640px) { .workflow, .device-strip { grid-template-columns: 1fr 1fr; } }
</style>
