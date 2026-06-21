<script>
  /**
   * App shell.
   *
   * Layout (desktop ≥ 1100px):
   *   ┌─────────────────────────────────────────────────────────────────┐
   *   │ Header (brand · search · basic/advanced · theme · preview)       │
   *   ├──────────┬──┬────────────────────────────────────┬──┬───────────┤
   *   │          │  │                                    │  │           │
   *   │ Sidebar  │↔│       Domain panel / WCAG tool     │↔│  Preview  │
   *   │          │  │                                    │  │           │
   *   ├──────────┴──┴────────────────────────────────────┴──┴───────────┤
   *   │ Output drawer (override CSS, copy / download / import)           │
   *   └─────────────────────────────────────────────────────────────────┘
   *
   * The ↔ columns are 6 px drag handles — pointer-captured resize of the
   * sidebar and preview pane widths. Widths persist in localStorage.
   *
   * Below 1100px the preview pane becomes a slide-over overlay (closed by
   * default, opened with the header ◨ toggle, dismissed via the scrim).
   * Below 760px the sidebar collapses to a compact icon-only rail.
   *
   * State lives in the shared `ui` store; this component just wires the
   * active domain to its panel.
   */
  import { DOMAINS, DOMAIN_BY_ID, BASIC_DOMAIN_IDS } from './lib/domains.js';
  import { ui, undo, redo, overrides, loadSharedConfig } from './lib/store.svelte.js';
  import { buildShareUrl } from './lib/share.js';
  import { UI_STORAGE_KEY } from './lib/uiState.js';
  import { setProbeContext } from './lib/probeHost.js';
  import Header from './components/Header.svelte';
  import Sidebar from './components/Sidebar.svelte';
  import DomainPanel from './components/DomainPanel.svelte';
  import OutputPanel from './components/OutputPanel.svelte';
  import Preview from './components/Preview.svelte';
  import WcagPanel from './components/WcagPanel.svelte';
  import ThemeGallery from './components/ThemeGallery.svelte';
  import Cheatsheet from './components/Cheatsheet.svelte';
  import BundlePicker from './components/BundlePicker.svelte';
  import Home from './components/Home.svelte';

  // ── Pane-width resizing ───────────────────────────────────────────────────
  const WIDTHS_KEY = 'slashed-configurator/pane-widths/v1';
  const SIDEBAR_MIN = 160;
  const SIDEBAR_MAX = 500;
  const PREVIEW_MIN = 300;
  const PREVIEW_MAX = 680;

  function clampW(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  function loadWidths() {
    if (typeof localStorage === 'undefined') return { sidebar: 240, preview: 440 };
    try {
      const raw = localStorage.getItem(WIDTHS_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        return {
          sidebar: clampW(Number(p.sidebar) || 240, SIDEBAR_MIN, SIDEBAR_MAX),
          preview: clampW(Number(p.preview) || 440, PREVIEW_MIN, PREVIEW_MAX),
        };
      }
    } catch { /* ignore */ }
    return { sidebar: 240, preview: 440 };
  }

  const _w = loadWidths();
  let sidebarWidth = $state(_w.sidebar);
  let previewWidth = $state(_w.preview);

  /** Which pane is being dragged ('sidebar' | 'preview' | null). */
  let dragging = $state(/** @type {'sidebar'|'preview'|null} */ (null));
  let _dragStartX = 0;
  let _dragStartW = 0;

  function startResize(pane, /** @type {PointerEvent} */ e) {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragging = pane;
    _dragStartX = e.clientX;
    _dragStartW = pane === 'sidebar' ? sidebarWidth : previewWidth;
    e.preventDefault();
  }

  function onResizeMove(pane, /** @type {PointerEvent} */ e) {
    if (dragging !== pane) return;
    const dx = e.clientX - _dragStartX;
    if (pane === 'sidebar') {
      sidebarWidth = clampW(_dragStartW + dx, SIDEBAR_MIN, SIDEBAR_MAX);
    } else {
      // Preview handle sits LEFT of the preview pane: dragging right shrinks preview.
      previewWidth = clampW(_dragStartW - dx, PREVIEW_MIN, PREVIEW_MAX);
    }
  }

  function endResize() {
    if (!dragging) return;
    dragging = null;
    try { localStorage.setItem(WIDTHS_KEY, JSON.stringify({ sidebar: sidebarWidth, preview: previewWidth })); } catch { /* ignore */ }
  }

  const home = $derived(ui.mode === 'basic' && ui.domain === 'home');
  const domain = $derived(DOMAIN_BY_ID.get(ui.domain) ?? DOMAIN_BY_ID.get('colors'));
  const tool = $derived(domain?.tool ?? '');

  // Keep the active domain valid for the current mode: Home exists only in
  // Basic, and Basic hides the non-checklist domains (Motion, Effects, …).
  $effect(() => {
    if (ui.mode === 'advanced' && ui.domain === 'home') {
      ui.domain = 'colors';
    } else if (ui.mode === 'basic' && ui.domain !== 'home' && !BASIC_DOMAIN_IDS.includes(ui.domain)) {
      ui.domain = 'home';
    }
  });

  // Keep the contrast-probe host in sync with the user's cascade so every
  // ContrastBadge resolves `var(...)`, `light-dark()` and `oklch(from ...)`
  // expressions correctly. setProbeContext is internally idempotent.
  $effect(() => {
    setProbeContext({ overrides, theme: ui.previewTheme });
  });

  // Apply the configurator UI theme to <html> so [data-ui-theme="light/dark"]
  // CSS selectors in app.css take effect across the whole chrome.
  $effect(() => {
    document.documentElement.dataset.uiTheme = ui.uiTheme;
  });

  // One-time: apply a configuration shared via the URL fragment (#c=…). Runs as
  // a single undoable step so it layers over the localStorage-restored state.
  let _sharedLoaded = false;
  $effect(() => {
    if (_sharedLoaded) return;
    _sharedLoaded = true;
    loadSharedConfig();
  });

  // Keep the URL fragment in sync with the live override map (debounced) so the
  // address bar is always a shareable snapshot. replaceState (not pushState)
  // keeps it out of the back/forward history.
  let _hashTimer;
  $effect(() => {
    const snapshot = JSON.stringify(overrides); // track the override map
    void snapshot;
    clearTimeout(_hashTimer);
    _hashTimer = setTimeout(() => {
      try {
        history.replaceState(history.state, '', buildShareUrl(overrides));
      } catch {
        /* history API blocked (e.g. file://) — non-essential, ignore */
      }
    }, 400);
    return () => clearTimeout(_hashTimer);
  });

  // Persist the navigation prefs so a reload restores where the user was.
  // Restore (with validation) happens in store.svelte.js via sanitiseUiState.
  $effect(() => {
    const snapshot = JSON.stringify({ mode: ui.mode, domain: ui.domain, outputMode: ui.outputMode, uiTheme: ui.uiTheme, bundle: ui.bundle });
    try {
      localStorage.setItem(UI_STORAGE_KEY, snapshot);
    } catch {
      /* quota / private mode — non-essential, ignore */
    }
  });

  // Track live viewport changes for the preview slide-over and output drawer.
  // Initial values are already set correctly by the store (viewport-aware
  // initialisation), so these effects only need to handle subsequent changes
  // (e.g. rotating the device, resizing a desktop window across a breakpoint).
  $effect(() => {
    const mql = window.matchMedia('(max-width: 1100px)');
    const onChange = (e) => { ui.previewOpen = !e.matches; };
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  });

  $effect(() => {
    const mql = window.matchMedia('(max-width: 600px)');
    const onChange = (e) => { ui.outputOpen = !e.matches; };
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  });

  // Keyboard shortcuts: '/' focuses the search box; 'b'/'a' switch mode;
  // '[' / ']' cycle domains; 'Escape' clears the search; Ctrl+Z / Ctrl+Shift+Z
  // step the override history.
  function onKey(e) {
    // Ctrl/Cmd + Z handlers run regardless of focus context — undo/redo
    // is a global affordance, even while typing in an input.
    const meta = e.ctrlKey || e.metaKey;
    if (meta && (e.key === 'z' || e.key === 'Z')) {
      e.preventDefault();
      if (e.shiftKey) redo(); else undo();
      return;
    }
    if (meta && (e.key === 'y' || e.key === 'Y')) {
      e.preventDefault();
      redo();
      return;
    }

    if (e.target instanceof HTMLElement) {
      const t = e.target;
      if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable) {
        if (e.key === 'Escape' && t.tagName === 'INPUT' && (t.type === 'search' || t.type === 'text')) {
          // Let the search box handle Escape itself.
        } else {
          return;
        }
      }
    }
    if (e.key === 'Escape') {
      // Dismiss the slide-over preview overlay (narrow viewports only — the
      // desktop pane is a persistent layout region, not a dialog). The search
      // box's own Escape (clear query) takes precedence when it has focus.
      const inInput = e.target instanceof HTMLElement && e.target.tagName === 'INPUT';
      if (!inInput && ui.previewOpen && window.matchMedia('(max-width: 1100px)').matches) {
        ui.previewOpen = false;
      }
    } else if (e.key === '/') {
      e.preventDefault();
      document.querySelector('#cfg-search')?.focus();
    } else if (e.key === 'b' || e.key === 'B') {
      ui.mode = 'basic';
    } else if (e.key === 'a' || e.key === 'A') {
      ui.mode = 'advanced';
    } else if (e.key === '[' || e.key === ']') {
      // Cycle the domains visible in the current mode.
      const ids = ui.mode === 'basic'
        ? ['home', ...BASIC_DOMAIN_IDS]
        : DOMAINS.map((d) => d.id);
      const i = ids.indexOf(ui.domain);
      if (i !== -1) {
        const next = (i + (e.key === ']' ? 1 : -1) + ids.length) % ids.length;
        ui.domain = ids[next];
      }
    }
  }
