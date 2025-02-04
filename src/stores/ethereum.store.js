// stores/ethers.ts
import { defineStore } from 'pinia';
import { ethereumService } from '@/services/ethereum.service.js';
import _ from 'lodash';

export const useEthereumStore = defineStore('ethereum', {
  /**
   * State of the Ethers store.
   *
   * @property {string|null} activeAccount - The currently active Ethereum account.
   * @property {string[]} accounts - An array of all Ethereum accounts.
   * @property {Error|null} error - An error Object if connecting to MetaMask failed.
   * @property {boolean} isConnected - Whether MetaMask is connected.
   */
  state: () => ({
    activeAccount: null,
    accounts: [],
    error: null,
    isConnected: JSON.parse(localStorage.getItem('ethereum'))?.isConnected || false,
  }),

  getters: {
    /**
     * The error message to display to the user if connecting to MetaMask failed.
     * Capitalizes the first letter of the error message.
     *
     * @type {string|null}
     */
    errorMessage() {
      return this.error ? _(this.error.shortMessage || this.error.message || 'Unkown error.').capitalize() : null;
    }
  },

  actions: {
    /**
     * Connects to MetaMask and initializes the store with the connected
     * accounts.
     *
     * If MetaMask is not installed, it will throw an error with a message
     * that can be used to display an error to the user.
     *
     * @throws {Error} - If connecting to MetaMask failed.
     */
    async connect() {
      try {
        this.accounts = await ethereumService.connect()
        this.activeAccount = this.accounts[0]
        this.isConnected = true

        // Listen for account changes
        ethereumService.onAccountsChanged((_accounts) => {
          this.$patch({
            activeAccount: _accounts[0] || null,
            accounts: _accounts,
            isConnected: _accounts.length > 0
          })

          this._persist();
        })

      } catch (error) {
        this.error = error
        this.isConnected = false
        throw error
      }

      this._persist();
    },

    /**
     * Disconnects from MetaMask and resets the store to its initial state.
     */
    async disconnect() {
      await ethereumService.disconnect()
      this.activeAccount = null
      this.accounts = []
      this.isConnected = false
      this._persist();
    },

    _persist() {
      localStorage.setItem('ethereum', JSON.stringify({ isConnected: this.isConnected }))
    }
  },
});
