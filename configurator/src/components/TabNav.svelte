<script>
  /**
   * Horizontal domain tab strip. Reads the domain list, writes the active one
   * into ui state, and shows a small badge with the number of active overrides
   * that fall in each domain so the user can see where they've made changes.
   */
  import { DOMAINS, domainOf } from '../lib/domains.js';
  import { tokenByName } from '../lib/model.js';
  import { ui, overrides } from '../lib/store.svelte.js';

  // override count per domain id (reactive on the overrides map).
  const counts = $derived.by(() => {
    const c = {};
    for (const name of Object.keys(overrides)) {
      const t = tokenByName.get(name);
      if (!t) continue;
      const d = domainOf(t);
      c[d] = (c[d] || 0) + 1;
    }
    return c;
  });
</script>

<nav class="tabs" aria-label="Token domains">
  {#each DOMAINS as d (d.id)}
    <button
      class="tabs__btn"
      class:tabs__btn--on={ui.domain === d.id}
      onclick={() => (ui.domain = d.id)}
      aria-pressed={ui.domain === d.id}
    >
      {d.label}
      {#if counts[d.id]}<span class="tabs__badge">{counts[d.id]}</span>{/if}
    </button>
  {/each}
</nav>

<style>
  .tabs {
    display: flex;
    gap: 2px;
    padding: 0 12px;
    background: var(--cfg-surface);
    border-bottom: 1px solid var(--cfg-border);
    overflow-x: auto;
  }
  .tabs__btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    color: var(--cfg-text-muted);
    padding: 11px 14px;
    font-size: 13.5px;
    white-space: nowrap;
    transition: color 0.12s ease, border-color 0.12s ease;
  }
  .tabs__btn:hover { color: var(--cfg-text); }
  .tabs__btn--on {
    color: var(--cfg-text);
    border-bottom-color: var(--cfg-accent-strong);
    font-weight: 600;
  }
  .tabs__badge {
    font-family: var(--cfg-mono);
    font-size: 10px;
    color: #fff;
    background: var(--cfg-accent-strong);
    border-radius: 999px;
    padding: 1px 6px;
    line-height: 1.5;
  }
</style>
