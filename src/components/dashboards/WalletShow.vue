<template>
  <section class="flex flex-col bg-slate-300 text-slate-700 outline-1">
    <header class="inline-flex items-center justify-between px-4 py-4 md:px-4">
      <h2 class="text-lg font-bold">Details</h2>
    </header>

    <main class="flex flex-col items-start gap-4 px-4 py-4 font-semibold md:flex-row">
      <div class="flex basis-1/3 flex-col gap-y-2">
        <div class="flex flex-col gap-y-0.5">
          <h2>Name</h2>
          <span>{{ `Main Wallet` }}</span>
        </div>

        <div class="flex flex-col gap-y-0.5">
          <h2>Total balance</h2>
          <span>{{ `$999` }}</span>
        </div>

        <div class="flex flex-col gap-y-0.5">
          <h2>Min approvals</h2>
          <span>{{ `2` }}</span>
        </div>
      </div>

      <div class="flex basis-2/3 flex-col gap-y-2">
        <div class="flex flex-col gap-y-0.5">
          <h2 class="font-bold">Address</h2>
          <span class="font-semibold">{{ `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb9226` }}</span>
        </div>

        <ul class="flex flex-col gap-y-0.5">
          <h2 class="font-bold">Signers</h2>
          <li
            class="inline-flex gap-x-2 font-semibold"
            v-for="(signer, index) in [
              '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92261',
              '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92262',
              '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92263',
            ]"
            :key="index"
          >
            <span>{{ index + 1 }}.</span>
            <span>{{ signer }}</span>
          </li>
        </ul>
      </div>
    </main>
  </section>
</template>

<script setup>
import { defineComponent } from 'vue'
import { faPlus, faRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'

library.add(faPlus, faRotateLeft)

// let ethereumStore = useEthereumStore()

defineComponent({
  name: 'WalletShow',
})
</script>
