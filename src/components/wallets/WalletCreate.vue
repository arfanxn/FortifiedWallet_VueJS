<template>
  <section class="flex flex-col bg-slate-300 text-slate-700">
    <header class="inline-flex items-center justify-between px-4 py-4 md:px-4">
      <h2 class="text-lg font-bold">Add</h2>
    </header>

    <form class="grid items-start gap-4 px-4 py-4 md:grid-cols-3" @submit.prevent="onSubmit">
      <div class="grid gap-4 md:col-span-1 md:row-span-4">
        <TextFieldC v-model="form.name" label="Name" name="name" placeholder="Main Wallet" />
        <TextFieldC
          v-model="form.minimumApprovals"
          label="Min approvals"
          name="minimumApprovals"
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
          v-model="form.signers[index]"
          @onInput="() => signerOnInput(index)"
          :disabled="index === 0"
          :label="`Signer ${index + 1}`"
          :name="`signer.${index}`"
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
        <ButtonC :text="'Add'" :icon="faPlus" class="" />
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { onMounted, defineComponent, reactive, computed, toRaw } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import {
  required,
  alphaNum,
  numeric,
  between,
  maxLength,
  minLength,
  helpers,
} from '@vuelidate/validators'
import { useEthereumStore } from '@/stores/useEthereumStore'
import { validateAndToast } from '@/helpers/validatorHelpers'
import { isEmpty, isEthAddr, isNotEmpty } from '@/utils/booleanUtils'
import { faPlus, faRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { useWalletInteraction } from '@/composables/wallets/useWalletInteraction'
import { showToast } from '@/helpers/toastHelpers'
import { formatEthAddr } from '@/helpers/stringHelpers'
import { ToastType } from '@/enums/toastEnums'
import TextFieldC from '@/components/TextFieldC.vue'
import ButtonC from '@/components/ButtonC.vue'
import { useAppUI } from '@/composables/useAppUI'
import { toSolidityPackedKeccak256Hash } from '@/helpers/ethersHelpers'
import { useWalletNavigator } from '@/composables/wallets/useWalletNavigator'

library.add(faPlus, faRotateLeft)

const ethereumStore = useEthereumStore()
const { startLoading, stopLoading } = useAppUI()
const { createWallet, fetchWalletByAddr } = useWalletInteraction()
const { navigateToWalletShow } = useWalletNavigator()

defineComponent({
  name: 'WalletCreate',
})

onMounted(() => {
  resetForm()
})

// Define constants for wallet creation constraints
const [minimumApprovalsRequired, minumumSigners, maximumSigners] = [2, 2, 10]

interface ProcessedForm {
  name: string
  signers: string[]
  minimumApprovals: number
  password: string
  passwordHash: string
  salt: string
}
interface Form {
  name: string
  signers: string[]
  minimumApprovals: number
  password: string
  salt: string
}
const form = reactive<Form>({
  name: '',
  signers: [],
  minimumApprovals: 0,
  password: '',
  salt: '',
})
const signersLength = computed(() => form.signers.length)
const signersLastIndex = computed(() => signersLength.value - 1)
const signersSecondLastIndex = computed(() => signersLength.value - 2)

const rules = computed(() => ({
  // The name of the wallet is required and must be alphanumeric.
  name: {
    required: helpers.withMessage('Name is required.', required),
    alphaNum: helpers.withMessage('Name must be alphanumeric.', alphaNum),
  },
  // The minimum number of approvals required is required, numeric, and between
  // the minimum number of signers (2) and the length of the signers array, which
  // is at least 2.
  minimumApprovals: {
    required: helpers.withMessage('Minimum approvals is required.', required),
    numeric: helpers.withMessage('Minimum approvals must be numeric.', numeric),
    between: helpers.withMessage(
      `Minimum approvals must be between ${minimumApprovalsRequired} and ${form.signers.length}.`,
      between(minimumApprovalsRequired, form.signers.length),
    ),
  },
  signers: {
    // Ensure that there are at least 2 signers
    minLength: helpers.withMessage(
      `Signers must be at least ${minumumSigners} provided.`,
      (signers: string[]) =>
        signersLength.value >= minumumSigners && isNotEmpty(signers[minumumSigners - 1]),
    ),
    // Ensure that there are no more than 10 signers
    maxLength: helpers.withMessage(
      `Signers cannot be longer than ${maximumSigners} provided.`,
      maxLength(maximumSigners),
    ),
    // Validate each signer in the signers array by checking if it's in the correct Ethereum address format.
    // If it's the last signer and the signers array length is not at the minimum or maximum, return true to allow adding a new row.
    // Otherwise, check if the signer is not empty and matches the Ethereum address regex pattern.
    ethAddr: helpers.withMessage(
      'Signers must be valid Ethereum addresses.',
      (signers: string[]) => {
        return signers.every((signer: string, index: number) => {
          // If it's the last signer and the signers array length is not at the minimum or maximum, return true to allow adding a new row.
          const [isLastIndex, notMinLength, notMaxLength] = [
            index == signersLastIndex.value,
            signersLength.value != minumumSigners,
            signersLength.value != maximumSigners,
          ]
          if (isLastIndex && notMinLength && notMaxLength) return true

          // Validate the signer
          return isEthAddr(signer)
        })
      },
    ),
    // Ensure that each signer in the array is unique by checking if the current signer
    // appears in the array before its current position.
    unique: helpers.withMessage('Signers must be unique.', (signers: string[]) =>
      signers.every(
        // Check that the signer does not exist in any previous positions in the array.
        (signer, index) => !signers.slice(0, index).includes(signer),
      ),
    ),
  },
  password: {
    required: helpers.withMessage('Password is required.', required),
    minLength: helpers.withMessage('Password must be at least 8 characters.', minLength(8)),
  },
  salt: {
    required: helpers.withMessage('Salt is required.', required),
    exactLength: helpers.withMessage(
      'Salt must be exactly 32 characters.',
      (salt: string) => salt.length == 32,
    ),
  },
}))

const v$ = useVuelidate(rules, form)

/**
 * When a user inputs a signer, either add or remove a row from the form based on the input.
 * If the input is not empty, add a new row.
 * If the input is empty, remove the row.
 * This ensures that the form always has at least 2 signers, and never more than 10.
 * @param {number} index The index of the input field in the signers array.
 */
function signerOnInput(index: number) {
  const signer = form.signers[index]

  const indexIsLastSignersIndex = index == signersLastIndex.value
  const signerNotEmpty = isNotEmpty(signer)
  const signersLengthBelowMax = signersLength.value < maximumSigners

  const indexIsSecondLastSignersIndex = index == signersSecondLastIndex.value
  const signerIsEmpty = isEmpty(signer)
  const signersLengthAboveMin = signersLength.value > minumumSigners

  if (indexIsLastSignersIndex && signerNotEmpty && signersLengthBelowMax) form.signers.push('')
  else if (indexIsSecondLastSignersIndex && signerIsEmpty && signersLengthAboveMin)
    form.signers.splice(-1)
}

/**
 * Resets the form to its initial state, clearing the name and signers array
 * and setting the minimum approvals required back to the minimum of 2.
 */
function resetForm() {
  form.name = ''
  form.signers = [ethereumStore.activeAccount, '']
  form.minimumApprovals = minimumApprovalsRequired
  form.password = ''
  form.salt = ''
}

function processForm() {
  let { name, signers, minimumApprovals, password, salt } = toRaw(form)

  signers = signers.filter((signer, index) => {
    if (index == signersLastIndex.value && isEmpty(signer)) return false
    return true
  })

  const passwordHash = toSolidityPackedKeccak256Hash(password, salt)

  const processedForm: ProcessedForm = {
    name,
    signers,
    minimumApprovals,
    password,
    passwordHash,
    salt,
  }
  return processedForm
}

async function onSubmit() {
  if (!(await validateAndToast(v$))) return
  handleCreateSubmission()
}

async function handleCreateSubmission() {
  try {
    startLoading()
    const { name, signers, minimumApprovals, passwordHash } = processForm()
    const walletAddr = await createWallet(name, signers, minimumApprovals, passwordHash)
    const message = `Wallet created with address "${formatEthAddr(walletAddr)}".`
    showToast(ToastType.Success, message, 10 * 1000)
    navigateToWalletShow({ walletAddr })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Wallet creation failed.'
    showToast(ToastType.Error, message)
  } finally {
    stopLoading()
  }
}
</script>
