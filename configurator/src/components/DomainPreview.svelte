<script>
  /**
   * Inline, domain-shaped live preview.
   *
   * Renders the curated preview spec for one domain (lib/domainPreviews.js)
   * inside a scoped stage that carries the full framework cascade plus the
   * user's overrides (buildPreviewDeclarations) — so every var(--sf-*) sample
   * resolves exactly as it would in a real page, and updates the instant a
   * token changes. This is the generalisation of the Colors panel's "Semantic
   * roles" swatch grid to every other token domain.
   *
   * The rendering switches on the spec's `kind`: radius corners, elevation
   * cards, gradient tiles, motion bars, a type specimen, spacing bars, the
   * layout panel (proportional container widths + aspect/sizing tiles) and
   * blur/opacity/scrim samples each get a purpose-built layout, but all share
   * the one scoped stage.
   */
  import { overrides, ui } from '../lib/store.svelte.js';
  import { buildPreviewDeclarations } from '../lib/preview.js';
  import { DOMAIN_PREVIEWS } from '../lib/domainPreviews.js';

  /** @type {{ domain: string }} */
  let { domain } = $props();

  const spec = $derived(DOMAIN_PREVIEWS[domain]);

  // Same scoped cascade the big Preview pane uses: defaults + overrides, with
  // light-dark() resolved for the chosen preview theme. Reduced-motion collapses
  // every duration to zero so the motion preview demonstrates that state too.
  const stageStyle = $derived(
    ui.previewMotion === 'reduced'
      ? `${buildPreviewDeclarations(overrides, ui.previewTheme)}\n--sf-motion-scale: 0;`
      : buildPreviewDeclarations(overrides, ui.previewTheme)
  );

  // ── Layout: proportional container widths ────────────────────────────────
  // Container max-widths (narrow…wide) all dwarf this panel, so clamping each
  // to the track width would render them identical. Instead we measure the
  // RESOLVED width of each via a hidden probe carrying the live cascade, then
  // draw each bar as a % of the widest — so they stay visibly distinct and the
  // real px value is shown. Re-measures whenever the cascade (stageStyle)
  // changes, i.e. on every edit.
  const containerItems = $derived(
    spec?.groups.find((g) => g.section === 'Container widths')?.items ?? []
  );
  /** @type {HTMLElement[]} */
  let probeEls = $state([]);
  /** @type {{ px: number, pct: number }[]} */
  let measured = $state([]);

  $effect(() => {
    // Touch stageStyle + the item list so the effect re-runs on any edit.
    stageStyle;
    containerItems.length;
    const els = probeEls.filter(Boolean);
    if (els.length === 0) {
      measured = [];
      return;
    }
    const widths = els.map((el) => el.getBoundingClientRect().width);
    const max = Math.max(...widths, 1);
    measured = widths.map((w) => ({ px: Math.round(w), pct: (w / max) * 100 }));
  });
</script>

