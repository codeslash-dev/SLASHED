<script>
  import { overrides, ui } from '../../lib/store.svelte.js';
  import { buildPreviewDeclarations } from '../../lib/preview.js';
  let { title, eyebrow = 'Studio', description = '', tone = 'primary', panels = [], controls, children } = $props();
  let activePanelId = $state('');
  const selectedPanelId = $derived(activePanelId || panels[0]?.id || panels[0]?.label || '');
  const stageStyle = $derived(buildPreviewDeclarations(overrides, ui.previewTheme));
  const activePanel = $derived(panels.find((panel) => (panel.id ?? panel.label) === selectedPanelId) ?? panels[0]);
</script>

<section class="studio studio--{tone}" style={stageStyle}>
  <aside class="studio__nav" aria-label={`${title} navigation`}>
    <div class="studio__copy">
      <p>{eyebrow}</p>
      <h3>{title}</h3>
      {#if description}<span>{description}</span>{/if}
    </div>
    {#if panels.length}
      <nav class="studio__sections" aria-label="Studio sections">
        {#each panels as panel, index ((panel.id ?? panel.label))}
          <button
            type="button"
            class:active={(panel.id ?? panel.label) === selectedPanelId}
            aria-current={(panel.id ?? panel.label) === selectedPanelId ? 'step' : undefined}
            onclick={() => activePanelId = (panel.id ?? panel.label)}>
            <b>{String(index + 1).padStart(2, '0')}</b>
            <span>{panel.label}</span>
          </button>
        {/each}
      </nav>
    {/if}
  </aside>

  <main class="studio__surface" aria-label={`${title} preview canvas`}>{@render children?.(activePanel)}</main>

  {#if activePanel && controls}
    <aside class="studio__panel" aria-label={`${activePanel.label} controls`}>
      <div class="studio__panel-head">
        <p>Active section</p>
        <h4>{activePanel.label}</h4>
        {#if activePanel.description}<span>{activePanel.description}</span>{/if}
      </div>
      {@render controls(activePanel)}
    </aside>
  {/if}
</section>

<style>
  .studio { display: grid; grid-template-columns: minmax(170px, .26fr) minmax(0, 1fr) minmax(250px, .34fr); gap: 18px; padding: 18px; border: 1px solid var(--cfg-border); border-radius: var(--cfg-radius-l); background: radial-gradient(circle at 0 0, color-mix(in oklab, var(--cfg-accent) 16%, transparent), transparent 34%), linear-gradient(135deg, color-mix(in oklab, var(--cfg-accent) 8%, transparent), transparent 48%), var(--cfg-surface); overflow: visible; }
  .studio__nav, .studio__panel { position: sticky; top: 10px; align-self: start; display: grid; gap: 14px; min-width: 0; }
  .studio__copy { display: grid; gap: 10px; }
  .studio__copy p, .studio__panel-head p { margin: 0; color: var(--cfg-accent); font-size: 11px; font-weight: 900; letter-spacing: .1em; text-transform: uppercase; }
  .studio__copy h3 { margin: 0; font-size: clamp(22px, 3vw, 30px); line-height: 1.02; letter-spacing: -.03em; }
  .studio__copy span, .studio__panel-head span { display: block; color: var(--cfg-text-muted); font-size: 13px; line-height: 1.45; }
  .studio__sections { display: grid; gap: 8px; }
  .studio__sections button { display: flex; align-items: center; gap: 9px; width: 100%; padding: 9px 10px; border: 1px solid var(--cfg-border); border-radius: 999px; background: var(--cfg-bg-2); color: var(--cfg-text-muted); cursor: pointer; font-size: 11px; font-weight: 900; letter-spacing: .07em; text-align: left; text-transform: uppercase; }
  .studio__sections button.active { border-color: var(--cfg-accent); background: var(--cfg-accent-soft); color: var(--cfg-text); }
  .studio__sections b { display: grid; place-items: center; inline-size: 22px; block-size: 22px; border-radius: 999px; background: var(--cfg-accent-strong); color: white; font-size: 10px; }
  .studio__surface { min-width: 0; }
  .studio__panel { max-height: calc(100vh - 120px); overflow: auto; padding-right: 4px; }
  .studio__panel-head { display: grid; gap: 6px; padding: 12px; border: 1px solid var(--cfg-border); border-radius: var(--cfg-radius); background: var(--cfg-bg-2); }
  .studio__panel-head h4 { margin: 0; font-size: 16px; }
  @media (max-width: 1100px) { .studio { grid-template-columns: 1fr; padding: 12px; } .studio__nav, .studio__panel { position: static; max-height: none; } .studio__copy h3 { font-size: clamp(18px, 4vw, 26px); } .studio__copy span { display: none; } .studio__sections { grid-template-columns: repeat(4, minmax(130px, 1fr)); overflow-x: auto; padding-bottom: 4px; } }
  @media (max-width: 640px) { .studio__sections { grid-template-columns: 1fr 1fr; } }
</style>
