<template>
  <AuthLayout>
    <div class="flex flex-col items-start md:flex-row">
      <WalletIndex
        class="w-full md:basis-1/4"
        @onWalletSelected="(selectedWallet) => navigateToWalletShow()"
        @onWalletDeselected="() => navigateToDashboard()"
      />
      <div class="flex w-full flex-col md:basis-3/4">
        <WalletMenu />
        <router-view />
      </div>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import { library } from '@fortawesome/fontawesome-svg-core'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import AuthLayout from '@/layouts/AuthLayout.vue'
import WalletIndex from '@/components/wallets/WalletIndex.vue'
import WalletMenu from '@/components/wallets/WalletMenu.vue'
import { onMounted } from 'vue'
import { useNavigation } from '@/composables/wallets/walletNavigator.composable'

library.add(faLink)

const { navigateToDashboard, navigateToWalletShow } = useNavigation()

onMounted(() => {})

// watch(
//   () => ({
//     selectedWallet: walletStore.selectedWallet,
//     keyword: walletStore.keyword,
//     currentPage: walletStore.currentPage,
//   }),
//   ({ selectedWallet, currentPage }) => {
//     if (selectedWallet) {
//       router.push({ name: RouteName.WalletShow, params: { walletAddr: selectedWallet.address } })
//     } else {
//       router.push({ name: RouteName.Dashboard, query: { page: currentPage } })
//     }
//   },
//   { deep: true },
// )
</script>
