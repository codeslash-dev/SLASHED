<script>
  /**
   * Scoped live preview.
   *
   * Every framework default + the user's overrides are applied as CSS custom
   * properties on the preview root via an inline style string, so the sample
   * UI below resolves tokens exactly as the real framework would — including
   * `light-dark()` and `oklch(from …)`.
   */
  import { overrides, ui } from '../lib/store.svelte.js';
  import { buildPreviewDeclarations } from '../lib/preview.js';

  /** Viewport width presets — the breakpoints the framework's fluid scale targets. */
  const VIEWPORTS = [
    { id: 'mobile',  label: '📱 Mobile',  width: 360,  hint: '360 px' },
    { id: 'tablet',  label: '📱 Tablet',  width: 768,  hint: '768 px' },
    { id: 'laptop',  label: '💻 Laptop',  width: 1024, hint: '1024 px' },
    { id: 'desktop', label: '🖥️ Desktop', width: 1440, hint: '1440 px' },
    { id: 'fluid',   label: '🌊 Fluid',   width: null, hint: 'fill pane' },
  ];

  // Combine the framework cascade with optional reduced-motion override.
  // The reduced-motion override is preview-only — it never touches the
  // user's actual override map, so they keep whatever motion-scale they
  // edited even while previewing the a11y experience.
  const baseStyle = $derived(buildPreviewDeclarations(overrides, ui.previewTheme));
  const styleStr = $derived(
    ui.previewMotion === 'reduced'
      ? `${baseStyle}\n--sf-motion-scale: 0;`
      : baseStyle
  );

  const activeViewport = $derived(VIEWPORTS.find((v) => v.id === ui.previewWidth) ?? VIEWPORTS[VIEWPORTS.length - 1]);

  const brand = ['primary', 'secondary', 'tertiary', 'action', 'neutral', 'base'];
  const status = ['success', 'warning', 'error', 'info', 'danger'];
  const surfaces = [
    { var: 'inset', label: 'Inset' },
    { var: 'bg', label: 'Background' },
    { var: 'surface', label: 'Surface' },
    { var: 'raised', label: 'Raised' },
  ];
  const spaceSteps = ['2xs', 'xs', 's', 'm', 'l', 'xl', '2xl', '3xl'];
  const typeScale = ['2xl', 'xl', 'l', 'm', 's', 'xs'];
  const radii = ['s', 'm', 'l', 'xl', 'full'];
  const shadows = ['s', 'm', 'l', 'xl'];
</script>

