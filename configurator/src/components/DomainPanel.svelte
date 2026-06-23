<script>
  /**
   * One domain tab (Colors, Typography, Spacing, …).
   *
   * Layout principle: every panel follows the same three-zone rhythm:
   *
   *   1. LIVE PREVIEW (always visible, leads the panel)
   *      — Colors:              Semantic-roles swatch grid
   *      — Generator domains:   Preview rendered BELOW the generators so the
   *                             specimen updates as you tune (no separate top card)
   *      — All other domains:   DomainPreview card at top, open by default
   *
   *   2. QUICK CONTROLS (immediately after the preview)
   *      — QuickKnobs (scaling sliders) follow the preview so the primary
   *        control is always close to the output it drives.
   *      — Style presets and intro text sit here too.
   *      — Curated groups (lib/basics.js) are now collapsible cards so you can
   *        reach lower sections while still watching the preview.
   *
   *   3. ALL VARIABLES (progressive disclosure)
   *      — A collapsed `<details>` holding the full domain catalogue (grouped,
   *        with tier / modified / usage filters). Domains with no curated
   *        Settings surface (e.g. Misc) render the catalogue inline.
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
  import ShadeRamp from './ShadeRamp.svelte';
  import DomainPreview from './DomainPreview.svelte';
  import Icon from './Icon.svelte';
  import { DOMAIN_PREVIEWS } from '../lib/domainPreviews.js';

  /** @type {{ domain: { id:string, label:string, icon:string, blurb:string, intro?:string, scaleIntro?:string, essentials?:string[], basicGenerators?:string[], brandColors?:boolean, docsPath?:string } }} */
  let { domain } = $props();

  const query = $derived(ui.query.trim().toLowerCase());
  const searching = $derived(query.length > 0);

  const essentials = $derived(
    (domain.essentials ?? [])
      .map((name) => tokenByName.get(name))
      .filter(Boolean)
  );

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

  const domainTokens = $derived(allTokens.filter((t) => domainOf(t) === domain.id));

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
  const categoryCount = $derived(new Set(grouped.map((c) => c.category)).size);

  const generators = $derived(domain.basicGenerators ?? []);
  const knobs = $derived(KNOBS_BY_DOMAIN[domain.id] ?? []);

  // Domains with a scale generator (typography, spacing): preview goes BELOW
  // the generator so the specimen updates right next to the controls.
  const hasGenerators = $derived(generators.length > 0);

  const hasSettings = $derived(
    !!domain.brandColors ||
    !!STYLE_PRESETS_BY_DOMAIN[domain.id] ||
    basicGroups.length > 0 ||
    essentials.length > 0 ||
    generators.length > 0 ||
    knobs.length > 0
  );

  let showAll = $state(false);

  // Colors panel accordion states.
  let showSecondary = $state(false);
  let showStatus = $state(false);
  let showColorRoles = $state(true);
  let showShadeRamp = $state(false);

  // Preview disclosure (open by default; for generator domains it appears below generators).
  let showPreview = $state(true);

  const previewSpec = $derived(DOMAIN_PREVIEWS[domain.id]);

  const BRAND_PRIMARY = BRAND_COLOR_KEYS.filter((c) => ['base', 'neutral', 'primary'].includes(c.key));
  const BRAND_SECONDARY = BRAND_COLOR_KEYS.filter((c) => ['secondary', 'tertiary', 'action'].includes(c.key));
  const BRAND_STATUS = BRAND_COLOR_KEYS.filter((c) => c.group === 'status');

  const hasBrandOverride = (key) =>
    overrides[`--sf-color-${key}-light`] != null ||
    overrides[`--sf-color-${key}-dark`] != null;

  const modifiedHere = $derived(
    domainTokens.filter((t) => overrides[t.name] != null)
  );

  function resetDomain() {
    const patch = Object.fromEntries(modifiedHere.map((t) => [t.name, null]));
    if (modifiedHere.length) patchOverrides(patch);
  }
</script>

