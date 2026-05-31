<script>
  /**
   * Live fluid-type scale preview.
   *
   * Renders each size step at the interpolated font size for a given
   * viewport width. The slider lets the user scrub between 320 px and
   * 1440 px to watch the clamp() scale play out in real time.
   *
   * Formula mirrors class-css-generator.php build_clamp():
   *   clamp(min, calc(slope * (100vw - 22.5rem) + min), max)
   *   where slope = (max - min) / (95 - 22.5) and VW_MIN/MAX = 360/1520px.
   *
   * Values are read from tokens.typography (user overrides) with
   * meta.defaults.typography.font_sizes as the fallback, so the preview
   * is always populated even before the user sets anything.
   */
  import { tokens, meta } from '../lib/stores.svelte.js';

  const BASE_PX = 16;
  const VW_MIN  = 360;  // 22.5rem × 16 — matches VIEWPORT_MIN in class-css-generator.php
  const VW_MAX  = 1520; // 95rem × 16 — matches VIEWPORT_MAX in class-css-generator.php

  /** Viewport slider state — starts at desktop width. */
  let vw = $state(VW_MAX);

  const defaults = meta.defaults?.typography ?? {};
  const defaultSizes = defaults.font_sizes ?? {};

  /**
   * Resolve a single step's min/max, preferring token overrides then
   * falling back to meta defaults.
   *
   * @param {string} name - Step name, e.g. "2xs".
   * @returns {{ min: number, max: number }}
   */
  function resolveStep(name) {
    const saved = tokens.typography ?? {};
    const def   = defaultSizes[name] ?? {};

    const minRaw = saved[`size_${name}_min`];
    const maxRaw = saved[`size_${name}_max`];

    const min = minRaw !== undefined && minRaw !== '' ? parseFloat(minRaw) : (def.min ?? 0.75);
    const max = maxRaw !== undefined && maxRaw !== '' ? parseFloat(maxRaw) : (def.max ?? 1);

    return { min, max };
  }

  const stepAt = $derived.by(() => {
    const t = Math.max(0, Math.min(1, (vw - VW_MIN) / (VW_MAX - VW_MIN)));
    const steps = {};

    for (const name of Object.keys(defaultSizes)) {
      const { min, max } = resolveStep(name);
      const sizeRem = min + (max - min) * t;
      const sizePx  = sizeRem * BASE_PX;
      steps[name] = { sizePx, sizeRem: sizeRem.toFixed(3) };
    }

    return steps;
  });

  /** Text scale steps (all non-display). */
  const TEXT_STEPS = ['2xs', 'xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl'];
  /** Display scale steps. */
  const DISPLAY_STEPS = ['display-s', 'display-m', 'display-l'];

  /** All step names, filtered to those actually present in defaults. */
  const textStepNames = $derived(TEXT_STEPS.filter((n) => defaultSizes[n]));
  const displayStepNames = $derived(DISPLAY_STEPS.filter((n) => defaultSizes[n]));

</script>

<style>
  .typo-preview {
    background: #fff;
    border: 1px solid #c3c4c7;
    border-radius: 4px;
    padding: 16px 20px;
    margin-top: 8px;
  }

  .typo-preview__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 14px;
  }

  .typo-preview__title {
    font-size: 13px;
    font-weight: 600;
    color: #1d2327;
    margin: 0;
  }

  .typo-preview__slider-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #50575e;
  }

  .typo-preview__slider {
    width: 180px;
    cursor: pointer;
    accent-color: #2271b1;
  }

  .typo-preview__vw-label {
    min-width: 58px;
    text-align: right;
    font-variant-numeric: tabular-nums;
    color: #1d2327;
    font-weight: 500;
  }

  .typo-preview__rows {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .typo-preview__row {
    display: grid;
    grid-template-columns: 52px 1fr 120px;
    align-items: baseline;
    gap: 12px;
    padding: 6px 0;
    border-bottom: 1px solid #f0f0f1;
    overflow: hidden;
  }

  .typo-preview__row:last-child {
    border-bottom: none;
  }

  .typo-preview__step-name {
    font-size: 11px;
    font-weight: 600;
    color: #50575e;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    flex-shrink: 0;
  }

  .typo-preview__sample {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #1d2327;
    line-height: 1.2;
  }

  .typo-preview__meta {
    font-size: 10px;
    color: #787c82;
    text-align: right;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }

  .typo-preview__group-heading {
    font-size: 11px;
    font-weight: 600;
    color: #50575e;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    margin: 0 0 6px;
    padding: 6px 0 4px;
    border-bottom: 1px solid #f0f0f1;
  }

  .typo-preview__rows--display {
    margin-top: 16px;
    padding-top: 4px;
    border-top: 2px solid #f0f0f1;
  }
</style>

<div class="typo-preview">
  <div class="typo-preview__header">
    <p class="typo-preview__title">Live Scale Preview</p>
    <div class="typo-preview__slider-wrap">
      <span>{VW_MIN}px</span>
      <input
        class="typo-preview__slider"
        type="range"
        min={VW_MIN}
        max={VW_MAX}
        step="1"
        aria-label="Preview viewport width"
        bind:value={vw}
      />
      <span>{VW_MAX}px</span>
      <span class="typo-preview__vw-label">{vw}px</span>
    </div>
  </div>

  <div class="typo-preview__rows">
    <p class="typo-preview__group-heading">Text Scale</p>
    {#each textStepNames as name (name)}
      {@const step = stepAt[name]}
      {#if step}
        <div class="typo-preview__row">
          <span class="typo-preview__step-name">{name}</span>
          <span
            class="typo-preview__sample"
            style:font-size="{step.sizePx.toFixed(1)}px"
          >{name}</span>
          <span class="typo-preview__meta">
            {step.sizeRem}rem / {step.sizePx.toFixed(1)}px
          </span>
        </div>
      {/if}
    {/each}
  </div>

  {#if displayStepNames.length > 0}
    <div class="typo-preview__rows typo-preview__rows--display">
      <p class="typo-preview__group-heading">Display Scale</p>
      {#each displayStepNames as name (name)}
        {@const step = stepAt[name]}
        {#if step}
          <div class="typo-preview__row">
            <span class="typo-preview__step-name">{name}</span>
            <span
              class="typo-preview__sample"
              style:font-size="{step.sizePx.toFixed(1)}px"
            >{name}</span>
            <span class="typo-preview__meta">
              {step.sizeRem}rem / {step.sizePx.toFixed(1)}px
            </span>
          </div>
        {/if}
      {/each}
    </div>
  {/if}
</div>
