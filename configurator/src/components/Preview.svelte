<script>
  /**
   * Scoped live preview. Every framework default + the user's overrides are
   * applied as custom properties on the preview root via an inline style
   * string, so the sample UI below resolves tokens exactly as the real
   * framework would — including light-dark() and oklch(from …).
   */
  import { overrides, ui } from '../lib/store.svelte.js';
  import { buildPreviewDeclarations } from '../lib/preview.js';

  const styleStr = $derived(buildPreviewDeclarations(overrides, ui.previewTheme));

  const brand = ['primary', 'secondary', 'tertiary', 'action', 'neutral', 'base'];
  const status = ['success', 'warning', 'error', 'info', 'danger'];
  const spaceSteps = ['2xs', 'xs', 's', 'm', 'l', 'xl', '2xl', '3xl'];
</script>

<section class="preview">
  <header class="preview__bar">
    <strong>Live preview</strong>
    <div class="preview__theme" role="group" aria-label="Preview theme">
      <button
        class="preview__theme-btn"
        class:preview__theme-btn--on={ui.previewTheme === 'light'}
        onclick={() => (ui.previewTheme = 'light')}
      >Light</button>
      <button
        class="preview__theme-btn"
        class:preview__theme-btn--on={ui.previewTheme === 'dark'}
        onclick={() => (ui.previewTheme = 'dark')}
      >Dark</button>
    </div>
  </header>

  <div class="preview__stage" style={styleStr}>
    <div class="pv">
      <h2 class="pv__h">The quick brown fox</h2>
      <p class="pv__p">
        Jumps over the lazy dog. This paragraph is rendered with the framework's
        body font, text size and color tokens. <a class="pv__a" href="#a">A sample link</a>
        sits inline, and <code class="pv__code">--sf-color-code</code> styles inline code.
      </p>

      <div class="pv__btns">
        <button class="pv__btn pv__btn--primary">Primary</button>
        <button class="pv__btn pv__btn--action">Action</button>
        <button class="pv__btn pv__btn--ghost">Ghost</button>
      </div>

      <div class="pv__swatches">
        {#each brand as c}
          <div class="pv__sw" style="background: var(--sf-color-{c});">
            <span style="color: var(--sf-color-text--on-{c}, #fff);">{c}</span>
          </div>
        {/each}
      </div>
      <div class="pv__swatches">
        {#each status as c}
          <div class="pv__sw" style="background: var(--sf-color-{c});">
            <span style="color: var(--sf-color-text--on-{c}, #fff);">{c}</span>
          </div>
        {/each}
      </div>

      <div class="pv__cards">
        <div class="pv__card">
          <strong>Card</strong>
          <p>Surface, border, radius &amp; shadow tokens.</p>
        </div>
        <div class="pv__card pv__card--inset">
          <strong>Inset</strong>
          <p>Inset surface variant.</p>
        </div>
      </div>

      <div class="pv__space">
        {#each spaceSteps as s}
          <div class="pv__space-row">
            <code>--sf-space-{s}</code>
            <span class="pv__space-bar" style="inline-size: var(--sf-space-{s});"></span>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
  .preview {
    display: flex;
    flex-direction: column;
    min-height: 0;
    height: 100%;
    background: var(--cfg-surface);
    border-left: 1px solid var(--cfg-border);
  }
  .preview__bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px;
    border-bottom: 1px solid var(--cfg-border);
  }
  .preview__theme {
    display: inline-flex;
    border: 1px solid var(--cfg-border-strong);
    border-radius: var(--cfg-radius-s);
    overflow: hidden;
  }
  .preview__theme-btn {
    background: var(--cfg-surface-2);
    color: var(--cfg-text-muted);
    border: none;
    padding: 4px 12px;
    font-size: 12px;
  }
  .preview__theme-btn--on {
    background: var(--cfg-accent-strong);
    color: #fff;
  }
  .preview__stage {
    flex: 1;
    overflow: auto;
    /* The token-driven surface fills the stage so theme changes are obvious. */
    background: var(--sf-color-bg, #fff);
    color: var(--sf-color-text, #111);
  }

  /* Sample UI — deliberately authored against framework tokens with sane
     fallbacks so the preview still renders if a token is absent. */
  .pv {
    font-family: var(--sf-font-body, system-ui, sans-serif);
    padding: clamp(16px, 3vw, 32px);
    display: flex;
    flex-direction: column;
    gap: var(--sf-space-m, 16px);
  }
  .pv__h {
    font-family: var(--sf-font-heading, inherit);
    font-size: var(--sf-text-2xl, 2rem);
    line-height: var(--sf-leading-tight, 1.15);
    margin: 0;
    color: var(--sf-color-heading, inherit);
  }
  .pv__p {
    font-size: var(--sf-text-m, 1rem);
    margin: 0;
    max-width: 60ch;
    color: var(--sf-color-text--muted, inherit);
  }
  .pv__a {
    color: var(--sf-color-link, #4f8cff);
  }
  .pv__code {
    font-family: var(--sf-font-mono, monospace);
    background: var(--sf-color-inset, rgba(127, 127, 127, 0.15));
    padding: 0.1em 0.4em;
    border-radius: var(--sf-radius-s, 4px);
    color: var(--sf-color-code, inherit);
  }
  .pv__btns {
    display: flex;
    gap: var(--sf-space-s, 8px);
    flex-wrap: wrap;
  }
  .pv__btn {
    border: 1px solid transparent;
    border-radius: var(--sf-radius-m, 8px);
    padding: 0.5em 1.1em;
    font-weight: 600;
    font-size: var(--sf-text-s, 0.9rem);
  }
  .pv__btn--primary {
    background: var(--sf-color-primary, #4f8cff);
    color: var(--sf-color-text--on-primary, #fff);
  }
  .pv__btn--action {
    background: var(--sf-color-action, #0891b2);
    color: var(--sf-color-text--on-action, #fff);
  }
  .pv__btn--ghost {
    background: transparent;
    border-color: var(--sf-color-border, currentColor);
    color: inherit;
  }
  .pv__swatches {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: 6px;
  }
  .pv__sw {
    aspect-ratio: 3 / 2;
    border-radius: var(--sf-radius-m, 8px);
    border: 1px solid var(--sf-color-border, rgba(127, 127, 127, 0.3));
    display: flex;
    align-items: flex-end;
    padding: 6px 8px;
    font-size: 12px;
    text-transform: capitalize;
  }
  .pv__cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--sf-space-s, 8px);
  }
  .pv__card {
    background: var(--sf-color-surface, rgba(127, 127, 127, 0.06));
    border: 1px solid var(--sf-color-border, rgba(127, 127, 127, 0.3));
    border-radius: var(--sf-radius-m, 8px);
    box-shadow: var(--sf-shadow-m, 0 2px 8px rgba(0, 0, 0, 0.12));
    padding: var(--sf-space-m, 16px);
  }
  .pv__card p {
    margin: 6px 0 0;
    font-size: var(--sf-text-s, 0.9rem);
    color: var(--sf-color-text--muted, inherit);
  }
  .pv__card--inset {
    background: var(--sf-color-inset, rgba(127, 127, 127, 0.12));
    box-shadow: none;
  }
  .pv__space {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .pv__space-row {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 12px;
  }
  .pv__space-row code {
    font-family: var(--sf-font-mono, monospace);
    min-width: 13ch;
    color: var(--sf-color-text--muted, inherit);
  }
  .pv__space-bar {
    block-size: 12px;
    background: var(--sf-color-action, #4f8cff);
    border-radius: 3px;
  }
</style>
