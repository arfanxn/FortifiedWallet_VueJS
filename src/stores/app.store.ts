import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // ==========================================================================
  //                                State
  // ==========================================================================
  const isSidebarOpened = ref(false)
  const isLoading = ref(false)

  // ==========================================================================
  //                                Getters
  // ==========================================================================
  //

  // ==========================================================================
  //                                Actions
  // ==========================================================================
  const toggleSidebar = (): void => {
    isSidebarOpened.value = !isSidebarOpened.value
  }

  const startLoading = (): void => {
    isLoading.value = true
  }
  const stopLoading = (): void => {
    isLoading.value = false
  }

  return { isSidebarOpened, toggleSidebar, isLoading, startLoading, stopLoading }
})
