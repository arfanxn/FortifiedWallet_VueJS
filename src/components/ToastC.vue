<template>
  <teleport to="#modals">
    <ul
      v-if="toastStore.toasts.length > 0"
      class="fixed top-2 right-2 left-2 flex flex-col items-center gap-y-2 transition-transform duration-300 md:top-4 md:right-4 md:left-auto md:w-88 md:translate-x-0 md:gap-y-4"
    >
      <li
        class="flex w-full items-center gap-x-4 rounded-lg border-2 bg-white px-4 py-2 text-slate-700"
        :class="getBorderByType(toast.type)"
        v-for="(toast, index) in toastStore.toasts"
        :key="index"
      >
        <FontAwesomeIcon :icon="getIconByType(toast.type)" class="text-xl" />
        <span class="grow">{{ toast.message }}</span>
        <button @click="toastStore.removeToast(toast.id)">
          <FontAwesomeIcon :icon="faXmark" class="text-lg" />
        </button>
      </li>
    </ul>
  </teleport>
</template>

<script setup>
import { defineComponent } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faXmark,
  faCircleCheck,
  faCircleInfo,
  faCircleExclamation,
} from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { useToastStore } from '@/stores/toast.store.js'

defineComponent({
  name: 'ToastC',
})

library.add(faXmark, faCircleCheck, faCircleInfo, faCircleExclamation)
let toastStore = useToastStore()

function getIconByType(type) {
  switch (type) {
    case 'success':
      return 'circle-check'
    case 'warning':
    case 'error':
      return 'circle-exclamation'
    case 'info':
    default:
      return 'circle-info'
  }
}

function getBorderByType(type) {
  switch (type) {
    case 'success':
      return 'border-green-700'
    case 'warning':
    case 'error':
      return 'border-red-700'
    case 'info':
    default:
      return 'border-blue-700'
  }
}

//
</script>
