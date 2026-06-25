<script>
  import { BRAND_COLOR_KEYS } from '../../lib/brandColors.js';
  import { COLOR_ROLE_GROUPS } from '../../lib/colorRoles.js';
  import { tokenByName } from '../../lib/model.js';
  import BrandColorRow from '../BrandColorRow.svelte';
  import ColorAssignments from '../ColorAssignments.svelte';
  import FriendlyControl from '../FriendlyControl.svelte';
  import ShadeRamp from '../ShadeRamp.svelte';
  import StudioFrame from './StudioFrame.svelte';

  const main = BRAND_COLOR_KEYS.filter((c) => c.group === 'brand');
  const status = BRAND_COLOR_KEYS.filter((c) => c.group === 'status');
  const tuning = [
    '--sf-contrast-bias',
    '--sf-contrast-threshold',
    '--sf-palette-mix-50',
    '--sf-palette-mix-500',
    '--sf-palette-mix-950',
    '--sf-focus-ring-width',
    '--sf-focus-ring-offset',
  ].map((name) => tokenByName.get(name)).filter(Boolean);
  const nav = ['Main colors', 'Semantic colors', 'Gradients', 'Shade curve', 'Contrast', 'Assignments'];
</script>

<StudioFrame title="Color Studio" description="Set brand sources first, then verify semantic roles, status colors, shade ramp, contrast, and real usage." tone="color" {nav}>
  <div class="color-studio">

    <section class="usage" aria-label="Usage preview">
      <button>Primary button</button>
      <div><strong>Surface card</strong><p>Text, link, border and subtle background preview.</p><span role="link" tabindex="0" class="usage__link">Example link</span></div>
      <mark>Status message</mark>
    </section>

    <section class="theme-pair" aria-label="Light / dark pair preview">
      <article class="theme-card theme-card--light"><small>Light</small><b>Readable surface</b><span>Base, neutral and brand sources.</span></article>
      <article class="theme-card theme-card--dark"><small>Dark</small><b>Auto-derived pair</b><span>Override only when the automatic pair needs art direction.</span></article>
    </section>

    <section class="swatches" aria-label="Palette overview">
      {#each main as { key, label } (key)}<span style:background={`var(--sf-color-${key})`} title={label}></span>{/each}
      {#each status as { key, label } (key)}<span style:background={`var(--sf-color-${key})`} title={label}></span>{/each}
    </section>

    <section class="role-map" aria-label="Role map">
      <div class="role-map__head"><strong>Role map</strong><span>How brand sources become real interface decisions.</span></div>
      <div class="role-map__grid">
        {#each COLOR_ROLE_GROUPS as group (group.section)}
          <article>
            <h4>{group.section}</h4>
            {#each group.roles as role (role.token)}
              <div class="role-chip"><span style:background={`var(${role.token})`}></span><p><b>{role.label}</b><code>{role.token}</code></p></div>
            {/each}
          </article>
        {/each}
      </div>
    </section>

    <details class="panel__card cfg-card" open><summary>Core brand colors</summary><div class="rows">{#each main as {key,label} (key)}<BrandColorRow colorKey={key} {label} />{/each}</div></details>
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
  .usage__link { color: var(--sf-color-link); cursor: pointer; text-decoration: underline; }
  mark { border-radius: 999px; background: var(--sf-color-warning-subtle); color: var(--sf-color-warning); padding: 7px 10px; }
  .theme-pair { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .theme-card { min-height: 118px; display: grid; align-content: end; gap: 4px; padding: 14px; border-radius: 16px; border: 1px solid var(--cfg-border); }
  .theme-card--light { background: var(--sf-color-surface); color: var(--sf-color-text); }
  .theme-card--dark { background: var(--sf-color-neutral-superdark, #111); color: var(--sf-color-base-superlight, #fff); }
  .theme-card small { text-transform: uppercase; letter-spacing: .08em; color: var(--cfg-text-muted); font-weight: 900; }
  .theme-card b { font-size: 18px; }
  .theme-card span { font-size: 12px; opacity: .75; }
  .swatches { display: grid; grid-template-columns: repeat(10, 1fr); gap: 6px; padding: 10px; border: 1px solid var(--cfg-border); border-radius: var(--cfg-radius); background: var(--cfg-bg-2); }
  .swatches span { min-height: 38px; border-radius: 9px; border: 1px solid color-mix(in oklab, currentColor 15%, transparent); }
  .role-map { display: grid; gap: 10px; padding: 12px; border: 1px solid var(--cfg-border); border-radius: var(--cfg-radius); background: var(--cfg-bg-2); }
  .role-map__head { display: flex; gap: 8px; justify-content: space-between; align-items: baseline; flex-wrap: wrap; }
  .role-map__head strong { font-size: 13px; text-transform: uppercase; letter-spacing: .06em; }
  .role-map__head span { color: var(--cfg-text-muted); font-size: 12px; }
  .role-map__grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
  .role-map article { display: grid; gap: 8px; padding: 10px; border: 1px solid var(--cfg-border); border-radius: var(--cfg-radius-s); background: var(--cfg-surface); }
  .role-map h4 { margin: 0; font-size: 12px; }
  .role-chip { display: grid; grid-template-columns: 26px 1fr; gap: 8px; align-items: center; min-width: 0; }
  .role-chip > span { inline-size: 26px; block-size: 26px; border-radius: 8px; border: 1px solid var(--cfg-border-strong); }
  .role-chip p { display: grid; gap: 1px; margin: 0; min-width: 0; }
  .role-chip b { font-size: 11px; }
  .role-chip code { color: var(--cfg-text-faint); font-size: 9.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  details { border: 1px solid var(--cfg-border); border-radius: var(--cfg-radius); background: var(--cfg-surface); overflow: clip; }
  summary { padding: 12px 14px; cursor: pointer; font-weight: 800; text-transform: uppercase; font-size: 12px; letter-spacing: .06em; background: var(--cfg-surface-2); }
  .rows { display: grid; }
  @media (max-width: 800px) { .theme-pair, .role-map__grid { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 640px) { .usage, .theme-pair, .role-map__grid { grid-template-columns: 1fr; } .swatches { grid-template-columns: repeat(5, 1fr); } }
</style>
