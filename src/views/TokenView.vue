<template>
  <AuthLayout>
    <div class="flex flex-col items-start md:flex-row">
      <WalletIndex
        class="w-full md:basis-1/4"
        v-model:keyword="walletStore.keyword"
        v-model:currentPage="walletStore.currentPage"
        v-model:selectedWallet="walletStore.selectedWallet"
        :wallets="walletStore.wallets"
        @onSelect="navigateToTokenIndex"
        @onDeselect="navigateToToken"
        @onPaginate="navigateToToken"
        @onFind="navigateToTokenIndex"
      />

      <div class="flex w-full flex-col md:basis-3/4">
        <router-view />
      </div>
    </div>
  </AuthLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import WalletIndex from '@/components/wallets/WalletIndex.vue'
import { useWalletStore } from '@/stores/useWalletStore'
import { useWalletInteraction } from '@/composables/wallets/useWalletInteraction'
import { useTokenNavigator } from '@/composables/tokens/useTokenNavigator'
import { useAppUI } from '@/composables/useAppUI'

const walletStore = useWalletStore()
const { withLoading } = useAppUI()
const { navigateToToken, navigateToTokenIndex } = useTokenNavigator()
const { syncWalletStoreWithRoute, syncTokenStoreWithRoute } = useWalletInteraction()

onMounted(async () => {
  await withLoading(async () => {
    await syncWalletStoreWithRoute()
    await syncTokenStoreWithRoute()
  })
})
</script>
