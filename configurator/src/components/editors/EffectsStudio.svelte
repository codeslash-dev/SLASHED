<script>
  import { tokenByName } from '../../lib/model.js';
  import StudioFrame from './StudioFrame.svelte';
  import FriendlyControl from '../FriendlyControl.svelte';
  const names=['--sf-blur','--sf-opacity-muted','--sf-opacity-disabled','--sf-scrim-color','--sf-scrim-direction','--sf-scrim-size'];
  const tokens=names.map((name)=>tokenByName.get(name)).filter(Boolean);
</script>
<StudioFrame title="Effects Studio" description="Blur, opacity, scrim i compositing pokazane jako gotowa karta."><div class="effects-studio"><div class="fx"><div><h4>Readable media card</h4><p>Scrim, blur and muted states preview.</p></div></div><div class="controls">{#each tokens as token (token.name)}<FriendlyControl {token} showToken />{/each}</div></div></StudioFrame>
<style>.effects-studio{display:grid;gap:12px}.fx{min-height:180px;border-radius:18px;padding:18px;display:flex;align-items:end;background:linear-gradient(var(--sf-scrim-direction,to top),var(--sf-scrim-color,rgba(0,0,0,.55)),transparent),linear-gradient(135deg,var(--cfg-accent),var(--cfg-accent-soft));overflow:hidden}.fx div{backdrop-filter:blur(var(--sf-blur,12px));background:color-mix(in oklab,var(--cfg-surface) 70%,transparent);border:1px solid var(--cfg-border);border-radius:14px;padding:14px}.fx h4,.fx p{margin:0}.fx p{opacity:var(--sf-opacity-muted,.72)}.controls{border:1px solid var(--cfg-border);border-radius:var(--cfg-radius);overflow:clip}</style>
