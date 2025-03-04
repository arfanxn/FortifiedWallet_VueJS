// stores/ethers.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNavigationStore = defineStore('navigation', () => {
  // ==========================================================================
  //                                State
  // ==========================================================================
  const isSidebarOpened = ref(false)
  const menus = ref([
    {
      routeName: 'dashboard',
      name: '0xDashboard',
      symbol: '0xH',
      icon: 'house',
    },
    {
      routeName: 'token.index',
      name: '0xTokens',
      symbol: '0xT',
      icon: 'coins',
    },
    {
      routeName: 'transaction.index',
      name: '0xTransactions',
      symbol: '0xT',
      icon: 'right-left',
    },
  ])

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

  return { isSidebarOpened, menus, toggleSidebar }
})
