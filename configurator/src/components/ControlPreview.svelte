<script>
  import { overrides, ui } from '../lib/store.svelte.js';
  import { buildPreviewDeclarations } from '../lib/preview.js';
  let { token, value = '', type = 'text', label = '' } = $props();
  const active = $derived(value || overrides[token?.name] || token?.value || '');
  const stageStyle = $derived(buildPreviewDeclarations(overrides, ui.previewTheme));
  const LABELS = {
    color: 'colour', font: 'typeface', radius: 'corner', shadow: 'elevation',
    motion: 'timing', 'line-height': 'leading', wrap: 'text wrap',
    opacity: 'opacity', gradient: 'gradient', border: 'border style',
    media: 'object fit', scale: 'scale', spacing: 'size',
  };
  const caption = $derived(LABELS[type] ?? type);
</script>

<div class="ctrl-preview" style={stageStyle} title={token?.name || label}>
  {#if type === 'color'}
    <div class="ctrl-preview__color" style:--sample={active}>
      <span></span><strong>Aa</strong><em>Button</em>
    </div>
  {:else if type === 'font'}
    <p class="ctrl-preview__font" style:font-family={active}>Ag — The quick brown fox</p>
  {:else if type === 'radius'}
    <div class="ctrl-preview__radius" style:border-radius={active || 'var(--sf-radius-m)'}></div>
  {:else if type === 'shadow'}
    <div class="ctrl-preview__shadow" style:box-shadow={active || 'var(--sf-shadow-m)'}></div>
  {:else if type === 'motion'}
    <div class="ctrl-preview__motion"><span style:animation-duration={active || 'var(--sf-duration-normal)'}>motion</span></div>
  {:else if type === 'line-height'}
    <p class="ctrl-preview__lines" style:line-height={active || '1.5'}>Readable rhythm<br />across multiple<br />text lines.</p>
  {:else if type === 'wrap'}
    <p class="ctrl-preview__wrap" style:text-wrap={active || 'balance'}>A heading wraps cleanly in a narrow preview.</p>
  {:else if type === 'opacity'}
    <div class="ctrl-preview__opacity"><span style:opacity={active || '.5'}></span></div>
  {:else if type === 'gradient'}
    <div class="ctrl-preview__gradient" style:--scrim={active}></div>
  {:else if type === 'border'}
    <div class="ctrl-preview__border" style:border-style={active || 'solid'}></div>
  {:else if type === 'media'}
    <div class="ctrl-preview__media"><span style:object-fit={active || 'cover'}></span></div>
  {:else if type === 'scale'}
    <div class="ctrl-preview__scale"><span style:transform={`scale(${active || 1})`}></span></div>
  {:else}
    <div class="ctrl-preview__spacing"><span style:inline-size={active || '40%'}></span></div>
  {/if}
</div>
<p class="ctrl-preview__cap">{caption}</p>

<style>
  .ctrl-preview { min-height: 54px; border: 1px solid var(--cfg-border); border-radius: var(--cfg-radius-s); background: var(--cfg-bg-2); padding: 10px; overflow: hidden; color: var(--sf-color-text, var(--cfg-text)); }
  .ctrl-preview__color { display: grid; grid-template-columns: 38px 1fr auto; gap: 8px; align-items: center; }
  .ctrl-preview__color span { inline-size: 38px; block-size: 34px; border-radius: 8px; background: var(--sample, var(--sf-color-primary)); border: 1px solid color-mix(in oklab, var(--sample, var(--sf-color-primary)), #000 20%); }
  .ctrl-preview__color strong { color: var(--sample, var(--sf-color-primary)); }
  .ctrl-preview__color em { font-style: normal; color: white; background: var(--sample, var(--sf-color-primary)); border-radius: 999px; padding: 4px 9px; font-size: 11px; }
  .ctrl-preview__font { margin: 0; font-size: 17px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ctrl-preview__radius, .ctrl-preview__shadow { min-height: 36px; background: linear-gradient(135deg, var(--cfg-surface), var(--cfg-surface-3)); border: 1px solid var(--cfg-border-strong); }
  .ctrl-preview__motion { min-height: 34px; position: relative; }
  .ctrl-preview__motion span { display: inline-block; padding: 5px 10px; border-radius: 999px; background: var(--cfg-accent-strong); color: #fff; font-size: 11px; animation: cp-move var(--sf-duration-normal, 300ms) var(--sf-ease-in-out, ease-in-out) infinite alternate; }
  .ctrl-preview__lines, .ctrl-preview__wrap { margin: 0; font-size: 12px; max-inline-size: 190px; }
  .ctrl-preview__wrap { font-size: 18px; font-weight: 800; }
  .ctrl-preview__opacity span { display:block; block-size: 34px; border-radius: 8px; background: var(--cfg-accent-strong); }
  .ctrl-preview__gradient { min-height: 38px; border-radius: 9px; background: linear-gradient(var(--scrim, to top), oklch(0 0 0 / .62), transparent), linear-gradient(135deg, var(--cfg-accent), var(--cfg-accent-soft)); }
  .ctrl-preview__border { min-height: 36px; border: 3px solid var(--cfg-accent-strong); border-radius: 10px; background: var(--cfg-surface); }
  .ctrl-preview__media { min-height: 38px; border-radius: 10px; overflow: hidden; background: var(--cfg-surface-3); }
  .ctrl-preview__media span { display:block; inline-size:100%; block-size:42px; background: radial-gradient(circle at 30% 25%, var(--cfg-accent), transparent 28%), linear-gradient(135deg, var(--cfg-accent-soft), var(--cfg-surface-3)); }
  .ctrl-preview__scale { min-height: 38px; display:grid; place-items:center; }
  .ctrl-preview__scale span { inline-size:30px; block-size:30px; border-radius:8px; background:var(--cfg-accent-strong); }
  .ctrl-preview__spacing { min-height: 34px; display:flex; align-items:center; }
  .ctrl-preview__spacing span { display:block; block-size: 14px; max-inline-size:100%; min-inline-size:12px; border-radius:999px; background: var(--cfg-accent-strong); }
  .ctrl-preview__cap { margin: 2px 0 0; font-size: 10px; text-transform: uppercase; letter-spacing: .06em; color: var(--cfg-text-faint); text-align: center; }
  @keyframes cp-move { to { transform: translateX(min(120px, 35vw)); } }
</style>
