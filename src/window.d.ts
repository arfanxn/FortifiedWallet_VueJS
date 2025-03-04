interface Window {
  ethereum?: {
    isMetaMask?: boolean
    request: <T>(args: { method: string; params?: unknown[] }) => Promise<T>
    on: (event: string, handler: (...args: any[]) => void) => void
    removeListener: (event: string, handler: (...args: any[]) => void) => void
    removeAllListeners?: () => Promise<void>
    // Add other methods you need
  }
}
