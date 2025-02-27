<template>
  <section class="flex flex-col bg-slate-300 text-slate-700">
    <header class="inline-flex items-center justify-between px-4 py-4 md:px-4">
      <h2 class="text-lg font-bold">Deposit</h2>

      <div class="flew-row flex gap-4">
        <ButtonC
          @onClick="() => router.push({ path: '/', query: { ...route.query, type: 'eth' } })"
          type="button"
          :text="'ETH'"
          class="rounded-none border-slate-700 bg-transparent px-1! font-bold text-slate-700! outline-none hover:bg-transparent hover:text-slate-700!"
          :class="{ 'border-b': isEtherDeposit }"
        />
        <ButtonC
          @onClick="() => router.push({ path: '/', query: { ...route.query, type: 'erc20' } })"
          type="button"
          :text="'ERC20'"
          class="rounded-none border-slate-700 bg-transparent px-1! font-bold text-slate-700! outline-none hover:bg-transparent hover:text-slate-700!"
          :class="{ 'border-b': isTokenDeposit }"
        />
      </div>
    </header>

    <form
      class="grid grid-cols-1 items-start justify-between gap-4 px-4 py-4 md:grid-cols-4"
      @submit.prevent="onSubmit"
    >
      <TextFieldC
        class="md:col-span-4"
        v-model="form.wallet"
        :disabled="true"
        label="Wallet"
        name="wallet"
      />
      <TextFieldC
        v-if="isTokenDeposit"
        :class="{ 'md:col-span-3': isEtherDeposit, 'md:col-span-4': isTokenDeposit }"
        v-model="form.token"
        :label="tokenLabel"
        name="token"
        placeholder="0x..."
      />
      <TextFieldC
        :class="{ 'md:col-span-3': isEtherDeposit, 'md:col-span-4': isTokenDeposit }"
        v-model="form.amount"
        :label="amountLabel"
        name="amount"
        placeholder="7 or 7.0 or 0.7 or 0.000007"
      />
      <SelectFieldC
        v-if="isEtherDeposit"
        class="md:col-span-1"
        name="unit"
        label="Unit"
        v-model="selectedUnitValue"
        :options="units"
      />
      <div class="flex justify-between gap-x-4 md:col-span-4">
        <ButtonC
          @onClick="resetForm"
          type="button"
          :text="'Reset'"
          :icon="faRotateLeft"
          class="bg-red-700! text-slate-200! hover:bg-red-600! hover:text-slate-100!"
        />
        <ButtonC :text="'Deposit'" class="" />
      </div>
    </form>
  </section>
</template>

