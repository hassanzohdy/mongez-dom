<div align="center">

# @mongez/dom

**Framework-agnostic browser DOM utilities — page metadata, fonts, stylesheets, CSS variables, keyboard helpers, viewport, and small DOM conveniences in flat function exports.**

[![npm](https://img.shields.io/npm/v/@mongez/dom.svg)](https://www.npmjs.com/package/@mongez/dom)
[![license](https://img.shields.io/npm/l/@mongez/dom.svg)](LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@mongez/dom.svg)](https://bundlephobia.com/package/@mongez/dom)
[![downloads](https://img.shields.io/npm/dw/@mongez/dom.svg)](https://www.npmjs.com/package/@mongez/dom)

</div>

---

## Why @mongez/dom?

Raw DOM APIs make you write `document.head.querySelector('meta[property="og:title"]') || document.createElement("meta")` boilerplate every time you want to update a tag. `helmet` is a Node middleware for HTTP security headers — different problem entirely. `react-helmet` (and `react-helmet-async`) only work inside a React tree, so they're useless from a router callback, an analytics module, or a service worker. `@mongez/dom` is the smallest set of imperative, side-effect-free helpers that cover the things almost every front-end project ends up rebuilding: `setPageMeta`, `googleFont`, `loadFont`, `cssVariable`, `scrollTo`, `loadScript`, `pressed`, viewport getters. Flat function exports, no runtime dependencies, drop into React / Vue / Svelte / Astro / vanilla the same way.

```ts
import { setPageMeta, googleFont, cssVariable, scrollTo } from "@mongez/dom";

setPageMeta({
  title: "Product Page",
  description: "Buy widget X today.",
  image: "https://cdn.example.com/product.png",
  url: "https://example.com/product",
  type: "website",
});

googleFont("https://fonts.googleapis.com/css2?family=Inter", "primary-font");
cssVariable("--color-primary", "#0a84ff");
scrollTo("#section-features");
```

> **`@mongez/dom` is framework-agnostic.** If you want declarative head management from React components, install [`@mongez/react-helmet`](https://github.com/hassanzohdy) — it wraps these same primitives in a React-idiomatic API.

---

## Features

| Feature | Description |
|---|---|
| **Page metadata** | `setPageMeta` fans out one call into title, description, Open Graph, Twitter Card, canonical, favicon, theme color, and `og:type`. |
| **Idempotent head builders** | `meta`, `itemprop`, `metaLink`, `styleSheet` reuse existing tags by selector — repeat calls update, never duplicate. |
| **Low-level head access** | `createHeadElement` / `createNewMeta` for tags the high-level API doesn't cover (manifest, preconnect, custom `og:*`/`article:*`). |
| **Element attributes** | `setHTMLAttributes`, `setElementAttributes`, `getElementAttributes` for `<html lang>`, ARIA, `data-*`, etc. |
| **Stylesheets & fonts** | `styleSheet` injects `<link rel="stylesheet">`, `googleFont` adds the two recommended preconnect hints, `loadFont` registers single or multi-weight fonts via the `FontFace` API. |
| **CSS variables** | `cssVariable` dual-purpose read/write on `:root`; `setCssVariable` / `getCssVariable` accept any element target. |
| **Keyboard helpers** | `pressed(event, key)` plus the four most-needed constants (`ENTER_KEY`, `ESC_KEY`, `TAB_KEY`, `CONTROL_KEY`). |
| **Viewport** | `getWindowWidth`, `getWindowHeight`, `getScreenWidth`, `getScreenHeight` as one-line live readers. |
| **Misc DOM** | `scrollTo`, `loadScript`, `htmlToText`, `userPrefersDarkMode`. |
| **Zero dependencies** | One package, no runtime deps, no subpath entry points — every export ships from `@mongez/dom`. |
| **TypeScript-first** | Public types for `MetaData`, `AttributesList`, `FontOptions`, `FontWeightSetup`, `OpenGraph`. |

---

## Installation

```sh
npm install @mongez/dom
```

```sh
yarn add @mongez/dom
```

```sh
pnpm add @mongez/dom
```

---

## Quick start

```ts
import {
  setPageMeta,
  cssVariable,
  googleFont,
  scrollTo,
  pressed,
  ENTER_KEY,
  userPrefersDarkMode,
} from "@mongez/dom";

// 1. Manage the page's <head> in one call.
setPageMeta({
  title: "Product Page",
  description: "Buy widget X today.",
  image: "https://cdn.example.com/product.png",
  url: "https://example.com/product",
  type: "website",
});

// 2. Read or write a CSS variable on :root.
cssVariable("--color-primary", userPrefersDarkMode() ? "#fff" : "#000");

// 3. Load a Google Font with the recommended preconnect tags.
googleFont("https://fonts.googleapis.com/css2?family=Inter", "ui-font");

// 4. Smooth-scroll to a CSS selector.
scrollTo("#section-features");

// 5. Keyboard helpers — no magic numbers.
input.addEventListener("keydown", e => {
  if (pressed(e, ENTER_KEY)) submit();
});
```

That's the entire happy path. The rest of this README is depth on the same surface.

> **Browser-only.** Every helper touches `document`, `window`, `matchMedia`, or `FontFace`. Calling them on the server (Node, edge runtimes, workers without DOM) throws. If your module loads on both, guard the call site with `typeof window !== "undefined"`, or move it to a client-only effect.

---

## Page metadata

`setPageMeta(metaList)` is the one-call entry point. Pass any subset of `MetaData` fields — each delegates to a single-purpose helper that's also independently exported.

```ts
import { setPageMeta } from "@mongez/dom";

setPageMeta({
  title: "Hello World",
  description: "An example page.",
  keywords: ["hello", "world"],            // or "hello,world"
  image: "https://cdn.example.com/cover.png",
  url: "https://example.com/page",         // canonical + og:url + twitter:url
  favIcon: "/favicon.ico",
  color: "#0a0a0a",                        // theme color
  type: "article",                         // og:type
});
```

Each field fans out to the matching tags. Repeat calls update existing tags instead of duplicating.

| Field | Tags written |
|---|---|
| `title` | `<title>`, `meta[property=og:title]`, `meta[property=og:image:alt]`, `meta[property=twitter:title]`, `meta[property=twitter:image:alt]`, `meta[itemprop=name]` |
| `description` | `meta[name=description]`, `meta[itemprop=description]`, `meta[property=og:description]`, `meta[property=twitter:description]` |
| `keywords` | `meta[name=keywords]` (arrays joined with `,`) |
| `image` | `meta[property=image]`, `meta[property=og:image]`, `meta[property=twitter:image]`, `meta[itemprop=image]` |
| `url` | `link[rel=canonical]`, `meta[property=og:url]`, `meta[property=twitter:url]` |
| `favIcon` | `link[rel=icon]` |
| `color` | `meta[name=theme-color]` |
| `type` | `meta[property=og:type]` |

### Per-field helpers

Use these when you only need to update one slice — e.g. a route change that affects only the title:

```ts
import {
  setTitle,
  setDescription,
  setKeywords,
  setImage,
  setPageColor,
  setFavIcon,
  setCanonicalUrl,
} from "@mongez/dom";

setTitle("Product page");        // updates <title> + 5 related social tags
setDescription("Buy widget X");  // updates 4 description tags
setImage("https://cdn.example.com/cover.png");
setCanonicalUrl("https://example.com/p/hello");
setFavIcon("/favicon.ico");
setPageColor("#0a0a0a");
setKeywords(["hello", "world"]); // → "hello,world"
```

### Reading what's been set

```ts
import { getMetaData } from "@mongez/dom";

getMetaData();          // full MetaData object
getMetaData("title");   // "Hello World"
```

Returns the internal `currentMetaData` singleton — only reflects values set through the helpers. Direct DOM writes via `document.head.querySelector(...)` are not tracked.

> **`getMetaData("favIcon")` and `getMetaData("url")` reflect a known bug.** `setFavIcon` and `setCanonicalUrl` write to the wrong internal field — the DOM tags are still correct, but the cache isn't. Treat those two reads as write-only for now.

---

## Head elements — low-level

When `setPageMeta` doesn't fit (custom `og:*` long-tail, manifest, RSS link, locale alternates), drop down to the per-tag helpers.

### `meta(name, value)` — idempotent meta tag

```ts
import { meta } from "@mongez/dom";

meta("og:type", "article");                 // <meta property="og:type" content="article">
meta("description", "Page desc");           // <meta name="description" content="Page desc">
meta("og:type", "website");                 // updates the existing tag
```

Selector rule: `meta[name="${n}"]` when `n` is `"keywords"`, `"description"`, or `"theme-color"`; otherwise `meta[property="${n}"]`. The content is `.trim()`-ed.

### `itemprop(name, value)` — idempotent itemprop meta tag

```ts
import { itemprop } from "@mongez/dom";

itemprop("name", "Hello World");            // <meta itemprop="name" content="Hello World">
```

### `metaLink(rel, href, otherAttributes?)` — idempotent link tag

```ts
import { metaLink } from "@mongez/dom";

metaLink("manifest", "/manifest.webmanifest");
metaLink("alternate", "https://example.com/feed.xml", { type: "application/rss+xml" });
metaLink("canonical", "https://example.com/p");
```

Selector: `link[rel="${rel}"]`. Reuses if found, otherwise creates. Always sets `href`; patches `otherAttributes` after.

### `createHeadElement(tag, props)` / `createNewMeta(props)` — non-idempotent

```ts
import { createHeadElement, createNewMeta } from "@mongez/dom";

createHeadElement("link", { rel: "preconnect", href: "https://cdn.example.com" });
createNewMeta({ name: "viewport", content: "width=device-width, initial-scale=1" });
```

These never look up an existing element — successive calls duplicate. Reach for them when you genuinely want a fresh tag.

### `twitter(type?)` and `og(opts)`

```ts
import { twitter, og } from "@mongez/dom";

twitter();                       // <meta property="twitter:card" content="summary">
twitter("summary_large_image");  // updates
```

> **`og()` is currently a no-op stub.** It's exported in the surface as a placeholder for future Open Graph helpers — do not rely on it.

---

## Element attributes

```ts
import {
  setHTMLAttributes,
  setElementAttributes,
  getElementAttributes,
} from "@mongez/dom";

// <html> shortcut
setHTMLAttributes({ lang: "en", dir: "ltr", "data-app": "MyApp" });
// → <html lang="en" dir="ltr" data-app="MyApp">

// Any element
const button = document.getElementById("submit")!;
setElementAttributes(button, {
  type: "submit",
  "aria-busy": "true",
  disabled: "",
});

getElementAttributes(button);
// { id: "submit", type: "submit", "aria-busy": "true", disabled: "" }
```

`setHTMLAttributes` is `setElementAttributes(document.documentElement, ...)`. `getElementAttributes` walks the live `element.attributes` collection and returns a `Record<string, string>` — empty attributes like `disabled=""` are preserved as the empty string, not collapsed to a boolean.

---

## Stylesheets, fonts, and scripts

### `styleSheet(href, id?)` — inject or update a `<link rel="stylesheet">`

```ts
import { styleSheet } from "@mongez/dom";

styleSheet("https://cdn.example.com/bootstrap.css", "ui-framework");
styleSheet("https://cdn.example.com/semantic.css", "ui-framework"); // updates href
```

When `id` is provided, looks up `document.getElementById(id)`; if found, only patches `href`. When the id isn't found (or is omitted), creates a fresh link with `id="link-<random-7-digit-number>"`. Use ids for any link you might want to swap later (theme switcher, framework A/B test).

### `googleFont(href, id?)` — `styleSheet` + preconnect

```ts
import { googleFont } from "@mongez/dom";

googleFont("https://fonts.googleapis.com/css2?family=Inter:wght@400;700", "primary");
googleFont("https://fonts.googleapis.com/css2?family=Lora", "secondary");
```

On the first call (per module lifetime) it emits the two recommended preconnect tags:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
```

Subsequent calls skip the preconnect step and delegate to `styleSheet(href, id)`.

### `loadFont(fontSettings)` — register via the `FontFace` API

```ts
import { loadFont } from "@mongez/dom";
import interWoff2 from "./fonts/inter.woff2";

// Single file
await loadFont({ name: "Inter", src: interWoff2 });

// Multiple weights
await loadFont({
  name: "Inter",
  weights: [
    { weight: "light",  woff2: "./inter-300.woff2" },  // "light" → "300" silently
    { weight: "normal", woff2: "./inter-400.woff2" },
    { weight: "bold",   woff2: "./inter-700.woff2" },
  ],
});
```

Each weight accepts any of `src`, `woff`, `woff2`, `ttf`, `eot`, `svg`, `otf` plus the rest of `FontFaceDescriptors` (`style`, `display`, `unicodeRange`, …). Provided sources are joined into the standard `url(...) format("...")` shape. The returned promise resolves with the loaded `FontFace` (single mode) or array of `FontFace`s (weights mode); each is also registered on `document.fonts`.

> **`weight: "light"` is rewritten to `"300"` silently.** The FontFace API doesn't accept the string `"light"`. Other named weights (`"normal"`, `"bold"`) pass through verbatim; for anything else, supply a numeric string like `"500"`.

### `loadScript(src, onLoad)` — third-party script injection

```ts
import { loadScript } from "@mongez/dom";

const tag = loadScript("https://example.com/analytics.js", () => {
  window.analytics.init("KEY");
});
tag.async = true;  // patch the returned element if you need async/defer
```

Creates `<script src=...>`, wires `script.onload = onLoad`, appends to `<body>`, returns the element so callers can patch additional attributes. Unlike `styleSheet`, **there's no id-based dedupe** — calling it twice with the same `src` appends two `<script>` tags. Track loaded scripts in your own caller if you need idempotence.

---

## CSS variables

```ts
import { cssVariable, setCssVariable, getCssVariable } from "@mongez/dom";

// Dual-purpose against :root
cssVariable("--color-primary", "#f00"); // write
cssVariable("--color-primary");         // "#f00" — read

// Explicit setter / getter with an element target
setCssVariable("--spacing", "16px", document.querySelector(".card")!);
getCssVariable("--spacing", document.querySelector(".card")!); // "16px"
getCssVariable("--spacing");                                    // "" — :root doesn't have it
```

`cssVariable` is dual-purpose: omit the second argument to read from `:root`, supply it to write to `:root`. For per-element scoping (component-level theming, scoped overrides), use the explicit `setCssVariable` / `getCssVariable` siblings — both accept an optional element target that defaults to `document.documentElement`. Reads return an empty string when the variable isn't set.

---

## Viewport, keyboard, and misc

### Viewport dimensions

```ts
import {
  getWindowWidth, getWindowHeight,
  getScreenWidth, getScreenHeight,
} from "@mongez/dom";

getWindowWidth();   // window.outerWidth   — the browser window's outer frame
getWindowHeight();  // window.outerHeight
getScreenWidth();   // window.screen.width — the user's monitor
getScreenHeight();  // window.screen.height
```

Thin one-line getters. Read live — don't cache. For the **inner viewport** (what's visible to layout), use `window.innerWidth` / `window.innerHeight` directly — those aren't wrapped here.

### Keyboard helpers

```ts
import { pressed, TAB_KEY, ENTER_KEY, ESC_KEY, CONTROL_KEY } from "@mongez/dom";

input.addEventListener("keydown", e => {
  if (pressed(e, ENTER_KEY)) submit();
  else if (pressed(e, ESC_KEY)) cancel();
});
```

`pressed(event, key)` compares `event.keyCode || event.charCode` to the supplied key. Constants exposed: `TAB_KEY=9`, `ENTER_KEY=13`, `CONTROL_KEY=17`, `ESC_KEY=27`.

> **`event.keyCode` is deprecated.** `pressed` exists for code that already reads `keyCode` (legacy code, integrations with libraries using the same convention). For new code, prefer `e.key === "Enter"` — it's a string and works across keyboard layouts.

### `scrollTo(querySelector)` — smooth scroll

```ts
import { scrollTo } from "@mongez/dom";

scrollTo("#section-features");
scrollTo("[data-scroll-target]");
scrollTo(".active-tab");
```

Calls `element.scrollIntoView({ behavior: "smooth" })` for the first matching element. No-op when nothing matches (no throw, no console warning). Honors the user's `prefers-reduced-motion` setting at the user-agent level — browsers fall back to instant scroll when reduced motion is requested.

### `userPrefersDarkMode()` — OS dark-mode detection

```ts
import { userPrefersDarkMode } from "@mongez/dom";

document.documentElement.classList.toggle("dark", userPrefersDarkMode());
```

Wraps `window.matchMedia("(prefers-color-scheme: dark)").matches`. To react when the user flips the OS theme, subscribe to the media query directly:

```ts
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", applyTheme);
```

### `htmlToText(html)` — strip tags for previews

```ts
import { htmlToText } from "@mongez/dom";

htmlToText("<h1>Hello</h1>");                  // "Hello"
htmlToText("&amp; &lt;ok&gt;");                // "& <ok>"
htmlToText("<p>One <strong>two</strong></p>"); // "One two"
```

Parses `html` into a throwaway `<div>` via `innerHTML` and returns `textContent`. Strips all tags, decodes HTML entities, drops `<script>` / `<style>` content.

> **Not a sanitizer.** `innerHTML` won't execute inline scripts assigned this way, but `htmlToText` is for extracting visible text — not for safely rendering user input. Use `DOMPurify` or server-side validation for anything that ends up back in the page.

---

## Recipes

### Set page title and meta dynamically on every route

Drive the page's `<head>` from the router. `setPageMeta` is idempotent — call it on every route change, no teardown needed.

```ts
import { setPageMeta } from "@mongez/dom";

function applyRouteMeta(route: { title: string; description: string; path: string }) {
  setPageMeta({
    title: route.title,
    description: route.description,
    url: `https://example.com${route.path}`,
    type: "website",
  });
}

router.on("change", applyRouteMeta);
```

In React, do the same inside a top-level effect:

```tsx
useEffect(() => applyRouteMeta(currentRoute), [currentRoute.path]);
```

### Load a Google Font on demand

Reach for this when the font isn't critical above-the-fold and you'd rather not block first paint with a `<link>` in `index.html`.

```ts
import { googleFont, cssVariable } from "@mongez/dom";

googleFont(
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap",
  "ui-font"
);

cssVariable("--font-base", '"Inter", system-ui, sans-serif');
```

The id `"ui-font"` lets you swap the family later without leaving a stale `<link>` behind:

```ts
googleFont(
  "https://fonts.googleapis.com/css2?family=Lora:wght@400;700&display=swap",
  "ui-font" // same id → updates href, doesn't duplicate
);
```

### Bundle and register a multi-weight custom font

When the woff2 files are part of your build (Vite asset import, Webpack file-loader, etc.), `loadFont` registers them via the FontFace API without round-tripping through CSS.

```ts
import { loadFont, cssVariable } from "@mongez/dom";
import light from "./fonts/inter-300.woff2";
import regular from "./fonts/inter-400.woff2";
import bold from "./fonts/inter-700.woff2";

await loadFont({
  name: "Inter",
  weights: [
    { weight: "light",  woff2: light },    // → "300"
    { weight: "normal", woff2: regular },
    { weight: "bold",   woff2: bold },
  ],
});

cssVariable("--font-base", '"Inter", system-ui, sans-serif');
```

```css
:root { font-family: var(--font-base); }
.headline { font-weight: 700; }
.caption  { font-weight: 300; }
```

### Dark-mode theming with CSS variables

```ts
import { cssVariable, userPrefersDarkMode } from "@mongez/dom";

function applyTheme() {
  const dark = userPrefersDarkMode();
  cssVariable("--color-bg",   dark ? "#0a0a0a" : "#ffffff");
  cssVariable("--color-fg",   dark ? "#ededed" : "#111111");
  cssVariable("--color-link", dark ? "#7cf"    : "#06c");
}

applyTheme();

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", applyTheme);
```

For the case where two whole stylesheets define light/dark themes, swap the href of a single `<link>` instead:

```ts
import { styleSheet } from "@mongez/dom";

function setTheme(mode: "light" | "dark") {
  styleSheet(mode === "dark" ? "/themes/dark.css" : "/themes/light.css", "theme");
}
```

The shared `id="theme"` makes both calls hit the same `<link>` — no duplicate tags.

### Smooth-scrolling table of contents

Wire up every in-page anchor in one pass — and optionally keep the URL hash in sync.

```ts
import { scrollTo } from "@mongez/dom";

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", e => {
    e.preventDefault();
    const hash = anchor.getAttribute("href")!;
    scrollTo(hash);
    history.pushState(null, "", hash);
  });
});
```

`scrollTo` is a no-op when the selector doesn't match, so broken anchors won't throw. The browser respects `prefers-reduced-motion` at the user-agent level — users with reduced motion enabled get an instant jump instead.

### Load analytics after consent is granted

```ts
import { loadScript } from "@mongez/dom";

let analyticsLoaded = false;

function loadAnalyticsOnce() {
  if (analyticsLoaded) return;
  analyticsLoaded = true;
  loadScript("https://example.com/analytics.js", () => {
    (window as any).analytics.init("KEY");
  });
}

consentBanner.addEventListener("accept", loadAnalyticsOnce);
```

> **`loadScript` does not dedupe internally.** Calling it twice with the same `src` appends two `<script>` tags. The local `analyticsLoaded` flag is the recommended pattern; track loaded scripts in your own caller for anything you might trigger more than once.

### Compose per-article Open Graph + locale alternates

`setPageMeta` covers the common social fields; for the article long-tail (author, published time, locale alternates), compose your own helper from `meta` and `metaLink`.

```ts
import { setPageMeta, meta, metaLink } from "@mongez/dom";

function setArticleMeta(article: {
  title: string;
  description: string;
  url: string;
  image: string;
  author: string;
  publishedAt: string;
  locales: { code: string; href: string }[];
}) {
  setPageMeta({
    title: article.title,
    description: article.description,
    url: article.url,
    image: article.image,
    type: "article",
  });
  meta("article:author", article.author);
  meta("article:published_time", article.publishedAt);
  for (const l of article.locales) {
    metaLink("alternate", l.href, { hreflang: l.code });
  }
}
```

Repeat calls update existing tags via the same selector rules — no duplicates.

---

## TypeScript

```ts
import type {
  MetaData,
  OpenGraph,
  AttributesList,
  FontOptions,
  FontWeightSetup,
} from "@mongez/dom";
```

`MetaData` is the shape of the argument to `setPageMeta`. `AttributesList` is `Record<string, any>` — used by `setElementAttributes` / `setHTMLAttributes`. `FontOptions` and `FontWeightSetup` configure `loadFont`. `OpenGraph` is the (currently unused) input type for the `og()` stub.

---

## Related packages

| Package | Use when you need |
|---|---|
| [`@mongez/react-helmet`](https://github.com/hassanzohdy) | React-idiomatic declarative head management. Wraps these primitives in a React component API — drop it into the tree, no imperative calls. |
| [`@mongez/cache`](https://github.com/hassanzohdy) | Browser-side cache (localStorage, sessionStorage, in-memory, encrypted) — for persistence concerns that fall outside DOM helpers. |
| [`@mongez/dotenv`](https://github.com/hassanzohdy) | Sister package — typed `.env` loader for Node-side configuration. |

---

## Further reading

- [`llms-full.txt`](./llms-full.txt) — exhaustive single-file API surface for tool-assisted development.
- [`llms.txt`](./llms.txt) — structured index of the package's documentation.
- [`skills/`](./skills) — per-topic deep-dives (metadata, head elements, assets, interactions, recipes).
- [`CHANGELOG.md`](./CHANGELOG.md) — release notes and documented quirks.

---

## License

MIT — see [LICENSE](./LICENSE).
