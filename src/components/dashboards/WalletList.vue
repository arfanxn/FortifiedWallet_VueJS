<template>
  <section class="flex flex-col bg-slate-300 text-slate-700 outline-1 md:w-64">
    <header class="inline-flex items-center justify-between px-4 py-4 outline-1 md:px-4">
      <h2 class="text-lg font-bold">Wallets</h2>
      <button class="cursor-pointer" @click="createWallet()">
        <FontAwesomeIcon :icon="faPlus" class="text-xl" />
      </button>
    </header>
    <ul class="flex flex-col gap-y-4">
      <li
        class="inline-flex cursor-pointer items-center justify-start gap-x-4 px-4 py-2 hover:bg-slate-400 hover:text-slate-800"
        :class="{
          'bg-slate-700 text-slate-300 hover:bg-slate-700! hover:text-slate-300!':
            route.query.wallet === walletAddress,
        }"
        v-for="(walletAddress, index) in Array(6)
          .fill('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb9226')
          .map((w, i) => w + i)"
        :key="index"
        @click="walletOnClick(walletAddress, index)"
      >
        <FontAwesomeIcon :icon="faUser" class="text-xl" />
        <div class="flex flex-col items-start overflow-hidden text-ellipsis">
          <span class="">{{ formatEthereumAddress(walletAddress) }}</span>
          <span class="inline-flex items-center"
            ><FontAwesomeIcon :icon="faDollarSign" class="text-sm" />{{ 0.111 }}
          </span>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { defineComponent, defineEmits } from 'vue'
import { useEthereumStore } from '@/stores/ethereum.store'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faDollarSign, faPlus, faUser } from '@fortawesome/free-solid-svg-icons'
import { formatEthereumAddress } from '@/utils/string.utils'
import { useRouter, useRoute } from 'vue-router'
library.add(faDollarSign, faPlus, faUser)

let ethereumStore = useEthereumStore()

const emit = defineEmits(['walletOnClick'])

const route = useRoute()
const router = useRouter()

defineComponent({
  name: 'WalletList',
})

function walletOnClick(walletAddress, index) {
  emit('walletOnClick', walletAddress, index)
}

async function createWallet() {
  router.push({ path: '/', query: { menu: 'create' } })
}
</script>
