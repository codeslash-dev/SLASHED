<script>
  /**
   * Output drawer.
   *
   * Lives at the bottom of the shell and is collapsible (so it stays out of
   * the way when the user is editing). Renders the live override CSS with
   * minimal regex syntax highlighting, plus copy / download / clear / paste-
   * to-import controls and the @layer/:root output-format toggle.
   *
   * The drawer collapses to a thin status bar when closed; an "X tokens
   * customised" pill keeps the user oriented even with the body hidden.
   */
  import { overrides, ui, storage, replaceOverrides, clearAll } from '../lib/store.svelte.js';
  import { sync } from '../lib/model.js';
  import { generateCSS, parseCSS } from '../lib/css.js';

  const count = $derived(Object.keys(overrides).length);
  const css = $derived(generateCSS(overrides, { mode: ui.outputMode }));
  const lineCount = $derived(css ? css.split('\n').length : 0);

  let copied = $state(false);
  let importOpen = $state(false);
  let importText = $state('');
  let importMsg = $state('');
  let drawerOpen = $state(true);

  async function copy() {
    if (!css) return;
    try {
      await navigator.clipboard.writeText(css);
      copied = true;
      setTimeout(() => (copied = false), 1400);
    } catch {
      importMsg = 'Clipboard blocked — select the text and copy manually.';
    }
  }

  function download() {
    if (!css) return;
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'slashed.overrides.css';
    a.click();
    URL.revokeObjectURL(url);
  }

  function runImport() {
    const parsed = parseCSS(importText);
    const { applied, skipped } = replaceOverrides(parsed);
    importMsg =
      `Imported ${applied} token${applied === 1 ? '' : 's'}` +
      (skipped.length ? `, skipped ${skipped.length} unknown.` : '.');
    if (applied > 0) {
      importText = '';
      importOpen = false;
    }
  }

  // ── Tiny CSS syntax highlighter ─────────────────────────────────────────
  // A regex-based tokenizer; keeps the runtime cost trivial (the override
  // block is at most a few hundred lines) and avoids pulling in a real parser.
  function escape(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function highlight(text) {
    return escape(text)
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="hl-c">$1</span>')
      .replace(/(@layer\b)|(:root\b)/g, '<span class="hl-k">$1$2</span>')
      .replace(/(--[\w-]+)(?=\s*:)/g, '<span class="hl-p">$1</span>')
      .replace(/(:\s)([^;\n]+?)(;)/g, (_m, p1, p2, p3) => `${p1}<span class="hl-v">${p2}</span>${p3}`);
  }
  const cssHtml = $derived(highlight(css || '/* No overrides yet — edit a token to generate CSS. */'));
</script>

<section class="out" class:out--closed={!drawerOpen}>
  <header class="out__head">
    <button
      class="out__toggle"
      onclick={() => (drawerOpen = !drawerOpen)}
      aria-expanded={drawerOpen}
      aria-label="{drawerOpen ? 'Collapse' : 'Expand'} output drawer"
      title="{drawerOpen ? 'Collapse' : 'Expand'} the output drawer"
    >
      <span class="out__caret" class:out__caret--open={drawerOpen} aria-hidden="true">▶</span>
      <strong>Override CSS</strong>
      <span class="out__count">{count} token{count === 1 ? '' : 's'}{drawerOpen && lineCount ? ` · ${lineCount} lines` : ''}</span>
    </button>
    <div class="out__actions">
      <div class="out__fmt">
        <span
          class="out__fmt-label"
          title="@layer — for standard SLASHED projects (cascade layers).&#10;:root — for older toolchains without @layer support."
        >Format</span>
        <div class="cfg-seg" role="group" aria-label="Output format">
          <button
            class="cfg-seg__btn"
            class:cfg-seg__btn--on={ui.outputMode === 'layer'}
            onclick={() => (ui.outputMode = 'layer')}
            title="@layer slashed.overrides — cascade layers"
          >@layer</button>
          <button
            class="cfg-seg__btn"
            class:cfg-seg__btn--on={ui.outputMode === 'root'}
            onclick={() => (ui.outputMode = 'root')}
            title=":root — bare block, no layers"
          >:root</button>
        </div>
      </div>
      <button class="cfg-btn cfg-btn--sm" onclick={() => (importOpen = !importOpen)}>Import…</button>
      <button class="cfg-btn cfg-btn--sm cfg-btn--danger" onclick={clearAll} disabled={count === 0}>Clear all</button>
      <button class="cfg-btn cfg-btn--sm" onclick={download} disabled={count === 0}>Download</button>
      <button class="cfg-btn cfg-btn--sm cfg-btn--primary" onclick={copy} disabled={count === 0}>
        {copied ? 'Copied ✓' : 'Copy CSS'}
      </button>
    </div>
  </header>

  {#if drawerOpen}
    {#if importOpen}
      <div class="out__import">
        <textarea
          class="cfg-textarea"
          bind:value={importText}
          placeholder="Paste an existing SLASHED override stylesheet here…"
          spellcheck="false"
          rows="4"
        ></textarea>
        <button class="cfg-btn cfg-btn--primary" onclick={runImport} disabled={!importText.trim()}>
          Apply import
        </button>
      </div>
    {/if}

    {#if importMsg}
      <p class="out__msg">{importMsg}</p>
    {/if}

    {#if !storage.ok}
      <p class="out__msg out__msg--warn">
        ⚠ Couldn't save to this browser's storage — your overrides won't persist
        across reloads. Download or copy the CSS to keep them.
      </p>
    {/if}

    <pre class="out__code"><code>{@html cssHtml}</code></pre>

    <footer class="out__foot">
      Synced from <code>{sync.source}</code> · framework
      <code>{sync.frameworkVersion || 'unknown'}</code> ·
      {sync.counts?.tokens ?? 0} tokens in catalogue
    </footer>
  {/if}
</section>

<style>
  .out {
    grid-area: output;
    display: flex;
    flex-direction: column;
    background: var(--cfg-surface);
    border-top: 1px solid var(--cfg-border);
    box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.2);
    max-height: 50vh;
    transition: max-height 0.18s ease;
  }
  .out--closed { max-height: 44px; }

  .out__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 6px 16px;
    flex-wrap: wrap;
    flex-shrink: 0;
  }
  .out__toggle {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: transparent;
    border: none;
    color: var(--cfg-text);
    font: inherit;
    padding: 6px 4px;
    border-radius: var(--cfg-radius-s);
    transition: background 0.12s;
  }
  .out__toggle:hover { background: var(--cfg-surface-2); }
  .out__caret {
    color: var(--cfg-text-faint);
    font-size: 9px;
    transition: transform 0.12s ease;
  }
  .out__caret--open { transform: rotate(90deg); }
  .out__count {
    font-size: 11.5px;
    color: var(--cfg-text-faint);
    font-family: var(--cfg-mono);
  }
  .out__actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .out__fmt {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-right: 4px;
  }
  .out__fmt-label {
    font-size: 11px;
    color: var(--cfg-text-faint);
    cursor: help;
  }
  .out__import {
    display: flex;
    gap: 8px;
    padding: 8px 16px 10px;
    align-items: flex-end;
    flex-shrink: 0;
  }
  .out__import .cfg-textarea {
    flex: 1;
    font-family: var(--cfg-mono);
    font-size: 12px;
    resize: vertical;
  }
  .out__msg {
    margin: 0;
    padding: 0 16px 8px;
    color: var(--cfg-text-muted);
    font-size: 12px;
  }
  .out__msg--warn { color: var(--cfg-warn); }

  .out__code {
    margin: 0;
    padding: 12px 16px;
    overflow: auto;
    flex: 1;
    min-height: 0;
    background: var(--cfg-bg);
    border-top: 1px solid var(--cfg-border);
    font-family: var(--cfg-mono);
    font-size: 12.5px;
    line-height: 1.6;
    color: #c9d4e3;
    white-space: pre;
    tab-size: 2;
  }
  .out__code :global(.hl-c) { color: #6a7283; font-style: italic; }
  .out__code :global(.hl-k) { color: #c792ea; }
  .out__code :global(.hl-p) { color: #82aaff; }
  .out__code :global(.hl-v) { color: #c3e88d; }

  .out__foot {
    padding: 6px 16px;
    font-size: 11px;
    color: var(--cfg-text-faint);
    border-top: 1px solid var(--cfg-border);
    flex-shrink: 0;
  }
  .out__foot code { color: var(--cfg-text-muted); }
</style>
