import { useBlockchainStore } from '@/stores/blockchain.store'
import { useWalletStore } from '@/stores/wallet.store'
import { useRoute, useRouter } from 'vue-router'
import { RouteName } from '@/enums/route.enums'

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
   * Navigate to the wallet show page for the currently selected wallet.
   *
   * If no wallet is selected, this does nothing.
   */
  const navigateToWalletShow = () => {
    router.push({
      name: RouteName.WalletShow,
      params: { walletAddr: walletStore.selectedWallet!.address },
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
    navigateToDashboard,
    navigateToWalletShow,
    navigateToWalletCreate,
  }
}
