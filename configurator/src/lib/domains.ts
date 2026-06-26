/** Token name substrings that define each domain's scope. Shared by DomainPanel and check-curation. */
export const DOMAIN_PATTERNS: Record<string, string[]> = {
  colors: [
    "color", "contrast", "palette-mix", "lumlocker", "scrim",
  ],
  typography: [
    "font", "--sf-text", "leading", "tracking", "weight", "body-font", "heading-font",
    "body-em", "body-text", "heading-text", "display-l-", "display-m-",
    "-h1-", "-h2-", "-h3-", "-h4-", "-h5-", "-h6-",
    "line-clamp", "link-", "optical-sizing", "fluid-min-vw", "fluid-max-vw",
  ],
  spacing: [
    "space", "section", "gutter", "content-gap", "component-pad",
  ],
  layout: [
    "container", "layout", "grid", "breakpoint", "measure", "column",
    "header-height", "touch-target", "aspect", "bento", "cluster",
    "content-intrinsic", "cover-min", "equal-min", "frame", "ratio-",
    "reel", "safe-", "sidebar", "switcher",
  ],
  borders: [
    "radius", "border-width", "border-scale", "border-style", "divider",
  ],
  shadows: ["shadow"],
  motion: [
    "motion", "duration", "easing", "ease", "scroll-timeline",
  ],
  effects: [
    "filter", "blur", "backdrop", "opacity", "effect",
  ],
  misc: [
    "z-", "cursor", "ring", "focus", "outline", "selection",
    "icon", "is-active", "is-current", "is-open", "is-pressed",
    "field-required", "object-fit", "object-position", "print-",
    "scrollbar", "size-",
  ],
};

export function domainOf(tokenName: string): string {
  for (const [domain, patterns] of Object.entries(DOMAIN_PATTERNS)) {
    if (domain === "misc") continue;
    if (patterns.some(p => tokenName.includes(p))) return domain;
  }
  return "misc";
}
