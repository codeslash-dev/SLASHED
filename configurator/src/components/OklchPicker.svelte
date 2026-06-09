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

  // ── Color conversion utilities ────────────────────────────────────────────

  function gammaExpand(c) {
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }

  function hexToLinearRgb(hex) {
    let h = hex.replace('#', '');
    if (h.length === 3 || h.length === 4) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
    const n = parseInt(h.slice(0, 6), 16);
    return {
      r: gammaExpand(((n >> 16) & 255) / 255),
      g: gammaExpand(((n >>  8) & 255) / 255),
      b: gammaExpand(( n        & 255) / 255),
    };
  }

  function hslToLinearRgb(hDeg, s, lv) {
    s /= 100; lv /= 100;
    const k = (n) => (n + hDeg / 30) % 12;
    const a = s * Math.min(lv, 1 - lv);
    const f = (n) => lv - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return { r: gammaExpand(f(0)), g: gammaExpand(f(8)), b: gammaExpand(f(4)) };
  }

  function linearRgbToOklab({ r, g, b }) {
    const l = 0.4122214708*r + 0.5363325363*g + 0.0514459929*b;
    const m = 0.2119034982*r + 0.6806995451*g + 0.1073969566*b;
    const s = 0.0883024619*r + 0.2817188376*g + 0.6299787005*b;
    const l_ = Math.cbrt(l), m_ = Math.cbrt(m), s_ = Math.cbrt(s);
    return {
      L:  0.2104542553*l_ + 0.7936177850*m_ - 0.0040720468*s_,
      a:  1.9779984951*l_ - 2.4285922050*m_ + 0.4505937099*s_,
      b:  0.0259040371*l_ + 0.7827717662*m_ - 0.8086757660*s_,
    };
  }

  function oklabToOklch({ L, a, b }) {
    const C = Math.sqrt(a*a + b*b);
    let H = (Math.atan2(b, a) * 180) / Math.PI;
    if (H < 0) H += 360;
    return { L, C, H };
  }

  function applyOklch({ L, C, H }) {
    mode = 'oklch';
    l = Math.max(0, Math.min(1, L));
    c = Math.max(0, Math.min(0.4, C));
    h = ((H % 360) + 360) % 360;
  }

  // ── Parser ────────────────────────────────────────────────────────────────

  function parse(v) {
    if (!v) return;
    const s = v.trim();

    const oklchM = /^oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)/.exec(s);
    if (oklchM) {
      mode = 'oklch';
      const rawL = oklchM[1];
      l = Math.min(1, rawL.endsWith('%') ? parseFloat(rawL) / 100 : parseFloat(rawL));
      c = Math.min(parseFloat(oklchM[2]), 0.4);
      h = parseFloat(oklchM[3]);
      return;
    }

    const oklabM = /^oklab\(\s*([\d.]+%?)\s+([-\d.]+)\s+([-\d.]+)/.exec(s);
    if (oklabM) {
      mode = 'oklab';
      const rawL = oklabM[1];
      ll = Math.min(1, rawL.endsWith('%') ? parseFloat(rawL) / 100 : parseFloat(rawL));
      la = Math.max(-0.4, Math.min(0.4, parseFloat(oklabM[2])));
      lb = Math.max(-0.4, Math.min(0.4, parseFloat(oklabM[3])));
      return;
    }

    // hex: #rgb #rgba #rrggbb #rrggbbaa
    if (/^#[0-9a-fA-F]{3,8}$/.test(s)) {
      try { applyOklch(oklabToOklch(linearRgbToOklab(hexToLinearRgb(s)))); } catch {}
      return;
    }

    // hsl() / hsla() — legacy comma or modern space syntax
    const hslM = /^hsla?\(\s*([\d.]+)(?:deg|rad|turn|grad)?\s*[, ]\s*([\d.]+)%?\s*[, ]\s*([\d.]+)%?/.exec(s);
    if (hslM) {
      try { applyOklch(oklabToOklch(linearRgbToOklab(hslToLinearRgb(parseFloat(hslM[1]), parseFloat(hslM[2]), parseFloat(hslM[3]))))); } catch {}
    }
    // Other (var(), light-dark(), etc.) — leave sliders at current values.
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
