<script>
  import { overrides } from '../lib/store.svelte.js';
  import { tokenByName } from '../lib/model.js';
  import { buildPreviewDeclarations } from '../lib/preview.js';
  import { ui } from '../lib/store.svelte.js';
  import TokenRow from './TokenRow.svelte';

  const stageStyle = $derived(buildPreviewDeclarations(overrides, ui.previewTheme));

  const exists = (name) => tokenByName.has(name);
  const token = (name) => tokenByName.get(name);
  const hasOverride = (name) => overrides[name] != null;

  const LEVELS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

  const PER_LEVEL_TOKENS = (lvl) => [
    `--sf-${lvl}-size`,
    `--sf-${lvl}-font-weight`,
    `--sf-${lvl}-line-height`,
    `--sf-${lvl}-letter-spacing`,
    `--sf-${lvl}-max-width`,
  ];

  const GLOBAL_HEADING_TOKENS = [
    '--sf-font-heading',
    '--sf-font-weight-heading',
    '--sf-heading-text-wrap',
  ];

  const BODY_TOKENS = [
    '--sf-font-body',
    '--sf-body-font-size',
    '--sf-body-font-weight',
    '--sf-leading-normal',
    '--sf-body-text-wrap',
  ];

  const MONO_TOKENS = [
    '--sf-font-mono',
    '--sf-code-font-size',
  ];

  const TABS = [
    { id: 'all', label: 'All' },
    { id: 'h1', label: 'H1' },
    { id: 'h2', label: 'H2' },
    { id: 'h3', label: 'H3' },
    { id: 'h4', label: 'H4' },
    { id: 'h5', label: 'H5' },
    { id: 'h6', label: 'H6' },
    { id: 'body', label: 'Body' },
    { id: 'mono', label: 'Mono' },
  ];

  let activeTab = $state('all');

  function navigateTabs(e) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const idx = TABS.findIndex((t) => t.id === activeTab);
    const next = e.key === 'ArrowRight' ? (idx + 1) % TABS.length : (idx - 1 + TABS.length) % TABS.length;
    activeTab = TABS[next].id;
    e.currentTarget.querySelectorAll('[role="tab"]')[next]?.focus();
  }

  function tabHasOverride(tabId) {
    if (tabId === 'all') return [...GLOBAL_HEADING_TOKENS, ...BODY_TOKENS, ...MONO_TOKENS, ...LEVELS.flatMap(PER_LEVEL_TOKENS)].some(hasOverride);
    if (tabId === 'body') return BODY_TOKENS.some(hasOverride);
    if (tabId === 'mono') return MONO_TOKENS.some(hasOverride);
    return PER_LEVEL_TOKENS(tabId).some(hasOverride);
  }

  const SAMPLE_TEXTS = {
    h1: 'The quick brown fox',
    h2: 'Jumps over the lazy dog',
    h3: 'Typography at every scale',
    h4: 'Fluid, readable, precise',
    h5: 'Fine-tune each heading level',
    h6: 'Pixel-perfect control',
  };
</script>

