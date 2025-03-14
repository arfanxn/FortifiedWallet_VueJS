<template>
  <teleport to="#sidebars">
    <section
      id="sidebar"
      class="fixed top-0 bottom-0 left-0 flex w-full transform flex-col justify-between gap-y-8 overflow-y-auto bg-slate-700 py-8 font-serif transition-transform duration-300 md:w-64 md:translate-x-0 md:gap-y-16 md:py-8"
      :class="{ '-translate-x-full': !uiStore.isSidebarOpened }"
      style="scrollbar-width: none"
    >
      <header
        class="flex items-center justify-between gap-x-2 px-4 text-slate-200 md:px-4 md:text-nowrap"
      >
        <div class="inline-flex items-center gap-x-2">
          <FontAwesomeIcon icon="wallet" class="text-2xl" />
          <h1 class="text-xl font-bold">Fortified Wallet</h1>
        </div>
        <button class="md:hidden" @click="uiStore.toggleSidebar">
          <FontAwesomeIcon icon="xmark" class="text-2xl" />
        </button>
      </header>
      <ul class="flex grow flex-col gap-y-2 text-slate-300 md:gap-y-5">
        <SidebarListItem
          :isActive="$route.matched[0]?.name === RouteName.Dashboard"
          :icon="faHouse"
          text="0xDashboard"
          @onClick="() => navigateToDashboard()"
        />
        <SidebarListItem
          :isActive="$route.matched[0]?.name === RouteName.TokenIndex"
          :icon="faCoins"
          text="0xTokens"
          @onClick="() => router.push({ name: RouteName.TokenIndex })"
        />
        <SidebarListItem
          :isActive="$route.matched[0]?.name === RouteName.Transaction"
          :icon="faRightLeft"
          text="0xTransactions"
          @onClick="() => navigateToTransaction()"
        />
      </ul>
      <footer class="inline-flex items-center justify-center px-4 md:px-4">
        <span class="text-xs text-slate-400">Copyright © 2025 Fortified Wallet.</span>
      </footer>
    </section>
  </teleport>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faWallet, faHouse, faCoins, faRightLeft, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useUIStore } from '@/stores/ui.store'
import SidebarListItem from '@/components/SidebarListItem.vue'
import { RouteName } from '@/enums/route.enums'
import { useWalletInteraction } from '@/composables/wallets/walletInteraction.composable'
import { useWalletNavigator } from '@/composables/wallets/useWalletNavigator'
import { useTransactionNavigator } from '@/composables/transactions/useTransactionNavigator'

const router = useRouter()
const uiStore = useUIStore()
const { navigateToDashboard } = useWalletNavigator()
const { navigateToTransaction } = useTransactionNavigator()

library.add(faWallet, faHouse, faCoins, faRightLeft, faXmark)

defineComponent({
  name: 'Sidebar',
})
</script>
