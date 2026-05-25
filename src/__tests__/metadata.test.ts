import { beforeEach, describe, expect, it } from "vitest";
import {
  createHeadElement,
  createNewMeta,
  getElementAttributes,
  getMetaData,
  itemprop,
  meta,
  metaLink,
  setCanonicalUrl,
  setDescription,
  setElementAttributes,
  setFavIcon,
  setHTMLAttributes,
  setImage,
  setKeywords,
  setPageColor,
  setPageMeta,
  setTitle,
  styleSheet,
  twitter,
} from "../metadata";

// Each test starts from a clean <head>, a known document.title, and a
// stripped <html> attribute list. The metadata module memoises some
// values in a module-level singleton; resetting the DOM here means each
// test is observationally independent for the public DOM assertions we
// make, even though that singleton survives across tests.
function resetDom() {
  document.head.innerHTML = "";
  document.body.innerHTML = "";
  document.title = "";
  for (const attr of Array.from(document.documentElement.attributes)) {
    document.documentElement.removeAttribute(attr.name);
  }
}

beforeEach(resetDom);

describe("createHeadElement", () => {
  it("appends a tag with the given props to <head> and returns it", () => {
    const link = createHeadElement("link", { rel: "manifest", href: "/manifest.json" });
    expect(link.tagName).toBe("LINK");
    expect(link.getAttribute("rel")).toBe("manifest");
    expect(link.getAttribute("href")).toBe("/manifest.json");
    expect(document.head.contains(link)).toBe(true);
  });

  it("appends successive elements to the same parent", () => {
    createHeadElement("meta", { name: "x", content: "1" });
    createHeadElement("meta", { name: "y", content: "2" });
    expect(document.head.querySelectorAll("meta").length).toBe(2);
  });
});

describe("createNewMeta", () => {
  it("creates a <meta> tag in <head>", () => {
    const m = createNewMeta({ name: "viewport", content: "width=device-width" });
    expect(m.tagName).toBe("META");
    expect(m.getAttribute("name")).toBe("viewport");
    expect(m.getAttribute("content")).toBe("width=device-width");
  });
});

describe("setElementAttributes / setHTMLAttributes / getElementAttributes", () => {
  it("setElementAttributes writes every key/value to the element", () => {
    const a = document.createElement("a");
    setElementAttributes(a, { href: "/x", target: "_blank", "data-test": "y" });
    expect(a.getAttribute("href")).toBe("/x");
    expect(a.getAttribute("target")).toBe("_blank");
    expect(a.getAttribute("data-test")).toBe("y");
  });

  it("setHTMLAttributes targets <html>", () => {
    setHTMLAttributes({ lang: "en", dir: "ltr", app: "MyApp" });
    expect(document.documentElement.getAttribute("lang")).toBe("en");
    expect(document.documentElement.getAttribute("dir")).toBe("ltr");
    expect(document.documentElement.getAttribute("app")).toBe("MyApp");
  });

  it("getElementAttributes returns the current attribute map", () => {
    const div = document.createElement("div");
    div.setAttribute("id", "main");
    div.setAttribute("class", "container");
    div.setAttribute("data-x", "1");
    expect(getElementAttributes(div)).toEqual({
      id: "main",
      class: "container",
      "data-x": "1",
    });
  });

  it("getElementAttributes returns {} for an element without attributes", () => {
    const div = document.createElement("div");
    expect(getElementAttributes(div)).toEqual({});
  });
});

describe("meta()", () => {
  it("uses name= for description and keywords, property= for everything else", () => {
    meta("description", "hello");
    meta("og:title", "world");
    expect(document.head.querySelector('meta[name="description"]')?.getAttribute("content")).toBe("hello");
    expect(document.head.querySelector('meta[property="og:title"]')?.getAttribute("content")).toBe("world");
  });

  it("updates the existing tag instead of creating a duplicate on a second call", () => {
    meta("og:title", "first");
    meta("og:title", "second");
    const tags = document.head.querySelectorAll('meta[property="og:title"]');
    expect(tags.length).toBe(1);
    expect(tags[0].getAttribute("content")).toBe("second");
  });

  it("trims the content value", () => {
    meta("og:title", "  trimmed  ");
    expect(document.head.querySelector('meta[property="og:title"]')?.getAttribute("content")).toBe("trimmed");
  });
});

describe("itemprop()", () => {
  it("creates and updates a meta[itemprop] tag", () => {
    itemprop("name", "Hello");
    expect(document.head.querySelector('meta[itemprop="name"]')?.getAttribute("content")).toBe("Hello");
    itemprop("name", "Updated");
    expect(document.head.querySelectorAll('meta[itemprop="name"]').length).toBe(1);
    expect(document.head.querySelector('meta[itemprop="name"]')?.getAttribute("content")).toBe("Updated");
  });
});

