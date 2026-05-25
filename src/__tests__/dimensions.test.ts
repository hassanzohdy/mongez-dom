import { describe, expect, it } from "vitest";
import {
  getScreenHeight,
  getScreenWidth,
  getWindowHeight,
  getWindowWidth,
} from "../dimensions";

describe("dimensions", () => {
  it("getWindowWidth returns window.outerWidth", () => {
    const value = getWindowWidth();
    expect(typeof value).toBe("number");
    expect(value).toBe(window.outerWidth);
  });

  it("getWindowHeight returns window.outerHeight", () => {
    const value = getWindowHeight();
    expect(typeof value).toBe("number");
    expect(value).toBe(window.outerHeight);
  });

  it("getScreenWidth returns window.screen.width", () => {
    const value = getScreenWidth();
    expect(typeof value).toBe("number");
    expect(value).toBe(window.screen.width);
  });

  it("getScreenHeight returns window.screen.height", () => {
    const value = getScreenHeight();
    expect(typeof value).toBe("number");
    expect(value).toBe(window.screen.height);
  });

  it("returns non-negative numbers", () => {
    expect(getWindowWidth()).toBeGreaterThanOrEqual(0);
    expect(getWindowHeight()).toBeGreaterThanOrEqual(0);
    expect(getScreenWidth()).toBeGreaterThanOrEqual(0);
    expect(getScreenHeight()).toBeGreaterThanOrEqual(0);
  });
});
