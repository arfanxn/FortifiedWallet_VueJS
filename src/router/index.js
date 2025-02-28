import { createRouter, createWebHistory } from 'vue-router'
import { useBlockchainStore } from '@/stores/blockchain.store.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Dashboard pages
    {
      path: '/',
      alias: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: {
        requiresWallet: true,
      },
      children: [
        {
          path: '/wallets/create',
          name: 'wallet.create',
          component: () => import('../components/dashboards/WalletCreate.vue'),
        },
        {
          path: '/wallets/:walletAddr',
          name: 'wallet.show',
          component: () => import('../components/dashboards/WalletShow.vue'),
        },
        {
          path: '/wallets/:walletAddr/deposit/:depositType?',
          name: 'wallet.deposit',
          component: () => import('../components/dashboards/WalletDeposit.vue'),
        },
        {
          path: '/wallets/:walletAddr/transfer',
          name: 'wallet.transfer',
          component: () => import('../components/dashboards/WalletTransfer.vue'),
        },
      ]
    },

    // Token page
    {
      path: '/tokens',
      name: 'token.index',
      component: () => import('../views/TokensView.vue'),
      meta: {
        requiresWallet: true,
      }
    },

    // Transaction page
    {
      path: '/transactions',
      name: 'transaction.index',
      component: () => import('../views/TransactionView.vue'),
      meta: {
        requiresWallet: true,
      }
    },

    // Connect page
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
