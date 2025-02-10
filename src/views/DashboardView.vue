<template>
  <AuthLayout>
    <main class="flex">
      <WalletList @walletOnClick="(address) => showWallet(address)" />
      <div class="flex w-full flex-col">
        <WalletMenu />
        <WalletCreate v-if="route.query.menu === 'create'" />
        <WalletDeposit v-else-if="route.query.menu === 'deposit'" />
        <WalletTransfer v-else-if="route.query.menu === 'transfer'" />
        <WalletShow v-else-if="route.query.menu === 'show'" />
      </div>
    </main>
  </AuthLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { useRoute, useRouter } from 'vue-router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faLink } from '@fortawesome/free-solid-svg-icons'
// import { useEthereumStore } from '@/stores/ethereum.store.js'
import WalletList from '@/components/dashboards/WalletList.vue'
import WalletMenu from '@/components/dashboards/WalletMenu.vue'
import WalletCreate from '@/components/dashboards/WalletCreate.vue'
import WalletDeposit from '@/components/dashboards/WalletDeposit.vue'
import WalletShow from '@/components/dashboards/WalletShow.vue'
import WalletTransfer from '@/components/dashboards/WalletTransfer.vue'

library.add(faLink)

const route = useRoute()
const router = useRouter()

// let ethereumStore = useEthereumStore()

onMounted(() => {})

function showWallet(address) {
  router.push({ path: '/', query: { menu: 'show' , wallet: address} })
}
</script>
