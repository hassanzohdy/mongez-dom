import { afterEach, describe, expect, it } from "vitest";
import loadScript from "../loadScript";

afterEach(() => {
  // Strip any <script> elements we appended so other tests stay isolated.
  document.querySelectorAll("script[data-test-load-script]").forEach(s => s.remove());
});

describe("loadScript", () => {
  it("appends a <script> tag with the given src to <body>", () => {
    const script = loadScript("https://cdn.example.com/lib.js", () => {});
    script.setAttribute("data-test-load-script", "1");
    expect(script.tagName).toBe("SCRIPT");
    expect(script.src).toContain("lib.js");
    expect(document.body.contains(script)).toBe(true);
  });

  it("sets the onload handler to the provided callback", () => {
    const cb = () => {};
    const script = loadScript("https://cdn.example.com/x.js", cb);
    script.setAttribute("data-test-load-script", "1");
    expect(script.onload).toBe(cb);
  });

  it("returns the created element so callers can patch attributes", () => {
    const script = loadScript("https://cdn.example.com/y.js", () => {});
    script.setAttribute("data-test-load-script", "1");
    script.setAttribute("async", "");
    expect(script.hasAttribute("async")).toBe(true);
  });
});
