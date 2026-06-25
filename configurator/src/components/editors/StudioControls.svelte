<script>
  import ControlSection from '../ControlSection.svelte';
  import FriendlyControl from '../FriendlyControl.svelte';
  import { overrides } from '../../lib/store.svelte.js';

  let { groups = [] } = $props();
</script>

<div class="studio-controls">
  {#each groups as group (group.title)}
    <ControlSection title={group.title} hint={group.hint} modifiedCount={group.tokens.filter((token) => overrides[token.name] != null).length}>
      <div class="studio-controls__rows">
        {#each group.tokens as token (token.name)}
          <FriendlyControl {token} showToken />
        {/each}
      </div>
    </ControlSection>
  {/each}
</div>

<style>
  .studio-controls { display: grid; gap: 12px; }
  .studio-controls__rows { display: grid; }
</style>
