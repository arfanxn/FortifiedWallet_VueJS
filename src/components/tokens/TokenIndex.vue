<template>
  <section class="flex flex-col gap-y-4 bg-slate-300 text-slate-700">
    <header class="flex flex-col gap-y-6 px-4 pt-4">
      <div v-if="walletStore.selectedWallet" class="flex flex-col gap-y-2">
        <span
          class="font-mono font-semibold"
          @mouseenter="isWalletAddressHovered = true"
          @mouseleave="isWalletAddressHovered = false"
        >
          {{
            isWalletAddressHovered
              ? walletStore.selectedWallet?.address
              : formatEthAddr(walletStore.selectedWallet!.address)
          }}
        </span>

        <span class="inline-flex items-center text-3xl font-bold">
          <FontAwesomeIcon :icon="faDollarSign" class="text-3xl" />
          <span>{{ formatUsd(walletStore.selectedWallet.totalBalanceInUsd) }}</span>
        </span>

        <div class="flex flex-col gap-y-0.5 text-sm font-bold">
          <div class="inline-flex items-center gap-x-2 font-bold">
            <div class="inline-flex items-center gap-x-1">
              <FontAwesomeIcon :icon="faEthereum" class="w-4 text-lg" />
              <span>{{ ethers.formatUnits(walletEthBalance ?? 0, 18) }}</span>
            </div>
            <span class="inline-flex items-center gap-y-0.5">
              (
              <FontAwesomeIcon :icon="faDollarSign" />
              <span>{{ formatUsd(walletEthBalanceInUsd ?? 0) }}</span>
              )
            </span>
          </div>

          <div
            v-if="walletStore.selectedWallet.totalLockedBalanceInUsd !== 0n"
            class="inline-flex items-center gap-x-1 font-bold"
          >
            <FontAwesomeIcon :icon="faLock" class="w-4" />
            <span class="inline-flex items-center">
              <FontAwesomeIcon :icon="faDollarSign" />
              <span>{{ formatUsd(walletStore.selectedWallet.totalLockedBalanceInUsd) }}</span>
            </span>
          </div>

          <div
            v-if="walletStore.selectedWallet.totalLockedBalanceInUsd !== 0n"
            class="inline-flex items-center gap-x-1 font-bold"
          >
            <FontAwesomeIcon :icon="faLockOpen" class="w-4" />
            <span class="inline-flex items-center">
              <FontAwesomeIcon :icon="faDollarSign" />
              <span>{{ formatUsd(walletStore.selectedWallet.totalUnlockedBalanceInUsd) }}</span>
            </span>
          </div>
        </div>
      </div>

      <div class="flex w-full justify-between text-sm">
        <div class="relative">
          <h2 class="text-lg font-bold">Tokens</h2>
        </div>
      </div>
    </header>

    <form class="inline-flex px-4 md:gap-x-2" @submit.prevent>
      <TextFieldC
        @onKeyupEnter="async () => await handleFindSubmission()"
        v-model="tokenStore.keyword"
        class="grow"
        name="token_address"
        placeholder="Token address (0x...)"
      />
      <ButtonC
        @onClick="async () => await handleFindSubmission()"
        type="button"
        :icon="faMagnifyingGlass"
        class="rounded-lg outline-0!"
      />
      <ButtonC
        @onClick="async () => await validateAndNavigateToTokenAdd()"
        type="button"
        :icon="faPlus"
        class="rounded-lg outline-0!"
      />
    </form>

    <ul
      v-if="
        route.name === RouteName.TokenIndex &&
        walletStore.selectedWallet &&
        tokenStore.tokens.length > 0 &&
        !isLoading
      "
      class="flex flex-col items-start gap-y-4 font-medium"
    >
      <ul class="grid w-full grid-cols-[6fr_2fr_4fr] px-4 font-semibold">
        <li>Name</li>
        <li>Price</li>
        <li class="ml-auto">Balance</li>
      </ul>
      <TokenListItem
        v-for="(token, index) in tokenStore.tokens"
        :key="index"
        :wallet="walletStore.selectedWallet!"
        :token="token"
        :isHovered="hoveredTransactionIndex === index"
        @mouseenter="hoveredTransactionIndex = index"
        @mouseleave="hoveredTransactionIndex = null"
      />
    </ul>
    <!-- Message displayed when no wallets are found -->
    <div
      v-else-if="
        route.name === RouteName.TokenIndex && tokenStore.tokens.length === 0 && !isLoading
      "
      class="flex items-center justify-center"
    >
      <span class="text-lg font-semibold">No Token(s) Found.</span>
    </div>

    <div
      v-else-if="route.name === RouteName.TokenAdd && !isLoading"
      class="flex w-full cursor-pointer flex-col px-4 py-2 transition-all duration-200 hover:bg-slate-400 hover:text-slate-800"
    >
      <div v-if="tokenMetadataToAdd" class="flex w-full items-center justify-between">
        <div class="flex flex-col gap-x-2 font-semibold">
          <span class="text-lg">{{ tokenMetadataToAdd.name }}</span>

          <div class="inline-flex gap-x-1">
            <span class="text-xs">{{ tokenMetadataToAdd.address }}</span>
            <span class="text-xs">({{ tokenMetadataToAdd.symbol }})</span>
          </div>
        </div>

        <ButtonC
          @onClick="async () => await handleConfirmAddSubmission()"
          type="button"
          :icon="faCheck"
          class="ml-auto size-6! justify-center rounded-md! p-0! outline-none! hover:text-slate-100!"
        />
      </div>
    </div>

    <!-- Pagination controls -->
    <div
      v-if="route.name === RouteName.TokenIndex && !tokenStore.selectedToken"
      class="flex items-center justify-end gap-x-2 px-4"
    >
      <span class="mr-4 text-sm font-semibold">Page: {{ tokenStore.currentPage }}</span>
      <PaginationButtonC
        direction="prev"
        :disabled="tokenStore.currentPage === 1"
        @onClick="() => handlePaginate(tokenStore.currentPage - 1)"
      />
      <PaginationButtonC
        direction="next"
        :disabled="tokenStore.tokens.length === 0"
        @onClick="() => handlePaginate(tokenStore.currentPage + 1)"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { defineComponent, onUnmounted, ref, watchEffect } from 'vue'
