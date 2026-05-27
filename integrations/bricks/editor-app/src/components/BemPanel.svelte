<script>
  import { onMount } from 'svelte';
  import * as api from '../lib/bricks-api.js';
  import { slugify } from '../lib/slugify.js';
  import { validateName } from '../lib/validate.js';
  import { applyToSubtree } from '../lib/apply.js';
  import Row from './Row.svelte';
  import Toast from './Toast.svelte';

  let { rootId, onClose } = $props();

  let mode = $state('add');
  let syncLabels = $state(true);
  let rows = $state([]);
  let toast = $state(null);
  let panelEl = $state(null);

  const blockName = $derived(slugify(rows[0]?.name ?? ''));
  const rootLabel = $derived(rows[0]?.originalLabel ?? '');

  onMount(() => {
    const subtree = api.getSubtree(rootId);
    rows = subtree.map((el, i) => ({
      id: el.id,
      depth: el.depth,
      originalLabel: el.label || (i === 0 ? 'block' : 'element'),
      name: slugify(el.label || '') || (i === 0 ? 'block' : 'element'),
      modifier: '',
      include: true,
    }));
  });

  function handleKeydown(e) {
    if (e.key === 'Escape') { onClose?.(); return; }
    const inPanel = panelEl && e.target instanceof Node && panelEl.contains(e.target);
    if (inPanel && e.key === 'Enter' && (e.target?.tagName === 'INPUT' || e.target?.tagName === 'SELECT')) {
      e.preventDefault();
      apply();
    }
  }

  let closeTimer = null;

  function apply() {
    const block = slugify(rows[0]?.name ?? '');
    const v = validateName(block);
    if (!v.ok) {
      toast = { kind: 'error', message: v.reason };
      return;
    }

    const result = applyToSubtree({ rootId, rows, mode, syncLabels });
    if (!result.ok) {
      toast = { kind: 'error', message: result.error };
    } else {
      toast = { kind: 'success', message: `Applied to ${result.count} element${result.count !== 1 ? 's' : ''}.` };
      if (closeTimer) clearTimeout(closeTimer);
      closeTimer = setTimeout(() => onClose?.(), 800);
    }
  }

  $effect(() => {
    return () => { if (closeTimer) clearTimeout(closeTimer); };
  });
</script>

<svelte:window onkeydown={handleKeydown} />

<div bind:this={panelEl} class="rebemer-panel" role="dialog" aria-modal="true" tabindex="-1">
  <header class="rebemer-panel__header">
    <h2 class="rebemer-panel__title">reBEMer · <span class="rebemer-panel__subject">{rootLabel}</span></h2>
    <button
      type="button"
      class="rebemer-panel__close"
      aria-label="Close reBEMer panel"
      onclick={() => onClose?.()}
    >×</button>
  </header>

  <section class="rebemer-panel__toolbar">
    <label class="rebemer-field">
      <span class="rebemer-field__label">Operation</span>
      <select bind:value={mode}>
        <option value="add">Add</option>
        <option value="rename">Rename</option>
        <option value="replace">Replace</option>
        <option value="modifier">Add modifier</option>
      </select>
    </label>
    <label class="rebemer-field rebemer-field--inline">
      <input type="checkbox" bind:checked={syncLabels} disabled={mode === 'modifier'} />
      <span>Sync labels</span>
    </label>
  </section>

  <section class="rebemer-panel__body">
    {#each rows as row, i (row.id)}
      <Row
        bind:row={rows[i]}
        {mode}
        {blockName}
        isRoot={row.id === rootId}
      />
    {/each}
  </section>

  <footer class="rebemer-panel__footer">
    <button type="button" class="rebemer-btn" onclick={() => onClose?.()}>Cancel</button>
    <button type="button" class="rebemer-btn rebemer-btn--primary" onclick={apply}>Apply</button>
  </footer>
</div>

{#if toast}
  <Toast kind={toast.kind} message={toast.message} onDismiss={() => { toast = null; }} />
{/if}
