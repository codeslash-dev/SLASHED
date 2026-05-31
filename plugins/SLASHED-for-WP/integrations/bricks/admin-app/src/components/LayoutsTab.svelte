<script>
  /**
   * Layouts tab: container widths, layout primitive overrides.
   *
   * Basic section covers the knobs users reach most often:
   *   - Container widths (narrow, prose, default, wide)
   *   - Grid auto-fill column minimum
   *   - Switcher responsive threshold
   *   - Bento grid defaults
   *
   * Advanced section covers per-primitive overrides for the less
   * commonly adjusted layout primitives (sidebar, reel, cover, etc.)
   * and the content-grid breakout widths.
   */
  import { meta } from '../lib/stores.svelte.js';
  import TextField from './TextField.svelte';
  import AdvancedSection from './AdvancedSection.svelte';

  const SECTION = 'layouts';
  const defaults = meta.defaults?.[SECTION] ?? {};
</script>

<section>
  <h2>Containers</h2>
  <p class="hint">
    Max-width values for <code>.sf-container</code> size variants. Any valid CSS length
    (<code>rem</code>, <code>px</code>, <code>ch</code>, <code>%</code>, etc.).
  </p>
  <div class="rows">
    <TextField section={SECTION} fieldKey="container_narrow"  label="Narrow"  default={defaults.container_narrow  ?? '38rem'}  cssVar="--sf-container-narrow"  mono />
    <TextField section={SECTION} fieldKey="container_prose"   label="Prose"   default={defaults.container_prose   ?? '65ch'}   cssVar="--sf-container-prose"   mono />
    <TextField section={SECTION} fieldKey="container_default" label="Default" default={defaults.container_default ?? '75rem'}  cssVar="--sf-container-default" mono />
    <TextField section={SECTION} fieldKey="container_wide"    label="Wide"    default={defaults.container_wide    ?? '90rem'}  cssVar="--sf-container-wide"    mono />
  </div>

  <h2 class="group-heading">Grid</h2>
  <p class="hint">
    Minimum column width for <code>.sf-grid</code> auto-fill layouts.
    The grid will fit as many columns as possible at or above this width.
  </p>
  <div class="rows">
    <TextField section={SECTION} fieldKey="grid_min"    label="Default min" default={defaults.grid_min    ?? '16rem'} cssVar="--sf-grid-min"    mono />
    <TextField section={SECTION} fieldKey="grid_min_xs" label="XS min"      default={defaults.grid_min_xs ?? '10rem'} cssVar="--sf-grid-min-xs" mono />
    <TextField section={SECTION} fieldKey="grid_min_s"  label="S min"       default={defaults.grid_min_s  ?? '13rem'} cssVar="--sf-grid-min-s"  mono />
    <TextField section={SECTION} fieldKey="grid_min_l"  label="L min"       default={defaults.grid_min_l  ?? '20rem'} cssVar="--sf-grid-min-l"  mono />
    <TextField section={SECTION} fieldKey="grid_min_xl" label="XL min"      default={defaults.grid_min_xl ?? '24rem'} cssVar="--sf-grid-min-xl" mono />
    <TextField section={SECTION} fieldKey="grid_min_2xl" label="2XL min"    default={defaults.grid_min_2xl ?? '28rem'} cssVar="--sf-grid-min-2xl" mono />
  </div>

  <h2 class="group-heading">Switcher</h2>
  <p class="hint">
    Viewport width at which <code>.sf-switcher</code> flips from a stacked column to a row.
  </p>
  <div class="rows">
    <TextField section={SECTION} fieldKey="switcher_threshold" label="Threshold" default={defaults.switcher_threshold ?? '30rem'} cssVar="--sf-switcher-threshold" mono />
  </div>

  <h2 class="group-heading">Bento Grid</h2>
  <p class="hint">
    Column count and row height presets for <code>.sf-bento</code> free-form grid layouts.
  </p>
  <div class="rows">
    <TextField section={SECTION} fieldKey="bento_cols"         label="Columns"       default={defaults.bento_cols         ?? '3'}     cssVar="--sf-bento-cols-default" mono />
    <TextField section={SECTION} fieldKey="bento_row_default"  label="Row (default)" default={defaults.bento_row_default  ?? '10rem'} cssVar="--sf-bento-row-default"  mono />
    <TextField section={SECTION} fieldKey="bento_row_compact"  label="Row (compact)" default={defaults.bento_row_compact  ?? '6rem'}  cssVar="--sf-bento-row-compact"  mono />
    <TextField section={SECTION} fieldKey="bento_row_tall"     label="Row (tall)"    default={defaults.bento_row_tall     ?? '16rem'} cssVar="--sf-bento-row-tall"     mono />
  </div>

  <AdvancedSection>
    <h2 class="group-heading">Content Grid</h2>
    <p class="hint">Widths used by the content-grid breakout pattern.</p>
    <div class="rows">
      <TextField section={SECTION} fieldKey="content_width"  label="Content width"  default={defaults.content_width  ?? 'var(--sf-container-default)'} cssVar="--sf-content-width"  mono />
      <TextField section={SECTION} fieldKey="breakout_width" label="Breakout width" default={defaults.breakout_width ?? 'var(--sf-container-wide)'}    cssVar="--sf-breakout-width" mono />
    </div>

    <h2 class="group-heading">Sidebar</h2>
    <div class="rows">
      <TextField section={SECTION} fieldKey="sidebar_width"     label="Sidebar width"      default={defaults.sidebar_width     ?? '18rem'} cssVar="--sf-sidebar-width"     mono />
      <TextField section={SECTION} fieldKey="sidebar_min_width" label="Content col minimum" default={defaults.sidebar_min_width ?? '50%'}   cssVar="--sf-sidebar-min-width" mono />
    </div>

    <h2 class="group-heading">Cover</h2>
    <div class="rows">
      <TextField section={SECTION} fieldKey="cover_min_height" label="Min height" default={defaults.cover_min_height ?? '100dvh'}              cssVar="--sf-cover-min-height" mono />
      <TextField section={SECTION} fieldKey="cover_padding"    label="Padding"    default={defaults.cover_padding    ?? 'var(--sf-section-pad)'} cssVar="--sf-cover-padding"    mono />
    </div>

    <h2 class="group-heading">Frame</h2>
    <div class="rows">
      <TextField section={SECTION} fieldKey="frame_ratio" label="Aspect ratio" default={defaults.frame_ratio ?? '16 / 9'} cssVar="--sf-frame-ratio" mono />
    </div>

    <h2 class="group-heading">Reel</h2>
    <div class="rows">
      <TextField section={SECTION} fieldKey="reel_item_width" label="Item width"    default={defaults.reel_item_width ?? 'max-content'} cssVar="--sf-reel-item-width" mono />
      <TextField section={SECTION} fieldKey="reel_height"     label="Height"        default={defaults.reel_height     ?? 'auto'}        cssVar="--sf-reel-height"     mono />
    </div>

    <h2 class="group-heading">Imposter</h2>
    <div class="rows">
      <TextField section={SECTION} fieldKey="imposter_margin" label="Margin" default={defaults.imposter_margin ?? 'var(--sf-space-m)'} cssVar="--sf-imposter-margin" mono />
    </div>

    <h2 class="group-heading">Equal Columns</h2>
    <div class="rows">
      <TextField section={SECTION} fieldKey="equal_cols" label="Column count" default={defaults.equal_cols ?? '2'} cssVar="--sf-equal-cols" mono />
    </div>
  </AdvancedSection>
</section>

<style>
  h2 { margin-top: 0; }
  .group-heading { margin-top: 24px; }
  .hint { color: #50575e; margin-bottom: 16px; max-width: 720px; font-size: 13px; }
  .hint code {
    background: #f0f0f1;
    padding: 1px 4px;
    border-radius: 3px;
    font-size: 11px;
  }
  .rows {
    border: 1px solid #f0f0f1;
    border-radius: 4px;
    padding: 0 12px;
    background: #fcfcfd;
  }
</style>
