import { beforeEach, describe, expect, it } from "vitest";
import cssVariable, { getCssVariable, setCssVariable } from "../css-variable";

beforeEach(() => {
  // Strip every inline style so getCssVariable starts from "" on each test.
  document.documentElement.removeAttribute("style");
  document.body.removeAttribute("style");
});

describe("cssVariable (default export)", () => {
  it("sets a variable on :root when value is provided", () => {
    cssVariable("--color-primary", "#f00");
    expect(document.documentElement.style.getPropertyValue("--color-primary")).toBe("#f00");
  });

  it("reads a variable from :root when value is omitted", () => {
    document.documentElement.style.setProperty("--brand", "#abc");
    expect(cssVariable("--brand")).toBe("#abc");
  });

  it("returns empty string for an unset variable", () => {
    expect(cssVariable("--never-set")).toBe("");
  });

  it("returns undefined (no value) when used as a setter", () => {
    // The setter branch returns void; the property is what we observe.
    const result = cssVariable("--gap", "8px");
    expect(result).toBeUndefined();
    expect(document.documentElement.style.getPropertyValue("--gap")).toBe("8px");
  });
});

describe("setCssVariable", () => {
  it("defaults the target to :root", () => {
    setCssVariable("--accent", "#0f0");
    expect(document.documentElement.style.getPropertyValue("--accent")).toBe("#0f0");
  });

  it("writes to the given element when provided", () => {
    setCssVariable("--accent", "#0f0", document.body);
    expect(document.body.style.getPropertyValue("--accent")).toBe("#0f0");
    expect(document.documentElement.style.getPropertyValue("--accent")).toBe("");
  });
});

describe("getCssVariable", () => {
  it("defaults the source to :root", () => {
    document.documentElement.style.setProperty("--shadow", "0 1px 2px black");
    expect(getCssVariable("--shadow")).toBe("0 1px 2px black");
  });

  it("reads from the given element when provided", () => {
    document.body.style.setProperty("--scope", "local");
    expect(getCssVariable("--scope", document.body)).toBe("local");
    expect(getCssVariable("--scope")).toBe(""); // :root doesn't have it
  });

  it("returns empty string when the element does not carry the variable", () => {
    expect(getCssVariable("--missing", document.body)).toBe("");
  });
});
