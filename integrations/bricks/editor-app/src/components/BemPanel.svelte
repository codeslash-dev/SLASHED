<script>
  /**
   * The reBEMer modal panel — toolbar (operation + sync labels),
   * per-element rows, optional confirmation modal, footer apply/cancel.
   * Owns its own focus trap, ESC-to-close, Enter-to-apply, Cmd/Ctrl-Z
   * to undo. Pulls subtree + global classes through the bricks-api seam
   * and orchestrates buildPlan → preflight → applyPlan → undo.push.
   */
  import { onMount } from 'svelte';
  import * as api from '../lib/bricks-api.js';
  import { buildPlan, applyPlan } from '../lib/plan.js';
  import { fetchPreflight } from '../lib/preflight.js';
  import { readPolicy } from '../lib/policy.js';
  import { getPrefs, setPrefs } from '../lib/storage.js';
  import { push as pushUndo, pop as popUndo } from '../lib/undo.js';
  import { slugify } from '../lib/slugify.js';
  import { __ } from '../lib/i18n.js';
  import Row from './Row.svelte';
  import PolicyHint from './PolicyHint.svelte';
  import ConfirmDestructive from './ConfirmDestructive.svelte';
  import Toast from './Toast.svelte';

  /** @type {{ rootId: string, onClose?: () => void }} */
  let { rootId, onClose } = $props();

  const policy = readPolicy();
  const prefs = getPrefs();

  let mode = $state(prefs.lastMode || 'add');
  let syncLabels = $state(prefs.syncLabels !== false);
  let rows = $state([]);
  /** @type {Map<string, {message?:string, code?:string}>} */
  let errorsByRow = $state(new Map());
  let applying = $state(false);
  let toast = $state(/** @type {null | {kind:string, message:string}} */(null));
  let pendingConfirm = $state(/** @type {null | {plan:any, warnings:any[]}} */(null));
  let panelEl = $state(/** @type {HTMLElement|null} */(null));

  const blockName = $derived(slugify(rows[0]?.name ?? '', policy));
  const rootLabel = $derived(rows[0]?.originalLabel ?? '');


  onMount(() => {
    const subtree = api.getSubtree(rootId);
    rows = subtree.map((el, idx) => ({
      id: el.id,
      depth: el.depth ?? 0,
      originalLabel: el.label || el.name || (idx === 0 ? 'block' : 'element'),
      name: slugify(el.label || el.name || '', policy) || (idx === 0 ? 'block' : 'element'),
      modifier: '',
      include: true,
    }));
    panelEl?.focus();

    function onKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key === 'Enter' && (e.target?.tagName === 'INPUT' || e.target?.tagName === 'BUTTON')) {
        e.preventDefault();
        apply();
        return;
      }
      const isUndo = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && !e.shiftKey;
      if (isUndo) { e.preventDefault(); undo(); }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  function close() { onClose?.(); }

  function setToast(kind, message) {
    toast = { kind, message };
  }

  function persistMode() {
    setPrefs({ syncLabels, showModifiers: mode === 'modifier', lastMode: mode });
  }

  function buildSubtreeForPlan() {
    return api.getSubtree(rootId);
  }


  async function apply() {
    if (applying) return;
    applying = true;
    errorsByRow = new Map();
    try {
      const subtree = buildSubtreeForPlan();
      const existingClasses = api.getGlobalClasses();
      const result = buildPlan({ rootId, subtree, mode, rows, policy, existingClasses, syncLabels });
      if (!result.ok) {
        const m = new Map();
        for (const err of result.errors) m.set(err.rowId, { code: err.code, message: __(`rebemer.validate.${err.code}`) });
        errorsByRow = m;
        setToast('error', __('rebemer.toast.validation_failed'));
        return;
      }
      const preflightResult = await safePreflight(result.plan);
      const warnings = collectDestructiveWarnings(result.plan, preflightResult);
      if (warnings.length > 0) {
        pendingConfirm = { plan: result.plan, warnings };
        return;
      }
      await commit(result.plan);
    } finally {
      applying = false;
    }
  }

  async function safePreflight(plan) {
    try {
      const env = globalThis.window?.slashedReBEMer || {};
      return await fetchPreflight(plan, env);
    } catch (err) {
      setToast('info', __('rebemer.toast.preflight_unavailable'));
      return { referenceCounts: {}, nameCollisions: [], reservedHits: [] };
    }
  }

  function collectDestructiveWarnings(plan, preflight) {
    if (plan.mode !== 'rename' && plan.mode !== 'replace') return [];
    const warnings = [];
    for (const op of plan.operations) {
      for (const oldId of op.oldClassIds) {
        const ref = preflight.referenceCounts?.[oldId];
        if (!ref) continue;
        const outside = (ref.outsideSubtreeOnPage || 0) + (ref.otherPosts || 0);
        if (outside > 0) warnings.push({ className: ref.name || oldId, outsideOnPage: ref.outsideSubtreeOnPage || 0, otherPosts: ref.otherPosts || 0 });
      }
    }
    return warnings;
  }


  async function commit(plan) {
    const ar = await applyPlan(plan, api.getApi());
    if (!ar.ok) {
      setToast('error', __('rebemer.toast.apply_failed') + (ar.error?.message ? `: ${ar.error.message}` : ''));
      return;
    }
    pushUndo(ar.snapshot);
    persistMode();
    setToast('success', __('rebemer.toast.applied'));
    setTimeout(() => close(), 600);
  }

  async function confirmProceed() {
    const plan = pendingConfirm?.plan;
    pendingConfirm = null;
    if (plan) await commit(plan);
  }

  function confirmCancel() {
    pendingConfirm = null;
  }

  function undo() {
    const snap = popUndo();
    if (!snap) {
      setToast('info', __('rebemer.toast.nothing_to_undo'));
      return;
    }
    api.restore(snap);
    setToast('info', __('rebemer.toast.undone'));
  }
</script>


<div
  class="rebemer-panel"
  role="dialog"
  aria-modal="true"
  aria-labelledby="rebemer-panel-title"
  tabindex="-1"
  bind:this={panelEl}
>
  <header class="rebemer-panel__header">
    <h2 id="rebemer-panel-title" class="rebemer-panel__title">
      reBEMer · <span class="rebemer-panel__subject">{rootLabel || rootId}</span>
    </h2>
    <button
      type="button"
      class="rebemer-panel__close"
      aria-label={__('rebemer.close')}
      onclick={close}
    >×</button>
  </header>

  <section class="rebemer-panel__toolbar">
    <label class="rebemer-field">
      <span class="rebemer-field__label">{__('rebemer.operation')}</span>
      <select bind:value={mode} aria-label={__('rebemer.operation')}>
        <option value="add">{__('rebemer.mode.add')}</option>
        <option value="rename">{__('rebemer.mode.rename')}</option>
        <option value="replace">{__('rebemer.mode.replace')}</option>
        <option value="modifier">{__('rebemer.mode.modifier')}</option>
        <option value="migrate">{__('rebemer.mode.migrate')}</option>
      </select>
    </label>
    <label class="rebemer-field rebemer-field--inline">
      <input type="checkbox" bind:checked={syncLabels} disabled={mode === 'modifier'} />
      <span>{__('rebemer.sync_labels')}</span>
    </label>
    <PolicyHint {policy} />
  </section>

  <section class="rebemer-panel__body" aria-label={__('rebemer.elements')}>
    {#each rows as row (row.id)}
      <Row
        bind:row={rows[rows.indexOf(row)]}
        {mode}
        {blockName}
        isRoot={row.id === rootId}
        error={errorsByRow.get(row.id) ?? null}
      />
    {/each}
  </section>


  <footer class="rebemer-panel__footer">
    <button type="button" class="rebemer-btn" onclick={close}>{__('rebemer.cancel')}</button>
    <button
      type="button"
      class="rebemer-btn rebemer-btn--primary"
      disabled={applying || rows.length === 0}
      onclick={apply}
    >
      {applying ? __('rebemer.applying') : __('rebemer.apply')}
    </button>
  </footer>
</div>

{#if pendingConfirm}
  <ConfirmDestructive
    warnings={pendingConfirm.warnings}
    onConfirm={confirmProceed}
    onCancel={confirmCancel}
  />
{/if}

{#if toast}
  <Toast
    kind={toast.kind}
    message={toast.message}
    onDismiss={() => { toast = null; }}
  />
{/if}
