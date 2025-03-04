<template>
  <teleport to="#sidebars">
    <section
      id="sidebar"
      class="fixed top-0 bottom-0 left-0 flex w-full transform flex-col justify-between gap-y-8 overflow-y-auto bg-slate-700 py-8 font-serif transition-transform duration-300 md:w-64 md:translate-x-0 md:gap-y-16 md:py-8"
      :class="{ '-translate-x-full': !appStore.isSidebarOpened }"
      style="scrollbar-width: none"
    >
      <header
        class="flex items-center justify-between gap-x-2 px-4 text-slate-200 md:px-4 md:text-nowrap"
      >
        <div class="inline-flex items-center gap-x-2">
          <FontAwesomeIcon icon="wallet" class="text-2xl" />
          <h1 class="text-xl font-bold">Fortified Wallet</h1>
        </div>
        <button class="md:hidden" @click="appStore.toggleSidebar">
          <FontAwesomeIcon icon="xmark" class="text-2xl" />
        </button>
      </header>
      <ul class="flex grow flex-col gap-y-2 text-slate-300 md:gap-y-5">
        <!-- TODO: implements dynamic active route with `getRootRoute()!.name === menu.routeName` or any other ways -->
        <SidebarItem
          :isActive="false"
          :icon="faHouse"
          text="0xDashboard"
          @onClick="() => router.push({ name: RouteName.Dashboard })"
        />
        <SidebarItem
          :isActive="false"
          :icon="faCoins"
          text="0xTokens"
          @onClick="() => router.push({ name: RouteName.TokenIndex })"
        />
        <SidebarItem
          :isActive="false"
          :icon="faRightLeft"
          text="0xTransactions"
          @onClick="() => router.push({ name: RouteName.TransactionIndex })"
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
import { useAppStore } from '@/stores/app.store'
import SidebarItem from '@/components/SidebarItem.vue'
import { RouteName } from '@/enums/route.enums'

const router = useRouter()

library.add(faWallet, faHouse, faCoins, faRightLeft, faXmark)

defineComponent({
  name: 'Sidebar',
})

let appStore = useAppStore()
</script>
