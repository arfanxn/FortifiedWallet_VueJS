<template>
  <section class="flex flex-col bg-slate-300 text-slate-700 outline-1">
    <header class="inline-flex items-center justify-between px-4 py-4 md:px-4">
      <h2 class="text-lg font-bold">Transfer</h2>
    </header>

    <form
      class="grid items-start justify-between gap-4 px-4 py-4 md:grid-cols-2"
      @submit.prevent="onSubmit"
    >
      <TextFieldC
        class="md:col-span-1"
        v-model="form.sender"
        :disabled="true"
        label="Sender"
        name="sender"
        placeholder="0x..."
      />
      <TextFieldC
        class="md:col-span-1"
        v-model="form.receiver"
        label="Receiver"
        name="receiver"
        placeholder="0x..."
      />
      <TextFieldC
        class="md:col-span-1"
        v-model="form.token"
        label="Token"
        name="token"
        placeholder="0x..."
      />
      <TextFieldC
        class="md:col-span-1"
        v-model="form.amount"
        label="Amount"
        name="amount"
        placeholder="0.777"
      />

      <div class="flex justify-between gap-x-4">
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
import { defineComponent, reactive, computed } from 'vue'
import TextFieldC from '@/components/TextFieldC.vue'
import ButtonC from '@/components/ButtonC.vue'
import { useVuelidate } from '@vuelidate/core'
import { numeric, helpers } from '@vuelidate/validators'
import { validateAndToast } from '@/helpers/validator.helpers'
import { notEmpty } from '@/utils/string.utils'
import { faPlus, faRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'

library.add(faPlus, faRotateLeft)

defineComponent({
  name: 'WalletCreate',
})

const form = reactive({
  sender: '0x111',
  receiver: '0x222',
  token: '0x333',
  amount: 0.777,
})

const rules = computed(() => ({
  sender: {
    validFormat: helpers.withMessage(
      'Sender address must be valid Ethereum address.',
      (address) => notEmpty(address) && /^0x[a-fA-F0-9]{40}$/.test(address),
    ),
  },
  receiver: {
    validFormat: helpers.withMessage(
      'Receiver address must be valid Ethereum address.',
      (address) => notEmpty(address) && /^0x[a-fA-F0-9]{40}$/.test(address),
    ),
  },
  token: {
    validFormat: helpers.withMessage(
      'Token address must be valid ERC20 address.',
      (address) => notEmpty(address) && /^0x[a-fA-F0-9]{40}$/.test(address),
    ),
  },
  amount: {
    numeric,
    //   helpers.withMessage(
    //   'Amount must be a positive number.',
    //   (amount) => notEmpty(amount) && amount > 0,
    // )
  },
}))

const v$ = useVuelidate(rules, form)

async function onSubmit() {
  const isValid = await validateAndToast(v$)
  if (!isValid) return

  console.log('success submitting')
}
</script>
