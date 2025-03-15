<template>
  <section class="flex flex-col gap-y-4 bg-slate-300 text-slate-700">
    <header class="inline-flex items-center justify-between px-4 pt-4 md:px-4">
      <h2 class="text-lg font-bold">Transactions</h2>
    </header>

    <form class="inline-flex px-4 md:gap-x-2" @submit.prevent>
      <TextFieldC
        @onKeyupEnter="() => handleFindSubmission()"
        v-model="transactionStore.keyword"
        class="grow"
        name="transaction_hash"
        placeholder="Transaction hash (0x1234...)"
      />
      <ButtonC
        @onClick="() => handleFindSubmission()"
        type="button"
        text="Find"
        class="rounded-lg outline-0!"
      />
    </form>

    <!-- Message displayed when no wallets are found -->
    <div
      v-if="transactionStore.transactions.length === 0 && !isLoading && ethereumStore.isConnected"
      class="flex items-center justify-center"
    >
      <span class="text-lg font-semibold">No Transaction(s) Found.</span>
    </div>

    <ul
      v-if="walletStore.selectedWallet && transactionStore.transactions.length > 0 && !isLoading"
      class="flex flex-col items-start gap-y-4 font-medium"
    >
      <TransactionListItem
        v-for="(transaction, index) in transactionStore.transactions"
        :key="index"
        :wallet="walletStore.selectedWallet!"
        :transaction="transaction"
        :isHovered="hoveredTransactionIndex === index"
        @mouseenter="hoveredTransactionIndex = index"
        @mouseleave="hoveredTransactionIndex = null"
      />
    </ul>

    <!-- Pagination controls -->
    <div
      v-if="!transactionStore.selectedTransaction"
      class="flex items-center justify-end gap-x-2 px-4"
    >
      <span class="mr-4 text-sm font-semibold">Page: {{ transactionStore.currentPage }}</span>
      <PaginationButtonC
        direction="prev"
        :disabled="transactionStore.currentPage === 1"
        @onClick="() => handlePaginate(transactionStore.currentPage - 1)"
      />
      <PaginationButtonC
        direction="next"
        :disabled="transactionStore.transactions.length === 0"
        @onClick="() => handlePaginate(transactionStore.currentPage + 1)"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue'
import { string } from 'yup'
import { isEthHash } from '@/utils/booleanUtils'
import { library } from '@fortawesome/fontawesome-svg-core'
import { useAppUI } from '@/composables/useAppUI'
import { useTransactionStore } from '@/stores/useTransactionStore'
import { useWalletStore } from '@/stores/useWalletStore'
import ButtonC from '@/components/ButtonC.vue'
import TextFieldC from '@/components/TextFieldC.vue'
import TransactionListItem from '@/components/transactions/TransactionListItem.vue'
import PaginationButtonC from '@/components/PaginationButtonC.vue'
import { showToast } from '@/helpers/toastHelpers'
import { ToastType } from '@/enums/toastEnums'
import {
  faArrowRightArrowLeft,
  faArrowRightLong,
  faCalendar,
  faCoins,
  faDollarSign,
  faHashtag,
  faMinus,
} from '@fortawesome/free-solid-svg-icons'
import { useEthereumStore } from '@/stores/useEthereumStore'
import { useTransactionNavigator } from '@/composables/transactions/useTransactionNavigator'

library.add(
  faArrowRightLong,
  faCoins,
  faHashtag,
  faMinus,
  faDollarSign,
  faArrowRightArrowLeft,
  faCalendar,
)

defineComponent({
  name: 'WalletShow',
})

const ethereumStore = useEthereumStore()
const walletStore = useWalletStore()
const transactionStore = useTransactionStore()
const { isLoading, startLoading, stopLoading } = useAppUI()
const { navigateToTransactionIndex } = useTransactionNavigator()
const hoveredTransactionIndex = ref<Number | null>(null)

const keywordSchema = string()
  .optional()
  .test(
    'length',
    'Transaction hash must be 66 characters.',
    (value) => !value || value.length === 66,
  )
  .test('ethereum-hash', 'Transaction hash is invalid.', (value) => !value || isEthHash(value))

onMounted(() => {
  //
})

onUnmounted(() => {
  transactionStore.reset()
})

async function handlePaginate(page: number) {
  transactionStore.currentPage = page
  navigateToTransactionIndex()
}

async function handleFindSubmission() {
  try {
    startLoading()

    keywordSchema.validateSync(transactionStore.keyword)

    if (transactionStore.keyword) {
      navigateToTransactionIndex({ transactionHash: transactionStore.keyword })
    } else {
      navigateToTransactionIndex()
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Transaction does not exist.'
    showToast(ToastType.Error, message)
  } finally {
    stopLoading()
  }
}
</script>
