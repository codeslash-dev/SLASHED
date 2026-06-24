<script>
  import { overrides, ui, patchOverrides, setOverride, dragSetOverride, endDrag } from '../lib/store.svelte.js';
  import { tokenByName } from '../lib/model.js';
  import { sectionTokenNames, smartSettingsFor } from '../lib/domainSettings.js';
  import { buildPreviewDeclarations } from '../lib/preview.js';
  import { getFold, setFold } from '../lib/foldState.js';
  import TokenRow from './TokenRow.svelte';

  const stageStyle = $derived(buildPreviewDeclarations(overrides, ui.previewTheme));

  let { domainId } = $props();
  const sections = $derived(smartSettingsFor(domainId));

  const exists = (name) => tokenByName.has(name);
  const token = (name) => tokenByName.get(name);

  function cleanPatch(section, patch) {
    const names = new Set(sectionTokenNames(section).filter(exists));
    if (patch == null) return Object.fromEntries([...names].map((name) => [name, null]));
    return Object.fromEntries(Object.entries(patch).filter(([name]) => exists(name)));
  }

  function applyPreset(section, preset) {
    const patch = cleanPatch(section, preset.patch);
    if (Object.keys(patch).length) patchOverrides(patch);
  }

  function numericValue(control) {
    const raw = overrides[control.token] ?? token(control.token)?.value ?? '';
    const match = String(raw).match(/-?\d*\.?\d+/);
    const n = match ? parseFloat(match[0]) : NaN;
    return Number.isFinite(n) ? n : control.min;
  }

  function suffix(control) {
    return control.unit ?? '';
  }

  function onSlider(control, value) {
    if (!Number.isFinite(value)) return;
    dragSetOverride(control.token, `${value}${suffix(control)}`);
  }

  function resetSection(section) {
    const patch = cleanPatch(section, null);
    if (Object.keys(patch).length) patchOverrides(patch);
  }

  function gradientValue(name) {
    return overrides[name] ?? token(name)?.value ?? '';
  }

  function setGradient(name, angle, first, second) {
    setOverride(name, `linear-gradient(${angle}deg, ${first} 0%, ${second} 100%)`);
  }

  const gradientAngles = [90, 135, 180, 225];
  const gradientStops = [
    ['var(--sf-color-primary)', 'var(--sf-color-secondary)'],
    ['var(--sf-color-primary)', 'var(--sf-color-tertiary)'],
    ['var(--sf-color-surface)', 'var(--sf-color-bg)'],
    ['var(--sf-color-text)', 'transparent'],
  ];
</script>

