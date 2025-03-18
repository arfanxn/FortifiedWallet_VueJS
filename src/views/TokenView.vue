<template>
  <AuthLayout>
    <div>
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
    </div>
  </AuthLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import WalletIndex from '@/components/wallets/WalletIndex.vue'

onMounted(() => {})
</script>
