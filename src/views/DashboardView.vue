<template>
  <AuthLayout>
    <div class="flex flex-col items-start md:flex-row">
      <WalletList
        class="w-full md:basis-1/4"
        @walletOnClick="(walletAddr) => showWallet(walletAddr)"
      />
      <div class="flex w-full flex-col md:basis-3/4">
        <WalletMenu />
        <router-view />
      </div>
    </div>
  </AuthLayout>
</template>

<script setup>
import AuthLayout from '@/layouts/AuthLayout.vue'
import { useRouter } from 'vue-router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import WalletList from '@/components/dashboards/WalletList.vue'
import WalletMenu from '@/components/dashboards/WalletMenu.vue'

library.add(faLink)

const router = useRouter()

function showWallet(walletAddr) {
  router.push({ name: 'wallet.show', params: { walletAddr } })
}
</script>
