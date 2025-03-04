import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // ==========================================================================
  //                                State
  // ==========================================================================
  const isSidebarOpened = ref(false)

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

  return { isSidebarOpened, toggleSidebar }
})
