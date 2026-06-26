<script>
  import { onDestroy } from 'svelte';
  import { sync, allTokens, frameworkVersion, modifiedCountsByDomain } from '../lib/model.js';
  import { DOMAIN_BY_ID } from '../lib/domains.js';
  import { ui, overrides, history, undo, redo, openOutputDrawer, currentShareUrl } from '../lib/store.svelte.js';
  import { copyText, COPY_FEEDBACK_MS } from '../lib/clipboard.js';

  const totalTokens = allTokens.length;
  const modCount = $derived(Object.values(modifiedCountsByDomain(overrides)).reduce((sum, n) => sum + n, 0));
  const canUndo = $derived(history.past.length > 0);
  const canRedo = $derived(history.future.length > 0);
  const activeDomain = $derived(ui.domain === 'home' ? { label: 'Overview' } : DOMAIN_BY_ID.get(ui.domain));
  let shareCopied = $state(false);
  let _shareTimer;
  onDestroy(() => clearTimeout(_shareTimer));
  async function shareLink() {
    const ok = await copyText(currentShareUrl());
    if (!ok) return;
    shareCopied = true;
    clearTimeout(_shareTimer);
    _shareTimer = setTimeout(() => (shareCopied = false), COPY_FEEDBACK_MS);
  }
</script>

