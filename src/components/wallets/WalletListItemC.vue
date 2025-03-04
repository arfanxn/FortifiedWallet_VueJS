<template>
  <li
    class="inline-flex cursor-pointer items-center justify-start gap-x-4 px-4 py-2 hover:bg-slate-400 hover:text-slate-800"
    :class="{
      'bg-slate-700 text-slate-300 hover:bg-slate-700! hover:text-slate-300!':
        route.params.walletAddr === props.wallet.address,
    }"
    @click="() => onItemClick(props.wallet)"
  >
    <FontAwesomeIcon :icon="faUser" class="text-xl" />
    <div class="flex flex-col items-start overflow-hidden text-ellipsis">
      <span class="font-mono">{{ formatEthAddr(props.wallet.address) }}</span>
      <span class="inline-flex items-center">
        <FontAwesomeIcon :icon="faDollarSign" class="text-sm" />
        <span>{{ formatUsd(props.wallet.totalBalanceInUsd) }}</span>
      </span>
    </div>
  </li>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { useRoute } from 'vue-router'
import { formatEthAddr, formatUsd } from '@/helpers/string.helpers'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faDollarSign, faUser } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import type { Wallet } from '@/interfaces/wallet.interfaces'

library.add(faDollarSign, faUser)

const route = useRoute()

const emit = defineEmits(['onItemClick'])

interface Props {
  wallet: Wallet
}
const props = defineProps<Props>()

function onItemClick(wallet: Wallet) {
  emit('onItemClick', wallet)
}
</script>
