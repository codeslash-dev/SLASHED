<script>
  /**
   * Scales view: generate a fluid modular scale for the type, display or space
   * ramp and write each step straight into the override store as a `clamp()`
   * expression — the same fluid curve the framework emits, so the result is
   * drop-in.
   *
   * The scale maths (modular steps + clamp curve) lives in the shared,
   * unit-tested ../lib/scale.js, identical to the WP plugin's generator. The
   * DISPLAY ramp (--sf-text-display-{s,m,l}) is defined locally here — exactly
   * as the plugin defines its display steps in-component — so the parity
   * scale.js stays byte-for-byte identical across both repos.
   *
   * @prop {Array<'type'|'display'|'space'>} [kinds] which ramps to expose
   *   (defaults to all three). Lets the Typography tab show type+display and the
   *   Spacing tab show only space.
   */
  import { overrides, setOverride, clearOverride } from '../lib/store.svelte.js';
  import { tokenByName } from '../lib/model.js';
  import { RATIOS, TEXT_STEPS, SPACE_STEPS, computeScale, buildClamp } from '../lib/scale.js';

  let { kinds = ['type', 'display', 'space'] } = $props();

  /**
   * The framework's display ramp: --sf-text-display-{s,m,l}, a separate modular
   * scale (base 2.4–3rem) sharing the text ratio, with display-s at index 0.
   * Mirrors core/tokens.css (`--sf-text-display-s|m|l`).
   */
  const DISPLAY_STEPS = [
    { name: 'display-s', idx: 0 },
    { name: 'display-m', idx: 1 },
    { name: 'display-l', idx: 2 },
  ];

  const KIND_LABELS = { type: 'Type', display: 'Display', space: 'Space' };

  /** Sensible starting knobs per ramp (display matches core/tokens.css). */
  const DEFAULTS = {
    type: { baseMin: 1.0, baseMax: 1.25, ratioMin: 1.2, ratioMax: 1.333 },
    display: { baseMin: 2.4, baseMax: 3.0, ratioMin: 1.2, ratioMax: 1.333 },
    space: { baseMin: 1.0, baseMax: 1.5, ratioMin: 1.5, ratioMax: 1.5 },
  };

  // `kinds` is fixed for the lifetime of an instance (the panel re-mounts the
  // generator via {#key} when the domain changes), so capturing the first ramp
  // and its defaults as plain consts is correct — and keeps the $state
  // initializers from referencing reactive props.
  const FIRST = (kinds && kinds[0]) || 'type';
  const FIRST_DEFAULTS = DEFAULTS[FIRST] || DEFAULTS.type;

  let kind = $state(FIRST);

  const steps = $derived(
    kind === 'type' ? TEXT_STEPS : kind === 'display' ? DISPLAY_STEPS : SPACE_STEPS
  );
  const prefix = $derived(
    kind === 'space' ? '--sf-space-' : '--sf-text-'
  );

  // Knobs — seeded from the first ramp's defaults, reset on every kind switch.
  let baseMin = $state(FIRST_DEFAULTS.baseMin);
  let baseMax = $state(FIRST_DEFAULTS.baseMax);
  let ratioMin = $state(FIRST_DEFAULTS.ratioMin);
  let ratioMax = $state(FIRST_DEFAULTS.ratioMax);
  let vpMin = $state(22.5);
  let vpMax = $state(90);

  function switchKind(next) {
    if (next === kind) return;
    kind = next;
    const d = DEFAULTS[next] || DEFAULTS.type;
    baseMin = d.baseMin;
    baseMax = d.baseMax;
    ratioMin = d.ratioMin;
    ratioMax = d.ratioMax;
  }

  const computed = $derived(
    computeScale(steps, { baseMin, baseMax, ratioMin, ratioMax }).map((s) => ({
      ...s,
      token: `${prefix}${s.name}`,
      clamp: buildClamp(s.min, s.max, vpMin, vpMax),
    }))
  );

  // Only steps whose token actually exists in the catalogue can be applied.
  const applicable = $derived(computed.filter((s) => tokenByName.has(s.token)));
  const missing = $derived(computed.length - applicable.length);

  let applied = $state(false);
  function apply() {
    for (const s of applicable) setOverride(s.token, s.clamp);
    applied = true;
    setTimeout(() => (applied = false), 1800);
  }
  function reset() {
    for (const s of computed) if (s.token in overrides) clearOverride(s.token);
  }
</script>

