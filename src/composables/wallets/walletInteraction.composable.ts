import { useEthereumStore } from '@/stores/ethereum.store'
import { useWalletStore } from '@/stores/wallet.store'
import { useTransactionStore } from '@/stores/transaction.store'
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
import { Wallet } from '@/interfaces/wallet.interfaces'
import { Transaction } from '@/interfaces/transaction.interfaces'

export function useWalletInteraction() {
  // ==========================================================================
  //                                Variables
  // ==========================================================================
  const route = useRoute()
  const ethereumStore = useEthereumStore()
  const walletStore = useWalletStore()
  const transactionStore = useTransactionStore()
  const { tupleToWallet, tupleToTransaction } = useWalletParser()

  // ==========================================================================
  //                            Internal functions
  // ==========================================================================
  //

  // ==========================================================================
  //                            External functions
  // ==========================================================================

  const syncWalletStoreWithRoute = async () => {
    const params = route.params
    const query = route.query
    const currentPage = isStringNumber(query.page) ? parseInt(query.page as string) : 1
    const keyword = isNonEmptyString(params.walletAddr) ? (params.walletAddr as string) : undefined
    walletStore.$patch({ currentPage, keyword })
    if (keyword) {
      const wallet = await fetchWalletByAddr(keyword)
      walletStore.selectedWallet = wallet
    } else {
      await fetchPaginatedWallets(currentPage)
      walletStore.selectedWallet = undefined
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

  const fetchWalletByAddr = async (address: string): Promise<Wallet | undefined> => {
    try {
      const runner = ethereumStore.provider as ethers.BrowserProvider
      const tuple = await walletFactoryService.getWallet({ address }, runner)
      const wallet = tupleToWallet(tuple)
      walletStore.wallets = [wallet]
      return wallet
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

  const syncTransactionStoreWithRoute = async () => {
    const params = route.params
    const query = route.query
    const currentPage = isStringNumber(query.page) ? parseInt(query.page as string) : 1
    const keyword = isNonEmptyString(params.transactionHash)
      ? (params.transactionHash as string)
      : undefined
    const walletAddr = isNonEmptyString(params.walletAddr)
      ? (params.walletAddr as string)
      : undefined
    transactionStore.$patch({ currentPage, keyword })
    if (walletAddr) {
      if (keyword) {
        const transaction = await fetchTransactionByHash(keyword)
        transactionStore.selectedTransaction = transaction
      } else {
        await fetchPaginatedTransactions(currentPage)
        transactionStore.selectedTransaction = undefined
      }
    }
  }

  const createWalletTransaction = async (token: string, to: string, value: BigNumber) => {
    const runner = await ethereumStore.provider!.getSigner()
    const walletAddr = walletStore.selectedWallet!.address
    const txHash = await walletService.createTransaction(
      {
        token,
        to,
        value,
      },
      walletAddr,
      runner,
    )
    return txHash
  }

  const approveWalletTransaction = async (hash: string): Promise<boolean> => {
    const runner = await ethereumStore.provider!.getSigner()
    const walletAddr = walletStore.selectedWallet!.address
    return await walletService.approveTransaction({ hash }, walletAddr, runner)
  }

  const revokeWalletTransaction = async (hash: string): Promise<boolean> => {
    const runner = await ethereumStore.provider!.getSigner()
    const walletAddr = walletStore.selectedWallet!.address
    return await walletService.revokeTransaction({ hash }, walletAddr, runner)
  }

  const cancelWalletTransaction = async (hash: string): Promise<boolean> => {
    const runner = await ethereumStore.provider!.getSigner()
    const walletAddr = walletStore.selectedWallet!.address
    return await walletService.cancelTransaction({ hash }, walletAddr, runner)
  }

  const executeWalletTransaction = async (hash: string): Promise<boolean> => {
    const runner = await ethereumStore.provider!.getSigner()
    const walletAddr = walletStore.selectedWallet!.address
    return await walletService.executeTransaction({ hash }, walletAddr, runner)
  }

  const fetchPaginatedTransactions = async (page: number) => {
    const runner = ethereumStore.provider as ethers.BrowserProvider
    const limit = 5
    const offset = getPaginationOffset(page, limit)
    const wallet = walletStore.selectedWallet as Wallet
    const tuples = await walletService.getNewestTransactions(
      { offset, limit },
      wallet.address,
      runner,
    )
    const transactions = tuples.map(tupleToTransaction)
    transactionStore.transactions = transactions
  }

  const fetchTransactionByHash = async (hash: string): Promise<Transaction> => {
    const runner = ethereumStore.provider as ethers.BrowserProvider
    const wallet = walletStore.selectedWallet as Wallet
    const tuple = await walletService.getTransaction({ hash }, wallet.address, runner)
    const transaction = tupleToTransaction(tuple)
    transactionStore.transactions = [transaction]
    return transaction
  }

  return {
    // ============================== State variables ==============================
    //

    // ================================== Methods ==================================
    // Interact wallet store
    syncWalletStoreWithRoute,
    // Interact wallet(s)
    createWallet,
    depositWallet,
    // Populate wallet(s)
    fetchPaginatedWallets,
    fetchWalletByAddr,
    // Interact transaction store
    syncTransactionStoreWithRoute,
    // Interact wallet transaction(s)
    createWalletTransaction,
    approveWalletTransaction,
    revokeWalletTransaction,
    cancelWalletTransaction,
    executeWalletTransaction,
    // Populate wallet transaction(s)
    fetchPaginatedTransactions,
    fetchTransactionByHash,
  }
}
