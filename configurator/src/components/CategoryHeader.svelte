<script>
  import Icon from './Icon.svelte';
  let { domain, modifiedCount = 0, tokenCount = 0, onreset = null } = $props();
</script>

<header class="cat-hero">
  <div class="cat-hero__icon"><Icon name={domain.icon} size={22} /></div>
  <div class="cat-hero__copy">
    <p class="cat-hero__eyebrow">Visual framework editor</p>
    <h2>{domain.label}</h2>
    <p>{domain.blurb}</p>
  </div>
  <div class="cat-hero__stats">
    <span><strong>{modifiedCount}</strong> overrides</span>
    <span><strong>{tokenCount}</strong> variables</span>
    {#if modifiedCount > 0 && onreset}
      <button class="cfg-btn cfg-btn--danger cfg-btn--sm" type="button" onclick={onreset}>Reset category</button>
    {/if}
  </div>
</header>

<style>
  .cat-hero { display:grid; grid-template-columns:auto minmax(0,1fr) auto; gap:16px; align-items:center; padding:18px; border:1px solid var(--cfg-border); border-radius:var(--cfg-radius-l); background: radial-gradient(700px 180px at 10% 0%, var(--cfg-accent-soft), transparent 60%), var(--cfg-surface); box-shadow: var(--cfg-shadow-card); }
  .cat-hero__icon { inline-size:48px; block-size:48px; display:grid; place-items:center; color:var(--cfg-accent); border:1px solid color-mix(in oklab, var(--cfg-accent) 35%, transparent); border-radius:16px; background: color-mix(in oklab, var(--cfg-accent) 10%, transparent); }
  .cat-hero__copy { min-width:0; }
  .cat-hero__eyebrow { margin:0 0 3px; color:var(--cfg-accent); font-size:11px; font-weight:800; letter-spacing:.09em; text-transform:uppercase; }
  h2 { margin:0; font-size:clamp(22px,3vw,34px); line-height:1.05; }
  .cat-hero__copy p:last-child { margin:6px 0 0; color:var(--cfg-text-muted); }
  .cat-hero__stats { display:flex; align-items:center; justify-content:flex-end; gap:8px; flex-wrap:wrap; }
  .cat-hero__stats span { display:inline-flex; gap:4px; align-items:center; padding:6px 10px; border-radius:999px; background:var(--cfg-bg-2); color:var(--cfg-text-muted); border:1px solid var(--cfg-border); font-size:12px; }
  .cat-hero__stats strong { color:var(--cfg-text); }
  @media(max-width:760px){ .cat-hero { grid-template-columns:1fr; } .cat-hero__stats { justify-content:flex-start; } }
</style>
