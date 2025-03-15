import { useRoute, useRouter } from 'vue-router'
import { RouteName } from '@/enums/route.enums'
import { useAppUI } from '@/composables/appUI.composable'
import { useEthereumStore } from '@/stores/ethereum.store'
import { useWalletStore } from '@/stores/wallet.store'
import { useTransactionStore } from '@/stores/transaction.store'
import { useWalletInteraction } from '../wallets/walletInteraction.composable'
import { isInstanceOf } from '@/utils/boolean.utils'
import { showToast } from '@/helpers/toast.helpers'
import { ToastType } from '@/enums/toast.enums'
import { Wallet } from '@/interfaces/wallet.interfaces'

export function useTransactionNavigator() {
  // ==========================================================================
  //                                Variables
  // ==========================================================================
  const route = useRoute()
  const router = useRouter()
  const ethereumStore = useEthereumStore()
  const walletStore = useWalletStore()
  const transactionStore = useTransactionStore()
  const {
    fetchPaginatedWallets,
    fetchWalletByAddr,
    fetchPaginatedTransactions,
    fetchTransactionByHash,
  } = useWalletInteraction()
  const { withLoading, startLoading, stopLoading } = useAppUI()

  // ==========================================================================
  //                            Internal functions
  // ==========================================================================
  //

  // ==========================================================================
  //                            External functions
  // ==========================================================================

  const navigateToTransaction = async () => {
    startLoading()
    await fetchPaginatedWallets(walletStore.currentPage)
    walletStore.selectedWallet = undefined
    router.push({ name: RouteName.Transaction, query: { page: walletStore.currentPage } })
    stopLoading()
  }

  const navigateToTransactionIndex = async (params?: { wallet?: Wallet; walletAddr?: string }) => {
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

      if (transactionStore.keyword) {
        const transaction = await fetchTransactionByHash(transactionStore.keyword)
        transactionStore.selectedTransaction = transaction
        router.push({
          name: RouteName.TransactionIndex,
          params: {
            walletAddr: walletStore.selectedWallet!.address,
            transactionHash: transaction.hash,
          },
        })
      } else {
        await fetchPaginatedTransactions(transactionStore.currentPage)
        transactionStore.selectedTransaction = undefined
        router.push({
          name: RouteName.TransactionIndex,
          params: { walletAddr: walletStore.selectedWallet!.address },
          query: { page: transactionStore.currentPage },
        })
      }
    } catch (error) {
      if (isInstanceOf(error, Error)) showToast(ToastType.Error, error.message)
      else throw error
    } finally {
      stopLoading()
    }
  }

  return {
    navigateToTransaction,
    navigateToTransactionIndex,
  }
}
