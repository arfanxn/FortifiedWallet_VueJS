<template>
  <!-- Main authenticated layout wrapping wallet and transaction views -->
  <AuthLayout>
    <!-- Responsive container for wallet list and transaction content -->
    <div class="flex flex-col items-start md:flex-row">
      <!-- Wallet list sidebar with search and pagination controls -->
      <WalletIndex
        class="w-full md:basis-1/4"
        v-model:keyword="walletStore.keyword"
        v-model:currentPage="walletStore.currentPage"
        v-model:selectedWallet="walletStore.selectedWallet"
        :wallets="walletStore.wallets"
        @onSelect="navigateToTransactionIndex"
        @onDeselect="navigateToTransaction"
        @onPaginate="navigateToTransaction"
        @onFind="navigateToTransactionIndex"
      />

      <!-- Main content area for transaction views -->
      <div class="flex w-full flex-col md:basis-3/4">
        <!-- Dynamic view container for transaction details/index -->
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
import { useWalletStore } from '@/stores/useWalletStore'
import { useWalletInteraction } from '@/composables/wallets/useWalletInteraction'
import { useTransactionNavigator } from '@/composables/transactions/useTransactionNavigator'
import { useAppUI } from '@/composables/useAppUI'

library.add(faLink)

const walletStore = useWalletStore()
const { withLoading } = useAppUI()
const { navigateToTransaction, navigateToTransactionIndex } = useTransactionNavigator()
const { syncWalletStoreWithRoute, syncTransactionStoreWithRoute } = useWalletInteraction()

onMounted(() => {
  withLoading(async () => {
    await syncWalletStoreWithRoute()
    await syncTransactionStoreWithRoute()
  })
})
</script>
