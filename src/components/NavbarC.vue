<template>
  <nav
    class="flex grow items-center justify-between border-b-2 bg-slate-300 px-4 py-6 text-slate-700 md:px-8"
  >
    <div>
      <span class="md:hidden"><FontAwesomeIcon icon="wallet" class="text-2xl" /></span>
      <span class="hidden md:block"
        ><h1 class="text-xl font-bold">
          <!-- TODO: implement active menu getter{{ navigationStore.activeMenu.name }} -->
          {{ `Dashboard` }}
        </h1></span
      >
    </div>

    <div class="inline-flex gap-x-4 md:gap-x-6">
      <router-link to="/notifications">
        <FontAwesomeIcon icon="bell" class="text-xl" />
      </router-link>
      <DropdownMenuC :menus="state.menus"> </DropdownMenuC>
      <button class="md:hidden" @click="navigationStore.toggleSidebar">
        <FontAwesomeIcon :icon="faBars" class="text-xl" />
      </button>
    </div>
  </nav>
</template>

<script setup>
import { defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import DropdownMenuC from './DropdownMenuC.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBell, faUser, faGear, faLinkSlash, faBars } from '@fortawesome/free-solid-svg-icons'
import { useNavigationStore } from '@/stores/navigation.store.js'
import { useEthereumStore } from '@/stores/ethereum.store'
import { showToast } from '@/utils/toast.utils'

library.add(faBell, faUser, faGear, faLinkSlash, faBars)

defineComponent({
  name: 'NavbarC',
})

const router = useRouter()

let navigationStore = useNavigationStore()
let ethereumStore = useEthereumStore()

let state = reactive({
  menus: [
    {
      icon: faUser,
      name: 'Accounts',
      path: '/accounts',
    },
    {
      icon: faGear,
      name: 'Settings',
      path: '/settings',
    },
    {
      icon: faLinkSlash,
      name: 'Disconnect',
      handler: async () => {
        await ethereumStore.disconnect()
        router.push({ name: 'connect' })
        showToast('success', 'Successfully disconnected from wallet.', 5000)
      },
    },
  ],
})
</script>
