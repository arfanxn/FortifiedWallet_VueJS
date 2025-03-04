<template>
  <section class="flex flex-col bg-slate-300 text-slate-700">
    <header class="inline-flex items-center justify-between px-4 py-4 md:px-4">
      <h2 class="text-lg font-bold">Deposit</h2>

      <div class="flew-row flex gap-4">
        <ButtonC
          @onClick="() => router.push({ name: 'wallet.deposit', params: { depositType: 'eth' } })"
          type="button"
          :text="'ETH'"
          class="rounded-none border-slate-700 bg-transparent px-1! font-bold text-slate-700! outline-none hover:bg-transparent hover:text-slate-700!"
          :class="{ 'border-b': isEtherDeposit }"
        />
        <ButtonC
          @onClick="() => router.push({ name: 'wallet.deposit', params: { depositType: 'token' } })"
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
        v-model="form.walletAddr"
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
        <ButtonC :text="'Deposit'" />
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { computed, defineComponent, reactive, toRaw } from 'vue'
import { faPlus, faRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { ethers } from 'ethers'
import { helpers, numeric, required, requiredIf } from '@vuelidate/validators'
import { useRoute, useRouter } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { useWallet } from '@/composables/wallet.composable'
import { useToken } from '@/composables/token.composable'
import { notEmpty } from '@/utils/boolean.utils'
import { isValidAddr, validateAndToast } from '@/helpers/validator.helpers'
import ButtonC from '@/components/ButtonC.vue'
import SelectFieldC from '@/components/SelectFieldC.vue'
import TextFieldC from '@/components/TextFieldC.vue'
import { showToast } from '@/helpers/toast.helpers'
import { formatEthAddr } from '@/helpers/string.helpers'
import { useEthereumUnit } from '@/composables/ethereumUnit.composable'
import { computedAsync } from '@vueuse/core'
import { ToastType } from '@/enums/toast.enums'
import { EthereumAddress } from '@/interfaces/ethereum.interfaces'
import type { StringOrNull } from '@/interfaces/interfaces'
import { TokenMetadata } from '@/interfaces/token.interfaces'
import BigNumber from 'bignumber.js'

library.add(faPlus, faRotateLeft)

defineComponent({
  name: 'WalletDeposit',
})

const router = useRouter()
const route = useRoute()

const { depositWallet, findWallet } = useWallet()
const { fetchTokenMetadata } = useToken()
const { units, selectedUnitValue, getTextByValue, resetSelectedUnitValue } = useEthereumUnit()

const depositType = computed(() =>
  ['erc20', 'token'].includes(route.params?.depositType?.toString().toLowerCase())
    ? 'token'
    : 'eth',
)
const isEtherDeposit = computed(() => depositType.value === 'eth')
const isTokenDeposit = computed(() => depositType.value === 'token')

interface Form {
  walletAddr: StringOrNull
  token: StringOrNull
  amount: StringOrNull
}
interface ProcessedForm {
  walletAddr: EthereumAddress
  token: EthereumAddress
  amount: BigNumber
}

const form = reactive<Form>({
  walletAddr: route.params?.walletAddr?.toString(),
  token: null,
  amount: null,
})
const rules = computed(() => {
  return {
    walletAddr: {
      validAddr: helpers.withMessage(
        'Wallet address must be valid Ethereum address.',
        (address: StringOrNull) => isValidAddr(address),
      ),
    },
    token: {
      requiredIf: helpers.withMessage(
        'Token address is required.',
        requiredIf(isTokenDeposit.value),
      ),
      validAddr: helpers.withMessage(
        'Token address must be valid ERC20 address.',
        (address: StringOrNull) =>
          // If this is a token deposit, the token address must be a valid Ethereum address.
          // If it's an ether deposit, the token address is not required.
          isTokenDeposit.value ? isValidAddr(address) : true,
      ),
      tokenExists: helpers.withMessage('Token does not exist.', () =>
        // If this is a token deposit, the token address must exist and be a valid Ethereum address.
        // If it's an ether deposit, the token address is not required.
        isTokenDeposit.value ? isNotEmpty(tokenMetadata.value?.name) : true,
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
 * @returns {Promise<TokenMetadata | undefined>} A promise that resolves to the token metadata if the token address is valid, or undefined otherwise.
 */
const tokenMetadata = computedAsync<TokenMetadata | undefined>(
  async () => {
    const isTokenValid = isTokenDeposit.value && isValidAddr(form.token)
    return isTokenValid ? await fetchTokenMetadata(form.token as EthereumAddress) : undefined
  },
  undefined,
  { lazy: true },
)

/* The label to be displayed for the token address input field.
If the token address is valid and the token metadata is available,
it shows the name and symbol of the token, e.g., "USDT (Tether)".
Otherwise, it shows nothing. */
const tokenLabel = computed(() =>
  isTokenDeposit.value && tokenMetadata.value
    ? `Token: ${tokenMetadata.value.name} (${tokenMetadata.value.symbol})`
    : `Token: -`,
)

const amountLabel = computed(() => {
  if (isEtherDeposit.value)
    return `Amount (in ${getTextByValue(selectedUnitValue.value)!.toLowerCase()})`
  else if (isTokenDeposit.value && tokenMetadata.value)
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
 * Processes the input form data into a format that can be used for
 * making a deposit transaction.
 *
 * If the deposit is for ether, it converts the amount to the specified
 * unit, e.g., ether, gwei, etc., and sets the token address to the
 * zero address.
 *
 * If the deposit is for a token, it converts the amount to the token's
 * decimals and sets the token address to the specified token address.
 *
 * @returns {ProcessedForm} An object containing the wallet address,
 * token address, and amount in the format expected by the deposit
 * transaction.
 */
function processForm(): ProcessedForm {
  let { walletAddr, token, amount } = toRaw(form)
  const processedForm: ProcessedForm = {
    walletAddr: walletAddr as EthereumAddress,
    token: token as EthereumAddress,
    amount: BigNumber(0),
  }
  if (isEtherDeposit.value) {
    processedForm.amount = BigNumber(
      ethers.parseUnits(amount!.toString(), selectedUnitValue.value).toString(),
    )

    /* Set the token address to the zero address when depositing ether.
    This is because the deposit transaction is always an ether transaction.
    The token address is only used when depositing a token. */
    token = ethers.ZeroAddress
  } else if (isTokenDeposit.value && tokenMetadata.value) {
    processedForm.amount = BigNumber(
      ethers.parseUnits(amount!.toString(), tokenMetadata.value.decimals).toString(),
    )
  }
  return processedForm
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
  const processedForm: ProcessedForm = processForm()
  try {
    await depositWallet(processedForm.walletAddr, {
      token: processedForm.token,
      value: processedForm.amount,
    })
    // Show a success toast with the deposit information
    // Navigate to the "show" menu with the wallet as the active wallet
    // Refresh the wallets to display the updated balance
    showToast(ToastType.SUCCESS, formatDepositSuccessMessageForToast(), 10 * 1000)
    router.push({ name: 'wallet.show', params: { walletAddr: form.walletAddr } })
    await findWallet(form.walletAddr!)
  } catch (error) {
    showToast(ToastType.ERROR, 'Deposit failed.')
    console.log(error)
    return
  }
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
function formatDepositSuccessMessageForToast(): string {
  let message: string
  if (isEtherDeposit.value)
    message = `Deposited ${form.amount} ${getTextByValue(selectedUnitValue.value)!.toLowerCase()} to ${formatEthAddr(form.walletAddr as string)}.`
  else if (isTokenDeposit.value)
    message = `Deposited ${form.amount} ${tokenMetadata.value!.symbol} to ${formatEthAddr(form.walletAddr as string)}.`
  return message!
}
</script>
