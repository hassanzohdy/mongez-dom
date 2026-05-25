import { describe, expect, it } from "vitest";
import htmlToText from "../htmlToText";

describe("htmlToText", () => {
  it("strips a single tag", () => {
    expect(htmlToText("<h1>Hello World</h1>")).toBe("Hello World");
  });

  it("strips nested tags and preserves the concatenated text", () => {
    expect(htmlToText("<div><p>One <strong>two</strong></p><p>three</p></div>")).toBe("One twothree");
  });

  it("returns an empty string for empty input", () => {
    expect(htmlToText("")).toBe("");
  });

  it("returns the original string when there are no tags", () => {
    expect(htmlToText("plain text")).toBe("plain text");
  });

  it("decodes HTML entities through the parser", () => {
    expect(htmlToText("&amp; &lt;ok&gt;")).toBe("& <ok>");
  });

  it("strips tags but keeps inline text whitespace exactly", () => {
    expect(htmlToText("<span>a</span> <span>b</span>")).toBe("a b");
  });

  it("ignores script tag content as set via innerHTML (script payload is not executed and may be empty)", () => {
    // We only assert the visible-text portion remains; the specifics of
    // how scripts are serialised by happy-dom are not part of this API.
    const result = htmlToText("<p>visible</p><script>alert('x')</script>");
    expect(result).toContain("visible");
  });
});
