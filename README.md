# @mongez/dom

> Browser-side DOM utilities: page metadata, fonts, stylesheets, CSS variables, keyboard helpers, viewport dimensions, and small DOM conveniences.

`@mongez/dom` is the collection of imperative browser helpers that almost every front-end project ends up writing by hand — `setTitle`, `setPageMeta`, `googleFont`, `cssVariable`, `scrollTo`, `loadScript`, `pressed`, `getWindowWidth`, etc. They're flat function exports, side-effect-free at import time, and framework-agnostic — drop them into React, Vue, Svelte, Astro, or vanilla JS the same way.

The package targets the browser. Calling these on the server (no `document`, no `window.matchMedia`, no `FontFace`) will throw — pair with a render guard if you ship server-rendered apps.

## Install

```sh
yarn add @mongez/dom
```

No runtime dependencies.

## A 30-second tour

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

// 2. Read/write CSS variables on :root.
cssVariable("--color-primary", userPrefersDarkMode() ? "#fff" : "#000");

// 3. Load a Google font with the recommended preconnect tags.
googleFont("https://fonts.googleapis.com/css2?family=Inter", "ui-font");

// 4. Smooth-scroll to a CSS selector.
scrollTo("#section-features");

// 5. Keyboard helpers without remembering keyCode magic numbers.
document.addEventListener("keydown", e => {
  if (pressed(e, ENTER_KEY)) submit();
});
```

## What's in the box

| Area | Exports |
|---|---|
| Page metadata | `setPageMeta`, `setTitle`, `setDescription`, `setKeywords`, `setImage`, `setPageColor`, `setFavIcon`, `setCanonicalUrl`, `getMetaData` |
| Element attributes | `setHTMLAttributes`, `setElementAttributes`, `getElementAttributes` |
| Low-level head | `createHeadElement`, `createNewMeta`, `meta`, `itemprop`, `metaLink`, `twitter`, `og` |
| Stylesheets & fonts | `styleSheet`, `googleFont`, `loadFont` |
| CSS variables | `cssVariable`, `setCssVariable`, `getCssVariable` |
| Viewport | `getWindowWidth`, `getWindowHeight`, `getScreenWidth`, `getScreenHeight` |
| Keyboard | `pressed`, `TAB_KEY`, `ESC_KEY`, `ENTER_KEY`, `CONTROL_KEY` |
| Misc | `scrollTo`, `loadScript`, `htmlToText`, `userPrefersDarkMode` |

## Page metadata

`setPageMeta` is the one-stop entry point. Pass any subset of fields and only those get patched.

```ts
import { setPageMeta } from "@mongez/dom";

setPageMeta({
  title: "Hello World",
  description: "An example page.",
  keywords: ["hello", "world"],          // or "hello,world"
  image: "https://cdn.example.com/cover.png",
  url: "https://example.com/page",       // canonical + og:url + twitter:url
  favIcon: "/favicon.ico",
  color: "#0a0a0a",                       // theme color
  type: "article",                        // og:type
});
```

Each field fans out to the matching tags. `setTitle("Hi")` emits `<title>`, `og:title`, `og:image:alt`, `twitter:title`, `twitter:image:alt`, and `itemprop="name"`. `setImage("...")` emits `image`, `og:image`, `twitter:image`, and `itemprop="image"`. `setCanonicalUrl("...")` emits `link[rel="canonical"]`, `og:url`, and `twitter:url`.

For one-tag-at-a-time control, the lower-level helpers are also exported:

```ts
import { meta, itemprop, metaLink, createHeadElement } from "@mongez/dom";

meta("og:type", "article");                      // <meta property="og:type" content="article">
meta("description", "Page desc");                // <meta name="description" content="Page desc">
itemprop("name", "Hello World");                 // <meta itemprop="name" content="Hello World">
metaLink("manifest", "/manifest.webmanifest");   // <link rel="manifest" href="...">
```

`meta()` uses `name=` for `keywords` and `description` only; every other name lands on `property=`. Repeat calls update the existing tag instead of duplicating.

## Element attributes

```ts
import { setHTMLAttributes, setElementAttributes, getElementAttributes } from "@mongez/dom";

setHTMLAttributes({ lang: "en", dir: "ltr", "data-app": "MyApp" });
// <html lang="en" dir="ltr" data-app="MyApp">

const a = document.getElementById("logo");
setElementAttributes(a!, { href: "/", target: "_self", "aria-label": "Home" });

