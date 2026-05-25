import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => {
  document.head.innerHTML = "";
  // `fonts.ts` keeps `isGoogleFontInitialized` in module scope so the
  // preconnect <link> tags are emitted only on the first call. Reset
  // the module registry between tests so each call is observed against
  // a fresh module-level flag.
  vi.resetModules();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("googleFont", () => {
  it("creates a stylesheet link pointing at the supplied href", async () => {
    const { googleFont } = await import("../fonts");
    const link = googleFont("https://fonts.googleapis.com/css2?family=Roboto", "primary-font");
    expect(link.tagName).toBe("LINK");
    expect(link.getAttribute("rel")).toBe("stylesheet");
    expect(link.getAttribute("href")).toBe("https://fonts.googleapis.com/css2?family=Roboto");
    expect(link.id).toBe("primary-font");
  });

  it("adds the two preconnect <link> tags on first call", async () => {
    const { googleFont } = await import("../fonts");
    googleFont("https://fonts.googleapis.com/css2?family=Roboto", "primary-font");
    const preconnects = Array.from(
      document.head.querySelectorAll('link[rel="preconnect"]'),
    ).map(l => l.getAttribute("href"));
    expect(preconnects).toContain("https://fonts.googleapis.com");
    expect(preconnects).toContain("https://fonts.gstatic.com");
  });

  it("emits the preconnect tags exactly once per module lifetime", async () => {
    const { googleFont } = await import("../fonts");
    googleFont("https://fonts.googleapis.com/css2?family=Roboto", "a");
    googleFont("https://fonts.googleapis.com/css2?family=Inter", "b");
    googleFont("https://fonts.googleapis.com/css2?family=Lato", "c");
    expect(document.head.querySelectorAll('link[rel="preconnect"]').length).toBe(2);
  });

  it("reuses the same link element when called with the same id and updates the href", async () => {
    const { googleFont } = await import("../fonts");
    const first = googleFont("https://fonts.googleapis.com/css2?family=Roboto", "ui-font");
    const second = googleFont("https://fonts.googleapis.com/css2?family=Inter", "ui-font");
    expect(second).toBe(first);
    expect(second.getAttribute("href")).toBe("https://fonts.googleapis.com/css2?family=Inter");
    expect(document.head.querySelectorAll("#ui-font").length).toBe(1);
  });

  it("auto-generates an id when none is supplied", async () => {
    const { googleFont } = await import("../fonts");
    const link = googleFont("https://fonts.googleapis.com/css2?family=Roboto");
    expect(link.id.startsWith("link-")).toBe(true);
  });
});

// We don't directly test loadFont end-to-end because happy-dom does not
// implement the FontFace constructor / document.fonts the way we'd need
// to load real font files. The test below documents that the export
// exists and is a function — anything beyond that is a browser concern.
describe("loadFont", () => {
  it("is exported as a function", async () => {
    const mod = await import("../fonts");
    expect(typeof mod.loadFont).toBe("function");
  });
});
