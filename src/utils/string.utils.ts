/**
 * Checks if a given string contains a given substring.
 *
 * @param {string} str - The string to check.
 * @param {string} substr - The substring to search for.
 * @returns {boolean} Whether the string contains the substring.
 */
export function contains(str: string, substr: string): boolean {
  const regex = new RegExp(`.*${substr}.*`)
  return regex.test(str)
}

/**
 * Checks if a given string is not empty and not null.
 *
 * @param {any} str - The string to check.
 * @returns {boolean} Whether the string is not empty and not null.
 */
export function notEmpty(str: any): boolean {
  return str != '' && str != null && str != undefined
}

/**
 * Checks if a given string is empty or null.
 *
 * @param {any} str - The string to check.
 * @returns {boolean} Whether the string is not empty and not null.
 */
export function empty(str: any): boolean {
  return notEmpty(str) == false
}