<section class="card">
  {#if kinds.length > 1}
    <div class="seg" role="group" aria-label="Scale kind">
      {#each kinds as k (k)}
        <button
          class="seg__btn"
          class:seg__btn--on={kind === k}
          aria-pressed={kind === k}
          onclick={() => switchKind(k)}
        >{KIND_LABELS[k] ?? k}</button>
      {/each}
    </div>
  {/if}

  <div class="controls">
    <label class="ctl"><span>Base min</span><span class="ctl__in"><input type="number" min="0.1" step="0.01" bind:value={baseMin} /><i>rem</i></span></label>
    <label class="ctl"><span>Base max</span><span class="ctl__in"><input type="number" min="0.1" step="0.01" bind:value={baseMax} /><i>rem</i></span></label>
    <label class="ctl"><span>Ratio (min)</span>
      <select bind:value={ratioMin}>{#each RATIOS as r (r.value)}<option value={r.value}>{r.label}</option>{/each}</select>
    </label>
    <label class="ctl"><span>Ratio (max)</span>
      <select bind:value={ratioMax}>{#each RATIOS as r (r.value)}<option value={r.value}>{r.label}</option>{/each}</select>
    </label>
    <label class="ctl"><span>Viewport min</span><span class="ctl__in"><input type="number" min="1" step="0.5" bind:value={vpMin} /><i>rem</i></span></label>
    <label class="ctl"><span>Viewport max</span><span class="ctl__in"><input type="number" min="1" step="0.5" bind:value={vpMax} /><i>rem</i></span></label>
  </div>

  <div class="preview">
    {#each computed as s (s.token)}
      <div class="preview__row" class:preview__row--missing={!tokenByName.has(s.token)}>
        <code class="preview__token">{s.token}</code>
        <span class="preview__sample" style="font-size: {kind === 'space' ? '1rem' : s.clamp}">
          {#if kind === 'space'}<span class="preview__bar" style="inline-size: {s.clamp}"></span>{:else}Ag{/if}
        </span>
        <code class="preview__clamp">{s.clamp}</code>
      </div>
    {/each}
  </div>

  <div class="scales__actions">
    <button class="cfg-btn cfg-btn--primary" onclick={apply} disabled={applicable.length === 0}>
      {applied ? 'Applied ✓' : `Apply ${applicable.length} step${applicable.length === 1 ? '' : 's'}`}
    </button>
    <button class="cfg-btn cfg-btn--ghost" onclick={reset}>Reset these</button>
    {#if missing > 0}<span class="scales__note">{missing} step(s) not in this catalogue — skipped.</span>{/if}
  </div>
</section>

<style>
  .card { background: var(--cfg-surface); border: 1px solid var(--cfg-border); border-radius: var(--cfg-radius); padding: 16px; }

  .seg { display: inline-flex; border: 1px solid var(--cfg-border-strong); border-radius: var(--cfg-radius-s); overflow: hidden; margin-bottom: 16px; }
  .seg__btn { background: var(--cfg-surface-2); color: var(--cfg-text-muted); border: none; padding: 6px 16px; font-size: 13px; }
  .seg__btn--on { background: var(--cfg-accent-strong); color: #fff; }

  .controls { display: flex; flex-wrap: wrap; gap: 14px; margin-bottom: 16px; }
  .ctl { display: flex; flex-direction: column; gap: 5px; font-size: 12px; color: var(--cfg-text-muted); }
  .ctl__in { display: flex; align-items: center; gap: 5px; }
  .ctl__in i { font-style: normal; font-size: 11px; color: var(--cfg-text-faint); }
  .ctl input { width: 84px; background: var(--cfg-bg); color: var(--cfg-text); border: 1px solid var(--cfg-border-strong); border-radius: var(--cfg-radius-s); padding: 6px 8px; }
  .ctl select { background: var(--cfg-bg); color: var(--cfg-text); border: 1px solid var(--cfg-border-strong); border-radius: var(--cfg-radius-s); padding: 6px 8px; font-size: 12px; }

  .preview { display: flex; flex-direction: column; gap: 4px; margin-bottom: 16px; border-top: 1px solid var(--cfg-border); padding-top: 12px; }
  .preview__row { display: grid; grid-template-columns: 16ch 1fr minmax(0, 32ch); gap: 12px; align-items: center; }
  .preview__row--missing { opacity: 0.4; }
  .preview__token { font-family: var(--cfg-mono); font-size: 11.5px; color: var(--cfg-text-muted); }
  .preview__sample { color: var(--cfg-text); line-height: 1; display: flex; align-items: center; overflow: hidden; }
  .preview__bar { block-size: 12px; background: var(--cfg-accent-strong); border-radius: 3px; }
  .preview__clamp { font-family: var(--cfg-mono); font-size: 11px; color: var(--cfg-text-faint); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  .scales__actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .scales__note { font-size: 12px; color: var(--cfg-text-faint); }
</style>
