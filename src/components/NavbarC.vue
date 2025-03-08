<template>
  <teleport to="#navbars">
    <nav
      id="navbar"
      class="fixed top-0 right-0 left-0 flex items-center justify-between border-b-2 border-slate-700 bg-slate-300 px-4 py-6 text-slate-700 md:px-8"
    >
      <div>
        <span class="md:hidden"><FontAwesomeIcon icon="wallet" class="text-2xl" /></span>
        <span class="hidden md:block"
          ><h1 class="text-xl font-bold">
            {{ $route.matched[0]?.meta?.title }}
          </h1></span
        >
      </div>

      <div class="inline-flex gap-x-4 md:gap-x-6">
        <router-link to="/notifications">
          <FontAwesomeIcon icon="bell" class="text-xl" />
        </router-link>
        <NavbarDropdown />
        <button class="md:hidden" @click="appStore.toggleSidebar">
          <FontAwesomeIcon :icon="faBars" class="text-xl" />
        </button>
      </div>
    </nav>
  </teleport>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import NavbarDropdown from '@/components/NavbarDropdown.vue'
import { IconDefinition, library } from '@fortawesome/fontawesome-svg-core'
import { faBell, faUser, faGear, faLinkSlash, faBars } from '@fortawesome/free-solid-svg-icons'
import { useAppStore } from '@/stores/app.store'

library.add(faBell, faUser, faGear, faLinkSlash, faBars)

defineComponent({
  name: 'NavbarC',
})

let appStore = useAppStore()
</script>
