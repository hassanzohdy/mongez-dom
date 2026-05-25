import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import scrollTo from "../scrollTo";

let scrollSpies: Map<Element, ReturnType<typeof vi.fn>>;

beforeEach(() => {
  scrollSpies = new Map();
  document.body.innerHTML = "";
});

afterEach(() => {
  scrollSpies.clear();
});

function makeElement(id: string, tag = "div"): HTMLElement {
  const el = document.createElement(tag);
  el.id = id;
  const spy = vi.fn();
  el.scrollIntoView = spy as unknown as typeof el.scrollIntoView;
  scrollSpies.set(el, spy);
  document.body.appendChild(el);
  return el;
}

describe("scrollTo", () => {
  it("calls element.scrollIntoView with smooth behavior when the selector matches", () => {
    const target = makeElement("target");
    scrollTo("#target");
    const spy = scrollSpies.get(target)!;
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ behavior: "smooth" });
  });

  it("is a no-op when no element matches the selector", () => {
    makeElement("other");
    // Expression evaluates without throwing and returns undefined.
    expect(() => scrollTo("#missing")).not.toThrow();
    expect(scrollTo("#missing")).toBeUndefined();
  });

  it("only scrolls the first match for the given selector", () => {
    const first = makeElement("first", "section");
    first.classList.add("scroll-target");
    const second = makeElement("second", "section");
    second.classList.add("scroll-target");

    scrollTo(".scroll-target");
    expect(scrollSpies.get(first)).toHaveBeenCalledTimes(1);
    expect(scrollSpies.get(second)).not.toHaveBeenCalled();
  });

  it("handles arbitrary CSS selectors, not just ids", () => {
    const article = makeElement("article-1", "article");
    article.setAttribute("data-section", "intro");
    scrollTo('[data-section="intro"]');
    expect(scrollSpies.get(article)).toHaveBeenCalledTimes(1);
  });
});
