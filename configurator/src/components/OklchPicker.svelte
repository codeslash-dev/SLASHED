<script>
  import { onMount } from 'svelte';

  let {
    value = '',
    top = 0,
    left = 0,
    triggerEl = null,
    onpick,
    onclose,
  } = $props();

  let mode = $state('oklch');
  // oklch channels
  let l = $state(0.6);
  let c = $state(0.15);
  let h = $state(220);
  // oklab channels
  let ll = $state(0.6);
  let la = $state(0.0);
  let lb = $state(0.0);

  // Last value emitted by this picker — used to skip re-parsing our own output.
  let emittedValue = '';

  function fmt(n, d = 3) {
    return parseFloat(n.toFixed(d)).toString();
  }

  function parse(v) {
    if (!v) return;
    const s = v.trim();
    const oklchM = /^oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)/.exec(s);
    if (oklchM) {
      mode = 'oklch';
      const rawL = oklchM[1];
      l = rawL.endsWith('%') ? parseFloat(rawL) / 100 : parseFloat(rawL);
      c = Math.min(parseFloat(oklchM[2]), 0.4);
      h = parseFloat(oklchM[3]);
      return;
    }
    const oklabM = /^oklab\(\s*([\d.]+%?)\s+([-\d.]+)\s+([-\d.]+)/.exec(s);
    if (oklabM) {
      mode = 'oklab';
      const rawL = oklabM[1];
      ll = rawL.endsWith('%') ? parseFloat(rawL) / 100 : parseFloat(rawL);
      la = Math.max(-0.4, Math.min(0.4, parseFloat(oklabM[2])));
      lb = Math.max(-0.4, Math.min(0.4, parseFloat(oklabM[3])));
    }
    // Hex / other formats: leave sliders at current values (user adjusts from there).
  }

  $effect(() => {
    const v = value;
    if (v !== emittedValue) parse(v);
  });

  const cssColor = $derived(
    mode === 'oklch'
      ? `oklch(${fmt(l)} ${fmt(c)} ${fmt(h, 1)})`
      : `oklab(${fmt(ll)} ${fmt(la)} ${fmt(lb)})`
  );

  const lBg = $derived(
    mode === 'oklch'
      ? `linear-gradient(to right,oklch(0 ${fmt(c)} ${fmt(h, 1)}),oklch(1 ${fmt(c)} ${fmt(h, 1)}))`
      : `linear-gradient(to right,oklab(0 ${fmt(la)} ${fmt(lb)}),oklab(1 ${fmt(la)} ${fmt(lb)}))`
  );

  const cBg = $derived(
    `linear-gradient(to right,oklch(${fmt(l)} 0 ${fmt(h, 1)}),oklch(${fmt(l)} 0.4 ${fmt(h, 1)}))`
  );

  const hBg = $derived.by(() => {
    const chroma = fmt(Math.max(c, 0.12));
    const stops = [];
    for (let i = 0; i <= 12; i++) {
      stops.push(`oklch(${fmt(l)} ${chroma} ${(30 * i).toFixed(0)})`);
    }
    return `linear-gradient(to right,${stops.join(',')})`;
  });

  const aBg = $derived(
    `linear-gradient(to right,oklab(${fmt(ll)} -0.4 ${fmt(lb)}),oklab(${fmt(ll)} 0.4 ${fmt(lb)}))`
  );

  const bBg = $derived(
    `linear-gradient(to right,oklab(${fmt(ll)} ${fmt(la)} -0.4),oklab(${fmt(ll)} ${fmt(la)} 0.4))`
  );

  function emit() {
    emittedValue = cssColor;
    onpick?.(cssColor);
  }

  function switchMode(m) {
    if (m !== mode) {
      mode = m;
      emit();
    }
  }

  let el = $state(null);

  function onDocPointer(e) {
    const insidePicker = el?.contains(e.target);
    const onTrigger = triggerEl?.contains(e.target);
    if (!insidePicker && !onTrigger) onclose?.();
  }

  function onKey(e) {
    if (e.key === 'Escape') onclose?.();
  }

  onMount(() => {
    document.addEventListener('pointerdown', onDocPointer, true);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDocPointer, true);
      document.removeEventListener('keydown', onKey);
    };
  });
</script>

<div
  class="oklch"
  bind:this={el}
  style:top="{top}px"
  style:left="{left}px"
  role="dialog"
  aria-label="Color picker"
