<script>
  /**
   * One token row.
   *
   * Layout (≥ 720px): [name + tier + drives + (contrast for colors)]  [editor]  [reset]
   * Layout (< 720px): name on top, editor + actions wrap below.
   *
   * The "modified" affordance is a left accent bar plus a subtle background
   * tint, so a customised token reads as live without shouting.
   *
   * Two new affordances vs the prior shipped row:
   *
   *   1. A "drives N" pill when this token is referenced by ≥ 1 other tokens
   *      via `var(--sf-foo)` (count from model.dependentsCount). It tells
   *      the user how far-reaching their edit will be.
   *
   *   2. A live WCAG contrast badge for color tokens (ContrastBadge) — the
   *      ratio of the token's resolved color against pure white/black,
   *      whichever pairs better. Updates as the user edits.
   */
  import { overrides, clearOverride } from '../lib/store.svelte.js';
  import { dependentsCount, isColorToken, isConsumptionToken } from '../lib/model.js';
  import TokenEditor from './TokenEditor.svelte';
  import ContrastBadge from './ContrastBadge.svelte';

  let { token } = $props();

  const modified = $derived(token.name in overrides);
  const drives = $derived(dependentsCount(token.name));
  const isColor = $derived(isColorToken(token));
  // The effective color value (override if any, else the framework default).
  // Empty when nothing is set (defensive — every catalogued token has a value).
  const effectiveValue = $derived(overrides[token.name] || token.value || '');

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

  const isConsume = $derived(isConsumptionToken(token));
  const usageClass = $derived(isConsume ? 'cfg-badge--consume' : 'cfg-badge--configure');
  const usageLabel = $derived(isConsume ? 'consume' : 'configure');
  const usageTitle = $derived(
    isConsume
      ? 'Consumption token — a derived output you READ in component CSS (e.g. color: var(...)). To change this value, override the upstream configure token instead.'
      : 'Configure token — a literal input you SET in your :root override to tune the system.'
  );

  let copied = $state(false);
  async function copyName() {
    try {
      await navigator.clipboard.writeText(token.name);
      copied = true;
      setTimeout(() => (copied = false), 1200);
    } catch {
      // Clipboard blocked — silent fail; the user can still copy manually.
    }
  }
</script>

<div class="row" class:row--modified={modified}>
  <div class="row__info">
    <div class="row__name-line">
      <button
        class="row__name"
        onclick={copyName}
        title={copied ? 'Copied!' : `Click to copy ${token.name}`}
        aria-label={copied ? 'Copied' : `Copy ${token.name}`}
      >
        <code>{token.name}</code>
        <span class="row__copy" aria-hidden="true">{copied ? '✓' : '⧉'}</span>
      </button>
      <span class="cfg-badge {tierClass}">{tierLabel}</span>
      <span class="cfg-badge {usageClass}" title={usageTitle}>{usageLabel}</span>
      {#if drives > 0}
        <span
          class="row__drives"
          title="{drives} other token{drives === 1 ? '' : 's'} reference{drives === 1 ? 's' : ''} this one via var() — editing it cascades."
        >drives {drives}</span>
      {/if}
      {#if isColor}
        <ContrastBadge value={effectiveValue} />
      {/if}
      {#if token.aliasOf}
        <span class="row__alias" title="Aliases {token.aliasOf}">→ {token.aliasOf}</span>
      {/if}
      {#if token.optional}
        <span class="row__opt" title="Ships only in optimal+ bundles (optional/)">opt</span>
      {/if}
    </div>
    {#if token.note}
      <p class="row__desc">{token.note}</p>
    {/if}
    {#if !token.note && token.description}
      <p class="row__desc row__desc--faint">{token.description}</p>
    {/if}
  </div>

  <div class="row__control">
    <TokenEditor {token} />
    <button
      class="cfg-btn cfg-btn--ghost cfg-btn--icon row__reset"
      onclick={() => clearOverride(token.name)}
      disabled={!modified}
      title={modified ? 'Reset to framework default' : 'No override to reset'}
      aria-label="Reset {token.name}"
    >⟲</button>
  </div>
</div>

<style>
  .row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(340px, 460px);
    gap: 16px;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid var(--cfg-border);
    transition: background 0.15s;
  }
  .row:hover { background: rgba(255, 255, 255, 0.02); }
  .row:last-child { border-bottom: none; }
  .row--modified {
    background: linear-gradient(90deg, rgba(79, 140, 255, 0.08), transparent 60%);
    box-shadow: inset 3px 0 0 var(--cfg-accent-strong);
  }
  .row--modified:hover {
    background: linear-gradient(90deg, rgba(79, 140, 255, 0.12), transparent 60%);
  }
  .row__info { min-width: 0; }
  .row__name-line {
    display: flex;
    align-items: center;
    gap: 7px;
    flex-wrap: wrap;
  }
  .row__name {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: transparent;
    border: 1px solid transparent;
    border-radius: var(--cfg-radius-s);
    padding: 1px 6px;
    color: var(--cfg-text);
    cursor: pointer;
    transition: background 0.12s, border-color 0.12s, color 0.12s;
    text-align: left;
    max-width: 100%;
    min-width: 0;
  }
  .row__name code {
    font-family: var(--cfg-mono);
    font-size: 12.5px;
    word-break: break-all;
  }
  .row__copy {
    font-size: 11px;
    color: var(--cfg-text-faint);
    opacity: 0;
    transition: opacity 0.15s, color 0.15s;
  }
  .row__name:hover {
    background: var(--cfg-surface-2);
    border-color: var(--cfg-border);
  }
  .row__name:hover .row__copy { opacity: 1; }
  .row__name:focus-visible {
    outline: 2px solid var(--cfg-accent);
    outline-offset: 1px;
  }
  .row__drives {
    font-size: 9.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--cfg-accent);
    background: var(--cfg-accent-soft);
    border-radius: 999px;
    padding: 1px 7px;
    line-height: 1.6;
    white-space: nowrap;
  }
  .row__alias {
    font-family: var(--cfg-mono);
    font-size: 11px;
    color: var(--cfg-text-faint);
  }
  .row__opt {
    font-size: 9.5px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
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
    line-height: 1.5;
  }
  .row__desc--faint { color: var(--cfg-text-faint); }
  .row__control {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
  }
  .row__reset { flex-shrink: 0; font-size: 14px; line-height: 1; }

  @media (max-width: 720px) {
    .row {
      grid-template-columns: 1fr;
      gap: 8px;
    }
  }
</style>
