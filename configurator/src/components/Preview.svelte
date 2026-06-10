<script>
  /**
   * Scoped live preview. Every framework default + the user's overrides are
   * applied as custom properties on the preview root via an inline style
   * string, so the sample UI below resolves tokens exactly as the real
   * framework would — including light-dark() and oklch(from …).
   */
  import { overrides, ui } from '../lib/store.svelte.js';
  import { buildPreviewDeclarations } from '../lib/preview.js';

  const styleStr = $derived(buildPreviewDeclarations(overrides, ui.previewTheme));

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
</script>

<section class="preview">
  <header class="preview__bar">
    <strong>Live preview</strong>
    <div class="preview__theme" role="group" aria-label="Preview theme">
      <button
        class="preview__theme-btn"
        class:preview__theme-btn--on={ui.previewTheme === 'light'}
        onclick={() => (ui.previewTheme = 'light')}
      >Light</button>
      <button
        class="preview__theme-btn"
        class:preview__theme-btn--on={ui.previewTheme === 'dark'}
        onclick={() => (ui.previewTheme = 'dark')}
      >Dark</button>
    </div>
  </header>

  <div class="preview__stage" style={styleStr}>
    <div class="pv">
      <!-- Typography -->
      <section class="pv__block">
        <p class="pv__eyebrow">Typography</p>
        <h2 class="pv__h">The quick brown fox</h2>
        <p class="pv__p">
          Jumps over the lazy dog. This paragraph uses the framework's body font,
          text size and <a class="pv__a" href="#a">an inline link</a>, with
          <code class="pv__code">--sf-color-code</code> styling inline code.
        </p>
        <p class="pv__muted">Muted caption · secondary hierarchy · auto-contrasting.</p>
      </section>

      <!-- Display type — the framework's display font sizes -->
      <section class="pv__block">
        <p class="pv__eyebrow">Display type</p>
        <p class="pv__display pv__display--l">Display L</p>
        <p class="pv__display pv__display--m">Display M</p>
        <p class="pv__display pv__display--s">Display S</p>
      </section>

      <!-- Type scale -->
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

      <!-- Feedback / alerts: subtle tint fill + status border + on-color badge -->
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
              Radius, shadow, colours, surfaces and typography working together —
              every value updates live as you adjust tokens.
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
    </div>
  </div>
</section>

<style>
  .preview {
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
    padding: 10px 16px;
    border-bottom: 1px solid var(--cfg-border);
  }
  .preview__theme {
    display: inline-flex;
    border: 1px solid var(--cfg-border-strong);
    border-radius: var(--cfg-radius-s);
    overflow: hidden;
  }
  .preview__theme-btn {
    background: var(--cfg-surface-2);
    color: var(--cfg-text-muted);
    border: none;
    padding: 4px 12px;
    font-size: 12px;
  }
  .preview__theme-btn--on {
    background: var(--cfg-accent-strong);
    color: #fff;
  }
  .preview__stage {
    flex: 1;
    overflow: auto;
    /* The token-driven surface fills the stage so theme changes are obvious. */
    background: var(--sf-color-bg, #fff);
    color: var(--sf-color-text, #111);
  }

  /* Sample UI — deliberately authored against framework tokens with sane
     fallbacks so the preview still renders if a token is absent. */
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

  /* Display type + type scale */
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
  .pv__a {
    color: var(--sf-color-link, #4f8cff);
  }
  .pv__code {
    font-family: var(--sf-font-mono, monospace);
    background: var(--sf-color-inset, rgba(127, 127, 127, 0.15));
    padding: 0.1em 0.4em;
    border-radius: var(--sf-radius-s, 4px);
    color: var(--sf-color-code, inherit);
  }

  /* Surfaces / elevation */
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

  /* Buttons */
  .pv__btns {
    display: flex;
    gap: var(--sf-space-s, 8px);
    flex-wrap: wrap;
  }
  .pv__btn {
    border: 1px solid transparent;
    border-radius: var(--sf-radius-m, 8px);
    padding: 0.5em 1.1em;
    font-weight: 600;
    font-size: var(--sf-text-s, 0.9rem);
    cursor: default;
  }
  .pv__btn--primary {
    background: var(--sf-color-primary, #4f8cff);
    color: var(--sf-color-text--on-primary, #fff);
  }
  .pv__btn--secondary {
    background: var(--sf-color-secondary, #6b7280);
    color: var(--sf-color-text--on-secondary, #fff);
  }
  .pv__btn--action {
    background: var(--sf-color-action, #0891b2);
    color: var(--sf-color-text--on-action, #fff);
  }
  .pv__btn--outline {
    background: transparent;
    border-color: var(--sf-color-primary, currentColor);
    color: var(--sf-color-primary, inherit);
  }
  .pv__btn--ghost {
    background: transparent;
    border-color: var(--sf-color-border, currentColor);
    color: inherit;
  }
  .pv__btn--sm { padding: 0.35em 0.9em; font-size: var(--sf-text-xs, 0.8rem); }
  .pv__btn--push { margin-inline-start: auto; }

  /* Swatches */
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

  /* Alerts */
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

  /* Card */
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
    width: 36px;
    height: 36px;
    border-radius: var(--sf-radius-full, 50%);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
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

  /* Form field */
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

  /* Spacing */
  .pv__space {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .pv__space-row {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 12px;
  }
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
</style>
