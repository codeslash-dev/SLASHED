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
   * Any change anywhere in the form re-runs the deriver, the inline
   * `style` attribute re-renders, and the swatches/text update. No DOM
   * walking, no per-input change handlers, no order-of-operations
   * footguns.
   *
   * Scope is intentionally limited to what's *visible* in the preview:
   * brand + status colors (swatches and accent buttons) and font
   * families (sample heading + paragraph). Things like font-size
   * clamps, spacing aliases, motion durations etc. are not previewed
   * here; they affect the framework's generated stylesheet but don't
   * render meaningfully inside this small box, and adding them would
   * just inflate the preview into a second admin form.
   */
  import { tokens, meta } from '../lib/stores.svelte.js';
  import { generateExportCSS } from '../lib/export.js';

  /** Brand color names rendered as swatches; mirrors the legacy preview. */
  const brand = ['primary', 'secondary', 'tertiary', 'action', 'neutral', 'base'];
  /** Status colors rendered alongside brand, same as legacy. */
  const statuses = ['success', 'warning', 'error', 'info', 'danger'];

  /** Shorthand accessors for default color hints from meta. */
  const defaultColors = meta.defaults?.colors ?? {};

  /**
   * Build inline CSS custom properties for the preview container.
   *
   * Setting vars on the container via the style attribute is safe —
   * Svelte escapes attribute values, so no {@html} injection is needed.
   * Custom properties cascade to all descendants, so var(--sf-color-…)
   * and var(--sf-font-…) on swatches/text resolve through the
   * container's inline style.
   *
   * Falls back to meta.defaults.colors.*_hex_hints when no override is
   * stored, so swatches show real colors even before the user touches
   * anything (fixes the grey-swatch bug, issue #145).
   */
  const inlineStyle = $derived.by(() => {
    const pairs = [];
    const colors = tokens.colors ?? {};
    const typography = tokens.typography ?? {};

    for (const name of brand) {
      const v = colors[`brand_${name}`] ?? defaultColors.brand_hex_hints?.[name];
      if (v) pairs.push(`--sf-color-${name}-light:${v}`);
      const vd = colors[`brand_dark_${name}`] ?? defaultColors.brand_dark_hex_hints?.[name];
      if (vd) pairs.push(`--sf-color-${name}-dark:${vd}`);
    }
    for (const name of statuses) {
      const v = colors[`status_${name}`] ?? defaultColors.status_hex_hints?.[name];
      if (v) pairs.push(`--sf-color-${name}-light:${v}`);
      const vd = colors[`status_dark_${name}`] ?? defaultColors.status_dark_hex_hints?.[name];
      if (vd) pairs.push(`--sf-color-${name}-dark:${vd}`);
    }
    if (typography.font_body)    pairs.push(`--sf-font-body:${typography.font_body}`);
    if (typography.font_heading) pairs.push(`--sf-font-heading:${typography.font_heading}`);

    return pairs.join(';');
  });

  /** Full CSS override output — mirrors what the plugin emits server-side. */
  const css = $derived(generateExportCSS(tokens));
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
  .slashed-preview__type-heading {
    font-family: var(--sf-font-heading, system-ui, sans-serif);
    margin: 8px 0 6px;
    font-size: 22px;
    color: #1d2327;
  }
  .slashed-preview__type-body {
    font-family: var(--sf-font-body, system-ui, sans-serif);
    color: #2c3338;
    margin: 0 0 16px;
    max-width: 640px;
  }
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
  .slashed-preview__dark-section {
    margin-top: 14px;
    padding-top: 12px;
    border-top: 1px solid #e9eaeb;
  }
  .slashed-preview__dark-heading {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #50575e;
    margin: 0 0 8px;
  }
  .slashed-preview__dark-bg {
    background: #1d2327;
    border-radius: 6px;
    padding: 10px 12px;
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

  <p class="slashed-preview__type-heading">
    The quick brown fox jumps over the lazy dog
  </p>
  <p class="slashed-preview__type-body">
    This is a preview of your design token configuration. Adjust values above
    and see changes reflected here in real time. Brand and status colors are
    rendered as swatches; the heading and this paragraph reflect the current
    body and heading font stacks.
  </p>

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
    {#each statuses as name (name)}
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

  <div class="slashed-preview__dark-section">
    <p class="slashed-preview__dark-heading">Dark mode</p>
    <div class="slashed-preview__dark-bg">
      <div class="slashed-preview__swatches">
        {#each brand as name (name)}
          <div
            class="slashed-preview__swatch"
            style:background={`var(--sf-color-${name}-dark, #333)`}
            title={`${name} dark`}
          >
            {name}
          </div>
        {/each}
        {#each statuses as name (name)}
          <div
            class="slashed-preview__swatch"
            style:background={`var(--sf-color-${name}-dark, #333)`}
            title={`${name} dark`}
          >
            {name}
          </div>
        {/each}
      </div>
    </div>
  </div>

  <div class="slashed-preview__caption">
    Generated CSS:
    <code>{css || '/* (defaults — no overrides set) */'}</code>
  </div>
</div>
