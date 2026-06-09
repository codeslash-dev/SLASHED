<script>
  /**
   * App shell: header, three-pane body (sidebar · token list · live preview)
   * and the bottom output drawer.
   *
   * Owns the filtered/grouped derivation from the shared `ui` + `overrides`
   * state and feeds it to the sidebar (category counts) and the main list.
   */
  import { allTokens, groupTokens, matchesQuery } from './lib/model.js';
  import { ui, overrides } from './lib/store.svelte.js';
  import Header from './components/Header.svelte';
  import Sidebar from './components/Sidebar.svelte';
  import TokenGroup from './components/TokenGroup.svelte';
  import OutputPanel from './components/OutputPanel.svelte';
  import Preview from './components/Preview.svelte';

  let showPreview = $state(true);

  const query = $derived(ui.query.trim().toLowerCase());
  const searching = $derived(query.length > 0);

  // Tokens visible under the current tier toggles, modified filter and search.
  const visible = $derived(
    allTokens.filter((t) => {
      if (t.tier === 'INTERNAL' && !ui.showInternal) return false;
      if (t.tier === 'PUBLIC-ADVANCED' && !ui.showAdvanced) return false;
      if (ui.onlyModified && !(t.name in overrides)) return false;
      return matchesQuery(t, query);
    })
  );

  const grouped = $derived(groupTokens(visible));
  const categories = $derived(
    grouped.map((c) => ({ category: c.category, count: c.count }))
  );

  // Keep a valid active category selected as filters change.
  $effect(() => {
    if (grouped.length === 0) return;
    if (!grouped.some((c) => c.category === ui.activeCategory)) {
      ui.activeCategory = grouped[0].category;
    }
  });

  // When searching we show matches across every category; otherwise just the
  // active one. The active-category object drives the non-search view.
  const activeCat = $derived(
    grouped.find((c) => c.category === ui.activeCategory) || null
  );
</script>

<div class="shell">
  <Header bind:showPreview />

  <div class="body" class:body--no-preview={!showPreview}>
    <Sidebar {categories} />

    <main class="list">
      {#if visible.length === 0}
        <div class="list__empty">
          <p>No tokens match the current search and filters.</p>
        </div>
      {:else if searching}
        {#each grouped as cat (cat.category)}
          {#each cat.groups as g (g.name)}
            <TokenGroup
              name={g.name}
              tokens={g.tokens}
              description={g.description}
              showCategory={true}
              category={cat.category}
            />
          {/each}
        {/each}
      {:else if activeCat}
        <h2 class="list__heading">{activeCat.category}</h2>
        {#each activeCat.groups as g (g.name)}
          <TokenGroup name={g.name} tokens={g.tokens} description={g.description} />
        {/each}
      {/if}
    </main>

    {#if showPreview}
      <Preview />
    {/if}
  </div>

  <OutputPanel />
</div>

<style>
  .shell {
    display: grid;
    grid-template-rows: auto minmax(0, 1fr) auto;
    height: 100vh;
  }
  .body {
    display: grid;
    grid-template-columns: 264px minmax(0, 1fr) minmax(360px, 38%);
    min-height: 0;
  }
  .body--no-preview {
    grid-template-columns: 264px minmax(0, 1fr);
  }
  .list {
    overflow-y: auto;
    padding: 18px;
    min-width: 0;
  }
  .list__heading {
    margin: 0 0 14px;
    font-size: 15px;
    color: var(--cfg-text);
  }
  .list__empty {
    color: var(--cfg-text-faint);
    text-align: center;
    padding-top: 60px;
  }

  @media (max-width: 1100px) {
    .body,
    .body--no-preview {
      grid-template-columns: 220px minmax(0, 1fr);
    }
    .body :global(.preview) {
      display: none;
    }
  }
</style>
