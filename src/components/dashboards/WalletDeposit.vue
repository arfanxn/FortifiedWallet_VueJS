<template>
  <section class="flex flex-col border-r-2 border-b-2 border-slate-600 bg-slate-300 text-slate-700">
    <header class="inline-flex items-center justify-between border-b-1 px-4 py-4 md:px-4">
      <h2 class="text-lg font-bold">Deposit</h2>
    </header>

    <form
      class="grid items-start justify-between gap-4 px-4 py-4 md:grid-cols-1"
      @submit.prevent="onSubmit"
    >
      <TextFieldC
        class="md:col-span-1"
        v-model="form.receiver"
        :disabled="true"
        label="Wallet"
        name="wallet"
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
// import { useEthereumStore } from '@/stores/ethereum.store'
import { validateAndToast } from '@/utils/validator.utils'
import { notEmpty } from '@/utils/string.utils'
import { faPlus, faRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'

library.add(faPlus, faRotateLeft)

// let ethereumStore = useEthereumStore()

defineComponent({
  name: 'WalletCreate',
})

const form = reactive({
  receiver: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  token: '0x333',
  amount: 0.777,
})

const rules = computed(() => ({
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