<header class="hdr">
  <div class="hdr__brand">
    <span class="hdr__mark" aria-hidden="true">/</span>
    <div>
      <strong>SLASHED</strong>
      <span>Configurator</span>
    </div>
    {#if frameworkVersion}<em title="Synced from {sync.source} (catalogue {sync.tokensHash})">v{frameworkVersion}</em>{/if}
  </div>

  <div class="hdr__command">
    <label class="hdr__search">
      <span aria-hidden="true">⌕</span>
      <input id="cfg-search" type="search" placeholder="Search variables, presets, controls…" bind:value={ui.query} onkeydown={(e) => { if (e.key === 'Escape') ui.query = ''; }} spellcheck="false" />
      <kbd>/</kbd>
    </label>
    <div class="hdr__status">
      <span>{activeDomain?.label ?? 'Configurator'}</span>
      <span>{modCount} override{modCount === 1 ? '' : 's'}</span>
      <span>{totalTokens} variables</span>
    </div>
  </div>

  <nav class="hdr__actions" aria-label="Configurator actions">
    <div class="hdr__group" role="group" aria-label="History">
      <button onclick={() => undo()} disabled={!canUndo} title="Undo — ⌘Z" aria-label="Undo">↶</button>
      <button onclick={() => redo()} disabled={!canRedo} title="Redo — ⇧⌘Z" aria-label="Redo">↷</button>
    </div>
    <div class="hdr__group" role="group" aria-label="Session">
      <button class:ok={shareCopied} onclick={shareLink} disabled={modCount === 0} title="Copy shareable configuration link" aria-label="Copy shareable configuration link">{shareCopied ? '✓' : '🔗'}</button>
      <button onclick={() => (ui.uiTheme = ui.uiTheme === 'dark' ? 'light' : 'dark')} aria-pressed={ui.uiTheme === 'light'} title="Toggle configurator theme" aria-label="Toggle configurator theme">{ui.uiTheme === 'dark' ? '☀' : '☾'}</button>
      <button onclick={() => (ui.showTokens = !ui.showTokens)} aria-pressed={ui.showTokens} title={ui.showTokens ? 'Hide token names' : 'Show token names'} aria-label={ui.showTokens ? 'Hide token names' : 'Show token names'}>{ui.showTokens ? '--' : '{ }'}</button>
    </div>
    <div class="hdr__group" role="group" aria-label="Workspace">
      <button class="hdr__optional" onclick={() => (ui.sidebarOpen = !ui.sidebarOpen)} aria-pressed={ui.sidebarOpen} title="Toggle sidebar" aria-label="Toggle sidebar">{ui.sidebarOpen ? '◧' : '▤'}</button>
      <button onclick={() => (ui.previewOpen = !ui.previewOpen)} aria-pressed={ui.previewOpen} title="Toggle live preview" aria-label="Toggle preview">◨</button>
      <button class="hdr__export" class:hdr__export--ready={modCount > 0} onclick={openOutputDrawer} title="Open export drawer">Export CSS</button>
    </div>
  </nav>
</header>

<style>
  .hdr { grid-area: header; display:grid; grid-template-columns:minmax(220px,auto) minmax(260px,1fr) auto; gap:16px; align-items:center; padding:12px 16px; background:linear-gradient(180deg,rgba(255,255,255,.025),transparent), var(--cfg-surface); border-bottom:1px solid var(--cfg-border); }
  .hdr__brand { display:flex; align-items:center; gap:10px; min-width:0; }
  .hdr__mark { width:42px; height:42px; display:grid; place-items:center; flex:0 0 auto; border-radius:14px; border:1px solid color-mix(in oklab,var(--cfg-accent) 35%,transparent); color:var(--cfg-accent); background:color-mix(in oklab,var(--cfg-accent) 10%,transparent); font:900 25px/1 var(--cfg-mono); }
  .hdr__brand div { display:grid; line-height:1.05; }
  .hdr__brand strong { font-size:15px; letter-spacing:.04em; }
  .hdr__brand span { color:var(--cfg-text-muted); font-size:12px; }
  .hdr__brand em { font-style:normal; color:var(--cfg-text-faint); border:1px solid var(--cfg-border); border-radius:999px; padding:3px 8px; font-size:11px; }
  .hdr__command { display:grid; gap:6px; min-width:0; }
  .hdr__search { position:relative; display:flex; align-items:center; min-width:0; }
  .hdr__search span { position:absolute; left:12px; color:var(--cfg-text-faint); }
  .hdr__search input { width:100%; min-height:40px; padding:0 40px 0 34px; border:1px solid var(--cfg-border-strong); border-radius:999px; background:var(--cfg-bg-2); color:var(--cfg-text); outline:none; }
  .hdr__search input:focus { border-color:var(--cfg-accent); box-shadow:0 0 0 3px var(--cfg-accent-soft); }
  .hdr__search kbd { position:absolute; right:12px; color:var(--cfg-text-faint); border:1px solid var(--cfg-border); border-radius:6px; padding:1px 6px; font-size:11px; }
  .hdr__status { display:flex; gap:10px; flex-wrap:wrap; color:var(--cfg-text-faint); font-size:11px; padding-inline:4px; }
  .hdr__status span:not(:last-child)::after { content:'·'; margin-left:10px; }
  .hdr__actions { display:flex; align-items:center; gap:8px; justify-content:flex-end; flex-wrap:wrap; }
  .hdr__group { display:flex; gap:4px; padding:3px; border:1px solid var(--cfg-border); border-radius:999px; background:var(--cfg-bg-2); }
  button { min-width:34px; min-height:34px; border:0; border-radius:999px; background:transparent; color:var(--cfg-text-muted); padding:0 10px; font-weight:700; }
  button:hover:not(:disabled) { background:var(--cfg-surface-3); color:var(--cfg-text); }
  button:disabled { opacity:.38; cursor:not-allowed; }
  button.ok { color:var(--cfg-ok); }
  .hdr__export { min-width:auto; padding-inline:14px; background:var(--cfg-surface-3); color:var(--cfg-text); }
  .hdr__export--ready { background:var(--cfg-accent-strong); color:white; box-shadow:0 8px 24px var(--cfg-accent-glow); }
  @media (max-width: 900px) { .hdr { grid-template-columns:1fr auto; } .hdr__command { grid-column:1 / -1; grid-row:2; } .hdr__actions { grid-column:2; grid-row:1; } .hdr__optional { display:none; } }
  @media (max-width: 560px) { .hdr { padding:10px; gap:10px; } .hdr__brand em,.hdr__brand span { display:none; } .hdr__group { gap:2px; } button { min-width:38px; min-height:38px; padding-inline:9px; } .hdr__export { font-size:0; min-width:38px; } .hdr__export::before { content:'CSS'; font-size:12px; } }
</style>
