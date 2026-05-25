import { describe, expect, it, vi } from "vitest";
import userPrefersDarkMode from "../prefers-dark-mode";

describe("userPrefersDarkMode", () => {
  it("returns a boolean", () => {
    expect(typeof userPrefersDarkMode()).toBe("boolean");
  });

  it("returns true when window.matchMedia('(prefers-color-scheme: dark)') matches", () => {
    const spy = vi
      .spyOn(window, "matchMedia")
      .mockImplementation(() =>
        ({ matches: true, media: "(prefers-color-scheme: dark)" }) as unknown as MediaQueryList,
      );
    try {
      expect(userPrefersDarkMode()).toBe(true);
    } finally {
      spy.mockRestore();
    }
  });

  it("returns false when matchMedia does not match", () => {
    const spy = vi
      .spyOn(window, "matchMedia")
      .mockImplementation(() =>
        ({ matches: false, media: "(prefers-color-scheme: dark)" }) as unknown as MediaQueryList,
      );
    try {
      expect(userPrefersDarkMode()).toBe(false);
    } finally {
      spy.mockRestore();
    }
  });

  it("consults the prefers-color-scheme: dark media query exactly", () => {
    const spy = vi
      .spyOn(window, "matchMedia")
      .mockImplementation(query =>
        ({ matches: false, media: query }) as unknown as MediaQueryList,
      );
    try {
      userPrefersDarkMode();
      expect(spy).toHaveBeenCalledWith("(prefers-color-scheme: dark)");
    } finally {
      spy.mockRestore();
    }
  });
});