{#snippet expandSummary(title, count, hint = '')}
  <summary class="panel__expand-summary panel__card-head">
    <span class="panel__expand-chev" aria-hidden="true">›</span>
    <span class="panel__card-title">{title}</span>
    {#if typeof count === 'number'}
      <span class="panel__card-count">{count}</span>
    {:else if count}
      <span class="panel__expand-count">{count}</span>
    {/if}
    {#if hint}
      <span class="panel__card-hint">{hint}</span>
    {/if}
  </summary>
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
      <span class="panel__icon"><Icon name={domain.icon} size={18} /></span>
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
      <!-- Active search: filtered catalogue only -->
      {@render filters()}
      {@render catalogue()}
    {:else}

      <!-- ── ZONE 1: LIVE PREVIEW (always leads the panel) ─────────────────
           Colors:           Semantic-roles swatch grid.
           All token domains: DomainPreview card, open by default.
           For generator domains (typography/spacing) the generators are
           placed immediately BELOW the preview so the specimen updates in
           direct visual response to Apply — no scrolling required.
      ─────────────────────────────────────────────────────────────────────── -->

      {#if domain.brandColors}
        <details class="cfg-card panel__card panel__card--lead" bind:open={showColorRoles}>
          {@render expandSummary('Semantic roles', 'How your brand colors surface')}
          <ColorAssignments />
        </details>
        <!-- Contrast/focus knobs right after the roles they control -->
        {#if knobs.length}
          <QuickKnobs {knobs} title="Scaling" blurb={domain.scaleIntro ?? ''} />
        {/if}

      {:else if previewSpec}
        <!-- Preview leads for every token domain — generator or not -->
        <details class="cfg-card panel__card panel__card--lead" bind:open={showPreview}>
          {@render expandSummary('Preview', previewSpec.blurb)}
          <DomainPreview domain={domain.id} />
        </details>

        <!-- Generator domains: scale generators immediately below the preview
             so the specimen is in direct view while the user tunes the ramp. -->
        {#if hasGenerators}
          {#each generators as g (g)}
            <ScaleGenerator kinds={[g]} />
          {/each}
          <!-- Scaling knobs follow the generator controls -->
          {#if knobs.length}
            <QuickKnobs {knobs} title="Scaling" blurb={domain.scaleIntro ?? ''} />
          {/if}
        {:else}
          <!-- Non-generator domains: knobs follow the preview directly -->
          {#if knobs.length}
            <QuickKnobs {knobs} title="Scaling" blurb={domain.scaleIntro ?? ''} />
          {/if}
        {/if}
      {/if}

      <!-- ── ZONE 2: SETTINGS (inputs-first) ────────────────────────────── -->

      {#if domain.intro}
        <p class="panel__intro">{domain.intro}</p>
      {/if}

      {#if STYLE_PRESETS_BY_DOMAIN[domain.id]}
        <StylePresetRow
          title={STYLE_PRESETS_BY_DOMAIN[domain.id].title}
          presets={STYLE_PRESETS_BY_DOMAIN[domain.id].presets}
        />
      {/if}

      <!-- Curated input surfaces — brand colors, friendly groups, or essentials.
           All section cards are now collapsible (<details>) so you can fold a
           section out of the way while still watching the preview above. -->
      {#if domain.brandColors}
        <!-- Core brand colors — collapsible, open by default -->
        <details class="panel__expand cfg-card panel__card" open>
          {@render expandSummary('Core brand colors', BRAND_PRIMARY.length, 'Light values — dark mode is auto-derived. Click the dark swatch to pin.')}
          <div class="panel__card-rows">
            {#each BRAND_PRIMARY as { key, label } (key)}
              <BrandColorRow colorKey={key} {label} />
            {/each}
          </div>
        </details>

        <!-- Extended brand colors — opt-in -->
        <details class="panel__expand" bind:open={showSecondary}>
          <summary class="panel__expand-summary">
            <span class="panel__expand-chev" aria-hidden="true">›</span>
            <span class="panel__expand-title">Extended brand colors</span>
            <span class="panel__expand-count">{BRAND_SECONDARY.length} colors</span>
            {#if BRAND_SECONDARY.some((c) => hasBrandOverride(c.key))}
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
            {#if BRAND_STATUS.some((c) => hasBrandOverride(c.key))}
              <span class="panel__expand-badge">modified</span>
            {/if}
          </summary>
          <div class="panel__card-rows">
            {#each BRAND_STATUS as { key, label } (key)}
              <BrandColorRow colorKey={key} {label} />
            {/each}
          </div>
        </details>

        <!-- Shade ramp (superlight → superdark for each brand color) -->
        <details class="cfg-card panel__card" bind:open={showShadeRamp}>
          <summary class="panel__card-head panel__expand-summary">
            <span class="panel__expand-chev" aria-hidden="true">›</span>
            <span class="panel__card-title">Shade ramp</span>
            <span class="panel__expand-count">7-step scale per brand color</span>
          </summary>
          <ShadeRamp />
        </details>

      {:else if basicGroups.length}
        <!-- Curated groups — each group is now a collapsible card -->
        {#each basicGroups as group (group.title)}
          <details class="panel__expand cfg-card panel__card" open>
            {@render expandSummary(group.title, group.controls.length)}
            <div class="panel__card-rows">
              {#each group.controls as c (c.token)}
                <TokenRow token={c.tokenObj} label={c.label} help={c.help} showRawInfo />
              {/each}
            </div>
          </details>
        {/each}

      {:else if essentials.length}
        <details class="panel__expand cfg-card panel__card" open>
          {@render expandSummary('Essentials', essentials.length, 'Curated for most projects.')}
          <div class="panel__card-rows">
            {#each essentials as token (token.name)}
              <TokenRow {token} />
            {/each}
          </div>
        </details>
      {/if}

      <!-- ── ZONE 3: ALL VARIABLES (progressive disclosure) ──────────────── -->
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
        <!-- No curated Settings surface (e.g. Misc): inline catalogue. -->
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
  /* The live-preview card that leads each category gets a faint accent edge. */
  .panel__card--lead { border-color: var(--cfg-border-strong); }
  .panel__card--lead > summary { border-left: 3px solid var(--cfg-accent-strong); }
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

  /* All-variables disclosure */
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

  /* Filter bar */
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

  /* Progressive disclosure for collapsible section cards (brand colors, basic groups, essentials). */
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
  /* Chevron rotation when any collapsible card is open */
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
  /* When the disclosure card is open its summary gets a border */
  details.cfg-card[open] > .panel__card-head.panel__expand-summary,
  details.panel__expand[open] > .panel__card-head.panel__expand-summary {
    border-bottom: 1px solid var(--cfg-border);
  }

  @media (max-width: 600px) {
    .panel__body { padding: 12px 10px 60px; gap: 12px; }
    .panel__head { padding: 10px 12px 8px; gap: 8px; }
    .panel__title { font-size: 14px; }
    .panel__blurb { display: none; }
    .panel__actions {
      flex-basis: 100%;
      gap: 8px;
    }
    .panel__usage-seg :global(.cfg-seg__btn) {
      padding: 4px 8px;
      font-size: 10.5px;
    }
  }
</style>
