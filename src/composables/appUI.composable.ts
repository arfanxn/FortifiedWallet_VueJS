import { useUIStore } from '@/stores/ui.store'
import { storeToRefs } from 'pinia'

export function useAppUI() {
  const appStore = useUIStore()
  const { isSidebarOpened, isLoading } = storeToRefs(appStore)

  const toggleSidebar = (): void => {
    appStore.toggleSidebar()
  }

  const startLoading = () => {
    appStore.startLoading()
  }

  const stopLoading = () => {
    appStore.stopLoading()
  }

  /**
   * Calls the given closure while loading is enabled.
   *
   * @template T type of the value returned by the closure
   * @param {() => Promise<T>} closure closure to be called
   * @returns {Promise<T>} value returned by the closure
   */
  const withLoading = async <T>(closure: () => Promise<T>): Promise<T> => {
    startLoading()
    try {
      const result = await closure()
      stopLoading()
      return result
    } catch (error) {
      stopLoading()
      throw error
    }
  }

  return {
    // ============================== State variables ==============================
    isSidebarOpened,
    isLoading,
    // ================================== Methods ==================================
    toggleSidebar,
    startLoading,
    stopLoading,
    withLoading,
  }
}
