<template>
  <teleport to="#sidebars">
    <section
      id="sidebar"
      class="fixed top-0 bottom-0 left-0 flex w-full transform flex-col justify-between gap-y-8 overflow-y-auto bg-slate-700 py-8 font-serif transition-transform duration-300 md:w-64 md:translate-x-0 md:gap-y-16 md:py-8"
      :class="{ '-translate-x-full': !navigationStore.isSidebarOpened }"
      style="scrollbar-width: none"
    >
      <header
        class="flex items-center justify-between gap-x-2 px-4 text-slate-200 md:px-4 md:text-nowrap"
      >
        <div class="inline-flex items-center gap-x-2">
          <FontAwesomeIcon icon="wallet" class="text-2xl" />
          <h1 class="text-xl font-bold">Fortified Wallet</h1>
        </div>
        <button class="md:hidden" @click="navigationStore.toggleSidebar">
          <FontAwesomeIcon icon="xmark" class="text-2xl" />
        </button>
      </header>
      <ul class="flex grow flex-col gap-y-2 text-slate-300 md:gap-y-5">
        <li
          class="px-4 py-2 transition-colors duration-200 hover:bg-slate-600 md:px-4 md:py-2"
          v-for="menu in navigationStore.menus"
          :key="menu.name"
          :class="{
            'border-r-6 border-slate-200 text-slate-200':
              getRootRoute($route).name === menu.routeName,
          }"
        >
          <router-link
            :to="{ name: menu.routeName }"
            class="inline-flex w-full items-center gap-x-2"
          >
            <FontAwesomeIcon :icon="menu.icon" class="text-xl" />
            <h2 class="text-lg">{{ menu.name }}</h2>
          </router-link>
        </li>
      </ul>
      <footer class="inline-flex items-center justify-center px-4 md:px-4">
        <span class="text-xs text-slate-400">Copyright © 2025 Fortified Wallet.</span>
      </footer>
    </section>
  </teleport>
</template>

<script setup>
import { defineComponent } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faWallet, faHouse, faCoins, faRightLeft, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useNavigationStore } from '@/stores/navigation.store.js'
import { getRootRoute } from '@/helpers/route.helpers'

library.add(faWallet, faHouse, faCoins, faRightLeft, faXmark)

defineComponent({
  name: 'SidebarC',
})

let navigationStore = useNavigationStore()
</script>
