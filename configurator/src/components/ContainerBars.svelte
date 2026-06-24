<script>
  /**
   * Visual ruler for container-width tokens.
   * Renders a proportional bar for each --sf-container-* token so users can
   * compare relative widths at a glance and see the live value alongside it.
   */
  import { overrides } from '../lib/store.svelte.js';
  import { tokenByName, defaultsByName } from '../lib/model.js';

  const CONTAINERS = [
    { name: '--sf-container-narrow', label: 'Narrow',  help: 'Asides and narrow columns' },
    { name: '--sf-container-prose',  label: 'Prose',   help: 'Long-form readable line length' },
    { name: '--sf-container-default',label: 'Default', help: 'Main content container' },
    { name: '--sf-container-wide',   label: 'Wide',    help: 'Marketing & docs sections' },
    { name: '--sf-container-full',   label: 'Full',    help: 'Edge-to-edge / fluid' },
  ];

  const exists = (name) => tokenByName.has(name);

  /** Extract a pixel value from a CSS value string (handles rem, ch, px, %). */
  function parsePx(raw) {
    if (!raw) return null;
    const n = parseFloat(raw);
    if (!Number.isFinite(n)) return null;
    if (/rem/.test(raw)) return n * 16;
    if (/ch/.test(raw)) return n * 9;  // ~9px per ch at 16px base
    if (/em/.test(raw)) return n * 16;
    if (/%/.test(raw)) return 1200 * (n / 100);
    return n; // assume px
  }

  /** Live effective value string for display, pulling overrides → defaults. */
  function effectiveValue(name) {
    return overrides[name] ?? defaultsByName.get(name) ?? '';
  }

  const rows = $derived(
    CONTAINERS.filter((c) => exists(c.name)).map((c) => {
      const raw = effectiveValue(c.name);
      return { ...c, raw, px: parsePx(raw) };
    })
  );

  const maxPx = $derived(Math.max(...rows.map((r) => r.px ?? 0), 1));
  const modified = (name) => overrides[name] != null;
</script>

<div class="cbars">
  {#each rows as row (row.name)}
    {@const pct = row.px != null ? Math.min(100, (row.px / maxPx) * 100) : 0}
    {@const mod = modified(row.name)}
    <div class="cbars__row" class:cbars__row--mod={mod}>
      <div class="cbars__meta">
        <span class="cbars__label">{row.label}</span>
        <code class="cbars__val" class:cbars__val--default={!mod}>{row.raw || '—'}</code>
      </div>
      <div class="cbars__track">
        <div class="cbars__bar" style:width="{pct}%" title="{row.name}: {row.raw}"></div>
        {#if row.px != null}
          <span class="cbars__px">~{Math.round(row.px)}px</span>
        {/if}
      </div>
      {#if row.help}
        <p class="cbars__help">{row.help}</p>
      {/if}
    </div>
  {/each}
</div>

<style>
  .cbars {
    display: flex; flex-direction: column; gap: 0;
    padding: 12px 16px; border: 1px solid var(--cfg-border);
    border-radius: var(--cfg-radius); background: var(--cfg-bg-2);
  }

  .cbars__row {
    padding: 10px 0;
    border-bottom: 1px solid var(--cfg-border);
  }
  .cbars__row:last-child { border-bottom: none; }
  .cbars__row--mod { box-shadow: inset 3px 0 0 var(--cfg-accent-strong); padding-left: 6px; }

  .cbars__meta {
    display: flex; align-items: baseline; justify-content: space-between; gap: 8px;
    margin-bottom: 6px;
  }
  .cbars__label {
    font-size: 12px; font-weight: 700; color: var(--cfg-text);
  }
  .cbars__val {
    font-size: 11px; color: var(--cfg-accent-strong);
  }
  .cbars__val--default { color: var(--cfg-text-faint); }

  .cbars__track {
    position: relative; height: 12px; background: var(--cfg-border);
    border-radius: 999px; overflow: visible; display: flex; align-items: center;
  }

  .cbars__bar {
    height: 100%; border-radius: 999px;
    background: var(--cfg-accent-strong); opacity: 0.75;
    transition: width 0.25s ease;
    min-width: 4px;
  }
  .cbars__row--mod .cbars__bar { opacity: 1; }

  .cbars__px {
    position: absolute; left: calc(100% + 6px);
    font-size: 9.5px; color: var(--cfg-text-faint); white-space: nowrap;
  }

  .cbars__help {
    margin: 4px 0 0; font-size: 11px; color: var(--cfg-text-faint);
  }
</style>
