<script>
  /**
   * A single row in BemPanel: one element + its proposed BEM class
   * name + optional modifier + include checkbox + per-row error.
   *
   * The `row` prop is a reactive entry from the parent's $state array;
   * mutations made via bind:value flow back to the parent through the
   * shared reactive proxy. Indent depth is rendered up to 3 levels via
   * data-depth so all-deeper rows share the same visual indent.
   */
  /**
   * @type {{
   *   row: { id: string, name: string, modifier: string, include: boolean, depth: number, originalLabel: string },
   *   mode: 'add'|'rename'|'replace'|'modifier'|'migrate',
   *   blockName: string,
   *   isRoot: boolean,
   *   error: { message?: string } | null,
   * }}
   */
  let { row = $bindable(), mode, blockName, isRoot, error } = $props();

  const showModifier = $derived(mode === 'modifier');
  const indent = $derived(Math.min(row.depth ?? 0, 3));
  const showPrefix = $derived(!isRoot && blockName.length > 0);
</script>

<div
  class="rebemer-row"
  class:rebemer-row--disabled={!row.include}
  class:rebemer-row--error={!!error}
  data-depth={indent}
>
  <label class="rebemer-row__include" title="Include in operation">
    <input type="checkbox" bind:checked={row.include} aria-label="Include {row.originalLabel}" />
  </label>

  <div class="rebemer-row__meta">
    <span class="rebemer-row__label">{row.originalLabel}</span>
    <span class="rebemer-row__type">{isRoot ? 'BLOCK' : 'ELEMENT'}</span>
  </div>

  <div class="rebemer-row__inputs">
    <div class="rebemer-row__name">
      {#if showPrefix}<span class="rebemer-row__prefix">{blockName}__</span>{/if}
      <input
        type="text"
        bind:value={row.name}
        spellcheck="false"
        autocomplete="off"
        autocapitalize="off"
        placeholder={isRoot ? 'block-name' : 'element-name'}
        disabled={!row.include}
        aria-label={isRoot ? 'Block name' : 'Element name'}
      />
    </div>

    {#if showModifier}
      <input
        type="text"
        class="rebemer-row__modifier"
        bind:value={row.modifier}
        spellcheck="false"
        autocomplete="off"
        autocapitalize="off"
        placeholder="modifier"
        disabled={!row.include}
        aria-label="Modifier"
      />
    {/if}
  </div>

  {#if error?.message}
    <small class="rebemer-row__error" role="alert">{error.message}</small>
  {/if}
</div>
