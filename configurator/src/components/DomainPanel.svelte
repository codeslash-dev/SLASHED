<script>
  /**
   * One domain tab (Colors, Typography, Spacing, …).
   *
   * BASIC mode  → curated essential rows + the domain's basic generator
   *               (e.g. fluid spacing scale).
   * ADVANCED   → essentials + every generator + the FULL domain catalogue
   *               (grouped, searchable, tier-filtered, modified-only filter),
   *               so nothing is ever out of reach.
   *
   * Reuses the existing TokenRow / TokenEditor / OklchPicker / ScaleGenerator,
   * so each domain is just curation — no bespoke per-field code.
   */
  import { allTokens, groupTokens, matchesQuery, tokenByName } from '../lib/model.js';
  import { domainOf, KNOBS_BY_DOMAIN } from '../lib/domains.js';
  import { BRAND_COLOR_KEYS } from '../lib/brandColors.js';
  import { ui, overrides, patchOverrides } from '../lib/store.svelte.js';
  import TokenGroup from './TokenGroup.svelte';
  import TokenRow from './TokenRow.svelte';
  import BrandColorRow from './BrandColorRow.svelte';
  import ScaleGenerator from './ScaleGenerator.svelte';
  import QuickKnobs from './QuickKnobs.svelte';

  /** @type {{ domain: { id:string, label:string, icon:string, blurb:string, essentials?:string[], basicGenerators?:string[], advancedGenerators?:string[], brandColors?:boolean } }} */
  let { domain } = $props();

  const advanced = $derived(ui.mode === 'advanced');
  const query = $derived(ui.query.trim().toLowerCase());

  // Curated essential rows — only those present in the active catalogue.
  const essentials = $derived(
    (domain.essentials ?? [])
      .map((name) => tokenByName.get(name))
      .filter(Boolean)
  );

  // Every token in this domain.
  const domainTokens = $derived(allTokens.filter((t) => domainOf(t) === domain.id));

  // Advanced list: tier + modified + usage + search filters, then grouped.
  // Use property-access (overrides[t.name]) instead of `in` so Svelte 5's
  // state proxy triggers reactivity via the `get` trap on every key check.
  const advancedVisible = $derived(
    domainTokens.filter((t) => {
      if (t.tier === 'INTERNAL' && !ui.showInternal) return false;
      if (ui.onlyModified && overrides[t.name] == null) return false;
      if (ui.usageFilter === 'configure' && t.role !== 'knob') return false;
      if (ui.usageFilter === 'consume' && t.role !== 'consumption') return false;
      return matchesQuery(t, query);
    })
  );
  const grouped = $derived(groupTokens(advancedVisible));

  // Basic mode: when the user is searching, fall back to a flat filtered list
  // of *every* domain token (so the search isn't hidden behind the toggle).
  const basicSearchHits = $derived.by(() => {
    if (!advanced && query) {
      return domainTokens.filter((t) => {
        if (t.tier === 'INTERNAL' && !ui.showInternal) return false;
        return matchesQuery(t, query);
      });
    }
    return null;
  });

  // Only label each group's category when more than one is present in this
  // domain (otherwise the repeated "Core tokens" prefix is just noise).
  const categoryCount = $derived(new Set(grouped.map((c) => c.category)).size);

  const basicGenerators = $derived(domain.basicGenerators ?? []);

  // Quick knobs for this domain (global multipliers that cascade through
  // many derived tokens — see lib/domains.js → KNOBS_BY_DOMAIN).
  const knobs = $derived(KNOBS_BY_DOMAIN[domain.id] ?? []);

  // Modified tokens within this domain — surfaced as a collapsible block.
  const modifiedHere = $derived(
    domainTokens.filter((t) => overrides[t.name] != null)
  );

  // "Reset domain" button — clears overrides only for tokens in this domain.
  function resetDomain() {
    const patch = Object.fromEntries(modifiedHere.map((t) => [t.name, null]));
    if (modifiedHere.length) patchOverrides(patch);
  }
</script>

