import { ethers } from 'ethers'
import { useRoute } from 'vue-router'
import { useEthereumStore } from '@/stores/useEthereumStore'
import { useTokenStore } from '@/stores/useTokenStore'
import { useTransactionStore } from '@/stores/useTransactionStore'
import { useWalletStore } from '@/stores/useWalletStore'
import * as tokenService from '@/services/tokenServices'
import * as walletFactoryService from '@/services/walletFactoryServices'
import * as walletService from '@/services/walletServices'
import { Transaction } from '@/interfaces/transactionInterfaces'
import { Wallet } from '@/interfaces/walletInterfaces'
import { Token } from '@/interfaces/tokenInterfaces'
import { isZeroAddress } from '@/helpers/stringHelpers'
import { isNonEmptyString, isStringNumber } from '@/utils/booleanUtils'
import { getPaginationOffset } from '@/utils/numberUtils'
import { useWalletParser } from './useWalletParser'

export function useWalletInteraction() {
  // ==========================================================================
  //                                Variables
  // ==========================================================================
  const route = useRoute()
  const ethereumStore = useEthereumStore()
  const walletStore = useWalletStore()
  const tokenStore = useTokenStore()
  const transactionStore = useTransactionStore()
  const { tupleToWallet, tupleToTransaction, tupleToToken } = useWalletParser()

  // ==========================================================================
  //                            Internal functions
  // ==========================================================================
  //

  // ==========================================================================
  //                            External functions
  //                            Wallet relateds
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

  const depositWallet = async (to: string, token: string, value: bigint) => {
    const runner = await ethereumStore.provider!.getSigner()
    if (isZeroAddress(token) === false) {
      await tokenService.approve({ token, spender: to, value }, runner)
    }
    await walletService.deposit({ to, token, value }, runner)
  }

  const lockWalletBalance = async (usdAmount: bigint) => {
    const runner = await ethereumStore.provider!.getSigner()
    const wallet = walletStore.selectedWallet as Wallet
    await walletService.lockBalancedInUsd({ usdAmount }, wallet.address, runner)
  }

  const unlockWalletBalance = async (usdAmount: bigint, password: string, salt: string) => {
    const runner = await ethereumStore.provider!.getSigner()
    const wallet = walletStore.selectedWallet as Wallet
    await walletService.unlockBalanceInUsd({ usdAmount, password, salt }, wallet.address, runner)
  }

  // ==========================================================================
  //                            External functions
  //                            Token relateds
  // ==========================================================================

  const syncTokenStoreWithRoute = async () => {
    const params = route.params
    const query = route.query
    const currentPage = isStringNumber(query.page) ? parseInt(query.page as string) : 1
    const keyword = isNonEmptyString(params.tokenAddr) ? (params.tokenAddr as string) : undefined
    const walletAddr = isNonEmptyString(params.walletAddr)
      ? (params.walletAddr as string)
      : undefined
    tokenStore.$patch({ currentPage, keyword })
    if (walletAddr) {
      if (keyword) {
        const token = await fetchTokenByAddr(keyword)
        tokenStore.selectedToken = token
      } else {
        await fetchPaginatedTokens(currentPage)
        tokenStore.selectedToken = undefined
      }
    }
  }

  const addToken = async (address: string) => {
    const runner = await ethereumStore.provider!.getSigner()
    const wallet = walletStore.selectedWallet as Wallet
    await walletService.addToken({ address }, wallet.address, runner)
  }

  const removeToken = async (address: string) => {
    const runner = await ethereumStore.provider!.getSigner()
    const wallet = walletStore.selectedWallet as Wallet
    await walletService.removeToken({ address }, wallet.address, runner)
  }

  const fetchPaginatedTokens = async (page: number): Promise<void> => {
    const runner = ethereumStore.provider as ethers.BrowserProvider
    const wallet = walletStore.selectedWallet as Wallet
    const limit = 10
    const offset = getPaginationOffset(page, limit)
    const tuples = await walletService.getTokens(
      {
        offset,
        limit,
      },
      wallet.address,
      runner,
    )
    // Convert the tuples to Wallet objects and store them in the walletStore
    tokenStore.tokens = tuples.map(tupleToToken)
    tokenStore.currentPage = page
  }

  const fetchTokenByAddr = async (address: string): Promise<Token> => {
    try {
      const runner = ethereumStore.provider as ethers.BrowserProvider
      const wallet = walletStore.selectedWallet as Wallet
      const tuple = await walletService.getToken({ address }, wallet.address, runner)
      const token = tupleToToken(tuple)
      tokenStore.tokens = [token]
      return token
    } catch (error) {
      tokenStore.tokens = []
      throw error
    }
  }

  // ==========================================================================
  //                            External functions
  //                            Transaction relateds
  // ==========================================================================

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

  const createWalletTransaction = async (token: string, to: string, value: bigint) => {
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
    // ================================== Wallet ==================================
    // Interact wallet store
    syncWalletStoreWithRoute,
    // Interact wallet(s)
    createWallet,
    depositWallet,
    lockWalletBalance,
    unlockWalletBalance,
    // Populate wallet(s)
    fetchPaginatedWallets,
    fetchWalletByAddr,
    // ================================== Token ==================================
    // Interact token store
    syncTokenStoreWithRoute,
    // Interact token(s)
    addToken,
    removeToken,
    // Populate wallet's token(s)
    fetchPaginatedTokens,
    fetchTokenByAddr,
    // ================================== Transaction ==============================
    // Interact transaction store
    syncTransactionStoreWithRoute,
    // Interact wallet's transaction(s)
    createWalletTransaction,
    approveWalletTransaction,
    revokeWalletTransaction,
    cancelWalletTransaction,
    executeWalletTransaction,
    // Populate wallet's transaction(s)
    fetchPaginatedTransactions,
    fetchTransactionByHash,
  }
}
