<script>
  /**
   * The input control for a single token, chosen from the token's inferred
   * control type. Reads/writes through the override store: the displayed value
   * is the override when set, otherwise empty (with the framework default shown
   * as a placeholder so the user always sees the baseline).
   */
  import { overrides, setOverride } from '../lib/store.svelte.js';
  import { inferControl } from '../lib/model.js';
  import { SYSTEM_STACKS, detectSystemStack, isFontFamilyToken } from '../lib/fonts.js';

  let { token } = $props();

  const meta = $derived(inferControl(token));
  // Current edit value: the override if present, else '' (placeholder shows default).
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

  // Native color picker emits #rrggbb; only meaningful when the default is hex.
  function onPick(e) {
    setOverride(token.name, e.currentTarget.value);
  }

  // A best-effort hex seed for the native picker when nothing is set yet.
  const pickerValue = $derived(
    /^#([0-9a-fA-F]{6})$/.test(current)
      ? current
      : /^#([0-9a-fA-F]{6})$/.test(token.value || '')
        ? token.value
        : '#888888'
  );
</script>

<div class="editor" class:editor--color={meta.control === 'color'} class:editor--font={isFont}>
  {#if isFont}
    <div class="font">
      <div class="font__top">
        <div class="font__seg" role="group" aria-label="Font source">
          <button
            class="font__seg-btn"
            class:font__seg-btn--on={fontSource === 'system'}
            onclick={() => (userSource = 'system')}
            type="button"
          >System</button>
          <button
            class="font__seg-btn"
            class:font__seg-btn--on={fontSource === 'manual'}
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
    {#if meta.hexable}
      <input
        class="editor__swatch-input"
        type="color"
        value={pickerValue}
        oninput={onPick}
        title="Pick a color"
        aria-label="{token.name} color picker"
      />
    {:else}
      <span
        class="editor__swatch"
        style:--probe={current || token.value}
        title="Resolved preview of the current value"
        aria-hidden="true"
      ></span>
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
  .editor__swatch,
  .editor__swatch-input {
    width: 30px;
    height: 30px;
    flex-shrink: 0;
    border-radius: var(--cfg-radius-s);
    border: 1px solid var(--cfg-border-strong);
    padding: 0;
  }
  .editor__swatch {
    background: var(--probe, transparent);
    /* Checker backdrop so transparent/alpha values stay visible. */
    background-image:
      linear-gradient(var(--probe, transparent), var(--probe, transparent)),
      conic-gradient(#444 25%, #2a2a2a 0 50%, #444 0 75%, #2a2a2a 0);
    background-size: cover, 12px 12px;
  }
  .editor__swatch-input {
    cursor: pointer;
    background: transparent;
  }
  .editor__unit {
    color: var(--cfg-text-faint);
    font-family: var(--cfg-mono);
    font-size: 12px;
    min-width: 24px;
  }
</style>
