<script>
  /**
   * Install / Setup panel — the bundle & module picker.
   *
   * SLASHED ships several pre-built dist bundles (Essential → Full). Which one
   * to load is a real per-project decision the rest of the panel ignores, so
   * this tool:
   *   • lists every shipping bundle (auto-synced from bundle.config.json via
   *     src/lib/bundles.js) with what each optional module adds;
   *   • recommends the leanest bundle that actually covers the user's current
   *     overrides;
   *   • emits a complete drop-in: the framework <link> first, then the user's
   *     override CSS in @layer slashed.overrides — in the correct cascade order.
   */
  import { BUNDLES, recommendBundle, embedSnippets, bundleById, DEFAULT_BUNDLE_ID } from '../lib/bundles.js';
  import { ui, overrides } from '../lib/store.svelte.js';
  import { generateCSS } from '../lib/css.js';
  import { copyText, COPY_FEEDBACK_MS } from '../lib/clipboard.js';

  const recommended = $derived(recommendBundle(overrides));
  const selected = $derived(bundleById(ui.bundle) ?? bundleById(DEFAULT_BUNDLE_ID) ?? BUNDLES[0]);
  const snippets = $derived(embedSnippets(selected));
  const overrideCount = $derived(Object.keys(overrides).length);
  const overrideCss = $derived(generateCSS(overrides, { mode: ui.outputMode }));

  /** Install-snippet format: an HTML <link> or a CSS @import. */
  let format = $state('link');

  // The complete, paste-ready setup: framework first, overrides after.
  const dropIn = $derived.by(() => {
    const head = format === 'link' ? snippets.link : snippets.import;
    if (overrideCount === 0) return head;
    const block = format === 'link'
      ? `<style>\n${overrideCss}\n</style>`
      : overrideCss;
    return `${head}\n\n${block}`;
  });

  // Copy feedback keyed by target id so each button confirms independently.
  let copiedKey = $state('');
  let _t;
  async function copy(key, text) {
    if (!text) return;
    if (await copyText(text)) {
      copiedKey = key;
      clearTimeout(_t);
      _t = setTimeout(() => (copiedKey = ''), COPY_FEEDBACK_MS);
    }
  }

  function pick(id) {
    ui.bundle = id;
  }
</script>

