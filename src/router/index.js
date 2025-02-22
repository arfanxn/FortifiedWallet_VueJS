import { createRouter, createWebHistory } from 'vue-router'
import { useBlockchainStore } from '@/stores/blockchain.store.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: {
        requiresWallet: true,
      }
    },
    {
      path: '/tokens',
      name: 'tokens',
      component: () => import('../views/TokensView.vue'),
      meta: {
        requiresWallet: true,
      }
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: () => import('../views/TransactionView.vue'),
      meta: {
        requiresWallet: true,
      }
    },
    {
      path: '/connect',
      name: 'connect',
      component: () => import('../views/ConnectView.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresWallet) {
    const blockchainStore = useBlockchainStore()
    blockchainStore.isConnected ? blockchainStore.connect() : next({ name: 'connect' })
  }

  next()
})

export default router
