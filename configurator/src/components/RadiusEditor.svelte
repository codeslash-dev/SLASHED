<script>
  /**
   * Tabbed radius editor showing a live shape specimen for each radius level.
   * All | 2xs | xs | s | m | l | xl | 2xl | 3xl | 4xl | full
   */
  import { overrides } from '../lib/store.svelte.js';
  import { tokenByName } from '../lib/model.js';
  import TokenRow from './TokenRow.svelte';

  const exists = (name) => tokenByName.has(name);
  const token = (name) => tokenByName.get(name);
  const hasOverride = (name) => overrides[name] != null;

  const LEVELS = [
    { id: '2xs',  token: '--sf-radius-2xs',  label: '2XS',  demo: 'Tag',    shape: 'rect' },
    { id: 'xs',   token: '--sf-radius-xs',   label: 'XS',   demo: 'Chip',   shape: 'rect' },
    { id: 's',    token: '--sf-radius-s',    label: 'S',    demo: 'Input',  shape: 'rect' },
    { id: 'm',    token: '--sf-radius-m',    label: 'M',    demo: 'Button', shape: 'rect' },
    { id: 'l',    token: '--sf-radius-l',    label: 'L',    demo: 'Card',   shape: 'rect' },
    { id: 'xl',   token: '--sf-radius-xl',   label: 'XL',   demo: 'Panel',  shape: 'rect' },
    { id: '2xl',  token: '--sf-radius-2xl',  label: '2XL',  demo: 'Modal',  shape: 'rect' },
    { id: '3xl',  token: '--sf-radius-3xl',  label: '3XL',  demo: 'Hero',   shape: 'rect' },
    { id: '4xl',  token: '--sf-radius-4xl',  label: '4XL',  demo: 'Blob',   shape: 'rect' },
    { id: 'full', token: '--sf-radius-full', label: 'Full', demo: 'Circle', shape: 'circle' },
  ];

  const GLOBAL_TOKENS = ['--sf-radius-scale'];

  const TABS = [{ id: 'all', label: 'All' }, ...LEVELS.map((l) => ({ id: l.id, label: l.label }))];

  let activeTab = $state('all');

  function navigateTabs(e) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const idx = TABS.findIndex((t) => t.id === activeTab);
    const next = e.key === 'ArrowRight' ? (idx + 1) % TABS.length : (idx - 1 + TABS.length) % TABS.length;
    activeTab = TABS[next].id;
    e.currentTarget.querySelectorAll('[role="tab"]')[next]?.focus();
  }

  function tabHasOverride(tabId) {
    if (tabId === 'all') return [...GLOBAL_TOKENS, ...LEVELS.map((l) => l.token)].some(hasOverride);
    const lvl = LEVELS.find((l) => l.id === tabId);
    return lvl ? hasOverride(lvl.token) : false;
  }

  const DEMO_SIZES = {
    '2xs': [20, 14], xs: [28, 18], s: [60, 32], m: [80, 36],
    l: [96, 56], xl: [112, 72], '2xl': [130, 90], '3xl': [150, 110],
    '4xl': [150, 130], full: [64, 64],
  };
</script>

