<script>
  /**
   * Visual spacing scale preview.
   *
   * Renders the 9 spacing steps (2xs → 4xl) as horizontal bars at the
   * interpolated value for the selected viewport width. The slider lets
   * the user scrub between VW_MIN and VW_MAX to see the fluid scale.
   *
   * Formula (matches the framework's generated clamp()):
   *   value = (min + (max - min) * clamp((vw - VW_MIN) / (VW_MAX - VW_MIN), 0, 1)) * spaceScale
   *
   * VW bounds match the framework CSS (22.5rem = 360px, 90rem = 1440px).
   * Per-step token overrides (space_*_min/max) are preferred over the
   * hardcoded defaults when set.
   */
  import { tokens, meta } from '../lib/stores.svelte.js';

  const VW_MIN = 360;
  const VW_MAX = 1440;

  /** Viewport slider state — starts at desktop width. */
  let vw = $state(VW_MAX);

  const defaults = meta.defaults?.spacing ?? {};
  const defaultSizes = defaults.space_sizes ?? {};

  /**
   * Resolve a single step's min/max, preferring token overrides then
   * falling back to meta defaults.
   */
  function resolveStep(name) {
    const saved = tokens.spacing ?? {};
    const def   = defaultSizes[name] ?? {};

    const minRaw = saved[`space_${name}_min`];
    const maxRaw = saved[`space_${name}_max`];

    const min = minRaw !== undefined && minRaw !== '' ? parseFloat(minRaw) : (def.min ?? 1);
    const max = maxRaw !== undefined && maxRaw !== '' ? parseFloat(maxRaw) : (def.max ?? 1);

    return { min, max };
  }

  const computedSteps = $derived.by(() => {
    const spaceScale = parseFloat(
      tokens.spacing?.space_scale ?? defaults.space_scale ?? 1
    ) || 1;
    const t = Math.max(0, Math.min(1, (vw - VW_MIN) / (VW_MAX - VW_MIN)));

    const stepNames = ['2xs', 'xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl'];
    const maxRef = resolveStep('4xl').max * spaceScale;

    return stepNames.map((name) => {
      const { min, max } = resolveStep(name);
      const sizeRem = (min + (max - min) * t) * spaceScale;
      const barPct = (sizeRem / maxRef) * 100;
      return { name, sizeRem: sizeRem.toFixed(3), barPct: Math.min(barPct, 100) };
    });
  });
</script>

<div class="spacing-preview">
  <div class="spacing-preview__header">
    <p class="spacing-preview__title">Live Scale Preview</p>
    <div class="spacing-preview__slider-wrap">
      <span>{VW_MIN}px</span>
      <input
        class="spacing-preview__slider"
        type="range"
        min={VW_MIN}
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
