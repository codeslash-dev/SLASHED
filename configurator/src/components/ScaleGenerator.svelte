<script>
  /**
   * Scales view: tune the fluid modular scale of the type, display or space
   * ramp. The framework derives every step LIVE from a handful of engine
   * scalars (base min/max, ratio min/max, shared viewport range — see
   * lib/fluidEngine.js), so Apply writes those scalars in one history step:
   * the export stays a few numbers instead of nine clamp() walls, and the
   * engine remains live for later tweaks.
   *
   * Fallback: if a scalar token is missing from the active catalogue (an
   * older framework sync), Apply falls back to writing per-step clamp()
   * expressions — the same fluid curve, just baked.
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
  import { overrides, setOverride, clearOverride, patchOverrides } from '../lib/store.svelte.js';
  import { tokenByName } from '../lib/model.js';
  import { RATIOS, TEXT_STEPS, SPACE_STEPS, computeScale, buildClamp } from '../lib/scale.js';
  import {
    ENGINES,
    VIEWPORT_SCALARS,
    engineTokens,
    buildEnginePatch,
    resetEnginePatch,
    resetViewportPatch,
  } from '../lib/fluidEngine.js';

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

  /** Numeric seed for one engine scalar: active override if any, else the
   *  framework default — so the generator always opens on the LIVE scale. */
  function seedScalar(scalar) {
    const raw = overrides[scalar.token];
    const parsed = raw != null ? parseFloat(raw) : NaN;
    return Number.isFinite(parsed) ? parsed : scalar.default;
  }

  /** All six knob seeds for a ramp (display borrows the type ratios). */
  function seedKnobs(k) {
    const e = ENGINES[k] || ENGINES.type;
    const ratios = e.sharedRatios ? ENGINES.type.scalars : e.scalars;
    return {
      baseMin: seedScalar(e.scalars.baseMin),
      baseMax: seedScalar(e.scalars.baseMax),
      ratioMin: seedScalar(ratios.ratioMin),
      ratioMax: seedScalar(ratios.ratioMax),
      vpMin: seedScalar(VIEWPORT_SCALARS.vpMin),
      vpMax: seedScalar(VIEWPORT_SCALARS.vpMax),
    };
  }

  // `kinds` is fixed for the lifetime of an instance (the panel re-mounts the
  // generator via {#key} when the domain changes), so capturing the first ramp
  // and its seeds as plain consts is correct — and keeps the $state
  // initializers from referencing reactive props.
  // svelte-ignore state_referenced_locally
  const FIRST = (kinds && kinds[0]) || 'type';
  const SEED = seedKnobs(FIRST);

  let kind = $state(FIRST);

  const steps = $derived(
    kind === 'type' ? TEXT_STEPS : kind === 'display' ? DISPLAY_STEPS : SPACE_STEPS
  );
  const prefix = $derived(
    kind === 'space' ? '--sf-space-' : '--sf-text-'
  );

  // The display ramp reuses the TYPE ratios — its ratio knobs are read-only.
  const sharedRatios = $derived(Boolean(ENGINES[kind]?.sharedRatios));

  // Scalar-writing only works when every engine token is in the catalogue.
  const engineLive = $derived(engineTokens(kind).every((t) => tokenByName.has(t)));

  // Knobs — seeded from the live overrides/defaults, reseeded per kind switch.
  let baseMin = $state(SEED.baseMin);
  let baseMax = $state(SEED.baseMax);
  let ratioMin = $state(SEED.ratioMin);
  let ratioMax = $state(SEED.ratioMax);
  let vpMin = $state(SEED.vpMin);
  let vpMax = $state(SEED.vpMax);

  function reseed(k) {
    const s = seedKnobs(k);
    baseMin = s.baseMin;
    baseMax = s.baseMax;
    ratioMin = s.ratioMin;
    ratioMax = s.ratioMax;
    vpMin = s.vpMin;
    vpMax = s.vpMax;
  }

  function switchKind(next) {
    if (next === kind) return;
    kind = next;
    reseed(next);
  }

  // The shared viewport range is currently customised (any ramp may have
  // set it) — surfaces the dedicated reset affordance.
  const viewportModified = $derived(
    overrides[VIEWPORT_SCALARS.vpMin.token] != null ||
    overrides[VIEWPORT_SCALARS.vpMax.token] != null
  );

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

  // Base anchor step name (idx === 0) — marked with a pill in the ramp.
  const baseStepName = $derived(steps.find((s) => s.idx === 0)?.name ?? 'm');

  // Max value across all steps (both endpoints) — used to size the proportional
  // bars. Considering min AND max keeps the mobile bar within the track even
  // for inverted knob combos (baseMin > baseMax) where a step's mobile value
  // exceeds every desktop value.
  const maxVal = $derived(Math.max(...computed.map((s) => Math.max(s.min, s.max)), 0.001));

  let applied = $state(false);
  function apply() {
    if (engineLive) {
      // One history step: write the engine scalars (default values are
      // cleared, not written) and null this ramp's per-step tokens so a
      // previously baked clamp() can't mask the live derivation.
      patchOverrides(buildEnginePatch(kind, { baseMin, baseMax, ratioMin, ratioMax, vpMin, vpMax }));
    } else {
      // Catalogue without the engine scalars — bake per-step clamp()s.
      for (const s of applicable) setOverride(s.token, s.clamp);
    }
    applied = true;
    setTimeout(() => (applied = false), 1800);
  }

  function reset() {
    if (engineLive) {
      patchOverrides(resetEnginePatch(kind));
    } else {
      for (const s of computed) if (overrides[s.token] != null) clearOverride(s.token);
    }
    reseed(kind);
  }

  function resetViewport() {
    patchOverrides(resetViewportPatch());
    reseed(kind);
  }
