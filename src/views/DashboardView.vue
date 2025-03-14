<template>
  <AuthLayout>
    <div class="flex flex-col items-start md:flex-row">
      <WalletIndex
        class="w-full md:basis-1/4"
        v-model:keyword="walletStore.keyword"
        v-model:currentPage="walletStore.currentPage"
        v-model:selectedWallet="walletStore.selectedWallet"
        :wallets="walletStore.wallets"
        @onSelect="navigateToWalletShow"
        @onDeselect="navigateToDashboard"
        @onPaginate="navigateToDashboard"
        @onFind="fetchAndNavigateToWalletShow"
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

// Initialize FontAwesome library
library.add(faLink)

// ----------------------------
// Dependency Injection
// ----------------------------
const walletStore = useWalletStore()
const route = useRoute()
const router = useRouter()
const { withLoading, startLoading, stopLoading } = useAppUI()
const { syncWalletStoreWithRoute, fetchWalletByAddr } = useWalletInteraction()

// TODO: fix bug multiple calls to fetch actions

// ----------------------------
// Route Watcher
// ----------------------------
watch(
  () => [route.name, route.query.page],
  async (values, prevValues) => {
    const [routeName] = values
    const [prevRouteName] = prevValues ?? []

    if (typeof routeName !== 'string') return

    // Initial load handling
    if (!prevRouteName) {
      await withLoading(syncWalletStoreWithRoute)
      return
    }

    // Route-specific handling
    switch (routeName) {
      case RouteName.Dashboard:
        await withLoading(syncWalletStoreWithRoute)
        break
      case RouteName.WalletCreate:
        walletStore.selectedWallet = undefined
        break
    }
  },
  { immediate: true, deep: true },
)

// ----------------------------
// Navigation Handlers
// ----------------------------
const navigateToWalletShow = (): void => {
  if (!walletStore.selectedWallet) return
  router.push({
    name: RouteName.WalletShow,
    params: { walletAddr: walletStore.selectedWallet.address },
  })
}

const navigateToDashboard = (): void => {
  router.push({
    name: RouteName.Dashboard,
    query: { page: walletStore.currentPage },
  })
}

// ----------------------------
// Data Fetching
// ----------------------------
const fetchAndNavigateToWalletShow = async (): Promise<void> => {
  try {
    startLoading()
    const wallet = await fetchWalletByAddr(walletStore.keyword!)
    walletStore.selectedWallet = wallet
    navigateToWalletShow()
  } catch (error) {
    if (isInstanceOf(error, Error)) showToast(ToastType.Error, error.message)
    else throw error
  } finally {
    stopLoading()
  }
}
</script>
