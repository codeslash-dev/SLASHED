<script>
  import { overrides, ui } from '../lib/store.svelte.js';
  import { buildPreviewDeclarations } from '../lib/preview.js';

  /** @type {HTMLButtonElement | undefined} */
  let closeBtn;
  /** @type {HTMLElement | undefined} */
  let previewEl;
  let isFullscreen = $state(false);

  $effect(() => {
    if (!window.matchMedia('(max-width: 1100px)').matches) return;
    closeBtn?.focus();
    return () => {
      document.querySelector('button[aria-label="Toggle preview"]')?.focus();
    };
  });

  $effect(() => {
    const handler = () => { isFullscreen = document.fullscreenElement === previewEl; };
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  });

  async function toggleFullscreen() {
    if (!previewEl) return;
    try {
      if (document.fullscreenElement === previewEl) {
        await document.exitFullscreen?.();
      } else {
        await previewEl.requestFullscreen?.();
      }
    } catch {
      // keep UI stable if fullscreen is denied or unavailable
    }
  }

  const VIEWPORTS = [
    { id: 'mobile',  emoji: '📱', label: 'Mobile',  width: 360,  hint: '360 px' },
    { id: 'tablet',  emoji: '📱', label: 'Tablet',  width: 768,  hint: '768 px' },
    { id: 'laptop',  emoji: '💻', label: 'Laptop',  width: 1024, hint: '1024 px' },
    { id: 'desktop', emoji: '🖥️', label: 'Desktop', width: 1440, hint: '1440 px' },
    { id: 'fluid',   emoji: '🌊', label: 'Fluid',   width: null, hint: 'fill pane' },
  ];

  const SECTIONS = [
    { id: 'overview',   label: 'Overview' },
    { id: 'colors',     label: 'Colors' },
    { id: 'gradients',  label: 'Gradients' },
    { id: 'palette',    label: 'Palette' },
    { id: 'typography', label: 'Type' },
    { id: 'spacing',    label: 'Spacing' },
    { id: 'layout',     label: 'Layout' },
    { id: 'borders',    label: 'Borders' },
    { id: 'shadows',    label: 'Shadows' },
    { id: 'motion',     label: 'Motion' },
    { id: 'effects',    label: 'Effects' },
    { id: 'macros',     label: 'Macros' },
    { id: 'tokens',     label: 'Tokens' },
  ];

  const DOMAIN_TO_SECTION = {
    home:       'overview',
    colors:     'colors',
    gradients:  'gradients',
    typography: 'typography',
    spacing:    'spacing',
    layout:     'layout',
    borders:    'borders',
    shadows:    'shadows',
    motion:     'motion',
    effects:    'effects',
    misc:       'tokens',
    wcag:       'colors',
    themes:     'palette',
    setup:      'overview',
    cheatsheet: 'tokens',
  };

  let activeSection = $state('overview');

  $effect(() => {
    const sec = DOMAIN_TO_SECTION[ui.domain];
    if (sec) activeSection = sec;
  });

  const baseStyle = $derived(buildPreviewDeclarations(overrides, ui.previewTheme));
  const styleStr = $derived(
    ui.previewMotion === 'reduced'
      ? `${baseStyle}\n--sf-motion-scale: 0;`
      : baseStyle
  );

  const activeViewport = $derived(VIEWPORTS.find((v) => v.id === ui.previewWidth) ?? VIEWPORTS[VIEWPORTS.length - 1]);

  const brand   = ['primary', 'secondary', 'tertiary', 'action', 'neutral', 'base'];
  const status  = ['success', 'warning', 'info', 'danger'];
  const surfaces = [
    { var: 'inset', label: 'Inset' },
    { var: 'bg', label: 'Background' },
    { var: 'surface', label: 'Surface' },
    { var: 'raised', label: 'Raised' },
  ];
  const spaceSteps   = ['2xs', 'xs', 's', 'm', 'l', 'xl', '2xl', '3xl'];
  const typeScale    = ['2xl', 'xl', 'l', 'm', 's', 'xs'];
  const radii        = ['s', 'm', 'l', 'xl', 'full'];
  const shadows      = ['s', 'm', 'l', 'xl'];
  const gradients    = ['primary', 'secondary', 'tertiary', 'brand', 'surface'];
  const durations    = ['instant', 'fast', 'normal', 'slow'];

  const paletteSteps  = ['50','100','200','300','400','500','600','700','800','900','950'];
  const alphaSteps    = ['a5','a10','a20','a30','a40','a50','a60','a70','a80','a90','a95'];
  const fullTypeScale = ['2xs','xs','s','m','l','xl','2xl','3xl','4xl','display-s','display-m','display-l'];
  const fontWeights   = [
    {token:'thin',num:100},{token:'extralight',num:200},{token:'light',num:300},
    {token:'normal',num:400},{token:'medium',num:500},{token:'semibold',num:600},
    {token:'bold',num:700},{token:'extrabold',num:800},{token:'black',num:900},
  ];
  const lineHeights  = ['tight','snug','normal','relaxed'];
  const trackings    = ['tight','normal','wide','wider','widest'];
  const fontStacks   = ['body','heading','display','humanist','geometric','slab','mono'];
  const statusMacros = ['primary','secondary','tertiary','action','neutral','inverse','success','warning','info','danger'];
  const stateClasses = [
    {cls:'is-active',label:'is-active'},
    {cls:'is-current',label:'is-current'},
    {cls:'is-pressed',label:'is-pressed'},
    {cls:'is-open',label:'is-open'},
    {cls:'is-loading',label:'is-loading'},
    {cls:'is-disabled',label:'is-disabled'},
    {cls:'is-invalid',label:'is-invalid'},
    {cls:'is-valid',label:'is-valid'},
  ];

  /** @param {Event} e */
  const preventDemoNav = (e) => e.preventDefault();
</script>

