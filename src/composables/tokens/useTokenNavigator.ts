import { useRoute, useRouter } from 'vue-router'
import { RouteName } from '@/enums/routeEnums'
import { useEthereumStore } from '@/stores/useEthereumStore'
import { useWalletStore } from '@/stores/useWalletStore'
import { useTokenStore } from '@/stores/useTokenStore'
import { Wallet } from '@/interfaces/walletInterfaces'
import { Token } from '@/interfaces/tokenInterfaces'
import { useAppUI } from '../useAppUI'
import { useWalletInteraction } from '../wallets/useWalletInteraction'
import { isInstanceOf } from '@/utils/booleanUtils'
import { showToast } from '@/helpers/toastHelpers'
import { ToastType } from '@/enums/toastEnums'

export function useTokenNavigator() {
  // ==========================================================================
  //                                Variables
  // ==========================================================================
  const route = useRoute()
  const router = useRouter()
  const ethereumStore = useEthereumStore()
  const walletStore = useWalletStore()
  const tokenStore = useTokenStore()
  const { fetchWalletByAddr, fetchPaginatedWallets, fetchPaginatedTokens, fetchTokenByAddr } =
    useWalletInteraction()
  const { startLoading, stopLoading } = useAppUI()

  // ==========================================================================
  //                            Internal functions
  // ==========================================================================
  const getWalletAddressFromParams = (params?: { wallet?: Wallet; walletAddr?: string }) =>
    params?.wallet?.address ??
    params?.walletAddr ??
    walletStore.selectedWallet?.address ??
    route.params.walletAddr

  const getTokenAddrFromParams = (params?: { token?: Token; tokenAddr?: string }) =>
    params?.token?.address ?? params?.tokenAddr ?? tokenStore.keyword

  // ==========================================================================
  //                            External functions
  // ==========================================================================

  const navigateToToken = async () => {
    startLoading()
    await fetchPaginatedWallets(walletStore.currentPage)
    walletStore.selectedWallet = undefined
    router.push({ name: RouteName.Token, query: { page: walletStore.currentPage } })
    stopLoading()
  }

  const navigateToTokenIndex = async (params?: {
    wallet?: Wallet
    walletAddr?: string
    token?: Token
    tokenAddr?: string
  }) => {
    try {
      startLoading()

      const walletAddr = getWalletAddressFromParams(params)

      const wallet = await fetchWalletByAddr(walletAddr as string)
      if (!wallet) return

      const tokenAddr = getTokenAddrFromParams(params)

      walletStore.selectedWallet = wallet

      if (tokenAddr) {
        const token = await fetchTokenByAddr(tokenAddr as string)
        tokenStore.selectedToken = token
        router.push({
          name: RouteName.TokenIndex,
          params: {
            walletAddr: walletStore.selectedWallet!.address,
            tokenAddr: token.address,
          },
        })
      } else {
        await fetchPaginatedTokens(tokenStore.currentPage)
        tokenStore.selectedToken = undefined
        router.push({
          name: RouteName.TokenIndex,
          params: { walletAddr: walletStore.selectedWallet!.address },
          query: { page: tokenStore.currentPage },
        })
      }
    } catch (error) {
      if (isInstanceOf(error, Error)) showToast(ToastType.Error, error.message)
      else throw error
    } finally {
      stopLoading()
    }
  }

  const navigateToTokenAdd = async (params?: {
    wallet?: Wallet
    walletAddr?: string
    token?: Token
    tokenAddr?: string
  }) => {
    const walletAddr = getWalletAddressFromParams(params)
    const tokenAddr = getTokenAddrFromParams(params)
    router.push({
      name: RouteName.TokenAdd,
      params: {
        walletAddr: walletStore.selectedWallet!.address,
        tokenAddr: tokenAddr,
      },
    })
  }

  return {
    navigateToToken,
    navigateToTokenIndex,
    navigateToTokenAdd,
  }
}
