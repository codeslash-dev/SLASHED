<script>
  /**
   * Top bar: product title, framework sync stamp, and the preview toggle.
   */
  import { sync } from '../lib/model.js';

  let { showPreview = $bindable(true) } = $props();

  const generated = $derived(
    sync.generatedAt ? new Date(sync.generatedAt).toLocaleString() : ''
  );
</script>

<header class="hdr">
  <div class="hdr__brand">
    <span class="hdr__mark">/</span>
    <div>
      <h1 class="hdr__title">SLASHED Configurator</h1>
      <p class="hdr__sub">
        Generate override CSS for every framework token — no build step required.
      </p>
    </div>
  </div>

  <div class="hdr__meta">
    {#if sync.frameworkVersion}
      <span class="hdr__pill" title="Synced from {sync.source} on {generated}">
        framework v{sync.frameworkVersion}
      </span>
    {/if}
    <span class="hdr__pill hdr__pill--muted">{sync.counts?.tokens ?? 0} tokens</span>
    <label class="hdr__toggle">
      <input type="checkbox" bind:checked={showPreview} />
      <span>Preview</span>
    </label>
  </div>
</header>

<style>
  .hdr {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding: 12px 18px;
    background: var(--cfg-surface);
    border-bottom: 1px solid var(--cfg-border);
    flex-wrap: wrap;
  }
  .hdr__brand {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .hdr__mark {
    font-family: var(--cfg-mono);
    font-weight: 700;
    font-size: 28px;
    color: var(--cfg-accent);
    background: var(--cfg-surface-2);
    border: 1px solid var(--cfg-border-strong);
    border-radius: var(--cfg-radius);
    width: 44px;
    height: 44px;
    display: grid;
    place-items: center;
  }
  .hdr__title {
    margin: 0;
    font-size: 17px;
  }
  .hdr__sub {
    margin: 1px 0 0;
    font-size: 12px;
    color: var(--cfg-text-muted);
  }
  .hdr__meta {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }
  .hdr__pill {
    font-family: var(--cfg-mono);
    font-size: 11px;
    color: var(--cfg-accent);
    border: 1px solid var(--cfg-border-strong);
    background: var(--cfg-surface-2);
    border-radius: 999px;
    padding: 3px 10px;
  }
  .hdr__pill--muted {
    color: var(--cfg-text-muted);
  }
  .hdr__toggle {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--cfg-text-muted);
    cursor: pointer;
  }
  .hdr__toggle input {
    accent-color: var(--cfg-accent-strong);
  }
</style>
