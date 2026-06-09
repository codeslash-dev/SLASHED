<script>
  /**
   * Output drawer: live-generated override CSS with copy / download, an
   * output-framing toggle, and a paste-to-import box that round-trips an
   * existing override stylesheet back into the editor.
   */
  import { overrides, ui, storage, replaceOverrides, clearAll } from '../lib/store.svelte.js';
  import { sync } from '../lib/model.js';
  import { generateCSS, parseCSS } from '../lib/css.js';

  const count = $derived(Object.keys(overrides).length);
  const css = $derived(generateCSS(overrides, { mode: ui.outputMode }));

  let copied = $state(false);
  let importOpen = $state(false);
  let importText = $state('');
  let importMsg = $state('');

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
</script>

<section class="out">
  <header class="out__head">
    <div class="out__title">
      <strong>Override CSS</strong>
      <span class="out__count">{count} token{count === 1 ? '' : 's'}</span>
    </div>
    <div class="out__actions">
      <div class="out__seg" role="group" aria-label="Output framing">
        <button
          class="out__seg-btn"
          class:out__seg-btn--on={ui.outputMode === 'layer'}
          onclick={() => (ui.outputMode = 'layer')}
          title="Wrap output in @layer slashed.overrides"
        >@layer</button>
        <button
          class="out__seg-btn"
          class:out__seg-btn--on={ui.outputMode === 'root'}
          onclick={() => (ui.outputMode = 'root')}
          title="Output a bare :root rule"
        >:root</button>
      </div>
      <button class="cfg-btn" onclick={() => (importOpen = !importOpen)}>Import…</button>
      <button class="cfg-btn" onclick={clearAll} disabled={count === 0}>Clear</button>
      <button class="cfg-btn" onclick={download} disabled={count === 0}>Download</button>
      <button class="cfg-btn cfg-btn--primary" onclick={copy} disabled={count === 0}>
        {copied ? 'Copied ✓' : 'Copy CSS'}
      </button>
    </div>
  </header>

  {#if importOpen}
    <div class="out__import">
      <textarea
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

  <pre class="out__code"><code>{css || '/* No overrides yet — edit a token to generate CSS. */'}</code></pre>

  <footer class="out__foot">
    Synced from <code>{sync.source}</code> · framework
    <code>{sync.frameworkVersion || 'unknown'}</code> ·
    {sync.counts?.tokens ?? 0} tokens
  </footer>
</section>

<style>
  .out {
    display: flex;
    flex-direction: column;
    min-height: 0;
    background: var(--cfg-surface);
    border-top: 1px solid var(--cfg-border);
  }
  .out__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 10px 16px;
    flex-wrap: wrap;
  }
  .out__title {
    display: flex;
    align-items: baseline;
    gap: 10px;
  }
  .out__count {
    font-size: 12px;
    color: var(--cfg-text-faint);
    font-family: var(--cfg-mono);
  }
  .out__actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .out__seg {
    display: inline-flex;
    border: 1px solid var(--cfg-border-strong);
    border-radius: var(--cfg-radius-s);
    overflow: hidden;
  }
  .out__seg-btn {
    background: var(--cfg-surface-2);
    color: var(--cfg-text-muted);
    border: none;
    padding: 6px 10px;
    font-size: 12px;
    font-family: var(--cfg-mono);
  }
  .out__seg-btn--on {
    background: var(--cfg-accent-strong);
    color: #fff;
  }
  .out__import {
    display: flex;
    gap: 8px;
    padding: 0 16px 10px;
    align-items: flex-end;
  }
  .out__import textarea {
    flex: 1;
    background: var(--cfg-bg);
    border: 1px solid var(--cfg-border-strong);
    border-radius: var(--cfg-radius-s);
    color: var(--cfg-text);
    padding: 8px;
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
  .out__msg--warn {
    color: var(--cfg-warn);
  }
  .out__code {
    margin: 0;
    padding: 12px 16px;
    overflow: auto;
    max-height: 220px;
    background: var(--cfg-bg);
    border-top: 1px solid var(--cfg-border);
    font-family: var(--cfg-mono);
    font-size: 12.5px;
    line-height: 1.5;
    color: #c9d4e3;
    white-space: pre;
  }
  .out__foot {
    padding: 8px 16px;
    font-size: 11px;
    color: var(--cfg-text-faint);
    border-top: 1px solid var(--cfg-border);
  }
  .out__foot code {
    color: var(--cfg-text-muted);
  }
</style>
