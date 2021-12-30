/**
 * Remove html tags from the given text and return only text
 *
 * @param {string} text
 * @returns {string}
 */
export default function htmlToText(text: string): string {
  let tmp = document.createElement("div");
  tmp.innerHTML = text;
  return tmp.textContent || tmp.innerText || "";
}
