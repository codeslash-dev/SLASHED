<script>
  let { children } = $props();
  let open = $state(false);
</script>

<div class="advanced-section">
  <button type="button" class="advanced-section__toggle" onclick={() => (open = !open)}>
    Advanced settings
    <span class="advanced-section__arrow" class:open>{open ? '▲' : '▼'}</span>
  </button>
  {#if open}
    <div class="advanced-section__body">
      {@render children()}
    </div>
  {/if}
</div>

<style>
  .advanced-section { margin-top: 24px; }
  .advanced-section__toggle {
    background: none;
    border: none;
    color: #2271b1;
    font-size: 13px;
    cursor: pointer;
    padding: 6px 0;
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 500;
  }
  .advanced-section__toggle:hover { text-decoration: underline; }
  .advanced-section__body { margin-top: 12px; }
</style>
