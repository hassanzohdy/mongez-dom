---
description: "Use @mongez/dom to update browser document state from client-side application code. Start with setPageMeta for a route's title, description, social image, canonical URL, favicon, and theme color; then use the focused topics for custom head tags, font and stylesheet injection, CSS variables, scrolling, keyboard helpers, and viewport reads. All exports access document, window, or FontFace, so call them only after the browser environment is available."
---

# @mongez/dom

Use this package for small, imperative browser DOM tasks. It is framework-agnostic, but it is not server-safe: invoke its exports from a client-only lifecycle hook, event handler, or browser entry point.

## Typical page setup

```ts
import { cssVariable, googleFont, setPageMeta } from "@mongez/dom";

export function applyProductPage(product: {
  name: string;
  description: string;
  image: string;
  path: string;
}) {
  setPageMeta({
    title: product.name,
    description: product.description,
    image: product.image,
    url: `https://example.com${product.path}`,
    type: "website",
  });

  googleFont("https://fonts.googleapis.com/css2?family=Inter:wght@400;700", "app-font");
  cssVariable("--brand-color", "#0a84ff");
}
```

For React, call this from `useEffect`; for SSR-capable apps, ensure the function is not called while rendering on the server.

## Topics

- [Page metadata](metadata/SKILL.md) — `setPageMeta` and individual title, description, image, canonical, favicon, and color helpers.
- [Head elements](head-elements/SKILL.md) — custom and reusable `<meta>` / `<link>` elements plus HTML attributes.
- [Assets](assets/SKILL.md) — stylesheets, Google and local fonts, scripts, and CSS custom properties.
- [Interactions](interactions/SKILL.md) — smooth scrolling, legacy keyboard helpers, dark-mode detection, HTML-to-text, and dimension reads.
- [Recipes](recipes/SKILL.md) — copyable combinations for common browser-side flows.

## Boundaries

- Not this package → declarative React head management: `@mongez/react-helmet`.
- Not this package → routing or route lifecycle: your router package.
- Not this package → persistent browser storage: `@mongez/cache` or the Web Storage APIs.
- Not this package → sanitizing untrusted HTML: a dedicated sanitizer such as DOMPurify.
