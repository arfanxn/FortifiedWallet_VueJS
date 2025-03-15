/**
 * Attempts to call the given accessor function and returns its result.
 * If the accessor throws an exception, the given fallback value is returned instead.
 *
 * @param accessor The accessor function to call.
 * @param fallback The fallback value to return if the accessor throws an exception.
 * @returns The result of calling the accessor, or the fallback if an exception was thrown.
 */

export function tryOrElse<T1, T2>(accessor: () => T1, fallback: T2): T1 | T2 {
  try {
    return accessor()
  } catch {
    return fallback
  }
}