<script setup>
import { computed, defineComponent, reactive, toRaw } from 'vue'
import { faPlus, faRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { ethers } from 'ethers'
import { helpers, numeric, required, requiredIf } from '@vuelidate/validators'
import { useRoute, useRouter } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { useWallet } from '@/composables/wallet.composable'
import { useToken } from '@/composables/token.composable'
import { notEmpty } from '@/utils/string.utils'
import { isValidAddr, validateAndToast } from '@/helpers/validator.helpers'
import ButtonC from '@/components/ButtonC.vue'
import SelectFieldC from '@/components/SelectFieldC.vue'
import TextFieldC from '@/components/TextFieldC.vue'
import { showToast } from '@/helpers/toast.helpers'
import { formatEthAddr } from '@/helpers/string.helpers'
import { useEthereumUnit } from '@/composables/ethereumUnit.composable'
import { computedAsync } from '@vueuse/core'

library.add(faPlus, faRotateLeft)

defineComponent({
  name: 'WalletDeposit',
})

const router = useRouter()
const route = useRoute()

const { depositWallet, fetchWallets } = useWallet()
const { fetchTokenMetadata } = useToken()
const { units, selectedUnitValue, getTextByValue, resetSelectedUnitValue } = useEthereumUnit()

const depositType = computed(() =>
  ['erc20', 'token'].includes(route.query.type?.toLowerCase()) ? 'token' : 'eth',
)
const isEtherDeposit = computed(() => depositType.value === 'eth')
const isTokenDeposit = computed(() => depositType.value === 'token')

const form = reactive({
  wallet: route.query.wallet,
  token: null,
  amount: null,
})
const rules = computed(() => {
  return {
    wallet: {
      validFormat: helpers.withMessage(
        'Wallet address must be valid Ethereum address.',
        (address) => notEmpty(address) && isValidAddr(address),
      ),
    },
    token: {
      requiredIf: helpers.withMessage(
        'Token address is required.',
        requiredIf(isTokenDeposit.value),
      ),
      validFormat: helpers.withMessage(
        'Token address must be valid ERC20 address.',
        (address) => notEmpty(address) && isValidAddr(address),
      ),
      tokenExists: helpers.withMessage('Token does not exist.', () =>
        notEmpty(tokenMetadata.value?.name),
      ),
    },
    amount: {
      required: helpers.withMessage('Amount is required.', required),
      numeric: helpers.withMessage('Amount must be numeric.', numeric),
      notZero: helpers.withMessage(`Amount cannot be zero.`, (amount) => amount != 0),
    },
    // unit: {
    //   validFormat: helpers.withMessage('Unit must be valid.', (unit) => unitTexts.includes(unit)),
    // },
  }
})
const v$ = useVuelidate(rules, form)

/**
 * Retrieves the metadata for the token address provided in the form.
 *
 * @returns {Promise<TokenMetadata | null>} A promise that resolves to the token metadata if the token address is valid, or null otherwise.
 */
const tokenMetadata = computedAsync(
  async () => {
    const isTokenValid = isTokenDeposit.value && isValidAddr(form.token)
    return isTokenValid ? await fetchTokenMetadata(form.token) : null
  },
  null,
  { lazy: true },
)

/* The label to be displayed for the token address input field.
If the token address is valid and the token metadata is available,
it shows the name and symbol of the token, e.g., "USDT (Tether)".
Otherwise, it shows nothing. */
const tokenLabel = computed(() =>
  isTokenDeposit.value && notEmpty(tokenMetadata.value?.name)
    ? `Token: ${tokenMetadata.value.name} (${tokenMetadata.value.symbol})`
    : `Token: -`,
)

const amountLabel = computed(() => {
  if (isEtherDeposit.value)
    return `Amount (in ${getTextByValue(selectedUnitValue.value).toLowerCase()})`
  else if (isTokenDeposit.value && notEmpty(tokenMetadata.value?.decimals))
    return `Amount (in ${tokenMetadata.value.decimals} decimals)`
  else return `Amount`
})

/**
 * Resets the input fields to their default values.
 */
function resetForm() {
  form.amount = null
  form.token = null
  resetSelectedUnitValue()
}

/**
 * Processes the form data by converting the amount field to the correct unit.
 *
 * If the form is an ether deposit, it converts the amount to the selected unit.
 * If the form is a token deposit, it converts the amount to the decimals of the token.
 *
 * @returns {Promise<import('@/types').ProcessedForm>}
 */
function processForm() {
  let { wallet, token, amount } = toRaw(form)
  if (isEtherDeposit.value) {
    amount = ethers.parseUnits(form.amount.toString(), selectedUnitValue.value)
    /* Set the token address to the zero address when depositing ether.
    This is because the deposit transaction is always an ether transaction.
    The token address is only used when depositing a token. */
    token = ethers.ZeroAddress
  } else if (isTokenDeposit.value && notEmpty(tokenMetadata.value?.decimals)) {
    amount = ethers.parseUnits(form.amount.toString(), tokenMetadata.value.decimals)
  }
  return { wallet, token, amount }
}

/**
 * Handles the deposit form submission.
 * Validates the input fields, prepares the data for the transaction,
 * deposits the specified amount of ether or token to the specified wallet,
 * shows a success message, and navigates to the "show" menu with the wallet
 * as the active wallet.
 */
async function onSubmit() {
  if (!(await validateAndToast(v$))) return
  await handleDepositSubmission()
}

async function handleDepositSubmission() {
  const processedForm = processForm()
  try {
    await depositWallet(processedForm.wallet, {
      token: processedForm.token,
      value: processedForm.amount,
    })
  } catch (e) {
    console.log(e)
    showToast('error', 'Deposit failed.')
    return
  }

  // Show a success toast with the deposit information
  // Navigate to the "show" menu with the wallet as the active wallet
  // Refresh the wallets to display the updated balance
  showToast('success', formatDepositSuccessMessageForToast(), 10 * 1000)
  router.push({ path: '/', query: { menu: 'show', wallet: form.wallet } })
  fetchWallets()
}

/**
 * Formats a success message for depositing ether or a token.
 *
 * If the deposit is for ether, it formats the amount in the correct unit
 * (e.g., 1 ether, 0.1 ether, etc.).
 * If the deposit is for a token, it formats the amount with the token's symbol
 * (e.g., 1.0 USDT, 0.1 WBTC, etc.).
 *
 * @returns {string} The formatted success message.
 */
function formatDepositSuccessMessageForToast() {
  let message = null
  if (isEtherDeposit.value)
    message = `Deposited ${form.amount} ${getTextByValue(selectedUnitValue.value).toLowerCase()} to ${formatEthAddr(form.wallet)}.`
  else if (isTokenDeposit.value)
    message = `Deposited ${form.amount} ${tokenMetadata.value.symbol} to ${formatEthAddr(form.wallet)}.`
  return message
}
</script>
