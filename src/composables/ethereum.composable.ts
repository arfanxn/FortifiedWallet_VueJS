import { useEthereumStore } from '@/stores/ethereum.store'
import * as ethereumService from '@/services/ethereum.service'
import { markRaw } from 'vue'
import { ethers } from 'ethers'
import { storeToRefs } from 'pinia'

export function useEthereum() {
  const ethereumStore = useEthereumStore()
  const { isConnected } = storeToRefs(ethereumStore)

  const connect = async (): Promise<void> => {
    ethereumStore.provider = markRaw(await ethereumService.connect())
    ethereumStore.accounts = await ethereumService.getAccounts(
      ethereumStore.provider as ethers.BrowserProvider,
    )

    ethereumStore.persistState()
  }

  /**
   * Disconnects from the Ethereum provider and clears the connected accounts.
   *
   * @returns {Promise<void>}
   * @throws {Error}
   */
  const disconnect = async (): Promise<void> => {
    await ethereumStore.provider?.removeAllListeners()
    await window.ethereum?.removeAllListeners?.()
    ethereumStore.provider = null
    ethereumStore.accounts = []

    ethereumStore.persistState()
  }

  return {
    // ============================== State variables ==============================
    isConnected,
    // ================================== Methods ==================================
    connect,
    disconnect,
  }
}
