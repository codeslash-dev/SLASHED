<script>
  import { overrides, ui } from '../../lib/store.svelte.js';
  import { buildPreviewDeclarations } from '../../lib/preview.js';
  let {
    title,
    eyebrow = 'Studio',
    description = '',
    tone = 'primary',
    nav = [],
    activePanel,
    onSelectPanel,
    sidebar,
    children,
  } = $props();
  let internalActivePanel = $state();
  const panelNav = $derived(nav.map((item) => (typeof item === 'string' ? { id: item, label: item } : item)));
  const frameSlug = $derived(String(title).replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase());
  const firstPanel = $derived(panelNav[0]?.id);
  const selectedPanel = $derived(activePanel ?? internalActivePanel ?? firstPanel);
  const selectedPanelSlug = $derived(selectedPanel ? String(selectedPanel).replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase() : undefined);
  const panelId = $derived(selectedPanelSlug ? `studio-panel-${frameSlug}-${selectedPanelSlug}` : undefined);
  const stageStyle = $derived(buildPreviewDeclarations(overrides, ui.previewTheme));

  function selectPanel(panel) {
    internalActivePanel = panel.id;
    onSelectPanel?.(panel.id, panel);
  }

  function getPanelSlug(panel) {
    return String(panel.id).replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase();
  }
</script>

<section class="studio studio--{tone}" style={stageStyle}>
  <div class="studio__copy">
    <p>{eyebrow}</p>
    <h3>{title}</h3>
    {#if description}<span>{description}</span>{/if}
    {#if sidebar}
      {@render sidebar?.({ activePanel: selectedPanel, panelId })}
    {:else if panelNav.length}
      <nav class="studio__nav" aria-label={`${title} sections`}>
        <div class="studio__tabs" role="tablist" aria-orientation="vertical" aria-label={`${title} sections`}>
          {#each panelNav as panel, index (panel.id)}
            <button
              type="button"
              role="tab"
              class:active={selectedPanel === panel.id}
              aria-selected={selectedPanel === panel.id}
              aria-controls={panel.panelId ?? `studio-panel-${frameSlug}-${getPanelSlug(panel)}`}
              id={`studio-tab-${frameSlug}-${getPanelSlug(panel)}`}
              tabindex={selectedPanel === panel.id ? 0 : -1}
              onclick={() => selectPanel(panel)}
            >
              <b>{String(index + 1).padStart(2, '0')}</b>
              <span>{panel.label}</span>
            </button>
          {/each}
        </div>
      </nav>
    {/if}
  </div>
  <div class="studio__surface" role="tabpanel" id={panelId} aria-labelledby={selectedPanelSlug ? `studio-tab-${frameSlug}-${selectedPanelSlug}` : undefined}>{@render children?.()}</div>
</section>

<style>
  .studio { display: grid; grid-template-columns: minmax(190px, .36fr) minmax(0, 1fr); gap: 18px; padding: 18px; border: 1px solid var(--cfg-border); border-radius: var(--cfg-radius-l); background: radial-gradient(circle at 0 0, color-mix(in oklab, var(--cfg-accent) 16%, transparent), transparent 34%), linear-gradient(135deg, color-mix(in oklab, var(--cfg-accent) 8%, transparent), transparent 48%), var(--cfg-surface); overflow: hidden; }
  .studio__copy { position: sticky; top: 10px; align-self: start; display: grid; gap: 10px; }
  .studio__copy p { margin: 0; color: var(--cfg-accent); font-size: 11px; font-weight: 900; letter-spacing: .1em; text-transform: uppercase; }
  .studio__copy h3 { margin: 0; font-size: clamp(22px, 3vw, 30px); line-height: 1.02; letter-spacing: -.03em; }
  .studio__copy span { display: block; color: var(--cfg-text-muted); font-size: 13px; line-height: 1.45; }
  .studio__nav { margin-top: 6px; }
  .studio__tabs { display: grid; gap: 6px; }
  .studio__tabs button { display: grid; grid-template-columns: auto 1fr; gap: 8px; align-items: center; width: 100%; padding: 8px 10px; border: 1px solid var(--cfg-border); border-radius: 999px; background: var(--cfg-bg-2); color: var(--cfg-text-muted); text-align: start; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; cursor: pointer; }
  .studio__tabs button.active { border-color: color-mix(in oklab, var(--cfg-accent) 50%, var(--cfg-border)); background: var(--cfg-accent-soft); color: var(--cfg-text); }
  .studio__tabs b { color: var(--cfg-accent); }
  .studio__surface { min-width: 0; }
  @media (max-width: 820px) {
    .studio { grid-template-columns: 1fr; padding: 12px; }
    .studio__copy { position: static; }
    .studio__copy h3 { font-size: clamp(18px, 4vw, 26px); }
    .studio__copy span { display: none; }
    .studio__tabs { grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); }
    .studio__tabs { overflow-x: auto; padding-bottom: 4px; }
  }
</style>
