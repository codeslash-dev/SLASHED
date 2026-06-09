<script>
  /**
   * Accessibility view: a WCAG 2.1 contrast checker, a text-on-background
   * matrix, and an accessible-palette optimizer — all driven by the live
   * catalogue + overrides.
   *
   * Color resolution is done in-context: every framework default and the
   * user's overrides are applied to a hidden probe root (the same declaration
   * block the live preview uses), so `var()`, `light-dark()`, `oklch(from …)`
   * and `color-mix()` resolve exactly as they would in the real cascade. Each
   * measured token gets a probe span whose computed `color` we read back.
   *
   * The maths (contrast, levels, palette suggestion) lives in the shared,
   * unit-tested ../lib/color.js so it stays in lockstep with the WP plugin.
   */
  import { overrides, ui, setOverride } from '../lib/store.svelte.js';
  import { allTokens, tokenByName, isColorToken } from '../lib/model.js';
  import { buildPreviewDeclarations } from '../lib/preview.js';
  import {
    contrastRatio,
    wcagLevel,
    wcagLevelLarge,
    levelClass,
    suggestAccessiblePalette,
  } from '../lib/color.js';

  // Every color token, for the free pair picker.
  const colorTokens = allTokens.filter(isColorToken);
  const colorNames = colorTokens.map((t) => t.name);

  const shortLabel = (name) => name.replace(/^--sf-color-/, '').replace(/^--sf-/, '');

  // Curated "text on background" matrix — the contrast pairs that actually
  // matter for legibility. Filtered to tokens present in this catalogue.
  const FG = ['--sf-color-text', '--sf-color-heading', '--sf-color-text--muted', '--sf-color-link', '--sf-color-action', '--sf-color-primary'].filter((n) => tokenByName.has(n));
  const BG = ['--sf-color-bg', '--sf-color-surface', '--sf-color-inset', '--sf-color-base', '--sf-color-primary', '--sf-color-action'].filter((n) => tokenByName.has(n));

  // Optimizer source tokens.
  const OPT = { base: '--sf-color-base', neutral: '--sf-color-neutral', action: '--sf-color-action' };
  const optAvailable = tokenByName.has(OPT.base) && tokenByName.has(OPT.neutral) && tokenByName.has(OPT.action);

  // Pair-picker selection.
  let fg = $state(FG[0] ?? colorNames[0] ?? '');
  let bg = $state(BG[0] ?? colorNames[1] ?? colorNames[0] ?? '');

  // Tokens we need a resolved RGB for this render.
  const measured = $derived([...new Set([...FG, ...BG, fg, bg, OPT.base, OPT.neutral, OPT.action].filter(Boolean))]);

  const declStr = $derived(buildPreviewDeclarations(overrides, ui.previewTheme));

  /** name -> [r,g,b] | null, read from the probe spans after each render. */
  let resolved = $state({});
  /** @type {Record<string, HTMLElement>} */
  let probes = {};
  let probeRoot;

  /** Parse a computed `rgb(...)` / `rgba(...)` string to [r,g,b] or null. */
  function parseRgb(str) {
    const m = /rgba?\(([^)]+)\)/.exec(str || '');
    if (!m) return null;
    const parts = m[1].split(/[ ,/]+/).map(Number).filter((n) => !Number.isNaN(n));
    if (parts.length < 3) return null;
    if (parts.length >= 4 && parts[3] === 0) return null;
    return [parts[0], parts[1], parts[2]];
  }

  $effect(() => {
    // Depend on the declaration block + the measured set so we re-read after
    // any override / theme / selection change has been applied to the DOM.
    void declStr;
    const next = {};
    for (const name of measured) {
      const el = probes[name];
      if (!el) continue;
      next[name] = parseRgb(getComputedStyle(el).color);
    }
    resolved = next;
  });

  const fgRgb = $derived(resolved[fg] ?? null);
  const bgRgb = $derived(resolved[bg] ?? null);
  const ratio = $derived(fgRgb && bgRgb ? contrastRatio(fgRgb, bgRgb) : null);
  const normalLevel = $derived(ratio !== null ? wcagLevel(ratio) : null);
  const largeLevel = $derived(ratio !== null ? wcagLevelLarge(ratio) : null);

  const cssColor = (name) => `var(${name})`;

  // Grid of fg(rows) × bg(cols) ratios.
  const grid = $derived(
    FG.map((fgName) =>
      BG.map((bgName) => {
        const a = resolved[fgName];
        const b = resolved[bgName];
        if (!a || !b) return { ratio: null, level: null };
        const r = contrastRatio(a, b);
        return { ratio: r, level: wcagLevel(r) };
      })
    )
  );

  // ── Optimizer ──────────────────────────────────────────────────────────
  let suggestion = $state(null);
  let optMsg = $state('');

  function runOptimizer() {
    optMsg = '';
    suggestion = suggestAccessiblePalette({
      baseRgb: resolved[OPT.base],
      neutralRgb: resolved[OPT.neutral],
      actionRgb: resolved[OPT.action],
    });
    if (!suggestion) optMsg = 'Could not resolve base/neutral/action colors to optimize.';
  }

  function applySuggestion() {
    if (!suggestion) return;
    if (suggestion.base) setOverride(OPT.base, suggestion.base.color);
    if (suggestion.neutral) setOverride(OPT.neutral, suggestion.neutral.color);
    if (suggestion.action) setOverride(OPT.action, suggestion.action.color);
    optMsg = 'Applied ✓';
    suggestion = null;
    setTimeout(() => (optMsg = ''), 2400);
  }
