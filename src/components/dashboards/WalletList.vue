<template>
  <section class="flex flex-col text-slate-700">
    <header class="inline-flex items-center justify-between bg-slate-300 px-4 py-4 md:px-4">
      <h2 class="text-lg font-bold">Wallets</h2>
      <button class="cursor-pointer" @click="createWallet()">
        <FontAwesomeIcon :icon="faPlus" class="text-xl" />
      </button>
    </header>
    <ul class="flex flex-col gap-y-4 bg-slate-300">
      <li
        class="inline-flex cursor-pointer items-center justify-start gap-x-4 px-4 py-2 hover:bg-slate-400 hover:text-slate-800"
        :class="{
          'bg-slate-700 text-slate-300 hover:bg-slate-700! hover:text-slate-300!':
            route.query.wallet === wallets[index].address,
        }"
        v-for="(wallet, index) in wallets"
        :key="index"
        @click="walletOnClick(wallet.address, index)"
      >
        <FontAwesomeIcon :icon="faUser" class="text-xl" />
        <div class="flex flex-col items-start overflow-hidden text-ellipsis">
          <span class="font-mono">{{ formatEthAddr(wallet.address) }}</span>
          <span class="inline-flex items-center">
            <FontAwesomeIcon :icon="faDollarSign" class="text-sm" />
            <span>{{ formatUsd(wallet.totalBalanceInUsd) }}</span>
          </span>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { defineComponent, defineEmits, onMounted } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faDollarSign, faPlus, faUser } from '@fortawesome/free-solid-svg-icons'
import { useWallet } from '@/composables/wallet.composable'
import { useRouter, useRoute } from 'vue-router'
import { formatEthAddr, formatUsd } from '@/helpers/string.helpers'
library.add(faDollarSign, faPlus, faUser)

const emit = defineEmits(['walletOnClick'])

const route = useRoute()
const router = useRouter()

defineComponent({
  name: 'WalletList',
})

const { fetchWallets, wallets } = useWallet()

onMounted(async () => {
  await fetchWallets()
})

function walletOnClick(walletAddr, index) {
  emit('walletOnClick', walletAddr, index)
}

async function createWallet() {
  router.push({ path: '/', query: { menu: 'create' } })
}
</script>
