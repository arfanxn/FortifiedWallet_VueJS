<template>
  <section class="flex flex-col bg-slate-300 text-slate-700 outline-1">
    <header class="inline-flex items-center justify-between px-4 py-4 md:px-4">
      <h2 class="text-lg font-bold">Details</h2>
    </header>

    <main class="flex flex-col items-start gap-4 px-4 py-4 font-semibold md:flex-row">
      <div class="flex basis-1/3 flex-col gap-y-2">
        <div class="flex flex-col gap-y-0.5">
          <h2>Name</h2>
          <span>{{ wallet.name }}</span>
        </div>

        <div class="flex flex-col gap-y-0.5">
          <h2>Total balance</h2>
          <span>{{ wallet.totalBalanceInUsd }}</span>
        </div>

        <div class="flex flex-col gap-y-0.5">
          <h2>Min approvals</h2>
          <span>{{ wallet.minimumApprovals }}</span>
        </div>
      </div>

      <div class="flex basis-2/3 flex-col gap-y-2">
        <div class="flex flex-col gap-y-0.5">
          <h2 class="font-bold">Address</h2>
          <span class="font-semibold">{{ wallet.address }}</span>
        </div>

        <ul class="flex flex-col gap-y-0.5">
          <h2 class="font-bold">Signers</h2>
          <li
            class="inline-flex gap-x-2 font-semibold"
            v-for="(signer, index) in wallet.signers"
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
import { computed, defineComponent } from 'vue'
import { faPlus, faRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { useWalletStore } from '@/stores/wallet.store'
import { library } from '@fortawesome/fontawesome-svg-core'
import { useRoute } from 'vue-router'

library.add(faPlus, faRotateLeft)

defineComponent({
  name: 'WalletShow',
})

const route = useRoute()

let walletStore = useWalletStore()

const wallet = computed(() => {
  return walletStore.wallets.find((wallet) => wallet.address == route.query.wallet)
})
</script>
