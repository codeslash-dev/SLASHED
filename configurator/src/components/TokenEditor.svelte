<script>
  import { overrides, setOverride } from '../lib/store.svelte.js';
  import { inferControl } from '../lib/model.js';
  import OklchPicker from './OklchPicker.svelte';

  let { token } = $props();

  const meta = $derived(inferControl(token));
  const current = $derived(overrides[token.name] ?? '');

  /** @param {Event} e */
  function onInput(e) {
    setOverride(token.name, e.currentTarget.value);
  }

  // ── Color picker ──────────────────────────────────────────────────────────
  let pickerOpen = $state(false);
  let pickerTop = $state(0);
  let pickerLeft = $state(0);
  let swatchEl = $state(null);

  function togglePicker() {
    if (pickerOpen) {
      pickerOpen = false;
      return;
    }
    if (swatchEl) {
      const r = swatchEl.getBoundingClientRect();
      const pickerHeight = 240;
      const spaceBelow = window.innerHeight - r.bottom;
      pickerTop = spaceBelow >= pickerHeight ? r.bottom + 6 : r.top - pickerHeight - 6;
      pickerLeft = Math.min(r.left, window.innerWidth - 296);
    }
    pickerOpen = true;
  }

  function onPick(v) {
    setOverride(token.name, v);
  }
</script>

<div class="editor" class:editor--color={meta.control === 'color'}>
  {#if meta.control === 'color'}
    <button
      class="editor__swatch"
      bind:this={swatchEl}
      style:--probe={current || token.value}
      onclick={togglePicker}
      title="Open color picker"
      aria-label="{token.name} color picker"
      aria-expanded={pickerOpen}
    ></button>

    {#if pickerOpen}
      <OklchPicker
        value={current || token.value || ''}
        top={pickerTop}
        left={pickerLeft}
        triggerEl={swatchEl}
        onpick={onPick}
        onclose={() => (pickerOpen = false)}
      />
    {/if}

    <input
      class="editor__text editor__text--mono"
      type="text"
      spellcheck="false"
      value={current}
      placeholder={token.value}
      oninput={onInput}
      aria-label="{token.name} value"
    />
  {:else if meta.control === 'number'}
    <input
      class="editor__text"
      type="number"
      step="any"
      value={current}
      placeholder={token.value}
      oninput={onInput}
      aria-label="{token.name} value"
    />
  {:else if meta.control === 'length'}
    <input
      class="editor__text editor__text--mono"
      type="text"
      spellcheck="false"
      value={current}
      placeholder={token.value}
      oninput={onInput}
      aria-label="{token.name} value"
    />
    <span class="editor__unit">{meta.unit}</span>
  {:else}
    <input
      class="editor__text editor__text--mono"
      type="text"
      spellcheck="false"
      value={current}
      placeholder={token.value}
      oninput={onInput}
      aria-label="{token.name} value"
    />
  {/if}
</div>

<style>
  .editor {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .editor__text {
    flex: 1;
    min-width: 0;
    background: var(--cfg-bg);
    border: 1px solid var(--cfg-border-strong);
    border-radius: var(--cfg-radius-s);
    color: var(--cfg-text);
    padding: 6px 9px;
    font-size: 13px;
  }
  .editor__text:focus {
    outline: 2px solid var(--cfg-accent);
    outline-offset: -1px;
  }
  .editor__text--mono {
    font-family: var(--cfg-mono);
    font-size: 12px;
  }
  .editor__text::placeholder {
    color: var(--cfg-text-faint);
  }
  .editor__swatch {
    width: 30px;
    height: 30px;
    flex-shrink: 0;
    border-radius: var(--cfg-radius-s);
    border: 1px solid var(--cfg-border-strong);
    padding: 0;
    cursor: pointer;
    background-image:
      linear-gradient(var(--probe, transparent), var(--probe, transparent)),
      conic-gradient(#444 25%, #2a2a2a 0 50%, #444 0 75%, #2a2a2a 0);
    background-size: cover, 12px 12px;
    transition: box-shadow 0.1s;
  }
  .editor__swatch:hover {
    box-shadow: 0 0 0 2px var(--cfg-accent);
  }
  .editor__unit {
    color: var(--cfg-text-faint);
    font-family: var(--cfg-mono);
    font-size: 12px;
    min-width: 24px;
  }
</style>
