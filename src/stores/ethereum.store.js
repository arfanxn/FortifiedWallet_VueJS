// stores/ethers.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia';
import { ethereumService } from '@/services/ethereum.service.js';

export const useEthereumStore = defineStore('ethereum', () => {
  // ==========================================================================
  //                                Constants
  // ==========================================================================
  const stateKey = 'ethereum'


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
  function persistState() {
    const state = { accounts: accounts.value }
    localStorage.setItem(stateKey, JSON.stringify(state))
  }
  /**
   * Retrieves the current state from the local storage.
   *
   * The current state is retrieved from the 'ethereum' key in the local storage.
   *
   * @returns {Object | null} The current state in JSON format, or null if not found.
   */
  function restoreState() {
    const stateString = localStorage.getItem(stateKey)
    const state = stateString ? JSON.parse(stateString) : null
    accounts.value = state.accounts
  }

  // ==========================================================================
  //                                States
  // ==========================================================================
  const accounts = ref([])


  // ==========================================================================
  //                                Getters
  // ==========================================================================
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
  const connect = async () => {
    accounts.value = await ethereumService.connect()
    persistState()
  }
  /**
   * Disconnects from the Ethereum provider and clears the connected accounts.
   *
   * @returns {Promise<void>}
   * @throws {Error}
   */
  const disconnect = async () => {
    await ethereumService.disconnect()
    accounts.value = []
    persistState()
  }

  // ==========================================================================
  //                                  Initializations
  // ==========================================================================
  restoreState()

  // ==========================================================================
  //                                Returns the store
  // ==========================================================================
  return {
    accounts,
    isConnected,
    activeAccount,
    connect,
    disconnect
  }
})

