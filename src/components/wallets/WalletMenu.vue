<template>
  <section class="flex w-full flex-col bg-slate-300 text-slate-700">
    <header class="flex w-full justify-between px-4 py-4">
      <div class="flex gap-x-2" v-if="isNotEmpty(route.params.walletAddr)">
        <ButtonC :icon="faPlus" text="Deposit" @onClick="() => navigatToWalletDeposit()" />
        <ButtonC :icon="faRightLeft" text="Transfer" @onClick="() => navigateToWalletTransfer()" />
        <ButtonC :icon="faLock" text="Lock" @onClick="() => navigatToWalletLock()" />
      </div>

      <ButtonC
        class="ml-auto hidden! bg-transparent text-slate-700 outline-slate-700 hover:bg-transparent hover:text-slate-700 md:inline-flex!"
        :icon="faPlus"
        text="Add a wallet"
        @onClick="() => navigateToWalletCreate()"
      />
    </header>
  </section>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue'
import ButtonC from '@/components/ButtonC.vue'
import { useRoute } from 'vue-router'
import { faPlus, faRightLeft, faLock } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { isNotEmpty } from '@/utils/boolean.utils'
import { RouteName } from '@/enums/route.enums'
import { useWalletNavigator } from '@/composables/wallets/useWalletNavigator'

library.add(faPlus, faRightLeft, faLock)

const route = useRoute()
const {
  navigateToWalletCreate,
  navigatToWalletDeposit,
  navigateToWalletTransfer,
  navigatToWalletLock,
} = useWalletNavigator()

defineComponent({
  name: 'WalletMenu',
})
</script>
