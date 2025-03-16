<template>
  <section class="flex flex-col bg-slate-300 text-slate-700">
    <header class="flex flex-row items-center gap-x-4 px-4 py-4 md:px-4">
      <LeftRigthSwitchButtonC
        v-model="lockOperation"
        :options="lockOperations"
        left="Lock"
        right="Unlock"
      />
    </header>

    <form
      class="grid grid-cols-1 items-start justify-between gap-4 px-4 py-4 md:grid-cols-4"
      @submit.prevent
    >
      <TextFieldC
        class="md:col-span-4"
        v-model="amount"
        label="Amount in USD (6 decimals)"
        name="amount"
        placeholder="7 or 7.0 or 0.7 or 0.000007"
      />
      <TextFieldC
        v-show="lockOperation === 'unlock'"
        class="md:col-span-2"
        v-model="password"
        label="Password"
        name="password"
        placeholder="Your password"
        type="password"
      />
      <TextFieldC
        v-show="lockOperation === 'unlock'"
        class="md:col-span-2"
        v-model="salt"
        label="Salt"
        name="salt"
        placeholder="Password salt"
      />
      <div class="flex justify-between gap-x-4 md:col-span-4">
        <ButtonC
          @onClick="() => resetForm()"
          type="button"
          :text="'Reset'"
          :icon="faRotateLeft"
          class="bg-red-700! text-slate-200! hover:bg-red-600! hover:text-slate-100!"
        />
        <ButtonC
          @onClick="() => handleLockOperationSubmission()"
          :icon="lockOperation === 'lock' ? faLock : faLockOpen"
          :text="lockOperation === 'lock' ? 'Lock' : 'Unlock'"
        />
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useForm } from 'vee-validate'
import { object, string, number } from 'yup'
import TextFieldC from '@/components/TextFieldC.vue'
import ButtonC from '@/components/ButtonC.vue'
import LeftRigthSwitchButtonC from '@/components/LeftRigthSwitchButtonC.vue'
import { faRotateLeft, faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { showErrorToasts, showToast } from '@/helpers/toastHelpers'
import { ToastType } from '@/enums/toastEnums'
import { useWalletInteraction } from '@/composables/wallets/useWalletInteraction'
import { ethers } from 'ethers'
import { formatUsd } from '@/helpers/stringHelpers'
import { useWalletNavigator } from '@/composables/wallets/useWalletNavigator'
import { useWalletStore } from '@/stores/useWalletStore'

library.add(faRotateLeft, faLock, faLockOpen)

const walletStore = useWalletStore()
const { lockWalletBalance, unlockWalletBalance } = useWalletInteraction()
const { navigateToWalletShow } = useWalletNavigator()

const lockOperations: ('lock' | 'unlock')[] = ['lock', 'unlock']
const lockOperation = ref<'lock' | 'unlock'>(lockOperations[0])

const validationSchema = computed(() =>
  object({
    amount: number()
      .typeError('Amount must be a number.')
      .required('Amount is required.')
      .moreThan(0, 'Amount must be greater than 0.'),
    password:
      lockOperation.value === 'lock'
        ? string().optional()
        : string()
            .required('Password is required.')
            .min(8, 'Password must be at least 8 characters.'),
    salt:
      lockOperation.value === 'lock'
        ? string().optional()
        : string().required('Salt is required.').length(64, 'Salt must be exactly 64 characters.'),
  }),
)
const { defineField, validate, resetForm } = useForm({
  validationSchema,
  name: 'LockForm',
})
const [amount] = defineField('amount')
const [password] = defineField('password')
const [salt] = defineField('salt')

function processForm() {
  return {
    amount: ethers.parseUnits(amount.value, 18),
    password: password.value,
    salt: salt.value,
  }
}

async function handleLockOperationSubmission() {
  const { valid, errors } = await validate()
  if (!valid) {
    showErrorToasts(Object.values(errors) as string[])
    return
  }

  try {
    const { amount, password, salt } = processForm()

    if (lockOperation.value === 'lock') await lockWalletBalance(amount)
    else await unlockWalletBalance(amount, password, salt)

    showToast(
      ToastType.Success,
      `Successfully ${lockOperation.value}ed ${formatUsd(amount, true)} of total balance.`,
    )
    navigateToWalletShow({ walletAddr: walletStore.selectedWallet!.address })
  } catch (error) {
    if (error instanceof Error) showToast(ToastType.Error, error.message)
    else throw error
  }
}
</script>
