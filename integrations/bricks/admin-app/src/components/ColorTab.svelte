<script>
  /**
   * Colors tab body. Pulls the brand and status defaults from the
   * hydrated metadata and renders a ColorRow per token.
   *
   * Supports both light-mode (source) and dark-mode (optional override)
   * colors. Dark-mode values are optional — if left empty, the framework
   * auto-derives dark variants from the light source tokens via relative
   * color syntax. Setting an explicit dark value overrides auto-derivation.
   */
  import { meta } from '../lib/stores.svelte.js';
  import ColorRow from './ColorRow.svelte';
  import AdvancedSection from './AdvancedSection.svelte';

  const colors = meta.defaults?.colors ?? {};

  /** Capitalize first letter for display labels (matches the legacy ucfirst()). */
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  /** Brand color keys — only the 6 core brand colors for the basic section. */
  const brandEntries = Object.entries(colors.brand ?? {});
</script>

<section>
  <h2>Brand Colors — Light Mode</h2>
  <p class="hint">
    Pick a color via the HEX input, or switch to <em>Advanced</em> to paste any
    CSS color value (oklch, rgb, hsl, var(...), etc). Whatever you save is fed
    straight into the framework as the source of the brand scale.
  </p>

  <div class="rows">
    {#each brandEntries as [name, oklch] (name)}
      <ColorRow
        storeKey={`brand_${name}`}
        label={cap(name)}
        hexHint={colors.brand_hex_hints?.[name] ?? ''}
        rawHint={oklch}
        cssVar={`--sf-color-${name}-light`}
      />
    {/each}
  </div>

  <AdvancedSection>
    <h2 class="status-heading">Status Colors — Light Mode</h2>
    <div class="rows">
      {#each Object.entries(colors.status ?? {}) as [name, oklch] (name)}
        <ColorRow
          storeKey={`status_${name}`}
          label={cap(name)}
          hexHint={colors.status_hex_hints?.[name] ?? ''}
          rawHint={oklch}
          cssVar={`--sf-color-${name}-light`}
        />
      {/each}
    </div>

    <h2 class="dark-heading">Brand Colors — Dark Mode</h2>
    <p class="hint">
      Optional overrides for dark mode. Leave empty to let the framework auto-derive
      dark variants from the light source colors. Set explicit values for full
      control over dark-mode appearance.
    </p>

    <div class="rows rows--dark">
      {#each Object.entries(colors.brand_dark ?? colors.brand ?? {}) as [name] (name)}
        <ColorRow
          storeKey={`brand_dark_${name}`}
          label={cap(name)}
          hexHint={colors.brand_dark_hex_hints?.[name] ?? ''}
          rawHint={colors.brand_dark?.[name] ?? ''}
          cssVar={`--sf-color-${name}-dark`}
        />
      {/each}
    </div>

    <h2 class="dark-heading">Status Colors — Dark Mode</h2>
    <p class="hint">
      Optional overrides for dark mode. Leave empty for auto-derivation.
    </p>

    <div class="rows rows--dark">
      {#each Object.entries(colors.status_dark ?? colors.status ?? {}) as [name] (name)}
        <ColorRow
          storeKey={`status_dark_${name}`}
          label={cap(name)}
          hexHint={colors.status_dark_hex_hints?.[name] ?? ''}
          rawHint={colors.status_dark?.[name] ?? ''}
          cssVar={`--sf-color-${name}-dark`}
        />
      {/each}
    </div>
  </AdvancedSection>
</section>

<style>
  h2 { margin-top: 0; }
  .status-heading { margin-top: 24px; }
  .dark-heading { margin-top: 24px; }
  .hint { color: #50575e; margin-bottom: 16px; max-width: 720px; }
  .rows {
    border: 1px solid #f0f0f1;
    border-radius: 4px;
    padding: 0 12px;
    background: #fcfcfd;
  }
  .rows--dark {
    background: #f8f8fc;
    border-color: #e2e4e9;
  }
</style>
