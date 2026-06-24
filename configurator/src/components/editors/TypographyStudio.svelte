<script>
  import { overrides } from '../../lib/store.svelte.js';
  import { tokenByName } from '../../lib/model.js';
  import StudioFrame from './StudioFrame.svelte';
  import FriendlyControl from '../FriendlyControl.svelte';

  const PANELS = [
    { id: 'Overview', tokens: ['--sf-font-body', '--sf-font-heading', '--sf-font-mono', '--sf-leading-normal', '--sf-font-weight-heading', '--sf-heading-text-wrap'] },
    { id: 'Body', tokens: ['--sf-font-body', '--sf-leading-normal', '--sf-text-m', '--sf-content-gap'] },
    { id: 'H1', tokens: ['--sf-h1-font-size', '--sf-h1-line-height', '--sf-h1-letter-spacing', '--sf-font-weight-heading', '--sf-heading-text-wrap'] },
    { id: 'H2', tokens: ['--sf-h2-font-size', '--sf-h2-line-height', '--sf-h2-letter-spacing', '--sf-font-weight-heading', '--sf-heading-text-wrap'] },
    { id: 'H3', tokens: ['--sf-h3-font-size', '--sf-h3-line-height', '--sf-h3-letter-spacing', '--sf-font-weight-heading', '--sf-heading-text-wrap'] },
    { id: 'H4', tokens: ['--sf-h4-font-size', '--sf-h4-line-height', '--sf-h4-letter-spacing', '--sf-font-weight-heading'] },
    { id: 'Mono', tokens: ['--sf-font-mono', '--sf-code-font-size', '--sf-code-padding-inline', '--sf-code-padding-block'] },
  ];
  let active = $state('Overview');
  const panel = $derived(PANELS.find((p) => p.id === active) ?? PANELS[0]);
  const activeTokens = $derived(panel.tokens.map((name) => tokenByName.get(name)).filter(Boolean));
  const headingFont = $derived(overrides['--sf-font-heading'] || 'var(--sf-font-heading)');
  const bodyFont = $derived(overrides['--sf-font-body'] || 'var(--sf-font-body)');
  const monoFont = $derived(overrides['--sf-font-mono'] || 'var(--sf-font-mono)');
</script>

<StudioFrame title="Typography Studio" description="Duży specimen jest centrum pracy: wybierz poziom tekstu, ustaw font, skalę, rytm i wrap, a efekt widzisz natychmiast." tone="type">
  <div class="type-studio">
    <div class="tabs" role="tablist" aria-label="Typography editing scope">
      {#each PANELS as p}<button role="tab" aria-selected={active===p.id} class:active={active===p.id} onclick={() => active=p.id}>{p.id}</button>{/each}
    </div>
    <div class="specimen">
      <h1 style:font-family={headingFont}>The quick brown fox</h1>
      <h2 style:font-family={headingFont}>Jumps over the lazy dog</h2>
      <h3 style:font-family={headingFont}>Typography at every scale</h3>
      <h4 style:font-family={headingFont}>Fluid, readable, precise</h4>
      <strong style:font-family={headingFont}>Fine-tune each heading level</strong>
      <code style:font-family={monoFont}>Pixel-perfect control</code>
      <p style:font-family={bodyFont}>Body: The quick brown fox jumps over the lazy dog. A short paragraph shows body rhythm, line height and spacing at a glance.</p>
    </div>
    <div class="controls">
      {#each activeTokens as token (token.name)}
        <FriendlyControl {token} showToken />
      {/each}
    </div>
  </div>
</StudioFrame>
<style>
  .type-studio{display:grid;gap:12px}.tabs{display:flex;gap:0;overflow:auto;border:1px solid var(--cfg-border);border-radius:var(--cfg-radius-s);background:var(--cfg-bg-2)}.tabs button{border:0;border-right:1px solid var(--cfg-border);background:transparent;color:var(--cfg-text-muted);padding:8px 12px;font-weight:800;font-size:11px;text-transform:uppercase}.tabs button.active{background:var(--cfg-accent-strong);color:white}.specimen{padding:22px;border-radius:var(--cfg-radius);background:var(--sf-color-bg);color:var(--sf-color-text);border:1px solid var(--cfg-border)}h1,h2,h3,h4,p{margin:0}h1{font-size:clamp(42px,7vw,74px);line-height:.95;text-wrap:var(--sf-heading-text-wrap,balance)}h2{font-size:clamp(32px,5vw,54px);line-height:1;text-wrap:var(--sf-heading-text-wrap,balance)}h3{font-size:clamp(24px,3.5vw,38px);margin-top:8px}h4{font-size:clamp(19px,2.6vw,28px);margin-top:8px}strong,code{display:block;margin-top:8px;font-size:18px}p{margin-top:12px;color:var(--sf-color-text--muted);font-size:16px;max-width:68ch}.controls{border:1px solid var(--cfg-border);border-radius:var(--cfg-radius);overflow:clip;background:var(--cfg-surface)}
</style>