describe("setTitle", () => {
  it("updates document.title and the related social meta tags", () => {
    setTitle("Hello World");
    expect(document.title).toBe("Hello World");
    expect(document.head.querySelector('meta[property="og:title"]')?.getAttribute("content")).toBe("Hello World");
    expect(document.head.querySelector('meta[property="twitter:title"]')?.getAttribute("content")).toBe("Hello World");
    expect(document.head.querySelector('meta[property="og:image:alt"]')?.getAttribute("content")).toBe("Hello World");
    expect(document.head.querySelector('meta[property="twitter:image:alt"]')?.getAttribute("content")).toBe("Hello World");
    expect(document.head.querySelector('meta[itemprop="name"]')?.getAttribute("content")).toBe("Hello World");
  });
});

describe("setDescription", () => {
  it("writes description across name, itemprop, og, and twitter tags", () => {
    setDescription("A page description");
    expect(document.head.querySelector('meta[name="description"]')?.getAttribute("content")).toBe("A page description");
    expect(document.head.querySelector('meta[itemprop="description"]')?.getAttribute("content")).toBe("A page description");
    expect(document.head.querySelector('meta[property="og:description"]')?.getAttribute("content")).toBe("A page description");
    expect(document.head.querySelector('meta[property="twitter:description"]')?.getAttribute("content")).toBe("A page description");
  });
});

describe("setKeywords", () => {
  it("accepts a comma-separated string", () => {
    setKeywords("a,b,c");
    expect(document.head.querySelector('meta[name="keywords"]')?.getAttribute("content")).toBe("a,b,c");
  });

  it("joins arrays with commas", () => {
    setKeywords(["x", "y", "z"]);
    expect(document.head.querySelector('meta[name="keywords"]')?.getAttribute("content")).toBe("x,y,z");
  });
});

describe("setImage", () => {
  it("writes image across the social and itemprop tags", () => {
    setImage("https://cdn.example.com/cover.png");
    const get = (sel: string) => document.head.querySelector(sel)?.getAttribute("content");
    expect(get('meta[property="image"]')).toBe("https://cdn.example.com/cover.png");
    expect(get('meta[property="og:image"]')).toBe("https://cdn.example.com/cover.png");
    expect(get('meta[property="twitter:image"]')).toBe("https://cdn.example.com/cover.png");
    expect(get('meta[itemprop="image"]')).toBe("https://cdn.example.com/cover.png");
  });
});

describe("setPageColor", () => {
  it("sets the theme-color meta tag", () => {
    // Per the HTML spec, theme-color is emitted as <meta name="theme-color">.
    // `meta()` special-cases "theme-color" alongside "keywords" and
    // "description" so the attribute is `name=`, not `property=`.
    setPageColor("#0a0a0a");
    expect(
      document.head.querySelector('meta[name="theme-color"]')?.getAttribute("content"),
    ).toBe("#0a0a0a");
  });
});

describe("metaLink", () => {
  it("creates a <link rel> when none exists, reuses it on subsequent calls, and patches additional attributes", () => {
    const first = metaLink("canonical", "https://example.com/a", { hreflang: "en" });
    expect(first.tagName).toBe("LINK");
    expect(first.getAttribute("rel")).toBe("canonical");
    expect(first.getAttribute("href")).toBe("https://example.com/a");
    expect(first.getAttribute("hreflang")).toBe("en");

    const second = metaLink("canonical", "https://example.com/b");
    expect(second).toBe(first);
    expect(second.getAttribute("href")).toBe("https://example.com/b");
    expect(document.head.querySelectorAll('link[rel="canonical"]').length).toBe(1);
  });
});

describe("setFavIcon", () => {
  it("emits <link rel='icon'>", () => {
    setFavIcon("/favicon.ico");
    const link = document.head.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
    expect(link).not.toBeNull();
    expect(link?.getAttribute("href")).toBe("/favicon.ico");
  });
});

describe("setCanonicalUrl", () => {
  it("creates a canonical link plus og:url and twitter:url meta tags", () => {
    setCanonicalUrl("https://example.com/page");
    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe("https://example.com/page");
    expect(document.head.querySelector('meta[property="og:url"]')?.getAttribute("content")).toBe("https://example.com/page");
    expect(document.head.querySelector('meta[property="twitter:url"]')?.getAttribute("content")).toBe("https://example.com/page");
  });
});

