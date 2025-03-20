<template>
  <li
    class="flex w-full cursor-pointer flex-col px-4 py-2 transition-all duration-200 hover:bg-slate-400 hover:text-slate-800"
  >
    <div class="flex w-full">
      <div class="flex basis-7/12 flex-col gap-x-2 font-semibold">
        <span class="text-lg">{{ token.name }}</span>

        <div class="inline-flex gap-x-1">
          <span
            class="text-xs"
            @mouseenter="isAddressHovered = true"
            @mouseleave="isAddressHovered = false"
            >{{ isAddressHovered ? token.address : formatEthAddr(token.address) }}</span
          >
          <span class="text-xs">({{ token.symbol }})</span>
        </div>
      </div>

      <div class="flex basis-2/12 items-center">
        <FontAwesomeIcon :icon="faDollarSign" class="text-sm" />
        <span>{{ formatUsd(token.priceInUsd) }}</span>
      </div>

      <div class="flex basis-3/12 flex-row-reverse items-center">
        <FontAwesomeIcon :icon="faDollarSign" class="text-sm" />
        <span>{{ formatUsd(token.balanceInUsd) }}</span>
      </div>
    </div>

    <ButtonC
      v-if="isHovered"
      @onClick="() => handleRemoveTokenSubmission()"
      type="button"
      :icon="faTrash"
      class="ml-auto px-1 py-1 outline-slate-300! hover:text-slate-100!"
    />
  </li>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import ButtonC from '@/components/ButtonC.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { useWalletInteraction } from '@/composables/wallets/useWalletInteraction'
import {
  faArrowRightArrowLeft,
  faArrowRightLong,
  faCalendar,
  faCoins,
  faDollarSign,
  faHashtag,
  faHourglassHalf,
  faMinus,
  faEquals,
  faUserCheck,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { formatEthAddr, formatUsd } from '@/helpers/stringHelpers'
import { Wallet } from '@/interfaces/walletInterfaces'
import { showToast } from '@/helpers/toastHelpers'
import { ToastType } from '@/enums/toastEnums'
import { Token } from '@/interfaces/tokenInterfaces'
import { useTokenNavigator } from '@/composables/tokens/useTokenNavigator'
import { useTokenStore } from '@/stores/useTokenStore'

library.add(
  faArrowRightArrowLeft,
  faArrowRightLong,
  faCalendar,
  faCoins,
  faDollarSign,
  faHashtag,
  faHourglassHalf,
  faMinus,
  faEquals,
  faUserCheck,
  faTrash,
)

const props = defineProps<{
  wallet: Wallet
  token: Token
  isHovered: boolean
}>()

const tokenStore = useTokenStore()
const { removeToken } = useWalletInteraction()
const { navigateToTokenIndex } = useTokenNavigator()

const isAddressHovered = ref(false)

async function handleRemoveTokenSubmission() {
  try {
    const tokenAddr = props.token.address
    await removeToken(tokenAddr)
    tokenStore.keyword = undefined
    navigateToTokenIndex()
    showToast(ToastType.Success, `Successfully removed token with address ${tokenAddr}.`)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Token remove failed.'
    showToast(ToastType.Error, message)
  }
}
</script>
