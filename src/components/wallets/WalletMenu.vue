<template>
  <section class="flex w-full flex-col bg-slate-300 text-slate-700">
    <header class="flex w-full justify-between px-4 py-4">
      <div class="flex gap-x-2" v-if="notEmpty(route.params.walletAddr)">
        <ButtonC :icon="faPlus" text="Deposit" @onClick="() => navigateTo('wallet.deposit')" />
        <ButtonC
          :icon="faRightLeft"
          text="Transfer"
          @onClick="() => navigateTo('wallet.transfer')"
        />
        <ButtonC :icon="faLock" text="Lock" @onClick="() => navigateTo('wallet.lock')" />
      </div>

      <ButtonC
        class="ml-auto hidden! bg-transparent text-slate-700 outline-slate-700 hover:bg-transparent hover:text-slate-700 md:inline-flex!"
        :icon="faPlus"
        text="Add a wallet"
        @onClick="() => navigateTo('wallet.create')"
      />
    </header>
  </section>
</template>

<script setup>
import { defineComponent } from 'vue'
import ButtonC from '@/components/ButtonC.vue'
import { useRouter, useRoute } from 'vue-router'
import { faPlus, faRightLeft, faLock } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { notEmpty } from '@/utils/string.utils'

library.add(faPlus, faRightLeft, faLock)
const router = useRouter()
const route = useRoute()

defineComponent({
  name: 'WalletMenu',
})

function navigateTo(name) {
  switch (name) {
    case 'wallet.deposit':
    case 'wallet.transfer':
    case 'wallet.lock':
      router.push({
        name: name,
        params: { ...route.params },
      })
      break
    case 'wallet.create':
      router.push({
        name: name,
      })
  }
}
</script>
