import { storeToRefs } from "pinia";
import { useBlockchainStore } from "@/stores/blockchain.store";
import { useWalletStore } from "@/stores/wallet.store";
import * as walletService from "@/services/wallet.service.js";
import * as tokenService from "@/services/token.service.js";

export function useWallet() {
  const blockchainStore = useBlockchainStore()
  const walletStore = useWalletStore()
  const { wallets } = storeToRefs(walletStore)

  const tupleToWallet = (tuple) => {
    return {
      name: tuple[0],
      address: tuple[1],
      signers: tuple[2],
      minimumApprovals: tuple[3],
      totalBalanceInUsd: tuple[4] // Assuming USD is 18 decimals
    };
  }

  const fetchWallets = async () => {
    const provider = blockchainStore.provider
    const signerAddress = blockchainStore.activeAccount
    const tuples = await walletService.fetchWalletsBySigner(provider, signerAddress, { offset: 0, limit: 10 })
    walletStore.wallets = tuples.map(tupleToWallet)
  }

  const createWallet = async ({ name, signers, minimumApprovals, passwordHash }) => {
    const providerSigner = await blockchainStore.provider.getSigner()
    await walletService.createWallet(providerSigner, { name, signers, minimumApprovals, passwordHash })
  }

  const depositWallet = async (walletAddr, { token, value }) => {
    const providerSigner = await blockchainStore.provider.getSigner()
    await tokenService.approve(providerSigner, token, { spender: walletAddr, value })
    await walletService.deposit(providerSigner, walletAddr, { token, value })
  }

  return {
    // ============================== State variables ==============================
    wallets,
    // ================================== Methods ==================================
    fetchWallets,
    createWallet,
    depositWallet,
  }
}
