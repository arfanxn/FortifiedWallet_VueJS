// stores/ethers.ts
import { defineStore } from 'pinia';

export const useNavigationStore = defineStore('navigation', {
  state: () => ({
    isSidebarOpened: false,
    menus: [
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
    ],
  }),
  getters: {
    //
  },
  actions: {
    toggleSidebar() {
      this.isSidebarOpened = !this.isSidebarOpened
    },
  },
})

