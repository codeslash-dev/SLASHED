<script>
  /**
   * The Color System panel.
   *
   * A floating browser for the framework's `--sf-color-*` token system,
   * mounted once when the launcher is activated. Inspired by builder colour
   * managers, but leaning into what makes SLASHED different: every token is
   * an adaptive `light-dark()` value, so the panel previews BOTH variants at
   * once (the "Both" mode splits each swatch on the diagonal) and the mode
   * toggle drives the live canvas theme so real elements adapt as you browse.
   *
   * Interaction model:
   *   - Pick a swatch → its `var(--sf-color-*)` reference is copied to the
   *     clipboard AND applied to the selected element's chosen target
   *     (text / background / border). Applying the *variable* (never a baked
   *     hex) keeps the element adaptive. With nothing selected it degrades to
   *     copy-only, with a toast telling you to paste.
   *   - Search filters the whole model live.
   *
   * The model itself is built by the pure `color-model.js` from data the PHP
   * side localises; this component is DOM/Bricks glue + presentation.
   */
  import { onMount } from 'svelte';
  import * as api from '../lib/bricks-api.js';
  import { buildColorModel, filterModel, swatchValue } from '../lib/color-model.js';
  import ColorSwatch from './ColorSwatch.svelte';
  import Toast from './Toast.svelte';

  /** @type {{ source: { variables: string[], light: object, dark: object }, onClose?: () => void, initialTarget?: string, onPick?: () => void }} */
  let { source, onClose, initialTarget = 'background', onPick } = $props();

  const TARGETS = [
    { id: 'background', label: 'Background' },
    { id: 'text', label: 'Text' },
    { id: 'border', label: 'Border' },
  ];
  const MODES = [
    { id: 'both', label: 'Both' },
    { id: 'light', label: 'Light' },
    { id: 'dark', label: 'Dark' },
  ];

  let mode = $state('both');
  let target = $state(initialTarget);
  let query = $state('');
  let toast = $state(null);

  const fullModel = $derived(buildColorModel(source?.variables, source?.light, source?.dark));
  const model = $derived(filterModel(fullModel, query));
  const totalTokens = $derived(fullModel.groups.reduce((n, g) => n + g.count, 0));
  const targetLabel = $derived(TARGETS.find((t) => t.id === target)?.label ?? target);

  // --- Live canvas theme preview -------------------------------------------
  // Driving the builder canvas iframe's [data-theme] lets the user watch real
  // elements flip light/dark as they switch modes. Best-effort and reversible:
  // we snapshot the original attribute on mount and restore it on teardown, and
  // "Both" restores the original (the canvas can only show one mode at a time).
  let _canvasOriginal; // undefined = not captured yet
  function canvasRoot() {
    if (typeof document === 'undefined') return null;
    const iframe = document.querySelector(
      'iframe#bricks-builder-iframe, iframe[name="bricks-builder-iframe"], #bricks-builder-area iframe'
    );
    try {
      return iframe?.contentDocument?.documentElement ?? null;
    } catch {
      return null; // cross-origin or not ready — give up silently
    }
  }
  function applyCanvasTheme(nextMode) {
    const root = canvasRoot();
    if (!root) return;
    try {
      if (_canvasOriginal === undefined) {
        _canvasOriginal = root.getAttribute('data-theme');
      }
      if (nextMode === 'light' || nextMode === 'dark') {
        root.setAttribute('data-theme', nextMode);
      } else if (_canvasOriginal === null) {
        root.removeAttribute('data-theme');
      } else {
        root.setAttribute('data-theme', _canvasOriginal);
      }
    } catch {
      /* fail silently — preview is a bonus, never load-bearing */
    }
  }
  function restoreCanvasTheme() {
    const root = canvasRoot();
    if (!root || _canvasOriginal === undefined) return;
    try {
      if (_canvasOriginal === null) root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', _canvasOriginal);
    } catch { /* ignore */ }
  }

  function setMode(next) {
    mode = next;
    applyCanvasTheme(next);
  }

  onMount(() => () => restoreCanvasTheme());

  // --- Clipboard ------------------------------------------------------------
  async function copyText(text) {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch { /* fall through to legacy path */ }
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }

  async function pick(swatch) {
    const value = swatchValue(swatch);
    const copied = await copyText(value);

    const id = api.getActiveElementId();
    if (id) {
      let applied = false;
      api.batchMutations(() => {
        applied = api.setElementColor(id, target, value);
      });
      if (applied) {
        onPick?.();
        const label = api.getElementLabel(id) || 'element';
        toast = { kind: 'success', message: `${targetLabel} of “${label}” → ${swatch.name}` };
      } else {
        // We had a selection but couldn't write to it (e.g. a stale id from
        // the DOM fallback). Say so rather than implying nothing was selected.
        toast = copied
          ? { kind: 'info', message: `Copied ${value} — couldn't apply to the selected element` }
          : { kind: 'error', message: `Couldn't apply or copy ${value}` };
      }
      return;
    }

    toast = copied
      ? { kind: 'info', message: `Copied ${value} — select an element or paste into any Bricks colour field` }
      : { kind: 'error', message: `Couldn't copy ${value}` };
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') onClose?.();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="slashed-cp" role="dialog" aria-modal="false" aria-label="SLASHED Color System" tabindex="-1">
  <header class="slashed-cp__header">
    <h2 class="slashed-cp__title">Color System</h2>
    <div class="slashed-cp__seg" role="group" aria-label="Preview mode">
      {#each MODES as m (m.id)}
        <button
          type="button"
          class="slashed-cp__seg-btn"
          class:slashed-cp__seg-btn--on={mode === m.id}
          aria-pressed={mode === m.id}
          onclick={() => setMode(m.id)}
        >{m.label}</button>
      {/each}
    </div>
    <button type="button" class="slashed-cp__close" aria-label="Close Color System panel" onclick={() => onClose?.()}>×</button>
  </header>

  <div class="slashed-cp__toolbar">
    <input
      type="text"
      class="slashed-cp__search"
      placeholder={`Search ${totalTokens} colours…`}
      bind:value={query}
      aria-label="Search colours"
    />
    <div class="slashed-cp__target" role="group" aria-label="Apply to">
      <span class="slashed-cp__target-label">Apply to</span>
      {#each TARGETS as t (t.id)}
        <button
          type="button"
          class="slashed-cp__chip"
          class:slashed-cp__chip--on={target === t.id}
          aria-pressed={target === t.id}
          onclick={() => (target = t.id)}
        >{t.label}</button>
      {/each}
    </div>
  </div>

  <div class="slashed-cp__body">
    {#if model.groups.length === 0}
      <p class="slashed-cp__empty">No colours match “{query}”.</p>
    {/if}

    {#each model.groups as group (group.id)}
      <section class="slashed-cp__group" data-type={group.type}>
        <div class="slashed-cp__group-head">
          <h3 class="slashed-cp__group-title">
            {group.label}
            {#if group.tagline}<span class="slashed-cp__group-tag">{group.tagline}</span>{/if}
            <span class="slashed-cp__group-count">{group.count}</span>
          </h3>
          {#if group.use}<p class="slashed-cp__group-use">{group.use}</p>{/if}
        </div>

        {#each group.sections as section (section.id)}
          {#if section.label}
            <p class="slashed-cp__section-label">{section.label}</p>
          {/if}

          {#if group.type === 'semantic'}
            <ul class="slashed-cp__list">
              {#each section.swatches as swatch (swatch.var)}
                <li class="slashed-cp__list-item">
                  <ColorSwatch {swatch} {mode} onPick={pick} />
                  <span class="slashed-cp__list-name">{swatch.label}</span>
                  <code class="slashed-cp__list-var">{swatch.name}</code>
                </li>
              {/each}
            </ul>
          {:else}
            <div class="slashed-cp__grid">
              {#each section.swatches as swatch (swatch.var)}
                <div class="slashed-cp__cell">
                  <ColorSwatch {swatch} {mode} onPick={pick} />
                  <span class="slashed-cp__cap">{swatch.label}</span>
                </div>
              {/each}
            </div>
          {/if}
        {/each}
      </section>
    {/each}
  </div>

  <footer class="slashed-cp__footer">
    {#if mode === 'both'}
      <span aria-hidden="true" class="slashed-cp__legend"><span class="slashed-cp__legend-sw"></span> light / dark</span>
    {/if}
    <span class="slashed-cp__hint">Click a colour to apply &amp; copy <code>var()</code></span>
  </footer>
</div>

{#if toast}
  <Toast kind={toast.kind} message={toast.message} onDismiss={() => { toast = null; }} />
{/if}