<section class="panel">
  <header class="panel__head">
    <div class="panel__title-wrap">
      <span class="panel__icon" aria-hidden="true">{domain.icon}</span>
      <div>
        <h2 class="panel__title">{domain.label}</h2>
        <p class="panel__blurb">{domain.blurb}</p>
      </div>
    </div>

    <div class="panel__actions">
      {#if advanced}
        <div class="cfg-seg panel__usage-seg" role="group" aria-label="Usage filter">
          <button
            class="cfg-seg__btn"
            class:cfg-seg__btn--on={ui.usageFilter === 'all'}
            onclick={() => (ui.usageFilter = 'all')}
            aria-pressed={ui.usageFilter === 'all'}
            title="Show all tokens"
          >All</button>
          <button
            class="cfg-seg__btn"
            class:cfg-seg__btn--on={ui.usageFilter === 'configure'}
            onclick={() => (ui.usageFilter = 'configure')}
            aria-pressed={ui.usageFilter === 'configure'}
            title="Show only configure tokens — literal inputs you SET in :root"
          >Configure</button>
          <button
            class="cfg-seg__btn"
            class:cfg-seg__btn--on={ui.usageFilter === 'consume'}
            onclick={() => (ui.usageFilter = 'consume')}
            aria-pressed={ui.usageFilter === 'consume'}
            title="Show only consume tokens — derived outputs you READ in component CSS"
          >Consume</button>
        </div>
        <label class="panel__check" title="Restrict to tokens with an active override">
          <input type="checkbox" bind:checked={ui.onlyModified} />
          <span>Modified only</span>
        </label>
        <label class="panel__check" title="Show INTERNAL-tier implementation tokens">
          <input type="checkbox" bind:checked={ui.showInternal} />
          <span>Internal</span>
        </label>
      {/if}
      {#if modifiedHere.length}
        <button
          class="cfg-btn cfg-btn--sm cfg-btn--danger"
          onclick={resetDomain}
          title="Reset all {modifiedHere.length} modified token{modifiedHere.length === 1 ? '' : 's'} in this domain"
        >Reset {modifiedHere.length}</button>
      {/if}
    </div>
  </header>

  <div class="panel__body">
    {#if basicSearchHits}
      <!-- Basic mode + active search: flat filtered list across the domain. -->
      {#if basicSearchHits.length === 0}
        <p class="panel__empty">
          No <strong>{domain.label.toLowerCase()}</strong> tokens match
          <code>{ui.query}</code>. Try Advanced mode to widen filters.
        </p>
      {:else}
        <section class="cfg-card panel__card">
          <header class="panel__card-head">
            <span class="panel__card-title">Search results</span>
            <span class="panel__card-count">{basicSearchHits.length}</span>
          </header>
          <div class="panel__card-rows">
            {#each basicSearchHits as token (token.name)}
              <TokenRow {token} />
            {/each}
          </div>
        </section>
      {/if}
    {:else}
      <!-- Quick knobs (global multipliers cascading through dozens of derived
           tokens). Always shown when the domain has them, in both modes. -->
      {#if knobs.length}
        <QuickKnobs
          {knobs}
          title="Quick knobs"
          blurb="One slider, many tokens — these multipliers cascade through the framework."
        />
      {/if}

      <!-- Essentials (always shown when present) -->
      {#if domain.brandColors}
        <!-- Brand colors domain: light/dark pair rows for every brand color -->
        <section class="cfg-card panel__card">
          <header class="panel__card-head">
            <span class="panel__card-title">Brand &amp; status colors</span>
            <span class="panel__card-count">{BRAND_COLOR_KEYS.length}</span>
            {#if !advanced}
              <span class="panel__card-hint">Set light-mode values — dark mode is auto-derived. Click the dark swatch to pin a custom value.</span>
            {/if}
          </header>
          <div class="panel__card-rows">
            {#each BRAND_COLOR_KEYS as { key, label } (key)}
              <BrandColorRow colorKey={key} {label} />
            {/each}
          </div>
        </section>
      {:else if essentials.length}
        <section class="cfg-card panel__card">
          <header class="panel__card-head">
            <span class="panel__card-title">Essentials</span>
            <span class="panel__card-count">{essentials.length}</span>
            {#if !advanced}
              <span class="panel__card-hint">Curated for most projects · switch to Advanced (A) for the full {domainTokens.length}-token catalogue.</span>
            {/if}
          </header>
          <div class="panel__card-rows">
            {#each essentials as token (token.name)}
              <TokenRow {token} />
            {/each}
          </div>
        </section>
      {/if}

      <!-- Basic generators (e.g. fluid spacing scale) -->
      {#each basicGenerators as g (g)}
        <ScaleGenerator kinds={[g]} />
      {/each}

      {#if advanced}
        <!-- Full domain catalogue, grouped -->
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
      {:else if !domain.brandColors && essentials.length === 0 && basicGenerators.length === 0}
        <!-- Domain has no curated essentials (e.g. Effects, Misc). Surface
             the full advanced list anyway so Basic isn't a dead end. -->
        <p class="panel__hint">
          This domain has no curated basics — switch to <strong>Advanced</strong> (A) to edit the full catalogue.
        </p>
      {/if}
    {/if}
  </div>
</section>

<style>
  .panel {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
  }
  .panel__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 14px 20px 12px;
    border-bottom: 1px solid var(--cfg-border);
    background: var(--cfg-surface);
    flex-wrap: wrap;
  }
  .panel__title-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    flex: 1 1 auto;
  }
  .panel__icon {
    display: inline-grid;
    place-items: center;
    width: 32px;
    height: 32px;
    border-radius: var(--cfg-radius);
    background: linear-gradient(135deg, rgba(79, 140, 255, 0.18), rgba(120, 80, 220, 0.18));
    border: 1px solid var(--cfg-border-strong);
    font-size: 16px;
    flex-shrink: 0;
  }
  .panel__title { margin: 0; font-size: 16px; font-weight: 600; }
  .panel__blurb { margin: 2px 0 0; color: var(--cfg-text-muted); font-size: 12px; max-width: 70ch; }

  .panel__actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    flex-shrink: 0;
  }
  .panel__usage-seg :global(.cfg-seg__btn) { padding: 4px 10px; font-size: 11.5px; }
  .panel__check {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--cfg-text-muted);
    cursor: pointer;
    white-space: nowrap;
  }
  .panel__check input { accent-color: var(--cfg-accent-strong); }

  .panel__body {
    overflow-y: auto;
    padding: 16px 20px 80px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-height: 0;
  }

  .panel__card { overflow: clip; }
  .panel__card-head {
    display: flex;
    align-items: baseline;
    gap: 12px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--cfg-border);
    background: var(--cfg-surface-2);
    flex-wrap: wrap;
  }
  .panel__card-title {
    font-size: 12.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--cfg-text);
  }
  .panel__card-count {
    font-family: var(--cfg-mono);
    font-size: 11px;
    color: var(--cfg-text-faint);
  }
  .panel__card-hint {
    flex: 1 1 auto;
    text-align: right;
    font-size: 11.5px;
    color: var(--cfg-text-faint);
  }

  .panel__empty,
  .panel__hint {
    color: var(--cfg-text-faint);
    font-size: 13.5px;
    padding: 20px 4px;
    text-align: center;
  }
  .panel__empty code {
    color: var(--cfg-text);
    background: var(--cfg-bg-2);
    padding: 1px 6px;
    border-radius: 4px;
    border: 1px solid var(--cfg-border);
  }

  /* Tighter horizontal padding on narrow phones recovers ~16px of content
     width, reducing the chance of token editors overflowing their container. */
  @media (max-width: 600px) {
    .panel__body { padding: 12px 10px 60px; gap: 12px; }
    .panel__head { padding: 10px 12px 8px; gap: 8px; }
    .panel__title { font-size: 14px; }
    .panel__blurb { display: none; }
    /* On very narrow screens, actions drop below the title as a full-width strip */
    .panel__actions {
      flex-basis: 100%;
      gap: 8px;
    }
    /* The segmented usage filter is too wide on mobile — collapse labels */
    .panel__usage-seg :global(.cfg-seg__btn) {
      padding: 4px 8px;
      font-size: 10.5px;
    }
  }
</style>
