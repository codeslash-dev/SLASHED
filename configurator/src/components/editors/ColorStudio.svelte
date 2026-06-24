<script>
  import { BRAND_COLOR_KEYS } from '../../lib/brandColors.js';
  import { overrides } from '../../lib/store.svelte.js';
  import StudioFrame from './StudioFrame.svelte';
  const colors = BRAND_COLOR_KEYS.filter(c => ['base','neutral','primary','secondary','tertiary','action','success','warning','info','danger'].includes(c.key));
  const value = (key) => overrides[`--sf-color-${key}-source-light`] || `var(--sf-color-${key})`;
</script>
<StudioFrame title="Color Studio" description="Paleta inspirowana panelowym workflow, ale z podglądem realnych ról: tekst, button, card, status i border." tone="color">
  <div class="palette">
    {#each colors as c (c.key)}<article style:--c={value(c.key)}><span></span><b>{c.label}</b><em>Aa</em></article>{/each}
  </div>
  <div class="usage"><button>Primary button</button><div><strong>Surface card</strong><p>Text, link, border and subtle background preview.</p></div><mark>Status message</mark></div>
</StudioFrame>
<style>
  .palette{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px}.palette article{display:grid;grid-template-columns:32px 1fr auto;align-items:center;gap:8px;padding:10px;border:1px solid var(--cfg-border);border-radius:12px;background:var(--cfg-bg-2)}.palette span{width:32px;height:32px;border-radius:50%;background:var(--c);border:1px solid color-mix(in oklab,var(--c),#000 20%)}.palette b{font-size:12px}.palette em{font-style:normal;color:var(--c);font-weight:800}.usage{display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:center;margin-top:14px;padding:14px;border-radius:14px;background:var(--sf-color-raised);border:1px solid var(--sf-color-border)}.usage button{border:0;border-radius:999px;background:var(--sf-color-primary);color:white;padding:10px 14px}.usage p{margin:2px 0 0;color:var(--sf-color-text--muted)}mark{border-radius:999px;background:var(--sf-color-warning-subtle);color:var(--sf-color-warning);padding:7px 10px}@media(max-width:640px){.usage{grid-template-columns:1fr}}
</style>
