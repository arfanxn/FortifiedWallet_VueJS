<template>
  <section class="flex w-full flex-col bg-slate-300 text-slate-700">
    <header class="flex w-full justify-between border-b-1 border-slate-600 px-4 py-4">
      <div class="flex gap-x-2" v-if="notEmpty(route.query.wallet)">
        <ButtonC
          :icon="faPlus"
          text="Deposit"
          @onClick="() => router.push({ path: '/', query: { ...route.query, menu: 'deposit' } })"
        />
        <ButtonC
          :icon="faRightLeft"
          text="Transfer"
          @onClick="() => router.push({ path: '/', query: { ...route.query, menu: 'transfer' } })"
        />
        <ButtonC
          :icon="faLock"
          text="Lock"
          @onClick="() => router.push({ path: '/', query: { ...route.query, menu: 'lock' } })"
        />
      </div>

      <ButtonC
        class="ml-auto border-slate-700 bg-transparent text-slate-700 hover:bg-transparent hover:text-slate-700"
        :icon="faPlus"
        text="Add a wallet"
        @onClick="() => router.push({ path: '/', query: { menu: 'create' } })"
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
</script>
