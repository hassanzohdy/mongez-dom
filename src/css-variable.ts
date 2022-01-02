/**
 * Set or get css variable
 * If second argument is not passed, then get the value of the given css variable,
 * otherwise set the given variable with its corresponding value.
 *
 * @param  {string} name
 * @param  {string?} value
 * @returns {string | void}
 */
export default function cssVariable(
  name: string,
  value?: string
): string | void {
  if (!value) return document.documentElement.style.getPropertyValue(name);

  document.documentElement.style.setProperty(name, value);
}
