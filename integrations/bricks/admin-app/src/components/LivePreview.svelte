<script>
  /**
   * Live preview panel.
   *
   * The legacy version was ~120 lines of jQuery DOM querying:
   * - read every form field by id
   * - manually concat CSS declarations
   * - write the result into a <style> tag.
   *
   * Here it's a $derived expression off the reactive `tokens` store.
   * Any change anywhere in the form re-runs the deriver, the <style>
   * element re-renders, and the swatches/text update. No DOM walking,
   * no per-input change handlers, no order-of-operations footguns.
   */
  import { tokens } from '../lib/stores.svelte.js';

  /** Brand color names rendered as swatches; mirrors the legacy preview. */
  const brand = ['primary', 'secondary', 'tertiary', 'action', 'neutral', 'base'];

  /**
   * Build inline CSS custom properties for the preview container.
   *
   * Setting vars on the container via the style attribute is safe — Svelte
   * escapes attribute values, so no {@html} injection is needed. Custom
   * properties cascade to all descendants, so var(--sf-color-*-light) on
   * swatches/buttons resolves through the container's inline style.
   */
  const inlineStyle = $derived.by(() => {
    const pairs = [];
    const colors = tokens.colors ?? {};

    for (const name of brand) {
      const v = colors[`brand_${name}`];
      if (v) pairs.push(`--sf-color-${name}-light:${v}`);
    }
    for (const name of ['success', 'warning', 'error', 'info', 'danger']) {
      const v = colors[`status_${name}`];
      if (v) pairs.push(`--sf-color-${name}-light:${v}`);
    }
    return pairs.join(';');
  });

  /** Text representation shown in the "Generated CSS" code block. */
  const css = $derived.by(() => {
    const decls = [];
    const colors = tokens.colors ?? {};

    for (const name of brand) {
      const v = colors[`brand_${name}`];
      if (v) decls.push(`--sf-color-${name}-light: ${v}`);
    }
    for (const name of ['success', 'warning', 'error', 'info', 'danger']) {
      const v = colors[`status_${name}`];
      if (v) decls.push(`--sf-color-${name}-light: ${v}`);
    }
    if (decls.length === 0) return '';
    return `.slashed-preview {\n  ${decls.join(';\n  ')};\n}`;
  });
</script>

<style>
  .slashed-preview {
    background: white;
    border: 1px solid #c3c4c7;
    border-radius: 4px;
    padding: 20px;
    margin-top: 8px;
  }
  .slashed-preview h3 { margin-top: 0; }
  .slashed-preview__swatches {
    display: flex;
    gap: 10px;
    margin-top: 10px;
    flex-wrap: wrap;
  }
  .slashed-preview__swatch {
    width: 56px;
    height: 56px;
    border-radius: 6px;
    border: 1px solid #c3c4c7;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    font-size: 10px;
    color: white;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    padding: 4px;
  }
  .slashed-preview__buttons {
    display: flex;
    gap: 8px;
    margin-top: 14px;
  }
  .slashed-preview__btn {
    color: white;
    padding: 8px 16px;
    border-radius: 4px;
    font-weight: 500;
    border: none;
    cursor: default;
  }
  .slashed-preview__caption {
    margin-top: 16px;
    color: #50575e;
    font-size: 12px;
  }
  .slashed-preview__caption code {
    display: block;
    background: #f6f7f7;
    padding: 8px;
    border-radius: 3px;
    margin-top: 4px;
    white-space: pre-wrap;
    font-size: 11px;
    max-height: 120px;
    overflow: auto;
  }
</style>

<div class="slashed-preview" style={inlineStyle}>
  <h3>Live preview</h3>
  <div class="slashed-preview__swatches">
    {#each brand as name (name)}
      <div
        class="slashed-preview__swatch"
        style:background={`var(--sf-color-${name}-light, #ddd)`}
        title={name}
      >
        {name}
      </div>
    {/each}
  </div>
  <div class="slashed-preview__buttons">
    <span
      class="slashed-preview__btn"
      style:background={'var(--sf-color-primary-light, #4338ca)'}
    >Primary</span>
    <span
      class="slashed-preview__btn"
      style:background={'var(--sf-color-action-light, #0891b2)'}
    >Action</span>
  </div>
  <div class="slashed-preview__caption">
    Generated CSS:
    <code>{css || '/* (defaults — no overrides set) */'}</code>
  </div>
</div>
