<template>
  <section class="flex flex-col bg-slate-300 text-slate-700">
    <header class="inline-flex items-center justify-between px-4 py-4 md:px-4">
      <h2 class="text-lg font-bold">Transfer</h2>
    </header>

    <form
      class="grid grid-cols-1 items-start justify-between gap-4 px-4 py-4 md:grid-cols-2"
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

<script setup lang="ts">
import { defineComponent, reactive, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { numeric, helpers } from '@vuelidate/validators'
import { isValidAddr, validateAndToast } from '@/helpers/validator.helpers'
import { faPlus, faRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import TextFieldC from '@/components/TextFieldC.vue'
import ButtonC from '@/components/ButtonC.vue'

library.add(faPlus, faRotateLeft)

defineComponent({
  name: 'WalletCreate',
})

interface Form {
  sender: string
  receiver: string
  token: string
  amount: number
}
const form = reactive<Form>({
  sender: '0x111',
  receiver: '0x222',
  token: '0x333',
  amount: 0.777,
})

const rules = computed(() => ({
  sender: {
    validAddr: helpers.withMessage(
      'Sender address must be valid Ethereum address.',
      (addr: string) => isValidAddr(addr),
    ),
  },
  receiver: {
    validAddr: helpers.withMessage(
      'Receiver address must be valid Ethereum address.',
      (addr: string) => isValidAddr(addr),
    ),
  },
  token: {
    validAddr: helpers.withMessage('Token address must be valid ERC20 address.', (addr: string) =>
      isValidAddr(addr),
    ),
  },
  amount: {
    numeric,
    //   helpers.withMessage(
    //   'Amount must be a positive number.',
    //   (amount) => isNotEmpty(amount) && amount > 0,
    // )
  },
}))

const v$ = useVuelidate(rules, form)

function resetForm(): void {}

async function onSubmit() {
  const isValid = await validateAndToast(v$)
  if (!isValid) return
}
</script>
