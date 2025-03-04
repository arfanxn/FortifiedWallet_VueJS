import { storeToRefs } from 'pinia'
import { useBlockchainStore } from '@/stores/blockchain.store'
import { useWalletStore } from '@/stores/wallet.store'
import * as walletService from '@/services/wallet.service'
import * as tokenService from '@/services/token.service'
import { WalletDoesNotExistError } from '@/errors/wallet.errors'
import { useRouter } from 'vue-router'
import { EthereumAddress } from '@/interfaces/ethereum.interfaces'
import { WalletTuple } from '@/interfaces/wallet.interfaces'
import { BrowserProvider, ethers } from 'ethers'
import BigNumber from 'bignumber.js'

export function useWallet() {
  const router = useRouter()
  const blockchainStore = useBlockchainStore()
  const walletStore = useWalletStore()
  const { wallet, wallets } = storeToRefs(walletStore)

  const tupleToWallet = (tuple: WalletTuple) => {
    return {
      name: tuple[0],
      address: tuple[1],
      signers: tuple[2],
      minimumApprovals: tuple[3],
      totalBalanceInUsd: tuple[4], // Assuming USD is 18 decimals
    }
  }

  const fetchWallets = async (page: number = 1) => {
    const limit = 5
    const offset = (page - 1) * limit
    const provider = blockchainStore.provider as ethers.BrowserProvider
    const signerAddr = blockchainStore.activeAccount
    const tuples = await walletService.getNewestWalletsBySigner(provider, {
      signerAddr,
      offset,
      limit,
    })
    walletStore.wallets = tuples.map(tupleToWallet)
    return walletStore.wallets
  }

  const findWallet = async (walletAddr: EthereumAddress) => {
    try {
      const provider = blockchainStore.provider as ethers.BrowserProvider
      const tuple = await walletService.getWallet(provider, { walletAddr })
      const wallet = tupleToWallet(tuple)
      walletStore.wallet = wallet
      return wallet
    } catch {
      throw new WalletDoesNotExistError()
    }
  }

  interface CreateWalletParams {
    name: string
    signers: EthereumAddress[]
    minimumApprovals: number
    passwordHash: string
  }
  const createWallet = async ({
    name,
    signers,
    minimumApprovals,
    passwordHash,
  }: CreateWalletParams) => {
    const providerSigner = await blockchainStore.provider!.getSigner()
    const walletAddr = await walletService.createWallet(providerSigner, {
      name,
      signers,
      minimumApprovals,
      passwordHash,
    })
    return walletAddr
  }

  interface DepositWalletParams {
    token: EthereumAddress
    value: BigNumber
  }
  const depositWallet = async (
    walletAddr: EthereumAddress,
    { token, value }: DepositWalletParams,
  ) => {
    const providerSigner = await blockchainStore.provider!.getSigner()
    await tokenService.approve(providerSigner, token, { spender: walletAddr, value })
    await walletService.deposit(providerSigner, walletAddr, { token, value })
  }

  const navigateToWalletShow = async (walletAddr: EthereumAddress) => {
    router.push({ name: 'wallet.show', params: { walletAddr } })
    await findWallet(walletAddr)
  }

  const navigateToWalletDeposit = (walletAddr: EthereumAddress) => {
    router.push({ name: 'wallet.deposit', params: { walletAddr } })
  }

  const navigateToWalletCreate = () => {
    router.push({ name: 'wallet.create' })
  }

  return {
    // ============================== State variables ==============================
    wallet,
    wallets,
    // ================================== Methods ==================================
    fetchWallets,
    findWallet,
    createWallet,
    depositWallet,
    navigateToWalletShow,
    navigateToWalletDeposit,
    navigateToWalletCreate,
  }
}