<div class="rad">
  <div class="rad__tabs" role="tablist" tabindex="0" aria-label="Radius level" onkeydown={navigateTabs}>
    {#each TABS as tab (tab.id)}
      {@const modified = tabHasOverride(tab.id)}
      <button
        id="rad-tab-{tab.id}"
        role="tab"
        aria-selected={activeTab === tab.id}
        aria-controls="rad-panel"
        tabindex={activeTab === tab.id ? 0 : -1}
        class="rad__tab"
        class:rad__tab--active={activeTab === tab.id}
        class:rad__tab--modified={modified}
        onclick={() => (activeTab = tab.id)}
      >{tab.label}{#if modified}<span class="rad__dot" aria-label="modified"></span>{/if}</button>
    {/each}
  </div>

  <div id="rad-panel" role="tabpanel" aria-labelledby="rad-tab-{activeTab}" class="rad__body">
    {#if activeTab === 'all'}
      <div class="rad__specimen rad__specimen--all">
        {#each LEVELS.filter((l) => exists(l.token)) as lvl (lvl.id)}
          {@const [w, h] = DEMO_SIZES[lvl.id]}
          <div class="rad__all-item">
            <div
              class="rad__shape"
              style:width="{w}px"
              style:height="{h}px"
              style:border-radius="var({lvl.token})"
            ></div>
            <span class="rad__all-label">{lvl.label}</span>
          </div>
        {/each}
      </div>
      <div class="rad__rows">
        {#each GLOBAL_TOKENS.filter(exists) as name (name)}
          <TokenRow token={token(name)} label="Radius scale" help="Multiplier applied to all radius steps. 1 = default; 0 = square; 2 = double-rounded." showRawInfo />
        {/each}
      </div>
    {:else}
      {@const lvl = LEVELS.find((l) => l.id === activeTab)}
      {#if lvl && exists(lvl.token)}
        {@const [w, h] = DEMO_SIZES[activeTab]}
        <div class="rad__specimen">
          <div class="rad__demo-wrap">
            <div
              class="rad__shape rad__shape--large"
              style:width="{w * 1.4}px"
              style:height="{h * 1.4}px"
              style:border-radius="var({lvl.token})"
            ></div>
            <span class="rad__demo-label">{lvl.demo}</span>
          </div>
          <div class="rad__all-row">
            {#each LEVELS.filter((l) => exists(l.token)) as l (l.id)}
              {@const [sw, sh] = DEMO_SIZES[l.id]}
              <button
                type="button"
                class="rad__mini"
                class:rad__mini--active={l.id === activeTab}
                onclick={() => (activeTab = l.id)}
                title={l.token}
                aria-label={`Show ${l.label} radius`}
                style:width="{Math.min(sw, 44)}px"
                style:height="{Math.min(sh, 44)}px"
                style:border-radius="var({l.token})"
              ></button>
            {/each}
          </div>
        </div>
        <div class="rad__rows">
          <TokenRow token={token(lvl.token)} label="{lvl.label} radius" showRawInfo />
        </div>
      {/if}
    {/if}
  </div>
</div>

<style>
  .rad { display: flex; flex-direction: column; border: 1px solid var(--cfg-border); border-radius: var(--cfg-radius); overflow: clip; }

  .rad__tabs {
    display: flex; overflow-x: auto; scrollbar-width: none;
    background: var(--cfg-surface-2); border-bottom: 1px solid var(--cfg-border);
  }
  .rad__tabs::-webkit-scrollbar { display: none; }

  .rad__tab {
    position: relative; flex-shrink: 0;
    padding: 8px 11px; font-size: 11px; font-weight: 700; letter-spacing: .04em;
    text-transform: uppercase; background: none; border: none; border-right: 1px solid var(--cfg-border);
    color: var(--cfg-text-faint); cursor: pointer; transition: color .1s, background .1s;
  }
  .rad__tab:last-child { border-right: none; }
  .rad__tab:hover { color: var(--cfg-text); background: var(--cfg-bg-2); }
  .rad__tab--active { color: var(--cfg-accent-strong); background: var(--cfg-bg); }
  .rad__tab--active::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0;
    height: 2px; background: var(--cfg-accent-strong);
  }
  .rad__dot {
    display: inline-block; width: 5px; height: 5px; border-radius: 50%;
    background: var(--cfg-accent-strong); margin-left: 3px; vertical-align: middle;
    position: relative; top: -1px;
  }

  .rad__body { background: var(--cfg-bg); }

  .rad__specimen {
    padding: 20px; border-bottom: 1px solid var(--cfg-border);
    background: var(--cfg-bg-2); display: flex; flex-direction: column; gap: 16px;
  }
  .rad__specimen--all {
    display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-end;
  }

  .rad__shape {
    background: var(--cfg-accent-strong);
    opacity: 0.85;
    flex-shrink: 0;
    transition: border-radius 0.2s ease;
  }
  .rad__shape--large { opacity: 0.9; }

  .rad__all-item {
    display: flex; flex-direction: column; align-items: center; gap: 6px;
  }
  .rad__all-label {
    font-size: 9px; font-weight: 700; text-transform: uppercase;
    letter-spacing: .05em; color: var(--cfg-text-faint);
  }

  .rad__demo-wrap {
    display: flex; flex-direction: column; align-items: center; gap: 8px;
  }
  .rad__demo-label {
    font-size: 11px; color: var(--cfg-text-faint);
  }

  .rad__all-row {
    display: flex; flex-wrap: wrap; gap: 8px; align-items: center; justify-content: center;
  }
  .rad__mini {
    background: var(--cfg-border-strong);
    border: 0;
    padding: 0;
    cursor: pointer;
    transition: border-radius 0.2s ease, background 0.1s;
    flex-shrink: 0;
  }
  .rad__mini--active { background: var(--cfg-accent-strong); opacity: 0.8; }
  .rad__mini:hover { background: var(--cfg-accent); }

  .rad__rows { display: flex; flex-direction: column; }
</style>
