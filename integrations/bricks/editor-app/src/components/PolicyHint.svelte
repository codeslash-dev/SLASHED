<script>
  /**
   * Inline hint summarising the active naming policy. Always visible
   * inside the panel toolbar so users learn the rules without reading
   * the docs.
   */
  /** @type {{ policy: import('../lib/policy.js').Policy }} */
  let { policy } = $props();

  const flavorLabel = $derived(
    policy.flavor === 'single-dash' ? 'block__elem-mod' : 'block__elem--mod'
  );
  const charsLabel = $derived(policy.allowUnicode ? 'Unicode' : 'ASCII');
  const depthLabel = $derived(
    policy.maxDepth > 0 ? `≤${policy.maxDepth} deep` : 'unlimited depth'
  );
</script>

<small class="rebemer-policy-hint" aria-live="polite">
  {flavorLabel} · {charsLabel} · {depthLabel}
</small>
