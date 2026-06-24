<script>
  import { BRAND_COLOR_KEYS } from '../../lib/brandColors.js';
  import BrandColorRow from '../BrandColorRow.svelte';
  import ColorAssignments from '../ColorAssignments.svelte';
  import ShadeRamp from '../ShadeRamp.svelte';
  import StudioFrame from './StudioFrame.svelte';
  const main = BRAND_COLOR_KEYS.filter((c) => ['base', 'neutral', 'primary', 'secondary', 'tertiary', 'action'].includes(c.key));
  const status = BRAND_COLOR_KEYS.filter((c) => c.group === 'status');
</script>

<StudioFrame title="Color Studio" description="Najpierw ustaw źródła marki, potem sprawdź semantic roles, statusy, shade ramp i realne użycie koloru." tone="color">
  <div class="color-studio">
    <section class="usage"><button>Primary button</button><div><strong>Surface card</strong><p>Text, link, border and subtle background preview.</p></div><mark>Status message</mark></section>
    <details open><summary>Main colors</summary><div class="rows">{#each main as {key,label} (key)}<BrandColorRow colorKey={key} {label} />{/each}</div></details>
    <details><summary>Semantic colors</summary><div class="rows">{#each status as {key,label} (key)}<BrandColorRow colorKey={key} {label} />{/each}</div></details>
    <details><summary>Semantic role preview</summary><ColorAssignments /></details>
    <details><summary>Generated shade ramp</summary><ShadeRamp /></details>
  </div>
</StudioFrame>
<style>
  .color-studio{display:grid;gap:12px}.usage{display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:center;padding:14px;border-radius:14px;background:var(--sf-color-raised);border:1px solid var(--sf-color-border)}.usage button{border:0;border-radius:999px;background:var(--sf-color-primary);color:white;padding:10px 14px}.usage p{margin:2px 0 0;color:var(--sf-color-text--muted)}mark{border-radius:999px;background:var(--sf-color-warning-subtle);color:var(--sf-color-warning);padding:7px 10px}details{border:1px solid var(--cfg-border);border-radius:var(--cfg-radius);background:var(--cfg-surface);overflow:clip}summary{padding:12px 14px;cursor:pointer;font-weight:800;text-transform:uppercase;font-size:12px;letter-spacing:.06em;background:var(--cfg-surface-2)}.rows{display:grid}@media(max-width:640px){.usage{grid-template-columns:1fr}}
</style>