<div class="hed">
  <div class="hed__tabs" role="tablist" tabindex="0" aria-label="Heading level" onkeydown={navigateTabs}>
    {#each TABS as tab (tab.id)}
      {@const modified = tabHasOverride(tab.id)}
      <button
        id="hed-tab-{tab.id}"
        role="tab"
        aria-selected={activeTab === tab.id}
        aria-controls="hed-panel"
        tabindex={activeTab === tab.id ? 0 : -1}
        class="hed__tab"
        class:hed__tab--active={activeTab === tab.id}
        class:hed__tab--modified={modified}
        onclick={() => (activeTab = tab.id)}
      >{tab.label}{#if modified}<span class="hed__dot" aria-label="modified"></span>{/if}</button>
    {/each}
  </div>

  <div id="hed-panel" role="tabpanel" aria-labelledby="hed-tab-{activeTab}" class="hed__body" style={stageStyle}>
    {#if activeTab === 'all'}
      <div class="hed__specimen hed__specimen--all">
        {#each LEVELS as lvl (lvl)}
          <svelte:element this={lvl} class="hed__preview-{lvl}" style="margin:0">
            {SAMPLE_TEXTS[lvl]}
          </svelte:element>
        {/each}
        <p style="margin:0; font: var(--sf-body-font-size, 1rem)/var(--sf-leading-normal, 1.6) var(--sf-font-body, sans-serif); color: var(--sf-color-text, inherit)">
          Body: The quick brown fox jumps over the lazy dog. A short paragraph to show body rhythm and spacing at a glance.
        </p>
      </div>
      <div class="hed__rows">
        {#each GLOBAL_HEADING_TOKENS.filter(exists) as name (name)}
          <TokenRow token={token(name)} label={name.replace('--sf-', '').replaceAll('-', ' ')} showRawInfo />
        {/each}
      </div>
    {:else if activeTab === 'body'}
      <div class="hed__specimen">
        <p style="margin:0; font: var(--sf-body-font-size, 1rem)/var(--sf-leading-normal, 1.6) var(--sf-font-body, sans-serif); color: var(--sf-color-text, inherit); max-width: var(--sf-body-max-width, 72ch)">
          The quick brown fox jumps over the lazy dog. This paragraph demonstrates your body typography — font, size, line-height, and text-wrap — all live. A longer line helps you judge measure and readability at a glance.
        </p>
      </div>
      <div class="hed__rows">
        {#each BODY_TOKENS.filter(exists) as name (name)}
          <TokenRow token={token(name)} label={name.replace('--sf-', '').replaceAll('-', ' ')} showRawInfo />
        {/each}
      </div>
    {:else if activeTab === 'mono'}
      <div class="hed__specimen">
        <code style="display:block; font-family: var(--sf-font-mono, monospace); font-size: var(--sf-code-font-size, 0.875em); color: var(--sf-color-text, inherit); white-space: pre-wrap">const scale = computeFluidClamp(minSize, maxSize, minVp, maxVp);
// → clamp(1rem, 0.5rem + 2.5vw, 1.5rem)</code>
      </div>
      <div class="hed__rows">
        {#each MONO_TOKENS.filter(exists) as name (name)}
          <TokenRow token={token(name)} label={name.replace('--sf-', '').replaceAll('-', ' ')} showRawInfo />
        {/each}
      </div>
    {:else}
      {@const lvl = activeTab}
      <div class="hed__specimen">
        <svelte:element this={lvl} style="margin:0; color: var(--sf-color-text, inherit)">{SAMPLE_TEXTS[lvl]}</svelte:element>
        <p class="hed__specimen-body" style="margin: 8px 0 0; color: var(--sf-color-text-faint, inherit)">
          Followed by a body line — judge the size contrast at a glance.
        </p>
      </div>
      <div class="hed__rows">
        {#each PER_LEVEL_TOKENS(lvl).filter(exists) as name (name)}
          <TokenRow token={token(name)} label={name.replace(/--sf-h\d-/, '').replaceAll('-', ' ')} showRawInfo />
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .hed { display: flex; flex-direction: column; border: 1px solid var(--cfg-border); border-radius: var(--cfg-radius); overflow: clip; }

  .hed__tabs {
    display: flex; gap: 0; overflow-x: auto; scrollbar-width: none;
    background: var(--cfg-surface-2); border-bottom: 1px solid var(--cfg-border);
  }
  .hed__tabs::-webkit-scrollbar { display: none; }

  .hed__tab {
    position: relative; flex-shrink: 0;
    padding: 8px 13px; font-size: 11.5px; font-weight: 700; letter-spacing: .04em;
    text-transform: uppercase; background: none; border: none; border-right: 1px solid var(--cfg-border);
    color: var(--cfg-text-faint); cursor: pointer; transition: color .1s, background .1s;
  }
  .hed__tab:last-child { border-right: none; }
  .hed__tab:hover { color: var(--cfg-text); background: var(--cfg-bg-2); }
  .hed__tab--active { color: var(--cfg-accent-strong); background: var(--cfg-bg); }
  .hed__tab--active::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0;
    height: 2px; background: var(--cfg-accent-strong);
  }

  .hed__dot {
    display: inline-block; width: 5px; height: 5px; border-radius: 50%;
    background: var(--cfg-accent-strong); margin-left: 3px; vertical-align: middle;
    position: relative; top: -1px;
  }

  .hed__body {
    background: var(--cfg-bg); overflow: hidden;
  }

  .hed__specimen {
    padding: 24px 20px;
    border-bottom: 1px solid var(--cfg-border);
    background: var(--cfg-bg-2);
  }
  .hed__specimen--all { display: flex; flex-direction: column; gap: 4px; }

  .hed__specimen-body {
    font-family: var(--sf-font-body, sans-serif);
    font-size: var(--sf-body-font-size, 1rem);
    line-height: var(--sf-leading-normal, 1.6);
  }

  .hed__rows { display: flex; flex-direction: column; }

  /* pass-through heading styles so the live tokens apply in specimen */
  .hed__specimen h1, .hed__specimen h2, .hed__specimen h3,
  .hed__specimen h4, .hed__specimen h5, .hed__specimen h6 {
    font-family: var(--sf-font-heading, inherit);
  }
  .hed__specimen h1 { font-size: var(--sf-h1-size); font-weight: var(--sf-h1-font-weight); line-height: var(--sf-h1-line-height); letter-spacing: var(--sf-h1-letter-spacing); }
  .hed__specimen h2 { font-size: var(--sf-h2-size); font-weight: var(--sf-h2-font-weight); line-height: var(--sf-h2-line-height); letter-spacing: var(--sf-h2-letter-spacing); }
  .hed__specimen h3 { font-size: var(--sf-h3-size); font-weight: var(--sf-h3-font-weight); line-height: var(--sf-h3-line-height); letter-spacing: var(--sf-h3-letter-spacing); }
  .hed__specimen h4 { font-size: var(--sf-h4-size); font-weight: var(--sf-h4-font-weight); line-height: var(--sf-h4-line-height); letter-spacing: var(--sf-h4-letter-spacing); }
  .hed__specimen h5 { font-size: var(--sf-h5-size); font-weight: var(--sf-h5-font-weight); line-height: var(--sf-h5-line-height); letter-spacing: var(--sf-h5-letter-spacing); }
  .hed__specimen h6 { font-size: var(--sf-h6-size); font-weight: var(--sf-h6-font-weight); line-height: var(--sf-h6-line-height); letter-spacing: var(--sf-h6-letter-spacing); }
</style>
