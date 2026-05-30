<script>
  /**
   * Font-family token field with three source modes:
   *
   *   System  — pick from a curated list of modern system-font stacks.
   *             No font loading; purely native OS fonts.
   *   Bricks  — pick from fonts already registered in Bricks Builder
   *             (custom uploads, Adobe Fonts). Bricks owns all loading,
   *             including any "serve locally" GDPR configuration.
   *   Manual  — free-text input for anything else (full font stacks,
   *             var() references, fonts added outside Bricks, etc.).
   *
   * The stored token value is always a plain CSS font-family string.
   * Source is local UI state only — it is inferred from the current
   * value on mount and never persisted separately.
   */
  import { meta, tokens, writeField } from '../lib/stores.svelte.js';
  import FieldRow from './FieldRow.svelte';

  let {
    section,
    fieldKey,
    label,
    default: defaultValue = '',
    cssVar = '',
    description = '',
  } = $props();

  // ── System font stacks (modern-font-stacks catalogue) ──────────────
  const SYSTEM_STACKS = [
    { label: 'System UI',           value: 'system-ui, sans-serif' },
    { label: 'Neo-Grotesque',       value: "Inter, Roboto, 'Helvetica Neue', 'Arial Nova', 'Nimbus Sans', Arial, sans-serif" },
    { label: 'Geometric Humanist',  value: "Avenir, Montserrat, Corbel, 'URW Gothic', source-sans-pro, sans-serif" },
    { label: 'Classical Humanist',  value: "Optima, Candara, 'Noto Sans', source-sans-pro, sans-serif" },
    { label: 'Humanist Sans',       value: "Seravek, 'Gill Sans Nova', Ubuntu, Calibri, 'DejaVu Sans', source-sans-pro, sans-serif" },
    { label: 'Industrial Sans',     value: "'Bahnschrift', 'DIN Alternate', 'Franklin Gothic Medium', 'Nimbus Sans Narrow', sans-serif-condensed, sans-serif" },
    { label: 'Rounded Sans',        value: "ui-rounded, 'Hiragino Maru Gothic ProN', Quicksand, Comfortaa, Manjari, 'Arial Rounded MT Bold', Calibri, source-sans-pro, sans-serif" },
    { label: 'Transitional Serif',  value: "Charter, 'Bitstream Charter', 'Sitka Text', Cambria, serif" },
    { label: 'Old Style Serif',     value: "'Iowan Old Style', 'Palatino Linotype', 'URW Palladio L', P052, serif" },
    { label: 'Slab Serif',          value: "Rockwell, 'Rockwell Nova', 'Roboto Slab', 'DejaVu Serif', 'Sitka Small', serif" },
    { label: 'Antique Serif',       value: "Superclarendon, 'Bookman Old Style', 'URW Bookman', 'URW Bookman L', 'Georgia Pro', Georgia, serif" },
    { label: 'Didone Serif',        value: "Didact Gothic, 'Bodoni MT', 'Bodoni 72', Didot, 'Playfair Display', serif" },
    { label: 'Monospace',           value: "ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace" },
    { label: 'Handwritten',         value: "'Segoe Print', 'Bradley Hand', Chilanka, TSCu_Comic, casual, cursive" },
  ];

  // ── Bricks fonts fetched from REST ───────────────────────────────────
  /** @type {Array<{family:string, label:string, source:string}>} */
  let bricksFonts = $state([]);
  let bricksLoaded = $state(false);

  async function loadBricksFonts() {
    try {
      const url = `${meta.rest.url}bricks-fonts`;
      const res = await fetch(url, {
        headers: { 'X-WP-Nonce': meta.rest.nonce },
      });
      if (!res.ok) return;
      const data = await res.json();
      bricksFonts = Array.isArray(data?.fonts) ? data.fonts : [];
    } catch {
      // Silently degrade — Bricks source tab just won't appear.
    } finally {
      bricksLoaded = true;
    }
  }

  // Fetch once on mount.
  $effect(() => { loadBricksFonts(); });

  // ── Current value ─────────────────────────────────────────────────
  const currentValue = $derived(
    tokens[section]?.[fieldKey] === undefined || tokens[section]?.[fieldKey] === null
      ? ''
      : String(tokens[section][fieldKey])
  );

  /** Effective value shown: stored override or the placeholder default. */
  const effectiveValue = $derived(currentValue || String(defaultValue));

  // ── Source detection ──────────────────────────────────────────────
  /**
   * Infer which source tab to activate from the current stored value.
   * Prefer Bricks over System so a Bricks font that happens to share a
   * name with a system stack word lands in the right tab.
   */
  function detectSource(value) {
    const v = (value || String(defaultValue)).trim().toLowerCase();
    if (bricksFonts.some(f => v === f.family.toLowerCase())) return 'bricks';
    if (SYSTEM_STACKS.some(s => v === s.value.toLowerCase())) return 'system';
    return 'manual';
  }

  let source = $state(detectSource(effectiveValue));

  // Re-detect when Bricks fonts finish loading (value might match now).
  $effect(() => {
    if (bricksLoaded) source = detectSource(effectiveValue);
  });

  // ── Source switch ─────────────────────────────────────────────────
  function switchSource(next) {
    source = next;
    // Pre-select sensible first value when switching into a dropdown mode.
    if (next === 'system') {
      const match = SYSTEM_STACKS.find(s => s.value.toLowerCase() === effectiveValue.toLowerCase());
      if (!match) writeField(section, fieldKey, SYSTEM_STACKS[0].value);
    } else if (next === 'bricks') {
      const match = bricksFonts.find(f => f.family.toLowerCase() === effectiveValue.toLowerCase());
      if (!match && bricksFonts.length > 0) writeField(section, fieldKey, bricksFonts[0].family);
    }
    // 'manual' — keep current value as-is.
  }

  function onSystemSelect(e) {
    writeField(section, fieldKey, e.currentTarget.value);
  }

  function onBricksSelect(e) {
    writeField(section, fieldKey, e.currentTarget.value);
  }

  function onManualInput(e) {
    writeField(section, fieldKey, e.currentTarget.value);
  }

  // Bricks source tab is only shown if fonts are loaded and non-empty.
  const hasBricksFonts = $derived(bricksLoaded && bricksFonts.length > 0);

  const SOURCE_BADGES = { adobe: ' (Adobe)', google: ' (Google)' };
  const sourceBadge = (src) => SOURCE_BADGES[src] ?? '';