describe("styleSheet", () => {
  it("creates a new <link rel='stylesheet'> with an auto-generated id when none provided", () => {
    const link = styleSheet("https://cdn.example.com/a.css");
    expect(link.tagName).toBe("LINK");
    expect(link.getAttribute("rel")).toBe("stylesheet");
    expect(link.getAttribute("href")).toBe("https://cdn.example.com/a.css");
    expect(link.id.startsWith("link-")).toBe(true);
  });

  it("reuses the existing link when the same id is passed and only patches href", () => {
    const a = styleSheet("https://cdn.example.com/a.css", "framework");
    const b = styleSheet("https://cdn.example.com/b.css", "framework");
    expect(b).toBe(a);
    expect(b.getAttribute("href")).toBe("https://cdn.example.com/b.css");
    expect(document.head.querySelectorAll("#framework").length).toBe(1);
  });
});

describe("twitter()", () => {
  it("defaults to summary", () => {
    twitter();
    expect(document.head.querySelector('meta[property="twitter:card"]')?.getAttribute("content")).toBe("summary");
  });

  it("accepts a custom type", () => {
    twitter("summary_large_image");
    expect(document.head.querySelector('meta[property="twitter:card"]')?.getAttribute("content")).toBe("summary_large_image");
  });
});

describe("setPageMeta", () => {
  it("applies every provided meta field in one call", () => {
    setPageMeta({
      title: "Combined Title",
      description: "Combined desc",
      keywords: ["a", "b"],
      image: "https://cdn.example.com/img.png",
      url: "https://example.com/p",
      favIcon: "/fav.ico",
      color: "#fff",
      type: "article",
    });
    expect(document.title).toBe("Combined Title");
    expect(document.head.querySelector('meta[name="description"]')?.getAttribute("content")).toBe("Combined desc");
    expect(document.head.querySelector('meta[name="keywords"]')?.getAttribute("content")).toBe("a,b");
    expect(document.head.querySelector('meta[property="og:image"]')?.getAttribute("content")).toBe("https://cdn.example.com/img.png");
    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe("https://example.com/p");
    expect(document.head.querySelector('link[rel="icon"]')?.getAttribute("href")).toBe("/fav.ico");
    expect(document.head.querySelector('meta[name="theme-color"]')?.getAttribute("content")).toBe("#fff");
    expect(document.head.querySelector('meta[property="og:type"]')?.getAttribute("content")).toBe("article");
  });

  it("skips fields not provided", () => {
    setPageMeta({ title: "Only Title" });
    expect(document.title).toBe("Only Title");
    expect(document.head.querySelector('meta[name="description"]')).toBeNull();
    expect(document.head.querySelector('link[rel="canonical"]')).toBeNull();
  });
});

describe("getMetaData", () => {
  it("returns the entire object when called with no argument", () => {
    setTitle("My Title");
    setKeywords("a,b,c");
    setImage("https://example.com/x.png");
    const data = getMetaData();
    expect(data.title).toBe("My Title");
    expect(data.keywords).toBe("a,b,c");
    expect(data.image).toBe("https://example.com/x.png");
  });

  it("returns one field when called with a key", () => {
    setTitle("Tabbed");
    expect(getMetaData("title")).toBe("Tabbed");
  });
});

describe("setFavIcon / setCanonicalUrl persist their argument into currentMetaData", () => {
  // Regression coverage for the previous bug where `setFavIcon` and
  // `setCanonicalUrl` both wrote to `currentMetaData.color` instead of
  // `.favIcon` / `.url`. `getMetaData(key)` must now reflect the latest
  // value passed to each setter.
  it("getMetaData(\"favIcon\") reflects setFavIcon argument", () => {
    setFavIcon("/test.ico");
    expect(getMetaData("favIcon")).toBe("/test.ico");
  });

  it("getMetaData(\"url\") reflects setCanonicalUrl argument", () => {
    setCanonicalUrl("https://example.com/page");
    expect(getMetaData("url")).toBe("https://example.com/page");
  });
});

describe("meta() emits name= for theme-color", () => {
  // Regression coverage for the previous bug where `meta()` only
  // special-cased "keywords" and "description" for `name=`, causing
  // `setPageColor` to emit `<meta property="theme-color">` which UAs
  // ignore. The fix adds "theme-color" to that special-case list so the
  // HTML-spec form `<meta name="theme-color">` is produced.
  it("setPageColor emits meta[name=\"theme-color\"]", () => {
    setPageColor("#000");
    expect(document.head.querySelector('meta[name="theme-color"]')).not.toBeNull();
  });
});
