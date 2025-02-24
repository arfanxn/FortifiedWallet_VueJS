/**
 * Execute a try-catch-finally block.
 *
 * @param {Function} tryClosure - The closure to execute in the try block.
 * @param {Function} catchClosure - The closure to execute in the catch block with the thrown error as the first argument.
 * @param {Function|null} finallyClosure - The closure to execute in the finally block.
 */
export function tryCatchFinally(tryClosure, catchClosure, finallyClosure = null) {
  try {
    tryClosure()
  } catch (error) {
    catchClosure(error)
  } finally {
    if (finallyClosure instanceof Function) finallyClosure()
  }
}
