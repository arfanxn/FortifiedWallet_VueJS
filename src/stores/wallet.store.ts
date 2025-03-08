import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Wallet } from '@/interfaces/wallet.interfaces'
import { isString } from '@/utils/boolean.utils'

export const useWalletStore = defineStore('wallet', () => {
  // ==========================================================================
  //                            Internal functions
  // ==========================================================================
  //

  // ==========================================================================
  //                                State
  // ==========================================================================
  const wallets = ref<Wallet[]>([])
  const selectedWallet = ref<Wallet | undefined>()
  const currentPage = ref<number>(1)
  const keyword = ref<string | undefined>()

  // ==========================================================================
  //                                Getters
  // ==========================================================================
  //

  // ==========================================================================
  //                                Actions
  // ==========================================================================
  /**
   * Selects a wallet in the `wallets` array by its address or the whole object.
   * @param {string | Wallet} [wallet] - The Ethereum address of the wallet to select, or the whole wallet object.
   *                                      If not provided, the selected wallet will be reset.
   * @returns {boolean} true if the wallet was found and selected, false otherwise.
   */
  const selectWallet = (wallet?: string | Wallet): boolean => {
    if (isString(wallet)) {
      const walletToSelect = findWallet(wallet)
      if (walletToSelect) selectedWallet.value = walletToSelect
    } else if (wallet) {
      selectedWallet.value = wallet
    } else {
      selectedWallet.value = undefined
    }
    const isSelected = selectedWallet.value !== undefined
    return isSelected
  }

  /**
   * Finds a wallet in the `wallets` array by its address.
   * @param {string} walletAddr - The Ethereum address of the wallet to find.
   * @returns {Wallet | undefined} The wallet if found, undefined otherwise.
   */
  const findWallet = (walletAddr: string): Wallet | undefined => {
    return wallets.value.find((w) => w.address === walletAddr)
  }

  // ==========================================================================
  //                              Initializations
  // ==========================================================================
  //

  return {
    // ============================== State variables ==============================
    wallets,
    selectedWallet,
    currentPage,
    keyword,
    // ================================= Methods ===================================
    selectWallet,
    findWallet,
  }
})
