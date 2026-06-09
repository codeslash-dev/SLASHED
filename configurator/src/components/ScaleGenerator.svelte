<script>
  /**
   * Scales view: generate a fluid modular scale for the type or space ramp and
   * write each step straight into the override store as a `clamp()` expression
   * — the same fluid curve the framework emits, so the result is drop-in.
   *
   * The scale maths (modular steps + clamp curve) lives in the shared,
   * unit-tested ../lib/scale.js, identical to the WP plugin's generator.
   */
  import { overrides, setOverride, clearOverride } from '../lib/store.svelte.js';
  import { tokenByName } from '../lib/model.js';
  import { RATIOS, TEXT_STEPS, SPACE_STEPS, computeScale, buildClamp } from '../lib/scale.js';

  let kind = $state('type'); // 'type' | 'space'

  const steps = $derived(kind === 'type' ? TEXT_STEPS : SPACE_STEPS);
  const prefix = $derived(kind === 'type' ? '--sf-text-' : '--sf-space-');

  // Sensible defaults per ramp.
  let baseMin = $state(1.0);
  let baseMax = $state(1.25);
  let ratioMin = $state(1.2);
  let ratioMax = $state(1.333);
  let vpMin = $state(22.5);
  let vpMax = $state(90);

  function loadSpaceDefaults() {
    baseMin = 1.0; baseMax = 1.5; ratioMin = 1.5; ratioMax = 1.5;
  }
  function loadTypeDefaults() {
    baseMin = 1.0; baseMax = 1.25; ratioMin = 1.2; ratioMax = 1.333;
  }

  function switchKind(next) {
    if (next === kind) return;
    kind = next;
    next === 'space' ? loadSpaceDefaults() : loadTypeDefaults();
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

<div class="scales">
  <header class="scales__head">
    <h2 class="scales__title">Scale generator</h2>
    <p class="scales__lead">
      Build a fluid modular ramp and write each step as a <code>clamp()</code> override.
    </p>
  </header>

  <section class="card">
    <div class="seg" role="group" aria-label="Scale kind">
      <button class="seg__btn" class:seg__btn--on={kind === 'type'} aria-pressed={kind === 'type'} onclick={() => switchKind('type')}>Type</button>
      <button class="seg__btn" class:seg__btn--on={kind === 'space'} aria-pressed={kind === 'space'} onclick={() => switchKind('space')}>Space</button>
    </div>

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
          <span class="preview__sample" style="font-size: {kind === 'type' ? s.clamp : '1rem'}">
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
</div>

<style>
  .scales { padding: 18px; overflow-y: auto; display: flex; flex-direction: column; gap: 14px; }
  .scales__title { margin: 0; font-size: 18px; }
  .scales__lead { margin: 4px 0 0; color: var(--cfg-text-muted); font-size: 13px; }
  .scales__lead code { font-family: var(--cfg-mono); color: var(--cfg-accent); }

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
  .preview__row { display: grid; grid-template-columns: 14ch 1fr minmax(0, 32ch); gap: 12px; align-items: center; }
  .preview__row--missing { opacity: 0.4; }
  .preview__token { font-family: var(--cfg-mono); font-size: 11.5px; color: var(--cfg-text-muted); }
  .preview__sample { color: var(--cfg-text); line-height: 1; display: flex; align-items: center; overflow: hidden; }
  .preview__bar { block-size: 12px; background: var(--cfg-accent-strong); border-radius: 3px; }
  .preview__clamp { font-family: var(--cfg-mono); font-size: 11px; color: var(--cfg-text-faint); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  .scales__actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .scales__note { font-size: 12px; color: var(--cfg-text-faint); }
</style>
