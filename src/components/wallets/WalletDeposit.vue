<template>
  <section class="flex flex-col bg-slate-300 text-slate-700">
    <header class="inline-flex items-center justify-between px-4 py-4 md:px-4">
      <h2 class="text-lg font-bold">Deposit</h2>
      <LeftRigthSwitchButtonC
        :value="depositType"
        @update:value="(value: string) => router.replace({ params: { depositType: value } })"
        :options="['ether', 'token']"
        left="Ether"
        right="Token"
      />
    </header>

    <form
      class="grid grid-cols-1 items-start justify-between gap-4 px-4 py-4 md:grid-cols-4"
      @submit.prevent="() => handleDepositSubmission()"
    >
      <TextFieldC
        class="md:col-span-4"
        :value="walletAddr"
        :disabled="true"
        label="Wallet"
        name="wallet"
      />
      <TextFieldC
        v-if="depositType === 'token'"
        :class="{
          'md:col-span-4': depositType === 'token',
        }"
        v-model="token"
        :label="tokenMetadata ? `${tokenMetadata.name} (${tokenMetadata.symbol})` : 'Token'"
        @onInput="() => tokenOnInput()"
        name="token"
        placeholder="0x..."
      />
      <TextFieldC
        :class="{
          'md:col-span-3': depositType === 'ether',
          'md:col-span-4': depositType === 'token',
        }"
        v-model="amount"
        :label="
          depositType === 'ether'
            ? `Amount (in ${selectedUnit.label})`
            : tokenMetadata
              ? `Amount (in ${tokenMetadata.decimals} decimals)`
              : 'Amount'
        "
        name="amount"
        placeholder="7 or 7.0 or 0.7 or 0.000007"
      />
      <SelectFieldC
        v-show="depositType === 'ether'"
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
import { computed, defineComponent, unref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { faPlus, faRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { ethers } from 'ethers'
import { object, string, number, InferType } from 'yup'
import ButtonC from '@/components/ButtonC.vue'
import SelectFieldC from '@/components/SelectFieldC.vue'
import TextFieldC from '@/components/TextFieldC.vue'
import LeftRigthSwitchButtonC from '@/components/LeftRigthSwitchButtonC.vue'
import { showErrorToasts, showToast } from '@/helpers/toastHelpers'
import { formatEthAddr } from '@/helpers/stringHelpers'
import { ethereumAddressSchema, tokenExistsSchema } from '@/validators/schemas/ethereumSchemas'
import { useAppUI } from '@/composables/useAppUI'
import { useEthereumUnit } from '@/composables/ethereums/useEthereumUnit'
import { useForm } from 'vee-validate'
import { useTokenMetadataFetch } from '@/composables/tokens/useTokenMetadataFetch'
import { useWalletInteraction } from '@/composables/wallets/useWalletInteraction'
import { useWalletNavigator } from '@/composables/wallets/useWalletNavigator'
import { useWalletStore } from '@/stores/useWalletStore'
import { ToastType } from '@/enums/toastEnums'

library.add(faPlus, faRotateLeft)

defineComponent({
  name: 'WalletDeposit',
})

const router = useRouter()
const route = useRoute()

const walletStore = useWalletStore()
const { startLoading, stopLoading } = useAppUI()
const { depositWallet } = useWalletInteraction()
const { tokenMetadata, fetchTokenMetadata } = useTokenMetadataFetch()
const { units, selectedUnit, selectedUnitValue, parseBySelectedUnit, resetSelectedUnit } =
  useEthereumUnit()
const { navigateToWalletShow } = useWalletNavigator()

const props = defineProps<{
  depositType: 'ether' | 'token'
  walletAddr: string
}>()

const createValidationSchema = (depositType: string) => {
  return object({
    token:
      depositType === 'token'
        ? string()
            .label('Token')
            .required('${label} is required.')
            .concat(ethereumAddressSchema())
            .concat(tokenExistsSchema(fetchTokenMetadata))
        : string().notRequired(),
    amount: number().label('Amount').required('${label} is required.'),
  })
}
const validationSchema = computed(() => createValidationSchema(props.depositType))
type SchemaType = ReturnType<typeof createValidationSchema>
type FormValues = InferType<SchemaType>
const {
  defineField,
  resetForm: resetFormValues,
  validate,
  validateField,
} = useForm<FormValues>({
  validationSchema,
})
const [token] = defineField('token')
const [amount] = defineField('amount')

function resetForm() {
  resetFormValues()
  resetSelectedUnit()
}

async function tokenOnInput() {
  const { valid } = await validateField('token')
  if (valid) await fetchTokenMetadata(unref(token) as string)
  else tokenMetadata.value = undefined
}

interface ProcessedForm {
  walletAddr: string
  token: string
  amount: bigint
}
function processForm(): ProcessedForm {
  return {
    walletAddr: props.walletAddr,
    token: props.depositType === 'ether' ? ethers.ZeroAddress : (unref(token) as string),
    amount:
      props.depositType === 'ether'
        ? parseBySelectedUnit(unref(amount).toString())
        : ethers.parseUnits(unref(amount)!.toString(), tokenMetadata.value!.decimals),
  }
}

async function handleDepositSubmission() {
  const { valid, errors } = await validate()
  if (!valid) {
    showErrorToasts(Object.values(errors)!)
    return
  }

  const processedForm: ProcessedForm = processForm()
  try {
    startLoading()
    await depositWallet(processedForm.walletAddr, processedForm.token, processedForm.amount)
    // Show a success toast with the deposit information
    // Navigate to the "show" menu with the wallet as the active wallet
    // Refresh the wallets to display the updated balance
    showToast(ToastType.Success, formatDepositSuccessMessageForToast(), 10 * 1000)
    navigateToWalletShow({ walletAddr: processedForm.walletAddr })
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
  return props.depositType === 'ether'
    ? `Deposited ${amount.value} ${selectedUnit.value.label.toLowerCase()} to ${formatEthAddr(props.walletAddr as string)}.`
    : `Deposited ${amount.value} ${tokenMetadata.value!.symbol} to ${formatEthAddr(props.walletAddr as string)}.`
}
</script>
