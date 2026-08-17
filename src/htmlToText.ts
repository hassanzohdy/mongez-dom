/**
 * Remove html tags from the given text and return only text
 *
 * Parses `text` inside an inert document created via
 * `document.implementation.createHTMLDocument`, instead of assigning it to
 * `innerHTML` on a node owned by the live `document`. An inert document has
 * no browsing context (`defaultView` is `null`), so it is never "fully
 * active": resource-triggered handlers such as `<img onerror>` or
 * `<svg onload>` are never dispatched. An `innerHTML` assignment on a node
 * owned by the live `document`, by contrast, still starts resource fetches
 * (and can fire their handlers) even while the node itself is detached.
 *
 * @param {string} text
 * @returns {string}
 */
export default function htmlToText(text: string): string {
  const parsedDocument = document.implementation.createHTMLDocument("");
  parsedDocument.body.innerHTML = text;
  return parsedDocument.body.textContent || "";
}
