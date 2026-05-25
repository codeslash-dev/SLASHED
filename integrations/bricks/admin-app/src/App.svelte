<script>
  /**
   * Top-level shell: header, tab nav, current tab body, live preview, save bar.
   *
   * Owns no state of its own — everything lives in stores.svelte.js so
   * any component can read or mutate it directly. The reactive graph
   * collapses what was ~20 lines of jQuery dirty-tracking + DOM querying
   * in admin-page.js into a single $derived for the active tab body.
   */
  import { meta, ui } from './lib/stores.svelte.js';
  import TabNav from './components/TabNav.svelte';
  import ColorTab from './components/ColorTab.svelte';
  import StubTab from './components/StubTab.svelte';
  import LivePreview from './components/LivePreview.svelte';
  import SaveBar from './components/SaveBar.svelte';

  // Warn before unload when the form has unsaved changes.
  // Replaces the equivalent jQuery `$(window).on('beforeunload', ...)`
  // block in admin-page.js.
  $effect(() => {
    /**
     * `beforeunload` listener that triggers the browser's native
     * "Leave site? Changes you made may not be saved." prompt when
     * the form is dirty. Returning a non-empty string from a beforeunload
     * handler is the legacy way to opt into the prompt; modern browsers
     * also accept `event.preventDefault()` + a non-empty `returnValue`,
     * which is what we use here for cross-engine support.
     *
     * @param {BeforeUnloadEvent} e
     */
    function onBeforeUnload(e) {
      if (ui.dirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    }
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  });
</script>

<div class="slashed-svelte-admin">
  <header class="slashed-svelte-admin__header">
    <h1>SLASHED Design Tokens <span class="badge">v2 · Svelte POC</span></h1>
    <p class="muted">
      Proof-of-concept admin page rendered with Svelte 5 instead of jQuery.
      Currently only the Colors tab is fully ported; other tabs show a stub.
    </p>
  </header>

  <TabNav />

  <section class="slashed-svelte-admin__body">
    {#if ui.activeTab === 'colors'}
      <ColorTab />
    {:else}
      <StubTab tab={meta.tabs[ui.activeTab] ?? ui.activeTab} />
    {/if}
  </section>

  <LivePreview />

  <SaveBar />
</div>

<style>
  .slashed-svelte-admin {
    --gap: 16px;
    display: flex;
    flex-direction: column;
    gap: var(--gap);
    max-width: 1100px;
    padding-bottom: 80px; /* room for fixed save bar */
  }

  .slashed-svelte-admin__header h1 {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 0;
  }

  .slashed-svelte-admin__header .badge {
    font-size: 11px;
    font-weight: 500;
    background: #2271b1;
    color: white;
    padding: 3px 8px;
    border-radius: 999px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .muted {
    color: #50575e;
    margin: 4px 0 0;
  }

  .slashed-svelte-admin__body {
    background: white;
    border: 1px solid #c3c4c7;
    border-radius: 4px;
    padding: 20px;
  }
</style>