<section class="preview">
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
          title="{v.label} — {v.hint}"
        >{v.label}</button>
      {/each}
    </div>
    <span class="preview__hint">
      {ui.previewTheme}{ui.previewMotion === 'reduced' ? ' · reduced motion' : ''}{activeViewport.width ? ` · ${activeViewport.width} px` : ''}
    </span>
  </header>

  <div class="preview__viewport">
    <div
      class="preview__stage"
      class:preview__stage--rm={ui.previewMotion === 'reduced'}
      style="{styleStr}{activeViewport.width ? `;max-inline-size:${activeViewport.width}px;margin-inline:auto;box-shadow:0 0 0 1px var(--cfg-border) inset;` : ''}"
    >
    <div class="pv">
      <!-- Typography -->
      <section class="pv__block">
        <p class="pv__eyebrow">Typography</p>
        <h2 class="pv__h">The quick brown fox</h2>
        <p class="pv__p">
          Jumps over the lazy dog. This paragraph uses the framework's body
          font, text size and <a class="pv__a" href="#a">an inline link</a>
          with <code class="pv__code">--sf-color-code</code> styling inline code.
        </p>
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
              <span class="pv__scale-sample" style="font-size: var(--sf-text-{s});">Aa</span>
              <code>--sf-text-{s}</code>
            </div>
          {/each}
        </div>
      </section>

      <!-- Surfaces / elevation -->
      <section class="pv__block">
        <p class="pv__eyebrow">Surfaces</p>
        <div class="pv__surfaces">
          {#each surfaces as s (s.var)}
            <div class="pv__surface" style="background: var(--sf-color-{s.var});">
              <span>{s.label}</span>
            </div>
          {/each}
        </div>
      </section>

      <!-- Brand + status -->
      <section class="pv__block">
        <p class="pv__eyebrow">Brand &amp; status</p>
        <div class="pv__swatches">
          {#each brand as c (c)}
            <div class="pv__sw" style="background: var(--sf-color-{c});">
              <span style="color: var(--sf-color-text--on-{c}, #fff);">{c}</span>
            </div>
          {/each}
        </div>
        <div class="pv__swatches">
          {#each status as c (c)}
            <div class="pv__sw" style="background: var(--sf-color-{c});">
              <span style="color: var(--sf-color-text--on-{c}, #fff);">{c}</span>
            </div>
          {/each}
        </div>
      </section>

      <!-- Buttons -->
      <section class="pv__block">
        <p class="pv__eyebrow">Buttons</p>
        <div class="pv__btns">
          <button class="pv__btn pv__btn--primary">Primary</button>
          <button class="pv__btn pv__btn--secondary">Secondary</button>
          <button class="pv__btn pv__btn--action">Action</button>
          <button class="pv__btn pv__btn--outline">Outline</button>
          <button class="pv__btn pv__btn--ghost">Ghost</button>
        </div>
      </section>

      <!-- Feedback -->
      <section class="pv__block">
        <p class="pv__eyebrow">Feedback</p>
        <div class="pv__alerts">
          {#each status as c (c)}
            <div
              class="pv__alert"
              style="background: var(--sf-color-{c}-subtle); border-inline-start-color: var(--sf-color-{c});"
            >
              <span class="pv__badge" style="background: var(--sf-color-{c}); color: var(--sf-color-text--on-{c}, #fff);">{c}</span>
              <span class="pv__alert-text">{c} message — readable on its own subtle tint.</span>
            </div>
          {/each}
        </div>
      </section>

      <!-- Card -->
      <section class="pv__block">
        <p class="pv__eyebrow">Card component</p>
        <div class="pv__card">
          <div class="pv__card-accent"></div>
          <div class="pv__card-body">
            <div class="pv__card-top">
              <div class="pv__avatar" style="background: var(--sf-color-secondary); color: var(--sf-color-text--on-secondary, #fff);">S</div>
              <div>
                <p class="pv__card-title">Card Component</p>
                <p class="pv__card-sub">Design token preview</p>
              </div>
              <span class="pv__badge pv__badge--push" style="background: var(--sf-color-success); color: var(--sf-color-text--on-success, #fff);">Active</span>
            </div>
            <p class="pv__card-text">
              Radius, shadow, colours, surfaces and typography working together
              — every value updates live as you adjust tokens.
            </p>
            <div class="pv__card-footer">
              <span class="pv__badge" style="background: var(--sf-color-info); color: var(--sf-color-text--on-info, #fff);">Info</span>
              <span class="pv__btn pv__btn--action pv__btn--sm pv__btn--push">Save</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Form field -->
      <section class="pv__block">
        <p class="pv__eyebrow">Form field</p>
        <label class="pv__field">
          <span class="pv__field-label">Email address</span>
          <input class="pv__field-input" type="text" placeholder="you@example.com" readonly />
        </label>
      </section>

      <!-- Spacing scale -->
      <section class="pv__block">
        <p class="pv__eyebrow">Spacing scale</p>
        <div class="pv__space">
          {#each spaceSteps as s (s)}
            <div class="pv__space-row">
              <code>--sf-space-{s}</code>
              <span class="pv__space-bar" style="inline-size: var(--sf-space-{s});"></span>
            </div>
          {/each}
        </div>
      </section>

      <!-- Border radii -->
      <section class="pv__block">
        <p class="pv__eyebrow">Border radius</p>
        <div class="pv__radii">
          {#each radii as r (r)}
            <div class="pv__radii-item">
              <span class="pv__radii-box" style="border-radius: var(--sf-radius-{r});"></span>
              <code>{r}</code>
            </div>
          {/each}
        </div>
      </section>

      <!-- Shadows -->
      <section class="pv__block">
        <p class="pv__eyebrow">Shadows</p>
        <div class="pv__shadows">
          {#each shadows as s (s)}
            <div class="pv__shadow-item" style="box-shadow: var(--sf-shadow-{s});">
              <code>{s}</code>
            </div>
          {/each}
        </div>
      </section>
    </div>
  </div>
  </div>
</section>

<style>
  .preview {
    grid-area: preview;
    display: flex;
    flex-direction: column;
    min-height: 0;
    height: 100%;
    background: var(--cfg-surface);
    border-left: 1px solid var(--cfg-border);
  }
  .preview__bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 10px 16px;
    border-bottom: 1px solid var(--cfg-border);
    flex-wrap: wrap;
  }
  .preview__viewports { flex-shrink: 0; }
  .preview__vp-btn {
    padding-inline: 9px;
    font-size: 11.5px;
  }
  .preview__viewport {
    flex: 1;
    overflow: auto;
    background: var(--cfg-bg-2);
    padding: 0;
    min-height: 0;
  }
  .preview__stage {
    /* When a viewport preset is active the stage is constrained inline so
       the surrounding `.preview__viewport` "device frame" is visible; when
       Fluid is active the stage simply fills the pane. */
    background: var(--sf-color-bg, #fff);
    color: var(--sf-color-text, #111);
    min-height: 100%;
    transition: max-inline-size 0.15s ease;
  }
  /* Reduced-motion preview mode disables transitions/animations on EVERY
     element under the stage — the preview-only --sf-motion-scale: 0 already
     zeroes durations declared via the framework, but components that ignore
     the scale still respect this scoped killswitch. */
  .preview__stage--rm,
  .preview__stage--rm *,
  .preview__stage--rm *::before,
  .preview__stage--rm *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
  }
  .preview__title { display: inline-flex; align-items: center; gap: 8px; }
  .preview__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--cfg-ok);
    box-shadow: 0 0 0 3px rgba(90, 210, 122, 0.18);
  }
  .preview__hint {
    font-size: 11px;
    color: var(--cfg-text-faint);
    text-transform: capitalize;
  }
  .preview__stage--orig-was-here { display: none; } /* placeholder eaten */

  /* Sample UI authored against framework tokens with sane fallbacks. */
  .pv {
    font-family: var(--sf-font-body, system-ui, sans-serif);
    padding: clamp(16px, 3vw, 32px);
    display: flex;
    flex-direction: column;
    gap: var(--sf-space-l, 24px);
  }
  .pv__block { display: flex; flex-direction: column; gap: 8px; margin: 0; }
  .pv__eyebrow {
    margin: 0;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--sf-color-text--muted, #888);
  }
  .pv__h {
    font-family: var(--sf-font-heading, inherit);
    font-size: var(--sf-text-2xl, 2rem);
    line-height: var(--sf-leading-tight, 1.15);
    margin: 0;
    color: var(--sf-color-heading, inherit);
  }
  .pv__p {
    font-size: var(--sf-text-m, 1rem);
    margin: 0;
    max-width: 60ch;
    color: var(--sf-color-text--secondary, inherit);
  }
  .pv__muted {
    margin: 0;
    font-size: var(--sf-text-s, 0.85rem);
    color: var(--sf-color-text--muted, inherit);
  }
  .pv__display {
    margin: 0;
    font-family: var(--sf-font-display, var(--sf-font-heading, inherit));
    font-weight: var(--sf-font-weight-display, 800);
    color: var(--sf-color-heading, inherit);
    line-height: 1.05;
    overflow-wrap: anywhere;
    max-width: 100%;
  }
  .pv__display--l { font-size: var(--sf-text-display-l, 3rem); line-height: var(--sf-display-l-line-height, 1.05); }
  .pv__display--m { font-size: var(--sf-text-display-m, 2.4rem); line-height: var(--sf-display-m-line-height, 1.1); }
  .pv__display--s { font-size: var(--sf-text-display-s, 1.9rem); line-height: var(--sf-display-s-line-height, 1.15); }

  .pv__scale { display: flex; flex-direction: column; gap: 6px; }
  .pv__scale-row { display: flex; align-items: baseline; gap: 10px; }
  .pv__scale-sample {
    font-family: var(--sf-font-heading, inherit);
    color: var(--sf-color-text, inherit);
    line-height: 1.1;
    min-width: 2.2em;
  }
  .pv__scale-row code {
    font-family: var(--sf-font-mono, monospace);
    font-size: 11px;
    color: var(--sf-color-text--muted, inherit);
  }
  .pv__a { color: var(--sf-color-link, #4f8cff); }
  .pv__code {
    font-family: var(--sf-font-mono, monospace);
    background: var(--sf-color-inset, rgba(127, 127, 127, 0.15));
    padding: 0.1em 0.4em;
    border-radius: var(--sf-radius-s, 4px);
    color: var(--sf-color-code, inherit);
  }

  .pv__surfaces {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--sf-space-s, 8px);
  }
  .pv__surface {
    min-height: 54px;
    border: 1px solid var(--sf-color-border, rgba(127, 127, 127, 0.3));
    border-radius: var(--sf-radius-s, 4px);
    box-shadow: var(--sf-shadow-s, 0 1px 3px rgba(0, 0, 0, 0.1));
    display: flex;
    align-items: flex-end;
    padding: 6px 8px;
    font-size: 11px;
    font-weight: 600;
    color: var(--sf-color-text--secondary, inherit);
  }

  .pv__btns { display: flex; gap: var(--sf-space-s, 8px); flex-wrap: wrap; }
  .pv__btn {
    border: 1px solid transparent;
    border-radius: var(--sf-radius-m, 8px);
    padding: 0.5em 1.1em;
    font-weight: 600;
    font-size: var(--sf-text-s, 0.9rem);
    cursor: default;
    transition: filter 0.12s;
  }
  .pv__btn:hover { filter: brightness(1.05); }
  .pv__btn--primary { background: var(--sf-color-primary, #4f8cff); color: var(--sf-color-text--on-primary, #fff); }
  .pv__btn--secondary { background: var(--sf-color-secondary, #6b7280); color: var(--sf-color-text--on-secondary, #fff); }
  .pv__btn--action { background: var(--sf-color-action, #0891b2); color: var(--sf-color-text--on-action, #fff); }
  .pv__btn--outline {
    background: transparent;
    border-color: var(--sf-color-primary, currentColor);
    color: var(--sf-color-primary, inherit);
  }
  .pv__btn--ghost { background: transparent; border-color: var(--sf-color-border, currentColor); color: inherit; }
  .pv__btn--sm { padding: 0.35em 0.9em; font-size: var(--sf-text-xs, 0.8rem); }
  .pv__btn--push { margin-inline-start: auto; }

  .pv__swatches {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: 6px;
  }
  .pv__sw {
    aspect-ratio: 3 / 2;
    border-radius: var(--sf-radius-m, 8px);
    border: 1px solid var(--sf-color-border, rgba(127, 127, 127, 0.3));
    display: flex;
    align-items: flex-end;
    padding: 6px 8px;
    font-size: 12px;
    text-transform: capitalize;
  }

  .pv__alerts { display: flex; flex-direction: column; gap: 6px; }
  .pv__alert {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    border-radius: var(--sf-radius-s, 4px);
    border-inline-start: 3px solid;
    font-size: var(--sf-text-s, 0.85rem);
    color: var(--sf-color-text, inherit);
  }
  .pv__alert-text { color: var(--sf-color-text, inherit); }
  .pv__badge {
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    border-radius: var(--sf-radius-full, 999px);
    font-size: 10px;
    font-weight: 700;
    text-transform: capitalize;
    white-space: nowrap;
  }
  .pv__badge--push { margin-inline-start: auto; }

  .pv__card {
    background: var(--sf-color-surface, rgba(127, 127, 127, 0.06));
    border: 1px solid var(--sf-color-border, rgba(127, 127, 127, 0.3));
    border-radius: var(--sf-radius-m, 8px);
    box-shadow: var(--sf-shadow-m, 0 2px 8px rgba(0, 0, 0, 0.12));
    overflow: hidden;
  }
  .pv__card-accent { height: 4px; background: var(--sf-color-primary, #4f8cff); }
  .pv__card-body { padding: var(--sf-space-m, 16px); display: flex; flex-direction: column; gap: 10px; }
  .pv__card-top { display: flex; align-items: center; gap: 10px; }
  .pv__avatar {
    width: 36px; height: 36px;
    border-radius: var(--sf-radius-full, 50%);
    flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700;
  }
  .pv__card-title {
    margin: 0;
    font-family: var(--sf-font-heading, inherit);
    font-size: var(--sf-text-m, 1rem);
    font-weight: 600;
    color: var(--sf-color-heading, inherit);
    line-height: 1.3;
  }
  .pv__card-sub { margin: 0; font-size: var(--sf-text-xs, 0.8rem); color: var(--sf-color-text--muted, inherit); line-height: 1.3; }
  .pv__card-text { margin: 0; font-size: var(--sf-text-s, 0.9rem); color: var(--sf-color-text--secondary, inherit); }
  .pv__card-footer {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
    padding-top: 8px;
    border-top: 1px solid var(--sf-color-border, rgba(127, 127, 127, 0.2));
  }

  .pv__field { display: flex; flex-direction: column; gap: 5px; max-width: 320px; }
  .pv__field-label { font-size: var(--sf-text-xs, 0.8rem); font-weight: 600; color: var(--sf-color-text--secondary, inherit); }
  .pv__field-input {
    font-size: var(--sf-text-s, 0.9rem);
    padding: 7px 10px;
    border-radius: var(--sf-radius-s, 4px);
    border: 1px solid var(--sf-color-border, rgba(127, 127, 127, 0.4));
    background: var(--sf-color-bg, #fff);
    color: var(--sf-color-text, inherit);
  }

  .pv__space { display: flex; flex-direction: column; gap: 4px; }
  .pv__space-row { display: flex; align-items: center; gap: 10px; font-size: 12px; }
  .pv__space-row code {
    font-family: var(--sf-font-mono, monospace);
    min-width: 13ch;
    color: var(--sf-color-text--muted, inherit);
  }
  .pv__space-bar {
    block-size: 12px;
    background: var(--sf-color-action, #4f8cff);
    border-radius: 3px;
  }

  .pv__radii {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }
  .pv__radii-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    font-family: var(--sf-font-mono, monospace);
    font-size: 11px;
    color: var(--sf-color-text--muted, inherit);
  }
  .pv__radii-box {
    width: 56px;
    height: 56px;
    background: var(--sf-color-primary, #4f8cff);
    display: block;
  }

  .pv__shadows {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: 14px;
    padding: 8px 6px;
  }
  .pv__shadow-item {
    aspect-ratio: 1 / 1;
    background: var(--sf-color-surface, #fff);
    border-radius: var(--sf-radius-m, 8px);
    display: grid;
    place-items: center;
    color: var(--sf-color-text--muted, inherit);
    font-family: var(--sf-font-mono, monospace);
    font-size: 11px;
  }
</style>
