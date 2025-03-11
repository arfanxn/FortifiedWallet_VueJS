import { storeToRefs } from 'pinia'
import { useEthereumStore } from '@/stores/ethereum.store'
import { useWalletStore } from '@/stores/wallet.store'
import * as walletService from '@/services/wallet.service'
import * as walletFactoryService from '@/services/walletFactory.service'
import * as tokenService from '@/services/token.service'
import { useRoute } from 'vue-router'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'
import { getPaginationOffset } from '@/utils/number.utils'
import { isNonEmptyString, isStringNumber } from '@/utils/boolean.utils'
import { isZeroAddress } from '@/helpers/string.helpers'
import { useWalletParser } from './walletParser.composable'

export function useWalletInteraction() {
  // ==========================================================================
  //                                Variables
  // ==========================================================================
  const route = useRoute()
  const ethereumStore = useEthereumStore()
  const walletStore = useWalletStore()
  const { tupleToWallet } = useWalletParser()

  // ==========================================================================
  //                            Internal functions
  // ==========================================================================
  //

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
    } else if (walletStore.selectedWallet) {
      await fetchWalletByAddr(walletStore.selectedWallet.address)
      walletStore.selectWallet(walletStore.selectedWallet.address)
    } else {
      await fetchPaginatedWallets(walletStore.currentPage)
    }
  }

  const fetchPaginatedWallets = async (page: number): Promise<void> => {
    const signer = ethereumStore.activeAccount
    const runner = ethereumStore.provider as ethers.BrowserProvider
    const limit = 5
    const offset = getPaginationOffset(page, limit)
    const tuples = await walletFactoryService.getNewestWalletsBySigner(
      {
        signer,
        offset,
        limit,
      },
      runner,
    )
    // Convert the tuples to Wallet objects and store them in the walletStore
    walletStore.wallets = tuples.map(tupleToWallet)
    walletStore.currentPage = page
  }

  const fetchWalletByAddr = async (address: string): Promise<void> => {
    try {
      const runner = ethereumStore.provider as ethers.BrowserProvider
      const tuple = await walletFactoryService.getWallet({ address }, runner)
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
    const runner = await ethereumStore.provider!.getSigner()
    const address = await walletFactoryService.createWallet(
      {
        name,
        signers,
        minimumApprovals,
        passwordHash,
      },
      runner,
    )
    return address
  }

  const depositWallet = async (to: string, token: string, value: BigNumber) => {
    const runner = await ethereumStore.provider!.getSigner()
    if (isZeroAddress(token) === false) {
      await tokenService.approve({ token, spender: to, value }, runner)
    }
    await walletService.deposit({ to, token, value }, runner)
  }

  const createWalletTransaction = async (token: string, to: string, value: BigNumber) => {
    const runner = await ethereumStore.provider!.getSigner()
    const from = walletStore.selectedWallet!.address
    const txHash = await walletService.createTransaction(
      {
        from,
        token,
        to,
        value,
      },
      runner,
    )
    return txHash
  }

  return {
    // ============================== State variables ==============================
    //

    // ================================== Methods ==================================
    fillWalletStoreFromRoute,
    fetchPaginatedWallets,
    fetchWalletByAddr,
    refreshWallets,
    createWallet,
    depositWallet,
    createWalletTransaction,
  }
}
