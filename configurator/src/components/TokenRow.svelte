<script>
  /**
   * One token row: name + metadata on the left, editor + reset on the right.
   */
  import { overrides, clearOverride } from '../lib/store.svelte.js';
  import TokenEditor from './TokenEditor.svelte';

  let { token } = $props();

  const modified = $derived(token.name in overrides);

  const tierClass = $derived(
    token.tier === 'PUBLIC'
      ? 'cfg-badge--public'
      : token.tier === 'PUBLIC-ADVANCED'
        ? 'cfg-badge--advanced'
        : 'cfg-badge--internal'
  );
  const tierLabel = $derived(
    token.tier === 'PUBLIC-ADVANCED' ? 'advanced' : token.tier.toLowerCase()
  );
</script>

<div class="row" class:row--modified={modified}>
  <div class="row__info">
    <div class="row__name-line">
      <code class="row__name">{token.name}</code>
      <span class="cfg-badge {tierClass}">{tierLabel}</span>
      {#if token.aliasOf}
        <span class="row__alias" title="Aliases {token.aliasOf}">→ {token.aliasOf}</span>
      {/if}
      {#if token.optional}
        <span class="row__opt" title="Ships only in optimal+ bundles (optional/)">optional</span>
      {/if}
    </div>
    {#if token.description}
      <p class="row__desc">{token.description}</p>
    {/if}
  </div>

  <div class="row__control">
    <TokenEditor {token} />
    <button
      class="cfg-btn cfg-btn--ghost row__reset"
      onclick={() => clearOverride(token.name)}
      disabled={!modified}
      title="Reset to framework default"
      aria-label="Reset {token.name}"
    >
      ⟲
    </button>
  </div>
</div>

<style>
  .row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(260px, 380px);
    gap: 16px;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid var(--cfg-border);
  }
  .row:last-child {
    border-bottom: none;
  }
  .row--modified {
    background: linear-gradient(
      90deg,
      rgba(79, 140, 255, 0.08),
      transparent 60%
    );
    box-shadow: inset 3px 0 0 var(--cfg-accent-strong);
  }
  .row__name-line {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .row__name {
    font-family: var(--cfg-mono);
    font-size: 12.5px;
    color: var(--cfg-text);
    word-break: break-all;
  }
  .row__alias {
    font-family: var(--cfg-mono);
    font-size: 11px;
    color: var(--cfg-text-faint);
  }
  .row__opt {
    font-size: 10px;
    color: var(--cfg-text-faint);
    border: 1px solid var(--cfg-border);
    border-radius: 999px;
    padding: 0 6px;
  }
  .row__desc {
    margin: 4px 0 0;
    font-size: 12px;
    color: var(--cfg-text-muted);
    max-width: 60ch;
  }
  .row__control {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .row__reset {
    flex-shrink: 0;
    font-size: 15px;
    padding: 4px 8px;
    line-height: 1;
  }
</style>
