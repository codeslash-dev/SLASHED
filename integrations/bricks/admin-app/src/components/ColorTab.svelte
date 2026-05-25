<script>
  /**
   * Colors tab body. Pulls the brand and status defaults from the
   * hydrated metadata and renders a ColorRow per token.
   *
   * Note how thin this is compared to render_tab_colors() in
   * class-admin-page.php: there's no separate hex_hints lookup ceremony,
   * no ucfirst() label munging in PHP, no manual table markup. The
   * table-of-rows shape is just a single each block.
   */
  import { meta } from '../lib/stores.svelte.js';
  import ColorRow from './ColorRow.svelte';

  const colors = meta.defaults?.colors ?? {};

  /** Capitalize first letter for display labels (matches the legacy ucfirst()). */
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
</script>

<section>
  <h2>Brand Colors</h2>
  <p class="hint">
    Pick a color via the HEX input, or switch to <em>Advanced</em> to paste any
    CSS color value (oklch, rgb, hsl, var(...), etc). Whatever you save is fed
    straight into the framework as the source of the brand scale.
  </p>

  <div class="rows">
    {#each Object.entries(colors.brand ?? {}) as [name, oklch] (name)}
      <ColorRow
        storeKey={`brand_${name}`}
        label={cap(name)}
        hexHint={colors.brand_hex_hints?.[name] ?? ''}
        rawHint={oklch}
        cssVar={`--sf-color-${name}-light`}
      />
    {/each}
  </div>

  <h2 class="status-heading">Status Colors</h2>
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
</section>

<style>
  h2 { margin-top: 0; }
  .status-heading { margin-top: 24px; }
  .hint { color: #50575e; margin-bottom: 16px; max-width: 720px; }
  .rows {
    border: 1px solid #f0f0f1;
    border-radius: 4px;
    padding: 0 12px;
    background: #fcfcfd;
  }
</style>
