import { createRouter, createWebHistory } from 'vue-router'
import { RouteName } from '@/enums/routeEnums'
import { useEthereumInteraction } from '@/composables/ethereums/useEthereumInteraction'

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
          path: '/wallets/:walletAddr/deposit/:depositType(ether|token)',
          name: RouteName.WalletDeposit,
          component: () => import('../components/wallets/WalletDeposit.vue'),
          props: true,
        },
        {
          path: '/wallets/:walletAddr/transfer/:transactionType(ether|token)',
          name: RouteName.WalletTransfer,
          component: () => import('../components/wallets/WalletTransfer.vue'),
          props: true,
        },
        {
          path: '/wallets/:walletAddr/lock',
          name: RouteName.WalletLock,
          component: () => import('../components/wallets/WalletLock.vue'),
        },
      ],
    },

    // Token page
    {
      path: '/tokens',
      name: RouteName.TokenIndex,
      component: () => import('../views/TokenView.vue'),
      meta: {
        requiresWallet: true,
        title: 'Tokens',
      },
    },

    // Transaction page
    {
      path: '/transactions',
      name: RouteName.Transaction,
      component: () => import('../views/TransactionView.vue'),
      meta: {
        requiresWallet: true,
        title: 'Transactions',
      },
      children: [
        {
          path: '/wallets/:walletAddr/transactions/:transactionHash?',
          name: RouteName.TransactionIndex,
          component: () => import('../components/transactions/TransactionIndex.vue'),
        },
      ],
    },

    // Connect page
    {
      path: '/connect',
      name: RouteName.WalletConnect,
      component: () => import('../views/ConnectView.vue'),
    },

    // TODO: add not found page
  ],
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresWallet) {
    const { isConnected, connect } = useEthereumInteraction()
    isConnected ? connect() : next({ name: RouteName.Connect })
  }

  next()
})

export default router
