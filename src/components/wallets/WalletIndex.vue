<template>
  <section class="flex flex-col gap-y-4 text-slate-700">
    <!-- Header section with title and create wallet button -->
    <header class="inline-flex items-center justify-between bg-slate-300 px-4 pt-4 md:px-4">
      <h2 class="text-lg font-bold">Wallets</h2>
      <button class="cursor-pointer" @click="navigateToWalletCreate()">
        <FontAwesomeIcon :icon="faPlus" class="text-xl" />
      </button>
    </header>

    <!-- Main section for wallet management -->
    <main class="flex flex-col gap-y-4 bg-slate-300">
      <!-- Input field for wallet address -->
      <TextFieldC
        class="px-2"
        name="keyword"
        placeholder="Wallet Address (0x...)"
        v-model="walletStore.keyword"
        @onKeyupEnter="async () => await search()"
      />

      <!-- Message displayed when no wallets are found -->
      <div
        v-if="walletStore.wallets.length === 0 && !isLoading"
        class="flex items-center justify-center"
      >
        <span class="text-lg font-semibold">No Wallet(s) Found.</span>
      </div>

      <!-- List of wallet items -->
      <ul v-show="walletStore.wallets.length > 0" class="flex flex-col gap-y-4">
        <!-- Loop through and display all wallets -->
        <WalletListItemC
          v-for="(wallet, index) in walletStore.wallets"
          :key="index"
          :wallet="wallet"
          :isSelected="walletStore.selectedWallet?.address === wallet.address"
          v-show="
            walletStore.selectedWallet === undefined ||
            walletStore.selectedWallet.address === wallet.address
          "
          @onClick="() => toggleSelectWallet(wallet)"
        />
      </ul>

      <!-- Pagination controls -->
      <div v-if="!walletStore.selectedWallet" class="flex items-center justify-end gap-x-2 px-4">
        <span class="mr-auto text-sm font-semibold">Page: {{ walletStore.currentPage }}</span>
        <PaginationButtonC
          :direction="PaginationButtonDirection.Prev"
          :disabled="walletStore.currentPage === 1"
          @onClick="() => navigateToPage(walletStore.currentPage - 1)"
        />
        <PaginationButtonC
          :direction="PaginationButtonDirection.Next"
          :disabled="walletStore.wallets.length === 0"
          @onClick="() => navigateToPage(walletStore.currentPage + 1)"
        />
      </div>
    </main>
  </section>
</template>

<script setup lang="ts">
import { defineComponent, onMounted } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faSquareCaretLeft,
  faSquareCaretRight,
  faDollarSign,
  faPlus,
  faUser,
} from '@fortawesome/free-solid-svg-icons'
import { useWalletInteraction } from '@/composables/wallets/walletInteraction.composable'
import { useRouter } from 'vue-router'
import TextFieldC from '../TextFieldC.vue'
import WalletListItemC from './WalletListItemC.vue'
import PaginationButtonC from '../PaginationButtonC.vue'
import { helpers } from '@vuelidate/validators'
import { validateAndToast } from '@/helpers/validator.helpers'
import useVuelidate from '@vuelidate/core'
import { isEmpty, isEthAddr, isInstanceOf } from '@/utils/boolean.utils'
import { showToast } from '@/helpers/toast.helpers'
import { useWalletStore } from '@/stores/wallet.store'
import { ToastType } from '@/enums/toast.enums'
import type { Wallet } from '@/interfaces/wallet.interfaces'
import { PaginationButtonDirection } from '@/enums/component.enums'
import { useAppUI } from '@/composables/appUI.composable'
import { storeToRefs } from 'pinia'
import { useNavigation } from '@/composables/wallets/walletNavigator.composable'
library.add(faSquareCaretLeft, faSquareCaretRight, faDollarSign, faPlus, faUser)

defineComponent({
  name: 'WalletIndex',
})

const emit = defineEmits(['onWalletSelected', 'onWalletDeselected'])

const router = useRouter()

const walletStore = useWalletStore()
const { fillWalletStoreFromRoute, fetchPaginatedWallets, fetchWalletByAddr } =
  useWalletInteraction()
const { navigateToWalletCreate } = useNavigation()
const { isLoading, withLoading } = useAppUI()

onMounted(async () => {
  withLoading(async () => await fillWalletStoreFromRoute())
})

const v$ = useVuelidate(
  {
    keyword: {
      validAddrIf: helpers.withMessage(
        'Wallet address is not valid.',
        (addr: string) => isEmpty(addr) || isEthAddr(addr),
      ),
    },
  },
  { keyword: storeToRefs(walletStore).keyword },
)

function onWalletSelected(wallet: Wallet) {
  emit('onWalletSelected', wallet)
}

function onWalletDeselected() {
  withLoading(async () => await fetchPaginatedWallets(walletStore.currentPage))
  walletStore.keyword = undefined
  emit('onWalletDeselected')
}

async function navigateToPage(page: number): Promise<void> {
  walletStore.currentPage = page
  walletStore.selectedWallet = undefined
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
  router.replace({ query: { page } })
  fetchPaginatedWallets(page)
}

/**
 * Toggles the selection of a given wallet.
 *
 * If the given wallet is undefined, or if the given wallet is different from the currently selected wallet,
 * the given wallet is selected. Otherwise, the currently selected wallet is deselected.
 * @param {Wallet} [wallet] - The wallet to toggle selection on.
 */
function toggleSelectWallet(wallet?: Wallet): void {
  // Toggles the selection of a given wallet.
  // If the given wallet is undefined, or if the given wallet is different from the currently selected wallet,
  // the given wallet is selected. Otherwise, the currently selected wallet is deselected.
  if (walletStore.selectedWallet && wallet) {
    // If the given wallet is the same as the currently selected wallet, toggle to not selected.
    if (walletStore.selectedWallet.address === wallet.address)
      walletStore.selectedWallet = undefined
    // Otherwise, select the given wallet.
    else walletStore.selectedWallet = wallet
  } else {
    // If the given wallet is undefined, or if the given wallet is different from the currently selected wallet,
    // select the given wallet.
    walletStore.selectedWallet = wallet
  }

  // If the wallet is selected, emit the onWalletSelected event.
  // Otherwise, emit the onWalletDeselected event and fetch the wallets for the current page.
  const selectedWallet = walletStore.selectedWallet
  const isWalletSelected = selectedWallet !== undefined
  if (isWalletSelected) {
    // Emit the onWalletSelected event.
    onWalletSelected(selectedWallet)
  } else {
    // Emit the onWalletDeselected event and fetch the wallets for the current page.
    onWalletDeselected()
  }
}

/**
 * Performs a search for a wallet by its address.
 *
 * If the user enters an empty string, the currently selected wallet is deselected and the wallets for the current page are refetched.
 * If the user enters a valid Ethereum address, the wallet with the given address is fetched and selected.
 * If the user enters an invalid Ethereum address, an error message is displayed and the function returns.
 */
async function search(): Promise<void> {
  if (!(await validateAndToast(v$))) return

  withLoading(async () => {
    if (isEmpty(walletStore.keyword)) {
      await fetchPaginatedWallets(walletStore.currentPage)
      walletStore.selectedWallet = undefined
      onWalletDeselected()
      return
    }

    try {
      const walletAddr = walletStore.keyword as string
      const wallet = await fetchWalletByAddr(walletAddr)
      walletStore.selectedWallet = wallet
      onWalletSelected(walletStore.selectedWallet as Wallet)
    } catch (error) {
      if (isInstanceOf(error, Error)) showToast(ToastType.Error, error.message)

      throw Error
    }
  })
}
</script>
