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
    <ol class="studio__steps" aria-label="Studio workflow">
      <li>01 Preview</li><li>02 Tune</li><li>03 Verify</li>
    </ol>
  </div>
  <div class="studio__surface">{@render children?.()}</div>
</section>

<style>
  .studio { display: grid; grid-template-columns: minmax(190px, .36fr) minmax(0, 1fr); gap: 18px; padding: 18px; border: 1px solid var(--cfg-border); border-radius: var(--cfg-radius-l); background: radial-gradient(circle at 0 0, color-mix(in oklab, var(--cfg-accent) 16%, transparent), transparent 34%), linear-gradient(135deg, color-mix(in oklab, var(--cfg-accent) 8%, transparent), transparent 48%), var(--cfg-surface); overflow: hidden; }
  .studio__copy { position: sticky; top: 10px; align-self: start; display: grid; gap: 10px; }
  .studio__copy p { margin: 0; color: var(--cfg-accent); font-size: 11px; font-weight: 900; letter-spacing: .1em; text-transform: uppercase; }
  .studio__copy h3 { margin: 0; font-size: clamp(22px, 3vw, 30px); line-height: 1.02; letter-spacing: -.03em; }
  .studio__copy span { display: block; color: var(--cfg-text-muted); font-size: 13px; line-height: 1.45; }
  .studio__steps { display: grid; gap: 6px; margin-top: 6px; list-style: none; padding: 0; }
  .studio__steps li { padding: 7px 9px; border: 1px solid var(--cfg-border); border-radius: 999px; background: var(--cfg-bg-2); color: var(--cfg-text-muted); font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; }
  .studio__surface { min-width: 0; }
  @media (max-width: 820px) {
    .studio { grid-template-columns: 1fr; padding: 12px; }
    .studio__copy { position: static; }
    .studio__copy h3 { font-size: clamp(18px, 4vw, 26px); }
    .studio__copy span { display: none; }
    .studio__steps { grid-template-columns: repeat(3, 1fr); }
  }
</style>
