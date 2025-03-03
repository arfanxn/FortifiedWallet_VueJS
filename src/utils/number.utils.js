/**
 * Extracts all numeric characters from a given string.
 *
 * This function takes a string input and removes all non-numeric
 * characters, returning a string composed only of digits.
 *
 * @param {string} string - The input string from which to extract numbers.
 * @returns {string} A string containing only the numeric characters from the input.
 */
export function extractNumber(string) {
  const number = String(string).replace(/\D/g, ''); // "a1b2c3!@#" -> 123
  return number
}

export function toNumber(string, radix = 10, fallback) {
  const number = parseInt(string, radix);
  if (Number.isInteger(number)) return number
  else if (fallback != undefined) return fallback
  else return number
}

export function toBase10Number(string, fallback) {
  return toNumber(string, 10, fallback)
}
