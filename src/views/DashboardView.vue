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
        @onFind="navigateToWalletShow"
      />
      <div class="flex w-full flex-col md:basis-3/4">
        <WalletMenu />
        <router-view />
      </div>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import AuthLayout from '@/layouts/AuthLayout.vue'
import WalletIndex from '@/components/wallets/WalletIndex.vue'
import WalletMenu from '@/components/wallets/WalletMenu.vue'
import { useWalletStore } from '@/stores/useWalletStore'
import { useWalletInteraction } from '@/composables/wallets/useWalletInteraction'
import { useWalletNavigator } from '@/composables/wallets/useWalletNavigator'
import { useAppUI } from '@/composables/useAppUI'

// Initialize FontAwesome library
library.add(faLink)

const walletStore = useWalletStore()
const { withLoading } = useAppUI()
const { syncWalletStoreWithRoute } = useWalletInteraction()
const { navigateToDashboard, navigateToWalletShow } = useWalletNavigator()

onMounted(async () => {
  await withLoading(syncWalletStoreWithRoute)
})
</script>
