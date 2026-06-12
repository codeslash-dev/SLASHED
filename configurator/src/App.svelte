<script>
  /**
   * App shell.
   *
   * Layout (desktop ≥ 1100px):
   *   ┌─────────────────────────────────────────────────────────────────┐
   *   │ Header (brand · search · basic/advanced · theme · preview)       │
   *   ├──────────┬───────────────────────────────────────┬──────────────┤
   *   │          │                                       │              │
   *   │ Sidebar  │       Domain panel / WCAG tool        │   Preview    │
   *   │          │                                       │              │
   *   ├──────────┴───────────────────────────────────────┴──────────────┤
   *   │ Output drawer (override CSS, copy / download / import)           │
   *   └─────────────────────────────────────────────────────────────────┘
   *
   * Below 1100px the preview pane becomes a slide-over overlay (closed by
   * default, opened with the header ◨ toggle, dismissed via the scrim).
   * Below 760px the sidebar collapses to a
   * compact icon-only rail and the search box widens to fill the header.
   *
   * State lives in the shared `ui` store; this component just wires the
   * active domain to its panel.
   */
  import { DOMAINS, DOMAIN_BY_ID, BASIC_DOMAIN_IDS } from './lib/domains.js';
  import { ui, undo, redo, overrides } from './lib/store.svelte.js';
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
  import Home from './components/Home.svelte';

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

  // Persist the navigation prefs so a reload restores where the user was.
  // Restore (with validation) happens in store.svelte.js via sanitiseUiState.
  $effect(() => {
    const snapshot = JSON.stringify({ mode: ui.mode, domain: ui.domain, outputMode: ui.outputMode });
    try {
      localStorage.setItem(UI_STORAGE_KEY, snapshot);
    } catch {
      /* quota / private mode — non-essential, ignore */
    }
  });

  // On narrow viewports the preview is a slide-over overlay, so it must start
  // closed — opening a full-width scrim on first paint would bury the panel.
  // The media query is tracked live: shrinking the window dismisses the
  // overlay instead of dropping a scrim onto the app, and widening it back
  // restores the desktop pane (its default-open state).
  $effect(() => {
    const mql = window.matchMedia('(max-width: 1100px)');
    if (mql.matches) ui.previewOpen = false;
    const onChange = (e) => {
      ui.previewOpen = !e.matches;
    };
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

<div class="shell" class:shell--no-preview={!ui.previewOpen} class:shell--no-sidebar={!ui.sidebarOpen}>
  <Header />

  <Sidebar />

  <main class="main" aria-label="Configurator main">
    {#if home}
      <Home />
    {:else if tool === 'wcag'}
      <WcagPanel />
    {:else if tool === 'themes'}
      <ThemeGallery />
    {:else if tool === 'cheatsheet'}
      <Cheatsheet />
    {:else}
      {#key ui.domain}
        <DomainPanel {domain} />
      {/key}
    {/if}
  </main>

  {#if ui.previewOpen}
    <!-- Scrim behind the slide-over preview on narrow viewports (≤1100px);
         display:none on desktop where the preview is a regular grid pane. -->
    <button class="scrim" aria-label="Close preview" onclick={() => (ui.previewOpen = false)}></button>
    <Preview />
  {/if}

  <OutputPanel />
</div>

<style>
  .shell {
    display: grid;
    grid-template-columns: 240px minmax(0, 1fr) minmax(360px, 36%);
    grid-template-rows: auto minmax(0, 1fr) auto;
    grid-template-areas:
      "header header header"
      "side main preview"
      "output output output";
    height: 100vh;
  }
  .shell--no-preview {
    grid-template-columns: 240px minmax(0, 1fr);
    grid-template-areas:
      "header header"
      "side main"
      "output output";
  }
  .shell--no-sidebar {
    grid-template-columns: 60px minmax(0, 1fr) minmax(360px, 36%);
  }
  .shell--no-sidebar.shell--no-preview {
    grid-template-columns: 60px minmax(0, 1fr);
  }
  .main {
    grid-area: main;
    min-width: 0;
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background: var(--cfg-bg);
    border-left: 1px solid var(--cfg-border);
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

  /* Mid breakpoint: the preview leaves the grid and becomes a slide-over
     overlay — still fully functional, opened via the header ◨ toggle and
     dismissed by tapping the scrim (or the toggle again). */
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
    .scrim { display: block; }
    .shell :global(.preview) {
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
