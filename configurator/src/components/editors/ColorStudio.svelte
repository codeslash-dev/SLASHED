<script>
  import { BRAND_COLOR_KEYS } from '../../lib/brandColors.js';
  import { tokenByName } from '../../lib/model.js';
  import BrandColorRow from '../BrandColorRow.svelte';
  import ColorAssignments from '../ColorAssignments.svelte';
  import FriendlyControl from '../FriendlyControl.svelte';
  import ShadeRamp from '../ShadeRamp.svelte';
  import StudioFrame from './StudioFrame.svelte';

  const main = BRAND_COLOR_KEYS.filter((c) => c.group === 'brand');
  const status = BRAND_COLOR_KEYS.filter((c) => c.group === 'status');
  const tuning = ['--sf-contrast-bias', '--sf-contrast-threshold', '--sf-palette-mix-50', '--sf-palette-mix-500', '--sf-palette-mix-950']
    .map((name) => tokenByName.get(name)).filter(Boolean);
</script>

<StudioFrame title="Color Studio" description="Najpierw ustaw źródła marki, potem sprawdź semantic roles, statusy, shade ramp, kontrast i realne użycie koloru." tone="color">
  <div class="color-studio">
    <section class="usage">
      <button>Primary button</button>
      <div><strong>Surface card</strong><p>Text, link, border and subtle background preview.</p><a href="/">Example link</a></div>
      <mark>Status message</mark>
    </section>

    <section class="swatches" aria-label="Palette overview">
      {#each main as { key, label } (key)}<span style:background={`var(--sf-color-${key})`} title={label}></span>{/each}
      {#each status as { key, label } (key)}<span style:background={`var(--sf-color-${key})`} title={label}></span>{/each}
    </section>

    <details open><summary>Main colors</summary><div class="rows">{#each main as {key,label} (key)}<BrandColorRow colorKey={key} {label} />{/each}</div></details>
    <details><summary>Semantic colors</summary><div class="rows">{#each status as {key,label} (key)}<BrandColorRow colorKey={key} {label} />{/each}</div></details>
    <details><summary>Contrast & palette tuning</summary><div class="rows">{#each tuning as token (token.name)}<FriendlyControl {token} showToken />{/each}</div></details>
    <details><summary>Semantic role preview</summary><ColorAssignments /></details>
    <details><summary>Generated shade ramp</summary><ShadeRamp /></details>
  </div>
</StudioFrame>

<style>
  .color-studio { display: grid; gap: 12px; }
  .usage { display: grid; grid-template-columns: auto 1fr auto; gap: 12px; align-items: center; padding: 14px; border-radius: 14px; background: var(--sf-color-raised); border: 1px solid var(--sf-color-border); }
  .usage button { border: 0; border-radius: 999px; background: var(--sf-color-primary); color: var(--sf-color-primary-text, white); padding: 10px 14px; }
  .usage p { margin: 2px 0 0; color: var(--sf-color-text--muted); }
  .usage a { color: var(--sf-color-link); }
  mark { border-radius: 999px; background: var(--sf-color-warning-subtle); color: var(--sf-color-warning); padding: 7px 10px; }
  .swatches { display: grid; grid-template-columns: repeat(10, 1fr); gap: 6px; padding: 10px; border: 1px solid var(--cfg-border); border-radius: var(--cfg-radius); background: var(--cfg-bg-2); }
  .swatches span { min-height: 38px; border-radius: 9px; border: 1px solid color-mix(in oklab, currentColor 15%, transparent); }
  details { border: 1px solid var(--cfg-border); border-radius: var(--cfg-radius); background: var(--cfg-surface); overflow: clip; }
  summary { padding: 12px 14px; cursor: pointer; font-weight: 800; text-transform: uppercase; font-size: 12px; letter-spacing: .06em; background: var(--cfg-surface-2); }
  .rows { display: grid; }
  @media (max-width: 640px) { .usage { grid-template-columns: 1fr; } .swatches { grid-template-columns: repeat(5, 1fr); } }
</style>
