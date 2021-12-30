/**
 * Determine whether user prefers dark mode from the used device OS dark mode settings
 *
 * @returns {bool}
 */
export default function userPrefersDarkMode(): boolean {
  return Boolean(window.matchMedia("(prefers-color-scheme: dark)").matches);
}
