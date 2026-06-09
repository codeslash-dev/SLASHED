<script>
  /**
   * Left rail: search, tier/visibility filters, and category navigation.
   * Mutates the shared `ui` store directly; the parent re-derives the visible
   * token set from it.
   */
  import { ui, overrides, tokenCount } from '../lib/store.svelte.js';

  let { categories } = $props();

  const modifiedCount = $derived(Object.keys(overrides).length);
</script>

<aside class="sidebar">
  <div class="sidebar__search">
    <input
      type="search"
      placeholder="Search {tokenCount} tokens…"
      bind:value={ui.query}
      spellcheck="false"
      aria-label="Search tokens"
    />
  </div>

  <div class="sidebar__filters">
    <label class="sidebar__check">
      <input type="checkbox" bind:checked={ui.onlyModified} />
      <span>Modified only{#if modifiedCount} ({modifiedCount}){/if}</span>
    </label>
    <label class="sidebar__check">
      <input type="checkbox" bind:checked={ui.showAdvanced} />
      <span>Show advanced</span>
    </label>
    <label class="sidebar__check">
      <input type="checkbox" bind:checked={ui.showInternal} />
      <span>Show internal</span>
    </label>
  </div>

  <nav class="sidebar__nav" aria-label="Token categories">
    {#if categories.length === 0}
      <p class="sidebar__empty">No tokens match.</p>
    {/if}
    {#each categories as cat (cat.category)}
      <button
        class="sidebar__cat"
        class:sidebar__cat--active={cat.category === ui.activeCategory}
        onclick={() => (ui.activeCategory = cat.category)}
      >
        <span class="sidebar__cat-name">{cat.category}</span>
        <span class="sidebar__cat-count">{cat.count}</span>
      </button>
    {/each}
  </nav>
</aside>

<style>
  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 16px;
    border-right: 1px solid var(--cfg-border);
    background: var(--cfg-surface);
    overflow-y: auto;
    height: 100%;
  }
  .sidebar__search input {
    width: 100%;
    background: var(--cfg-bg);
    border: 1px solid var(--cfg-border-strong);
    border-radius: var(--cfg-radius-s);
    padding: 8px 11px;
  }
  .sidebar__search input:focus {
    outline: 2px solid var(--cfg-accent);
    outline-offset: -1px;
  }
  .sidebar__filters {
    display: flex;
    flex-direction: column;
    gap: 7px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--cfg-border);
  }
  .sidebar__check {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--cfg-text-muted);
    cursor: pointer;
  }
  .sidebar__check input {
    accent-color: var(--cfg-accent-strong);
  }
  .sidebar__nav {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .sidebar__cat {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    width: 100%;
    text-align: left;
    background: transparent;
    border: none;
    border-radius: var(--cfg-radius-s);
    color: var(--cfg-text-muted);
    padding: 8px 10px;
    font-size: 13px;
  }
  .sidebar__cat:hover {
    background: var(--cfg-surface-2);
    color: var(--cfg-text);
  }
  .sidebar__cat--active {
    background: var(--cfg-surface-2);
    color: var(--cfg-text);
    font-weight: 600;
  }
  .sidebar__cat-count {
    font-family: var(--cfg-mono);
    font-size: 11px;
    color: var(--cfg-text-faint);
    background: var(--cfg-bg);
    border-radius: 999px;
    padding: 1px 8px;
  }
  .sidebar__empty {
    color: var(--cfg-text-faint);
    font-size: 13px;
    padding: 4px 10px;
  }
</style>