{#if sections.length}
  <div class="smart">
    {#each sections as section (section.id)}
      <details
        class="cfg-card smart__section"
        open={getFold(`${domainId}:${section.id}`, false)}
        ontoggle={(e) => setFold(`${domainId}:${section.id}`, e.currentTarget.open)}
      >
        <summary class="smart__summary">
          <span class="smart__chev" aria-hidden="true">›</span>
          <span class="smart__title">{section.title}</span>
          {#if section.hint}<span class="smart__hint">{section.hint}</span>{/if}
        </summary>

        <div class="smart__actions" aria-label="{section.title} actions">
          {#if section.presets?.length}
            <div class="smart__presets" aria-label="{section.title} presets">
              {#each section.presets as preset (preset.label)}
                <button type="button" class="cfg-btn cfg-btn--sm" onclick={() => applyPreset(section, preset)}>{preset.label}</button>
              {/each}
            </div>
          {/if}
          <button type="button" class="cfg-btn cfg-btn--ghost cfg-btn--sm smart__reset" onclick={() => resetSection(section)}>Reset section</button>
        </div>

        {#if section.kind === 'sliders'}
          <div class="smart__sliders">
            {#each section.controls.filter((c) => exists(c.token)) as c (c.token)}
              {@const val = numericValue(c)}
              {@const pct = Math.max(0, Math.min(100, ((val - c.min) / (c.max - c.min)) * 100))}
              <label class="smart-slider">
                <span class="smart-slider__head"><span>{c.label}</span><code>{c.token}</code></span>
                <input
                  type="range"
                  min={c.min}
                  max={c.max}
                  step={c.step}
                  value={val}
                  style:--p="{pct}%"
                  oninput={(e) => onSlider(c, parseFloat(e.currentTarget.value))}
                  onchange={endDrag}
                />
                <span class="smart-slider__num">
                  <input class="cfg-input cfg-input--mono" type="number" min={c.min} max={c.max} step={c.step} value={val} oninput={(e) => onSlider(c, parseFloat(e.currentTarget.value))} onchange={endDrag} />
                  <i>{c.unit}</i>
                </span>
              </label>
            {/each}
          </div>
        {:else if section.kind === 'gradient'}
          <div class="gradient-grid">
            {#each section.tokens.filter(exists) as name (name)}
              <article class="gradient-card">
                <div class="gradient-card__swatch" style={stageStyle} style:background={gradientValue(name)}></div>
                <div class="gradient-card__body">
                  <code>{name}</code>
                  <div class="gradient-card__buttons">
                    {#each gradientAngles as angle (angle)}
                      <button type="button" class="cfg-btn cfg-btn--ghost cfg-btn--sm" onclick={() => setGradient(name, angle, gradientStops[0][0], gradientStops[0][1])}>{angle}°</button>
                    {/each}
                  </div>
                  <div class="gradient-card__buttons">
                    {#each gradientStops as stops, i (i)}
                      <button type="button" class="cfg-btn cfg-btn--sm" onclick={() => setGradient(name, 135, stops[0], stops[1])}>Preset {i + 1}</button>
                    {/each}
                  </div>
                  <TokenRow token={token(name)} label="Raw gradient" help="Power-user CSS value: linear/radial/conic, stops, color-mix(), vars." showRawInfo />
                </div>
              </article>
            {/each}
          </div>
        {:else if section.kind === 'motion'}
          <div class="motion-grid">
            <div class="motion-preview">
              <span style:animation-duration="var(--sf-duration-fast)">fast</span>
              <span style:animation-duration="var(--sf-duration-normal)">normal</span>
              <span style:animation-duration="var(--sf-duration-slow)">slow</span>
            </div>
            <div class="smart__rows">
              {#each [...section.durationTokens, ...section.easingTokens].filter(exists) as name (name)}
                <TokenRow token={token(name)} label={name.replace('--sf-', '').replaceAll('-', ' ')} help="Editable timing token; use raw mode for calc(), var() or cubic-bezier()." showRawInfo />
              {/each}
            </div>
          </div>
        {:else}
          <div class="smart__rows">
            {#each section.controls.filter((c) => exists(c.token)) as c (c.token)}
              <TokenRow token={token(c.token)} label={c.label} help={c.help} showRawInfo />
            {/each}
          </div>
        {/if}
      </details>
    {/each}
  </div>
{/if}

<style>
  .smart { display: flex; flex-direction: column; gap: 16px; }
  .smart__section { overflow: clip; }
  .smart__summary {
    display: flex; align-items: center; gap: 10px; padding: 12px 16px;
    list-style: none; cursor: pointer; background: var(--cfg-surface-2);
    border-bottom: 1px solid var(--cfg-border); flex-wrap: wrap;
  }
  .smart__summary::-webkit-details-marker { display: none; }
  .smart__section[open] .smart__chev { transform: rotate(90deg); }
  .smart__chev { color: var(--cfg-text-faint); transition: transform .14s; }
  .smart__title { font-size: 12.5px; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; }
  .smart__hint { color: var(--cfg-text-faint); font-size: 12px; flex: 1 1 260px; }
  .smart__actions { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 16px; border-bottom: 1px solid var(--cfg-border); flex-wrap: wrap; }
  .smart__reset { margin-left: auto; }
  .smart__presets { display: flex; gap: 8px; flex-wrap: wrap; }
  .smart__rows { display: flex; flex-direction: column; }
  .smart__sliders { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px; padding: 16px; }
  .smart-slider { display: grid; gap: 8px; padding: 12px; border: 1px solid var(--cfg-border); border-radius: var(--cfg-radius-s); background: var(--cfg-bg-2); }
  .smart-slider__head { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; font-size: 12px; }
  .smart-slider__head code { color: var(--cfg-text-faint); font-size: 10.5px; }
  .smart-slider input[type='range'] { width: 100%; accent-color: var(--cfg-accent-strong); }
  .smart-slider__num { display: flex; align-items: center; gap: 6px; }
  .smart-slider__num input { max-width: 96px; }
  .smart-slider__num i { color: var(--cfg-text-faint); font-style: normal; font-size: 12px; }
  .gradient-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: 14px; padding: 16px; }
  .gradient-card { border: 1px solid var(--cfg-border); border-radius: var(--cfg-radius); overflow: clip; background: var(--cfg-bg-2); }
  .gradient-card__swatch { min-height: 90px; border-bottom: 1px solid var(--cfg-border); }
  .gradient-card__body { display: grid; gap: 10px; padding: 12px; }
  .gradient-card__buttons { display: flex; gap: 8px; flex-wrap: wrap; }
  .motion-grid { display: grid; gap: 14px; padding: 16px; }
  .motion-preview { position: relative; display: grid; gap: 10px; padding: 14px; border: 1px solid var(--cfg-border); border-radius: var(--cfg-radius-s); background: var(--cfg-bg-2); overflow: hidden; }
  .motion-preview span { display: block; width: 84px; padding: 5px 8px; border-radius: 999px; background: var(--cfg-accent-strong); color: white; font-size: 11px; animation: smart-move var(--sf-duration-normal, 300ms) var(--sf-ease-in-out, ease-in-out) infinite alternate; }
  @keyframes smart-move { from { transform: translateX(0); } to { transform: translateX(min(260px, 60vw)); } }
</style>
