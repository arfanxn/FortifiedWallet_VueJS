import { useAppStore } from '@/stores/app.store'
import { storeToRefs } from 'pinia'

export function useApp() {
  const appStore = useAppStore()
  const { isSidebarOpened, isLoading } = storeToRefs(appStore)

  const toggleSidebar = () => {
    appStore.toggleSidebar()
  }

  const startLoading = () => {
    appStore.startLoading()
  }

  const stopLoading = () => {
    appStore.stopLoading()
  }

  return {
    // ============================== State variables ==============================
    isSidebarOpened,
    isLoading,
    // ================================== Methods ==================================
    toggleSidebar,
    startLoading,
    stopLoading,
  }
}
