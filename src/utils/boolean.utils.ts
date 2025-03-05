/**
 * Boolean utilities provide functions that return a boolean value based on one
 * or more input parameters.
 */

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
export function isString(value: unknown): boolean {
  return typeof value === 'string'
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
