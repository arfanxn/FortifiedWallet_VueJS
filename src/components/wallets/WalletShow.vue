<template>
  <section class="flex flex-col bg-slate-300 text-slate-700">
    <header class="inline-flex items-center justify-between px-4 py-4 md:px-4">
      <h2 class="text-lg font-bold">Details</h2>
    </header>

    <main
      class="flex flex-col items-start gap-4 px-4 py-4 font-semibold md:flex-row"
      v-if="walletStore.selectedWallet && !isLoading"
    >
      <div class="flex basis-1/3 flex-col gap-y-2">
        <div class="flex flex-col gap-y-0.5">
          <h2>Name</h2>
          <span>{{ walletStore.selectedWallet.name }}</span>
        </div>

        <div class="flex flex-col gap-y-0.5">
          <h2>Total balance</h2>
          <span class="inline-flex items-center">
            <FontAwesomeIcon :icon="faDollarSign" class="text-sm" />
            <span>{{ formatUsd(walletStore.selectedWallet.totalBalanceInUsd) }}</span>
          </span>
        </div>

        <div class="flex flex-col gap-y-0.5">
          <h2>Min approvals</h2>
          <span>{{ walletStore.selectedWallet.minimumApprovals }}</span>
        </div>
      </div>

      <div class="flex basis-2/3 flex-col gap-y-2">
        <div class="flex flex-col gap-y-0.5">
          <h2>Address</h2>
          <span class="font-mono break-all whitespace-pre-wrap">{{
            walletStore.selectedWallet.address
          }}</span>
        </div>

        <ul class="flex flex-col gap-y-0.5">
          <h2>Signers</h2>
          <li
            class="flex gap-x-2 font-mono"
            v-for="(signer, index) in walletStore.selectedWallet.signers"
            :key="index"
          >
            <span class="min-w-[1rem]">{{ index + 1 }}.</span>
            <span class="break-all whitespace-pre-wrap">{{ signer }}</span>
          </li>
        </ul>
      </div>
    </main>
    <main
      v-else-if="!walletStore.selectedWallet && !isLoading"
      class="flex items-center justify-center gap-4 px-4 py-4 font-semibold md:flex-row"
    >
      <div class="flex min-w-80 flex-col items-center text-lg">
        <span class="mr-auto">Wallet</span>
        <span class="font-mono italic">{{ route.params.walletAddr }}</span>
        <span class="ml-auto">Does Not Exist.</span>
      </div>
    </main>
  </section>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue'
import { faDollarSign } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useWalletStore } from '@/stores/wallet.store'
import { library } from '@fortawesome/fontawesome-svg-core'
import { useRoute } from 'vue-router'
import { formatUsd } from '@/helpers/string.helpers'
import { useAppUI } from '@/composables/appUI.composable'

library.add(faDollarSign)

defineComponent({
  name: 'WalletShow',
})

const route = useRoute()

const walletStore = useWalletStore()
const { isLoading } = useAppUI()
</script>
