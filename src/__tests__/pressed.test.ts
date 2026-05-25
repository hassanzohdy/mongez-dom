import { describe, expect, it } from "vitest";
import pressed from "../pressed";
import {
  CONTROL_KEY,
  ENTER_KEY,
  ESC_KEY,
  TAB_KEY,
} from "../pressed-keys";

describe("pressed keycode constants", () => {
  it("exposes the named keys with the expected numeric codes", () => {
    expect(TAB_KEY).toBe(9);
    expect(ESC_KEY).toBe(27);
    expect(ENTER_KEY).toBe(13);
    expect(CONTROL_KEY).toBe(17);
  });
});

describe("pressed()", () => {
  it("returns true when keyCode matches the constant", () => {
    expect(pressed({ keyCode: ENTER_KEY }, ENTER_KEY)).toBe(true);
    expect(pressed({ keyCode: ESC_KEY }, ESC_KEY)).toBe(true);
  });

  it("returns false when keyCode does not match", () => {
    expect(pressed({ keyCode: ENTER_KEY }, ESC_KEY)).toBe(false);
    expect(pressed({ keyCode: TAB_KEY }, CONTROL_KEY)).toBe(false);
  });

  it("falls back to charCode when keyCode is absent", () => {
    expect(pressed({ charCode: ENTER_KEY }, ENTER_KEY)).toBe(true);
    expect(pressed({ charCode: TAB_KEY }, ESC_KEY)).toBe(false);
  });

  it("prefers keyCode over charCode (truthy keyCode short-circuits the OR)", () => {
    // keyCode is truthy (ENTER_KEY = 13), so charCode is never consulted.
    expect(pressed({ keyCode: ENTER_KEY, charCode: ESC_KEY }, ENTER_KEY)).toBe(true);
    expect(pressed({ keyCode: ENTER_KEY, charCode: ESC_KEY }, ESC_KEY)).toBe(false);
  });

  it("accepts a real KeyboardEvent-shaped object", () => {
    // Synthesise an object resembling KeyboardEvent. We don't dispatch it;
    // pressed() just reads the keyCode/charCode props.
    const event = { keyCode: TAB_KEY, charCode: 0 };
    expect(pressed(event, TAB_KEY)).toBe(true);
  });
});