getElementAttributes(document.documentElement);
// { lang: "en", dir: "ltr", "data-app": "MyApp" }
```

## Stylesheets and fonts

`styleSheet(href, id?)` appends or updates a `<link rel="stylesheet">`. Pass an id to make subsequent calls patch the same link instead of creating duplicates.

```ts
import { styleSheet } from "@mongez/dom";

styleSheet("https://cdn.example.com/bootstrap.css", "ui-framework-cdn");
styleSheet("https://cdn.example.com/semantic.css", "ui-framework-cdn"); // updates href
```

`googleFont(href, id?)` wraps `styleSheet` and emits the two recommended `preconnect` links the first time it's called.

```ts
import { googleFont } from "@mongez/dom";

googleFont("https://fonts.googleapis.com/css2?family=Inter", "primary-font");
googleFont("https://fonts.googleapis.com/css2?family=Lora", "secondary-font");
```

`loadFont(options)` uses `FontFace` to load and register a font without the round-trip through CSS.

```ts
import { loadFont } from "@mongez/dom";
import interWoff2 from "./fonts/inter.woff2";

await loadFont({ name: "Inter", src: interWoff2 });
```

Multiple weights via the `weights` array:

```ts
await loadFont({
  name: "Inter",
  weights: [
    { weight: "light",  woff2: "./inter-300.woff2" },          // "light" maps to 300
    { weight: "normal", woff2: "./inter-400.woff2" },
    { weight: "bold",   woff2: "./inter-700.woff2" },
  ],
});
```

Each weight accepts any of `src`, `woff`, `woff2`, `ttf`, `eot`, `svg`, `otf` plus the rest of the standard `FontFaceDescriptors` (`style`, `display`, `unicodeRange`, …).

## CSS variables

```ts
import { cssVariable, setCssVariable, getCssVariable } from "@mongez/dom";

// One function, dual purpose against :root
cssVariable("--color-primary", "#f00"); // set
cssVariable("--color-primary");         // "#f00"

// Explicit setter / getter with an element target
setCssVariable("--scope", "local", document.body);
getCssVariable("--scope", document.body); // "local"
getCssVariable("--scope");                // "" — :root doesn't have it
```

## Viewport dimensions

```ts
import {
  getWindowWidth, getWindowHeight,
  getScreenWidth, getScreenHeight,
} from "@mongez/dom";

getWindowWidth();   // window.outerWidth
getWindowHeight();  // window.outerHeight
getScreenWidth();   // window.screen.width
getScreenHeight();  // window.screen.height
```

## Keyboard helpers

```ts
import { pressed, ENTER_KEY, ESC_KEY, TAB_KEY, CONTROL_KEY } from "@mongez/dom";

input.addEventListener("keydown", e => {
  if (pressed(e, ENTER_KEY)) submit();
  else if (pressed(e, ESC_KEY)) cancel();
});
```

`pressed(event, keyCode)` reads `event.keyCode` and falls back to `event.charCode`. Constants exposed: `TAB_KEY=9`, `ENTER_KEY=13`, `CONTROL_KEY=17`, `ESC_KEY=27`.

## Misc

```ts
import { scrollTo, loadScript, htmlToText, userPrefersDarkMode } from "@mongez/dom";

scrollTo("#features");                              // element.scrollIntoView({ behavior: "smooth" })
                                                    // no-op when the selector doesn't match
const tag = loadScript("https://example.com/x.js", () => {
  // onload
});
htmlToText("<h1>Hi</h1>");                          // "Hi"
userPrefersDarkMode();                              // matchMedia("(prefers-color-scheme: dark)").matches
```

## Types

```ts
import type {
  MetaData,
  OpenGraph,
  AttributesList,
  FontOptions,
  FontWeightSetup,
} from "@mongez/dom";
```

`MetaData` is the shape of the argument to `setPageMeta`. `AttributesList` is `Record<string, any>` — used by `setElementAttributes`/`setHTMLAttributes`. `FontOptions` and `FontWeightSetup` configure `loadFont`.

## Related packages

| Package | Purpose |
|---|---|
| [`@mongez/react-helmet`](https://github.com/hassanzohdy) | React adapter for page metadata. |
| [`@mongez/cache`](https://github.com/hassanzohdy) | Browser-side cache (localStorage / sessionStorage / cookies). |

## License

MIT
