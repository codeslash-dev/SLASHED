<script>
  let { steps = [], ariaLabel = 'Studio workflow' } = $props();
</script>

<nav aria-label={ariaLabel}>
  <ol class="studio-workflow">
    {#each steps as step, index (step)}
      <li><b>{index + 1}</b>{step}</li>
    {/each}
  </ol>
</nav>

<style>
  .studio-workflow { display: grid; grid-template-columns: repeat(var(--workflow-cols, 4), 1fr); gap: 8px; list-style: none; margin: 0; padding: 0; }
  .studio-workflow li { display: flex; align-items: center; gap: 8px; padding: 9px 10px; border: 1px solid var(--cfg-border); border-radius: var(--cfg-radius-s); background: var(--cfg-bg-2); color: var(--cfg-text-muted); font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; }
  .studio-workflow b { display: grid; place-items: center; inline-size: 20px; block-size: 20px; border-radius: 999px; background: var(--cfg-accent-strong); color: white; font-size: 10px; }
  @media (max-width: 640px) { .studio-workflow { grid-template-columns: 1fr 1fr; } }
</style>
