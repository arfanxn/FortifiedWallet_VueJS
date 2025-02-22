// stores/ethers.ts
import { ref, computed, markRaw, } from 'vue'
import { defineStore } from 'pinia';
import { connect as connectProvider, getAccounts } from '@/services/blockchain.service';

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
  function persistState() {
    const state = {
      accounts: accounts.value
    }
    localStorage.setItem(localStorageKey, JSON.stringify(state))
  }
  /**
   * Retrieves the current state from the local storage.
   *
   * The current state is retrieved from the 'ethereum' key in the local storage.
   *
   * @returns {Object | null} The current state in JSON format, or null if not found.
   */
  function restoreState() {
    const stateString = localStorage.getItem(localStorageKey)
    if (stateString == null) return
    const state = JSON.parse(stateString)
    if (state == null) return
    accounts.value = state.accounts
  }

  // ==========================================================================
  //                                States
  // ==========================================================================
  const provider = ref({})
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
    provider.value = markRaw(await connectProvider())
    accounts.value = await getAccounts(provider.value)

    persistState()
  }
  /**
   * Disconnects from the Ethereum provider and clears the connected accounts.
   *
   * @returns {Promise<void>}
   * @throws {Error}
   */
  const disconnect = async () => {
    await provider.value.removeAllListeners()
    await window.ethereum.removeAllListeners()
    provider.value = {}
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
    disconnect
  }
})

