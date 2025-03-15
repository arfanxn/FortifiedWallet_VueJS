import { useRoute, useRouter } from 'vue-router'
import { useWalletStore } from '@/stores/wallet.store'
import { useWalletInteraction } from '@/composables/wallets/walletInteraction.composable'
import { RouteName } from '@/enums/route.enums'
import { useAppUI } from '@/composables/appUI.composable'
import { isInstanceOf } from '@/utils/boolean.utils'
import { showToast } from '@/helpers/toast.helpers'
import { ToastType } from '@/enums/toast.enums'
import { Wallet } from '@/interfaces/wallet.interfaces'

export function useWalletNavigator() {
  // ==========================================================================
  //                                Variables
  // ==========================================================================
  const route = useRoute()
  const router = useRouter()
  const walletStore = useWalletStore()
  const { fetchPaginatedWallets, fetchWalletByAddr } = useWalletInteraction()
  const { withLoading, startLoading, stopLoading } = useAppUI()

  // ==========================================================================
  //                            Internal functions
  // ==========================================================================
  //

  // ==========================================================================
  //                            External functions
  // ==========================================================================

  const navigateToDashboard = async () => {
    startLoading()
    await fetchPaginatedWallets(walletStore.currentPage)
    router.push({ name: RouteName.Dashboard, query: { page: walletStore.currentPage } })
    stopLoading()
  }

  const navigateToWalletCreate = async () => {
    if (walletStore.selectedWallet) {
      walletStore.selectedWallet = undefined
      await fetchPaginatedWallets(walletStore.currentPage)
    }
    router.push({ name: RouteName.WalletCreate })
  }

  const navigateToWalletShow = async (params?: { wallet?: Wallet; walletAddr?: string }) => {
    try {
      startLoading()

      const walletAddr =
        params?.wallet?.address ??
        params?.walletAddr ??
        walletStore.selectedWallet?.address ??
        route.params.walletAddr

      const wallet = await fetchWalletByAddr(walletAddr as string)
      if (!wallet) return

      walletStore.selectedWallet = wallet
      router.push({
        name: RouteName.WalletShow,
        params: { walletAddr },
      })
    } catch (error) {
      if (isInstanceOf(error, Error)) showToast(ToastType.Error, error.message)
      else throw error
    } finally {
      stopLoading()
    }
  }

  const navigatToWalletDeposit = () => {
    router.push({
      name: RouteName.WalletDeposit,
      params: { walletAddr: walletStore.selectedWallet!.address },
    })
  }

  const navigateToWalletTransfer = () => {
    router.push({
      name: RouteName.WalletTransfer,
      params: { walletAddr: walletStore.selectedWallet!.address },
    })
  }

  const navigatToWalletLock = () => {
    // TODO: implements the locking functionality
    router.push({
      name: RouteName.WalletLock,
      params: { walletAddr: walletStore.selectedWallet!.address },
    })
  }

  return {
    navigateToDashboard,
    navigateToWalletCreate,
    navigateToWalletShow,
    navigatToWalletDeposit,
    navigateToWalletTransfer,
    navigatToWalletLock,
  }
}
