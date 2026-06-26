<script>
  let { title, hint = '', modifiedCount = 0, defaultOpen = true, children } = $props();
  let open = $state(window.innerWidth >= 768 ? defaultOpen : false);
</script>

<details class="control-section" open={open} ontoggle={(e) => (open = e.currentTarget.open)}>
  <summary>
    <span class="control-section__chev">›</span>
    <strong>{title}</strong>
    {#if hint}<em>{hint}</em>{/if}
    {#if modifiedCount}<b>{modifiedCount} changed</b>{/if}
  </summary>
  <div class="control-section__body">{@render children?.()}</div>
</details>

<style>
  .control-section { border:1px solid var(--cfg-border); border-radius:var(--cfg-radius); background:var(--cfg-surface); }
  summary { display:flex; align-items:center; gap:10px; padding:14px 16px; cursor:pointer; list-style:none; background:linear-gradient(to right, rgba(79,140,255,.06), transparent), var(--cfg-surface-2); border-bottom:1px solid var(--cfg-border); }
  summary::-webkit-details-marker { display:none; }
  .control-section:not([open]) summary { border-bottom:0; }
  .control-section[open] .control-section__chev { transform:rotate(90deg); }
  .control-section__chev { color:var(--cfg-text-faint); transition:transform .14s; font-size:20px; }
  strong { font-size:13px; text-transform:uppercase; letter-spacing:.06em; }
  em { color:var(--cfg-text-muted); font-style:normal; font-size:12px; flex:1; }
  b { color:var(--cfg-accent); background:color-mix(in oklab, var(--cfg-accent) 12%, transparent); border:1px solid color-mix(in oklab, var(--cfg-accent) 35%, transparent); border-radius:999px; padding:2px 8px; font-size:10px; text-transform:uppercase; }
  .control-section__body { display:block; }
</style>