import { string } from 'yup'
import { isNotEmpty, isString } from '@/utils/booleanUtils'
import { library } from '@fortawesome/fontawesome-svg-core'
import { useAppUI } from '@/composables/useAppUI'
import { useEthereumStore } from '@/stores/useEthereumStore'
import { useWalletStore } from '@/stores/useWalletStore'
import { useTokenStore } from '@/stores/useTokenStore'
import ButtonC from '@/components/ButtonC.vue'
import TextFieldC from '@/components/TextFieldC.vue'
import TokenListItem from '@/components/tokens/TokenListItem.vue'
import PaginationButtonC from '@/components/PaginationButtonC.vue'
import { showToast } from '@/helpers/toastHelpers'
import { ToastType } from '@/enums/toastEnums'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faArrowRightArrowLeft,
  faArrowRightLong,
  faCalendar,
  faCoins,
  faDollarSign,
  faHashtag,
  faMinus,
  faPlus,
  faMagnifyingGlass,
  faLock,
  faLockOpen,
  faCheck,
} from '@fortawesome/free-solid-svg-icons'
import { ethereumAddressSchema } from '@/validators/schemas/ethereumSchemas'
import { useTokenNavigator } from '@/composables/tokens/useTokenNavigator'
import { formatEthAddr, formatUsd } from '@/helpers/stringHelpers'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'
import { useWalletBalanceFetch } from '@/composables/wallets/useWalletBalanceFetch'
import { ethers } from 'ethers'
import { useRoute } from 'vue-router'
import { RouteName } from '@/enums/routeEnums'
import { useTokenMetadataFetch } from '@/composables/tokens/useTokenMetadataFetch'
import { useWalletInteraction } from '@/composables/wallets/useWalletInteraction'
import { TokenMetadata } from '@/interfaces/tokenInterfaces'

