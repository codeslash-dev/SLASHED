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
   * Below 1100px the preview hides. Below 760px the sidebar collapses to a
   * compact icon-only rail and the search box widens to fill the header.
   *
   * State lives in the shared `ui` store; this component just wires the
   * active domain to its panel.
   */
  import { DOMAIN_BY_ID } from './lib/domains.js';
  import { ui, undo, redo, overrides } from './lib/store.svelte.js';
  import { setProbeContext } from './lib/probeHost.js';
  import Header from './components/Header.svelte';
  import Sidebar from './components/Sidebar.svelte';
  import DomainPanel from './components/DomainPanel.svelte';
  import OutputPanel from './components/OutputPanel.svelte';
  import Preview from './components/Preview.svelte';
  import WcagPanel from './components/WcagPanel.svelte';
  import ThemeGallery from './components/ThemeGallery.svelte';
  import Cheatsheet from './components/Cheatsheet.svelte';

  const domain = $derived(DOMAIN_BY_ID.get(ui.domain) ?? DOMAIN_BY_ID.get('colors'));
  const tool = $derived(domain?.tool ?? '');

  // Keep the contrast-probe host in sync with the user's cascade so every
  // ContrastBadge resolves `var(...)`, `light-dark()` and `oklch(from ...)`
  // expressions correctly. setProbeContext is internally idempotent.
  $effect(() => {
    setProbeContext({ overrides, theme: ui.previewTheme });
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
    if (e.key === '/') {
      e.preventDefault();
      document.querySelector('#cfg-search')?.focus();
    } else if (e.key === 'b' || e.key === 'B') {
      ui.mode = 'basic';
    } else if (e.key === 'a' || e.key === 'A') {
      ui.mode = 'advanced';
    } else if (e.key === '[' || e.key === ']') {
      // Cycle non-tool domains.
      const ids = ['colors', 'typography', 'spacing', 'layout', 'borders', 'shadows', 'motion', 'effects', 'wcag', 'themes', 'misc', 'cheatsheet'];
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
    {#if tool === 'wcag'}
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

  /* Mid breakpoint: drop the preview pane. */
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
    .shell :global(.preview) { display: none; }
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