>
  <div class="oklch__preview" style:--pc={cssColor}></div>

  <div class="oklch__modes">
    <button
      class="oklch__mode"
      class:oklch__mode--on={mode === 'oklch'}
      onclick={() => switchMode('oklch')}
    >oklch</button>
    <button
      class="oklch__mode"
      class:oklch__mode--on={mode === 'oklab'}
      onclick={() => switchMode('oklab')}
    >oklab</button>
  </div>

  {#if mode === 'oklch'}
    <label class="oklch__row">
      <span class="oklch__ch">L</span>
      <input class="oklch__slider" type="range" min="0" max="1" step="0.001"
        bind:value={l} oninput={emit} style:--trk={lBg} />
      <input class="oklch__num" type="number" min="0" max="1" step="0.001"
        bind:value={l} oninput={emit} />
    </label>
    <label class="oklch__row">
      <span class="oklch__ch">C</span>
      <input class="oklch__slider" type="range" min="0" max="0.4" step="0.001"
        bind:value={c} oninput={emit} style:--trk={cBg} />
      <input class="oklch__num" type="number" min="0" max="0.4" step="0.001"
        bind:value={c} oninput={emit} />
    </label>
    <label class="oklch__row">
      <span class="oklch__ch">H</span>
      <input class="oklch__slider" type="range" min="0" max="360" step="0.5"
        bind:value={h} oninput={emit} style:--trk={hBg} />
      <input class="oklch__num" type="number" min="0" max="360" step="0.5"
        bind:value={h} oninput={emit} />
    </label>
  {:else}
    <label class="oklch__row">
      <span class="oklch__ch">L</span>
      <input class="oklch__slider" type="range" min="0" max="1" step="0.001"
        bind:value={ll} oninput={emit} style:--trk={lBg} />
      <input class="oklch__num" type="number" min="0" max="1" step="0.001"
        bind:value={ll} oninput={emit} />
    </label>
    <label class="oklch__row">
      <span class="oklch__ch">a</span>
      <input class="oklch__slider" type="range" min="-0.4" max="0.4" step="0.001"
        bind:value={la} oninput={emit} style:--trk={aBg} />
      <input class="oklch__num" type="number" min="-0.4" max="0.4" step="0.001"
        bind:value={la} oninput={emit} />
    </label>
    <label class="oklch__row">
      <span class="oklch__ch">b</span>
      <input class="oklch__slider" type="range" min="-0.4" max="0.4" step="0.001"
        bind:value={lb} oninput={emit} style:--trk={bBg} />
      <input class="oklch__num" type="number" min="-0.4" max="0.4" step="0.001"
        bind:value={lb} oninput={emit} />
    </label>
  {/if}

  <code class="oklch__out">{cssColor}</code>
</div>

<style>
  .oklch {
    position: fixed;
    z-index: 9999;
    background: var(--cfg-surface-2);
    border: 1px solid var(--cfg-border-strong);
    border-radius: var(--cfg-radius);
    padding: 12px;
    width: 288px;
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .oklch__preview {
    height: 40px;
    border-radius: var(--cfg-radius-s);
    border: 1px solid var(--cfg-border);
    background-image:
      linear-gradient(var(--pc, transparent), var(--pc, transparent)),
      conic-gradient(#444 25%, #2a2a2a 0 50%, #444 0 75%, #2a2a2a 0);
    background-size: cover, 12px 12px;
  }

  .oklch__modes {
    display: flex;
    gap: 4px;
  }

  .oklch__mode {
    flex: 1;
    padding: 4px 8px;
    font-size: 11px;
    font-family: var(--cfg-mono);
    background: var(--cfg-bg);
    border: 1px solid var(--cfg-border);
    border-radius: var(--cfg-radius-s);
    color: var(--cfg-text-muted);
    cursor: pointer;
    transition: background 0.1s, color 0.1s;
  }

  .oklch__mode--on {
    background: var(--cfg-accent);
    border-color: var(--cfg-accent);
    color: #fff;
  }

  .oklch__row {
    display: grid;
    grid-template-columns: 14px 1fr 58px;
    gap: 8px;
    align-items: center;
  }

  .oklch__ch {
    font-family: var(--cfg-mono);
    font-size: 11px;
    color: var(--cfg-text-faint);
    text-align: center;
  }

  .oklch__slider {
    -webkit-appearance: none;
    appearance: none;
    height: 12px;
    border-radius: 6px;
    background: var(--trk, #555);
    outline: none;
    cursor: pointer;
    border: 1px solid rgba(0, 0, 0, 0.15);
  }

  .oklch__slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #fff;
    border: 2px solid rgba(0, 0, 0, 0.25);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
    cursor: pointer;
  }

  .oklch__slider::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #fff;
    border: 2px solid rgba(0, 0, 0, 0.25);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
    cursor: pointer;
  }

  .oklch__num {
    font-family: var(--cfg-mono);
    font-size: 11px;
    background: var(--cfg-bg);
    border: 1px solid var(--cfg-border);
    border-radius: var(--cfg-radius-s);
    color: var(--cfg-text);
    padding: 3px 5px;
    width: 100%;
    text-align: right;
  }

  .oklch__num:focus {
    outline: 2px solid var(--cfg-accent);
    outline-offset: -1px;
  }

  .oklch__out {
    font-family: var(--cfg-mono);
    font-size: 11px;
    color: var(--cfg-text-faint);
    word-break: break-all;
    padding: 5px 7px;
    background: var(--cfg-bg);
    border-radius: var(--cfg-radius-s);
    border: 1px solid var(--cfg-border);
    line-height: 1.4;
  }
</style>
