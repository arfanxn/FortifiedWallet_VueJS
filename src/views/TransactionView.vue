<template>
  <AuthLayout>
    <main class="flex items-start">
      <WalletIndex @walletOnClick="(wallet) => filterTransactionByWallet(wallet)" />
      <div class="flex w-full flex-col">
        <TransactionList />
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
import { useEthereumStore } from '@/stores/ethereum.store'
import WalletIndex from '@/components/wallets/WalletIndex.vue'
import TransactionList from '@/components/transactions/TransactionList.vue'

library.add(faLink)

const route = useRoute()
const router = useRouter()

let ethereumStore = useEthereumStore()

function filterTransactionByWallet(address) {
  router.push({ path: '/transactions', query: { wallet: address } })
}

onMounted(() => {})
</script>
