<script>
  /**
   * Visual spacing scale preview.
   *
   * Renders the 9 spacing steps (2xs → 4xl) as horizontal bars at the
   * interpolated value for the selected viewport width. The slider lets
   * the user scrub between 320 px and 1440 px to see the fluid scale.
   *
   * Formula (matches the framework's generated clamp()):
   *   value = (min + (max - min) * clamp((vw - 375) / (1440 - 375), 0, 1)) * spaceScale
   */
  import { tokens, meta } from '../lib/stores.svelte.js';

  const VW_MIN = 375;
  const VW_MAX = 1440;
  const SLIDER_MIN = VW_MIN;

  /** Viewport slider state — starts at desktop width. */
  let vw = $state(VW_MAX);

  /**
   * Base spacing values: min and max rem at 375px / 1440px viewport.
   * These mirror the framework's internal spacing scale.
   */
  const SPACE_STEPS = [
    { name: '2xs', min: 0.51, max: 0.84 },
    { name: 'xs',  min: 0.64, max: 1.13 },
    { name: 's',   min: 0.80, max: 1.50 },
    { name: 'm',   min: 1.00, max: 2.00 },
    { name: 'l',   min: 1.25, max: 2.67 },
    { name: 'xl',  min: 1.56, max: 3.55 },
    { name: '2xl', min: 1.95, max: 4.74 },
    { name: '3xl', min: 2.44, max: 6.31 },
    { name: '4xl', min: 3.05, max: 8.42 },
  ];

  /** Max bar reference (4xl at 1440px). All bars are relative to this. */
  const MAX_REM = 8.42;

  const computedSteps = $derived.by(() => {
    const spaceScale = parseFloat(
      tokens.spacing?.space_scale ?? meta.defaults?.spacing?.space_scale ?? 1
    );
    const t = Math.max(0, Math.min(1, (vw - VW_MIN) / (VW_MAX - VW_MIN)));

    return SPACE_STEPS.map(({ name, min, max }) => {
      const sizeRem = (min + (max - min) * t) * spaceScale;
      const barPct = (sizeRem / MAX_REM) * 100;
      return { name, sizeRem: sizeRem.toFixed(3), barPct: Math.min(barPct, 100) };
    });
  });

</script>

<div class="spacing-preview">
  <div class="spacing-preview__header">
    <p class="spacing-preview__title">Live Scale Preview</p>
    <div class="spacing-preview__slider-wrap">
      <span>{SLIDER_MIN}px</span>
      <input
        class="spacing-preview__slider"
        type="range"
        min={SLIDER_MIN}
        max={VW_MAX}
        step="1"
        aria-label="Preview viewport width"
        bind:value={vw}
      />
      <span>{VW_MAX}px</span>
      <span class="spacing-preview__vw-label">{vw}px</span>
    </div>
  </div>

  <div class="spacing-preview__rows">
    {#each computedSteps as step (step.name)}
      <div class="spacing-preview__row">
        <span class="spacing-preview__token">--sf-space-{step.name}</span>
        <div class="spacing-preview__bar-wrap">
          <div
            class="spacing-preview__bar"
            style:width="{step.barPct}%"
          ></div>
        </div>
        <span class="spacing-preview__value">{step.sizeRem}rem</span>
      </div>
    {/each}
  </div>
</div>

<style>
  .spacing-preview {
    background: #fff;
    border: 1px solid #c3c4c7;
    border-radius: 4px;
    padding: 16px 20px;
    margin-top: 16px;
  }

  .spacing-preview__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 14px;
  }

  .spacing-preview__title {
    font-size: 13px;
    font-weight: 600;
    color: #1d2327;
    margin: 0;
  }

  .spacing-preview__slider-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #50575e;
  }

  .spacing-preview__slider {
    width: 180px;
    cursor: pointer;
    accent-color: #2271b1;
  }

  .spacing-preview__vw-label {
    min-width: 58px;
    text-align: right;
    font-variant-numeric: tabular-nums;
    color: #1d2327;
    font-weight: 500;
  }

  .spacing-preview__rows {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .spacing-preview__row {
    display: grid;
    grid-template-columns: 160px 1fr 70px;
    align-items: center;
    gap: 12px;
  }

  .spacing-preview__token {
    font-family: monospace;
    font-size: 11px;
    color: #50575e;
    white-space: nowrap;
  }

  .spacing-preview__bar-wrap {
    background: #f0f0f1;
    border-radius: 2px;
    height: 16px;
    overflow: hidden;
  }

  .spacing-preview__bar {
    height: 100%;
    background: #2271b1;
    border-radius: 2px;
    transition: width 80ms ease;
    min-width: 2px;
  }

  .spacing-preview__value {
    font-size: 11px;
    color: #787c82;
    text-align: right;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
</style>
