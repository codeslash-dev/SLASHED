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

  const brand = ['primary', 'secondary', 'tertiary', 'action', 'neutral', 'base'];
  const statuses = ['success', 'warning', 'error', 'info', 'danger'];
  const defaultColors = meta.defaults?.colors ?? {};

  // Auto-derivation formulas matching core/tokens.css verbatim.
  // Module-level so they're defined once, not recreated per render.
  const autoDarkStandard = (light) =>
    `oklch(from var(${light}) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)`;
  const autoDarkBase = (light) =>
    `oklch(from var(${light}) clamp(0.16, calc(1.18 - l), 0.24) calc(c * 0.5) h)`;
  const autoDark = (name) => {
    const light = `--sf-color-${name}-light`;
    return name === 'base' ? autoDarkBase(light) : autoDarkStandard(light);
  };

  /** Light / dark mode toggle for the preview panel. */
  let darkMode = $state(false);

  /**
   * Build inline CSS custom properties for the preview container.
   * Includes color vars, font vars, and computed preview-only radius/shadow
   * vars so the card component responds live to Misc tab changes.
   */
  const inlineStyle = $derived.by(() => {
    const pairs = [];
    const colors = tokens.colors ?? {};
    const typography = tokens.typography ?? {};
    const radius = tokens.radius ?? {};
    const shadows = tokens.shadows ?? {};

    // When dark overrides are disabled the framework auto-derives dark colors
    // via CSS relative color syntax. Mirror that exactly so the preview matches
    // what the front-end actually renders. When enabled, use stored values.
    const darkEnabled = colors.dark_overrides_enabled !== '0';

    for (const name of brand) {
      const v = colors[`brand_${name}`] ?? defaultColors.brand_hex_hints?.[name];
      if (v) pairs.push(`--sf-color-${name}-light:${v}`);
      const storedDark = darkEnabled ? colors[`brand_dark_${name}`] : '';
      pairs.push(`--sf-color-${name}-dark:${storedDark || autoDark(name)}`);
    }
    for (const name of statuses) {
      const v = colors[`status_${name}`] ?? defaultColors.status_hex_hints?.[name];
      if (v) pairs.push(`--sf-color-${name}-light:${v}`);
      const storedDark = darkEnabled ? colors[`status_dark_${name}`] : '';
      pairs.push(`--sf-color-${name}-dark:${storedDark || autoDark(name)}`);
    }
    if (typography.font_body)    pairs.push(`--sf-font-body:${typography.font_body}`);
    if (typography.font_heading) pairs.push(`--sf-font-heading:${typography.font_heading}`);

    // Radius preview vars derived from the radius_scale token.
    const rs = parseFloat(radius.radius_scale ?? meta.defaults?.radius?.radius_scale ?? 1) || 1;
    pairs.push(`--preview-radius-s:${Math.round(4 * rs)}px`);
    pairs.push(`--preview-radius-m:${Math.round(8 * rs)}px`);
    pairs.push(`--preview-radius-l:${Math.round(16 * rs)}px`);

    // Shadow preview var derived from shadow_strength token.
    const ssRaw = shadows.shadow_strength;
    const ss = ssRaw !== undefined && ssRaw !== ''
      ? parseFloat(ssRaw)
      : parseFloat(meta.defaults?.shadows?.shadow_strength ?? 0.08);
    pairs.push(`--preview-shadow:0 2px 8px 0 rgba(0,0,0,${(ss * 2).toFixed(3)}),0 1px 3px 0 rgba(0,0,0,${ss.toFixed(3)})`);

    return pairs.join(';');
  });

  /** The active color-mode suffix for all swatch/button lookups. */
  const mode = $derived(darkMode ? 'dark' : 'light');

  /** Full CSS override output — mirrors what the plugin emits server-side. */
  const css = $derived(generateExportCSS(tokens));
</script>

