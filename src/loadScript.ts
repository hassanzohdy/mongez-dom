/**
 * Dynamically load a script by URL and append it to the document body.
 *
 * Security note: `src` must never come from untrusted input — it is loaded
 * and executed with no origin/protocol allowlist. Only pass URLs that are
 * hardcoded or otherwise developer controlled.
 *
 * @param {string} src
 * @param {() => void} onLoad
 * @returns {HTMLScriptElement}
 */
export default function loadScript(src: string, onLoad: () => void) {
  const script = document.createElement("script");
  script.src = src;
  script.onload = onLoad;
  document.body.appendChild(script);

  return script;
}
