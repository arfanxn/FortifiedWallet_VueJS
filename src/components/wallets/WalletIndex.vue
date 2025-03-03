<template>
  <section class="flex flex-col text-slate-700">
    <header class="inline-flex items-center justify-between bg-slate-300 px-4 py-4 md:px-4">
      <h2 class="text-lg font-bold">Wallets</h2>
      <button class="cursor-pointer" @click="navigateToWalletCreate()">
        <FontAwesomeIcon :icon="faPlus" class="text-xl" />
      </button>
    </header>
    <main class="flex flex-col gap-y-4 bg-slate-300">
      <TextFieldC
        class="px-2"
        name="walletAddr"
        placeholder="Wallet Address (0x...)"
        v-model="form.walletAddr"
        @onKeyupEnter="textFieldOnKeyupEnter"
      />
      <div
        v-if="walletStore.wallets.length === 0 && walletStore.wallet === null"
        class="flex items-center justify-center"
      >
        <span class="text-lg font-semibold">No Wallet(s) Found.</span>
      </div>
      <!-- V SHOW OF `<li>` -->
      <ul
        v-show="walletStore.wallets.length > 0 || walletStore.wallet !== null"
        class="flex flex-col gap-y-4"
      >
        <li
          v-if="walletStore.wallet !== null"
          class="inline-flex cursor-pointer items-center justify-start gap-x-4 px-4 py-2 hover:bg-slate-400 hover:text-slate-800"
          :class="{
            'bg-slate-700 text-slate-300 hover:bg-slate-700! hover:text-slate-300!':
              route.params.walletAddr === walletStore.wallet.address,
          }"
          @click="
            () =>
              isItemClicked ? onItemUnclick(walletStore.wallet) : onItemClick(walletStore.wallet)
          "
        >
          <FontAwesomeIcon :icon="faUser" class="text-xl" />
          <div class="flex flex-col items-start overflow-hidden text-ellipsis">
            <span class="font-mono">{{ formatEthAddr(walletStore.wallet.address) }}</span>
            <span class="inline-flex items-center">
              <FontAwesomeIcon :icon="faDollarSign" class="text-sm" />
              <span>{{ formatUsd(walletStore.wallet.totalBalanceInUsd) }}</span>
            </span>
          </div>
        </li>
        <!-- FOR LOOP OF `<li>` -->
        <li
          v-for="(wallet, index) in walletStore.wallets"
          :key="index"
          v-show="walletStore.wallet === null"
          class="inline-flex cursor-pointer items-center justify-start gap-x-4 px-4 py-2 hover:bg-slate-400 hover:text-slate-800"
          :class="{
            'bg-slate-700 text-slate-300 hover:bg-slate-700! hover:text-slate-300!':
              route.params.walletAddr === wallet.address,
          }"
          @click="() => onItemClick(wallet)"
        >
          <FontAwesomeIcon :icon="faUser" class="text-xl" />
          <div class="flex flex-col items-start overflow-hidden text-ellipsis">
            <span class="font-mono">{{ formatEthAddr(wallet.address) }}</span>
            <span class="inline-flex items-center">
              <FontAwesomeIcon :icon="faDollarSign" class="text-sm" />
              <span>{{ formatUsd(wallet.totalBalanceInUsd) }}</span>
            </span>
          </div>
        </li>
      </ul>
      <div v-if="empty(route.params.walletAddr)" class="flex items-center justify-end gap-x-2 px-4">
        <span class="mr-auto text-sm font-semibold">Page: {{ page }}</span>

        <button
          @click="() => navigateToPage(page - 1)"
          :class="{
            'cursor-not-allowed opacity-75': page === 1,
            'cursor-pointer': page > 1,
          }"
          :disabled="page === 1"
        >
          <FontAwesomeIcon :icon="faSquareCaretLeft" class="text-xl" />
        </button>
        <button
          @click="() => navigateToPage(page + 1)"
          :class="{
            'cursor-not-allowed opacity-75': walletStore.wallets.length === 0,
            'cursor-pointer': walletStore.wallets.length > 0,
          }"
          :disabled="walletStore.wallets.length === 0"
        >
          <FontAwesomeIcon :icon="faSquareCaretRight" class="text-xl" />
        </button>
      </div>
    </main>
  </section>
