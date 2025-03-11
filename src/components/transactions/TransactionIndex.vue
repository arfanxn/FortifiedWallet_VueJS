<template>
  <section class="flex flex-col bg-slate-300 text-slate-700 outline-1">
    <header class="inline-flex items-center justify-between px-4 py-4 outline-1 md:px-4">
      <h2 class="text-lg font-bold">Transactions</h2>
    </header>

    <div class="inline-flex px-4 py-4 md:gap-x-4">
      <TextFieldC class="grow" name="transaction_hash" placeholder="Transaction hash (0x1234...)" />
      <ButtonC :icon="faMagnifyingGlass" text="Search" class="rounded-lg" />
    </div>

    <ul class="flex flex-col items-start gap-y-4 font-medium">
      <li
        class="grid w-full cursor-pointer gap-x-4 px-4 py-2 transition-all duration-200 hover:bg-slate-400 hover:text-slate-800 md:grid-cols-4"
        v-for="(transaction, index) in Array(8).fill('TX-xxxx')"
        :key="index"
        @mouseenter="hoveredTransactionIndex = index"
        @mouseleave="hoveredTransactionIndex = null"
      >
        <div class="flex flex-col gap-y-1 text-sm md:col-span-3">
          <div class="inline-flex items-center gap-x-2 font-semibold">
            <FontAwesomeIcon :icon="faHashtag" class="w-4 text-sm" />
            <span>{{ `0x5b9c2f8e1d4a6c3b0a7e5f9d2c8a1b6e4f3a0d9c7b2e5f8a3d1c6b9e4f7a2d0` }}</span>
          </div>

          <div class="inline-flex items-center gap-x-2">
            <FontAwesomeIcon :icon="faArrowRightArrowLeft" class="w-4 text-sm" />
            <span class="font-semibold">{{
              formatEthAddr(`0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`)
            }}</span>
            <FontAwesomeIcon :icon="faArrowRightLong" class="w-4 text-sm" />
            <span class="font-semibold">{{
              formatEthAddr(`0xf39Fd6e51aad88F6F4ce6aB8827279cffFb944e4`)
            }}</span>
          </div>

          <div class="inline-flex items-center gap-x-2 font-semibold">
            <FontAwesomeIcon :icon="faCoins" class="w-4 text-sm" />
            <span>{{ `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb94567` }}</span>
          </div>

          <div class="flex items-center gap-x-2 font-semibold">
            <FontAwesomeIcon :icon="faHourglassHalf" class="w-4 text-sm" />
            <span>{{ `Pending` }}</span>
          </div>
        </div>

        <div class="flex basis-1/4 flex-col justify-between gap-y-1 text-sm md:col-span-1">
          <div class="ml-auto inline-flex items-center gap-x-2 font-semibold text-red-700">
            <FontAwesomeIcon :icon="faMinus" class="w-4 text-sm" />
            <span class="inline-flex items-center"
              ><FontAwesomeIcon :icon="faDollarSign" class="w-4 text-sm" />{{ `0.789` }}</span
            >
          </div>
        </div>

        <div class="flex items-center justify-between text-sm font-semibold md:col-span-4">
          <div class="flex items-center gap-x-2">
            <FontAwesomeIcon :icon="faCalendar" class="w-4 text-sm" />
            <span>{{ `12-12-2020` }}</span>
          </div>

          <div
            class="flex items-center justify-end gap-x-2"
            v-if="hoveredTransactionIndex === index"
          >
            <ButtonC
              @onClick="() => {}"
              type="button"
              :text="'Cancel'"
              class="bg-red-700! text-slate-200! hover:bg-red-600! hover:text-slate-100!"
            />
            <!-- <ButtonC
            @onClick="() => {}"
            type="button"
            :text="'Revoke'"
            class="bg-amber-700! text-slate-200! hover:bg-amber-600! hover:text-slate-100!"
          /> -->
            <ButtonC
              @onClick="() => {}"
              type="button"
              :text="'Approve'"
              class="bg-green-700! text-slate-200! hover:bg-green-600! hover:text-slate-100!"
            />
            <ButtonC @onClick="() => {}" type="button" :text="'Execute'" />
          </div>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { defineComponent, ref } from 'vue'
import { formatEthAddr } from '@/helpers/string.helpers'
import TextFieldC from '@/components/TextFieldC.vue'
import ButtonC from '@/components/ButtonC.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faArrowRightLong,
  faCoins,
  faHashtag,
  faHourglassHalf,
  faMinus,
  faDollarSign,
  faArrowRightArrowLeft,
  faMagnifyingGlass,
  faCalendar,
} from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'

const hoveredTransactionIndex = ref<Number | null>(null)

library.add(
  faArrowRightLong,
  faCoins,
  faHashtag,
  faMinus,
  faDollarSign,
  faArrowRightArrowLeft,
  faCalendar,
)

// let ethereumStore = useEthereumStore()

defineComponent({
  name: 'WalletShow',
})
</script>
