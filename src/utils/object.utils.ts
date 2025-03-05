export function tryOrElse<T1, T2>(accessor: () => T1, fallback: T2): T1 | T2 {
  try {
    return accessor()
  } catch {
    return fallback
  }
}