{#if spec}
  <div class="dp">
    <div class="dp__stage" style={stageStyle}>
      {#each spec.groups as group (group.section ?? 'g')}
        {#if group.section}<p class="dp__section">{group.section}</p>{/if}

        <!-- ── Type specimen ──────────────────────────────────────────── -->
        {#if spec.kind === 'type' && group.section === 'Specimen'}
          <div class="dp__specimen-box">
            <p class="dp__specimen-heading">The quick brown fox jumps over the lazy dog.</p>
            <p class="dp__specimen-body">Whereas disregard and contempt for human rights have resulted in barbarous acts which have outraged the conscience of mankind, and the advent of a world in which human beings shall enjoy freedom of speech and belief.</p>
            <p class="dp__specimen-meta">
              <span class="dp__specimen-tag">Heading: <code>--sf-font-heading</code></span>
              <span class="dp__specimen-tag">Body: <code>--sf-font-body</code></span>
              {#each group.items as it (it.token)}
                <span class="dp__specimen-tag">{it.label}: <code>{it.token}</code></span>
              {/each}
            </p>
          </div>
        {:else if spec.kind === 'type' && group.section === 'Font stacks'}
          <div class="dp__fonts">
            {#each group.items as it (it.token)}
              <div class="dp__font-row" style="font-family: var({it.token})">
                <span class="dp__font-label">{it.label}</span>
                <span class="dp__font-sample">The quick brown fox</span>
              </div>
            {/each}
          </div>
        {:else if spec.kind === 'type'}
          <div class="dp__type">
            {#each group.items as it (it.token)}
              <div class="dp__type-row">
                <span class="dp__type-sample" style="font-size: var({it.token})">Ag</span>
                <code class="dp__code">{it.token}</code>
              </div>
            {/each}
          </div>

        <!-- ── Spacing bars ───────────────────────────────────────────── -->
        {:else if spec.kind === 'space'}
          <div class="dp__bars">
            {#each group.items as it (it.token)}
              <div class="dp__bar-row">
                <code class="dp__code dp__code--w">{it.label}</code>
                <span class="dp__bar" style="inline-size: var({it.token})"></span>
              </div>
            {/each}
          </div>

        <!-- ── Layout: proportional container widths ──────────────────── -->
        {:else if spec.kind === 'layout' && group.section === 'Container widths'}
          <div class="dp__bars">
            {#each group.items as it, i (it.token)}
              <div class="dp__bar-row">
                <code class="dp__code dp__code--w">{it.label}</code>
                <span class="dp__track">
                  <span class="dp__track-fill" style="inline-size: {measured[i]?.pct ?? 100}%"></span>
                </span>
                <code class="dp__code dp__px">{measured[i] ? measured[i].px + 'px' : ''}</code>
              </div>
            {/each}
          </div>
          <!-- Off-layout probes: width = the real token, measured for the bars. -->
          <div class="dp__probes" aria-hidden="true">
            {#each group.items as it, i (it.token)}
              <div class="dp__probe" bind:this={probeEls[i]} style="inline-size: var({it.token})"></div>
            {/each}
          </div>

        <!-- ── Layout: aspect-ratio tiles ─────────────────────────────── -->
        {:else if spec.kind === 'layout' && group.section === 'Aspect ratios'}
          <div class="dp__ratios">
            {#each group.items as it (it.token)}
              <div class="dp__ratio-item">
                <span class="dp__ratio" style="aspect-ratio: var({it.token})"></span>
                <code class="dp__code">{it.label}</code>
              </div>
            {/each}
          </div>

        <!-- ── Layout: sizing swatches (header / touch / icon) ────────── -->
        {:else if spec.kind === 'layout'}
          <div class="dp__sizes">
            {#each group.items as it (it.token)}
              <div class="dp__size-item">
                <span class="dp__size" style="inline-size: var({it.token}); block-size: var({it.token})"></span>
                <code class="dp__code">{it.label}</code>
              </div>
            {/each}
          </div>

        <!-- ── Gradient tiles ─────────────────────────────────────────── -->
        {:else if spec.kind === 'gradient'}
          <div class="dp__tiles">
            {#each group.items as it (it.token)}
              <div class="dp__tile" style="background: var({it.token})">
                <span class="dp__tile-label">{it.label}</span>
              </div>
            {/each}
          </div>

        <!-- ── Radius corners + strokes ───────────────────────────────── -->
        {:else if spec.kind === 'radius' && group.section === 'Strokes'}
          <div class="dp__strokes">
            {#each group.items as it (it.token)}
              <div class="dp__stroke-row">
                <span
                  class="dp__stroke"
                  style="border-bottom: var({it.token}) solid var(--sf-color-border)"
                ></span>
                <code class="dp__code">{it.label}</code>
              </div>
            {/each}
          </div>
        {:else if spec.kind === 'radius'}
          <div class="dp__corners">
            {#each group.items as it (it.token)}
              <div class="dp__corner-item">
                <span class="dp__corner" style="border-radius: var({it.token})"></span>
                <code class="dp__code">{it.label}</code>
              </div>
            {/each}
          </div>

        <!-- ── Elevation cards ────────────────────────────────────────── -->
        {:else if spec.kind === 'shadow'}
          <div class="dp__cards">
            {#each group.items as it (it.token)}
              <div class="dp__card" style="box-shadow: var({it.token})">
                <code class="dp__code">{it.label}</code>
              </div>
            {/each}
          </div>

        <!-- ── Motion bars (durations + easings) ──────────────────────── -->
        {:else if spec.kind === 'motion'}
          <div class="dp__motion">
            {#each group.items as it (it.token)}
              <div class="dp__motion-row">
                <code class="dp__code dp__code--w">{it.label}</code>
                <div class="dp__motion-track">
                  {#if group.section === 'Easings'}
                    <span class="dp__motion-bar dp__motion-bar--ease" style="animation-timing-function: var({it.token})"></span>
                  {:else}
                    <span class="dp__motion-bar" style="animation-duration: var({it.token})"></span>
                  {/if}
                </div>
              </div>
            {/each}
          </div>

        <!-- ── Effects: blur ──────────────────────────────────────────── -->
        {:else if spec.kind === 'effect' && group.section === 'Blur'}
          {#each group.items as it (it.token)}
            <div class="dp__blur">
              <div class="dp__blur-bg">Aa Bb Cc 123</div>
              <div class="dp__blur-glass" style="backdrop-filter: blur(var({it.token})); -webkit-backdrop-filter: blur(var({it.token}))">
                <code class="dp__code">{it.label}</code>
              </div>
            </div>
          {/each}

        <!-- ── Effects: opacity as a real UI state ────────────────────── -->
        {:else if spec.kind === 'effect' && group.section === 'Opacity'}
          <div class="dp__opacities">
            {#each group.items as it (it.token)}
              <div class="dp__opacity-row">
                <span class="dp__opacity-chip" style="opacity: var({it.token})">Button</span>
                <code class="dp__code">{it.label}</code>
              </div>
            {/each}
          </div>

        <!-- ── Effects: scrim gradient over content ───────────────────── -->
        {:else if spec.kind === 'effect'}
          {#each group.items as it (it.token)}
            <div class="dp__scrim">
              <div class="dp__scrim-bg">Content behind the scrim</div>
              <div class="dp__scrim-layer" style="background: var({it.token})"></div>
              <code class="dp__code dp__scrim-label">{it.label}</code>
            </div>
          {/each}
        {/if}
      {/each}
    </div>

    <p class="dp__note">
      Live against your overrides · theme <strong>{ui.previewTheme}</strong> — toggle it in the preview pane.
    </p>
  </div>
{/if}

<style>
  .dp { padding: 12px 16px; }

  /* The scoped stage owns the framework cascade; samples inside read var(--sf-*). */
  .dp__stage {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 14px;
    background: var(--sf-color-bg, var(--cfg-bg));
    color: var(--sf-color-text, var(--cfg-text));
    border: 1px solid var(--cfg-border);
    border-radius: var(--cfg-radius-s);
    padding: 14px;
  }

  .dp__section {
    margin: 0;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--cfg-text-faint);
  }

  .dp__code {
    font-family: var(--cfg-mono);
    font-size: 10px;
    color: var(--cfg-text-faint);
  }
  .dp__code--w { min-width: 4.5ch; flex-shrink: 0; }

  /* Type specimen */
  .dp__type { display: flex; flex-direction: column; gap: 6px; }
  .dp__type-row { display: flex; align-items: baseline; gap: 12px; }
  .dp__type-sample {
    line-height: 1;
    overflow: hidden;
    max-block-size: 2.6rem;
    flex-shrink: 0;
    min-width: 3ch;
  }
  .dp__fonts { display: flex; flex-direction: column; gap: 8px; }
  .dp__font-row { display: flex; flex-direction: column; gap: 1px; }
  .dp__font-label { font-size: 10px; color: var(--cfg-text-faint); text-transform: uppercase; letter-spacing: 0.06em; }
  .dp__font-sample { font-size: 15px; }

  /* Font pairing specimen */
  .dp__specimen-box {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 14px;
    border: 1px solid var(--sf-color-border, var(--cfg-border));
    border-radius: var(--sf-radius-m, 8px);
    background: var(--sf-color-bg, var(--cfg-bg));
  }
  .dp__specimen-heading {
    margin: 0;
    font-family: var(--sf-font-heading);
    font-size: var(--sf-h2-size, 1.75rem);
    font-weight: var(--sf-h2-font-weight, 700);
    line-height: var(--sf-h2-line-height, 1.2);
    color: var(--sf-color-heading, var(--sf-color-text, var(--cfg-text)));
  }
  .dp__specimen-body {
    margin: 0;
    font-family: var(--sf-font-body);
    font-size: var(--sf-text-m, 1rem);
    line-height: var(--sf-leading-normal, 1.6);
    color: var(--sf-color-text--secondary, var(--cfg-text-muted));
  }
  .dp__specimen-meta {
    margin: 4px 0 0;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .dp__specimen-tag {
    font-size: 10px;
    color: var(--cfg-text-faint);
  }
  .dp__specimen-tag code {
    font-family: var(--cfg-mono);
    font-size: 9.5px;
    color: var(--cfg-accent, var(--cfg-text-faint));
  }

  /* Spacing + container bars */
  .dp__bars { display: flex; flex-direction: column; gap: 6px; }
  .dp__bar-row { display: flex; align-items: center; gap: 10px; }
  .dp__bar {
    height: 12px;
    background: var(--sf-color-primary, var(--cfg-accent-strong));
    border-radius: 3px;
    min-width: 2px;
  }
  .dp__track {
    flex: 1;
    height: 12px;
    background: var(--sf-color-inset, var(--cfg-bg));
    border: 1px solid var(--sf-color-border, var(--cfg-border));
    border-radius: 3px;
    overflow: hidden;
  }
  .dp__track-fill {
    display: block;
    height: 100%;
    background: var(--sf-color-primary-subtle, var(--cfg-accent));
    border-right: 2px solid var(--sf-color-primary, var(--cfg-accent-strong));
    transition: inline-size 0.18s ease;
  }
  .dp__px {
    min-width: 5ch;
    text-align: right;
    flex-shrink: 0;
  }
  /* Off-layout probes: real token widths, measured but never seen. */
  .dp__probes {
    position: absolute;
    inset-block-start: 0;
    inset-inline-start: 0;
    inline-size: 0;
    block-size: 0;
    visibility: hidden;
    pointer-events: none;
    overflow: hidden;
  }
  .dp__probe { block-size: 1px; }

  /* Layout — aspect-ratio tiles */
  .dp__ratios {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 12px;
    align-items: end;
  }
  .dp__ratio-item { display: flex; flex-direction: column; align-items: center; gap: 5px; }
  .dp__ratio {
    inline-size: 100%;
    background: var(--sf-color-surface, var(--cfg-surface));
    border: var(--sf-border-width-2, 2px) solid var(--sf-color-primary, var(--cfg-accent-strong));
    border-radius: var(--sf-radius-s, 4px);
  }

  /* Layout — sizing swatches (header / touch / icon), drawn at real size */
  .dp__sizes {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: 18px;
  }
  .dp__size-item { display: flex; flex-direction: column; align-items: center; gap: 6px; }
  .dp__size {
    display: block;
    max-inline-size: 96px;
    max-block-size: 96px;
    background: var(--sf-color-primary-subtle, var(--cfg-accent));
    border: 1px solid var(--sf-color-primary, var(--cfg-accent-strong));
    border-radius: var(--sf-radius-s, 4px);
  }

  /* Gradient tiles */
  .dp__tiles {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
    gap: 8px;
  }
  .dp__tile {
    height: 56px;
    border-radius: var(--sf-radius-m, 8px);
    border: 1px solid var(--cfg-border);
    display: flex;
    align-items: flex-end;
    padding: 6px;
  }
  .dp__tile-label {
    font-size: 10px;
    font-weight: 600;
    color: #fff;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  }

  /* Radius corners */
  .dp__corners {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
    gap: 10px;
  }
  .dp__corner-item { display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .dp__corner {
    width: 100%;
    height: 48px;
    background: var(--sf-color-surface, var(--cfg-surface));
    border: var(--sf-border-width-2, 2px) solid var(--sf-color-primary, var(--cfg-accent-strong));
  }

  /* Strokes */
  .dp__strokes { display: flex; flex-direction: column; gap: 8px; }
  .dp__stroke-row { display: flex; align-items: center; gap: 10px; }
  .dp__stroke { flex: 1; }

  /* Elevation cards */
  .dp__cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 16px;
    padding: 6px 4px 10px;
  }
  .dp__card {
    height: 56px;
    background: var(--sf-color-surface, var(--cfg-surface));
    border-radius: var(--sf-radius-m, 8px);
    display: grid;
    place-items: center;
  }

  /* Motion bars */
  .dp__motion { display: flex; flex-direction: column; gap: 7px; }
  .dp__motion-row { display: flex; align-items: center; gap: 10px; }
  .dp__motion-track {
    flex: 1;
    height: 12px;
    background: var(--sf-color-inset, var(--cfg-bg));
    border: 1px solid var(--sf-color-border, var(--cfg-border));
    border-radius: 3px;
    overflow: hidden;
  }
  .dp__motion-bar {
    display: block;
    height: 100%;
    width: 30%;
    background: var(--sf-color-primary, var(--cfg-accent-strong));
    border-radius: 3px;
    animation-name: dp-slide;
    animation-duration: var(--sf-duration-normal, 300ms);
    animation-timing-function: var(--sf-ease-in-out, ease-in-out);
    animation-iteration-count: infinite;
    animation-direction: alternate;
  }
  .dp__motion-bar--ease {
    animation-name: dp-slide;
    /* A longer, equal duration makes easing curves comparable — but still
       scaled by --sf-motion-scale so the reduced-motion toggle (which sets it
       to 0 on the stage) freezes these bars too, like the duration bars. */
    animation-duration: calc(1.1s * var(--sf-motion-scale, 1));
  }
  @keyframes dp-slide {
    from { transform: translateX(0); }
    to { transform: translateX(233%); }
  }
  /* Honour the preview's reduced-motion toggle (motion-scale: 0 freezes them). */
  @media (prefers-reduced-motion: reduce) {
    .dp__motion-bar { animation: none; }
  }

  /* Effects — blur */
  .dp__blur {
    position: relative;
    height: 70px;
    border-radius: var(--sf-radius-m, 8px);
    overflow: hidden;
    background: linear-gradient(120deg, var(--sf-color-primary, #4f8cff), var(--sf-color-tertiary, #a855f7));
    display: grid;
    place-items: center;
  }
  .dp__blur-bg {
    font-size: 20px;
    font-weight: 800;
    color: #fff;
    letter-spacing: 0.1em;
  }
  .dp__blur-glass {
    position: absolute;
    inset: 18px;
    border-radius: var(--sf-radius-s, 6px);
    background: var(--sf-color-surface, rgba(255, 255, 255, 0.1));
    opacity: 0.55;
    border: 1px solid rgba(255, 255, 255, 0.4);
    display: grid;
    place-items: center;
  }

  /* Effects — opacity applied to a real UI chip (reads as a state) */
  .dp__opacities { display: flex; flex-wrap: wrap; gap: 16px; }
  .dp__opacity-row { display: flex; align-items: center; gap: 8px; }
  .dp__opacity-chip {
    display: inline-grid;
    place-items: center;
    min-width: 84px;
    padding: 8px 16px;
    border-radius: var(--sf-radius-m, 6px);
    background: var(--sf-color-primary, var(--cfg-accent-strong));
    color: var(--sf-color-text--on-primary, #fff);
    font-size: 12px;
    font-weight: 600;
  }

  /* Effects — scrim gradient over content */
  .dp__scrim {
    position: relative;
    height: 80px;
    border-radius: var(--sf-radius-m, 8px);
    overflow: hidden;
    background: var(--sf-color-surface, var(--cfg-surface));
    display: grid;
    place-items: center;
  }
  .dp__scrim-bg {
    font-size: 13px;
    font-weight: 600;
    color: var(--sf-color-text, var(--cfg-text));
    padding: 0 12px;
    text-align: center;
  }
  .dp__scrim-layer {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .dp__scrim-label {
    position: absolute;
    bottom: 6px;
    left: 8px;
    color: var(--sf-color-text, var(--cfg-text));
  }

  .dp__note {
    margin: 10px 0 0;
    font-size: 11px;
    color: var(--cfg-text-faint);
  }

  @media (max-width: 600px) {
    .dp { padding: 10px 12px; }
    .dp__tiles { grid-template-columns: repeat(2, 1fr); }
  }
</style>
