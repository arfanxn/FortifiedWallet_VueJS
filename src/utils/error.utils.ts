/**
 * Execute a try-catch-finally block.
 *
 * @param {Function} tryClosure - The closure to execute in the try block.
 * @param {Function} catchClosure - The closure to execute in the catch block with the thrown error as the first argument.
 * @param {Function|null} finallyClosure - The closure to execute in the finally block.
 */
export function tryCatchFinally(
  tryClosure: Function,
  catchClosure: Function,
  finallyClosure: Function | null = null,
) {
  try {
    tryClosure()
  } catch (error) {
    catchClosure(error)
  } finally {
    if (finallyClosure instanceof Function) finallyClosure()
  }
}

/**
 * Execute a closure in a try block and rethrow any thrown errors.
 *
 * @param {Function} tryClosure - The closure to execute in the try block.
 * @returns {any} The return value of the try closure.
 * @throws {Error} The thrown error from the try closure.
 */
export function tryRethrow(tryClosure: Function): any {
  // eslint-disable-next-line no-useless-catch
  try {
    return tryClosure()
  } catch (error) {
    throw error
  }
}

/**
 * Type guard for determining if an unknown value is an Error.
 *
 * @param {unknown} error - The value to check.
 * @returns {error is Error} True if the value is an Error, false otherwise.
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error
}