<style>
  .slashed-preview {
    background: #fff;
    border: 1px solid #c3c4c7;
    border-radius: 4px;
    padding: 20px;
    margin-top: 8px;
    transition: background 200ms, color 200ms;
  }
  .slashed-preview.is-dark {
    background: #1d2327;
    border-color: #3c434a;
    color: #f0f0f1;
  }

  /* ── Header ──────────────────────────────────────────────────────── */
  .slashed-preview__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  .slashed-preview__header h3 { margin: 0; }
  .slashed-preview.is-dark .slashed-preview__header h3 { color: #f0f0f1; }

  .slashed-preview__mode-toggle {
    display: flex;
    border: 1px solid #c3c4c7;
    border-radius: 4px;
    overflow: hidden;
  }
  .slashed-preview.is-dark .slashed-preview__mode-toggle {
    border-color: #3c434a;
  }
  .slashed-preview__mode-btn {
    padding: 4px 10px;
    font-size: 12px;
    background: transparent;
    border: none;
    cursor: pointer;
    color: #50575e;
    line-height: 1.4;
  }
  .slashed-preview.is-dark .slashed-preview__mode-btn { color: #a7aaad; }
  .slashed-preview__mode-btn.active {
    background: #2271b1;
    color: #fff;
  }
  .slashed-preview__mode-btn + .slashed-preview__mode-btn {
    border-left: 1px solid #c3c4c7;
  }
  .slashed-preview.is-dark .slashed-preview__mode-btn + .slashed-preview__mode-btn {
    border-left-color: #3c434a;
  }

  /* ── Typography ──────────────────────────────────────────────────── */
  .slashed-preview__type-heading {
    font-family: var(--sf-font-heading, system-ui, sans-serif);
    margin: 0 0 6px;
    font-size: 20px;
    color: #1d2327;
  }
  .slashed-preview.is-dark .slashed-preview__type-heading { color: #f0f0f1; }
  .slashed-preview__type-body {
    font-family: var(--sf-font-body, system-ui, sans-serif);
    color: #50575e;
    margin: 0 0 14px;
    font-size: 13px;
    line-height: 1.5;
  }
  .slashed-preview.is-dark .slashed-preview__type-body { color: #a7aaad; }

  /* ── Swatches ────────────────────────────────────────────────────── */
  .slashed-preview__swatches {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .slashed-preview__swatch {
    width: 50px;
    height: 50px;
    border-radius: var(--preview-radius-s, 4px);
    border: 1px solid rgba(0,0,0,0.1);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    font-size: 9px;
    color: white;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
    padding: 3px;
  }

  /* ── Buttons ─────────────────────────────────────────────────────── */
  .slashed-preview__buttons {
    display: flex;
    gap: 8px;
    margin-top: 12px;
    flex-wrap: wrap;
  }
  .slashed-preview__btn {
    color: white;
    padding: 7px 14px;
    border-radius: var(--preview-radius-s, 4px);
    font-size: 13px;
    font-weight: 500;
    border: none;
    cursor: default;
    display: inline-flex;
    align-items: center;
  }
  .slashed-preview__btn--outline {
    background: transparent !important;
    border: 1.5px solid;
  }
  .slashed-preview__btn--ghost {
    background: transparent !important;
    border: none;
    color: #50575e;
  }
  .slashed-preview.is-dark .slashed-preview__btn--ghost { color: #a7aaad; }
  .slashed-preview__btn--sm {
    padding: 4px 10px;
    font-size: 12px;
  }

  /* ── Card ────────────────────────────────────────────────────────── */
  .slashed-preview__card {
    margin-top: 14px;
    border: 1px solid #e9eaeb;
    border-radius: var(--preview-radius-m, 8px);
    overflow: hidden;
    background: #fff;
    box-shadow: var(--preview-shadow);
  }
  .slashed-preview.is-dark .slashed-preview__card {
    background: #2c3338;
    border-color: #3c434a;
  }
  .slashed-preview__card-accent {
    height: 4px;
  }
  .slashed-preview__card-body {
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .slashed-preview__card-top {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .slashed-preview__card-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .slashed-preview__card-title {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: #1d2327;
    line-height: 1.3;
  }
  .slashed-preview.is-dark .slashed-preview__card-title { color: #f0f0f1; }
  .slashed-preview__card-sub {
    margin: 0;
    font-size: 11px;
    color: #787c82;
    line-height: 1.3;
  }
  .slashed-preview__card-top .slashed-preview__badge { margin-left: auto; }
  .slashed-preview__card-text {
    margin: 0;
    font-size: 12px;
    line-height: 1.5;
    color: #50575e;
  }
  .slashed-preview.is-dark .slashed-preview__card-text { color: #a7aaad; }
  .slashed-preview__card-footer {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
    padding-top: 6px;
    border-top: 1px solid #f0f0f1;
  }
  .slashed-preview.is-dark .slashed-preview__card-footer { border-top-color: #3c434a; }
  .slashed-preview__card-footer .slashed-preview__btn--sm { margin-left: auto; }

  /* ── Badge ───────────────────────────────────────────────────────── */
  .slashed-preview__badge {
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    border-radius: var(--preview-radius-l, 16px);
    font-size: 10px;
    font-weight: 600;
    color: white;
    white-space: nowrap;
  }

  /* ── CSS caption ─────────────────────────────────────────────────── */
  .slashed-preview__caption {
    margin-top: 16px;
    color: #50575e;
    font-size: 12px;
    padding-top: 12px;
    border-top: 1px solid #e9eaeb;
  }
  .slashed-preview.is-dark .slashed-preview__caption {
    color: #a7aaad;
    border-top-color: #3c434a;
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
  .slashed-preview.is-dark .slashed-preview__caption code {
    background: #1d2327;
    color: #a7aaad;
  }
</style>

<div
  class="slashed-preview"
  class:is-dark={darkMode}
  style={inlineStyle}
>
  <!-- Header with mode toggle -->
  <div class="slashed-preview__header">
    <h3>Live preview</h3>
    <div class="slashed-preview__mode-toggle">
      <button
        class="slashed-preview__mode-btn"
        class:active={!darkMode}
        onclick={() => (darkMode = false)}
      >☀ Light</button>
      <button
        class="slashed-preview__mode-btn"
        class:active={darkMode}
        onclick={() => (darkMode = true)}
      >☾ Dark</button>
    </div>
  </div>

  <!-- Typography sample -->
  <p class="slashed-preview__type-heading">
    The quick brown fox jumps over the lazy dog
  </p>
  <p class="slashed-preview__type-body">
    Body and heading fonts update as you adjust typography settings. Colors below
    reflect brand and status tokens for the selected mode.
  </p>

  <!-- Color swatches -->
  <div class="slashed-preview__swatches">
    {#each brand as name (name)}
      <div
        class="slashed-preview__swatch"
        style:background={`var(--sf-color-${name}-${mode}, #ddd)`}
        title={name}
      >{name}</div>
    {/each}
    {#each statuses as name (name)}
      <div
        class="slashed-preview__swatch"
        style:background={`var(--sf-color-${name}-${mode}, #ddd)`}
        title={name}
      >{name}</div>
    {/each}
  </div>

  <!-- Buttons -->
  <div class="slashed-preview__buttons">
    <span
      class="slashed-preview__btn"
      style:background={`var(--sf-color-primary-${mode}, #4338ca)`}
    >Primary</span>
    <span
      class="slashed-preview__btn"
      style:background={`var(--sf-color-action-${mode}, #0891b2)`}
    >Action</span>
    <span
      class="slashed-preview__btn slashed-preview__btn--outline"
      style:border-color={`var(--sf-color-primary-${mode}, #4338ca)`}
      style:color={`var(--sf-color-primary-${mode}, #4338ca)`}
    >Outline</span>
    <span
      class="slashed-preview__btn slashed-preview__btn--ghost"
    >Ghost</span>
  </div>

  <!-- Card preview — shows colors + typography + radius + shadow together -->
  <div
    class="slashed-preview__card"
    style:box-shadow="var(--preview-shadow)"
  >
    <div
      class="slashed-preview__card-accent"
      style:background={`var(--sf-color-primary-${mode}, #4338ca)`}
    ></div>
    <div class="slashed-preview__card-body">
      <div class="slashed-preview__card-top">
        <div class="slashed-preview__card-avatar"
          style:background={`var(--sf-color-secondary-${mode}, #7c3aed)`}
        ></div>
        <div>
          <p class="slashed-preview__card-title"
            style:font-family="var(--sf-font-heading, system-ui, sans-serif)"
          >Card Component</p>
          <p class="slashed-preview__card-sub">Design token preview</p>
        </div>
        <span
          class="slashed-preview__badge"
          style:background={`var(--sf-color-success-${mode}, #16a34a)`}
        >Active</span>
      </div>
      <p class="slashed-preview__card-text"
        style:font-family="var(--sf-font-body, system-ui, sans-serif)"
      >
        This card shows radius, shadow, spacing, colors, and typography
        working together. All values update live as you adjust tokens.
      </p>
      <div class="slashed-preview__card-footer">
        <span
          class="slashed-preview__badge"
          style:background={`var(--sf-color-info-${mode}, #0284c7)`}
        >Info</span>
        <span
          class="slashed-preview__badge"
          style:background={`var(--sf-color-warning-${mode}, #ca8a04)`}
        >Warning</span>
        <span
          class="slashed-preview__btn slashed-preview__btn--sm"
          style:background={`var(--sf-color-action-${mode}, #0891b2)`}
        >Save</span>
      </div>
    </div>
  </div>

  <!-- Generated CSS -->
  <div class="slashed-preview__caption">
    Generated CSS:
    <code>{css || '/* (defaults — no overrides set) */'}</code>
  </div>
</div>
