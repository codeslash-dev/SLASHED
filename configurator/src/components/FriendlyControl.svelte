<script>
  import { overrides, clearOverride, setOverride } from '../lib/store.svelte.js';
  import { controlForToken } from '../lib/controlSchema.js';
  import TokenEditor from './TokenEditor.svelte';
  import ControlPreview from './ControlPreview.svelte';
  let { token, label = '', help = '', schema = {}, showToken = false } = $props();
  const meta = $derived(controlForToken(token, schema));
  const title = $derived(label || meta.label);
  const desc = $derived(help || meta.description);
  const modified = $derived(overrides[token.name] != null);
  const activeValue = $derived(overrides[token.name] ?? token.value ?? '');
  let rawOpen = $state(false);

  function onSelect(e) {
    setOverride(token.name, e.currentTarget.value);
  }
</script>

<article class="friendly" class:friendly--modified={modified}>
  <div class="friendly__copy">
    <div class="friendly__top">
      <strong>{title}</strong>
      {#if modified}<span>modified</span>{/if}
    </div>
    {#if desc}<p>{desc}</p>{/if}
    {#if showToken || rawOpen}<code class="friendly__token">{token.name}</code>{/if}
  </div>
  <div class="friendly__editor">
    {#if meta.control === 'select' && meta.options?.length}
      <select class="cfg-select friendly__select" value={activeValue} onchange={onSelect} aria-label={token.name}>
        {#if activeValue && !meta.options.includes(activeValue)}
          <option value={activeValue}>{activeValue}</option>
        {/if}
        {#each meta.options as option (option)}
          <option value={option}>{option}</option>
        {/each}
      </select>
    {:else}
      <TokenEditor {token} />
    {/if}
  </div>
  <ControlPreview {token} type={meta.preview} />
  <div class="friendly__actions">
    <button class="cfg-btn cfg-btn--ghost cfg-btn--sm" type="button" onclick={() => (rawOpen = !rawOpen)}>{rawOpen ? 'Hide token' : 'Show token'}</button>
    <button class="cfg-btn cfg-btn--ghost cfg-btn--sm" type="button" disabled={!modified} onclick={() => clearOverride(token.name)}>Reset</button>
  </div>
</article>

<style>
  .friendly { display: grid; grid-template-columns: minmax(180px, .9fr) minmax(260px, 1.2fr) minmax(180px, .75fr) auto; gap: 14px; align-items: center; padding: 14px 16px; border-top: 1px solid var(--cfg-border); background: var(--cfg-surface); }
  .friendly:first-child { border-top: 0; }
  .friendly--modified { box-shadow: inset 3px 0 0 var(--cfg-accent-strong); background: linear-gradient(90deg, rgba(79,140,255,.08), transparent 55%), var(--cfg-surface); }
  .friendly__copy { min-width: 0; display:grid; gap:4px; }
  .friendly__top { display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
  .friendly__top strong { font-size: 13px; }
  .friendly__top span { font-size: 10px; text-transform: uppercase; color: var(--cfg-accent); border: 1px solid color-mix(in oklab, var(--cfg-accent) 40%, transparent); border-radius: 999px; padding: 1px 6px; }
  .friendly__copy p { margin: 0; color: var(--cfg-text-muted); font-size: 12px; }
  .friendly__token { color: var(--cfg-text-faint); font-size: 11px; word-break: break-all; }
  .friendly__editor { min-width: 0; }
  .friendly__select { width: 100%; }
  .friendly__actions { display:flex; gap:6px; justify-content:flex-end; flex-wrap:wrap; }
  @media (max-width: 980px) { .friendly { grid-template-columns: 1fr; align-items: stretch; } .friendly__actions { justify-content:flex-start; } }
</style>
