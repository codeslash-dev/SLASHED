<script>
  /**
   * One domain tab (Colors, Typography, Spacing, …).
   *
   * Studio domains intentionally use a strict three-part layout:
   * CategoryHeader → the domain Studio → All variables. Legacy quick controls,
   * presets, intros and curated sections remain only for domains without a
   * dedicated Studio component (for example Misc/Gradients).
   */
  import { allTokens, groupTokens, matchesQuery, tokenByName } from '../lib/model.js';
  import { domainOf, KNOBS_BY_DOMAIN, DOCS_BASE_URL } from '../lib/domains.js';
  import { smartSettingsFor } from '../lib/domainSettings.js';
  import { BASIC_BY_DOMAIN } from '../lib/basics.js';
  import { ui, overrides, patchOverrides } from '../lib/store.svelte.js';
  import { STYLE_PRESETS_BY_DOMAIN } from '../lib/stylePresets.js';
  import TokenGroup from './TokenGroup.svelte';
  import ScaleGenerator from './ScaleGenerator.svelte';
  import QuickKnobs from './QuickKnobs.svelte';
  import StylePresetRow from './StylePresetRow.svelte';
  import SmartSettings from './SmartSettings.svelte';
  import CategoryHeader from './CategoryHeader.svelte';
  import ControlSection from './ControlSection.svelte';
  import FriendlyControl from './FriendlyControl.svelte';
  import TypographyStudio from './editors/TypographyStudio.svelte';
  import ColorStudio from './editors/ColorStudio.svelte';
  import SpacingStudio from './editors/SpacingStudio.svelte';
  import LayoutStudio from './editors/LayoutStudio.svelte';
  import ShapeStudio from './editors/ShapeStudio.svelte';
  import ShadowStudio from './editors/ShadowStudio.svelte';
  import MotionStudio from './editors/MotionStudio.svelte';
  import EffectsStudio from './editors/EffectsStudio.svelte';

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
  const smartSections = $derived(smartSettingsFor(domain.id));
  const STUDIO_BY_DOMAIN = {
    typography: TypographyStudio, colors: ColorStudio, spacing: SpacingStudio,
    layout: LayoutStudio, borders: ShapeStudio, shadows: ShadowStudio,
    motion: MotionStudio, effects: EffectsStudio,
  };
  const Studio = $derived(STUDIO_BY_DOMAIN[domain.id] ?? null);
  const usesVisualStudio = $derived(Studio != null);

  // Domains with a scale generator (typography, spacing): preview goes BELOW
  // the generator in the legacy fallback layout so the specimen updates right
  // next to the controls. Studio domains own these controls inside the Studio.
  const hasGenerators = $derived(generators.length > 0);

  const hasLegacySettings = $derived(
    !usesVisualStudio && (
      !!domain.brandColors ||
      !!STYLE_PRESETS_BY_DOMAIN[domain.id] ||
      basicGroups.length > 0 ||
      essentials.length > 0 ||
      generators.length > 0 ||
      knobs.length > 0 ||
      smartSections.length > 0
    )
  );

  let showAll = $state(false);


  const modifiedHere = $derived(
    domainTokens.filter((t) => overrides[t.name] != null)
  );

  function resetDomain() {
    const patch = Object.fromEntries(modifiedHere.map((t) => [t.name, null]));
    if (modifiedHere.length) patchOverrides(patch);
  }
</script>


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
  <div class="panel__body">
    <CategoryHeader domain={domain} modifiedCount={modifiedHere.length} tokenCount={domainTokens.length} onreset={resetDomain} />
    {#if searching}
      <!-- Active search: filtered catalogue only -->
      {@render filters()}
      {@render catalogue()}
    {:else}


      {#if Studio}
        {#if knobs.length}
          <QuickKnobs {knobs} title="Scaling" blurb={domain.scaleIntro ?? ''} />
        {/if}
        {#if STYLE_PRESETS_BY_DOMAIN[domain.id]}
          <StylePresetRow
            title={STYLE_PRESETS_BY_DOMAIN[domain.id].title}
            presets={STYLE_PRESETS_BY_DOMAIN[domain.id].presets}
          />
        {/if}
        <Studio />
      {:else}
        <!-- Legacy fallback layout for domains that do not yet own a Studio. -->
        {#if hasGenerators}
          {#each generators as g (g)}
            <ScaleGenerator kinds={[g]} collapsible />
          {/each}
        {/if}
        {#if knobs.length}
          <QuickKnobs {knobs} title="Scaling" blurb={domain.scaleIntro ?? ''} />
        {/if}

        {#if domain.intro}
          <p class="panel__intro">{domain.intro}</p>
        {/if}

        {#if STYLE_PRESETS_BY_DOMAIN[domain.id]}
          <StylePresetRow
            title={STYLE_PRESETS_BY_DOMAIN[domain.id].title}
            presets={STYLE_PRESETS_BY_DOMAIN[domain.id].presets}
          />
        {/if}

        {#if smartSections.length}
          <SmartSettings domainId={domain.id} />
        {/if}

        {#if basicGroups.length}
          {#each basicGroups as group (group.title)}
            <ControlSection title={group.title} modifiedCount={group.controls.filter((c) => overrides[c.token] != null).length}>
              <div class="panel__card-rows">
                {#each group.controls as c (c.token)}
                  <FriendlyControl token={c.tokenObj} label={c.label} help={c.help} />
                {/each}
              </div>
            </ControlSection>
          {/each}
        {:else if essentials.length}
          <ControlSection title="Essentials" hint="Curated for most projects." modifiedCount={essentials.filter((t) => overrides[t.name] != null).length}>
            <div class="panel__card-rows">
              {#each essentials as token (token.name)}
                <FriendlyControl {token} showToken />
              {/each}
            </div>
          </ControlSection>
        {/if}
      {/if}

      <!-- ── ALL VARIABLES (progressive disclosure) ─────────────────────── -->
      {#if usesVisualStudio || hasLegacySettings}
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

      {#if !usesVisualStudio && domain.docsPath}
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

  @media (max-width: 600px) {
    .panel__body { padding: 12px 10px 60px; gap: 12px; }
    .panel__usage-seg :global(.cfg-seg__btn) {
      padding: 4px 8px;
      font-size: 10.5px;
    }
  }
</style>
