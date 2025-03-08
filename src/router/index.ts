import { createRouter, createWebHistory } from 'vue-router'
import { useEthereumStore } from '@/stores/ethereum.store'
import { RouteName } from '@/enums/route.enums'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Dashboard pages
    {
      path: '/',
      alias: ['/dashboard', '/wallets'],
      name: RouteName.Dashboard,
      component: () => import('../views/DashboardView.vue'),
      meta: {
        requiresWallet: true,
        title: 'Dashboard',
      },
      children: [
        {
          path: '/wallets/create',
          name: RouteName.WalletCreate,
          component: () => import('../components/wallets/WalletCreate.vue'),
        },
        {
          path: '/wallets/:walletAddr',
          name: RouteName.WalletShow,
          component: () => import('../components/wallets/WalletShow.vue'),
        },
        {
          path: '/wallets/:walletAddr/deposit/:depositType?',
          name: RouteName.WalletDeposit,
          component: () => import('../components/wallets/WalletDeposit.vue'),
        },
        {
          path: '/wallets/:walletAddr/transfer',
          name: RouteName.WalletTransfer,
          component: () => import('../components/wallets/WalletTransfer.vue'),
        },
      ],
    },

    // Token page
    {
      path: '/tokens',
      name: RouteName.TokenIndex,
      component: () => import('../views/TokensView.vue'),
      meta: {
        requiresWallet: true,
        title: 'Tokens',
      },
    },

    // Transaction page
    {
      path: '/transactions',
      name: RouteName.TransactionIndex,
      component: () => import('../views/TransactionView.vue'),
      meta: {
        requiresWallet: true,
        title: 'Transactions',
      },
    },

    // Connect page
    {
      path: '/connect',
      name: RouteName.WalletConnect,
      component: () => import('../views/ConnectView.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresWallet) {
    const ethereumStore = useEthereumStore()
    ethereumStore.isConnected ? ethereumStore.connect() : next({ name: 'connect' })
  }

  next()
})

export default router