<section class="preview" bind:this={previewEl}>
  <header class="preview__bar">
    <div class="preview__title">
      <span class="preview__dot" aria-hidden="true"></span>
      <strong>Live preview</strong>
    </div>
    <div class="preview__viewports cfg-seg" role="group" aria-label="Preview viewport width">
      {#each VIEWPORTS as v (v.id)}
        <button
          class="cfg-seg__btn preview__vp-btn"
          class:cfg-seg__btn--on={ui.previewWidth === v.id}
          onclick={() => (ui.previewWidth = v.id)}
          aria-pressed={ui.previewWidth === v.id}
          title="{v.emoji} {v.label} — {v.hint}"
        >{v.emoji}<span class="preview__vp-text"> {v.label}</span></button>
      {/each}
    </div>
    <div class="cfg-seg preview__modes" role="group" aria-label="Preview theme and motion">
      <button class="cfg-seg__btn" class:cfg-seg__btn--on={ui.previewTheme === 'light'} onclick={() => (ui.previewTheme = 'light')} aria-pressed={ui.previewTheme === 'light'} aria-label="Set preview theme to light" title="Light preview theme">☀</button>
      <button class="cfg-seg__btn" class:cfg-seg__btn--on={ui.previewTheme === 'dark'}  onclick={() => (ui.previewTheme = 'dark')}  aria-pressed={ui.previewTheme === 'dark'}  aria-label="Set preview theme to dark"  title="Dark preview theme">☾</button>
      <button class="cfg-seg__btn" class:cfg-seg__btn--on={ui.previewMotion === 'reduced'} onclick={() => (ui.previewMotion = ui.previewMotion === 'reduced' ? 'normal' : 'reduced')} aria-pressed={ui.previewMotion === 'reduced'} aria-label={ui.previewMotion === 'reduced' ? 'Set preview motion to normal' : 'Set preview motion to reduced'} title="Reduced motion in preview only">🐢</button>
    </div>
    <span class="preview__hint">{ui.previewTheme}{ui.previewMotion === 'reduced' ? ' · reduced motion' : ''}{activeViewport.width ? ` · ${activeViewport.width} px` : ''}</span>
    <button class="preview__fullscreen" onclick={toggleFullscreen} title={isFullscreen ? 'Exit full screen' : 'Full screen preview'} aria-label={isFullscreen ? 'Exit full screen' : 'Full screen preview'} aria-pressed={isFullscreen}>{isFullscreen ? '⤡' : '⤢'}</button>
    <button bind:this={closeBtn} class="preview__close" onclick={() => (ui.previewOpen = false)} title="Close the preview overlay" aria-label="Close preview">✕</button>
  </header>

  <div class="preview__sections cfg-seg" role="group" aria-label="Preview section">
    {#each SECTIONS as s (s.id)}
      <button class="cfg-seg__btn preview__sec-btn" class:cfg-seg__btn--on={activeSection === s.id} onclick={() => (activeSection = s.id)} aria-pressed={activeSection === s.id}>{s.label}</button>
    {/each}
  </div>

  <div class="preview__viewport">
    <div
      class="preview__stage"
      class:preview__stage--rm={ui.previewMotion === 'reduced'}
      style="{styleStr}{activeViewport.width ? `;max-inline-size:${activeViewport.width}px;margin-inline:auto;box-shadow:0 0 0 1px var(--cfg-border) inset;` : ''}"
    >
    <div class="pv">

      <!-- ═══════════ OVERVIEW ═══════════ -->
      {#if activeSection === 'overview'}

      <section class="pv__block">
        <p class="pv__eyebrow">Typography</p>
        <h2 class="pv__h">The quick brown fox</h2>
        <p class="pv__p">Jumps over the lazy dog. Body font, base size and <a class="pv__a" href="#a" onclick={preventDemoNav}>an inline link</a> with <code class="pv__code">--sf-color-code</code> styling.</p>
        <p class="pv__muted">Muted caption · secondary hierarchy · auto-contrasting.</p>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Display type</p>
        <p class="pv__display pv__display--l">Display L</p>
        <p class="pv__display pv__display--m">Display M</p>
        <p class="pv__display pv__display--s">Display S</p>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Type scale</p>
        <div class="pv__scale">
          {#each typeScale as s (s)}
            <div class="pv__scale-row">
              <span class="pv__scale-sample" style="font-size:var(--sf-text-{s})">Aa</span>
              <code>--sf-text-{s}</code>
            </div>
          {/each}
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Surfaces</p>
        <div class="pv__surfaces">
          {#each surfaces as s (s.var)}
            <div class="pv__surface" style="background:var(--sf-color-{s.var})"><span>{s.label}</span></div>
          {/each}
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Brand &amp; status colors</p>
        <div class="pv__swatches">
          {#each brand as c (c)}
            <div class="pv__sw" style="background:var(--sf-color-{c})"><span style="color:var(--sf-color-text--on-{c},#fff)">{c}</span></div>
          {/each}
        </div>
        <div class="pv__swatches" style="margin-top:6px">
          {#each status as c (c)}
            <div class="pv__sw" style="background:var(--sf-color-{c})"><span style="color:var(--sf-color-text--on-{c},#fff)">{c}</span></div>
          {/each}
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Gradients</p>
        <div class="pv__gradients">
          {#each gradients as g (g)}
            <div class="pv__grad" style="background:var(--sf-gradient-{g},var(--sf-color-{g},#888))"><span class="pv__grad-label">{g}</span></div>
          {/each}
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Buttons</p>
        <div class="pv__btns">
          <button class="pv__btn pv__btn--primary">Primary</button>
          <button class="pv__btn pv__btn--secondary">Secondary</button>
          <button class="pv__btn pv__btn--action">Action</button>
          <button class="pv__btn pv__btn--outline">Outline</button>
          <button class="pv__btn pv__btn--ghost">Ghost</button>
          <button class="pv__btn pv__btn--outline pv__btn--focused" tabindex="-1" aria-label="Focus ring demo">Focus ring</button>
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Navigation</p>
        <div class="pv__tabs" role="tablist">
          <button class="pv__tab pv__tab--active" role="tab" aria-selected="true">Overview</button>
          <button class="pv__tab" role="tab" aria-selected="false">Analytics</button>
          <button class="pv__tab" role="tab" aria-selected="false">Settings</button>
          <button class="pv__tab" role="tab" aria-selected="false">Team</button>
        </div>
        <nav class="pv__breadcrumb" aria-label="Breadcrumb">
          <a class="pv__a pv__crumb" href="#a" onclick={preventDemoNav}>Home</a>
          <span class="pv__crumb-sep" aria-hidden="true">›</span>
          <a class="pv__a pv__crumb" href="#a" onclick={preventDemoNav}>Products</a>
          <span class="pv__crumb-sep" aria-hidden="true">›</span>
          <span class="pv__crumb" aria-current="page">Design Tokens</span>
        </nav>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Feedback alerts</p>
        <div class="pv__alerts">
          {#each status as c (c)}
            <div class="pv__alert" style="background:var(--sf-color-{c}-subtle);border-inline-start-color:var(--sf-color-{c})">
              <span class="pv__badge" style="background:var(--sf-color-{c});color:var(--sf-color-text--on-{c},#fff)">{c}</span>
              <span class="pv__alert-text">{c} message — readable on its own subtle tint.</span>
            </div>
          {/each}
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Card component</p>
        <div class="pv__card">
          <div class="pv__card-accent"></div>
          <div class="pv__card-body">
            <div class="pv__card-top">
              <div class="pv__avatar" style="background:var(--sf-color-secondary);color:var(--sf-color-text--on-secondary,#fff)">S</div>
              <div>
                <p class="pv__card-title">Card Component</p>
                <p class="pv__card-sub">Design token preview</p>
              </div>
              <span class="pv__badge pv__badge--push" style="background:var(--sf-color-success);color:var(--sf-color-text--on-success,#fff)">Active</span>
            </div>
            <p class="pv__card-text">Radius, shadow, colours, surfaces and typography working together — every value updates live as you adjust tokens.</p>
            <div class="pv__card-footer">
              <span class="pv__badge" style="background:var(--sf-color-info);color:var(--sf-color-text--on-info,#fff)">Info</span>
              <span class="pv__btn pv__btn--action pv__btn--sm pv__btn--push">Save</span>
            </div>
          </div>
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Form states</p>
        <div class="pv__form-row">
          <label class="pv__field">
            <span class="pv__field-label">Email</span>
            <input class="pv__field-input" type="text" placeholder="you@example.com" readonly />
          </label>
          <label class="pv__field">
            <span class="pv__field-label pv__field-label--valid">Verified</span>
            <input class="pv__field-input pv__field-input--valid" type="text" value="alex@example.com" readonly />
            <span class="pv__field-hint pv__field-hint--valid">✓ Looks good</span>
          </label>
          <label class="pv__field">
            <span class="pv__field-label pv__field-label--danger">Password</span>
            <input class="pv__field-input pv__field-input--danger" type="text" value="abc" readonly />
            <span class="pv__field-hint pv__field-hint--danger">✗ At least 8 characters</span>
          </label>
          <label class="pv__field">
            <span class="pv__field-label pv__field-label--disabled">Disabled</span>
            <input class="pv__field-input pv__field-input--disabled" type="text" placeholder="Not editable" disabled />
          </label>
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Spacing scale</p>
        <div class="pv__space">
          {#each spaceSteps as s (s)}
            <div class="pv__space-row">
              <code>--sf-space-{s}</code>
              <span class="pv__space-bar" style="inline-size:var(--sf-space-{s})"></span>
            </div>
          {/each}
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Border radius</p>
        <div class="pv__radii">
          {#each radii as r (r)}
            <div class="pv__radii-item">
              <span class="pv__radii-box" style="border-radius:var(--sf-radius-{r})"></span>
              <code>{r}</code>
            </div>
          {/each}
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Shadows</p>
        <div class="pv__shadows">
          {#each shadows as s (s)}
            <div class="pv__shadow-item" style="box-shadow:var(--sf-shadow-{s})"><code>{s}</code></div>
          {/each}
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Motion — hit 🐢 to preview reduced motion</p>
        <div class="pv__motion-demos">
          <div class="pv__motion-cell"><span class="pv__anim pv__anim--pulse" style="background:var(--sf-color-success,#22c55e)"></span><code class="pv__anim-label">pulse</code></div>
          <div class="pv__motion-cell"><span class="pv__anim pv__anim--spin" style="border-color:var(--sf-color-primary,#4f8cff);border-top-color:transparent"></span><code class="pv__anim-label">spin</code></div>
          <div class="pv__motion-cell"><span class="pv__anim pv__anim--bounce" style="background:var(--sf-color-action,#0891b2)"></span><code class="pv__anim-label">bounce</code></div>
          <div class="pv__motion-cell"><span class="pv__anim pv__anim--slide" style="background:var(--sf-color-tertiary,#888)"></span><code class="pv__anim-label">slide·fade</code></div>
        </div>
        <div class="pv__durations">
          {#each durations as d (d)}
            <div class="pv__dur-row">
              <code class="pv__dur-label">--sf-duration-{d}</code>
              <div class="pv__dur-track"><span class="pv__dur-bar" style="animation-duration:var(--sf-duration-{d},200ms)"></span></div>
            </div>
          {/each}
        </div>
      </section>

      {/if}

      <!-- ═══════════ COLORS ═══════════ -->
      {#if activeSection === 'colors'}

      <section class="pv__block">
        <p class="pv__eyebrow">Applied to components</p>
        <div class="pv__btns">
          <button class="pv__btn pv__btn--primary">Primary</button>
          <button class="pv__btn pv__btn--secondary">Secondary</button>
          <button class="pv__btn pv__btn--action">Action</button>
          <button class="pv__btn pv__btn--outline">Outline</button>
          <button class="pv__btn pv__btn--ghost">Ghost</button>
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Brand colors + on-color text (auto WCAG black/white)</p>
        <div class="pv__swatches">
          {#each brand as c (c)}
            <div class="pv__sw pv__sw--tall" style="background:var(--sf-color-{c})">
              <span style="color:var(--sf-color-text--on-{c},#fff)">{c}<br><small style="opacity:.7;font-size:9px">on-{c}</small></span>
            </div>
          {/each}
        </div>
      </section>

      {#each brand as c (c)}
      <section class="pv__block">
        <p class="pv__eyebrow">{c} — full variant ladder</p>
        <div class="pv__swatches pv__swatches--compact">
          <div class="pv__sw pv__sw--sm pv__sw--bordered" style="background:var(--sf-color-{c}-superlight)"><span class="pv__sw-dark">superlight</span></div>
          <div class="pv__sw pv__sw--sm pv__sw--bordered" style="background:var(--sf-color-{c}-xlight)"><span class="pv__sw-dark">xlight</span></div>
          <div class="pv__sw pv__sw--sm pv__sw--bordered" style="background:var(--sf-color-{c}-lighter)"><span class="pv__sw-dark">lighter</span></div>
          <div class="pv__sw pv__sw--sm" style="background:var(--sf-color-{c})"><span style="color:var(--sf-color-text--on-{c},#fff)">base</span></div>
          <div class="pv__sw pv__sw--sm" style="background:var(--sf-color-{c}-darker)"><span style="color:var(--sf-color-text--on-{c},#fff)">darker</span></div>
          <div class="pv__sw pv__sw--sm" style="background:var(--sf-color-{c}-xdark)"><span style="color:#fff">xdark</span></div>
          <div class="pv__sw pv__sw--sm" style="background:var(--sf-color-{c}-superdark)"><span style="color:#fff">superdark</span></div>
          <div class="pv__sw pv__sw--sm" style="background:var(--sf-color-{c}--hover)"><span style="color:var(--sf-color-text--on-{c},#fff)">hover</span></div>
          <div class="pv__sw pv__sw--sm" style="background:var(--sf-color-{c}--active)"><span style="color:var(--sf-color-text--on-{c},#fff)">active</span></div>
          <div class="pv__sw pv__sw--sm pv__sw--bordered" style="background:var(--sf-color-{c}-subtle)"><span class="pv__sw-dark">subtle</span></div>
          <div class="pv__sw pv__sw--sm pv__sw--bordered" style="background:var(--sf-color-{c}-muted)"><span class="pv__sw-dark">muted</span></div>
          <div class="pv__sw pv__sw--sm pv__sw--bordered" style="background:var(--sf-color-{c}-ghost)"><span class="pv__sw-dark">ghost</span></div>
        </div>
      </section>
      {/each}

      <section class="pv__block">
        <p class="pv__eyebrow">Status colors + triplets (subtle bg / strong text / muted border)</p>
        <div class="pv__swatches">
          {#each status as c (c)}
            <div class="pv__sw" style="background:var(--sf-color-{c})"><span style="color:var(--sf-color-text--on-{c},#fff)">{c}</span></div>
          {/each}
        </div>
        <div class="pv__chips" style="margin-top:8px">
          {#each status as c (c)}
            <div class="pv__chip" style="background:var(--sf-color-{c}-subtle);color:var(--sf-color-{c}-strong,var(--sf-color-{c}));border:1px solid var(--sf-color-{c}-muted)">{c}</div>
          {/each}
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Semantic surfaces</p>
        <div class="pv__swatches">
          {#each ['bg','surface','inset','raised','overlay','inverse','dim'] as s (s)}
            <div class="pv__sw pv__sw--bordered" style="background:var(--sf-color-{s})"><span style="color:{s==='inverse'?'var(--sf-color-text--inverse,#fff)':'var(--sf-color-text,inherit)'}">{s}</span></div>
          {/each}
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Interaction backgrounds</p>
        <div class="pv__swatches">
          {#each ['bg--hover','bg--active','bg--focus','bg--selected','bg--disabled'] as s (s)}
            <div class="pv__sw pv__sw--bordered" style="background:var(--sf-color-{s})"><span style="color:var(--sf-color-text)">{s.replace('bg--','')}</span></div>
          {/each}
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Text hierarchy</p>
        <div class="pv__text-hier">
          {#each ['text','text--secondary','text--muted','text--placeholder','text--disabled','heading'] as t (t)}
            <div style="color:var(--sf-color-{t})">--sf-color-{t}</div>
          {/each}
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Border variants</p>
        <div class="pv__borders">
          {#each ['border','border--subtle','border--strong','border--focus','border--disabled','border--translucent'] as b (b)}
            <div class="pv__border-row">
              <div style="flex:1;border-bottom:2px solid var(--sf-color-{b})"></div>
              <code class="pv__border-label">--sf-color-{b}</code>
            </div>
          {/each}
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Links · code · mark · selection</p>
        <div class="pv__chips">
          <a class="pv__a" href="#a" onclick={preventDemoNav}>link</a>
          <a href="#a" onclick={preventDemoNav} style="color:var(--sf-color-link--hover)">link--hover</a>
          <a href="#a" onclick={preventDemoNav} style="color:var(--sf-color-link--visited)">link--visited</a>
          <a href="#a" onclick={preventDemoNav} style="color:var(--sf-color-link--active)">link--active</a>
          <code class="pv__code">inline code</code>
          <mark class="pv__mark">marked text</mark>
          <span style="background:var(--sf-color-selection-bg,#b3d4ff);color:var(--sf-color-selection-text,inherit)">selection</span>
        </div>
      </section>

      {/if}

      <!-- ═══════════ PALETTE ═══════════ -->
      {#if activeSection === 'palette'}

      <section class="pv__block">
        <p class="pv__eyebrow">primary 50–950 numeric scale <small style="font-weight:400;text-transform:none">(tokens.palette.css)</small></p>
        <div class="pv__pal-row">
          {#each paletteSteps as s (s)}
            <div class="pv__pal" style="background:var(--sf-color-primary-{s});color:{parseInt(s)>=500?'#fff':'var(--sf-color-primary-900)'}"><span>{s}</span></div>
          {/each}
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">primary alpha a5–a95 (over checker)</p>
        <div class="pv__pal-row pv__pal-row--checker">
          {#each alphaSteps as s (s)}
            <div class="pv__pal" style="background:var(--sf-color-primary-{s});color:var(--sf-color-primary-900);border:1px solid var(--sf-color-border)"><span>{s}</span></div>
          {/each}
        </div>
      </section>

      {#each ['secondary','tertiary','action','neutral'] as c (c)}
      <section class="pv__block">
        <p class="pv__eyebrow">{c} — key palette steps</p>
        <div class="pv__pal-row">
          {#each ['100','200','300','400','500','600','700','800'] as s (s)}
            <div class="pv__pal" style="background:var(--sf-color-{c}-{s});color:{parseInt(s)>=500?'#fff':'var(--sf-color-'+c+'-900)'}"><span>{s}</span></div>
          {/each}
        </div>
      </section>
      {/each}

      <section class="pv__block">
        <p class="pv__eyebrow">LumLocker — lock 5 brand colors to one shared lightness</p>
        <p class="pv__muted" style="margin-bottom:8px">Activate with <code class="pv__code">data-lumlocker</code> on <code class="pv__code">&lt;html&gt;</code>. Token <code class="pv__code">--sf-lumlocker</code> sets the target L (default 0.65). Base color excluded.</p>
        <div class="pv__lumlocker-grid">
          <div>
            <p class="pv__eyebrow" style="margin-bottom:5px">Natural (current)</p>
            <div class="pv__swatches pv__swatches--compact">
              {#each ['primary','secondary','tertiary','action','neutral'] as c (c)}
                <div class="pv__sw pv__sw--sm" style="background:var(--sf-color-{c})"><span style="color:var(--sf-color-text--on-{c},#fff)">{c}</span></div>
              {/each}
            </div>
          </div>
          <div>
            <p class="pv__eyebrow" style="margin-bottom:5px">With LumLocker (L locked to --sf-lumlocker)</p>
            <div class="pv__swatches pv__swatches--compact">
              <div class="pv__sw pv__sw--sm" style="background:oklch(var(--sf-lumlocker,0.65) 0.27 264)"><span style="color:#fff">primary</span></div>
              <div class="pv__sw pv__sw--sm" style="background:oklch(var(--sf-lumlocker,0.65) 0.04 264)"><span style="color:#fff">secondary</span></div>
              <div class="pv__sw pv__sw--sm" style="background:oklch(var(--sf-lumlocker,0.65) 0.22 295)"><span style="color:#fff">tertiary</span></div>
              <div class="pv__sw pv__sw--sm" style="background:oklch(var(--sf-lumlocker,0.65) 0.22 235)"><span style="color:#fff">action</span></div>
              <div class="pv__sw pv__sw--sm" style="background:oklch(var(--sf-lumlocker,0.65) 0.025 260)"><span style="color:#fff">neutral</span></div>
            </div>
          </div>
        </div>
        <p class="pv__muted" style="margin-top:6px">Real LumLocker uses <code class="pv__code">oklch(from var(--sf-color-*) var(--sf-lumlocker) c h)</code> relative color syntax.</p>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Scoped theming — data-theme on any subtree</p>
        <p class="pv__muted" style="margin-bottom:8px">Any element can flip <code class="pv__code">data-theme="dark"</code> or <code class="pv__code">"light"</code> to re-declare all color tokens scoped to that subtree.</p>
        <div class="pv__theme-demo">
          <div class="pv__theme-panel pv__theme-panel--light">
            <code class="pv__code" style="font-size:10px">data-theme="light"</code>
            <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap">
              <div class="pv__sw pv__sw--sm" style="background:var(--sf-color-primary)"><span style="color:var(--sf-color-text--on-primary,#fff)">primary</span></div>
              <div class="pv__sw pv__sw--sm pv__sw--bordered" style="background:var(--sf-color-surface)"><span style="color:var(--sf-color-text)">surface</span></div>
            </div>
          </div>
          <div class="pv__theme-panel pv__theme-panel--dark">
            <code style="font-size:10px;background:rgba(255,255,255,.15);padding:2px 6px;border-radius:4px;color:#eee;font-family:monospace">data-theme="dark"</code>
            <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap">
              <div class="pv__sw pv__sw--sm" style="background:var(--sf-color-primary-lighter)"><span style="color:#111">primary</span></div>
              <div style="background:#2a2a3e;border:1px solid #444;border-radius:8px;aspect-ratio:2;min-width:56px;display:flex;align-items:flex-end;padding:4px 6px;font-size:10px;font-weight:600;color:#eee">surface</div>
            </div>
          </div>
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Gradients</p>
        <div class="pv__gradients">
          {#each gradients as g (g)}
            <div class="pv__grad" style="background:var(--sf-gradient-{g},var(--sf-color-{g},#888))"><span class="pv__grad-label">{g}</span></div>
          {/each}
        </div>
        <div class="pv__gradients" style="margin-top:8px">
          {#each ['fade--t','fade--b','fade--l','fade--r'] as g (g)}
            <div class="pv__grad pv__grad--bordered" style="background:var(--sf-gradient-{g},transparent)"><span class="pv__grad-label pv__grad-label--muted">{g}</span></div>
          {/each}
        </div>
      </section>

      {/if}

      <!-- ═══════════ TYPOGRAPHY ═══════════ -->
      {#if activeSection === 'typography'}

      <section class="pv__block">
        <p class="pv__eyebrow">Heading elements h1–h6</p>
        <div class="pv__headings">
          <h1 class="pv__nh">h1 — The quick brown fox</h1>
          <h2 class="pv__nh">h2 — The quick brown fox</h2>
          <h3 class="pv__nh">h3 — The quick brown fox</h3>
          <h4 class="pv__nh">h4 — The quick brown fox</h4>
          <h5 class="pv__nh">h5 — The quick brown fox</h5>
          <h6 class="pv__nh">h6 — The quick brown fox</h6>
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Complete fluid text scale — resize viewport to see clamp()</p>
        <div class="pv__scale">
          {#each fullTypeScale as s (s)}
            <div class="pv__scale-row">
              <span class="pv__scale-sample" style="font-size:var(--sf-text-{s});line-height:1.1">Aa</span>
              <code>--sf-text-{s}</code>
            </div>
          {/each}
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Font weights 100–900</p>
        <div class="pv__weights">
          {#each fontWeights as w (w.token)}
            <div style="font-weight:var(--sf-font-weight-{w.token});font-size:var(--sf-text-s)">{w.num} — {w.token} — The quick brown fox</div>
          {/each}
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Semantic weight aliases</p>
        <div class="pv__chips">
          <span style="font-weight:var(--sf-font-weight-body)">body weight</span>
          <span style="font-weight:var(--sf-font-weight-heading)">heading weight</span>
          <span style="font-weight:var(--sf-font-weight-display)">display weight</span>
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Line heights — --sf-leading-*</p>
        <div class="pv__leading-grid">
          {#each lineHeights as lh (lh)}
            <div class="pv__leading-cell">
              <code style="font-size:10px">leading-{lh}</code>
              <p style="line-height:var(--sf-leading-{lh});margin-top:4px;font-size:var(--sf-text-s)">Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod.</p>
            </div>
          {/each}
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Letter spacing — --sf-tracking-*</p>
        <div class="pv__weights">
          {#each trackings as t (t)}
            <div style="letter-spacing:var(--sf-tracking-{t});font-size:var(--sf-text-s)">THE QUICK BROWN FOX — {t}</div>
          {/each}
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Font stacks — --sf-font-*</p>
        <div class="pv__weights">
          {#each fontStacks as f (f)}
            <div style="font-family:var(--sf-font-{f});font-size:var(--sf-text-s)">The quick brown fox — {f}</div>
          {/each}
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Inline elements &amp; semantic HTML</p>
        <p class="pv__p"><strong>strong</strong>, <em>em</em>, <mark class="pv__mark">mark</mark>, <code class="pv__code">code</code>, <kbd class="pv__kbd">Ctrl</kbd>+<kbd class="pv__kbd">C</kbd>, H<sub>2</sub>O, E=mc<sup>2</sup>, <small>small</small>, <a class="pv__a" href="#a" onclick={preventDemoNav}>link</a>, <del>deleted</del>, <ins>inserted</ins></p>
        <pre class="pv__pre"><code>:root &#123;
  --sf-color-primary-source-light: oklch(0.55 0.22 160);
&#125;</code></pre>
        <blockquote class="pv__blockquote">A blockquote inside sf-prose gets consistent spacing via the flow space token.</blockquote>
      </section>

      {/if}

      <!-- ═══════════ LAYOUT ═══════════ -->
      {#if activeSection === 'layout'}

      <section class="pv__block">
        <p class="pv__eyebrow">.sf-stack — vertical flex, 6 gap sizes</p>
        <div class="pv__lp-row">
          {#each ['xs','s','m','l','xl','2xl'] as g (g)}
            <div class="pv__lp-col">
              <div class="sf-stack sf-stack--{g}">
                <div class="pv__box">A</div><div class="pv__box">B</div>
              </div>
              <code class="pv__lp-label">--{g}</code>
            </div>
          {/each}
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">.sf-stack — alignment variants</p>
        <div class="pv__lp-row">
          {#each [['center','sf-stack--center'],['end','sf-stack--end'],['stretch','sf-stack--stretch']] as [n,cls] (n)}
            <div class="pv__lp-col pv__lp-col--wide">
              <div class="sf-stack {cls}" style="gap:8px">
                <div class="pv__box" style="width:4rem">A</div><div class="pv__box" style="width:6rem">B</div>
              </div>
              <code class="pv__lp-label">--{n}</code>
            </div>
          {/each}
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">.sf-cluster — flex wrap, gap sizes</p>
        <div class="pv__lp-stack2">
          {#each ['xs','s','m','l','xl','2xl'] as g (g)}
            <div class="pv__lp-wrap">
              <div class="sf-cluster sf-cluster--{g}">
                <div class="pv__box">A</div><div class="pv__box">B</div><div class="pv__box">C</div>
              </div>
              <code class="pv__lp-label">--{g}</code>
            </div>
          {/each}
          <div class="pv__lp-wrap">
            <div class="sf-cluster sf-cluster--center" style="gap:8px"><div class="pv__box">center</div><div class="pv__box">layout</div></div>
            <code class="pv__lp-label">--center</code>
          </div>
          <div class="pv__lp-wrap">
            <div class="sf-cluster sf-cluster--between" style="gap:8px"><div class="pv__box">between</div><div class="pv__box">items</div></div>
            <code class="pv__lp-label">--between</code>
          </div>
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">.sf-grid — auto-fill tiers (min-item widths from layout tokens)</p>
        <div class="pv__lp-stack2">
          {#each ['xs','s','m','l','xl'] as tier (tier)}
            <div>
              <code class="pv__lp-label">.sf-grid--{tier} (--sf-grid-min-{tier})</code>
              <div class="sf-grid sf-grid--{tier}" style="margin-top:4px">
                {#each [1,2,3,4] as n (n)}<div class="pv__box">{n}</div>{/each}
              </div>
            </div>
          {/each}
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">.sf-grid-cols-N — fixed columns + ratio grids (CQ-responsive)</p>
        <div class="pv__lp-stack2">
          {#each [2,3,4] as cols (cols)}
            <div class="sf-cq">
              <code class="pv__lp-label">.sf-grid-cols-{cols}</code>
              <div class="sf-grid-cols-{cols}" style="margin-top:4px">
                {#each Array(cols) as _,n (n)}<div class="pv__box">{n+1}</div>{/each}
              </div>
            </div>
          {/each}
          <div class="sf-cq">
            <code class="pv__lp-label">.sf-grid-cols-1-2 · .sf-grid-cols-1-3</code>
            <div class="sf-grid-cols-1-2" style="margin-top:4px">
              <div class="pv__box">1</div><div class="pv__box pv__box--alt">2×</div>
            </div>
            <div class="sf-grid-cols-1-3" style="margin-top:6px">
              <div class="pv__box">1</div><div class="pv__box pv__box--alt">3×</div>
            </div>
          </div>
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">.sf-equal — intrinsically responsive auto-fit columns</p>
        <div class="pv__lp-stack2">
          {#each [2,3,4,6] as cols (cols)}
            <div>
              <code class="pv__lp-label">.sf-equal--{cols}</code>
              <div class="sf-equal sf-equal--{cols}" style="margin-top:4px">
                {#each Array(cols) as _,n (n)}<div class="pv__box">{n+1}</div>{/each}
              </div>
            </div>
          {/each}
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">.sf-sidebar — flex layout variants</p>
        <div class="pv__lp-stack2">
          <div>
            <code class="pv__lp-label">default (sidebar left, ~18rem)</code>
            <div class="sf-sidebar" style="margin-top:4px">
              <div class="pv__box pv__box--alt">sidebar</div>
              <div class="pv__box">main content</div>
            </div>
          </div>
          <div>
            <code class="pv__lp-label">--right (sidebar right)</code>
            <div class="sf-sidebar sf-sidebar--right" style="margin-top:4px">
              <div class="pv__box">main content</div>
              <div class="pv__box pv__box--alt">sidebar</div>
            </div>
          </div>
          <div>
            <code class="pv__lp-label">--narrow (12rem panel)</code>
            <div class="sf-sidebar sf-sidebar--narrow" style="margin-top:4px">
              <div class="pv__box pv__box--alt">nav</div>
              <div class="pv__box">main content</div>
            </div>
          </div>
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">.sf-switcher · .sf-cover · .sf-frame · .sf-bento</p>
        <div class="pv__lp-stack2">
          <div>
            <code class="pv__lp-label">.sf-switcher (column below --sf-switcher-threshold)</code>
            <div class="sf-switcher" style="margin-top:4px">
              <div class="pv__box">A</div>
              <div class="pv__box">B</div>
              <div class="pv__box">C</div>
            </div>
          </div>
          <div>
            <code class="pv__lp-label">.sf-cover .sf-cover__center</code>
            <div class="sf-cover" style="--sf-cover-min-height:5rem;margin-top:4px;background:var(--sf-color-inset);border-radius:var(--sf-radius-m)">
              <div class="sf-cover__center">
                <div class="pv__box">Centered content</div>
              </div>
            </div>
          </div>
          <div>
            <code class="pv__lp-label">.sf-frame .sf-frame--video</code>
            <div class="sf-frame sf-frame--video" style="margin-top:4px;max-width:180px;background:linear-gradient(135deg,var(--sf-color-primary),var(--sf-color-tertiary));border-radius:var(--sf-radius-m)">
              <span style="color:#fff;font-size:var(--sf-text-s)">16:9</span>
            </div>
          </div>
          <div>
            <code class="pv__lp-label">.sf-bento--3 + .sf-bento-wide · .sf-bento-featured</code>
            <div class="sf-cq" style="margin-top:4px">
              <div class="sf-bento sf-bento--3 sf-bento--compact">
                <div class="pv__box sf-bento-featured">Featured</div>
                <div class="pv__box pv__box--alt">B</div>
                <div class="pv__box pv__box--alt">C</div>
                <div class="pv__box pv__box--action sf-bento-wide">Wide D</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">.sf-container — max-width tiers</p>
        <div class="pv__lp-stack2">
          {#each [['narrow','var(--sf-container-narrow,480px)','narrow'],['prose','var(--sf-container-prose,65ch)','prose'],['default','var(--sf-container-default,72rem)','default'],['wide','var(--sf-container-wide,90rem)','wide']] as [tier,w,hint] (tier)}
            <div style="display:flex;align-items:center;gap:10px">
              <code class="pv__lp-label" style="flex-shrink:0;min-width:7ch">--{tier}</code>
              <div style="height:18px;background:var(--sf-color-primary-subtle);border-radius:3px;max-width:min(100%,{w});flex:1;border:1px solid var(--sf-color-primary-muted)"></div>
            </div>
          {/each}
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">.sf-divider — variants</p>
        <div class="pv__lp-stack2">
          {#each [['default',''],['--soft','sf-divider--soft'],['--strong','sf-divider--strong'],['--dashed','sf-divider--dashed'],['--dotted','sf-divider--dotted']] as [n,cls] (n)}
            <div style="display:flex;align-items:center;gap:10px;padding-block:4px">
              <div class="sf-divider {cls}" style="flex:1;margin:0"></div>
              <code class="pv__lp-label">{n}</code>
            </div>
          {/each}
          <div>
            <div class="sf-divider sf-divider--gradient" style="margin:0"></div>
            <code class="pv__lp-label">--gradient</code>
          </div>
        </div>
      </section>

      {/if}

      <!-- ═══════════ MACROS ═══════════ -->
      {#if activeSection === 'macros'}

      <section class="pv__block">
        <p class="pv__eyebrow">sf-surface--* color macros (11 variants)</p>
        <div class="pv__macro-grid">
          {#each statusMacros as c (c)}
            <div class="pv__surface-cell sf-surface--{c}">surface--{c}</div>
          {/each}
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">sf-text-gradient · sf-text-protect</p>
        <p class="sf-text-gradient" style="font-size:var(--sf-text-2xl);font-weight:800;line-height:1.1;margin:0">Gradient headline text</p>
        <div class="pv__photo">
          <p class="sf-text-protect" style="margin:0;color:#fff;font-size:var(--sf-text-xl,1.5rem);font-weight:700">Protected text over image gradient</p>
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">sf-truncate · sf-line-clamp-2 · sf-line-clamp-3 · sf-line-clamp-N</p>
        <p class="sf-truncate" style="margin:0;font-size:var(--sf-text-s,.875rem)">This is a very long single line that will be truncated with an ellipsis once it overflows its inline size box — lorem ipsum dolor sit amet consectetur adipiscing.</p>
        <p class="sf-line-clamp-2" style="margin:0;font-size:var(--sf-text-s,.875rem)">Two-line clamp. Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam.</p>
        <p class="sf-line-clamp-3" style="margin:0;font-size:var(--sf-text-s,.875rem)">Three-line clamp. Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco.</p>
        <p class="sf-line-clamp-N" style="--sf-line-clamp:4;margin:0;font-size:var(--sf-text-s,.875rem)">Four-line clamp (--sf-line-clamp: 4). Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip.</p>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">sf-prose · sf-not-prose · sf-flow</p>
        <div class="sf-prose" style="background:var(--sf-color-inset,rgba(127,127,127,.08));padding:12px;border-radius:var(--sf-radius-m,8px)">
          <h3>Prose heading</h3>
          <p>Automatic vertical rhythm. Direct children get spacing automatically via flow space token.</p>
          <ul><li>Restored bullets</li><li>Nested indentation preserved</li></ul>
          <div class="sf-not-prose" style="padding:6px 8px;background:var(--sf-color-surface,#fff);border-radius:var(--sf-radius-s,4px);font-size:var(--sf-text-xs,.75rem);font-weight:600;border:1px solid var(--sf-color-border,rgba(127,127,127,.2))">.sf-not-prose — opts this widget out of prose spacing rules.</div>
          <p>Back to prose body text.</p>
        </div>
        <p class="pv__eyebrow" style="margin-top:10px">sf-flow (lobotomized owl — * + *)</p>
        <div class="sf-flow" style="background:var(--sf-color-inset,rgba(127,127,127,.08));padding:10px;border-radius:var(--sf-radius-s,4px);font-size:var(--sf-text-s,.875rem);color:var(--sf-color-text--secondary,inherit)">
          <p style="margin:0">First (no top margin)</p>
          <p style="margin:0">Second (gets --sf-flow-space top margin via * + *)</p>
          <p style="margin:0">Third (same)</p>
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">sf-scroll-shadow (vertical overflow)</p>
        <div class="sf-scroll-shadow" style="block-size:8rem;background:var(--sf-color-inset,rgba(127,127,127,.08));padding:10px 12px;border-radius:var(--sf-radius-m,8px);font-size:var(--sf-text-s,.875rem)">
          {#each Array(8) as _,i (i)}
            <p style="margin:0 0 6px;color:var(--sf-color-text--secondary,inherit)">Line {i+1}{i===0?' (scroll me)':i===7?' (bottom)':''}</p>
          {/each}
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">sf-overflow-fade (horizontal tag list)</p>
        <div class="sf-overflow-fade" style="display:flex;gap:6px;white-space:nowrap">
          {#each ['one','two','three','four','five','six','seven','eight','nine','ten'] as t (t)}
            <span class="pv__tag">tag {t}</span>
          {/each}
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Link macros · sf-tabular-nums</p>
        <div class="pv__chips" style="margin-bottom:10px">
          <a class="pv__a sf-link--subtle" href="#a" onclick={preventDemoNav}>sf-link--subtle (underline on hover)</a>
          <a class="pv__a sf-link--reverse" href="#a" onclick={preventDemoNav}>sf-link--reverse (always underlined)</a>
          <a class="pv__a sf-link-external" href="#a" onclick={preventDemoNav}>sf-link-external</a>
        </div>
        <table class="pv__tbl sf-tabular-nums">
          <tbody>
            <tr><td>Item Alpha</td><td>1,234.50</td></tr>
            <tr><td>Item Beta</td><td>9,876.10</td></tr>
            <tr><td>Item Gamma</td><td>42.00</td></tr>
          </tbody>
        </table>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">State classes — .is-*</p>
        <div class="pv__macro-grid">
          {#each stateClasses as s (s.cls)}
            <div class="pv__state-cell pv__state--{s.cls.replace('is-','')}">.{s.label}</div>
          {/each}
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">A11y — sr-only · focus ring · sf-focus-parent</p>
        <div class="pv__chips">
          <button class="pv__btn pv__btn--outline pv__btn--focused" tabindex="-1">Focus ring</button>
          <span class="pv__badge" style="background:var(--sf-color-action);color:var(--sf-color-text--on-action,#fff)">.sr-only — hidden but screen-reader accessible</span>
          <span class="pv__badge" style="background:var(--sf-color-secondary);color:var(--sf-color-text--on-secondary,#fff)">.sf-focus-parent — ring on parent</span>
        </div>
      </section>

      {/if}

      <!-- ═══════════ TOKENS ═══════════ -->
      {#if activeSection === 'tokens'}

      <section class="pv__block">
        <p class="pv__eyebrow">Space scale — --sf-space-*</p>
        <div class="pv__space">
          {#each spaceSteps as s (s)}
            <div class="pv__space-row">
              <code>--sf-space-{s}</code>
              <span class="pv__space-bar" style="inline-size:var(--sf-space-{s})"></span>
            </div>
          {/each}
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Border radius — --sf-radius-*</p>
        <div class="pv__radii">
          {#each radii as r (r)}
            <div class="pv__radii-item">
              <span class="pv__radii-box" style="border-radius:var(--sf-radius-{r})"></span>
              <code>{r}</code>
            </div>
          {/each}
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Shadows — --sf-shadow-*</p>
        <div class="pv__shadows">
          {#each shadows as s (s)}
            <div class="pv__shadow-item" style="box-shadow:var(--sf-shadow-{s})"><code>{s}</code></div>
          {/each}
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Border variants — --sf-color-border-*</p>
        <div class="pv__borders">
          {#each ['border','border--subtle','border--strong','border--focus','border--disabled','border--translucent'] as b (b)}
            <div class="pv__border-row">
              <div style="flex:1;border-bottom:2px solid var(--sf-color-{b})"></div>
              <code class="pv__border-label">--sf-color-{b}</code>
            </div>
          {/each}
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Z-index scale — --sf-z-*</p>
        <div class="pv__z-grid">
          {#each ['base','raised','mid','high','overlay','modal','toast','max'] as z (z)}
            <div class="pv__z-chip"><code>--sf-z-{z}</code></div>
          {/each}
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Motion — durations, eases, keyframes — hit 🐢 for reduced motion</p>
        <div class="pv__motion-demos">
          <div class="pv__motion-cell"><span class="pv__anim pv__anim--pulse" style="background:var(--sf-color-success,#22c55e)"></span><code class="pv__anim-label">pulse</code></div>
          <div class="pv__motion-cell"><span class="pv__anim pv__anim--spin" style="border-color:var(--sf-color-primary,#4f8cff);border-top-color:transparent"></span><code class="pv__anim-label">spin</code></div>
          <div class="pv__motion-cell"><span class="pv__anim pv__anim--bounce" style="background:var(--sf-color-action,#0891b2)"></span><code class="pv__anim-label">bounce</code></div>
          <div class="pv__motion-cell"><span class="pv__anim pv__anim--slide" style="background:var(--sf-color-tertiary,#888)"></span><code class="pv__anim-label">slide</code></div>
          <div class="pv__motion-cell"><span class="pv__anim pv__anim--shimmer" style="background:linear-gradient(90deg,var(--sf-color-neutral-200,#e5e7eb) 25%,var(--sf-color-neutral-100,#f3f4f6) 50%,var(--sf-color-neutral-200,#e5e7eb) 75%);background-size:200% 100%"></span><code class="pv__anim-label">shimmer</code></div>
          <div class="pv__motion-cell"><span class="pv__anim pv__anim--ping" style="background:var(--sf-color-danger,#dc2626)"></span><code class="pv__anim-label">ping</code></div>
        </div>
        <div class="pv__durations">
          {#each durations as d (d)}
            <div class="pv__dur-row">
              <code class="pv__dur-label">--sf-duration-{d}</code>
              <div class="pv__dur-track"><span class="pv__dur-bar" style="animation-duration:var(--sf-duration-{d},200ms)"></span></div>
            </div>
          {/each}
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Easing functions — --sf-ease-*</p>
        <div class="pv__eases">
          {#each ['in','out','in-out','spring','bounce'] as e (e)}
            <div class="pv__ease-row">
              <code class="pv__ease-label">--sf-ease-{e}</code>
              <div class="pv__ease-bar" style="--pv-ease:var(--sf-ease-{e},ease)"></div>
            </div>
          {/each}
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Focus ring tokens</p>
        <div class="pv__chips">
          <button class="pv__btn pv__btn--outline pv__btn--focused" tabindex="-1">Focused button</button>
          <code class="pv__code">--sf-focus-ring-width</code>
          <code class="pv__code">--sf-focus-ring-color</code>
          <code class="pv__code">--sf-focus-ring-offset</code>
        </div>
      </section>

      {/if}

      <!-- ═══════════ GRADIENTS ═══════════ -->
      {#if activeSection === 'gradients'}

      <section class="pv__block">
        <p class="pv__eyebrow">Brand gradients — --sf-gradient-*</p>
        <div class="pv__gradients">
          {#each gradients as g (g)}
            <div class="pv__grad" style="background:var(--sf-gradient-{g},var(--sf-color-{g},#888))"><span class="pv__grad-label">{g}</span></div>
          {/each}
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Directional fade gradients</p>
        <div class="pv__gradients">
          {#each ['fade--t','fade--b','fade--l','fade--r'] as g (g)}
            <div class="pv__grad pv__grad--bordered" style="background:var(--sf-gradient-{g},transparent)"><span class="pv__grad-label pv__grad-label--muted">{g}</span></div>
          {/each}
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Gradient on real content — card + hero strip</p>
        <div class="pv__grad-card">
          <div class="pv__grad-card__hero" style="background:var(--sf-gradient-primary,linear-gradient(135deg,var(--sf-color-primary,#4f8cff),var(--sf-color-tertiary,#8858ff)))">
            <p class="pv__grad-card__title">Hero headline</p>
            <p class="pv__grad-card__sub">Gradient background from --sf-gradient-primary</p>
          </div>
          <div class="pv__grad-card__row">
            {#each ['secondary','tertiary','brand'] as g (g)}
              <div class="pv__grad-card__chip" style="background:var(--sf-gradient-{g},var(--sf-color-{g},#888))">{g}</div>
            {/each}
          </div>
        </div>
      </section>

      {/if}

      <!-- ═══════════ SPACING ═══════════ -->
      {#if activeSection === 'spacing'}

      <section class="pv__block">
        <p class="pv__eyebrow">Full space scale — --sf-space-* (resize viewport to see fluid values)</p>
        <div class="pv__space pv__space--full">
          {#each ['2xs','xs','s','m','l','xl','2xl','3xl'] as s (s)}
            <div class="pv__space-row">
              <code>--sf-space-{s}</code>
              <span class="pv__space-bar" style="inline-size:var(--sf-space-{s})"></span>
              <span class="pv__space-val" style="font-size:10px;color:var(--sf-color-text--muted,#888);white-space:nowrap;font-family:monospace">{s}</span>
            </div>
          {/each}
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Component spacing — gaps and padding</p>
        <div class="pv__sp-demos">
          <div class="pv__sp-card">
            <div class="pv__sp-card__inner" style="gap:var(--sf-space-s,8px)">
              <div class="pv__box">Item</div>
              <div class="pv__box">Item</div>
              <div class="pv__box">Item</div>
            </div>
            <code class="pv__lp-label">gap: --sf-space-s</code>
          </div>
          <div class="pv__sp-card">
            <div class="pv__sp-card__inner" style="gap:var(--sf-space-m,16px)">
              <div class="pv__box">Item</div>
              <div class="pv__box">Item</div>
              <div class="pv__box">Item</div>
            </div>
            <code class="pv__lp-label">gap: --sf-space-m</code>
          </div>
          <div class="pv__sp-card">
            <div class="pv__sp-card__inner" style="gap:var(--sf-space-l,24px)">
              <div class="pv__box">Item</div>
              <div class="pv__box">Item</div>
              <div class="pv__box">Item</div>
            </div>
            <code class="pv__lp-label">gap: --sf-space-l</code>
          </div>
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Section padding — --sf-section-pad · --sf-content-gap</p>
        <div class="pv__sec-demo">
          <div class="pv__sec-inner">
            <div class="pv__box pv__box--alt" style="min-height:3rem;width:100%">Section content</div>
            <div class="pv__box pv__box--alt" style="min-height:2rem;width:100%">More content</div>
          </div>
          <p class="pv__muted" style="margin-top:6px">Padding: --sf-section-pad · Gap: --sf-content-gap</p>
        </div>
      </section>

      {/if}

      <!-- ═══════════ BORDERS ═══════════ -->
      {#if activeSection === 'borders'}

      <section class="pv__block">
        <p class="pv__eyebrow">Border radius scale — --sf-radius-*</p>
        <div class="pv__radii">
          {#each radii as r (r)}
            <div class="pv__radii-item">
              <span class="pv__radii-box" style="border-radius:var(--sf-radius-{r})"></span>
              <code>{r}</code>
            </div>
          {/each}
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Borders on real components</p>
        <div class="pv__border-cards">
          {#each ['s','m','l','xl','full'] as r (r)}
            <div class="pv__border-card" style="border-radius:var(--sf-radius-{r});border-width:var(--sf-border-width-1,1px)">
              <span>radius-{r}</span>
            </div>
          {/each}
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Border color variants — --sf-color-border-*</p>
        <div class="pv__borders">
          {#each ['border','border--subtle','border--strong','border--focus','border--disabled','border--translucent'] as b (b)}
            <div class="pv__border-row">
              <div style="flex:1;border-bottom:2px solid var(--sf-color-{b})"></div>
              <code class="pv__border-label">--sf-color-{b}</code>
            </div>
          {/each}
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Focus ring — --sf-focus-ring-*</p>
        <div class="pv__chips" style="gap:16px">
          <button class="pv__btn pv__btn--primary pv__btn--focused" tabindex="-1">Primary focused</button>
          <button class="pv__btn pv__btn--outline pv__btn--focused" tabindex="-1">Outline focused</button>
          <button class="pv__btn pv__btn--ghost pv__btn--focused" tabindex="-1">Ghost focused</button>
        </div>
        <div class="pv__chips" style="margin-top:8px">
          <code class="pv__code">--sf-focus-ring-width</code>
          <code class="pv__code">--sf-focus-ring-color</code>
          <code class="pv__code">--sf-focus-ring-offset</code>
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Border widths — --sf-border-width-*</p>
        <div class="pv__weights">
          {#each [1,2,3,4] as w (w)}
            <div style="border-bottom:calc(var(--sf-border-width-{w},{w}px)) solid var(--sf-color-border,rgba(127,127,127,.4));padding-block:8px;font-size:11px;font-family:monospace;color:var(--sf-color-text--muted)">--sf-border-width-{w} ({w}px default)</div>
          {/each}
        </div>
      </section>

      {/if}

      <!-- ═══════════ SHADOWS ═══════════ -->
      {#if activeSection === 'shadows'}

      <section class="pv__block">
        <p class="pv__eyebrow">Elevation ramp — --sf-shadow-*</p>
        <div class="pv__elev-row">
          {#each ['xs','s','m','l','xl','2xl'] as s (s)}
            <div class="pv__elev-card" style="box-shadow:var(--sf-shadow-{s})">
              <code class="pv__elev-label">{s}</code>
            </div>
          {/each}
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Shadows on real UI components</p>
        <div class="pv__shadow-ui">
          <div class="pv__card" style="box-shadow:var(--sf-shadow-s)">
            <div class="pv__card-body" style="padding:12px">
              <p class="pv__card-title">Card — shadow-s</p>
              <p class="pv__card-sub">Subtle lift above background</p>
            </div>
          </div>
          <div class="pv__card" style="box-shadow:var(--sf-shadow-m)">
            <div class="pv__card-body" style="padding:12px">
              <p class="pv__card-title">Card — shadow-m</p>
              <p class="pv__card-sub">Default card elevation</p>
            </div>
          </div>
          <div class="pv__card" style="box-shadow:var(--sf-shadow-xl)">
            <div class="pv__card-body" style="padding:12px">
              <p class="pv__card-title">Card — shadow-xl</p>
              <p class="pv__card-sub">Modal / overlay elevation</p>
            </div>
          </div>
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Specialty shadows</p>
        <div class="pv__chips" style="gap:16px;flex-wrap:wrap">
          <span style="text-shadow:var(--sf-text-shadow,0 1px 3px rgba(0,0,0,.4));font-size:var(--sf-text-xl,1.5rem);font-weight:700;color:var(--sf-color-heading)">Text shadow</span>
          <div style="filter:drop-shadow(var(--sf-drop-shadow,0 4px 8px rgba(0,0,0,.2)));display:inline-block">
            <div class="pv__badge" style="background:var(--sf-color-primary);color:var(--sf-color-text--on-primary,#fff);padding:6px 14px;font-size:12px">Drop shadow</div>
          </div>
          <span style="box-shadow:0 0 16px var(--sf-glow-color,var(--sf-color-primary,#4f8cff));padding:6px 14px;border-radius:var(--sf-radius-m);border:1px solid var(--sf-color-primary);color:var(--sf-color-primary)">Glow</span>
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Inner shadow — --sf-shadow-inner</p>
        <div class="pv__chips">
          <div style="box-shadow:var(--sf-shadow-inner,inset 0 2px 4px rgba(0,0,0,.12));background:var(--sf-color-inset,rgba(127,127,127,.1));border:1px solid var(--sf-color-border);border-radius:var(--sf-radius-m);padding:10px 16px;font-size:var(--sf-text-s);color:var(--sf-color-text--secondary)">Inset / inner shadow</div>
        </div>
      </section>

      {/if}

      <!-- ═══════════ MOTION ═══════════ -->
      {#if activeSection === 'motion'}

      <section class="pv__block">
        <p class="pv__eyebrow">Live animations — hit 🐢 above to preview reduced motion</p>
        <div class="pv__motion-demos">
          <div class="pv__motion-cell"><span class="pv__anim pv__anim--pulse" style="background:var(--sf-color-success,#22c55e)"></span><code class="pv__anim-label">pulse</code></div>
          <div class="pv__motion-cell"><span class="pv__anim pv__anim--spin" style="border-color:var(--sf-color-primary,#4f8cff);border-top-color:transparent"></span><code class="pv__anim-label">spin</code></div>
          <div class="pv__motion-cell"><span class="pv__anim pv__anim--bounce" style="background:var(--sf-color-action,#0891b2)"></span><code class="pv__anim-label">bounce</code></div>
          <div class="pv__motion-cell"><span class="pv__anim pv__anim--slide" style="background:var(--sf-color-tertiary,#888)"></span><code class="pv__anim-label">slide·fade</code></div>
          <div class="pv__motion-cell"><span class="pv__anim pv__anim--shimmer" style="background:linear-gradient(90deg,var(--sf-color-neutral-200,#e5e7eb) 25%,var(--sf-color-neutral-100,#f3f4f6) 50%,var(--sf-color-neutral-200,#e5e7eb) 75%);background-size:200% 100%"></span><code class="pv__anim-label">shimmer</code></div>
          <div class="pv__motion-cell"><span class="pv__anim pv__anim--ping" style="background:var(--sf-color-danger,#dc2626)"></span><code class="pv__anim-label">ping</code></div>
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Duration scale — sweeping bar shows the relative timing</p>
        <div class="pv__durations">
          {#each ['instant','fast','normal','slow'] as d (d)}
            <div class="pv__dur-row">
              <code class="pv__dur-label">--sf-duration-{d}</code>
              <div class="pv__dur-track"><span class="pv__dur-bar" style="animation-duration:var(--sf-duration-{d},200ms)"></span></div>
            </div>
          {/each}
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Easing functions — --sf-ease-* (bar sweeps with each easing)</p>
        <div class="pv__eases">
          {#each ['in','out','in-out','spring','bounce'] as e (e)}
            <div class="pv__ease-row">
              <code class="pv__ease-label">--sf-ease-{e}</code>
              <div class="pv__ease-bar" style="--pv-ease:var(--sf-ease-{e},ease)"></div>
            </div>
          {/each}
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Transition on hover — using duration + easing tokens</p>
        <div class="pv__trans-demo">
          <div class="pv__trans-card">Hover me — color transition</div>
          <div class="pv__trans-card pv__trans-card--scale">Hover me — scale transform</div>
        </div>
      </section>

      {/if}

      <!-- ═══════════ EFFECTS ═══════════ -->
      {#if activeSection === 'effects'}

      <section class="pv__block">
        <p class="pv__eyebrow">Blur scale — --sf-blur-*</p>
        <div class="pv__blur-row">
          {#each [['none','0px'],['subtle','2px'],['base','8px'],['strong','16px'],['heavy','40px']] as [label, fb] (label)}
            <div class="pv__blur-item">
              <div class="pv__blur-box" style="backdrop-filter:blur(var(--sf-blur-{label},{fb}));-webkit-backdrop-filter:blur(var(--sf-blur-{label},{fb}))"></div>
              <code class="pv__lp-label">{label}</code>
            </div>
          {/each}
        </div>
        <p class="pv__muted" style="margin-top:6px">Applied as backdrop-filter — requires a translucent background to be visible.</p>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Opacity scale — --sf-opacity-*</p>
        <div class="pv__opac-row">
          {#each [['disabled','0.4'],['muted','0.6'],['subtle','0.75'],['mid','0.85'],['full','1.0']] as [label, fb] (label)}
            <div class="pv__opac-item" style="opacity:var(--sf-opacity-{label},{fb})">
              <div class="pv__badge" style="background:var(--sf-color-primary);color:var(--sf-color-text--on-primary,#fff);padding:4px 10px">{label}</div>
              <code class="pv__lp-label" style="opacity:1">{fb}</code>
            </div>
          {/each}
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Scrim / overlay — --sf-scrim · --sf-overlay</p>
        <div class="pv__scrim-demo">
          <div class="pv__scrim-photo">
            <div class="pv__scrim-layer" style="background:var(--sf-scrim,rgba(0,0,0,0.5))">
              <span style="color:#fff;font-weight:600;font-size:var(--sf-text-s)">--sf-scrim overlay</span>
            </div>
          </div>
          <div class="pv__scrim-photo pv__scrim-photo--alt">
            <div class="pv__scrim-layer" style="background:var(--sf-overlay,rgba(0,0,0,0.3))">
              <span style="color:#fff;font-weight:600;font-size:var(--sf-text-s)">--sf-overlay</span>
            </div>
          </div>
        </div>
      </section>

      <section class="pv__block">
        <p class="pv__eyebrow">Frosted glass — backdrop-filter + surface</p>
        <div class="pv__glass-demo">
          <div class="pv__glass-bg">
            <div class="pv__glass-panel">
              <p style="margin:0;font-weight:600;font-size:var(--sf-text-s)">Glass surface</p>
              <p class="pv__muted" style="margin:4px 0 0">backdrop-filter: blur + translucent surface color</p>
            </div>
          </div>
        </div>
      </section>

      {/if}

    </div>
  </div>
  </div>
</section>

<style>
  /* ── Shell ── */
  .preview { grid-area: preview; display: flex; flex-direction: column; min-width: 0; min-height: 0; height: 100%; overflow: hidden; background: var(--cfg-surface); border-left: 1px solid var(--cfg-border); }
  .preview__bar { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 10px 16px; border-bottom: 1px solid var(--cfg-border); flex-wrap: wrap; }
  .preview__sections { display: flex; overflow-x: auto; padding: 5px 10px; gap: 0; border-bottom: 1px solid var(--cfg-border); flex-shrink: 0; scrollbar-width: none; }
  .preview__sections::-webkit-scrollbar { display: none; }
  .preview__sec-btn { padding-inline: 10px; font-size: 11.5px; white-space: nowrap; flex-shrink: 0; }
  .preview__viewports { flex-shrink: 0; }
  .preview__vp-btn { padding-inline: 9px; font-size: 11.5px; }
  .preview__viewport { flex: 1; overflow: auto; background: var(--cfg-bg-2); padding: 0; min-height: 0; }
  .preview__stage { background: var(--sf-color-bg, #fff); color: var(--sf-color-text, #111); min-height: 100%; transition: max-inline-size 0.15s ease; }
  .preview__stage--rm,
  .preview__stage--rm *,
  .preview__stage--rm *::before,
  .preview__stage--rm *::after { animation-duration: 0s !important; animation-delay: 0s !important; transition-duration: 0s !important; transition-delay: 0s !important; }
  .preview__title { display: inline-flex; align-items: center; gap: 8px; }
  .preview__dot { width: 8px; height: 8px; border-radius: 50%; background: var(--cfg-ok); box-shadow: 0 0 0 3px rgba(90,210,122,.18); }
  .preview__hint { font-size: 11px; color: var(--cfg-text-faint); text-transform: capitalize; }
  .preview__modes :global(.cfg-seg__btn) { padding: 4px 9px; font-size: 12px; }
  .preview__fullscreen { width: 26px; height: 26px; padding: 0; font-size: 14px; line-height: 1; color: var(--cfg-text-muted); background: var(--cfg-surface-2); border: 1px solid var(--cfg-border-strong); border-radius: var(--cfg-radius-s); cursor: pointer; flex-shrink: 0; display: inline-grid; place-items: center; }
  .preview__fullscreen:hover { color: var(--cfg-text); border-color: var(--cfg-accent-strong); }
  .preview:fullscreen { background: var(--cfg-bg); }
  .preview:fullscreen .preview__close { display: none; }
  .preview__close { display: none; margin-left: auto; width: 26px; height: 26px; padding: 0; font-size: 13px; line-height: 1; color: var(--cfg-text-muted); background: var(--cfg-surface-2); border: 1px solid var(--cfg-border-strong); border-radius: var(--cfg-radius-s); cursor: pointer; flex-shrink: 0; }
  .preview__close:hover { color: var(--cfg-text); border-color: var(--cfg-accent-strong); }
  @media (max-width: 1100px) {
    .preview__close { display: inline-grid; place-items: center; min-width: 44px; min-height: 44px; }
    .preview__hint { display: none; }
    .preview__bar { flex-wrap: wrap; gap: 8px; }
  }
  @media (max-width: 430px) {
    .preview__vp-text { display: none; }
    .preview__vp-btn { padding-inline: 7px; }
  }

  /* ── Sample UI base ── */
  .pv { font-family: var(--sf-font-body, system-ui, sans-serif); padding: clamp(16px, 3vw, 32px); display: flex; flex-direction: column; gap: var(--sf-space-l, 24px); }
  .pv__block { display: flex; flex-direction: column; gap: 8px; margin: 0; }
  .pv__eyebrow { margin: 0; font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--sf-color-text--muted, #888); }
  .pv__h { font-family: var(--sf-font-heading, inherit); font-size: var(--sf-text-2xl, 2rem); line-height: var(--sf-leading-tight, 1.15); margin: 0; color: var(--sf-color-heading, inherit); }
  .pv__p { font-size: var(--sf-text-m, 1rem); margin: 0; max-width: 60ch; color: var(--sf-color-text--secondary, inherit); }
  .pv__muted { margin: 0; font-size: var(--sf-text-s, .85rem); color: var(--sf-color-text--muted, inherit); }
  .pv__display { margin: 0; font-family: var(--sf-font-display, var(--sf-font-heading, inherit)); font-weight: var(--sf-font-weight-display, 800); color: var(--sf-color-heading, inherit); line-height: 1.05; overflow-wrap: anywhere; }
  .pv__display--l { font-size: var(--sf-text-display-l, 3rem); }
  .pv__display--m { font-size: var(--sf-text-display-m, 2.4rem); }
  .pv__display--s { font-size: var(--sf-text-display-s, 1.9rem); }
  .pv__a { color: var(--sf-color-link, #4f8cff); }
  .pv__code { font-family: var(--sf-font-mono, monospace); background: var(--sf-color-inset, rgba(127,127,127,.15)); padding: .1em .4em; border-radius: var(--sf-radius-s, 4px); color: var(--sf-color-code, inherit); font-size: .9em; }
  .pv__mark { background: var(--sf-color-mark-bg, #fef08a); color: var(--sf-color-mark-text, inherit); padding: 0 2px; }
  .pv__kbd { font-family: var(--sf-font-mono, monospace); background: var(--sf-color-inset, #f1f5f9); border: 1px solid var(--sf-color-border, #cbd5e1); border-radius: var(--sf-radius-s, 4px); padding: .1em .4em; font-size: .85em; }
  .pv__scale { display: flex; flex-direction: column; gap: 6px; }
  .pv__scale-row { display: flex; align-items: baseline; gap: 10px; }
  .pv__scale-sample { font-family: var(--sf-font-heading, inherit); color: var(--sf-color-text, inherit); line-height: 1.1; min-width: 2.2em; }
  .pv__scale-row code { font-family: var(--sf-font-mono, monospace); font-size: 11px; color: var(--sf-color-text--muted, inherit); }

  /* ── Overview extras ── */
  .pv__surfaces { display: grid; grid-template-columns: repeat(4,1fr); gap: var(--sf-space-s,8px); }
  .pv__surface { min-height: 54px; border: 1px solid var(--sf-color-border, rgba(127,127,127,.3)); border-radius: var(--sf-radius-s,4px); box-shadow: var(--sf-shadow-s, 0 1px 3px rgba(0,0,0,.1)); display: flex; align-items: flex-end; padding: 6px 8px; font-size: 11px; font-weight: 600; color: var(--sf-color-text--secondary, inherit); }
  .pv__btns { display: flex; gap: var(--sf-space-s,8px); flex-wrap: wrap; }
  .pv__btn { border: 1px solid transparent; border-radius: var(--sf-radius-m,8px); padding: .5em 1.1em; font-weight: 600; font-size: var(--sf-text-s,.9rem); cursor: default; }
  .pv__btn--primary   { background: var(--sf-color-primary,#4f8cff);   color: var(--sf-color-text--on-primary,#fff); }
  .pv__btn--secondary { background: var(--sf-color-secondary,#6b7280); color: var(--sf-color-text--on-secondary,#fff); }
  .pv__btn--action    { background: var(--sf-color-action,#0891b2);    color: var(--sf-color-text--on-action,#fff); }
  .pv__btn--outline   { background: transparent; border-color: var(--sf-color-primary,currentColor); color: var(--sf-color-primary, inherit); }
  .pv__btn--ghost     { background: transparent; border-color: var(--sf-color-border,currentColor); color: inherit; }
  .pv__btn--sm        { padding: .35em .9em; font-size: var(--sf-text-xs,.8rem); }
  .pv__btn--push      { margin-inline-start: auto; }
  .pv__btn--focused   { outline: var(--sf-focus-ring-width,2px) solid var(--sf-focus-ring-color,var(--sf-color-primary,#4f8cff)); outline-offset: var(--sf-focus-ring-offset,2px); }
  .pv__tabs { display: flex; border-bottom: 1px solid var(--sf-color-border, rgba(127,127,127,.3)); flex-wrap: wrap; }
  .pv__tab { background: transparent; border: none; border-bottom: 2px solid transparent; padding: 7px 14px; font-size: var(--sf-text-s,.875rem); font-weight: 500; color: var(--sf-color-text--muted,#888); cursor: default; margin-bottom: -1px; }
  .pv__tab--active { color: var(--sf-color-primary,#4f8cff); border-bottom-color: var(--sf-color-primary,#4f8cff); font-weight: 600; }
  .pv__breadcrumb { display: flex; align-items: center; gap: 4px; font-size: var(--sf-text-s,.875rem); flex-wrap: wrap; }
  .pv__crumb { text-decoration: none; }
  .pv__crumb[aria-current="page"] { color: var(--sf-color-text,inherit); font-weight: 500; }
  .pv__crumb-sep { color: var(--sf-color-text--muted,#888); }
  .pv__alerts { display: flex; flex-direction: column; gap: 6px; }
  .pv__alert { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: var(--sf-radius-s,4px); border-inline-start: 3px solid; font-size: var(--sf-text-s,.85rem); }
  .pv__alert-text { color: var(--sf-color-text,inherit); }
  .pv__badge { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: var(--sf-radius-full,999px); font-size: 10px; font-weight: 700; text-transform: capitalize; white-space: nowrap; }
  .pv__badge--push { margin-inline-start: auto; }
  .pv__card { background: var(--sf-color-surface, rgba(127,127,127,.06)); border: 1px solid var(--sf-color-border, rgba(127,127,127,.3)); border-radius: var(--sf-radius-m,8px); box-shadow: var(--sf-shadow-m, 0 2px 8px rgba(0,0,0,.12)); overflow: hidden; }
  .pv__card-accent { height: 4px; background: var(--sf-color-primary,#4f8cff); }
  .pv__card-body { padding: var(--sf-space-m,16px); display: flex; flex-direction: column; gap: 10px; }
  .pv__card-top { display: flex; align-items: center; gap: 10px; }
  .pv__avatar { width: 36px; height: 36px; border-radius: var(--sf-radius-full,50%); flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-weight: 700; }
  .pv__card-title { margin: 0; font-family: var(--sf-font-heading,inherit); font-size: var(--sf-text-m,1rem); font-weight: 600; color: var(--sf-color-heading,inherit); line-height: 1.3; }
  .pv__card-sub   { margin: 0; font-size: var(--sf-text-xs,.8rem); color: var(--sf-color-text--muted,inherit); line-height: 1.3; }
  .pv__card-text  { margin: 0; font-size: var(--sf-text-s,.9rem); color: var(--sf-color-text--secondary,inherit); }
  .pv__card-footer { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; padding-top: 8px; border-top: 1px solid var(--sf-color-border, rgba(127,127,127,.2)); }
  .pv__form-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px,1fr)); gap: 10px; }
  .pv__field { display: flex; flex-direction: column; gap: 5px; }
  .pv__field-label { font-size: var(--sf-text-xs,.8rem); font-weight: 600; color: var(--sf-color-text--secondary,inherit); }
  .pv__field-input { font-size: var(--sf-text-s,.9rem); padding: 7px 10px; border-radius: var(--sf-radius-s,4px); border: 1px solid var(--sf-color-border, rgba(127,127,127,.4)); background: var(--sf-color-bg,#fff); color: var(--sf-color-text,inherit); }
  .pv__field-label--valid    { color: var(--sf-color-success,#16a34a); }
  .pv__field-label--danger    { color: var(--sf-color-danger,#dc2626); }
  .pv__field-label--disabled { color: var(--sf-color-text--muted,#888); }
  .pv__field-input--valid    { border-color: var(--sf-color-success,#16a34a); background: var(--sf-color-success-subtle, rgba(22,163,74,.08)); }
  .pv__field-input--danger    { border-color: var(--sf-color-danger,#dc2626);   background: var(--sf-color-danger-subtle,  rgba(220,38,38,.08)); }
  .pv__field-input--disabled { opacity: .5; cursor: not-allowed; background: var(--sf-color-inset, rgba(127,127,127,.1)); }
  .pv__field-hint         { font-size: var(--sf-text-xs,.75rem); margin-top: -2px; }
  .pv__field-hint--valid  { color: var(--sf-color-success,#16a34a); }
  .pv__field-hint--danger  { color: var(--sf-color-danger,#dc2626); }
  .pv__space { display: flex; flex-direction: column; gap: 4px; }
  .pv__space-row { display: flex; align-items: center; gap: 10px; font-size: 12px; overflow: hidden; }
  .pv__space-row code { font-family: var(--sf-font-mono,monospace); min-width: 13ch; flex-shrink: 0; color: var(--sf-color-text--muted,inherit); }
  .pv__space-bar { block-size: 12px; max-inline-size: 100%; background: var(--sf-color-action,#4f8cff); border-radius: 3px; flex-shrink: 1; }
  .pv__radii { display: flex; gap: 12px; flex-wrap: wrap; }
  .pv__radii-item { display: flex; flex-direction: column; align-items: center; gap: 4px; font-family: var(--sf-font-mono,monospace); font-size: 11px; color: var(--sf-color-text--muted,inherit); }
  .pv__radii-box { width: 56px; height: 56px; background: var(--sf-color-primary,#4f8cff); display: block; }
  .pv__shadows { display: grid; grid-template-columns: repeat(auto-fit, minmax(80px,1fr)); gap: 14px; padding: 8px 6px; }
  .pv__shadow-item { aspect-ratio: 1; background: var(--sf-color-surface,#fff); border-radius: var(--sf-radius-m,8px); display: grid; place-items: center; color: var(--sf-color-text--muted,inherit); font-family: var(--sf-font-mono,monospace); font-size: 11px; }
  .pv__gradients { display: grid; grid-template-columns: repeat(auto-fit, minmax(80px,1fr)); gap: 6px; }
  .pv__grad { aspect-ratio: 2; border-radius: var(--sf-radius-m,8px); border: 1px solid transparent; display: flex; align-items: flex-end; padding: 6px 8px; }
  .pv__grad--bordered { border-color: var(--sf-color-border, rgba(127,127,127,.3)); }
  .pv__grad-label { font-size: 12px; font-weight: 600; text-transform: capitalize; color: #fff; text-shadow: 0 1px 3px rgba(0,0,0,.5); }
  .pv__grad-label--muted { color: var(--sf-color-text--muted,#555); text-shadow: none; }

  /* ── Motion ── */
  .pv__motion-demos { display: flex; gap: var(--sf-space-l,24px); flex-wrap: wrap; padding: 4px 0; }
  .pv__motion-cell { display: flex; flex-direction: column; align-items: center; gap: 8px; }
  .pv__anim-label { font-family: var(--sf-font-mono,monospace); font-size: 10px; color: var(--sf-color-text--muted,#888); white-space: nowrap; }
  .pv__anim { display: block; width: 28px; height: 28px; border-radius: var(--sf-radius-full,999px); }
  @keyframes pv-pulse  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.8)} }
  @keyframes pv-spin   { to{transform:rotate(360deg)} }
  @keyframes pv-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes pv-slide  { 0%{opacity:.25;transform:translateX(-10px)} 50%{opacity:1;transform:translateX(0)} 100%{opacity:.25;transform:translateX(10px)} }
  @keyframes pv-sweep  { 0%{transform:scaleX(0);transform-origin:left} 50%{transform:scaleX(1);transform-origin:left} 51%{transform:scaleX(1);transform-origin:right} 100%{transform:scaleX(0);transform-origin:right} }
  @keyframes pv-shimmer{ 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  @keyframes pv-ping   { 0%{transform:scale(1);opacity:1} 75%,100%{transform:scale(2);opacity:0} }
  .pv__anim--pulse   { animation: pv-pulse var(--sf-duration-slow,900ms) var(--sf-ease-in-out,ease-in-out) infinite; }
  .pv__anim--spin    { border: 3px solid; border-radius: var(--sf-radius-full,999px); animation: pv-spin var(--sf-duration-slow,700ms) linear infinite; }
  .pv__anim--bounce  { border-radius: var(--sf-radius-m,8px); animation: pv-bounce var(--sf-duration-slow,700ms) var(--sf-ease-in-out,ease-in-out) infinite; }
  .pv__anim--slide   { border-radius: var(--sf-radius-m,8px); animation: pv-slide calc(var(--sf-duration-slow,700ms) * 1.5) var(--sf-ease-in-out,ease-in-out) infinite; }
  .pv__anim--shimmer { border-radius: var(--sf-radius-m,8px); animation: pv-shimmer 2s linear infinite; background-size: 200% 100% !important; }
  .pv__anim--ping    { animation: pv-ping 1.5s cubic-bezier(0,0,.2,1) infinite; }
  .pv__durations { display: flex; flex-direction: column; gap: 5px; margin-top: 4px; }
  .pv__dur-row { display: flex; align-items: center; gap: 10px; overflow: hidden; }
  .pv__dur-label { font-family: var(--sf-font-mono,monospace); font-size: 11px; color: var(--sf-color-text--muted,#888); min-width: 16ch; flex-shrink: 0; }
  .pv__dur-track { flex: 1; height: 10px; background: var(--sf-color-inset, rgba(127,127,127,.12)); border-radius: var(--sf-radius-full,999px); overflow: hidden; }
  .pv__dur-bar { display: block; height: 100%; background: var(--sf-color-primary,#4f8cff); border-radius: inherit; animation: pv-sweep var(--sf-duration-normal,250ms) linear infinite; }

  /* ── Colors section ── */
  .pv__swatches { display: grid; grid-template-columns: repeat(auto-fit, minmax(70px,1fr)); gap: 6px; }
  .pv__swatches--compact { grid-template-columns: repeat(auto-fit, minmax(54px,1fr)); }
  .pv__sw { aspect-ratio: 3/2; border-radius: var(--sf-radius-m,8px); border: 1px solid transparent; display: flex; align-items: flex-end; padding: 4px 6px; font-size: 10px; text-transform: capitalize; font-weight: 600; }
  .pv__sw--sm   { aspect-ratio: 2/1; font-size: 9px; }
  .pv__sw--tall { aspect-ratio: 2/1.3; }
  .pv__sw--bordered { border-color: var(--sf-color-border, rgba(127,127,127,.3)); }
  .pv__sw-dark  { color: var(--sf-color-text--secondary,#555); font-size: 9px; }
  .pv__chips { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
  .pv__chip  { padding: 4px 10px; border-radius: var(--sf-radius-m,8px); font-size: 11px; font-weight: 600; }
  .pv__text-hier { display: flex; flex-direction: column; gap: 4px; font-size: var(--sf-text-m,1rem); }
  .pv__borders { display: flex; flex-direction: column; gap: 10px; }
  .pv__border-row { display: flex; align-items: center; gap: 10px; padding-block: 4px; }
  .pv__border-label { font-family: var(--sf-font-mono,monospace); font-size: 10px; color: var(--sf-color-text--muted,#888); white-space: nowrap; flex-shrink: 0; }

  /* ── Palette section ── */
  .pv__pal-row { display: flex; gap: 4px; overflow-x: auto; }
  .pv__pal-row--checker { background: repeating-conic-gradient(rgba(127,127,127,.15) 0 90deg, transparent 0 180deg) 0 0 / 1rem 1rem; padding: 6px; border-radius: var(--sf-radius-s,4px); }
  .pv__pal { flex: 1; min-width: 2.2rem; aspect-ratio: 1; border-radius: var(--sf-radius-s,4px); display: flex; align-items: flex-end; padding: 2px 3px; font-size: 8px; font-weight: 700; }
  .pv__lumlocker-grid { display: flex; flex-direction: column; gap: 10px; }
  .pv__theme-demo { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .pv__theme-panel { padding: 12px; border-radius: var(--sf-radius-m,8px); }
  .pv__theme-panel--light { background: var(--sf-color-surface,#fff); border: 1px solid var(--sf-color-border,#ddd); color: var(--sf-color-text,#111); }
  .pv__theme-panel--dark  { background: #1a1a2e; border: 1px solid #333; color: #eee; }

  /* ── Typography section ── */
  .pv__headings { display: flex; flex-direction: column; gap: 2px; background: var(--sf-color-inset, rgba(127,127,127,.08)); padding: 12px; border-radius: var(--sf-radius-m,8px); }
  .pv__nh { margin: 0; font-family: var(--sf-font-heading,inherit); color: var(--sf-color-heading,inherit); }
  .pv__weights { display: flex; flex-direction: column; gap: 4px; }
  .pv__leading-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(12rem,1fr)); gap: 8px; }
  .pv__leading-cell { background: var(--sf-color-inset, rgba(127,127,127,.08)); padding: 10px; border-radius: var(--sf-radius-s,4px); }
  .pv__leading-cell p { margin: 0; color: var(--sf-color-text--secondary,inherit); }
  .pv__pre { background: var(--sf-color-inset,#f1f5f9); border: 1px solid var(--sf-color-border,#e2e8f0); border-radius: var(--sf-radius-s,4px); padding: 10px 12px; font-family: var(--sf-font-mono,monospace); font-size: 12px; overflow-x: auto; margin: 0; }
  .pv__blockquote { border-inline-start: 3px solid var(--sf-color-primary,#4f8cff); padding-inline-start: 12px; color: var(--sf-color-text--secondary,inherit); margin: 0; font-style: italic; }

  /* ── Layout section ── */
  .pv__box { padding: 8px 10px; background: var(--sf-color-primary-subtle, rgba(79,140,255,.12)); color: var(--sf-color-primary,#4f8cff); border: 1px solid var(--sf-color-primary-muted, rgba(79,140,255,.25)); border-radius: var(--sf-radius-s,4px); font-size: 11px; font-weight: 600; text-align: center; min-height: 2rem; display: flex; align-items: center; justify-content: center; }
  .pv__box--alt    { background: var(--sf-color-tertiary-subtle, rgba(136,88,255,.12)); color: var(--sf-color-tertiary,#8858ff); border-color: var(--sf-color-tertiary-muted, rgba(136,88,255,.25)); }
  .pv__box--action { background: var(--sf-color-action-subtle,   rgba(8,145,178,.12));  color: var(--sf-color-action,#0891b2);   border-color: var(--sf-color-action-muted,   rgba(8,145,178,.25)); }
  .pv__lp-row  { display: flex; gap: 12px; flex-wrap: wrap; align-items: flex-start; }
  .pv__lp-col  { display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .pv__lp-col--wide { min-width: 8rem; }
  .pv__lp-stack2 { display: flex; flex-direction: column; gap: 10px; }
  .pv__lp-wrap   { background: var(--sf-color-inset, rgba(127,127,127,.06)); padding: 8px; border-radius: var(--sf-radius-s,4px); }
  .pv__lp-label  { font-family: var(--sf-font-mono,monospace); font-size: 10px; color: var(--sf-color-text--muted,#888); }

  /* ── Macros section ── */
  .pv__macro-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(9rem,1fr)); gap: 6px; }
  .pv__surface-cell { padding: 8px 10px; border-radius: var(--sf-radius-m,8px); font-size: 11px; font-weight: 600; min-height: 2.5rem; display: flex; align-items: center; border: 1px solid var(--sf-color-border, rgba(127,127,127,.2)); }
  .pv__photo { position: relative; height: 6rem; border-radius: var(--sf-radius-m,8px); overflow: hidden; background: linear-gradient(135deg, var(--sf-color-tertiary,#8858ff), var(--sf-color-action,#0891b2)); display: grid; place-items: center; }
  .pv__tag { display: inline-flex; padding: 4px 10px; background: var(--sf-color-surface,#fff); border: 1px solid var(--sf-color-border, rgba(127,127,127,.3)); border-radius: var(--sf-radius-m,8px); font-size: 11px; white-space: nowrap; }
  .pv__tbl { font-size: var(--sf-text-s,.875rem); border-collapse: collapse; }
  .pv__tbl td { padding: 4px 12px 4px 0; color: var(--sf-color-text--secondary,inherit); }
  .pv__tbl td:last-child { text-align: right; font-family: var(--sf-font-mono,monospace); }
  .pv__state-cell { padding: 8px 10px; border-radius: var(--sf-radius-m,8px); font-size: 11px; font-weight: 600; min-height: 2.5rem; display: flex; align-items: center; background: var(--sf-color-surface,#fff); border: 1px solid var(--sf-color-border, rgba(127,127,127,.2)); color: var(--sf-color-text,inherit); }
  .pv__state--active   { background: var(--sf-color-primary-subtle, rgba(79,140,255,.12)); color: var(--sf-color-primary,#4f8cff); border-color: var(--sf-color-primary-muted, rgba(79,140,255,.3)); }
  .pv__state--current  { background: var(--sf-color-primary,#4f8cff); color: var(--sf-color-text--on-primary,#fff); border-color: transparent; }
  .pv__state--pressed  { background: var(--sf-color-primary-subtle, rgba(79,140,255,.2)); color: var(--sf-color-primary,#4f8cff); border-color: var(--sf-color-primary,#4f8cff); }
  .pv__state--open     { background: var(--sf-color-action-subtle, rgba(8,145,178,.12)); color: var(--sf-color-action,#0891b2); border-color: var(--sf-color-action-muted, rgba(8,145,178,.3)); }
  .pv__state--loading  { opacity: .6; background: var(--sf-color-inset, rgba(127,127,127,.1)); }
  .pv__state--disabled { opacity: .4; cursor: not-allowed; }
  .pv__state--danger  { background: var(--sf-color-danger-subtle, rgba(220,38,38,.08)); color: var(--sf-color-danger,#dc2626); border-color: var(--sf-color-danger,#dc2626); }
  .pv__state--valid    { background: var(--sf-color-success-subtle, rgba(22,163,74,.08)); color: var(--sf-color-success,#16a34a); border-color: var(--sf-color-success,#16a34a); }

  /* ── Tokens section ── */
  .pv__z-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(9rem,1fr)); gap: 6px; }
  .pv__z-chip { padding: 6px 8px; background: var(--sf-color-surface,#fff); border: 1px solid var(--sf-color-border, rgba(127,127,127,.2)); border-radius: var(--sf-radius-s,4px); font-family: var(--sf-font-mono,monospace); font-size: 10px; color: var(--sf-color-text--muted,#888); }
  .pv__eases { display: flex; flex-direction: column; gap: 8px; }
  .pv__ease-row { display: flex; align-items: center; gap: 10px; }
  .pv__ease-label { font-family: var(--sf-font-mono,monospace); font-size: 11px; color: var(--sf-color-text--muted,#888); min-width: 14ch; flex-shrink: 0; }
  .pv__ease-bar { height: 8px; flex: 1; background: var(--sf-color-primary,#4f8cff); border-radius: 4px; transform-origin: left; animation: pv-sweep 2s var(--pv-ease,ease) infinite; }

  /* ── Gradients section ── */
  .pv__grad-card { display: flex; flex-direction: column; gap: 8px; border-radius: var(--sf-radius-m,8px); overflow: hidden; border: 1px solid var(--sf-color-border,rgba(127,127,127,.3)); }
  .pv__grad-card__hero { padding: 20px 16px 16px; display: flex; flex-direction: column; gap: 4px; min-height: 5rem; }
  .pv__grad-card__title { margin: 0; font-size: var(--sf-text-xl,1.5rem); font-weight: 700; color: #fff; text-shadow: 0 1px 4px rgba(0,0,0,.4); }
  .pv__grad-card__sub { margin: 0; font-size: var(--sf-text-s,.875rem); color: rgba(255,255,255,.8); }
  .pv__grad-card__row { display: flex; gap: 6px; padding: 8px; background: var(--sf-color-inset,rgba(127,127,127,.06)); }
  .pv__grad-card__chip { flex: 1; min-height: 2.5rem; border-radius: var(--sf-radius-m,8px); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,.3); }

  /* ── Spacing section ── */
  .pv__space--full .pv__space-row { padding-block: 2px; }
  .pv__sp-demos { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px,1fr)); gap: 10px; }
  .pv__sp-card { background: var(--sf-color-inset,rgba(127,127,127,.06)); border: 1px solid var(--sf-color-border,rgba(127,127,127,.2)); border-radius: var(--sf-radius-m,8px); padding: 10px; display: flex; flex-direction: column; gap: 8px; }
  .pv__sp-card__inner { display: flex; flex-direction: column; }
  .pv__sec-demo { background: var(--sf-color-inset,rgba(127,127,127,.06)); border: 1px solid var(--sf-color-border,rgba(127,127,127,.2)); border-radius: var(--sf-radius-m,8px); padding: var(--sf-section-pad,clamp(2rem,5vw,5rem)) var(--sf-gutter,1.5rem); }
  .pv__sec-inner { display: flex; flex-direction: column; gap: var(--sf-content-gap,clamp(1rem,3vw,2rem)); }

  /* ── Borders section ── */
  .pv__border-cards { display: flex; flex-wrap: wrap; gap: 10px; }
  .pv__border-card { padding: 12px 16px; background: var(--sf-color-surface,#fff); border: 1px solid var(--sf-color-border,rgba(127,127,127,.3)); font-size: 11px; font-family: monospace; color: var(--sf-color-text--muted,#888); min-width: 6rem; display: flex; align-items: center; justify-content: center; }

  /* ── Shadows section ── */
  .pv__elev-row { display: flex; gap: 16px; flex-wrap: wrap; align-items: flex-end; padding: 12px 4px 20px; }
  .pv__elev-card { background: var(--sf-color-surface,#fff); border-radius: var(--sf-radius-m,8px); width: 72px; height: 72px; display: grid; place-items: center; border: 1px solid var(--sf-color-border,rgba(127,127,127,.1)); }
  .pv__elev-label { font-family: monospace; font-size: 10px; color: var(--sf-color-text--muted,#888); }
  .pv__shadow-ui { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px,1fr)); gap: 16px; padding: 8px 4px 4px; }

  /* ── Motion section ── */
  .pv__trans-demo { display: flex; gap: 12px; flex-wrap: wrap; }
  .pv__trans-card { padding: 12px 20px; background: var(--sf-color-surface,#fff); border: 1px solid var(--sf-color-border,rgba(127,127,127,.3)); border-radius: var(--sf-radius-m,8px); font-size: var(--sf-text-s,.875rem); font-weight: 500; cursor: default; transition: background var(--sf-duration-normal,250ms) var(--sf-ease-out,ease-out), color var(--sf-duration-normal,250ms) var(--sf-ease-out,ease-out), box-shadow var(--sf-duration-normal,250ms) var(--sf-ease-out,ease-out); }
  .pv__trans-card:hover { background: var(--sf-color-primary,#4f8cff); color: var(--sf-color-text--on-primary,#fff); box-shadow: var(--sf-shadow-m,0 2px 8px rgba(0,0,0,.15)); }
  .pv__trans-card--scale { transition: transform var(--sf-duration-normal,250ms) var(--sf-ease-spring,cubic-bezier(.34,1.56,.64,1)); }
  .pv__trans-card--scale:hover { transform: scale(1.06); }

  /* ── Effects section ── */
  .pv__blur-row { display: flex; gap: 10px; flex-wrap: wrap; }
  .pv__blur-item { display: flex; flex-direction: column; align-items: center; gap: 5px; }
  .pv__blur-box { width: 70px; height: 70px; border-radius: var(--sf-radius-m,8px); background: var(--sf-color-surface,rgba(255,255,255,.3)); border: 1px solid var(--sf-color-border,rgba(255,255,255,.3)); position: relative; overflow: hidden; }
  .pv__blur-box::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg,var(--sf-color-primary,#4f8cff),var(--sf-color-tertiary,#8858ff)); opacity: 0.7; }
  .pv__opac-row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
  .pv__opac-item { display: flex; flex-direction: column; align-items: center; gap: 5px; }
  .pv__scrim-demo { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .pv__scrim-photo { height: 80px; border-radius: var(--sf-radius-m,8px); overflow: hidden; background: linear-gradient(135deg,var(--sf-color-primary,#4f8cff),var(--sf-color-action,#0891b2)); position: relative; }
  .pv__scrim-photo--alt { background: linear-gradient(135deg,var(--sf-color-tertiary,#8858ff),var(--sf-color-secondary,#6b7280)); }
  .pv__scrim-layer { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
  .pv__glass-demo { border-radius: var(--sf-radius-m,8px); overflow: hidden; }
  .pv__glass-bg { padding: 24px; background: linear-gradient(135deg,var(--sf-color-primary,#4f8cff) 0%,var(--sf-color-tertiary,#8858ff) 50%,var(--sf-color-action,#0891b2) 100%); display: flex; align-items: center; justify-content: center; min-height: 8rem; }
  .pv__glass-panel { background: rgba(255,255,255,.15); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,.3); border-radius: var(--sf-radius-m,8px); padding: 16px 20px; color: #fff; max-width: 280px; width: 100%; }
</style>
