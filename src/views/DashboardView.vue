<template>
  <AuthLayout>
    <div class="flex flex-col items-start md:flex-row">
      <WalletIndex
        class="w-full md:basis-1/4"
        v-model:keyword="walletStore.keyword"
        v-model:currentPage="walletStore.currentPage"
        v-model:selectedWallet="walletStore.selectedWallet"
        v-bind:wallets="walletStore.wallets"
        @onSelect="() => navigateToWalleShow()"
        @onDeselect="() => navigateToDashboard()"
        @onPaginate="() => navigateToDashboard()"
        @onFind="() => fetchAndNavigateToWalletShow()"
      />
      <div class="flex w-full flex-col md:basis-3/4">
        <WalletMenu />
        <router-view />
      </div>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import AuthLayout from '@/layouts/AuthLayout.vue'
import WalletIndex from '@/components/wallets/WalletIndex.vue'
import WalletMenu from '@/components/wallets/WalletMenu.vue'
import { useWalletStore } from '@/stores/wallet.store'
import { useWalletInteraction } from '@/composables/wallets/walletInteraction.composable'
import { useRoute, useRouter } from 'vue-router'
import { RouteName } from '@/enums/route.enums'
import { isInstanceOf } from '@/utils/boolean.utils'
import { showToast } from '@/helpers/toast.helpers'
import { ToastType } from '@/enums/toast.enums'
import { useAppUI } from '@/composables/appUI.composable'

library.add(faLink)

const walletStore = useWalletStore()
const route = useRoute()
const router = useRouter()
const { withLoading, startLoading, stopLoading } = useAppUI()
const { syncWalletStoreWithRoute, fetchPaginatedWallets, fetchWalletByAddr } =
  useWalletInteraction()

watch(
  () => [route.name, route.query.page],
  async ([routeName, page]) => {
    if (routeName === RouteName.Dashboard) {
      withLoading(async () => await syncWalletStoreWithRoute())
    } else if (routeName === RouteName.WalletCreate) walletStore.selectedWallet = undefined
  },
  { immediate: true, deep: true },
)

function navigateToWalleShow() {
  router.push({
    name: RouteName.WalletShow,
    params: { walletAddr: walletStore.selectedWallet!.address },
  })
}

async function navigateToDashboard() {
  console.log('passed 1')
  router.push({ name: RouteName.Dashboard, query: { page: walletStore.currentPage } })
  console.log('passed 2')
}

async function fetchAndNavigateToWalletShow() {
  try {
    startLoading()
    const wallet = await fetchWalletByAddr(walletStore.keyword!)
    walletStore.selectedWallet = wallet
    navigateToWalleShow()
  } catch (error) {
    if (isInstanceOf(error, Error)) showToast(ToastType.Error, error.message)
    else throw Error
  } finally {
    stopLoading()
  }
}
</script>
