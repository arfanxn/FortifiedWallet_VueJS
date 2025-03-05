<template>
  <AuthLayout>
    <div class="flex flex-col items-start md:flex-row">
      <WalletIndex
        class="w-full md:basis-1/4"
        defaultRouteName="dashboard"
        @onItemClick="(wallet: Wallet) => navigateToShowWallet(wallet)"
        @onItemUnclick="() => navigateBack()"
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
import { RouteName } from '@/enums/route.enums'
import { useWalletStore } from '@/stores/wallet.store'

library.add(faLink)

const walletStore = useWalletStore()

const router = useRouter()

onMounted(() => {
  if (walletStore.wallet !== undefined) navigateToShowWallet(walletStore.wallet)
})

function navigateToShowWallet(wallet: Wallet) {
  router.push({ name: RouteName.WalletShow, params: { walletAddr: wallet.address } })
}

function navigateBack() {
  router.replace({ name: RouteName.Dashboard })
}
</script>
