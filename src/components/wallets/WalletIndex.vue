<template>
  <section class="flex flex-col text-slate-700">
    <!-- Header section with title and create wallet button -->
    <header class="inline-flex items-center justify-between bg-slate-300 px-4 py-4 md:px-4">
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
        name="walletAddr"
        placeholder="Wallet Address (0x...)"
        v-model="form.walletAddr"
        @onKeyupEnter="textFieldOnKeyupEnter"
      />

      <!-- Message displayed when no wallets are found -->
      <div
        v-if="walletStore.wallets.length === 0 && walletStore.wallet === null"
        class="flex items-center justify-center"
      >
        <span class="text-lg font-semibold">No Wallet(s) Found.</span>
      </div>

      <!-- List of wallet items -->
      <ul
        v-show="walletStore.wallets.length > 0 || walletStore.wallet !== null"
        class="flex flex-col gap-y-4"
      >
        <!-- Single wallet item if a specific wallet is selected -->
        <WalletListItemC
          v-if="walletStore.wallet !== null"
          :wallet="walletStore.wallet"
          @onItemClick="
            () =>
              isItemClicked
                ? onItemUnclick(walletStore.wallet as Wallet)
                : onItemClick(walletStore.wallet as Wallet)
          "
        />

        <!-- Loop through and display all wallets -->
        <WalletListItemC
          v-for="(wallet, index) in walletStore.wallets"
          :key="index"
          v-show="walletStore.wallet === null"
          :wallet="wallet"
          @onItemClick="onItemClick"
        />
      </ul>

      <!-- Pagination controls -->
      <div
        v-if="empty(route.params?.walletAddr)"
        class="flex items-center justify-end gap-x-2 px-4"
      >
        <span class="mr-auto text-sm font-semibold">Page: {{ page }}</span>
        <PaginationButtonC
          :direction="PaginationButtonDirection.Prev"
          :disabled="page === 1"
          @onClick="() => navigateToPage(page - 1)"
        />
        <PaginationButtonC
          :direction="PaginationButtonDirection.Next"
          :disabled="walletStore.wallets.length === 0"
          @onClick="() => navigateToPage(page + 1)"
        />
      </div>
    </main>
  </section>
</template>

<script setup lang="ts">
import { defineComponent, defineEmits, onMounted, reactive, ref, watch } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faSquareCaretLeft,
  faSquareCaretRight,
  faDollarSign,
  faPlus,
  faUser,
} from '@fortawesome/free-solid-svg-icons'
import { useWallet } from '@/composables/wallet.composable'
import { useRouter, useRoute } from 'vue-router'
import TextFieldC from '../TextFieldC.vue'
import WalletListItemC from './WalletListItemC.vue'
import PaginationButtonC from '../PaginationButtonC.vue'
import { helpers } from '@vuelidate/validators'
import { isValidAddr, validateAndToast } from '@/helpers/validator.helpers'
import useVuelidate from '@vuelidate/core'
import { empty, notEmpty } from '@/utils/string.utils'
import { WalletDoesNotExistError } from '@/errors/wallet.errors'
import { showToast } from '@/helpers/toast.helpers'
import { toBase10Number } from '@/utils/number.utils'
import { useWalletStore } from '@/stores/wallet.store'
import { ToastType } from '@/enums/toast.enums'
import type { StringOrNull } from '@/interfaces/interfaces'
import type { EthereumAddress } from '@/interfaces/ethereum.interfaces'
import type { Wallet } from '@/interfaces/wallet.interfaces'
import { PaginationButtonDirection } from '@/enums/component.enums'
library.add(faSquareCaretLeft, faSquareCaretRight, faDollarSign, faPlus, faUser)

const route = useRoute()
const router = useRouter()

const { fetchWallets, findWallet } = useWallet()
const walletStore = useWalletStore()

defineComponent({
  name: 'WalletIndex',
})

onMounted(async () => {
  // Initialize form with wallet address from route params
  form.walletAddr = route.params?.walletAddr as StringOrNull
  // Set item clicked state based on wallet existence
  isItemClicked.value = walletStore.wallet !== null
  // Initialize page number from route query, default to 1
  page.value = toBase10Number(route.query.page as string, 1)

  // Fetch wallet or wallets based on the presence of a wallet address
  notEmpty(form.walletAddr)
    ? await findWallet(form.walletAddr as EthereumAddress)
    : await fetchWallets(page.value)
})

const emit = defineEmits(['onItemClick', 'onItemUnclick'])

// Prop for default route navigation when an item is unclicked or page changes
interface Props {
  defaultRouteName: string
}
const props = defineProps<Props>()

interface Form {
  walletAddr: StringOrNull
}
// Reactive form for wallet address input
const form = reactive<Form>({ walletAddr: null })

// Watch for changes in wallet address in route params
watch(
  () => route.params.walletAddr,
  (walletAddr) => {
    form.walletAddr = walletAddr as StringOrNull
    // Fetch wallet if address is valid, otherwise set wallet to null
    if (isValidAddr(walletAddr as StringOrNull)) findWallet(walletAddr as EthereumAddress)
    else walletStore.wallet = null
  },
)

// Validation rules for wallet address
const rules = {
  walletAddr: {
    // Custom error message for invalid wallet address
    validAddrIf: helpers.withMessage(
      'Wallet address is not valid.',
      (addr) => empty(addr) || isValidAddr(addr as StringOrNull),
    ),
  },
}
const v$ = useVuelidate(rules, form)

// State to track if an item is clicked
const isItemClicked = ref()
// State for current page number
const page = ref()

// Function to navigate to a specific page
function navigateToPage(_page: number) {
  page.value = _page
  router.push({ query: { page: page.value } })
  fetchWallets(_page)
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

// Function to handle item click
function onItemClick(wallet: Wallet) {
  isItemClicked.value = true
  emit('onItemClick', wallet)
}

// Function to handle item unclick
function onItemUnclick(wallet: Wallet) {
  isItemClicked.value = false
  router.push({ name: props.defaultRouteName, query: { page: page.value } })
  emit('onItemUnclick', wallet)
}

// Function to navigate to wallet creation page
async function navigateToWalletCreate() {
  router.push({ name: 'wallet.create' })
}

// Function to handle enter key press in text field
async function textFieldOnKeyupEnter() {
  if (!(await validateAndToast(v$))) return

  if (empty(form.walletAddr)) {
    await fetchWallets()
    router.push({ name: props.defaultRouteName, params: {}, query: { page: page.value } })
    return
  }

  try {
    await findWallet(form.walletAddr as EthereumAddress)
    onItemClick(walletStore.wallet as Wallet)
  } catch (error) {
    if (error instanceof WalletDoesNotExistError) {
      // TODO: fix bug here
      showToast(ToastType.ERROR, error.message)
      return
    }
    throw error
  }
}
</script>