</script>

<svelte:window onkeydown={onKey} />

<div
  class="shell"
  class:shell--no-preview={!ui.previewOpen}
  class:shell--no-sidebar={!ui.sidebarOpen}
  class:shell--dragging={dragging}
  style="--shell-sw: {sidebarWidth}px; --shell-pw: {previewWidth}px"
>
  <Header />

  <Sidebar />

  <!-- Sidebar / main drag handle (only when sidebar is expanded) -->
  {#if ui.sidebarOpen}
    <div
      class="resizer resizer--sidebar"
      role="separator"
      aria-orientation="vertical"
      aria-label="Drag to resize sidebar"
      title="Drag to resize sidebar"
      onpointerdown={(e) => startResize('sidebar', e)}
      onpointermove={(e) => onResizeMove('sidebar', e)}
      onpointerup={endResize}
      onpointercancel={endResize}
      onlostpointercapture={endResize}
    ></div>
  {/if}

  <main class="main" aria-label="Configurator main">
    {#if home}
      <Home />
    {:else if tool === 'wcag'}
      <WcagPanel />
    {:else if tool === 'themes'}
      <ThemeGallery />
    {:else if tool === 'setup'}
      <BundlePicker />
    {:else if tool === 'cheatsheet'}
      <Cheatsheet />
    {:else}
      {#key ui.domain}
        <DomainPanel {domain} />
      {/key}
    {/if}
  </main>

  <!-- Main / preview drag handle (only when preview pane is docked) -->
  {#if ui.previewOpen}
    <div
      class="resizer resizer--preview"
      role="separator"
      aria-orientation="vertical"
      aria-label="Drag to resize live preview"
      title="Drag to resize live preview"
      onpointerdown={(e) => startResize('preview', e)}
      onpointermove={(e) => onResizeMove('preview', e)}
      onpointerup={endResize}
      onpointercancel={endResize}
      onlostpointercapture={endResize}
    ></div>
  {/if}

  {#if ui.previewOpen}
    <!-- Scrim behind the slide-over preview on narrow viewports (≤1100px);
         display:none on desktop where the preview is a regular grid pane. -->
    <button class="scrim" aria-label="Close preview" onclick={() => (ui.previewOpen = false)}></button>
    <Preview />
  {/if}

  <OutputPanel />
</div>

<style>
  /*
   * Grid layout — 5-column when all panes visible:
   *   sidebar | rs1 | main | rs2 | preview
   *
   * rs1 / rs2 are the 6 px drag-handle columns. CSS custom properties
   * --shell-sw and --shell-pw are set via inline style from Svelte state,
   * defaulting to 240 / 380 px so the layout still works without JS.
   */
  .shell {
    --shell-sw: 240px;   /* sidebar width  (overridden by inline style) */
    --shell-pw: 440px;   /* preview width  (overridden by inline style) */
    --shell-rs: 6px;     /* drag-handle column width */

    display: grid;
    grid-template-columns: var(--shell-sw) var(--shell-rs) minmax(0, 1fr) var(--shell-rs) var(--shell-pw);
    grid-template-rows: auto minmax(0, 1fr) auto;
    grid-template-areas:
      "header header header header header"
      "side   rs1    main   rs2    preview"
      "output output output output output";
    height: 100vh;
  }

  /* Preview hidden — only sidebar + drag-handle + main. */
  .shell--no-preview {
    grid-template-columns: var(--shell-sw) var(--shell-rs) minmax(0, 1fr);
    grid-template-areas:
      "header header header"
      "side   rs1    main"
      "output output output";
  }

  /* Sidebar collapsed (icon rail 60 px) — no rs1 since icon rail isn't resizable. */
  .shell--no-sidebar {
    grid-template-columns: 60px minmax(0, 1fr) var(--shell-rs) var(--shell-pw);
    grid-template-areas:
      "header header header  header"
      "side   main   rs2     preview"
      "output output output  output";
  }

  .shell--no-sidebar.shell--no-preview {
    grid-template-columns: 60px minmax(0, 1fr);
    grid-template-areas:
      "header header"
      "side   main"
      "output output";
  }

  /* Global col-resize cursor while dragging — prevents flicker when the
     pointer strays outside the 6 px handle during fast moves. */
  .shell--dragging,
  .shell--dragging * { cursor: col-resize !important; user-select: none; }

  .main {
    grid-area: main;
    min-width: 0;
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background: var(--cfg-bg);
    /* No border-left here — the adjacent resizer column provides separation. */
  }

  /* Drag handles between panes. */
  .resizer {
    position: relative;
    cursor: col-resize;
    z-index: 20;
    touch-action: none; /* prevent scroll-hijack on touch */
    /* Subtle 1 px center line that matches the existing border style. */
    background: transparent;
    transition: background 0.1s;
  }
  .resizer--sidebar { grid-area: rs1; }
  .resizer--preview { grid-area: rs2; }

  /* Center line (visual affordance) */
  .resizer::after {
    content: '';
    position: absolute;
    top: 0; bottom: 0;
    left: 50%; transform: translateX(-50%);
    width: 1px;
    background: var(--cfg-border);
    pointer-events: none;
    transition: background 0.1s, width 0.15s;
  }
  .resizer:hover::after,
  .shell--dragging .resizer::after {
    background: var(--cfg-accent-strong);
    width: 3px;
  }

  .scrim {
    display: none;
    position: fixed;
    inset: 0;
    z-index: 49;
    background: rgba(0, 0, 0, 0.45);
    border: 0;
    padding: 0;
    cursor: pointer;
  }

  /* Mid breakpoint: preview becomes a slide-over overlay. Resizers are
     hidden since the two-column layout is managed by breakpoint CSS. */
  @media (max-width: 1100px) {
    .shell,
    .shell--no-preview,
    .shell--no-sidebar,
    .shell--no-sidebar.shell--no-preview {
      grid-template-columns: 60px minmax(0, 1fr);
      grid-template-areas:
        "header header"
        "side main"
        "output output";
    }
    .resizer { display: none; }
    /* Restore the left border on main that the resizer normally provides. */
    .main { border-left: 1px solid var(--cfg-border); }
    .scrim { display: block; }
    .shell :global(section.preview) {
      position: fixed;
      inset: 0 0 0 auto;
      width: min(440px, 94vw);
      z-index: 50;
      border-left: 1px solid var(--cfg-border-strong);
      box-shadow: -16px 0 48px rgba(0, 0, 0, 0.5);
    }
  }
  @media (max-width: 600px) {
    .shell,
    .shell--no-preview,
    .shell--no-sidebar,
    .shell--no-sidebar.shell--no-preview {
      grid-template-columns: 44px minmax(0, 1fr);
    }
  }
  @media (max-width: 400px) {
    .shell,
    .shell--no-preview,
    .shell--no-sidebar,
    .shell--no-sidebar.shell--no-preview {
      grid-template-columns: 40px minmax(0, 1fr);
    }
  }
</style>
