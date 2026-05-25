import { describe, expect, it } from "vitest";
import * as dom from "../index";

describe("public exports", () => {
  it("exposes the metadata surface", () => {
    expect(typeof dom.setPageMeta).toBe("function");
    expect(typeof dom.setTitle).toBe("function");
    expect(typeof dom.setDescription).toBe("function");
    expect(typeof dom.setKeywords).toBe("function");
    expect(typeof dom.setImage).toBe("function");
    expect(typeof dom.setPageColor).toBe("function");
    expect(typeof dom.setFavIcon).toBe("function");
    expect(typeof dom.setCanonicalUrl).toBe("function");
    expect(typeof dom.setHTMLAttributes).toBe("function");
    expect(typeof dom.setElementAttributes).toBe("function");
    expect(typeof dom.getElementAttributes).toBe("function");
    expect(typeof dom.getMetaData).toBe("function");
    expect(typeof dom.createHeadElement).toBe("function");
    expect(typeof dom.createNewMeta).toBe("function");
    expect(typeof dom.meta).toBe("function");
    expect(typeof dom.itemprop).toBe("function");
    expect(typeof dom.metaLink).toBe("function");
    expect(typeof dom.styleSheet).toBe("function");
    expect(typeof dom.twitter).toBe("function");
    expect(typeof dom.og).toBe("function");
  });

  it("exposes the keyboard surface", () => {
    expect(typeof dom.pressed).toBe("function");
    expect(dom.TAB_KEY).toBe(9);
    expect(dom.ESC_KEY).toBe(27);
    expect(dom.ENTER_KEY).toBe(13);
    expect(dom.CONTROL_KEY).toBe(17);
  });

  it("exposes the misc surface", () => {
    expect(typeof dom.scrollTo).toBe("function");
    expect(typeof dom.loadScript).toBe("function");
    expect(typeof dom.htmlToText).toBe("function");
    expect(typeof dom.userPrefersDarkMode).toBe("function");
  });

  it("exposes the CSS variable surface", () => {
    expect(typeof dom.cssVariable).toBe("function");
    expect(typeof dom.setCssVariable).toBe("function");
    expect(typeof dom.getCssVariable).toBe("function");
  });

  it("exposes the font surface", () => {
    expect(typeof dom.googleFont).toBe("function");
    expect(typeof dom.loadFont).toBe("function");
  });

  it("exposes the dimensions surface", () => {
    expect(typeof dom.getWindowWidth).toBe("function");
    expect(typeof dom.getWindowHeight).toBe("function");
    expect(typeof dom.getScreenWidth).toBe("function");
    expect(typeof dom.getScreenHeight).toBe("function");
  });
});