</template>

<script setup>
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
import { formatEthAddr, formatUsd } from '@/helpers/string.helpers'
import TextFieldC from '../TextFieldC.vue'
import { helpers } from '@vuelidate/validators'
import { isValidAddr, validateAndToast } from '@/helpers/validator.helpers'
import useVuelidate from '@vuelidate/core'
import { empty, notEmpty } from '@/utils/string.utils'
import { WalletDoesNotExistError } from '@/errors/wallet.errors'
import { showToast } from '@/helpers/toast.helpers'
import { toBase10Number } from '@/utils/number.utils'
import { useWalletStore } from '@/stores/wallet.store'
library.add(faSquareCaretLeft, faSquareCaretRight, faDollarSign, faPlus, faUser)

const route = useRoute()
const router = useRouter()

const { fetchWallets, findWallet } = useWallet()
const walletStore = useWalletStore()

defineComponent({
  name: 'WalletIndex',
})

onMounted(async () => {
  form.walletAddr = route.params.walletAddr
  isItemClicked.value = walletStore.wallet !== null
  page.value = toBase10Number(route.query.page, 1)

  notEmpty(form.walletAddr) ? await findWallet(form.walletAddr) : await fetchWallets(page.value)
})

const emit = defineEmits(['onItemClick', 'onItemUnclick'])

// `defaultRouteName` prop is used to navigate to the default route when an item is unclicked or the page is changed.
const props = defineProps({
  defaultRouteName: {
    type: String,
    required: true,
  },
})

// reactive form for wallet address input
const form = reactive({ walletAddr: null })
// Watch for changes in the route param `walletAddr` and update the form with it.
// If the `walletAddr` is valid, fetch the wallet with it, otherwise set the wallet to null.
watch(
  () => route.params.walletAddr,
  (walletAddr) => {
    form.walletAddr = walletAddr
    if (isValidAddr(walletAddr)) findWallet(walletAddr)
    else walletStore.wallet = null
  },
)
const rules = {
  // Validate the address only if it is not empty, otherwise pass validation
  // The rule is created with `helpers.withMessage` to provide a custom error message
  walletAddr: {
    validAddrIf: helpers.withMessage(
      'Wallet address is not valid.', // error message
      (addr) => empty(addr) || isValidAddr(addr), // validation rule
    ),
  },
}
const v$ = useVuelidate(rules, form)

const isItemClicked = ref()
const page = ref()

function navigateToPage(_page) {
  page.value = _page
  router.push({ query: { page: page.value } })
  fetchWallets(_page)
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

function onItemClick(wallet) {
  isItemClicked.value = true
  emit('onItemClick', wallet)
}

/**
 * Handles the unclick event for an item.
 * Navigates to the default route specified in the component's props
 * while maintaining the current page number in the query parameters.
 * Emits the 'onItemUnclick' event with the provided wallet object.
 *
 * @param {Object} wallet - The wallet object associated with the unclicked item.
 */
function onItemUnclick(wallet) {
  isItemClicked.value = false
  router.push({ name: props.defaultRouteName, query: { page: page.value } })
  emit('onItemUnclick', wallet)
}

async function navigateToWalletCreate() {
  router.push({ name: 'wallet.create' })
}

async function textFieldOnKeyupEnter() {
  if (!(await validateAndToast(v$))) return

  if (empty(form.walletAddr)) {
    await fetchWallets()
    router.push({ name: props.defaultRouteName, params: {}, query: { page: page.value } })
    return
  }

  try {
    await findWallet(form.walletAddr)
    onItemClick(walletStore.wallet)
  } catch (error) {
    if (error instanceof WalletDoesNotExistError) showToast('error', error.message)
    throw error
  }
}
</script>