</script>

<section class="gen">
  <!-- ── header / kind tabs ─────────────────────────────────────────────── -->
  <div class="gen__head">
    <span class="gen__title">Scale generator</span>
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
    {#if applied}<span class="gen__applied">Applied ✓</span>{/if}
  </div>

  <!-- ── two-column body: inputs left, live ramp right ─────────────────── -->
  <div class="gen__body">
    <!-- LEFT: knob inputs -->
    <div class="gen__inputs">
      <div class="ctl-grid">
        <label class="ctl">
          <span class="ctl__lbl">Base min</span>
          <span class="ctl__in"><input type="number" min="0.1" step="0.01" bind:value={baseMin} /><i>rem</i></span>
        </label>
        <label class="ctl">
          <span class="ctl__lbl">Base max</span>
          <span class="ctl__in"><input type="number" min="0.1" step="0.01" bind:value={baseMax} /><i>rem</i></span>
        </label>
        <label class="ctl">
          <span class="ctl__lbl">Ratio (mobile)</span>
          <select bind:value={ratioMin} disabled={sharedRatios} title={sharedRatios ? 'Shared with the type scale — tune it on the Type tab' : undefined}>
            {#each RATIOS as r (r.value)}<option value={r.value}>{r.label}</option>{/each}
          </select>
        </label>
        <label class="ctl">
          <span class="ctl__lbl">Ratio (desktop)</span>
          <select bind:value={ratioMax} disabled={sharedRatios} title={sharedRatios ? 'Shared with the type scale — tune it on the Type tab' : undefined}>
            {#each RATIOS as r (r.value)}<option value={r.value}>{r.label}</option>{/each}
          </select>
        </label>
        <label class="ctl">
          <span class="ctl__lbl">Viewport min</span>
          <span class="ctl__in"><input type="number" min="1" step="0.5" bind:value={vpMin} /><i>rem</i></span>
        </label>
        <label class="ctl">
          <span class="ctl__lbl">Viewport max</span>
          <span class="ctl__in"><input type="number" min="1" step="0.5" bind:value={vpMax} /><i>rem</i></span>
        </label>
      </div>

      {#if sharedRatios}
        <p class="gen__hint">Display ramp reuses the type ratios — tune them on the Type tab.</p>
      {/if}
      {#if engineLive}
        <p class="gen__hint">Viewport range is <strong>shared</strong> across every fluid scale.</p>
      {/if}

      <div class="gen__actions">
        <button class="cfg-btn cfg-btn--primary" onclick={apply} disabled={!engineLive && applicable.length === 0}>
          {#if applied}Applied ✓
          {:else if engineLive}Apply scale
          {:else}Apply {applicable.length} step{applicable.length === 1 ? '' : 's'}{/if}
        </button>
        <button class="cfg-btn cfg-btn--ghost" onclick={reset} title="Return this ramp to the framework default">Reset</button>
        {#if viewportModified}
          <button class="cfg-btn cfg-btn--ghost" onclick={resetViewport} title="Clear the shared viewport range override (affects every fluid scale)">Reset viewport</button>
        {/if}
      </div>
      {#if engineLive}
        <p class="gen__note">Writes engine scalars — a few numbers, never clamp() walls.</p>
      {:else if missing > 0}
        <p class="gen__note">{missing} step(s) not in this catalogue — skipped.</p>
      {/if}
    </div>

    <!-- RIGHT: live step ramp -->
    <div class="ramp" aria-label="{KIND_LABELS[kind] ?? kind} scale ramp">
      {#each computed as s (s.token)}
        {@const isBase = s.name === baseStepName}
        {@const barPct = Math.round((s.max / maxVal) * 100)}
        <div class="ramp__row" class:ramp__row--missing={!tokenByName.has(s.token)}>
          <div class="ramp__label">
            <code class="ramp__name">{s.name}</code>
            {#if isBase}<span class="ramp__anchor" title="Base anchor (index 0)">base</span>{/if}
          </div>

          <div class="ramp__bars">
            <!-- Mobile bar (min value) -->
            <div class="ramp__bar-row">
              <span class="ramp__device" aria-label="Mobile">📱</span>
              <div class="ramp__track">
                <div class="ramp__fill ramp__fill--min" style="width: {Math.round((s.min / maxVal) * 100)}%"></div>
              </div>
              <span class="ramp__val">{s.min.toFixed(3)}<i>rem</i></span>
            </div>
            <!-- Desktop bar (max value) -->
            <div class="ramp__bar-row">
              <span class="ramp__device" aria-label="Desktop">🖥</span>
              <div class="ramp__track">
                <div class="ramp__fill ramp__fill--max" style="width: {barPct}%"></div>
              </div>
              <span class="ramp__val">{s.max.toFixed(3)}<i>rem</i></span>
            </div>
          </div>

          {#if kind !== 'space'}
            <span class="ramp__sample" style="font-size: {s.clamp}" aria-hidden="true">Ag</span>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .gen {
    background: var(--cfg-surface);
    border: 1px solid var(--cfg-border);
    border-radius: var(--cfg-radius);
    overflow: hidden;
  }

  .gen__head {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--cfg-border);
    background: var(--cfg-surface-2);
    flex-wrap: wrap;
  }
  .gen__title { font-size: 13px; font-weight: 600; }
  .gen__applied { font-size: 11.5px; color: var(--cfg-ok); margin-left: auto; }

  .seg { display: inline-flex; border: 1px solid var(--cfg-border-strong); border-radius: var(--cfg-radius-s); overflow: hidden; }
  .seg__btn { background: var(--cfg-surface-2); color: var(--cfg-text-muted); border: none; padding: 4px 12px; font-size: 12px; cursor: pointer; }
  .seg__btn--on { background: var(--cfg-accent-strong); color: #fff; }

  /* Two-column layout: inputs | ramp */
  .gen__body {
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: 0;
    align-items: start;
  }

  /* ── LEFT column: inputs ── */
  .gen__inputs {
    padding: 16px;
    border-right: 1px solid var(--cfg-border);
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .ctl-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px 12px;
  }
  .ctl { display: flex; flex-direction: column; gap: 4px; font-size: 11.5px; color: var(--cfg-text-muted); }
  .ctl__lbl { font-size: 11px; }
  .ctl__in { display: flex; align-items: center; gap: 4px; }
  .ctl__in i { font-style: normal; font-size: 10px; color: var(--cfg-text-faint); }
  .ctl input {
    width: 100%;
    min-width: 0;
    background: var(--cfg-bg);
    color: var(--cfg-text);
    border: 1px solid var(--cfg-border-strong);
    border-radius: var(--cfg-radius-s);
    padding: 5px 7px;
    font-size: 12px;
  }
  .ctl select {
    width: 100%;
    background: var(--cfg-bg);
    color: var(--cfg-text);
    border: 1px solid var(--cfg-border-strong);
    border-radius: var(--cfg-radius-s);
    padding: 5px 7px;
    font-size: 11.5px;
  }
  .ctl select:disabled { opacity: 0.55; cursor: not-allowed; }

  .gen__hint { margin: 0; font-size: 11.5px; line-height: 1.4; color: var(--cfg-text-muted); }
  .gen__note { margin: 0; font-size: 11px; color: var(--cfg-text-faint); }

  .gen__actions { display: flex; gap: 8px; flex-wrap: wrap; }

  /* ── RIGHT column: ramp ── */
  .ramp {
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden;
  }
  .ramp__row {
    display: grid;
    grid-template-columns: 6ch 1fr auto;
    gap: 8px;
    align-items: center;
    padding: 6px 8px;
    border-radius: var(--cfg-radius-s);
    transition: background 0.08s;
  }
  .ramp__row:hover { background: var(--cfg-surface-2); }
  .ramp__row--missing { opacity: 0.35; }

  .ramp__label {
    display: flex;
    align-items: center;
    gap: 5px;
    flex-shrink: 0;
  }
  .ramp__name { font-family: var(--cfg-mono); font-size: 11.5px; color: var(--cfg-text-muted); }
  .ramp__anchor {
    font-size: 9.5px;
    background: var(--cfg-accent-strong);
    color: #fff;
    border-radius: 999px;
    padding: 1px 6px;
    line-height: 1.6;
    white-space: nowrap;
  }

  .ramp__bars {
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
  }
  .ramp__bar-row {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .ramp__device { font-size: 10px; flex-shrink: 0; line-height: 1; }
  .ramp__track {
    flex: 1;
    height: 6px;
    background: var(--cfg-bg);
    border-radius: 3px;
    overflow: hidden;
    min-width: 0;
  }
  .ramp__fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.18s ease;
    min-width: 2px;
  }
  .ramp__fill--min { background: var(--cfg-accent); opacity: 0.55; }
  .ramp__fill--max { background: var(--cfg-accent-strong); }

  .ramp__val {
    font-family: var(--cfg-mono);
    font-size: 10.5px;
    color: var(--cfg-text-faint);
    white-space: nowrap;
    flex-shrink: 0;
    min-width: 5ch;
    text-align: right;
  }
  .ramp__val i { font-style: normal; font-size: 9.5px; margin-left: 1px; }

  .ramp__sample {
    color: var(--cfg-text);
    line-height: 1;
    overflow: hidden;
    max-block-size: 2.5rem;
    display: flex;
    align-items: center;
    white-space: nowrap;
    flex-shrink: 0;
    width: 3ch;
    justify-content: center;
  }

  /* Narrow: stack inputs above ramp */
  @media (max-width: 780px) {
    .gen__body { grid-template-columns: 1fr; }
    .gen__inputs { border-right: none; border-bottom: 1px solid var(--cfg-border); }
    .ramp__sample { display: none; }
  }
  @media (max-width: 480px) {
    .ctl-grid { grid-template-columns: 1fr; }
  }
</style>
