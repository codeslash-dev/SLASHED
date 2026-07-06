---
layout: default
title: Home
---

<style>
.hero {
  text-align: center;
  padding: 3.5rem 1rem 3rem;
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 3rem;
}
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: #eef2ff;
  color: #4f46e5;
  border: 1px solid #c7d2fe;
  border-radius: 999px;
  padding: 0.2rem 0.75rem;
  font-size: 0.78rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
  text-decoration: none;
}
.hero-badge:hover { background: #e0e7ff; }
.hero h1 {
  font-size: clamp(2rem, 5vw, 3.25rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
  color: #0f0f0f;
  margin: 0 0 1rem;
}
.hero h1 span { color: #4f46e5; }
.hero p {
  font-size: 1.1rem;
  color: #555;
  max-width: 38rem;
  margin: 0 auto 2rem;
  line-height: 1.65;
}
.hero-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}
.btn-primary {
  display: inline-flex; align-items: center; gap: 0.35rem;
  background: #4f46e5; color: #fff;
  padding: 0.65rem 1.4rem; border-radius: 8px;
  font-weight: 600; font-size: 0.92rem;
  text-decoration: none; transition: background 0.15s;
}
.btn-primary:hover { background: #4338ca; color: #fff; }
.btn-secondary {
  display: inline-flex; align-items: center; gap: 0.35rem;
  background: #fff; color: #333;
  padding: 0.65rem 1.4rem; border-radius: 8px;
  font-weight: 600; font-size: 0.92rem;
  text-decoration: none; border: 1px solid #d0d0d0;
  transition: border-color 0.15s, background 0.15s;
}
.btn-secondary:hover { background: #f5f5f5; color: #111; }

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: 1.25rem;
  margin-bottom: 3rem;
}
.feature-card {
  background: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  padding: 1.3rem 1.4rem;
}
.feature-card .icon { font-size: 1.4rem; margin-bottom: 0.5rem; }
.feature-card h3 { font-size: 0.95rem; font-weight: 700; margin: 0 0 0.35rem; color: #111; }
.feature-card p { font-size: 0.845rem; color: #666; margin: 0; line-height: 1.55; }

.section-label {
  font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em;
  text-transform: uppercase; color: #888; margin-bottom: 0.75rem;
}
.install-box {
  background: #0f0f0f;
  border-radius: 10px;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1rem;
  overflow-x: auto;
}
.install-box pre { background: none; padding: 0; margin: 0; }
.install-box code { color: #a5b4fc; font-size: 0.875rem; background: none; padding: 0; }
.install-box .comment { color: #555; }
.bundles { font-size: 0.85rem; color: #555; margin: 0.5rem 0 2rem; }
.bundles code { font-size: 0.82rem; }

.doc-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}
.doc-section h3 { font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #888; margin: 0 0 0.6rem; }
.doc-section ul { list-style: none; margin: 0; padding: 0; }
.doc-section li { margin: 0; }
.doc-section a { font-size: 0.875rem; color: #333; text-decoration: none; display: block; padding: 0.2rem 0; border-bottom: 1px solid #f0f0f0; }
.doc-section a:hover { color: #4f46e5; }
.doc-section a span { font-size: 0.78rem; color: #999; margin-left: 0.4rem; }

.meta-row {
  display: flex; gap: 1rem; flex-wrap: wrap;
  font-size: 0.8rem; color: #888;
  padding-top: 2rem; border-top: 1px solid #eee;
}
.meta-row a { color: #888; }
.meta-row a:hover { color: #4f46e5; }
</style>

<div class="hero">
  <a class="hero-badge" href="https://github.com/codeslash-dev/SLASHED/releases">v0.6.19 — see what's new →</a>
  <h1>CSS that gets out<br>of <span>your way</span></h1>
  <p>A cascade-layer framework with 840 design tokens, automatic dark mode, fluid type &amp; spacing — and zero JavaScript, zero build step.</p>
  <div class="hero-actions">
    <a class="btn-primary" href="/configurator/">Open Configurator →</a>
    <a class="btn-secondary" href="/docs/demo.html">View Demo</a>
    <a class="btn-secondary" href="/demos/full-api-demo.html">Full API Demo</a>
    <a class="btn-secondary" href="https://github.com/codeslash-dev/SLASHED">GitHub</a>
  </div>
</div>

<div class="features">
  <div class="feature-card">
    <div class="icon">🎨</div>
    <h3>OKLCH Color Engine</h3>
    <p>840+ tokens derived from a handful of source colors. Full palette, dark mode, and semantic roles — all automatic.</p>
  </div>
  <div class="feature-card">
    <div class="icon">📐</div>
    <h3>Fluid Type &amp; Space</h3>
    <p>Type and spacing scales that flow smoothly from mobile to 4K using CSS <code>clamp()</code> — no breakpoints needed.</p>
  </div>
  <div class="feature-card">
    <div class="icon">🌗</div>
    <h3>Automatic Dark Mode</h3>
    <p>Light and dark palettes are derived from a single source color. Section-level theming with <code>[data-theme]</code>.</p>
  </div>
  <div class="feature-card">
    <div class="icon">⚡</div>
    <h3>Zero Build Step</h3>
    <p>Pure CSS custom properties. Drop in one <code>&lt;link&gt;</code> tag and customise with <code>:root</code> overrides. No Node, no bundler.</p>
  </div>
  <div class="feature-card">
    <div class="icon">🔩</div>
    <h3>@layer Architecture</h3>
    <p>Sixteen explicit cascade layers keep specificity predictable and your overrides always on top.</p>
  </div>
  <div class="feature-card">
    <div class="icon">🛠️</div>
    <h3>Visual Configurator</h3>
    <p>Live-preview every token, export override CSS, or share a config URL — all from the browser with no install.</p>
  </div>
</div>

---

## Install

<div class="install-box">
<pre><code><span class="comment">&lt;!-- jsDelivr CDN — recommended --&gt;</span>
&lt;link rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/codeslash-dev/SLASHED@dist/slashed.optimal.min.css"&gt;</code></pre>
</div>

<div class="install-box">
<pre><code><span class="comment">/* or @import — render-blocking &amp; serialized, prefer &lt;link&gt; */</span>
@import "https://cdn.jsdelivr.net/gh/codeslash-dev/SLASHED@dist/slashed.optimal.min.css";</code></pre>
</div>

<div class="bundles">

| Bundle | Includes |
|--------|----------|
| `slashed.optimal.css` | Core + classless forms — **recommended** |
| `slashed.optimal-components.css` | Optimal + component stubs |
| `slashed.optimal-utilities.css` | Optimal + utility classes |
| `slashed.full.css` | Everything |

[All CDN bundles →](https://cdn.jsdelivr.net/gh/codeslash-dev/SLASHED@dist/) · [GitHub Releases](https://github.com/codeslash-dev/SLASHED/releases) · [npm](https://www.npmjs.com/package/slashed)

</div>

---

## Documentation

<div class="doc-grid">
  <div class="doc-section">
    <h3>Guides</h3>
    <ul>
      <li><a href="/docs/architecture">Architecture <span>layers, cascade, bundle structure</span></a></li>
      <li><a href="/docs/theming">Theming <span>dark mode, overrides, fluid engine</span></a></li>
      <li><a href="/docs/migration">Migration <span>upgrade across versions</span></a></li>
      <li><a href="/docs/roadmap">Roadmap <span>planned features</span></a></li>
    </ul>
  </div>
  <div class="doc-section">
    <h3>Reference</h3>
    <ul>
      <li><a href="/docs/tokens">Tokens <span>all 840 design tokens</span></a></li>
      <li><a href="/docs/token-index">Token Index <span>browseable index</span></a></li>
      <li><a href="/docs/classes">Classes <span>utility &amp; macro classes</span></a></li>
      <li><a href="/docs/layout">Layout <span>grid, flex, spacing</span></a></li>
      <li><a href="/docs/macros">Macros <span>prose, flow, aspect, scroll-shadow</span></a></li>
      <li><a href="/docs/motion">Motion <span>animation &amp; transition tokens</span></a></li>
    </ul>
  </div>
  <div class="doc-section">
    <h3>Developer</h3>
    <ul>
      <li><a href="/docs/llm-guide">LLM Guide <span>AI-assisted development reference</span></a></li>
      <li><a href="/docs/api-index">API Index <span>machine-readable catalogue</span></a></li>
      <li><a href="/docs/source-comment-policy">Comment Policy <span>contributor conventions</span></a></li>
      <li><a href="/docs/demo.html">Demo <span>full component showcase</span></a></li>
      <li><a href="/demos/full-api-demo.html">Full API Demo <span>every class &amp; token, live · dark mode</span></a></li>
      <li><a href="/demos/full-api-demo-with-overrides.html">Full API Demo — overridden <span>ultimate-override.css applied</span></a></li>
      <li><a href="/docs/test-coverage.html">Test Coverage <span>visual regression suite</span></a></li>
    </ul>
  </div>
</div>

---

<div class="meta-row">
  <a href="/CHANGELOG">Changelog</a>
  <a href="/CONTRIBUTING">Contributing</a>
  <a href="https://github.com/codeslash-dev/SLASHED/actions/workflows/ci.yml">CI status</a>
  <a href="https://github.com/codeslash-dev/SLASHED">GitHub</a>
  <a href="https://www.npmjs.com/package/slashed">npm</a>
  <span>MIT · © CodeSlash</span>
</div>
