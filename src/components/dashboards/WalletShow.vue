<template>
  <section class="flex flex-col bg-slate-300 text-slate-700">
    <header class="inline-flex items-center justify-between px-4 py-4 md:px-4">
      <h2 class="text-lg font-bold">Details</h2>
    </header>

    <main
      class="flex flex-col items-start gap-4 px-4 py-4 font-semibold md:flex-row"
      v-if="isWalletFound"
    >
      <div class="flex basis-1/3 flex-col gap-y-2">
        <div class="flex flex-col gap-y-0.5">
          <h2>Name</h2>
          <span>{{ wallet?.name }}</span>
        </div>

        <div class="flex flex-col gap-y-0.5">
          <h2>Total balance</h2>
          <span class="inline-flex items-center">
            <FontAwesomeIcon :icon="faDollarSign" class="text-sm" />
            <span>{{ formatUsd(wallet?.totalBalanceInUsd ?? 0) }}</span>
          </span>
        </div>

        <div class="flex flex-col gap-y-0.5">
          <h2>Min approvals</h2>
          <span>{{ wallet?.minimumApprovals ?? 0 }}</span>
        </div>
      </div>

      <div class="flex basis-2/3 flex-col gap-y-2">
        <div class="flex flex-col gap-y-0.5">
          <h2>Address</h2>
          <span class="font-mono break-all whitespace-pre-wrap">{{ wallet?.address }}</span>
        </div>

        <ul class="flex flex-col gap-y-0.5">
          <h2>Signers</h2>
          <li
            class="flex gap-x-2 font-mono"
            v-for="(signer, index) in wallet?.signers"
            :key="index"
          >
            <span class="min-w-[1rem]">{{ index + 1 }}.</span>
            <span class="break-all whitespace-pre-wrap">{{ signer }}</span>
          </li>
        </ul>
      </div>
    </main>
    <main class="flex items-center justify-center gap-4 px-4 py-4 font-semibold md:flex-row" v-else>
      <h2 class="font-mono text-lg">
        Wallet
        <span class="font-mono">{{
          notEmpty(route.params.walletAddr) ? formatEthAddr(route.params.walletAddr) : ''
        }}</span>
        is not found.
      </h2>
    </main>
  </section>
</template>

<script setup>
import { computed, defineComponent } from 'vue'
import { faDollarSign } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useWalletStore } from '@/stores/wallet.store'
import { library } from '@fortawesome/fontawesome-svg-core'
import { useRoute } from 'vue-router'
import { formatEthAddr, formatUsd } from '@/helpers/string.helpers'
import { notEmpty } from '@/utils/string.utils'

library.add(faDollarSign)

defineComponent({
  name: 'WalletShow',
})

const route = useRoute()

let walletStore = useWalletStore()

const wallet = computed(() => {
  return walletStore.wallets.find((wallet) => wallet.address == route.params.walletAddr)
})

const isWalletFound = computed(() => {
  return notEmpty(wallet.value?.name)
})
</script>
