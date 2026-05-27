<script>
  let { row = $bindable(), mode, blockName, isRoot } = $props();

  const showModifier = $derived(mode === 'modifier');
  const prefix = $derived(!isRoot && blockName ? `${blockName}__` : '');
  const indent = $derived(Math.min(row.depth ?? 0, 3));
</script>

<div
  class="rebemer-row"
  class:rebemer-row--disabled={!row.include}
  data-depth={indent}
>
  <label class="rebemer-row__include">
    <input type="checkbox" bind:checked={row.include} />
  </label>

  <div class="rebemer-row__meta">
    <span class="rebemer-row__label">{row.originalLabel}</span>
    <span class="rebemer-row__type">{isRoot ? 'BLOCK' : 'ELEM'}</span>
  </div>

  <div class="rebemer-row__inputs">
    <div class="rebemer-row__name">
      {#if prefix}<span class="rebemer-row__prefix">{prefix}</span>{/if}
      <input
        type="text"
        bind:value={row.name}
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
        placeholder="modifier"
        disabled={!row.include}
        spellcheck="false"
        autocomplete="off"
      />
    {/if}
  </div>
</div>
