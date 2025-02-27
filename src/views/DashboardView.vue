<template>
  <AuthLayout>
    <div class="flex flex-col items-start md:flex-row">
      <WalletList class="w-full md:basis-1/4" @walletOnClick="(address) => showWallet(address)" />
      <div class="flex w-full flex-col md:basis-3/4">
        <WalletMenu />
        <WalletCreate v-if="route.query.menu === 'create'" />
        <WalletDeposit v-else-if="route.query.menu === 'deposit'" />
        <WalletTransfer v-else-if="route.query.menu === 'transfer'" />
        <WalletShow v-else-if="route.query.menu === 'show'" />
      </div>
    </div>
  </AuthLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { useRoute, useRouter } from 'vue-router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import WalletList from '@/components/dashboards/WalletList.vue'
import WalletMenu from '@/components/dashboards/WalletMenu.vue'
import WalletCreate from '@/components/dashboards/WalletCreate.vue'
import WalletDeposit from '@/components/dashboards/WalletDeposit.vue'
import WalletShow from '@/components/dashboards/WalletShow.vue'
import WalletTransfer from '@/components/dashboards/WalletTransfer.vue'

library.add(faLink)

const route = useRoute()
const router = useRouter()

onMounted(() => {})

function showWallet(address) {
  router.push({ path: '/', query: { menu: 'show', wallet: address } })
}
</script>
