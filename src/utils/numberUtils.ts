import { isString } from '@/utils/booleanUtils'

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

/**
 * Returns the last index of a string or array.
 *
 * @param {string | T[]} data - The string or array for which to find the last index.
 * @returns {number} The last index of the provided string or array.
 */

export function getLastIndex<T>(data: string | T[]): number {
  return data.length - 1
}
