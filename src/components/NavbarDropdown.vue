<template>
  <button class="relative" @click="isDropdownOpened = !isDropdownOpened">
    <FontAwesomeIcon icon="user" class="text-xl" />
    <ul
      class="absolute right-0 min-w-44 origin-top-right flex-col items-start overflow-auto rounded-lg bg-slate-700 outline-2 outline-slate-200 transition duration-300 ease-in-out md:min-w-64"
      :class="{
        'flex opacity-100': isDropdownOpened,
        'hidden opacity-0': !isDropdownOpened,
      }"
    >
      <NavbarDropdownItem
        @onClick="() => router.push({ name: 'account.profile.edit' })"
        :icon="faUser"
        text="Accounts"
      />
      <NavbarDropdownItem
        @onClick="() => router.push({ name: 'account.setting.edit' })"
        :icon="faGear"
        text="Settings"
      />
      <NavbarDropdownItem
        @onClick="async () => await handleDisconnect()"
        :icon="faLinkSlash"
        text="Disconnect"
      />
    </ul>
  </button>
</template>

<script setup lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import NavbarDropdownItem from '@/components/NavbarDropdownItem.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBell, faGear, faLinkSlash, faUser, faBars } from '@fortawesome/free-solid-svg-icons'
import { useBlockchainStore } from '@/stores/blockchain.store'
import { showToast } from '@/helpers/toast.helpers'
import { ToastType } from '@/enums/toast.enums'

library.add(faBell, faUser, faGear, faLinkSlash, faBars)

defineComponent({
  name: 'DropdownMenuC',
})

let router = useRouter()

const blockchainStore = useBlockchainStore()

const isDropdownOpened = ref(false)

async function handleDisconnect() {
  await blockchainStore.disconnect()
  router.push({ name: 'connect' })
  showToast(ToastType.Success, 'Successfully disconnected from wallet.', 5000)
}
</script>
