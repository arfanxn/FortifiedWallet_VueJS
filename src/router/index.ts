import { createRouter, createWebHistory, RouteLocationNormalizedGeneric } from 'vue-router'
import { RouteName } from '@/enums/routeEnums'
import { useEthereumInteraction } from '@/composables/ethereums/useEthereumInteraction'
import { isString } from '@/utils/booleanUtils'
import { title } from 'process'

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
          meta: {
            title: 'Add Wallet',
          },
        },
        {
          path: '/wallets/:walletAddr',
          name: RouteName.WalletShow,
          component: () => import('../components/wallets/WalletShow.vue'),
          meta: {
            title: 'Wallet Details',
          },
        },
        {
          path: '/wallets/:walletAddr/deposit/:depositType(ether|token)',
          name: RouteName.WalletDeposit,
          component: () => import('../components/wallets/WalletDeposit.vue'),
          meta: {
            title: 'Wallet Deposit',
          },
          props: true,
        },
        {
          path: '/wallets/:walletAddr/transfer/:transactionType(ether|token)',
          name: RouteName.WalletTransfer,
          component: () => import('../components/wallets/WalletTransfer.vue'),
          meta: {
            title: 'Wallet Transfer',
          },
          props: true,
        },
        {
          path: '/wallets/:walletAddr/lock',
          name: RouteName.WalletLock,
          component: () => import('../components/wallets/WalletLock.vue'),
          meta: {
            title: 'Wallet Lock',
          },
        },
      ],
    },

    // Token page
    {
      path: '/tokens',
      name: RouteName.Token,
      component: () => import('../views/TokenView.vue'),
      meta: {
        requiresWallet: true,
        title: 'Tokens',
      },
      children: [
        {
          path: '/wallets/:walletAddr/tokens/:tokenAddr?',
          name: RouteName.TokenIndex,
          component: () => import('../components/tokens/TokenIndex.vue'),
        },
        {
          path: '/wallets/:walletAddr/tokens/:tokenAddr/add',
          name: RouteName.TokenAdd,
          component: () => import('../components/tokens/TokenIndex.vue'),
          meta: {
            title: 'Add Token',
          },
        },
      ],
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
      meta: {
        title: 'Connect',
      },
    },

    // Not Found Page
    {
      path: '/:pathMatch(.*)*',
      name: RouteName.ErrorView,
      component: () => import('../views/ErrorView.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  const appName = import.meta.env.VITE__APP_NAME
  document.title = isString(to.meta.title) ? `${to.meta.title} | ${appName}` : appName

  console.log(to.meta)

  if (to.meta.requiresWallet) {
    const { isConnected, connect } = useEthereumInteraction()
    isConnected ? connect() : next({ name: RouteName.Connect })
  }

  next()
})

export default router
