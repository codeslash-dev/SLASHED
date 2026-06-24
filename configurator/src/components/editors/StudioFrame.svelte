<script>
  import { overrides, ui } from '../../lib/store.svelte.js';
  import { buildPreviewDeclarations } from '../../lib/preview.js';
  let { title, eyebrow = 'Studio', description = '', tone = 'primary', children } = $props();
  const stageStyle = $derived(buildPreviewDeclarations(overrides, ui.previewTheme));
</script>

<section class="studio studio--{tone}" style={stageStyle}>
  <div class="studio__copy">
    <p>{eyebrow}</p>
    <h3>{title}</h3>
    {#if description}<span>{description}</span>{/if}
  </div>
  <div class="studio__surface">{@render children?.()}</div>
</section>

<style>
  .studio { display:grid; grid-template-columns:minmax(180px,.42fr) minmax(0,1fr); gap:18px; padding:18px; border:1px solid var(--cfg-border); border-radius:var(--cfg-radius-l); background:linear-gradient(135deg, color-mix(in oklab, var(--cfg-accent) 9%, transparent), transparent 45%), var(--cfg-surface); overflow:hidden; }
  .studio__copy p { margin:0 0 6px; color:var(--cfg-accent); font-size:11px; font-weight:900; letter-spacing:.1em; text-transform:uppercase; }
  .studio__copy h3 { margin:0; font-size:24px; line-height:1.05; }
  .studio__copy span { display:block; margin-top:8px; color:var(--cfg-text-muted); font-size:13px; }
  .studio__surface { min-width:0; }
  @media(max-width:820px){ .studio { grid-template-columns:1fr; } }
</style>
