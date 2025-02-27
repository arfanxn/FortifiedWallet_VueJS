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

<script setup>
import { defineComponent, reactive, computed, toRaw } from 'vue'
import TextFieldC from '@/components/TextFieldC.vue'
import ButtonC from '@/components/ButtonC.vue'
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
import { useBlockchainStore } from '@/stores/blockchain.store'
import { isValidAddr, validateAndToast } from '@/helpers/validator.helpers'
import { empty, notEmpty } from '@/utils/string.utils'
import { faPlus, faRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { useWallet } from '@/composables/wallet.composable'
import { ethers } from 'ethers'

library.add(faPlus, faRotateLeft)

let blockchainStore = useBlockchainStore()
const { createWallet } = useWallet()

defineComponent({
  name: 'WalletCreate',
})

// Define constants for wallet creation constraints
const [minimumApprovalsRequired, minumumSigners, maximumSigners] = [2, 2, 10]

const form = reactive({
  name: null,
  signers: [blockchainStore.activeAccount, null],
  minimumApprovals: minimumApprovalsRequired,
  password: null,
  salt: null,
})
const signersLength = computed(() => form.signers.length)
const signersLastIndex = computed(() => signersLength.value - 1)
const signersSecondLastIndex = computed(() => signersLength.value - 2)

const rules = computed(() => ({
  // The name of the wallet is required and must be alphanumeric.
  name: { required: helpers.withMessage('Name is required.', required), alphaNum },

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
      (signers) => signersLength.value >= minumumSigners && notEmpty(signers[minumumSigners - 1]),
    ),
    // Ensure that there are no more than 10 signers
    maxLength: helpers.withMessage(
      `Signers cannot be longer than ${maximumSigners} provided.`,
      maxLength(maximumSigners),
    ),

    // Validate each signer in the signers array by checking if it's in the correct Ethereum address format.
    // If it's the last signer and the signers array length is not at the minimum or maximum, return true to allow adding a new row.
    // Otherwise, check if the signer is not empty and matches the Ethereum address regex pattern.
    validAddr: helpers.withMessage('Signers must be valid Ethereum addresses.', (signers) => {
      return signers.every((signer, index) => {
        // If it's the last signer and the signers array length is not at the minimum or maximum, return true to allow adding a new row.
        const [isLastIndex, notMinLength, notMaxLength] = [
          index == signersLastIndex.value,
          signersLength.value != minumumSigners,
          signersLength.value != maximumSigners,
        ]
        if (isLastIndex && notMinLength && notMaxLength) return true

        // Validate the signer
        return isValidAddr(signer)
      })
    }),
  },
  password: {
    required: helpers.withMessage('Password is required.', required),
    minLength: helpers.withMessage('Password must be at least 8 characters.', minLength(8)),
  },
  salt: {
    required: helpers.withMessage('Salt is required.', required),
    minLength: helpers.withMessage('Salt must be at least 32 characters.', minLength(32)),
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
function signerOnInput(index) {
  const signer = form.signers[index]

  const indexIsLastSignersIndex = index == signersLastIndex.value
  const signerNotEmpty = notEmpty(signer)
  const signersLengthBelowMax = signersLength.value < maximumSigners

  const indexIsSecondLastSignersIndex = index == signersSecondLastIndex.value
  const signerIsEmpty = empty(signer)
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
  form.name = null
  form.signers = [blockchainStore.activeAccount, null]
  form.minimumApprovals = minimumApprovalsRequired
  form.password = null
  form.salt = null
}

async function onSubmit() {
  const isValid = await validateAndToast(v$)
  if (!isValid) return

  let { name, signers, minimumApprovals, password, salt } = toRaw(form)

  signers = signers.filter((signer, index) => {
    if (index == signersLastIndex.value && empty(signer)) return false
    return true
  })

  const passwordHash = ethers.solidityPackedKeccak256(['string', 'string'], [password, salt])

  createWallet({
    name,
    signers,
    minimumApprovals,
    passwordHash,
  })
}
</script>