</script>

<!-- Hidden resolution context: all tokens applied, one probe per measured name. -->
<div class="wcag-probe" bind:this={probeRoot} style={declStr} aria-hidden="true">
  {#each measured as name (name)}
    <span bind:this={probes[name]} style="color: {cssColor(name)}"></span>
  {/each}
</div>

<div class="wcag">
  <header class="wcag__head">
    <h2 class="wcag__title">Accessibility</h2>
    <p class="wcag__lead">
      WCAG 2.1 contrast for your token palette, resolved with current overrides in
      <strong>{ui.previewTheme}</strong> mode. Switch the theme from the live preview bar.
    </p>
  </header>

  <!-- ── Pair checker ────────────────────────────────────────────────── -->
  <section class="card">
    <div class="checker">
      <div class="checker__controls">
        <label class="checker__field">
          <span>Foreground</span>
          <select bind:value={fg}>
            {#each colorNames as name (name)}<option value={name}>{shortLabel(name)}</option>{/each}
          </select>
        </label>
        <button
          class="cfg-btn cfg-btn--ghost checker__swap"
          title="Swap foreground and background"
          onclick={() => ([fg, bg] = [bg, fg])}
          aria-label="Swap colors"
        >⇅</button>
        <label class="checker__field">
          <span>Background</span>
          <select bind:value={bg}>
            {#each colorNames as name (name)}<option value={name}>{shortLabel(name)}</option>{/each}
          </select>
        </label>
      </div>

      <div class="checker__result" style="background: {cssColor(bg)}">
        {#if ratio !== null}
          <div class="checker__sample" style="color: {cssColor(fg)}">Aa</div>
          <div class="checker__ratio">{ratio.toFixed(2)}:1</div>
          <div class="checker__badges">
            <span class="badge-row"><span>Normal</span><span class="badge {levelClass(normalLevel)}">{normalLevel}</span></span>
            <span class="badge-row"><span>Large</span><span class="badge {levelClass(largeLevel)}">{largeLevel}</span></span>
          </div>
        {:else}
          <div class="checker__empty">Pick two resolvable colors.</div>
        {/if}
      </div>
    </div>
  </section>

  <!-- ── Matrix ──────────────────────────────────────────────────────── -->
  {#if FG.length && BG.length}
    <section class="card">
      <h3 class="card__h">Text on background</h3>
      <div class="matrix-wrap">
        <table class="matrix">
          <thead>
            <tr>
              <th></th>
              {#each BG as bgName (bgName)}
                <th><span class="matrix__sw" style="background: {cssColor(bgName)}"></span><span class="matrix__lbl">{shortLabel(bgName)}</span></th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each FG as fgName, fi (fgName)}
              <tr>
                <th class="matrix__row-h">{shortLabel(fgName)}</th>
                {#each BG as bgName, bi (bgName)}
                  {@const cell = grid[fi][bi]}
                  <td
                    class="matrix__cell matrix__cell--{cell.level ?? 'na'}"
                    class:matrix__cell--active={fg === fgName && bg === bgName}
                    title="{shortLabel(fgName)} on {shortLabel(bgName)}"
                    onclick={() => { fg = fgName; bg = bgName; }}
                    role="button"
                    tabindex="0"
                    onkeydown={(e) => e.key === 'Enter' && (fg = fgName, bg = bgName)}
                  >{cell.ratio !== null ? cell.ratio.toFixed(1) : '—'}</td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      <div class="legend">
        <span><i class="dot dot--aaa"></i>AAA ≥ 7</span>
        <span><i class="dot dot--aa"></i>AA ≥ 4.5</span>
        <span><i class="dot dot--aa-large"></i>AA large ≥ 3</span>
        <span><i class="dot dot--fail"></i>Fail &lt; 3</span>
      </div>
    </section>
  {/if}

  <!-- ── Optimizer ───────────────────────────────────────────────────── -->
  {#if optAvailable}
    <section class="card">
      <h3 class="card__h">Palette optimizer</h3>
      <p class="card__lead">
        Keeps your brand hues but searches lightness for the most accessible
        <strong>base</strong>, <strong>neutral</strong> and <strong>action</strong> values.
      </p>
      <div class="opt__actions">
        <button class="cfg-btn cfg-btn--primary" onclick={runOptimizer}>Suggest accessible palette</button>
        {#if optMsg}<span class="opt__msg">{optMsg}</span>{/if}
      </div>

      {#if suggestion}
        <div class="opt__results">
          {#each [['base', suggestion.base], ['neutral', suggestion.neutral], ['action', suggestion.action]] as [role, s] (role)}
            <div class="opt__row">
              <span class="opt__sw" style="background: {s ? s.color : '#888'}"></span>
              <span class="opt__role">{role}</span>
              {#if s}
                <code class="opt__val">{s.color}</code>
                {#if s.ratio != null}<span class="badge {levelClass(wcagLevel(s.ratio))}">{s.ratio.toFixed(2)}:1 {wcagLevel(s.ratio)}</span>{:else}<span class="badge badge--neutral">surface</span>{/if}
              {:else}
                <span class="opt__none">no accessible value on this hue</span>
              {/if}
            </div>
          {/each}
          <div class="opt__apply">
            <button class="cfg-btn cfg-btn--primary" onclick={applySuggestion}>Apply to overrides</button>
            <button class="cfg-btn cfg-btn--ghost" onclick={() => (suggestion = null)}>Dismiss</button>
          </div>
        </div>
      {/if}
    </section>
  {/if}
</div>

<style>
  .wcag-probe {
    position: absolute;
    width: 0;
    height: 0;
    overflow: hidden;
    visibility: hidden;
    pointer-events: none;
  }
  .wcag {
    padding: 18px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .wcag__title { margin: 0; font-size: 18px; }
  .wcag__lead { margin: 4px 0 0; color: var(--cfg-text-muted); font-size: 13px; max-width: 70ch; }

  .card {
    background: var(--cfg-surface);
    border: 1px solid var(--cfg-border);
    border-radius: var(--cfg-radius);
    padding: 16px;
  }
  .card__h { margin: 0 0 4px; font-size: 14px; }
  .card__lead { margin: 0 0 12px; color: var(--cfg-text-muted); font-size: 13px; max-width: 70ch; }

  /* Checker */
  .checker { display: grid; grid-template-columns: 1fr auto; gap: 16px; align-items: stretch; }
  .checker__controls { display: flex; align-items: flex-end; gap: 10px; }
  .checker__field { display: flex; flex-direction: column; gap: 5px; flex: 1; min-width: 0; }
  .checker__field span { font-size: 12px; color: var(--cfg-text-muted); }
  .checker__field select {
    width: 100%;
    background: var(--cfg-bg);
    color: var(--cfg-text);
    border: 1px solid var(--cfg-border-strong);
    border-radius: var(--cfg-radius-s);
    padding: 7px 9px;
    font-family: var(--cfg-mono);
    font-size: 12px;
  }
  .checker__swap { font-size: 16px; padding: 6px 9px; align-self: flex-end; }
  .checker__result {
    min-width: 190px;
    border: 1px solid var(--cfg-border-strong);
    border-radius: var(--cfg-radius);
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .checker__sample { font-size: 44px; font-weight: 700; line-height: 1; }
  .checker__ratio {
    font-size: 20px;
    font-weight: 700;
    color: #111;
    background: rgba(255, 255, 255, 0.85);
    padding: 2px 10px;
    border-radius: var(--cfg-radius-s);
  }
  .checker__badges { display: flex; flex-direction: column; gap: 4px; width: 100%; }
  .badge-row {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    background: rgba(255, 255, 255, 0.85);
    padding: 3px 9px;
    border-radius: var(--cfg-radius-s);
    font-size: 11px;
    color: #333;
  }
  .checker__empty { color: var(--cfg-text-muted); font-size: 13px; text-align: center; }

  .badge { font-size: 11px; font-weight: 700; padding: 1px 7px; border-radius: 3px; white-space: nowrap; }
  .badge--aaa { background: #2b8a3e; color: #fff; }
  .badge--aa { background: #1971c2; color: #fff; }
  .badge--aa-large { background: #e8a317; color: #1a1a1a; }
  .badge--fail { background: #c92a2a; color: #fff; }
  .badge--neutral { background: var(--cfg-surface-2); color: var(--cfg-text-muted); border: 1px solid var(--cfg-border-strong); }

  /* Matrix */
  .matrix-wrap { overflow-x: auto; }
  .matrix { border-collapse: collapse; font-size: 12px; }
  .matrix th { font-weight: 500; color: var(--cfg-text-muted); padding: 6px; }
  .matrix thead th { text-align: center; }
  .matrix__sw { display: block; width: 22px; height: 22px; border-radius: 4px; border: 1px solid var(--cfg-border-strong); margin: 0 auto 3px; }
  .matrix__lbl { font-size: 10px; font-family: var(--cfg-mono); }
  .matrix__row-h { text-align: right; font-family: var(--cfg-mono); font-size: 11px; padding-right: 10px; white-space: nowrap; }
  .matrix__cell {
    width: 58px;
    height: 40px;
    text-align: center;
    font-weight: 700;
    font-size: 11px;
    color: #1a1a1a;
    border: 1px solid var(--cfg-border);
    cursor: pointer;
  }
  .matrix__cell--AAA { background: #b6f0c4; }
  .matrix__cell--AA { background: #b8dcf7; }
  .matrix__cell--AA-large { background: #fbe7a8; }
  .matrix__cell--fail { background: #f5c2c2; }
  .matrix__cell--na { background: var(--cfg-surface-2); color: var(--cfg-text-faint); cursor: default; }
  .matrix__cell--active { outline: 2px solid var(--cfg-text); outline-offset: -2px; }
  .matrix__cell:hover:not(.matrix__cell--na) { filter: brightness(0.95); }

  .legend { display: flex; gap: 16px; flex-wrap: wrap; margin-top: 10px; font-size: 12px; color: var(--cfg-text-muted); }
  .legend span { display: flex; align-items: center; gap: 6px; }
  .dot { width: 12px; height: 12px; border-radius: 3px; display: inline-block; }
  .dot--aaa { background: #b6f0c4; }
  .dot--aa { background: #b8dcf7; }
  .dot--aa-large { background: #fbe7a8; }
  .dot--fail { background: #f5c2c2; }

  /* Optimizer */
  .opt__actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
  .opt__msg { font-size: 13px; color: var(--cfg-ok); font-weight: 500; }
  .opt__results { margin-top: 14px; border: 1px solid var(--cfg-border); border-radius: var(--cfg-radius); overflow: hidden; }
  .opt__row { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-bottom: 1px solid var(--cfg-border); }
  .opt__row:last-child { border-bottom: none; }
  .opt__sw { width: 30px; height: 30px; border-radius: var(--cfg-radius-s); border: 1px solid var(--cfg-border-strong); flex-shrink: 0; }
  .opt__role { font-weight: 600; text-transform: capitalize; min-width: 70px; }
  .opt__val { font-family: var(--cfg-mono); font-size: 11px; background: var(--cfg-bg); padding: 2px 6px; border-radius: 3px; color: var(--cfg-text-muted); flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .opt__none { color: var(--cfg-text-faint); font-size: 12px; }
  .opt__apply { display: flex; gap: 8px; padding: 12px 14px; background: var(--cfg-surface-2); }
</style>
