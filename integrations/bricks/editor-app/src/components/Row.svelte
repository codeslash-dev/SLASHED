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
   *     class name already exists in the global registry. Uses the
   *     post-numbering `finalClassName` passed in by the panel — the
   *     same name `apply.js` will actually attach — so the hint never
   *     disagrees with what apply does.
   *   - In migrate mode, render a chip strip listing the element-
   *     settings keys that will be lifted into the new global class,
   *     with copy that matches the migrate-mode merge/conflict rules
   *     in apply.js's validateMigrate().
   */

  let {
    row = $bindable(),
    mode,
    blockName,
    isRoot,
    globalClasses = [],
    /**
     * The post-numbering BEM class name `apply.js` will actually
     * create/attach for this row. Empty string means the row is
     * either skipped, has an invalid name, or the plan is otherwise
     * incomplete (e.g. modifier mode with empty modifier). The panel
     * derives this map from `buildPlan` so it always agrees with
     * apply-time behavior.
     */
    finalClassName = '',
  } = $props();

  const showModifier = $derived(mode === 'modifier');
  const showMigrate = $derived(mode === 'migrate');
  const prefix = $derived(!isRoot && blockName ? `${blockName}__` : '');

  /** Style suggested vs user-typed names differently so the user can
   *  see at a glance which rows reBEMer pre-filled. */
  const isSuggested = $derived(
    row.suggestedFrom === 'element-type' || row.suggestedFrom === 'fallback'
  );

  /**
   * Find an existing global class with the same name. Snapshot at
   * panel open via the `globalClasses` prop, NOT live — refreshes
   * only when the panel is reopened. Used to surface a one-click
   * "use existing" affordance (§11.3 `recommendedAction: "attach"`).
   */
  const existingClassMatch = $derived.by(() => {
    if (!finalClassName || !Array.isArray(globalClasses)) return null;
    if (!row.include) return null;
    return globalClasses.find(c => c && c.name === finalClassName) || null;
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
  style="--rebemer-row-depth: {row.depth ?? 0}"
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
      <span
        class="rebemer-row__hint"
        title="Pre-filled from {row.suggestedFrom === 'element-type' ? 'Bricks element type' : 'fallback'}"
      >suggested</span>
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

  {#if existingClassMatch}
    <p class="rebemer-row__recommend" role="note">
      {#if showMigrate}
        A class named <code>{finalClassName}</code> already exists.
        On Apply, missing style keys will be merged into it. Conflicting
        values block the migration — pick a different name or use Add.
      {:else}
        A class named <code>{finalClassName}</code> already exists
        globally. Apply will attach the existing class instead of
        creating a duplicate.
      {/if}
    </p>
  {/if}

  {#if showMigrate && row.include}
    <div class="rebemer-row__chips" aria-label="Settings keys that will be migrated">
      {#if row.migrateKeys?.length}
        <span class="rebemer-row__chips-label">Migrate:</span>
        {#each row.migrateKeys as key}
          <span class="rebemer-chip" title="Will be lifted into {finalClassName || 'the new class'}">{chipLabel(key)}</span>
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
