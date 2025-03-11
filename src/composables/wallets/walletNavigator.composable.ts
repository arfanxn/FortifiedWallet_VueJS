import { useWalletStore } from '@/stores/wallet.store'
import { useRoute, useRouter } from 'vue-router'
import { RouteName } from '@/enums/route.enums'
import { Wallet } from '@/interfaces/wallet.interfaces'

export function useNavigation() {
  // ==========================================================================
  //                                Variables
  // ==========================================================================
  const route = useRoute()
  const router = useRouter()
  const walletStore = useWalletStore()

  // ==========================================================================
  //                            Internal functions
  // ==========================================================================
  //

  // ==========================================================================
  //                            External functions
  // ==========================================================================

  const navigateToConnect = async () => {
    router.push({ name: RouteName.Connect })
  }

  /**
   * Navigate to the dashboard, with the current page number as a query parameter.
   *
   * This is used to navigate from the wallet show page back to the dashboard,
   * and to maintain the current page number.
   */
  const navigateToDashboard = () => {
    router.push({ name: RouteName.Dashboard, query: { page: walletStore.currentPage } })
  }

  /**
   * Navigate to the wallet show page, and select the given wallet.
   *
   * If the given wallet is `undefined`, the currently selected wallet is used.
   * If the currently selected wallet is `undefined`, the function does nothing.
   * If the given wallet and the currently selected wallet are different,
   * the given wallet is selected.
   *
   * This is used to navigate from the wallet list page to the wallet show page,
   * and to maintain the currently selected wallet.
   * @param {Wallet} [wallet] The wallet to select and navigate to.
   */
  const navigateToWalletShow = (wallet?: Wallet) => {
    if (!wallet && !walletStore.selectedWallet) return
    else if (wallet && !walletStore.selectedWallet) walletStore.selectedWallet = wallet
    else if (!wallet && walletStore.selectedWallet) wallet = walletStore.selectedWallet
    else if (
      wallet &&
      walletStore.selectedWallet &&
      wallet.address !== walletStore.selectedWallet.address
    )
      walletStore.selectedWallet = wallet

    router.push({
      name: RouteName.WalletShow,
      params: { walletAddr: (wallet as Wallet).address },
    })
  }

  /**
   * Navigate to the wallet create page, and reset the currently selected wallet.
   *
   * This is used to navigate from the wallet show page to the wallet create page,
   * when the user wants to create a new wallet.
   */
  const navigateToWalletCreate = () => {
    router.push({ name: RouteName.WalletCreate })
    walletStore.selectedWallet = undefined
  }

  return {
    // ============================== State variables ==============================
    //

    // ================================== Methods ==================================
    navigateToConnect,
    navigateToDashboard,
    navigateToWalletShow,
    navigateToWalletCreate,
  }
}
