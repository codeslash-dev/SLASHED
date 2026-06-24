<script>
  import { tokenByName } from '../../lib/model.js';
  import StudioFrame from './StudioFrame.svelte';
  import FriendlyControl from '../FriendlyControl.svelte';
  const levels=['xs','s','m','l','xl'];
  const names=['--sf-shadow-strength','--sf-shadow-s','--sf-shadow-m','--sf-shadow-l','--sf-shadow-xl','--sf-shadow-color','--sf-shadow-glow-color'];
  const tokens=names.map((name)=>tokenByName.get(name)).filter(Boolean);
</script>
<StudioFrame title="Shadow Studio" description="Elevation stack pokazuje siłę cieni w kontekście light/dark."><div class="shadow-studio"><div class="stack">{#each levels as l}<article style:box-shadow={`var(--sf-shadow-${l}, var(--sf-shadow-m))`}><b>{l}</b></article>{/each}</div><div class="controls">{#each tokens as token (token.name)}<FriendlyControl {token} showToken />{/each}</div></div></StudioFrame>
<style>.shadow-studio{display:grid;gap:12px}.stack{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;align-items:end}.stack article{min-height:70px;border-radius:14px;background:var(--sf-color-raised);border:1px solid var(--sf-color-border);display:grid;place-items:center}.stack b{text-transform:uppercase;color:var(--cfg-text-muted)}.controls{border:1px solid var(--cfg-border);border-radius:var(--cfg-radius);overflow:clip}@media(max-width:700px){.stack{grid-template-columns:repeat(2,1fr)}}</style>
