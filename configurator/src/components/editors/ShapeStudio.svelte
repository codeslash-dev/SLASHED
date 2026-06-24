<script>
  import { tokenByName } from '../../lib/model.js';
  import StudioFrame from './StudioFrame.svelte';
  import FriendlyControl from '../FriendlyControl.svelte';
  const samples=['Button','Input','Card','Badge'];
  const names=['--sf-radius-s','--sf-radius-m','--sf-radius-l','--sf-radius-xl','--sf-border-width-1','--sf-divider-width','--sf-focus-ring-width','--sf-focus-ring-offset'];
  const tokens=names.map((name)=>tokenByName.get(name)).filter(Boolean);
</script>
<StudioFrame title="Shape Studio" description="Radius, border i focus ring na realnych kształtach komponentów."><div class="shape-studio"><div class="shapes">{#each samples as n}<div><span>{n}</span></div>{/each}</div><div class="controls">{#each tokens as token (token.name)}<FriendlyControl {token} showToken />{/each}</div></div></StudioFrame>
<style>.shape-studio{display:grid;gap:12px}.shapes{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.shapes div{min-height:88px;display:grid;place-items:center;border:var(--sf-border-width-1,1px) solid var(--sf-color-border);border-radius:var(--sf-radius-l);background:var(--sf-color-raised);box-shadow:0 0 0 var(--sf-focus-ring-width,2px) color-mix(in oklab,var(--sf-color-primary) 0%,transparent)}.shapes span{padding:8px 12px;border-radius:var(--sf-radius-m);background:var(--cfg-bg-2)}.controls{border:1px solid var(--cfg-border);border-radius:var(--cfg-radius);overflow:clip}@media(max-width:640px){.shapes{grid-template-columns:repeat(2,1fr)}}</style>