library.add(
  faArrowRightLong,
  faCoins,
  faHashtag,
  faMinus,
  faDollarSign,
  faArrowRightArrowLeft,
  faCalendar,
  faPlus,
  faMagnifyingGlass,
  faLock,
  faLockOpen,
  faEthereum,
  faCheck,
)

defineComponent({
  name: 'WalletShow',
})

const route = useRoute()
const ethereumStore = useEthereumStore()
const walletStore = useWalletStore()
const tokenStore = useTokenStore()
const { isLoading, startLoading, stopLoading } = useAppUI()
const { addToken } = useWalletInteraction()
const tokenMetadataToAdd = ref<TokenMetadata | undefined>()
const { fetchTokenMetadata: fetchTokenMetadataToAdd } = useTokenMetadataFetch()
const { navigateToTokenIndex, navigateToTokenAdd } = useTokenNavigator()
const {
  walletBalance: walletEthBalance,
  walletBalanceInUsd: walletEthBalanceInUsd,
  fetchWalletBalance,
} = useWalletBalanceFetch()

const hoveredTransactionIndex = ref<Number | null>(null)
const isWalletAddressHovered = ref(false)

const findLabel = 'Token address'
const keywordSchema = () =>
  isNotEmpty(tokenStore.keyword)
    ? string().label(findLabel).concat(ethereumAddressSchema())
    : string().label(findLabel).nullable()
const requiredKeywordSchema = () => keywordSchema().required('${label} is required.')

watchEffect(async () => {
  const wallet = walletStore.selectedWallet
  if (wallet) {
    await fetchWalletBalance(wallet.address)
  }
})

watchEffect(async () => {
  const routeName = route.name
  const tokenAddr = tokenStore.keyword
  if (routeName === RouteName.TokenAdd && isString(tokenAddr)) fetchTokenMetadataToAdd(tokenAddr)
})

onUnmounted(() => {
  tokenStore.reset()
})

async function handlePaginate(page: number) {
  tokenStore.currentPage = page
  navigateToTokenIndex()
}

async function handleFindSubmission() {
  try {
    startLoading()

    keywordSchema().validateSync(tokenStore.keyword)

    if (tokenStore.keyword) {
      navigateToTokenIndex({ tokenAddr: tokenStore.keyword })
    } else {
      navigateToTokenIndex()
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Token does not exist.'
    showToast(ToastType.Error, message)
  } finally {
    stopLoading()
  }
}

watchEffect(async () => {
  const routeName = route.name
  const tokenAddr = tokenStore.keyword
  if (routeName === RouteName.TokenAdd && isString(tokenAddr)) {
    try {
      requiredKeywordSchema().validateSync(tokenAddr)
      tokenMetadataToAdd.value = await fetchTokenMetadataToAdd(tokenAddr)
    } catch (error) {}
  }
})

async function validateAndNavigateToTokenAdd() {
  try {
    requiredKeywordSchema().validateSync(tokenStore.keyword)
    if (tokenStore.keyword) navigateToTokenAdd({ tokenAddr: tokenStore.keyword })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Token add failed.'
    showToast(ToastType.Error, message)
  }
}

async function handleConfirmAddSubmission() {
  try {
    if (tokenMetadataToAdd.value) {
      const tokenAddr = tokenMetadataToAdd.value.address
      await addToken(tokenAddr)
      tokenStore.keyword = undefined
      navigateToTokenIndex()
      showToast(ToastType.Success, `Successfully added token with address ${tokenAddr}.`)
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Token add failed.'
    showToast(ToastType.Error, message)
  }
}
</script>
