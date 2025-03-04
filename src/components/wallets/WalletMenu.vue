<template>
  <section class="flex w-full flex-col bg-slate-300 text-slate-700">
    <header class="flex w-full justify-between px-4 py-4">
      <div class="flex gap-x-2" v-if="isNotEmpty(route.params.walletAddr)">
        <ButtonC
          :icon="faPlus"
          text="Deposit"
          @onClick="() => navigateTo(WalletRouteName.Deposit)"
        />
        <ButtonC
          :icon="faRightLeft"
          text="Transfer"
          @onClick="() => navigateTo(WalletRouteName.Transfer)"
        />
        <ButtonC :icon="faLock" text="Lock" @onClick="() => navigateTo(WalletRouteName.Lock)" />
      </div>

      <ButtonC
        class="ml-auto hidden! bg-transparent text-slate-700 outline-slate-700 hover:bg-transparent hover:text-slate-700 md:inline-flex!"
        :icon="faPlus"
        text="Add a wallet"
        @onClick="() => navigateTo(WalletRouteName.Create)"
      />
    </header>
  </section>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue'
import ButtonC from '@/components/ButtonC.vue'
import { useRouter, useRoute } from 'vue-router'
import { faPlus, faRightLeft, faLock } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { notEmpty } from '@/utils/boolean.utils'
import { WalletRouteName } from '@/enums/wallet.enums'

library.add(faPlus, faRightLeft, faLock)
const router = useRouter()
const route = useRoute()

defineComponent({
  name: 'WalletMenu',
})

function navigateTo(routeName: WalletRouteName) {
  switch (routeName) {
    case WalletRouteName.Deposit:
    case WalletRouteName.Transfer:
    case WalletRouteName.Lock:
      router.push({
        name: routeName,
        params: { ...route.params },
      })
      break
    case WalletRouteName.Create:
      router.push({
        name: routeName,
      })
  }
}
</script>
