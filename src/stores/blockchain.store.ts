// stores/ethers.ts
import { ref, computed, markRaw } from 'vue'
import { defineStore } from 'pinia'
import { connect as connectProvider, getAccounts } from '@/services/blockchain.service'
import { ethers } from 'ethers'
import { EthereumAddress } from '@/interfaces/ethereum.interfaces'
import { computedAsync } from '@vueuse/core'

export const useBlockchainStore = defineStore('blockchain', () => {
  // ==========================================================================
  //                                Constants
  // ==========================================================================
  const localStorageKey = 'blockchain'

  // ==========================================================================
  //                                Internal functions
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
   * Connects to the Ethereum provider and retrieves the connected accounts.
   *
   * Also, it stores the connected accounts in the local storage.
   *
   * @returns {Promise<void>}
   * @throws {Error}
   */
  const connect = async (): Promise<void> => {
    provider.value = markRaw(await connectProvider())
    accounts.value = await getAccounts(provider.value as ethers.BrowserProvider)

    persistState()
  }
  /**
   * Disconnects from the Ethereum provider and clears the connected accounts.
   *
   * @returns {Promise<void>}
   * @throws {Error}
   */
  const disconnect = async (): Promise<void> => {
    await provider?.value?.removeAllListeners()
    await window.ethereum?.removeAllListeners?.()
    provider.value = null
    accounts.value = []
    persistState()
  }

  // ==========================================================================
  //                               Initializations
  // ==========================================================================
  restoreState()

  // ==========================================================================
  //                                Returns the store
  // ==========================================================================
  return {
    provider,
    accounts,
    isConnected,
    activeAccount,
    connect,
    disconnect,
  }
})
