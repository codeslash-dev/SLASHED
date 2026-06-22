<script>
  /**
   * One domain tab (Colors, Typography, Spacing, …).
   *
   * The panel has two stacked zones, in the same order for every category:
   *
   *   SETTINGS (always visible, inputs-first) — the system inputs a typical
   *     project sets: one-click presets, brand colors, font stacks, scale
   *     generators and the global "Scaling" multipliers. Curated via
   *     lib/basics.js + domains.js so each domain is just curation, no
   *     bespoke per-field code.
   *
   *   ALL VARIABLES (progressive disclosure) — a collapsed disclosure holding
   *     the FULL domain catalogue (grouped, with tier / modified / usage
   *     filters), so every token is one click away. Domains with no curated
   *     Settings surface (e.g. Misc) render the catalogue inline instead of
   *     hiding it behind a redundant click.
   *
   * An active search collapses the panel to the filtered catalogue alone —
   * search means "find any token in this category", curated forms aside.
   *
   * Reuses the existing TokenRow / TokenEditor / OklchPicker / ScaleGenerator.
   */
  import { allTokens, groupTokens, matchesQuery, tokenByName } from '../lib/model.js';
  import { domainOf, KNOBS_BY_DOMAIN, DOCS_BASE_URL } from '../lib/domains.js';
  import { BASIC_BY_DOMAIN } from '../lib/basics.js';
  import { BRAND_COLOR_KEYS } from '../lib/brandColors.js';
  import { ui, overrides, patchOverrides } from '../lib/store.svelte.js';
  import { STYLE_PRESETS_BY_DOMAIN } from '../lib/stylePresets.js';
  import TokenGroup from './TokenGroup.svelte';
  import TokenRow from './TokenRow.svelte';
  import BrandColorRow from './BrandColorRow.svelte';
  import ScaleGenerator from './ScaleGenerator.svelte';
  import QuickKnobs from './QuickKnobs.svelte';
  import StylePresetRow from './StylePresetRow.svelte';
  import ColorAssignments from './ColorAssignments.svelte';

  /** @type {{ domain: { id:string, label:string, icon:string, blurb:string, intro?:string, scaleIntro?:string, essentials?:string[], basicGenerators?:string[], brandColors?:boolean, docsPath?:string } }} */
  let { domain } = $props();

  const query = $derived(ui.query.trim().toLowerCase());
  const searching = $derived(query.length > 0);

  // Curated essential rows — only those present in the active catalogue.
  const essentials = $derived(
    (domain.essentials ?? [])
      .map((name) => tokenByName.get(name))
      .filter(Boolean)
  );

  // Friendly curated groups (lib/basics.js): label + help per control, with
  // controls whose token is missing from the catalogue dropped defensively
  // (tests/basics.test.js makes that a CI failure, never a silent gap).
  const basicGroups = $derived(
    (BASIC_BY_DOMAIN[domain.id]?.groups ?? [])
      .map((g) => ({
        ...g,
        controls: g.controls
          .map((c) => ({ ...c, tokenObj: tokenByName.get(c.token) }))
          .filter((c) => c.tokenObj),
      }))
      .filter((g) => g.controls.length)
  );

  // Every token in this domain.
  const domainTokens = $derived(allTokens.filter((t) => domainOf(t) === domain.id));

  // All-variables catalogue: tier + modified + usage + search filters, grouped.
  // Use property-access (overrides[t.name]) instead of `in` so Svelte 5's
  // state proxy triggers reactivity via the `get` trap on every key check.
  const catalogueVisible = $derived(
    domainTokens.filter((t) => {
      if (t.tier === 'INTERNAL' && !ui.showInternal) return false;
      if (ui.onlyModified && overrides[t.name] == null) return false;
      if (ui.usageFilter === 'configure' && t.role !== 'knob') return false;
      if (ui.usageFilter === 'consume' && t.role !== 'consumption') return false;
      return matchesQuery(t, query);
    })
  );
  const grouped = $derived(groupTokens(catalogueVisible));

  // Only label each group's category when more than one is present in this
  // domain (otherwise the repeated "Core tokens" prefix is just noise).
  const categoryCount = $derived(new Set(grouped.map((c) => c.category)).size);

  const generators = $derived(domain.basicGenerators ?? []);

  // Scaling knobs for this domain (global multipliers that cascade through
  // many derived tokens — see lib/domains.js → KNOBS_BY_DOMAIN). They sit in
  // the Settings zone as a "Scaling" group.
  const knobs = $derived(KNOBS_BY_DOMAIN[domain.id] ?? []);

  // Does this domain expose a curated Settings surface above the raw
  // catalogue? When it does not (e.g. Misc), the All-variables list is the
  // whole panel and renders inline rather than behind a disclosure.
  const hasSettings = $derived(
    !!domain.brandColors ||
    !!STYLE_PRESETS_BY_DOMAIN[domain.id] ||
    basicGroups.length > 0 ||
    essentials.length > 0 ||
    generators.length > 0 ||
    knobs.length > 0
  );

  // "Show all variables" disclosure state (only meaningful when hasSettings).
  let showAll = $state(false);

  // Colors panel: progressive disclosure for secondary brand / status groups.
  let showSecondary = $state(false);
  let showStatus = $state(false);
  let showColorRoles = $state(false);

  // Partition brand color keys for the Colors panel accordion.
  const BRAND_PRIMARY = BRAND_COLOR_KEYS.filter((c) => ['base', 'neutral', 'primary'].includes(c.key));
  const BRAND_SECONDARY = BRAND_COLOR_KEYS.filter((c) => ['secondary', 'tertiary'].includes(c.key));
  const BRAND_STATUS = BRAND_COLOR_KEYS.filter((c) => c.group === 'status');

  // Modified tokens within this domain — drives the header "Reset N" button.
  const modifiedHere = $derived(
    domainTokens.filter((t) => overrides[t.name] != null)
  );

  // "Reset domain" button — clears overrides only for tokens in this domain.
  function resetDomain() {
    const patch = Object.fromEntries(modifiedHere.map((t) => [t.name, null]));
    if (modifiedHere.length) patchOverrides(patch);
  }
