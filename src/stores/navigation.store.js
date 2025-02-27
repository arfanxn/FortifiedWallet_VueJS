// stores/ethers.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNavigationStore = defineStore('navigation', () => {
  // ==========================================================================
  //                                State
  // ==========================================================================
  const isSidebarOpened = ref(false)
  const menus = ref([
    {
      path: '/',
      name: '0xDashboard',
      symbol: '0xH',
      icon: 'house',
    },
    {
      path: '/tokens',
      name: '0xTokens',
      symbol: '0xT',
      icon: 'coins',
    },
    {
      path: '/transactions',
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
  const toggleSidebar = () => {
    isSidebarOpened.value = !isSidebarOpened.value
  }

  return { isSidebarOpened, menus, toggleSidebar }
})
