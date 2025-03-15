<template>
  <section class="flex flex-col bg-slate-300 text-slate-700">
    <header class="inline-flex items-center justify-between px-4 py-4 md:px-4">
      <h2 class="text-lg font-bold">Transfer</h2>

      <SwitchEthereumAssetType
        :value="selectedTransactionType"
        @onAssetCurrencyChange="
          (transactionType: WalletTransactionType) => changeTransactionType(transactionType)
        "
      />
    </header>

    <form
      class="grid grid-cols-1 items-start justify-between gap-4 px-4 py-4 md:grid-cols-4"
      @submit.prevent="onSubmit"
    >
      <TextFieldC
        class="md:col-span-4"
        v-model="form.from"
        :disabled="true"
        label="From wallet"
        name="from"
      />
      <TextFieldC
        class="md:col-span-4"
        v-model="form.to"
        label="To wallet"
        name="to"
        placeholder="0x..."
      />
      <TextFieldC
        v-if="isTokenTransaction"
        :class="{ 'md:col-span-3': isEtherTransaction, 'md:col-span-4': isTokenTransaction }"
        v-model="form.token"
        @onInput="tokenOnInput"
        :label="tokenLabel"
        name="token"
        placeholder="0x..."
      />
      <TextFieldC
        :class="{ 'md:col-span-3': isEtherTransaction, 'md:col-span-4': isTokenTransaction }"
        v-model="form.amount"
        :label="tokenAmountLabel"
        name="amount"
        placeholder="7 or 7.0 or 0.7 or 0.000007"
      />
      <SelectFieldC
        v-if="isEtherTransaction"
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
        <ButtonC :text="'Transfer'" />
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { defineComponent, reactive, computed, onMounted, type ComputedRef, toRaw } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { numeric, helpers, requiredIf, required } from '@vuelidate/validators'
import { validateAndToast } from '@/helpers/validator.helpers'
import { isEthAddr, isNotEmpty, isStringNumber } from '@/utils/boolean.utils'
import { faPlus, faRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import TextFieldC from '@/components/TextFieldC.vue'
import SelectFieldC from '../SelectFieldC.vue'
import ButtonC from '@/components/ButtonC.vue'
import SwitchEthereumAssetType from '@/components/SwitchEthereumAssetType.vue'
import { useEthereumStore } from '@/stores/ethereum.store'
import BigNumber from 'bignumber.js'
import { useWalletInteraction } from '@/composables/wallets/walletInteraction.composable'
import { WalletTransactionType } from '@/enums/wallet.enums'
import { useRoute, useRouter } from 'vue-router'
import { tryOrElse } from '@/utils/object.utils'
import { computedAsync } from '@vueuse/core'
import { TokenMetadata } from '@/interfaces/token.interfaces'
import { useAppUI } from '@/composables/appUI.composable'
import { useTokenMetadata } from '@/composables/tokens/tokenMetadata.composable'
import { useEthereumUnit } from '@/composables/ethereums/ethereumUnit.composable'
import { useNavigation } from '@/composables/wallets/walletNavigator.composable'
import { useEthereumAssetType } from '@/composables/ethereums/ethereumAssetType.composable'
import { ethers } from 'ethers'
import { showToast } from '@/helpers/toast.helpers'
import { ToastType } from '@/enums/toast.enums'

library.add(faPlus, faRotateLeft)

const route = useRoute()
const router = useRouter()

defineComponent({
  name: 'WalletTransfer',
})

const { startLoading, stopLoading } = useAppUI()
const { createWalletTransaction } = useWalletInteraction()
const { tokenMetadata, tokenLabel, tokenAmountLabel, fetchTokenMetadata } = useTokenMetadata()
const { units, selectedUnit, selectedUnitValue, resetSelectedUnit, parseBySelectedUnit } =
  useEthereumUnit()
const {
  selectedAssetType: selectedTransactionType,
  isEther: isEtherTransaction,
  isToken: isTokenTransaction,
  resolveAssetType: resolveTransactionType,
} = useEthereumAssetType()
const { navigateToWalletShow } = useNavigation()
const ethereumStore = useEthereumStore()

onMounted(() => {
  selectedTransactionType.value = resolveTransactionType(
    route.params?.transactionType?.toString(),
  ) as WalletTransactionType
  resetForm()
})

interface ProcessedForm {
  from: string
  to: string
  token: string
  amount: BigNumber
}
interface Form {
  from: ComputedRef<string>
  to: string
  token: string
  amount: string
}
const form = reactive<Form>({
  from: computed(() => (route.params?.walletAddr as string) ?? ''),
  to: '',
  token: '',
  amount: '',
})

const v$ = useVuelidate(
  computed(() => ({
    from: {
      ethAddr: helpers.withMessage(
        'From wallet address must be valid Ethereum address.',
        isEthAddr,
      ),
    },
    to: {
      ethAddr: helpers.withMessage('To address must be valid Ethereum address.', isEthAddr),
    },
    token: {
      requiredIf: helpers.withMessage(
        'Token address is required.',
        requiredIf(isTokenTransaction.value),
      ),
      ethAddr: helpers.withMessage(
        'Token address must be valid Ethereum address.',
        // If this is a token deposit, the token address must be a valid Ethereum address.
        // If it's an ether deposit, the token address is not required.
        (address: string) => (isTokenTransaction.value ? isEthAddr(address) : true),
      ),
      tokenExists: helpers.withMessage(
        'Token does not exist.',
        // If this is a token deposit, the token address must exist and be a valid Ethereum address.
        // If it's an ether deposit, the token address is not required.
        () => (isTokenTransaction.value ? !!tokenMetadata.value : true),
      ),
    },
    amount: {
      required: helpers.withMessage('Amount is required.', required),
      numeric: helpers.withMessage('Amount must be numeric.', numeric),
      aboveZero: helpers.withMessage(`Amount must be above zero.`, (amount: string) =>
        BigNumber(amount).gt(0),
      ),
    },
  })),
  form,
)

function changeTransactionType(transactionType: WalletTransactionType) {
  selectedTransactionType.value = transactionType
  router.replace({ params: { transactionType } })
}

function resetForm(): void {
  form.to = ''
  form.token = ''
  form.amount = ''
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
  let { from, to, token, amount } = toRaw(form)
  const processedForm: ProcessedForm = {
    from: from as string,
    to: to as string,
    token: token as string,
    amount: BigNumber(amount),
  }
  if (isEtherTransaction.value) {
    processedForm.amount = parseBySelectedUnit(amount)

    /* Set the token address to the zero address when depositing ether.
    This is because the deposit transaction is always an ether transaction.
    The token address is only used when depositing a token. */
    processedForm.token = ethers.ZeroAddress
  } else if (isTokenTransaction.value && tokenMetadata.value) {
    processedForm.amount = BigNumber(
      ethers.parseUnits(amount!.toString(), tokenMetadata.value.decimals).toString(),
    )
  }
  return processedForm
}

async function tokenOnInput() {
  if (isTokenTransaction.value && isEthAddr(form.token)) await fetchTokenMetadata(form.token)
  else tokenMetadata.value = undefined
}

async function onSubmit() {
  if (!(await validateAndToast(v$))) return
  await handleCreateWalletTransactionSubmission()
}

async function handleCreateWalletTransactionSubmission() {
  try {
    startLoading()
    const processedForm: ProcessedForm = processForm()
    const txHash = await createWalletTransaction(
      processedForm.token,
      processedForm.to,
      processedForm.amount,
    )
    const message = `Transaction created with transaction hash "${txHash}".`
    showToast(ToastType.Success, message, 15 * 1000)
    navigateToWalletShow()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Transaction creation failed.'
    showToast(ToastType.Error, message, 5 * 1000)
  } finally {
    stopLoading()
  }
}
</script>