</script>

{#snippet cardHead(title, count, hint = '')}
  <header class="panel__card-head">
    <span class="panel__card-title">{title}</span>
    <span class="panel__card-count">{count}</span>
    {#if hint}
      <span class="panel__card-hint">{hint}</span>
    {/if}
  </header>
{/snippet}

{#snippet filters()}
  <div class="allvars__filters">
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
  </div>
{/snippet}

{#snippet catalogue()}
  {#if grouped.length === 0}
    {#if searching}
      <p class="panel__empty">
        No <strong>{domain.label.toLowerCase()}</strong> tokens match <code>{ui.query}</code>.
      </p>
    {:else}
      <p class="panel__empty">No tokens match the current filters.</p>
    {/if}
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
{/snippet}

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
    {#if searching}
      <!-- Active search: the filtered catalogue is the whole panel — search
           means "find any token in this category". -->
      {@render filters()}
      {@render catalogue()}
    {:else}
      <!-- ── SETTINGS (inputs-first) ─────────────────────────────────────── -->

      <!-- Orientation copy: what this domain controls, whether typical
           projects change it. -->
      {#if domain.intro}
        <p class="panel__intro">{domain.intro}</p>
      {/if}

      <!-- One-click style presets (borders / shadows) -->
      {#if STYLE_PRESETS_BY_DOMAIN[domain.id]}
        <StylePresetRow
          title={STYLE_PRESETS_BY_DOMAIN[domain.id].title}
          presets={STYLE_PRESETS_BY_DOMAIN[domain.id].presets}
        />
      {/if}

      <!-- Curated input surfaces: brand colors, friendly forms, or essentials. -->
      {#if domain.brandColors}
        <!-- Core brand colors — always shown -->
        <section class="cfg-card panel__card">
          {@render cardHead(
            'Core brand colors',
            BRAND_PRIMARY.length,
            'Set light-mode values — dark mode is auto-derived. Click the dark swatch to pin a custom value.'
          )}
          <div class="panel__card-rows">
            {#each BRAND_PRIMARY as { key, label } (key)}
              <BrandColorRow colorKey={key} {label} />
            {/each}
          </div>
        </section>

        <!-- Extended brand colors (secondary / tertiary) — opt-in -->
        <details class="panel__expand" bind:open={showSecondary}>
          <summary class="panel__expand-summary">
            <span class="panel__expand-chev" aria-hidden="true">›</span>
            <span class="panel__expand-title">Extended brand colors</span>
            <span class="panel__expand-count">{BRAND_SECONDARY.length} colors</span>
            {#if BRAND_SECONDARY.some((c) => overrides[`--sf-color-${c.key}-light`] != null)}
              <span class="panel__expand-badge">modified</span>
            {/if}
          </summary>
          <div class="panel__card-rows">
            {#each BRAND_SECONDARY as { key, label } (key)}
              <BrandColorRow colorKey={key} {label} />
            {/each}
          </div>
        </details>

        <!-- Status colors — opt-in -->
        <details class="panel__expand" bind:open={showStatus}>
          <summary class="panel__expand-summary">
            <span class="panel__expand-chev" aria-hidden="true">›</span>
            <span class="panel__expand-title">Status colors</span>
            <span class="panel__expand-count">{BRAND_STATUS.length} colors</span>
            {#if BRAND_STATUS.some((c) => overrides[`--sf-color-${c.key}-light`] != null)}
              <span class="panel__expand-badge">modified</span>
            {/if}
          </summary>
          <div class="panel__card-rows">
            {#each BRAND_STATUS as { key, label } (key)}
              <BrandColorRow colorKey={key} {label} />
            {/each}
          </div>
        </details>

        <!-- Semantic role preview (where your brand colors surface) -->
        <details class="cfg-card panel__card" bind:open={showColorRoles}>
          <summary class="panel__card-head panel__expand-summary">
            <span class="panel__expand-chev" aria-hidden="true">›</span>
            <span class="panel__card-title">Semantic roles</span>
            <span class="panel__expand-count">How your brand colors surface</span>
          </summary>
          <ColorAssignments />
        </details>
      {:else if basicGroups.length}
        {#each basicGroups as group (group.title)}
          <section class="cfg-card panel__card">
            {@render cardHead(group.title, group.controls.length)}
            <div class="panel__card-rows">
              {#each group.controls as c (c.token)}
                <TokenRow token={c.tokenObj} label={c.label} help={c.help} showRawInfo />
              {/each}
            </div>
          </section>
        {/each}
      {:else if essentials.length}
        <section class="cfg-card panel__card">
          {@render cardHead('Essentials', essentials.length, 'Curated for most projects.')}
          <div class="panel__card-rows">
            {#each essentials as token (token.name)}
              <TokenRow {token} />
            {/each}
          </div>
        </section>
      {/if}

      <!-- Scale generators (fluid type / display / space ramps) -->
      {#each generators as g (g)}
        <ScaleGenerator kinds={[g]} />
      {/each}

      <!-- Scaling: global multipliers that cascade through many tokens. -->
      {#if knobs.length}
        <QuickKnobs {knobs} title="Scaling" blurb={domain.scaleIntro ?? ''} />
      {/if}

      <!-- ── ALL VARIABLES (progressive disclosure) ──────────────────────── -->
      {#if hasSettings}
        <details class="allvars" bind:open={showAll}>
          <summary class="allvars__summary">
            <span class="allvars__chev" aria-hidden="true">›</span>
            <span class="allvars__title">{showAll ? 'Hide' : 'Show'} all variables</span>
            <span class="allvars__count">{domainTokens.length} token{domainTokens.length === 1 ? '' : 's'}</span>
          </summary>
          <div class="allvars__body">
            {@render filters()}
            {@render catalogue()}
          </div>
        </details>
      {:else}
        <!-- No curated Settings surface (e.g. Misc): show the catalogue inline
             so the category is never a dead end. -->
        {@render filters()}
        {@render catalogue()}
      {/if}

      {#if domain.docsPath}
        <p class="panel__docs">
          <a
            href="{DOCS_BASE_URL}{domain.docsPath}"
            target="_blank"
            rel="noreferrer"
          >Learn more about {domain.label.toLowerCase()} in the framework docs →</a>
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

  .panel__intro {
    margin: 0;
    padding: 10px 14px;
    font-size: 13px;
    line-height: 1.55;
    color: var(--cfg-text-muted);
    background: var(--cfg-surface);
    border: 1px solid var(--cfg-border);
    border-left: 3px solid var(--cfg-accent-strong);
    border-radius: var(--cfg-radius-s);
  }

  /* All-variables disclosure — the full domain catalogue, one click away. */
  .allvars {
    border: 1px solid var(--cfg-border);
    border-radius: var(--cfg-radius);
    background: var(--cfg-surface);
    overflow: clip;
  }
  .allvars__summary {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    cursor: pointer;
    list-style: none;
    user-select: none;
  }
  .allvars__summary::-webkit-details-marker { display: none; }
  .allvars__summary:hover { background: var(--cfg-surface-2); }
  .allvars__chev {
    font-size: 16px;
    line-height: 1;
    color: var(--cfg-text-faint);
    transition: transform 0.15s;
  }
  .allvars[open] .allvars__chev { transform: rotate(90deg); }
  .allvars__title {
    font-size: 12.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--cfg-text);
  }
  .allvars__count {
    font-family: var(--cfg-mono);
    font-size: 11px;
    color: var(--cfg-text-faint);
  }
  .allvars__body {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
    border-top: 1px solid var(--cfg-border);
  }

  /* Filter bar above the catalogue (usage segment + modified/internal toggles). */
  .allvars__filters {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .panel__empty {
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

  .panel__docs {
    margin: 4px 0 0;
    font-size: 12px;
    text-align: center;
  }
  .panel__docs a {
    color: var(--cfg-text-faint);
    text-decoration: none;
    transition: color 0.12s;
  }
  .panel__docs a:hover { color: var(--cfg-accent); text-decoration: underline; }

  /* Progressive disclosure for Colors panel brand-color groups. */
  .panel__expand {
    border: 1px solid var(--cfg-border);
    border-radius: var(--cfg-radius);
    background: var(--cfg-surface);
    overflow: clip;
  }
  .panel__expand-summary {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 11px 16px;
    cursor: pointer;
    list-style: none;
    user-select: none;
  }
  .panel__expand-summary::-webkit-details-marker { display: none; }
  .panel__expand-summary:hover { background: var(--cfg-surface-2); }
  .panel__expand-chev {
    font-size: 15px;
    line-height: 1;
    color: var(--cfg-text-faint);
    transition: transform 0.14s;
  }
  .panel__expand[open] .panel__expand-chev,
  details.cfg-card[open] .panel__expand-chev { transform: rotate(90deg); }
  .panel__expand-title {
    font-size: 12.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--cfg-text);
  }
  .panel__expand-count {
    font-family: var(--cfg-mono);
    font-size: 11px;
    color: var(--cfg-text-faint);
  }
  .panel__expand-badge {
    font-size: 9.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--cfg-accent-strong);
    border: 1px solid var(--cfg-accent-strong);
    border-radius: 999px;
    padding: 1px 7px;
    line-height: 1.6;
  }
  /* When the disclosure card (Semantic roles) is open, its summary gets a border. */
  details.cfg-card[open] > .panel__card-head.panel__expand-summary {
    border-bottom: 1px solid var(--cfg-border);
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
