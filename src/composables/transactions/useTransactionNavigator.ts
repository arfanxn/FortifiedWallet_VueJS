import { useRoute, useRouter } from 'vue-router'
import { RouteName } from '@/enums/routeEnums'
import { useAppUI } from '@/composables/useAppUI'
import { useEthereumStore } from '@/stores/useEthereumStore'
import { useWalletStore } from '@/stores/useWalletStore'
import { useTransactionStore } from '@/stores/useTransactionStore'
import { useWalletInteraction } from '../wallets/useWalletInteraction'
import { isInstanceOf } from '@/utils/booleanUtils'
import { showToast } from '@/helpers/toastHelpers'
import { ToastType } from '@/enums/toastEnums'
import { Wallet } from '@/interfaces/walletInterfaces'
import { Transaction } from '@/interfaces/transactionInterfaces'

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

  const navigateToTransactionIndex = async (params?: {
    wallet?: Wallet
    walletAddr?: string
    transaction?: Transaction
    transactionHash?: string
  }) => {
    try {
      startLoading()

      const walletAddr =
        params?.wallet?.address ??
        params?.walletAddr ??
        walletStore.selectedWallet?.address ??
        route.params.walletAddr

      const wallet = await fetchWalletByAddr(walletAddr as string)
      if (!wallet) return

      const transactionHash =
        params?.transaction?.hash ??
        params?.transactionHash ??
        transactionStore.keyword ??
        route.params.transactionHash

      walletStore.selectedWallet = wallet

      if (transactionHash) {
        const transaction = await fetchTransactionByHash(transactionHash as string)
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
