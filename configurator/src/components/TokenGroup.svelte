<script>
  /**
   * A collapsible section for one source-derived token group (the section
   * banner from the framework CSS), rendering its token rows.
   */
  import TokenRow from './TokenRow.svelte';

  let { name, tokens, showCategory = false, category = '', description = '' } = $props();
  let open = $state(true);
</script>

<section class="group">
  <button class="group__head" onclick={() => (open = !open)} aria-expanded={open}>
    <span class="group__caret" class:group__caret--open={open}>▶</span>
    {#if showCategory}<span class="group__cat">{category}</span>{/if}
    <span class="group__name">{name}</span>
    <span class="group__count">{tokens.length}</span>
  </button>
  {#if open}
    {#if description}
      <p class="group__desc">{description}</p>
    {/if}
    <div class="group__rows">
      {#each tokens as token (token.name)}
        <TokenRow {token} />
      {/each}
    </div>
  {/if}
</section>

<style>
  .group {
    border: 1px solid var(--cfg-border);
    border-radius: var(--cfg-radius);
    margin-bottom: 14px;
    overflow: hidden;
    background: var(--cfg-surface);
  }
  .group__head {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    text-align: left;
    background: var(--cfg-surface-2);
    border: none;
    color: var(--cfg-text);
    padding: 10px 14px;
    font-size: 13px;
  }
  .group__caret {
    font-size: 9px;
    color: var(--cfg-text-faint);
    transition: transform 0.12s ease;
  }
  .group__caret--open {
    transform: rotate(90deg);
  }
  .group__cat {
    font-size: 11px;
    color: var(--cfg-text-faint);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .group__name {
    font-weight: 600;
  }
  .group__count {
    margin-left: auto;
    font-family: var(--cfg-mono);
    font-size: 11px;
    color: var(--cfg-text-faint);
  }
  .group__desc {
    margin: 0;
    padding: 8px 14px 10px;
    font-size: 12px;
    color: var(--cfg-text-muted);
    border-bottom: 1px solid var(--cfg-border);
    background: var(--cfg-surface);
  }
</style>
