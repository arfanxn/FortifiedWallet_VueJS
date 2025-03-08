import { storeToRefs } from 'pinia'
import { useEthereumStore } from '@/stores/ethereum.store'
import { useWalletStore } from '@/stores/wallet.store'
import * as walletService from '@/services/wallet.service'
import * as tokenService from '@/services/token.service'
import { useRoute } from 'vue-router'
import { Wallet, WalletTuple } from '@/interfaces/wallet.interfaces'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'
import { getPaginationOffset } from '@/utils/number.utils'
import { isNonEmptyString, isStringNumber } from '@/utils/boolean.utils'
import { isZeroAddress } from '@/helpers/string.helpers'

export function useWallet() {
  // ==========================================================================
  //                                Variables
  // ==========================================================================
  const route = useRoute()
  const ethereumStore = useEthereumStore()
  const walletStore = useWalletStore()
  const { wallets } = storeToRefs(walletStore)

  // ==========================================================================
  //                            Internal functions
  // ==========================================================================

  const tupleToWallet = (tuple: WalletTuple): Wallet => {
    return {
      name: tuple[0],
      address: tuple[1],
      signers: tuple[2],
      minimumApprovals: tuple[3],
      totalBalanceInUsd: tuple[4], // Assuming USD is 18 decimals
    }
  }

  // ==========================================================================
  //                            External functions
  // ==========================================================================

  const fillWalletStoreFromRoute = async () => {
    const params = route.params
    const query = route.query
    const currentPage = isStringNumber(query.page) ? parseInt(query.page as string) : 1
    const keyword = isNonEmptyString(params.walletAddr) ? (params.walletAddr as string) : undefined
    walletStore.$patch({ currentPage, keyword })
    if (keyword) {
      await fetchWalletByAddr(keyword)
      walletStore.selectWallet(keyword)
    } else {
      await fetchPaginatedWallets(currentPage)
      walletStore.selectWallet(undefined)
    }
  }

  /**
   * Refreshes the list of wallets, either by refetching a single wallet by address
   * or by refetching the paginated list of wallets.
   */
  const refreshWallets = async () => {
    if (walletStore.keyword) {
      await fetchWalletByAddr(walletStore.keyword)
      if (walletStore.selectedWallet) walletStore.selectWallet(walletStore.keyword)
    } else {
      await fetchPaginatedWallets(walletStore.currentPage)
    }
  }

  const fetchPaginatedWallets = async (page: number): Promise<void> => {
    const signer = ethereumStore.activeAccount
    const provider = ethereumStore.provider as ethers.BrowserProvider
    const limit = 5
    const offset = getPaginationOffset(page, limit)
    const tuples = await walletService.getNewestWalletsBySigner(provider, {
      signer,
      offset,
      limit,
    })
    // Convert the tuples to Wallet objects and store them in the walletStore
    walletStore.wallets = tuples.map(tupleToWallet)
    walletStore.currentPage = page
  }

  const fetchWalletByAddr = async (address: string): Promise<void> => {
    try {
      const provider = ethereumStore.provider as ethers.BrowserProvider
      const tuple = await walletService.getWallet(provider, { address })
      const wallet = tupleToWallet(tuple)
      walletStore.wallets = [wallet]
    } catch (error) {
      walletStore.wallets = []
      throw error
    }
  }

  const createWallet = async (
    name: string,
    signers: string[],
    minimumApprovals: number,
    passwordHash: string,
  ) => {
    const providerSigner = await ethereumStore.provider!.getSigner()
    const address = await walletService.createWallet(providerSigner, {
      name,
      signers,
      minimumApprovals,
      passwordHash,
    })
    return address
  }

  const depositWallet = async (to: string, token: string, value: BigNumber) => {
    const providerSigner = await ethereumStore.provider!.getSigner()
    if (isZeroAddress(token) === false) {
      await tokenService.approve(providerSigner, { token, spender: to, value })
    }
    await walletService.deposit(providerSigner, { to, token, value })
  }

  return {
    // ============================== State variables ==============================
    wallets,
    // ================================== Methods ==================================
    refreshWallets,
    fillWalletStoreFromRoute,
    fetchPaginatedWallets,
    fetchWalletByAddr,
    createWallet,
    depositWallet,
  }
}