</script>

<FieldRow {label} {cssVar} fieldId={fieldKey} {description}>
  <div class="font-field">
    <!-- Source tabs -->
    <div class="source-tabs" role="group" aria-label="Font source">
      <button
        type="button"
        class="source-tab"
        class:source-tab--active={source === 'system'}
        onclick={() => switchSource('system')}
      >System</button>
      {#if hasBricksFonts}
        <button
          type="button"
          class="source-tab"
          class:source-tab--active={source === 'bricks'}
          onclick={() => switchSource('bricks')}
        >Bricks</button>
      {/if}
      <button
        type="button"
        class="source-tab"
        class:source-tab--active={source === 'manual'}
        onclick={() => switchSource('manual')}
      >Manual</button>
    </div>

    <!-- Input per source -->
    {#if source === 'system'}
      <select
        id={fieldKey}
        class="font-select"
        value={effectiveValue}
        onchange={onSystemSelect}
      >
        {#each SYSTEM_STACKS as stack (stack.value)}
          <option value={stack.value}>{stack.label}</option>
        {/each}
      </select>

    {:else if source === 'bricks' && hasBricksFonts}
      <select
        id={fieldKey}
        class="font-select"
        value={effectiveValue}
        onchange={onBricksSelect}
      >
        {#each bricksFonts as font (font.family)}
          <option value={font.family}>
            {font.label}{sourceBadge(font.source)}
          </option>
        {/each}
      </select>

    {:else}
      <input
        id={fieldKey}
        type="text"
        class="font-text"
        value={currentValue}
        placeholder={String(defaultValue)}
        spellcheck="false"
        oninput={onManualInput}
      />
    {/if}

    <!-- Live preview -->
    {#if effectiveValue}
      <span class="font-preview" style="font-family: {effectiveValue}">
        The quick brown fox
      </span>
    {/if}
  </div>
</FieldRow>

<style>
  .font-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 420px;
  }

  .source-tabs {
    display: flex;
    gap: 2px;
  }

  .source-tab {
    padding: 3px 10px;
    font-size: 11px;
    font-weight: 500;
    border: 1px solid #c3c4c7;
    background: #f6f7f7;
    color: #50575e;
    border-radius: 3px;
    cursor: pointer;
    line-height: 1.4;
  }
  .source-tab:hover { background: #f0f0f1; }
  .source-tab--active {
    background: #2271b1;
    border-color: #2271b1;
    color: #fff;
  }

  .font-select,
  .font-text {
    width: 100%;
    box-sizing: border-box;
    font-size: 13px;
    padding: 4px 8px;
    border: 1px solid #c3c4c7;
    border-radius: 3px;
    background: #fff;
    color: #1d2327;
    height: 30px;
  }
  .font-select:focus,
  .font-text:focus {
    outline: 2px solid #2271b1;
    outline-offset: 0;
    border-color: #2271b1;
  }

  .font-preview {
    font-size: 15px;
    color: #1d2327;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 2px 0;
  }
</style>
