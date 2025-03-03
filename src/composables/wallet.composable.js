import { storeToRefs } from "pinia";
import { useBlockchainStore } from "@/stores/blockchain.store";
import { useWalletStore } from "@/stores/wallet.store";
import * as walletService from "@/services/wallet.service.js";
import * as tokenService from "@/services/token.service.js";
import { WalletDoesNotExistError } from "@/errors/wallet.errors";
import { useRouter } from "vue-router";

export function useWallet() {
  const router = useRouter()
  const blockchainStore = useBlockchainStore()
  const walletStore = useWalletStore()
  const { wallet, wallets } = storeToRefs(walletStore)

  const tupleToWallet = (tuple) => {
    return {
      name: tuple[0],
      address: tuple[1],
      signers: tuple[2],
      minimumApprovals: tuple[3],
      totalBalanceInUsd: tuple[4] // Assuming USD is 18 decimals
    };
  }

  const fetchWallets = async (page = 1) => {
    page = parseInt(page)
    const limit = 5;
    const offset = (page - 1) * limit;
    const provider = blockchainStore.provider
    const signerAddr = blockchainStore.activeAccount
    const tuples = await walletService.getNewestWalletsBySigner(provider, { signerAddr, offset, limit })
    walletStore.wallets = tuples.map(tupleToWallet)
    return walletStore.wallets
  }

  const findWallet = async (walletAddr) => {
    try {
      const provider = blockchainStore.provider
      const tuple = await walletService.getWallet(provider, { walletAddr })
      const wallet = tupleToWallet(tuple)
      walletStore.wallet = wallet
      return wallet
    } catch {
      throw new WalletDoesNotExistError()
    }
  }

  const createWallet = async ({ name, signers, minimumApprovals, passwordHash }) => {
    const providerSigner = await blockchainStore.provider.getSigner()
    const walletAddr = await walletService.createWallet(providerSigner, { name, signers, minimumApprovals, passwordHash })
    return walletAddr
  }

  const depositWallet = async (walletAddr, { token, value }) => {
    const providerSigner = await blockchainStore.provider.getSigner()
    await tokenService.approve(providerSigner, token, { spender: walletAddr, value })
    await walletService.deposit(providerSigner, walletAddr, { token, value })
  }

  const navigateToWalletShow = async (walletAddr) => {
    router.push({ name: 'wallet.show', params: { walletAddr } })
    await findWallet(walletAddr)
  }

  const navigateToWalletDeposit = (walletAddr) => {
    router.push({ 'name': 'wallet.deposit', params: { walletAddr } })
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
