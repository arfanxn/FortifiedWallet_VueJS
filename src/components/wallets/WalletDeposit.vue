<template>
  <section class="flex flex-col bg-slate-300 text-slate-700">
    <header class="inline-flex items-center justify-between px-4 py-4 md:px-4">
      <h2 class="text-lg font-bold">Deposit</h2>
      <SwitchEthereumAssetType
        :value="selectedDepositType"
        @onAssetCurrencyChange="(depositType: WalletDepositType) => changeDepositType(depositType)"
      />
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
        @onInput="tokenOnInput"
        name="token"
        placeholder="0x..."
      />
      <TextFieldC
        :class="{ 'md:col-span-3': isEtherDeposit, 'md:col-span-4': isTokenDeposit }"
        v-model="form.amount"
        :label="tokenAmountLabel"
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
import { computed, defineComponent, onMounted, reactive, toRaw } from 'vue'
import { faPlus, faRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { ethers } from 'ethers'
import { helpers, numeric, required, requiredIf } from '@vuelidate/validators'
import { useRoute, useRouter } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { useWalletInteraction } from '@/composables/wallets/walletInteraction.composable'
import { useTokenMetadata } from '@/composables/tokens/tokenMetadata.composable'
import { isNotEmpty, isEthAddr } from '@/utils/boolean.utils'
import { validateAndToast } from '@/helpers/validator.helpers'
import ButtonC from '@/components/ButtonC.vue'
import SelectFieldC from '@/components/SelectFieldC.vue'
import TextFieldC from '@/components/TextFieldC.vue'
import SwitchEthereumAssetType from '@/components/SwitchEthereumAssetType.vue'
import { showToast } from '@/helpers/toast.helpers'
import { formatEthAddr } from '@/helpers/string.helpers'
import { useEthereumUnit } from '@/composables/ethereums/ethereumUnit.composable'
import { ToastType } from '@/enums/toast.enums'
import BigNumber from 'bignumber.js'
import { WalletDepositType } from '@/enums/wallet.enums'
import { useAppUI } from '@/composables/appUI.composable'
import { useNavigation } from '@/composables/wallets/walletNavigator.composable'
import { useEthereumAssetType } from '@/composables/ethereums/ethereumAssetType.composable'
import { useWalletStore } from '@/stores/wallet.store'

library.add(faPlus, faRotateLeft)

defineComponent({
  name: 'WalletDeposit',
})

const router = useRouter()
const route = useRoute()

const walletStore = useWalletStore()
const { startLoading, stopLoading } = useAppUI()
const { fetchWalletByAddr, depositWallet } = useWalletInteraction()
const { tokenMetadata, tokenLabel, tokenAmountLabel, fetchTokenMetadata } = useTokenMetadata()
const { units, selectedUnit, selectedUnitValue, resetSelectedUnit } = useEthereumUnit()
const {
  selectedAssetType: selectedDepositType,
  isEther: isEtherDeposit,
  isToken: isTokenDeposit,
  resolveAssetType: resolveDepositType,
} = useEthereumAssetType()
const { navigateToWalletShow } = useNavigation()

onMounted(() => {
  selectedDepositType.value = resolveDepositType(
    route.params?.depositType?.toString(),
  ) as WalletDepositType
})

interface Form {
  walletAddr: string
  token: string
  amount: string
}
interface ProcessedForm {
  walletAddr: string
  token: string
  amount: BigNumber
}
const form = reactive<Form>({
  walletAddr: (route.params?.walletAddr as string) ?? '',
  token: '',
  amount: '',
})
const v$ = useVuelidate(
  computed(() => {
    return {
      walletAddr: {
        ethAddr: helpers.withMessage('Wallet address must be Ethereum address.', isEthAddr),
      },
      token: {
        requiredIf: helpers.withMessage(
          'Token address is required.',
          requiredIf(isTokenDeposit.value),
        ),
        validAddr: helpers.withMessage(
          'Token address must be valid ERC20 address.',
          (address: string) =>
            // If this is a token deposit, the token address must be a valid Ethereum address.
            // If it's an ether deposit, the token address is not required.
            isTokenDeposit.value ? isEthAddr(address) : true,
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
        aboveZero: helpers.withMessage(`Amount must be above zero.`, (amount: string) =>
          BigNumber(amount).gt(0),
        ),
      },
    }
  }),
  form,
)

function changeDepositType(depositType: WalletDepositType) {
  selectedDepositType.value = depositType
  router.replace({ params: { depositType } })
}

/**
 * Resets the input fields to their default values.
 */
function resetForm() {
  form.amount = ''
  form.token = ''
  resetSelectedUnit()
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
    walletAddr: walletAddr as string,
    token: token as string,
    amount: BigNumber(0),
  }
  if (isEtherDeposit.value) {
    processedForm.amount = BigNumber(
      ethers.parseUnits(amount!.toString(), selectedUnit.value.value).toString(),
    )

    /* Set the token address to the zero address when depositing ether.
    This is because the deposit transaction is always an ether transaction.
    The token address is only used when depositing a token. */
    processedForm.token = ethers.ZeroAddress
  } else if (isTokenDeposit.value && tokenMetadata.value) {
    processedForm.amount = BigNumber(
      ethers.parseUnits(amount!.toString(), tokenMetadata.value.decimals).toString(),
    )
  }
  return processedForm
}

async function tokenOnInput() {
  if (isTokenDeposit.value && isEthAddr(form.token)) await fetchTokenMetadata(form.token)
  else tokenMetadata.value = undefined
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
    startLoading()
    await depositWallet(processedForm.walletAddr, processedForm.token, processedForm.amount)
    // Show a success toast with the deposit information
    // Navigate to the "show" menu with the wallet as the active wallet
    // Refresh the wallets to display the updated balance
    showToast(ToastType.Success, formatDepositSuccessMessageForToast(), 10 * 1000)
    walletStore.selectedWallet = await fetchWalletByAddr(processedForm.walletAddr)
    navigateToWalletShow()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Deposit failed.'
    showToast(ToastType.Error, message)
  } finally {
    stopLoading()
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
    message = `Deposited ${form.amount} ${selectedUnit.value.text.toLowerCase()} to ${formatEthAddr(form.walletAddr as string)}.`
  else if (isTokenDeposit.value)
    message = `Deposited ${form.amount} ${tokenMetadata.value!.symbol} to ${formatEthAddr(form.walletAddr as string)}.`
  return message!
}
</script>
