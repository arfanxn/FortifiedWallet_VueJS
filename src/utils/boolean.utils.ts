/**
 * Boolean utilities provide functions that return a boolean value based on one
 * or more input parameters.
 */

import { ethers } from 'ethers'

export function contains(str?: string, substr?: string): boolean {
  if (!str || !substr) return false
  const regex = new RegExp(`.*${substr}.*`)
  return regex.test(str)
}

/**
 * Checks if the given value is a string.
 * @param {unknown} value - The value to check
 * @returns {boolean} True if the value is a string
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

/**
 * Checks if the given value is a non-empty string.
 * @param {unknown} value - The value to check
 * @returns {boolean} True if the value is a non-empty string
 */
export function isNonEmptyString(value: unknown): boolean {
  if (!isString(value)) return false
  else if (value === '') return false
  else return true
}

/**
 * Checks if a string represents a valid finite number
 * @param input - The string to validate
 * @returns True if the string represents a valid finite number
 */
export function isStringNumber(input: unknown): boolean {
  if (typeof input !== 'string') return false

  // Trim whitespace from both ends
  const trimmed = input.trim()

  // Handle empty string after trimming
  if (trimmed === '') return false

  // Regular expression to match valid numbers:
  // ^[-+]?       - Optional sign
  // (            - Start of number part
  //  \d+\.?\d*   - Integer with optional decimal (e.g., 123, 123.45)
  //  |           - OR
  //  \.\d+       - Decimal without leading zero (e.g., .45)
  // )            - End of number part
  // ([eE][-+]?\d+)? - Optional scientific notation
  // $             - End of string
  const numberPattern = /^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/

  // First check the pattern
  if (!numberPattern.test(trimmed)) return false

  // Convert to number and verify finite value
  const numberValue = Number(trimmed)
  return Number.isFinite(numberValue)
}

/**
 * Checks if a value is considered non-empty/non-zero/non-falsy
 * @param {T} value - The value to check
 * @returns {boolean} True if the value is not empty/zero/falsy
 */
export function isNotEmpty<T>(value: T): boolean {
  // Check for undefined/null
  if (value === undefined || value === null) return false

  // Check for empty string (including whitespace-only strings)
  if (typeof value === 'string' && value.trim() === '') return false

  // Check for zero (number)
  if (typeof value === 'number' && value === 0) return false

  // Check for empty array
  if (Array.isArray(value) && value.length === 0) return false

  // Check for empty object
  if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0)
    return false

  // Check for false boolean
  if (typeof value === 'boolean' && !value) return false

  // Check for NaN
  if (typeof value === 'number' && isNaN(value)) return false

  // All other cases are considered "not empty"
  return true
}

/**
 * Checks if a value is considered empty/zero/falsy
 * @param {T} value - The value to check
 * @returns {boolean} True if the value is empty/zero/falsy
 */
export function isEmpty<T>(value: T): boolean {
  return !isNotEmpty<T>(value)
}

export function isInstanceOf<T>(
  instance: unknown,
  constructor: new (...args: any[]) => T,
): instance is T {
  return instance instanceof constructor
}

/**
 * Checks if a given string is a valid Ethereum address.
 *
 * First verifies the address format matches the standard Ethereum pattern,
 * then performs a checksum validation using ethers.js.
 *
 * @param {string | null | undefined} address - The Ethereum address to validate
 * @returns {boolean} True if the address is valid, false otherwise
 */
export function isEthAddr(address: string | null | undefined): address is string {
  if (address === null || address === undefined) return false
  // Quick format check first
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) return false

  // Full checksum validation
  return ethers.isAddress(address)
}

/**
 * Checks if a given string is the zero Ethereum address.
 *
 * @param {string | null | undefined} address - The Ethereum address to validate
 * @returns {boolean} True if the address is the zero address, false otherwise
 */
export function isZeroEthAddr(address: string | null | undefined): address is string {
  if (!address) return false
  return address === '0x0000000000000000000000000000000000000000'
}

export function isSameEthAddrs(addr1: string, addr2: string): boolean {
  return ethers.getAddress(addr1) === ethers.getAddress(addr2)
}

export function isEthHash(hash: string | null | undefined): hash is string {
  // Ethereum hashes are 32 bytes (64 hex characters) prefixed with '0x'
  return isString(hash) && /^0x[0-9a-fA-F]{64}$/.test(hash)
}

export function isEq<T>(a: T, b: T): boolean {
  return a === b
}

export function isNeq<T>(a: T, b: T): boolean {
  return isEq(a, b) === false
}
