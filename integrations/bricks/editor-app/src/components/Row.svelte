<script>
  /**
   * One row in the reBEMer panel — represents a single Bricks element
   * (the subtree root or a descendant).
   *
   * Responsibilities:
   *   - Render the include/skip toggle (the leftmost ☑/☐ in §6.2 of
   *     the design doc). Unchecked rows stay visible for transparency
   *     but produce no mutations at apply time.
   *   - Render the BEM name input + (in modifier mode) the modifier
   *     input. On user input, flip `row.suggestedFrom` to 'user' so
   *     the apply-time auto-numbering treats this name as authoritative.
   *   - Surface "use existing class" recommendations when the produced
   *     class name already exists in the global registry. This is the
   *     client-side half of the §11.3 `recommendedAction` hint —
   *     cross-page reference counts come from the server preflight in
   *     a future PR.
   *   - In migrate mode, render a chip strip listing the element-
   *     settings keys that will be lifted into the new global class.
   */
  import { slugify } from '../lib/slugify.js';

  let {
    row = $bindable(),
    mode,
    blockName,
    isRoot,
    globalClasses = [],
  } = $props();

  const showModifier = $derived(mode === 'modifier');
  const showMigrate = $derived(mode === 'migrate');
  const prefix = $derived(!isRoot && blockName ? `${blockName}__` : '');
  const indent = $derived(Math.min(row.depth ?? 0, 3));

  /** Style suggested vs user-typed names differently so the user can
   *  see at a glance which rows reBEMer pre-filled. */
  const isSuggested = $derived(
    row.suggestedFrom === 'element-type' || row.suggestedFrom === 'fallback'
  );

  /**
   * Compute the class name this row will produce, respecting the
   * current mode. Mirrors the apply-time logic in apply.js so the
   * recommendation hint reflects what would actually happen on Apply.
   *
   * Note: modifier auto-numbering is intentionally NOT modeled here —
   * apply.js rejects in-plan modifier collisions outright.
   */
  const candidateClassName = $derived.by(() => {
    if (!row.include) return '';
    const slug = slugify(row.name);
    if (!slug) return '';
    let base = isRoot ? slug : (blockName ? `${blockName}__${slug}` : slug);
    if (mode === 'modifier') {
      const modSlug = slugify(row.modifier);
      if (!modSlug) return '';
      base = `${base}--${modSlug}`;
    }
    return base;
  });

  /**
   * Find an existing global class with the same name. Used to surface
   * a one-click "use existing" affordance (§11.3 `recommendedAction:
   * "attach"`). Snapshot at panel open, NOT live — globalClasses is
   * passed as a prop and only refreshes when the panel is reopened.
   */
  const existingClassMatch = $derived.by(() => {
    if (!candidateClassName || !Array.isArray(globalClasses)) return null;
    return globalClasses.find(c => c && c.name === candidateClassName) || null;
  });

  function markAsUserTyped() {
    if (row.suggestedFrom !== 'user') row.suggestedFrom = 'user';
  }

  /** Strip the leading underscore so the chip reads `padding` not `_padding`. */
  function chipLabel(key) {
    return key.startsWith('_') ? key.slice(1) : key;
  }
</script>

<div
  class="rebemer-row"
  class:rebemer-row--disabled={!row.include}
  class:rebemer-row--suggested={isSuggested}
  data-depth={indent}
>
  <label class="rebemer-row__include" title="Include this row in the operation">
    <input type="checkbox" bind:checked={row.include} />
  </label>

  <div class="rebemer-row__meta">
    <span class="rebemer-row__label">{row.originalLabel}</span>
    <span class="rebemer-row__type">
      {isRoot ? 'BLOCK' : (row.bricksType || 'ELEM').toUpperCase()}
    </span>
    {#if isSuggested && row.include}
      <span class="rebemer-row__hint" title="Pre-filled from {row.suggestedFrom === 'element-type' ? 'Bricks element type' : 'fallback'}">suggested</span>
    {/if}
  </div>

  <div class="rebemer-row__inputs">
    <div class="rebemer-row__name">
      {#if prefix}<span class="rebemer-row__prefix">{prefix}</span>{/if}
      <input
        type="text"
        bind:value={row.name}
        oninput={markAsUserTyped}
        placeholder={isRoot ? 'block-name' : 'element-name'}
        disabled={!row.include}
        spellcheck="false"
        autocomplete="off"
      />
    </div>
    {#if showModifier}
      <input
        type="text"
        class="rebemer-row__modifier"
        bind:value={row.modifier}
        oninput={markAsUserTyped}
        placeholder="modifier"
        disabled={!row.include}
        spellcheck="false"
        autocomplete="off"
      />
    {/if}
  </div>

  {#if existingClassMatch && row.include}
    <p class="rebemer-row__recommend" role="note">
      A class named <code>{candidateClassName}</code> already exists
      globally. Apply will attach the existing class instead of
      creating a duplicate.
    </p>
  {/if}

  {#if showMigrate && row.include}
    <div class="rebemer-row__chips" aria-label="Settings keys that will be migrated">
      {#if row.migrateKeys?.length}
        <span class="rebemer-row__chips-label">Migrate:</span>
        {#each row.migrateKeys as key}
          <span class="rebemer-chip" title="Will be lifted into {candidateClassName || 'the new class'}">{chipLabel(key)}</span>
        {/each}
      {:else}
        <span class="rebemer-row__chips-empty">No migratable keys on this element.</span>
      {/if}
      {#if row.skippedKeys?.length}
        <span class="rebemer-row__chips-skip" title="Not on the migration allowlist — staying on the element">
          {row.skippedKeys.length} skipped
        </span>
      {/if}
    </div>
  {/if}
</div>
