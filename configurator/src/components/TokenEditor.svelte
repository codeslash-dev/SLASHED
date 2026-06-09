<script>
  import { overrides, setOverride } from '../lib/store.svelte.js';
  import { inferControl } from '../lib/model.js';
  import { SYSTEM_STACKS, detectSystemStack, isFontFamilyToken } from '../lib/fonts.js';
  import OklchPicker from './OklchPicker.svelte';

  let { token } = $props();

  const meta = $derived(inferControl(token));
  const current = $derived(overrides[token.name] ?? '');

  // ── Font-family tokens get a System-stack picker + live preview ─────────
  const isFont = $derived(isFontFamilyToken(token));
  const effective = $derived(current || token.value || '');
  // null = auto-detect from the value; a string is the user's explicit choice.
  let userSource = $state(null);
  const fontSource = $derived(userSource ?? (detectSystemStack(effective) ? 'system' : 'manual'));
  function onSystemPick(e) {
    setOverride(token.name, e.currentTarget.value);
  }

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

<div class="editor" class:editor--color={meta.control === 'color'} class:editor--font={isFont}>
  {#if isFont}
    <div class="font">
      <div class="font__top">
        <div class="font__seg" role="group" aria-label="Font source">
          <button
            class="font__seg-btn"
            class:font__seg-btn--on={fontSource === 'system'}
            aria-pressed={fontSource === 'system'}
            onclick={() => (userSource = 'system')}
            type="button"
          >System</button>
          <button
            class="font__seg-btn"
            class:font__seg-btn--on={fontSource === 'manual'}
            aria-pressed={fontSource === 'manual'}
            onclick={() => (userSource = 'manual')}
            type="button"
          >Manual</button>
        </div>
        {#if fontSource === 'system'}
          <select
            class="font__select"
            value={detectSystemStack(effective)?.value ?? ''}
            onchange={onSystemPick}
            aria-label="{token.name} system stack"
          >
            <option value="" disabled>Choose a system stack…</option>
            {#each SYSTEM_STACKS as s (s.value)}
              <option value={s.value}>{s.label}</option>
            {/each}
          </select>
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
      {#if effective}
        <span class="font__preview" style="font-family: {effective}">Ag — The quick brown fox jumps</span>
      {/if}
    </div>
  {:else if meta.control === 'color'}
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
  .editor--font {
    align-items: stretch;
  }
  .font {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
  }
  .font__top {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .font__seg {
    display: inline-flex;
    border: 1px solid var(--cfg-border-strong);
    border-radius: var(--cfg-radius-s);
    overflow: hidden;
    flex-shrink: 0;
  }
  .font__seg-btn {
    background: var(--cfg-surface-2);
    color: var(--cfg-text-muted);
    border: none;
    padding: 6px 10px;
    font-size: 11px;
  }
  .font__seg-btn--on {
    background: var(--cfg-accent-strong);
    color: #fff;
  }
  .font__select {
    flex: 1;
    min-width: 0;
    background: var(--cfg-bg);
    border: 1px solid var(--cfg-border-strong);
    border-radius: var(--cfg-radius-s);
    color: var(--cfg-text);
    padding: 6px 9px;
    font-size: 12px;
  }
  .font__preview {
    font-size: 15px;
    color: var(--cfg-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 2px 2px 0;
    border-top: 1px dashed var(--cfg-border);
    padding-top: 6px;
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
