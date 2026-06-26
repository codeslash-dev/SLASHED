<script>
  import { overrides, ui, patchOverrides, setOverride, dragSetOverride, endDrag } from '../../lib/store.svelte.js';
  import { BRAND_COLOR_KEYS } from '../../lib/brandColors.js';
  import { tokenByName } from '../../lib/model.js';
  import { smartSettingsFor } from '../../lib/domainSettings.js';
  import { buildPreviewDeclarations } from '../../lib/preview.js';
  import BrandColorRow from '../BrandColorRow.svelte';
  import ColorAssignments from '../ColorAssignments.svelte';
  import FriendlyControl from '../FriendlyControl.svelte';
  import ShadeRamp from '../ShadeRamp.svelte';
  import TokenRow from '../TokenRow.svelte';
  import StudioFrame from './StudioFrame.svelte';

  const main = BRAND_COLOR_KEYS.filter((c) => c.group === 'brand');
  const status = BRAND_COLOR_KEYS.filter((c) => c.group === 'status');
  const tuning = [
    '--sf-contrast-bias',
    '--sf-contrast-threshold',
    '--sf-focus-ring-width',
    '--sf-focus-ring-offset',
  ].map((name) => tokenByName.get(name)).filter(Boolean);
  const panels = [
    { id: 'main-colors', label: 'Main colors' },
    { id: 'semantic-colors', label: 'Semantic colors' },
    { id: 'gradients', label: 'Gradients' },
    { id: 'shade-curve', label: 'Shade curve' },
    { id: 'contrast', label: 'Contrast' },
    { id: 'assignments', label: 'Assignments' },
  ];
  const mainColorItems = [
    { key: 'primary', label: 'Primary' },
    { key: 'secondary', label: 'Secondary' },
    { key: 'tertiary', label: 'Tertiary' },
    { key: 'action', label: 'Accent/Action' },
    { key: 'base', label: 'Base' },
    { key: 'neutral', label: 'Neutral' },
  ].filter((item) => main.some((color) => color.key === item.key));

  const stageStyle = $derived(buildPreviewDeclarations(overrides, ui.previewTheme));
  const paletteCurve = smartSettingsFor('colors').find((section) => section.id === 'palette-curve');
  const gradientBuilder = smartSettingsFor('colors').find((section) => section.id === 'gradient-builder');
  const exists = (name) => tokenByName.has(name);
  const token = (name) => tokenByName.get(name);

  let activePanel = $state('main-colors');
  let activeColor = $state('primary');
  let openColors = $state({ primary: true });

  function toggleColor(key) {
    activeColor = key;
    openColors = { ...openColors, [key]: !openColors[key] };
  }

  function cleanPatch(section, patch) {
    const names = new Set(section.controls.map((control) => control.token).filter(exists));
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

  function onSlider(control, value) {
    if (Number.isFinite(value)) dragSetOverride(control.token, `${value}${control.unit ?? ''}`);
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

<StudioFrame title="Color Studio" description="Set brand sources first, then verify semantic roles, status colors, shade ramp, contrast, and real usage." tone="color">
  <div class="color-studio">
    <nav class="studio-nav" aria-label="Color Studio panels">
      {#each panels as panel (panel.id)}
        <button type="button" class:active={activePanel === panel.id} onclick={() => (activePanel = panel.id)}>{panel.label}</button>
      {/each}
    </nav>

    <section class="usage" aria-label="Usage preview">
      <button>Primary button</button>
      <div><strong>Surface card</strong><p>Text, link, border and subtle background preview.</p><span role="link" tabindex="0" class="usage__link">Example link</span></div>
      <mark>Status message</mark>
    </section>

    {#if activePanel === 'main-colors'}
      <section class="main-colors" aria-label="Main colors">
        {#each mainColorItems as { key, label } (key)}
          <article class="color-item" class:color-item--active={activeColor === key}>
            <button type="button" class="color-item__summary" aria-expanded={!!openColors[key]} onclick={() => toggleColor(key)}>
              <span class="color-item__toggle" aria-hidden="true"></span>
              <span class="color-item__swatch" style:background={`var(--sf-color-${key})`}></span>
              <span>{label}</span>
              <span class="color-item__chev" aria-hidden="true">›</span>
            </button>
            {#if openColors[key]}
              <BrandColorRow colorKey={key} {label} />
              <ShadeRamp colorKey={key} showIntro={false} />
            {/if}
          </article>
        {/each}
      </section>
    {:else if activePanel === 'semantic-colors'}
      <section class="rows">{#each status as {key,label} (key)}<BrandColorRow colorKey={key} {label} />{/each}</section>
    {:else if activePanel === 'gradients'}
      <section class="gradient-grid">
        {#each gradientBuilder.tokens.filter(exists) as name (name)}
          <article class="gradient-card">
            <div class="gradient-card__swatch" style={stageStyle} style:background={gradientValue(name)}></div>
            <div class="gradient-card__body"><code>{name}</code><div class="gradient-card__buttons">{#each gradientAngles as angle (angle)}<button type="button" class="cfg-btn cfg-btn--ghost cfg-btn--sm" onclick={() => setGradient(name, angle, gradientStops[0][0], gradientStops[0][1])}>{angle}°</button>{/each}</div><div class="gradient-card__buttons">{#each gradientStops as stops, i (i)}<button type="button" class="cfg-btn cfg-btn--sm" onclick={() => setGradient(name, 135, stops[0], stops[1])}>Preset {i + 1}</button>{/each}</div><TokenRow token={token(name)} label="Raw gradient" help="Power-user CSS value: linear/radial/conic, stops, color-mix(), vars." showRawInfo forceEditable /></div>
          </article>
        {/each}
      </section>
    {:else if activePanel === 'shade-curve'}
      <section class="curve-panel">
        <div class="curve-panel__actions">{#each paletteCurve.presets as preset (preset.label)}<button type="button" class="cfg-btn cfg-btn--sm" onclick={() => applyPreset(paletteCurve, preset)}>{preset.label}</button>{/each}</div>
        <div class="curve-grid">{#each paletteCurve.controls.filter((c) => exists(c.token)) as c (c.token)}{@const val = numericValue(c)}<label class="curve-slider"><span><b>{c.label}</b><code>{c.token}</code></span><input type="range" min={c.min} max={c.max} step={c.step} value={val} oninput={(e) => onSlider(c, parseFloat(e.currentTarget.value))} onchange={endDrag} /><em>{val}{c.unit}</em></label>{/each}</div>
      </section>
    {:else if activePanel === 'contrast'}
      <section class="rows">{#each tuning as token (token.name)}<FriendlyControl {token} showToken={ui.showTokens} />{/each}</section>
    {:else if activePanel === 'assignments'}
      <ColorAssignments />
    {/if}
  </div>
</StudioFrame>

<style>
  .color-studio { display: grid; gap: 12px; }
  .studio-nav { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; }
  .studio-nav button { border: 1px solid var(--cfg-border); border-radius: var(--cfg-radius-s); background: var(--cfg-bg-2); color: var(--cfg-text-muted); padding: 10px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; cursor: pointer; }
  .studio-nav button.active { background: var(--cfg-accent-strong); color: white; border-color: transparent; }
  .usage { display: grid; grid-template-columns: auto 1fr auto; gap: 12px; align-items: center; padding: 14px; border-radius: 14px; background: var(--sf-color-raised); border: 1px solid var(--sf-color-border); }
  .usage button { border: 0; border-radius: 999px; background: var(--sf-color-primary); color: var(--sf-color-primary-text, white); padding: 10px 14px; }
  .usage p { margin: 2px 0 0; color: var(--sf-color-text--muted); }
  .usage__link { color: var(--sf-color-link); cursor: pointer; text-decoration: underline; }
  mark { border-radius: 999px; background: var(--sf-color-warning-subtle); color: var(--sf-color-warning); padding: 7px 10px; }
  .main-colors, .rows { display: grid; gap: 10px; }
  .color-item { border: 1px solid var(--cfg-border); border-radius: var(--cfg-radius); background: var(--cfg-surface); overflow: clip; }
  .color-item--active { border-color: color-mix(in oklab, var(--cfg-accent) 65%, var(--cfg-border)); }
  .color-item__summary { width: 100%; display: grid; grid-template-columns: 34px 34px 1fr auto; gap: 10px; align-items: center; padding: 12px; border: 0; background: var(--cfg-surface-2); color: inherit; text-align: left; font-weight: 850; cursor: pointer; }
  .color-item__toggle { inline-size: 28px; block-size: 16px; border-radius: 999px; background: var(--cfg-accent-strong); box-shadow: inset 13px 0 0 white; }
  .color-item__swatch { inline-size: 30px; block-size: 30px; border-radius: 9px; border: 1px solid var(--cfg-border-strong); }
  .color-item__chev { transition: transform .14s; }
  .color-item__summary[aria-expanded='true'] .color-item__chev { transform: rotate(90deg); }
  .gradient-grid, .curve-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: 14px; }
  .gradient-card, .curve-slider { border: 1px solid var(--cfg-border); border-radius: var(--cfg-radius); overflow: clip; background: var(--cfg-bg-2); }
  .gradient-card__swatch { min-height: 90px; border-bottom: 1px solid var(--cfg-border); }
  .gradient-card__body, .curve-slider { display: grid; gap: 10px; padding: 12px; }
  .gradient-card__buttons, .curve-panel__actions { display: flex; gap: 8px; flex-wrap: wrap; }
  .curve-panel { display: grid; gap: 12px; }
  .curve-slider span { display: flex; justify-content: space-between; gap: 10px; font-size: 12px; }
  .curve-slider code { color: var(--cfg-text-faint); font-size: 10px; }
  .curve-slider input { width: 100%; accent-color: var(--cfg-accent-strong); }
  .curve-slider em { color: var(--cfg-text-muted); font-style: normal; }
  @media (max-width: 900px) { .studio-nav { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 640px) { .usage, .studio-nav { grid-template-columns: 1fr; } }
</style>
