<template>
  <section class="flex flex-col bg-slate-300 text-slate-700">
    <header class="inline-flex items-center justify-between px-4 py-4 md:px-4">
      <h2 class="text-lg font-bold">Add</h2>
    </header>

    <form class="grid items-start gap-4 px-4 py-4 md:grid-cols-3" @submit.prevent>
      <div class="grid gap-4 md:col-span-1 md:row-span-4">
        <TextFieldC v-model="form.name" label="Name" name="name" placeholder="Main Wallet" />
        <TextFieldC
          v-model="form.minApprovalCount"
          label="Min Approval Count"
          name="min_approval_count"
          placeholder="2"
        />
      </div>
      <div class="grid gap-4 md:col-span-2 md:row-span-1 md:grid-cols-2">
        <TextFieldC
          v-model="form.password"
          label="Password"
          name="password"
          placeholder="Your password"
        />
        <TextFieldC v-model="form.salt" label="Salt" name="salt" placeholder="Password salt" />
      </div>
      <div class="grid gap-4 md:col-span-2 md:row-span-2 md:grid-cols-2">
        <TextFieldC
          v-for="(_, index) in form.signers"
          :key="index"
          :name="`signer_${index}`"
          v-model="form.signers[index]"
          @onInput="() => signerOnInput(index)"
          :disabled="index === 0"
          :label="`Signer ${index + 1}`"
          placeholder="0x..."
        />
      </div>
      <div class="flex justify-between gap-x-4 md:col-span-3 md:row-span-1">
        <ButtonC
          @onClick="resetForm"
          type="button"
          :text="'Reset'"
          :icon="faRotateLeft"
          class="bg-red-700! text-slate-200! hover:bg-red-600! hover:text-slate-100!"
        />
        <ButtonC
          @onClick="handleCreateSubmission"
          type="button"
          :text="'Add'"
          :icon="faPlus"
          class=""
        />
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { defineComponent, reactive, onUnmounted, watchEffect } from 'vue'
import { useAppUI } from '@/composables/useAppUI'
import { useEthereumStore } from '@/stores/useEthereumStore'
import { useWalletInteraction } from '@/composables/wallets/useWalletInteraction'
import { useWalletNavigator } from '@/composables/wallets/useWalletNavigator'
import TextFieldC from '@/components/TextFieldC.vue'
import ButtonC from '@/components/ButtonC.vue'
import {
  object,
  string,
  number,
  array,
  ref as yupRef,
  ValidationError,
  TestContext,
  AnyObject,
} from 'yup'
import { alphanumericSchema } from '@/validators/schemas'
import { faPlus, faRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { formatEthAddr } from '@/helpers/stringHelpers'
import { isEmpty, isEthAddr, isNotEmpty } from '@/utils/booleanUtils'
import { showErrorToasts, showToast } from '@/helpers/toastHelpers'
import { ToastType } from '@/enums/toastEnums'
import { toSolidityPackedKeccak256Hash } from '@/helpers/ethersHelpers'

library.add(faPlus, faRotateLeft)

const ethereumStore = useEthereumStore()
const { startLoading, stopLoading } = useAppUI()
const { createWallet } = useWalletInteraction()
const { navigateToWalletShow } = useWalletNavigator()

defineComponent({
  name: 'WalletCreate',
})

const ALLOWED_MIN_APPROVAL_COUNT = 2
const ALLOWED_MIN_SIGNERS_LENGTH = 2
const ALLOWED_MAX_SIGNERS_LENGTH = 10

interface ProcessedForm {
  name: string
  signers: string[]
  minApprovalCount: number
  passwordHash: string
}

const formSchema = () =>
  object({
    name: string()
      .label('Name')
      .required('${label} is required.')
      .min(2, '${label} must be at least 2 characters.')
      .max(32, '${label} must be at most 32 characters.')
      .concat(alphanumericSchema()),
    minApprovalCount: number()
      .label('Min Approval Count')
      .typeError('${label} must be a number.')
      .required('${label} is required.')
      .min(ALLOWED_MIN_APPROVAL_COUNT, '${label} must be at least 2.')
      .max(yupRef('signers.length'), '${label} cannot exceed the number of signers.'),
    signers: array()
      .label('Signers')
      .required('${label} is required.')
      .min(
        ALLOWED_MIN_SIGNERS_LENGTH,
        '${label}' + ` must be at least ${ALLOWED_MIN_SIGNERS_LENGTH}.`,
      )
      .max(
        ALLOWED_MAX_SIGNERS_LENGTH,
        '${label}' + ` must be at most ${ALLOWED_MAX_SIGNERS_LENGTH}.`,
      )
      .of(string().optional())
      .test(
        'valid-signers',
        '${label} are invalid.',
        (signers: (string | undefined)[], context: TestContext<AnyObject>) => {
          const isAboveMin = signers.length > ALLOWED_MIN_SIGNERS_LENGTH
          const isBelowMax = signers.length < ALLOWED_MAX_SIGNERS_LENGTH

          for (let i = 0; i < signers.length; i++) {
            const signer = signers[i]
            const isLast = i === signers.length - 1

            if (isLast && isAboveMin && isBelowMax) continue

            if (i <= 1 && isEmpty(signer))
              return context.createError({
                message: '${label}' + ` must be at least ${ALLOWED_MIN_SIGNERS_LENGTH}.`,
              })

            if (isEthAddr(signer) === false)
              return context.createError({
                message: `Signer #${i + 1} is invalid ethereum address.`,
              })
          }

          if (new Set(signers).size !== signers.length)
            return context.createError({
              message: 'Signers must be unique.',
            })

          return true
        },
      ),
    password: string()
      .label('Password')
      .required('${label} is required.')
      .min(8, '${label} must be at least 8 characters.')
      .max(256, '${label} must be at most 256 characters.'),
    salt: string()
      .label('Salt')
      .required('${label} is required.')
      .length(64, '${label} must be 64 characters long.'),
  })

interface Form {
  name: string
  minApprovalCount: number
  signers: (string | undefined)[]
  password: string
  salt: string
}
const getInitialForm: () => Form = (): Form => ({
  name: '',
  minApprovalCount: ALLOWED_MIN_APPROVAL_COUNT,
  signers: [ethereumStore.activeAccount, undefined],
  password: '',
  salt: '',
})
const form = reactive<Form>(getInitialForm())

watchEffect(() => {
  form.signers[0] = ethereumStore.activeAccount
})

function resetForm() {
  Object.assign(form, getInitialForm())
}

/**
 * When a user inputs a signer, either add or remove a row from the form based on the input.
 * If the input is not empty, add a new row.
 * If the input is empty, remove the row.
 * This ensures that the form always has at least 2 signers, and never more than 10.
 * @param {number} index The index of the input field in the signers array.
 */
function signerOnInput(index: number) {
  const currentSigner = form.signers[index]
  const totalSigners = form.signers.length
  const lastSignerIndex = totalSigners - 1
  const secondLastSignerIndex = totalSigners - 2

  // Conditions for adding a new signer field
  const isEditingLastSigner = index === lastSignerIndex
  const currentSignerFilled = isNotEmpty(currentSigner)
  const canAddMoreSigners = totalSigners < ALLOWED_MAX_SIGNERS_LENGTH

  // Conditions for removing the last signer field
  const isEditingSecondLastSigner = index === secondLastSignerIndex
  const currentSignerEmpty = isEmpty(currentSigner)
  const canRemoveSigners = totalSigners > ALLOWED_MIN_SIGNERS_LENGTH

  if (isEditingLastSigner && currentSignerFilled && canAddMoreSigners) {
    // Add new empty signer when last field is filled
    form.signers.push(undefined)
  } else if (isEditingSecondLastSigner && currentSignerEmpty && canRemoveSigners) {
    // Remove last signer when second last field is emptied
    form.signers.pop()
  }
}

function processForm(): ProcessedForm {
  const processedForm: ProcessedForm = {
    name: form.name,
    signers: form.signers.filter((s) => s !== undefined) as string[],
    minApprovalCount: form.minApprovalCount,
    passwordHash: toSolidityPackedKeccak256Hash(form.password, form.salt),
  }
  return processedForm
}

async function handleCreateSubmission() {
  try {
    formSchema().validateSync(form, { abortEarly: false }) // validate

    startLoading()
    const { name, signers, minApprovalCount, passwordHash } = processForm()
    const walletAddr = await createWallet(name, signers, minApprovalCount, passwordHash)
    const message = `Wallet created with address "${formatEthAddr(walletAddr)}".`
    showToast(ToastType.Success, message, 10 * 1000)
    navigateToWalletShow({ walletAddr })
  } catch (error) {
    let messages: string[] = []
    if (error instanceof ValidationError) messages = error.errors
    else if (error instanceof Error) messages = [error.message]
    else messages = ['Wallet creation failed.']
    showErrorToasts(messages)
  } finally {
    stopLoading()
  }
}
</script>
