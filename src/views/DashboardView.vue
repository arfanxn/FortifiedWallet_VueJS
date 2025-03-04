<template>
  <AuthLayout>
    <div class="flex flex-col items-start md:flex-row">
      <WalletIndex
        class="w-full md:basis-1/4"
        defaultRouteName="dashboard"
        @onItemClick="(wallet: Wallet) => navigateToShowWallet(wallet)"
      />
      <div class="flex w-full flex-col md:basis-3/4">
        <WalletMenu />
        <router-view />
      </div>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import AuthLayout from '@/layouts/AuthLayout.vue'
import WalletIndex from '@/components/wallets/WalletIndex.vue'
import WalletMenu from '@/components/wallets/WalletMenu.vue'
import { onMounted } from 'vue'
import { Wallet } from '@/interfaces/wallet.interfaces'

library.add(faLink)

const router = useRouter()

onMounted(() => {})

function navigateToShowWallet(wallet: Wallet) {
  router.push({ name: 'wallet.show', params: { walletAddr: wallet.address } })
}

// function navigateBack() {
//   router.push({ name: 'dashboard' })
// }
</script>
