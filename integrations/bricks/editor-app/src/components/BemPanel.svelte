<script>
  /**
   * The reBEMer panel.
   *
   * Mounted once per badge activation, hosts the rows for the selected
   * subtree and orchestrates the apply flow. Per-row UI lives in
   * Row.svelte; the panel owns mode + global state and feeds derived
   * recommendations down to each row.
   *
   * Initial row seeding (Goal #9, design doc §9.3):
   *   - The block row's name is seeded from the structure-panel label
   *     (slugified). If the label is empty or non-slugifiable the
   *     fallback is the literal `'block'` with `suggestedFrom: 'fallback'`.
   *   - Descendant rows prefer the structure-panel label; when that
   *     produces no slug, the Bricks element type drives the suggestion
   *     via `suggestElementName()` (heading → 'heading', image → 'image',
   *     etc). Layout containers (section/container/block/div) fall
   *     through to the generic `'item'` fallback so users don't end up
   *     with `card__container`.
   *   - Provenance is tracked on each row via `suggestedFrom`. The first
   *     time the user types into a row's input, Row.svelte flips it to
   *     'user' so the apply-time auto-numbering knows not to renumber it.
   */
  import { onMount } from 'svelte';
  import * as api from '../lib/bricks-api.js';
  import { slugify } from '../lib/slugify.js';
  import { validateName } from '../lib/validate.js';
  import { applyToSubtree, buildPlan } from '../lib/apply.js';
  import { suggestElementName, isLayoutContainer } from '../lib/element-types.js';
  import { pickMigratableKeys, pickSkippedKeys } from '../lib/migrate-keys.js';
  import Row from './Row.svelte';
  import Toast from './Toast.svelte';

  let { rootId, onClose } = $props();

  let mode = $state('add');
  let syncLabels = $state(true);
  let rows = $state([]);
  /** Snapshot of bricks_global_classes captured on panel open. */
  let globalClassesAtOpen = $state([]);
  let toast = $state(null);
  let panelEl = $state(null);

  const blockName = $derived(slugify(rows[0]?.name ?? ''));
  const rootLabel = $derived(rows[0]?.originalLabel ?? '');

  /**
   * For migrate mode the panel-level summary tells the user how many
   * keys *would* be lifted across the included rows, and how many are
   * present-but-not-on-the-allowlist (always per-element, never
   * migrated). Helps the user decide whether 'migrate' or 'add' is
   * the right operation for the subtree they opened.
   */
  const migrateSummary = $derived.by(() => {
    if (mode !== 'migrate') return null;
    let willMigrate = 0;
    let willSkip = 0;
    for (const row of rows) {
      if (!row.include) continue;
      willMigrate += (row.migrateKeys?.length ?? 0);
      willSkip += (row.skippedKeys?.length ?? 0);
    }
    return { willMigrate, willSkip };
  });

  /**
   * Per-row preview of the post-numbering BEM class name that will
   * actually be created/attached on Apply. Built from the same pure
   * `buildPlan` step that the apply path uses, so the "use existing
   * class" hint never disagrees with what apply does (semantic-review
   * issue #7). Reactive on rows + mode + rootId.
   *
   * Important: `buildPlan` mutates the per-op `suggestedFrom` to
   * `'auto-number'` when it renumbers. We don't write that back into
   * the source rows here — the next derivation re-reads `row.suggestedFrom`
   * from the original state, so the next preview is computed fresh
   * from the user's authoritative inputs.
   */
  const previewClassNames = $derived.by(() => {
    if (rows.length === 0) return new Map();
    const result = buildPlan({ rootId, rows, mode });
    const map = new Map();
    if (!result.ok) return map;
    for (const op of result.ops) {
      map.set(op.row.id, op.finalClass);
    }
    return map;
  });

  onMount(() => {
    const subtree = api.getSubtree(rootId);
    globalClassesAtOpen = api.getGlobalClasses().slice();

    rows = subtree.map((el, i) => {
      const isRoot = i === 0;
      const label = el.label || '';
      const labelSlug = slugify(label);
      const elementType = el.name || '';

      let name;
      let suggestedFrom;
      if (labelSlug) {
        // The user already named this thing — trust it.
        name = labelSlug;
        suggestedFrom = 'label';
      } else if (isRoot) {
        name = 'block';
        suggestedFrom = 'fallback';
      } else if (elementType && !isLayoutContainer(elementType)) {
        name = suggestElementName(elementType, 'item');
        suggestedFrom = 'element-type';
      } else {
        name = 'item';
        suggestedFrom = 'fallback';
      }

      return {
        id: el.id,
        depth: el.depth,
        bricksType: elementType,
        originalLabel: label || (isRoot ? 'block' : 'element'),
        name,
        modifier: '',
        include: true,
        suggestedFrom,
        // Pre-computed from the element's current settings; used in
        // 'migrate' mode for the chip-strip preview and as the source
        // of truth for which keys get lifted at apply time.
        migrateKeys: pickMigratableKeys(el.settings),
        skippedKeys: pickSkippedKeys(el.settings),
      };
    });
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
        <option value="migrate">Migrate ID styles</option>
      </select>
    </label>
    <label class="rebemer-field rebemer-field--inline">
      <input
        type="checkbox"
        bind:checked={syncLabels}
        disabled={mode === 'modifier'}
      />
      <span>Sync labels</span>
    </label>
  </section>

  {#if migrateSummary}
    <aside
      class="rebemer-panel__notice"
      class:rebemer-panel__notice--warn={migrateSummary.willSkip > 0}
      role="status"
    >
      Will migrate <strong>{migrateSummary.willMigrate}</strong> style key{migrateSummary.willMigrate === 1 ? '' : 's'} into new classes.
      {#if migrateSummary.willSkip > 0}
        <span class="rebemer-panel__notice-skip">
          {migrateSummary.willSkip} key{migrateSummary.willSkip === 1 ? '' : 's'} not on the allowlist will stay on the element.
        </span>
      {/if}
    </aside>
  {/if}

  <section class="rebemer-panel__body">
    {#each rows as row, i (row.id)}
      <Row
        bind:row={rows[i]}
        {mode}
        {blockName}
        isRoot={row.id === rootId}
        globalClasses={globalClassesAtOpen}
        finalClassName={previewClassNames.get(row.id) ?? ''}
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
