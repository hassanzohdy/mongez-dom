/**
 * Set or get css variable
 * If second argument is not passed, then get the value of the given css variable,
 * otherwise set the given variable with its corresponding value.
 */
export default function cssVariable(
  name: string,
  value?: string
): string | void {
  if (!value) return document.documentElement.style.getPropertyValue(name);

  document.documentElement.style.setProperty(name, value);
}

/**
 * Set css variable
 * If second argument is not passed, then get the value of the given css variable,
 * otherwise set the given variable with its corresponding value.
 *
 */
export function setCssVariable(
  name: string,
  value: string,
  element: HTMLElement = document.documentElement
): void {
  element.style.setProperty(name, value);
}

/**
 * Get css variable
 * If second argument is not passed, then get the value of the given css variable,
 * otherwise set the given variable with its corresponding value.
 *
 * @returns {string | void}
 */
export function getCssVariable(
  name: string,
  element: HTMLElement = document.documentElement
): string {
  return element.style.getPropertyValue(name);
}
