<template>
  <section class="flex flex-col gap-y-4 text-slate-700">
    <!-- Header section with title and create wallet button -->
    <header class="inline-flex items-center justify-between bg-slate-300 px-4 pt-4 md:px-4">
      <h2 class="text-lg font-bold">Wallets</h2>
      <router-link class="cursor-pointer" :to="{ name: RouteName.WalletCreate }">
        <FontAwesomeIcon :icon="faPlus" class="text-xl" />
      </router-link>
    </header>

    <!-- Main section for wallet management -->
    <main class="flex flex-col gap-y-4 bg-slate-300">
      <!-- Input field for wallet address -->
      <TextFieldC
        class="px-2"
        name="keyword"
        placeholder="Wallet Address (0x...)"
        v-model="keyword"
        @onKeyupEnter="(event) => handleFindSubmission()"
      />

      <!-- Message displayed when no wallets are found -->
      <div
        v-if="wallets.length === 0 && !isLoading && ethereumStore.isConnected"
        class="flex items-center justify-center"
      >
        <span class="text-lg font-semibold">No Wallet(s) Found.</span>
      </div>

      <!-- List of wallet items -->
      <ul v-show="wallets.length > 0" class="flex flex-col gap-y-4">
        <!-- Loop through and display all wallets -->
        <WalletListItemC
          v-for="(wallet, index) in wallets"
          :key="index"
          :wallet="wallet"
          :isSelected="selectedWallet?.address === wallet.address"
          v-show="selectedWallet === undefined || selectedWallet.address === wallet.address"
          @onClick="() => handleWalletSelection(wallet)"
        />
      </ul>

      <!-- Pagination controls -->
      <div v-if="!selectedWallet" class="flex items-center justify-end gap-x-2 px-4">
        <span class="mr-auto text-sm font-semibold">Page: {{ currentPage }}</span>
        <PaginationButtonC
          :direction="PaginationButtonDirection.Prev"
          :disabled="currentPage === 1"
          @onClick="() => onPaginate(currentPage - 1)"
        />
        <PaginationButtonC
          :direction="PaginationButtonDirection.Next"
          :disabled="wallets.length === 0"
          @onClick="() => onPaginate(currentPage + 1)"
        />
      </div>
    </main>
  </section>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue'
import { string } from 'yup'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faSquareCaretLeft,
  faSquareCaretRight,
  faDollarSign,
  faPlus,
  faUser,
} from '@fortawesome/free-solid-svg-icons'
import TextFieldC from '../TextFieldC.vue'
import WalletListItemC from './WalletListItemC.vue'
import PaginationButtonC from '../PaginationButtonC.vue'
import type { Wallet } from '@/interfaces/wallet.interfaces'
import { PaginationButtonDirection } from '@/enums/component.enums'
import { RouteName } from '@/enums/route.enums'
import { isEmpty, isEthAddr, isInstanceOf } from '@/utils/boolean.utils'
import { showToast } from '@/helpers/toast.helpers'
import { ToastType } from '@/enums/toast.enums'
import { useAppUI } from '@/composables/appUI.composable'
import { useEthereumStore } from '@/stores/ethereum.store'
library.add(faSquareCaretLeft, faSquareCaretRight, faDollarSign, faPlus, faUser)

defineComponent({
  name: 'WalletIndex',
})

const emit = defineEmits(['onSelect', 'onDeselect', 'onPaginate', 'onFind'])

const ethereumStore = useEthereumStore()
const { isLoading } = useAppUI()

const keyword = defineModel<string | undefined>('keyword', { required: true })
const currentPage = defineModel<number>('currentPage', { required: true })
const selectedWallet = defineModel<Wallet | undefined>('selectedWallet', { required: true })
const props = defineProps<{ wallets: Wallet[] }>()

const keywordSchema = string()
  .optional()
  .test('ethereum-address', 'Invalid ethereum address.', (value) => !value || isEthAddr(value))

function onSelect(wallet: Wallet) {
  selectedWallet.value = wallet
  emit('onSelect', wallet)
}

function onDeselect() {
  selectedWallet.value = undefined
  emit('onDeselect')
}

function onPaginate(page: number) {
  currentPage.value = page
  emit('onPaginate', page)
}

function onFind(keyword: string | undefined) {
  emit('onFind', keyword)
}

/**
 * Handles the selection of a wallet.
 *
 * If a wallet is provided and the currently selected wallet is different, it selects the new wallet.
 * If no wallet is provided, or the provided wallet is the same as the currently selected one, it deselects the wallet.
 *
 * @param {Wallet} [wallet] - The wallet to select or deselect.
 */
function handleWalletSelection(wallet?: Wallet): void {
  if (selectedWallet.value)
    if (wallet && selectedWallet.value.address !== wallet.address) onSelect(wallet)
    else onDeselect()
  else if (wallet) onSelect(wallet)
  else onDeselect()
}

async function handleFindSubmission() {
  try {
    keywordSchema.validateSync(keyword.value)

    if (isEmpty(keyword.value)) onPaginate(currentPage.value)
    else onFind(keyword.value)
  } catch (error) {
    if (isInstanceOf(error, Error)) showToast(ToastType.Error, error.message)
    else throw Error
  }
}
</script>
