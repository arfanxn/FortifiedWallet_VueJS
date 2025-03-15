/**
 * Converts a PascalCase string to a sentence case string.
 *
 * @param {string} s - The PascalCase string to be converted.
 * @returns {string} The converted sentence case string, where the first word is capitalized,
 * and the rest of the words are in lowercase, separated by spaces.
 */
export const pascalToSentenceCase = (s: string): string =>
  s
    .split(/(?<=[a-z])(?=[A-Z])/g)
    .map((w, i) => (i === 0 ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w.toLowerCase()))
    .join(' ')

/**
 * Extracts all numeric characters from a given string.
 *
 * This function takes a string input and removes all non-numeric
 * characters, returning a string composed only of digits.
 *
 * @param {string} str - The input string from which to extract numbers.
 * @returns {string} A string containing only the numeric characters from the input.
 */
export function extractNumber(str: string): string {
  str = str.replace(/\D/g, '') // "a1b2c3!@#" -> 123
  return str
}
