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
