<template>
  <nav class="flex grow items-center justify-between bg-slate-700 px-4 py-6 text-slate-200 md:px-8">
    <div>
      <span class="md:hidden"><FontAwesomeIcon icon="wallet" class="text-2xl" /></span>
      <span class="hidden md:block"
        ><h1 class="text-xl font-bold">
          {{ navigationStore.activeMenu.name }}
        </h1></span
      >
    </div>

    <div class="inline-flex gap-x-4 md:gap-x-6">
      <router-link to="">
        <FontAwesomeIcon icon="bell" class="text-xl" />
      </router-link>
      <router-link to="">
        <FontAwesomeIcon icon="user" class="text-xl" />
      </router-link>
      <button class="md:hidden" @click="navigationStore.toggleSidebar">
        <FontAwesomeIcon icon="bars" class="text-xl" />
      </button>
    </div>
  </nav>
</template>

<script setup>
import { defineComponent } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faWallet, faBell, faUser, faXmark, faBars } from '@fortawesome/free-solid-svg-icons'
import { useNavigationStore } from '@/stores/navigation.store.js'

library.add(faWallet, faBell, faUser, faXmark, faBars)

defineComponent({
  name: 'NavbarC',
})

let navigationStore = useNavigationStore()
</script>
