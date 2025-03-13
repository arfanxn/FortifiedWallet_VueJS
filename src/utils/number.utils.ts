import { isString } from '@/utils/boolean.utils'

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

export function toNumber(str: string | number, radix: number = 10, fallback?: number): number {
  const number = parseInt(isString(str) ? str : str.toString(), radix)
  if (Number.isInteger(number)) return number
  else if (fallback != undefined) return fallback
  else return number
}

export function toBase10Number(str: string, fallback?: number) {
  return toNumber(str, 10, fallback)
}

/**
 * Calculates the offset for pagination based on the given page and limit.
 *
 * @param {number} page - The page number, 1-indexed.
 * @param {number} limit - The number of items per page.
 * @returns {number} The calculated offset.
 */
export function getPaginationOffset(page: number, limit: number): number {
  const offset = (page - 1) * limit
  return offset
}
