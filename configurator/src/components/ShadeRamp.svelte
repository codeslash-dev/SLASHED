<script>
  /**
   * Brand-color shade ramp.
   *
   * Resolves and displays the full 7-step shade ramp for each brand color
   * (superlight → superdark) using the framework's derived consumption tokens.
   * Updates reactively whenever overrides or the preview theme changes.
   *
   * Brand families only: primary, secondary, tertiary, action, neutral, base.
   * Status families (success/warning/error/info/danger) intentionally omit the
   * shade ramp — they expose only the subtle/muted/strong triplet.
   */
  import { overrides, ui } from '../lib/store.svelte.js';
  import { measureBackground, setProbeContext } from '../lib/probeHost.js';
  import { BRAND_COLOR_KEYS } from '../lib/brandColors.js';
  import { parseRgb } from '../lib/contrast.js';

  let { colorKey = null, showIntro = true } = $props();

  const BRAND_KEYS = BRAND_COLOR_KEYS.filter((k) => k.group === 'brand');
  const visibleBrandKeys = $derived(colorKey ? BRAND_KEYS.filter((k) => k.key === colorKey) : BRAND_KEYS);

  const SHADE_STEPS = [
    { suffix: '-superlight', label: 'superlight' },
    { suffix: '-xlight',     label: 'xlight'     },
    { suffix: '-lighter',    label: 'lighter'     },
    { suffix: '',            label: 'base',  isBase: true },
    { suffix: '-darker',     label: 'darker'      },
    { suffix: '-xdark',      label: 'xdark'       },
    { suffix: '-superdark',  label: 'superdark'   },
  ];

  const ALL_SHADE_TOKENS = $derived(visibleBrandKeys.flatMap(({ key }) =>
    SHADE_STEPS.map(({ suffix }) => `--sf-color-${key}${suffix}`)
  ));

  /** @type {Record<string, string>} token → resolved rgb() string */
  let resolved = $state({});

  $effect(() => {
    for (const k in overrides) void overrides[k];
    void ui.previewTheme;
    queueMicrotask(() => {
      // Keep the probe host scoped to this component's live state. App.svelte
      // also refreshes the same singleton for contrast badges, but the shade
      // ramp must remain correct when mounted in isolation by component tests
      // and whenever the framework adds derived/registered color tokens.
      setProbeContext({ overrides, theme: ui.previewTheme });
      const next = {};
      for (const token of ALL_SHADE_TOKENS) {
        const rgb = measureBackground(`var(${token})`);
        if (rgb && rgb !== 'rgba(0, 0, 0, 0)') next[token] = rgb;
      }
      resolved = next;
    });
  });

  /** Perceived lightness (0–255) — decides whether to use dark or light text on a swatch. */
  function perceived(rgb) {
    const c = parseRgb(rgb);
    if (!c) return 128;
    return (c.r * 0.299 + c.g * 0.587 + c.b * 0.114) * 255;
  }

  function shadeMetrics(rgb) {
    const c = parseRgb(rgb);
    if (!c) return { lightness: '…', chroma: '…' };
    const max = Math.max(c.r, c.g, c.b);
    const min = Math.min(c.r, c.g, c.b);
    return {
      lightness: `${Math.round(perceived(rgb) / 2.55)}%`,
      chroma: (max - min).toFixed(3),
    };
  }
</script>

<div class="sr">
  {#if showIntro}
    <p class="sr__intro">
      7-step ramp for each brand color, resolved against the <strong>{ui.previewTheme}</strong> theme.
    </p>
  {/if}

  {#each visibleBrandKeys as { key, label } (key)}
    <div class="sr__row">
      <span class="sr__name">{label}</span>
      <div class="sr__swatches">
        {#each SHADE_STEPS as { suffix, label: stepLabel, isBase } (`${key}${suffix}`)}
          {@const token = `--sf-color-${key}${suffix}`}
          {@const bg = resolved[token]}
          {@const isLight = bg ? perceived(bg) > 128 : true}
          <div class="sr__swatch-wrap">
            <div
              class="sr__swatch"
              class:sr__swatch--empty={!bg}
              style:background-color={bg ?? 'transparent'}
              title="{token}: {bg ?? 'resolving…'}"
            >
              {#if !bg}
                <span class="sr__dots" aria-hidden="true">···</span>
              {:else if isBase}
                <span class="sr__base-dot" class:sr__base-dot--dark={!isLight} aria-hidden="true">●</span>
              {/if}
            </div>
            <span class="sr__step-label">{stepLabel}</span>
          </div>
        {/each}
      </div>
      <table class="sr__table">
        <thead><tr><th>Shade</th><th>Lightness</th><th>Chroma</th></tr></thead>
        <tbody>
          {#each SHADE_STEPS as { suffix, label: stepLabel } (`table-${key}${suffix}`)}
            {@const token = `--sf-color-${key}${suffix}`}
            {@const metrics = shadeMetrics(resolved[token])}
            <tr><td>{stepLabel}</td><td>{metrics.lightness}</td><td>{metrics.chroma}</td></tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/each}

  {#if showIntro}
  <p class="sr__note">
    Toggle in the preview pane to compare modes.
  </p>
  {/if}
</div>

<style>
  .sr {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 14px 16px;
  }

  .sr__intro {
    margin: 0;
    font-size: 11.5px;
    color: var(--cfg-text-muted);
  }

  .sr__row {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .sr__name {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--cfg-text-faint);
  }

  .sr__swatches {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 3px;
  }

  .sr__swatch-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
  }

  .sr__swatch {
    width: 100%;
    height: 36px;
    border-radius: var(--cfg-radius-s, 4px);
    border: 1px solid rgba(0, 0, 0, 0.07);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s ease;
    background-image:
      conic-gradient(#444 25%, #2a2a2a 0 50%, #444 0 75%, #2a2a2a 0);
    background-size: 8px 8px;
  }
  .sr__swatch:not(.sr__swatch--empty) {
    background-image: none;
  }

  .sr__dots {
    font-size: 10px;
    color: var(--cfg-text-faint);
    letter-spacing: 1px;
  }

  .sr__base-dot {
    font-size: 8px;
    color: rgba(0, 0, 0, 0.35);
  }
  .sr__base-dot--dark {
    color: rgba(255, 255, 255, 0.5);
  }

  .sr__step-label {
    font-size: 8.5px;
    color: var(--cfg-text-faint);
    text-align: center;
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
  }

  .sr__table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 11px; overflow: hidden; border-radius: var(--cfg-radius-s); }
  .sr__table th, .sr__table td { padding: 6px 8px; border: 1px solid var(--cfg-border); text-align: left; }
  .sr__table th { color: var(--cfg-text-faint); text-transform: uppercase; letter-spacing: .06em; background: var(--cfg-surface-2); }

  .sr__note {
    margin: 4px 0 0;
    font-size: 11px;
    color: var(--cfg-text-faint);
    border-top: 1px solid var(--cfg-border);
    padding-top: 10px;
  }

  @media (max-width: 600px) {
    .sr { padding: 10px 12px; }
    .sr__swatch { height: 28px; }
    .sr__step-label { font-size: 7.5px; }
  }
</style>
