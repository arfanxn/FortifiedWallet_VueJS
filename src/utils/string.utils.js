

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
