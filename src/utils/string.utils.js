/**
 * Checks if a given string contains a given substring.
 *
 * @param {string} string - The string to check.
 * @param {string} substring - The substring to search for.
 * @returns {boolean} Whether the string contains the substring.
 */
export function contains(string, substring) {
  const regex = new RegExp(`.*${substring}.*`)
  return regex.test(string)
}

/**
 * Checks if a given string is not empty and not null.
 *
 * @param {string} string - The string to check.
 * @returns {boolean} Whether the string is not empty and not null.
 */
export function notEmpty(string) {
  return string != '' && string != null && string != undefined
}

/**
 * Checks if a given string is empty or null.
 *
 * @param {string} string - The string to check.
 * @returns {boolean} Whether the string is not empty and not null.
 */
export function empty(string) {
  return notEmpty(string) == false
}
