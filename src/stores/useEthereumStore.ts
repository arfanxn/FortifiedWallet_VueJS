// stores/ethers.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { ethers } from 'ethers'
import { EthereumAddress } from '@/interfaces/ethereumInterfaces'

export const useEthereumStore = defineStore('ethereum', () => {
  // ==========================================================================
  //                                Constants
  // ==========================================================================
  const localStorageKey = 'ethereum'

  // ==========================================================================
  //                                Internal functions
  // ==========================================================================
  //

  // ==========================================================================
  //                                States
  // ==========================================================================
  const provider = ref<ethers.BrowserProvider | null>(null)
  const accounts = ref<EthereumAddress[]>([])

  // ==========================================================================
  //                                Getters
  // ==========================================================================
  // TODO: implement a live active account getter (if the user changed the account, the active account also changed)
  const activeAccount = computed(() => accounts.value[0])
  const isConnected = computed(() => accounts.value.length > 0)

  // ==========================================================================
  //                                Actions
  // ==========================================================================

  /**
   * Stores the current state in the local storage.
   *
   * The current state is stored in the 'ethereum' key in the local storage.
   *
   * @returns {void}
   */
  function persistState(): void {
    const state = {
      accounts: accounts.value,
    }
    localStorage.setItem(localStorageKey, JSON.stringify(state))
  }

  function restoreState(): void {
    const stateString = localStorage.getItem(localStorageKey)
    if (stateString == null) return
    const state = JSON.parse(stateString)
    if (state == null) return
    accounts.value = state.accounts
  }

  // ==========================================================================
  //                               Initializations
  // ==========================================================================
  restoreState()

  // ==========================================================================
  //                                Returns the store
  // ==========================================================================
  return {
    // ================================= Variables ================================
    provider,
    accounts,
    isConnected,
    activeAccount,
    // ================================== Methods ==================================
    persistState,
    restoreState,
  }
})
