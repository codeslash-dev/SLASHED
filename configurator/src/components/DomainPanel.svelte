<script>
  /**
   * One domain tab (Typography, Spacing, Colors, …).
   *
   * BASIC mode  → a curated set of "essential" token rows plus the domain's
   *               basic generator (e.g. the fluid spacing scale).
   * ADVANCED    → the essentials + every generator + the FULL domain token
   *               catalogue (grouped, searchable, tier-filtered), so nothing is
   *               out of reach.
   *
   * Reuses the existing TokenRow/TokenEditor (color picker, font picker, length
   * inputs) and the shared ScaleGenerator, so each domain is just curation —
   * no bespoke per-field code.
   */
  import { allTokens, groupTokens, matchesQuery, tokenByName } from '../lib/model.js';
  import { domainOf } from '../lib/domains.js';
  import { ui, overrides } from '../lib/store.svelte.js';
  import TokenGroup from './TokenGroup.svelte';
  import TokenRow from './TokenRow.svelte';
  import ScaleGenerator from './ScaleGenerator.svelte';

  /** @type {{ domain: { id:string, label:string, blurb:string, essentials?:string[], basicGenerators?:string[], advancedGenerators?:string[] } }} */
  let { domain } = $props();

  const advanced = $derived(ui.mode === 'advanced');

  // Curated essential rows — only those present in the active catalogue.
  const essentials = $derived(
    (domain.essentials ?? [])
      .map((name) => tokenByName.get(name))
      .filter(Boolean)
  );

  // Every token in this domain (for the advanced full catalogue).
  const domainTokens = $derived(allTokens.filter((t) => domainOf(t) === domain.id));

  const query = $derived(ui.query.trim().toLowerCase());

  // Advanced list: tier + modified + search filters, then grouped.
  const advancedVisible = $derived(
    domainTokens.filter((t) => {
      if (t.tier === 'INTERNAL' && !ui.showInternal) return false;
      if (ui.onlyModified && !(t.name in overrides)) return false;
      return matchesQuery(t, query);
    })
  );
  const grouped = $derived(groupTokens(advancedVisible));

  // Only label each group's category when more than one is present in this
  // domain (otherwise the repeated "Core tokens" prefix is just noise).
  const categoryCount = $derived(new Set(grouped.map((c) => c.category)).size);

  const basicGenerators = $derived(domain.basicGenerators ?? []);
  const advancedGenerators = $derived(domain.advancedGenerators ?? []);
</script>

<div class="panel">
  <header class="panel__head">
    <div>
      <h2 class="panel__title">{domain.label}</h2>
      <p class="panel__blurb">{domain.blurb}</p>
    </div>
    {#if advanced}
      <input
        class="panel__search"
        type="search"
        placeholder="Filter {domainTokens.length} {domain.label.toLowerCase()} tokens…"
        bind:value={ui.query}
        spellcheck="false"
        aria-label="Filter {domain.label} tokens"
      />
    {/if}
  </header>

  {#if advanced}
    <div class="panel__filters">
      <label class="panel__check">
        <input type="checkbox" bind:checked={ui.onlyModified} />
        <span>Modified only</span>
      </label>
      <label class="panel__check">
        <input type="checkbox" bind:checked={ui.showInternal} />
        <span>Show internal</span>
      </label>
    </div>
  {/if}

  <!-- Essentials (always shown) -->
  {#if essentials.length}
    <section class="essentials">
      <div class="essentials__rows">
        {#each essentials as token (token.name)}
          <TokenRow {token} />
        {/each}
      </div>
    </section>
  {/if}

  <!-- Basic generator(s) — e.g. the fluid spacing scale -->
  {#each basicGenerators as g (g)}
    <ScaleGenerator kinds={[g]} />
  {/each}

  {#if advanced}
    <!-- Advanced generators — e.g. the type + display scale -->
    {#if advancedGenerators.length}
      <ScaleGenerator kinds={advancedGenerators} />
    {/if}

    <!-- Full domain catalogue -->
    {#if grouped.length === 0}
      <p class="panel__empty">No tokens match the current search and filters.</p>
    {:else}
      {#each grouped as cat (cat.category)}
        {#each cat.groups as group (group.name)}
          <TokenGroup
            name={group.name}
            tokens={group.tokens}
            description={group.description}
            showCategory={categoryCount > 1}
            category={cat.category}
          />
        {/each}
      {/each}
    {/if}
  {:else if essentials.length === 0 && basicGenerators.length === 0}
    <p class="panel__hint">
      Switch to <strong>Advanced</strong> to edit the full set of {domain.label.toLowerCase()} tokens.
    </p>
  {/if}
</div>

<style>
  .panel {
    overflow-y: auto;
    padding: 18px;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .panel__head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    flex-wrap: wrap;
  }
  .panel__title { margin: 0; font-size: 18px; }
  .panel__blurb { margin: 3px 0 0; color: var(--cfg-text-muted); font-size: 13px; }
  .panel__search {
    flex: 0 1 320px;
    background: var(--cfg-bg);
    border: 1px solid var(--cfg-border-strong);
    border-radius: var(--cfg-radius-s);
    color: var(--cfg-text);
    padding: 8px 11px;
    font-size: 13px;
  }
  .panel__search:focus { outline: 2px solid var(--cfg-accent); outline-offset: -1px; }

  .panel__filters {
    display: flex;
    gap: 18px;
    margin-top: -4px;
  }
  .panel__check {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 13px;
    color: var(--cfg-text-muted);
    cursor: pointer;
  }
  .panel__check input { accent-color: var(--cfg-accent-strong); }

  .essentials {
    border: 1px solid var(--cfg-border);
    border-radius: var(--cfg-radius);
    background: var(--cfg-surface);
    overflow: hidden;
  }
  .panel__empty,
  .panel__hint {
    color: var(--cfg-text-faint);
    font-size: 13px;
    padding: 20px 4px;
  }
</style>
