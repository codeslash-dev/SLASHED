<script>
  /**
   * App shell: header (brand · Basic/Advanced mode · preview toggle), the
   * domain tab strip, the active domain panel (or the WCAG tool) beside the
   * live preview, and the override-CSS output drawer.
   *
   * State lives in the shared `ui` store; this component just wires the active
   * domain to its panel.
   */
  import { DOMAIN_BY_ID } from './lib/domains.js';
  import { ui } from './lib/store.svelte.js';
  import Header from './components/Header.svelte';
  import TabNav from './components/TabNav.svelte';
  import DomainPanel from './components/DomainPanel.svelte';
  import OutputPanel from './components/OutputPanel.svelte';
  import Preview from './components/Preview.svelte';
  import WcagPanel from './components/WcagPanel.svelte';

  let showPreview = $state(true);

  const domain = $derived(DOMAIN_BY_ID.get(ui.domain) ?? DOMAIN_BY_ID.get('typography'));
  const isTool = $derived(domain?.tool === 'wcag');
</script>

<div class="shell">
  <Header bind:showPreview />
  <TabNav />

  <div class="body" class:body--no-preview={!showPreview}>
    {#if isTool}
      <main class="main"><WcagPanel /></main>
    {:else}
      <main class="main">
        {#key ui.domain}
          <DomainPanel {domain} />
        {/key}
      </main>
    {/if}

    {#if showPreview}
      <Preview />
    {/if}
  </div>

  <OutputPanel />
</div>

<style>
  .shell {
    display: grid;
    grid-template-rows: auto auto minmax(0, 1fr) auto;
    height: 100vh;
  }
  .body {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(360px, 38%);
    min-height: 0;
  }
  .body--no-preview {
    grid-template-columns: minmax(0, 1fr);
  }
  .main {
    min-width: 0;
    min-height: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }
  .main > :global(.wcag),
  .main > :global(.panel) {
    flex: 1;
    min-height: 0;
  }

  @media (max-width: 1100px) {
    .body,
    .body--no-preview {
      grid-template-columns: minmax(0, 1fr);
    }
    .body :global(.preview) {
      display: none;
    }
  }
</style>