<section class="setup">
  <header class="setup__head">
    <h2 class="setup__title">Install SLASHED</h2>
    <p class="setup__lead">
      Choose a pre-built bundle to load, then drop in the snippet below. Your
      overrides layer on top via <code>@layer slashed.overrides</code> — no build
      step required. The recommended bundle is the leanest one that ships every
      token you've customised.
    </p>
  </header>

  <ul class="setup__bundles">
    {#each BUNDLES as b (b.id)}
      <li>
        <button
          class="bundle"
          class:bundle--on={selected?.id === b.id}
          onclick={() => pick(b.id)}
          aria-pressed={selected?.id === b.id}
        >
          <span class="bundle__top">
            <span class="bundle__name">{b.label}</span>
            {#if b.id === recommended}
              <span class="bundle__badge" title="Leanest bundle that covers your current overrides">Recommended</span>
            {/if}
            <span class="bundle__file"><code>{b.min}</code></span>
          </span>
          <span class="bundle__tag">{b.tagline}</span>
          {#if b.features.length}
            <ul class="bundle__feats">
              {#each b.features as f (f.module)}
                <li title={f.module}>{f.blurb}</li>
              {/each}
            </ul>
          {:else}
            <span class="bundle__feats bundle__feats--none">Core modules only — no optional add-ons.</span>
          {/if}
        </button>
      </li>
    {/each}
  </ul>

  {#if selected}
    <div class="snippet">
      <div class="snippet__head">
        <strong>Drop-in for <span class="snippet__sel">{selected.label}</span></strong>
        <div class="cfg-seg" role="group" aria-label="Snippet format">
          <button class="cfg-seg__btn" class:cfg-seg__btn--on={format === 'link'} onclick={() => (format = 'link')} aria-pressed={format === 'link'}>HTML</button>
          <button class="cfg-seg__btn" class:cfg-seg__btn--on={format === 'import'} onclick={() => (format = 'import')} aria-pressed={format === 'import'}>@import</button>
        </div>
        <button class="cfg-btn cfg-btn--sm cfg-btn--primary" onclick={() => copy('dropin', dropIn)}>
          {copiedKey === 'dropin' ? 'Copied ✓' : 'Copy setup'}
        </button>
      </div>
      <pre class="snippet__code"><code>{dropIn}</code></pre>
      <p class="snippet__note">
        {#if overrideCount === 0}
          No overrides yet — this loads the framework defaults. Customise tokens,
          then copy again to bundle them in.
        {:else}
          Includes your {overrideCount} override{overrideCount === 1 ? '' : 's'}. The framework
          loads first; your overrides win via the cascade layer.
        {/if}
      </p>
    </div>
  {/if}
</section>

<style>
  .setup {
    overflow-y: auto;
    height: 100%;
    padding: 28px 24px 80px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .setup__head { max-width: 72ch; }
  .setup__title { margin: 0 0 6px; font-size: 20px; font-weight: 700; }
  .setup__lead { margin: 0; font-size: 13.5px; line-height: 1.6; color: var(--cfg-text-muted); }
  .setup__lead code { font-family: var(--cfg-mono); font-size: 12px; color: var(--cfg-text); }

  .setup__bundles {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 760px;
  }
  .bundle {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 14px 16px;
    text-align: left;
    background: var(--cfg-surface);
    border: 1px solid var(--cfg-border);
    border-radius: var(--cfg-radius);
    cursor: pointer;
    transition: border-color 0.12s, background 0.12s;
  }
  .bundle:hover { background: var(--cfg-surface-2); border-color: var(--cfg-border-strong); }
  .bundle--on { border-color: var(--cfg-accent-strong); background: var(--cfg-accent-soft); }
  .bundle__top { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .bundle__name { font-size: 14.5px; font-weight: 650; color: var(--cfg-text); }
  .bundle__badge {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #fff;
    background: var(--cfg-accent-strong);
    border-radius: 999px;
    padding: 2px 8px;
  }
  .bundle__file { margin-left: auto; font-family: var(--cfg-mono); font-size: 11px; color: var(--cfg-text-faint); }
  .bundle__tag { font-size: 12.5px; line-height: 1.5; color: var(--cfg-text-muted); }
  .bundle__feats {
    list-style: none;
    margin: 2px 0 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: 11.5px;
    color: var(--cfg-text-faint);
  }
  .bundle__feats li { position: relative; padding-left: 14px; }
  .bundle__feats li::before { content: '+'; position: absolute; left: 0; color: var(--cfg-ok); font-weight: 700; }
  .bundle__feats--none { font-style: italic; }

  .snippet {
    max-width: 760px;
    border: 1px solid var(--cfg-border);
    border-radius: var(--cfg-radius);
    overflow: hidden;
    background: var(--cfg-surface);
  }
  .snippet__head {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    flex-wrap: wrap;
    border-bottom: 1px solid var(--cfg-border);
  }
  .snippet__sel { color: var(--cfg-accent); }
  .snippet__head .cfg-btn { margin-left: auto; }
  .snippet__code {
    margin: 0;
    padding: 14px;
    overflow: auto;
    background: var(--cfg-bg);
    font-family: var(--cfg-mono);
    font-size: 12.5px;
    line-height: 1.6;
    color: #c9d4e3;
    white-space: pre;
    tab-size: 2;
    max-height: 320px;
  }
  .snippet__note { margin: 0; padding: 10px 14px; font-size: 11.5px; color: var(--cfg-text-faint); }

  @media (max-width: 600px) {
    .setup { padding: 16px 12px 60px; }
    .snippet__head .cfg-btn { margin-left: 0; }
  }
</style>
