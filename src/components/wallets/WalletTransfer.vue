<template>
  <section class="flex flex-col bg-slate-300 text-slate-700">
    <header class="inline-flex items-center justify-between px-4 py-4 md:px-4">
      <h2 class="text-lg font-bold">Transfer</h2>

      <LeftRigthSwitchButtonC
        :value="transactionType"
        @update:value="(transactionType) => router.replace({ params: { transactionType } })"
        :options="['ether', 'token']"
        left="Ether"
        right="Token"
      />
    </header>

    <form
      class="grid grid-cols-1 items-start justify-between gap-4 px-4 py-4 md:grid-cols-4"
      @submit.prevent="handleCreateWalletTransactionSubmission"
    >
      <TextFieldC
        class="md:col-span-4"
        :value="walletAddr"
        :disabled="true"
        label="From wallet"
        name="from"
      />
      <TextFieldC
        class="md:col-span-4"
        v-model="to"
        label="To wallet"
        name="to"
        placeholder="0x..."
      />
      <TextFieldC
        v-if="transactionType === 'token'"
        class="md:col-span-4"
        v-model="token"
        @onInput="tokenOnInput"
        :label="tokenMetadata ? `${tokenMetadata.name} (${tokenMetadata.symbol})` : 'Token'"
        name="token"
        placeholder="0x..."
      />
      <TextFieldC
        :class="{
          'md:col-span-3': transactionType === 'ether',
          'md:col-span-4': transactionType === 'token',
        }"
        v-model="amount"
        :label="
          transactionType === 'ether'
            ? `Amount (in ${selectedUnit.label})`
            : tokenMetadata
              ? `Amount (in ${tokenMetadata.decimals} decimals)`
              : 'Amount'
        "
        name="amount"
        placeholder="7 or 7.0 or 0.7 or 0.000007"
      />
      <SelectFieldC
        v-if="transactionType === 'ether'"
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
import { defineComponent, reactive, computed, onMounted, type ComputedRef, toRaw, unref } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { numeric, helpers, requiredIf, required } from '@vuelidate/validators'
import { validateAndToast } from '@/helpers/validatorHelpers'
import { isEthAddr, isNotEmpty, isStringNumber } from '@/utils/booleanUtils'
import { faPlus, faRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import TextFieldC from '@/components/TextFieldC.vue'
import SelectFieldC from '../SelectFieldC.vue'
import ButtonC from '@/components/ButtonC.vue'
import SwitchEthereumAssetType from '@/components/SwitchEthereumAssetType.vue'
import { useEthereumStore } from '@/stores/useEthereumStore'
import BigNumber from 'bignumber.js'
import { useWalletInteraction } from '@/composables/wallets/useWalletInteraction'
import { WalletTransactionType } from '@/enums/walletEnums'
import { useRoute, useRouter } from 'vue-router'
import { useAppUI } from '@/composables/useAppUI'
import { useEthereumUnit } from '@/composables/ethereums/useEthereumUnit'
import { useEthereumAssetType } from '@/composables/ethereums/useEthereumAssetType'
import { ethers } from 'ethers'
import { showErrorToasts, showToast } from '@/helpers/toastHelpers'
import { ToastType } from '@/enums/toastEnums'
import { useWalletNavigator } from '@/composables/wallets/useWalletNavigator'
import LeftRigthSwitchButtonC from '@/components/LeftRigthSwitchButtonC.vue'
import { object, string, number, boolean, InferType } from 'yup'
import { useForm } from 'vee-validate'
import { ethereumAddressSchema } from '@/validators/schemas/ethereumSchemas'
import { tokenExistsSchema } from '@/validators/schemas/tokenSchemas'
import { useTokenMetadataFetch } from '@/composables/tokens/useTokenMetadataFetch'

library.add(faPlus, faRotateLeft)

const route = useRoute()
const router = useRouter()

defineComponent({
  name: 'WalletTransfer',
})

const { startLoading, stopLoading } = useAppUI()
const { createWalletTransaction } = useWalletInteraction()
const { tokenMetadata, fetchTokenMetadata } = useTokenMetadataFetch()
const { units, selectedUnit, selectedUnitValue, resetSelectedUnit, parseBySelectedUnit } =
  useEthereumUnit()
const { navigateToWalletShow } = useWalletNavigator()

const props = defineProps<{
  transactionType: 'ether' | 'token'
  walletAddr: string
}>()

const createValidationSchema = () =>
  object({
    to: string()
      .label('To address')
      .required('${label} is required.')
      .concat(ethereumAddressSchema()),
    token:
      props.transactionType === 'token'
        ? string()
            .label('Token')
            .required('${label} is required.')
            .concat(ethereumAddressSchema())
            .concat(tokenExistsSchema(fetchTokenMetadata))
        : string().notRequired(),
    amount: number()
      .label('Amount')
      .required('${label} is required.')
      .moreThan(0, '${label} must be greater than 0.'),
  })
const validationSchema = computed(() => createValidationSchema())
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
const [to] = defineField('to')
const [token] = defineField('token')
const [amount] = defineField('amount')

function resetForm(): void {
  resetFormValues()
  resetSelectedUnit()
}

async function tokenOnInput() {
  const { valid } = await validateField('token')
  if (valid) await fetchTokenMetadata(unref(token) as string)
  else tokenMetadata.value = undefined
}

interface ProcessedForm {
  to: string
  token: string
  amount: bigint
}
function processForm(): ProcessedForm {
  return {
    to: unref(to) as string,
    token: props.transactionType === 'ether' ? ethers.ZeroAddress : (unref(token) as string),
    amount:
      props.transactionType === 'ether'
        ? parseBySelectedUnit(unref(amount).toString())
        : ethers.parseUnits(unref(amount)!.toString(), tokenMetadata.value!.decimals),
  }
}

async function handleCreateWalletTransactionSubmission() {
  const { valid, errors } = await validate()
  if (!valid) {
    showErrorToasts(Object.values(errors)!)
    return
  }

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
    navigateToWalletShow({ walletAddr: props.walletAddr })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Transaction creation failed.'
    showToast(ToastType.Error, message, 5 * 1000)
  } finally {
    stopLoading()
  }
}
</script>
