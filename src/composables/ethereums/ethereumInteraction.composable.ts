import { useEthereumStore } from '@/stores/ethereum.store'
import * as ethereumService from '@/services/ethereum.service'
import { markRaw, ref } from 'vue'
import { ethers } from 'ethers'
import { storeToRefs } from 'pinia'
import { useNavigation } from '../wallets/walletNavigator.composable'
import { showToast } from '@/helpers/toast.helpers'
import { ToastType } from '@/enums/toast.enums'

const hasListened = ref<boolean>(false)

export function useEthereumInteraction() {
  const ethereumStore = useEthereumStore()
  const { navigateToConnect } = useNavigation()
  const { isConnected } = storeToRefs(ethereumStore)

  const connect = async (): Promise<void> => {
    ethereumStore.provider = markRaw(await ethereumService.connect())
    ethereumStore.accounts = await ethereumService.getAccounts(
      ethereumStore.provider as ethers.BrowserProvider,
    )

    ethereumStore.persistState()

    if (hasListened.value === false) {
      ethereumService.listenAccountsChanged(async (accounts: string[]) => {
        console.log('this executed')
        await disconnect()
        navigateToConnect()
        showToast(ToastType.Info, 'Accounts changed, please reconnect.', 5 * 1000)
      })

      hasListened.value = true
    }
  }

  /**
   * Disconnects from the Ethereum provider and clears the connected accounts.
   *
   * @returns {Promise<void>}
   * @throws {Error}
   */
  const disconnect = async (): Promise<void> => {
    if (hasListened.value) {
      await ethereumService.removeAllListeners(ethereumStore.provider as ethers.BrowserProvider)
      hasListened.value = false
    }
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
