<template>
  <teleport to="#toasts">
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
        <span class="min-w-0 grow break-words">{{ toast.message }}</span>
        <button @click="toastStore.removeToast(toast.id)">
          <FontAwesomeIcon :icon="faXmark" class="text-lg" />
        </button>
      </li>
    </ul>
  </teleport>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faXmark,
  faCircleCheck,
  faCircleInfo,
  faCircleExclamation,
} from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { useToastStore } from '@/stores/toast.store'
import { ToastType } from '@/enums/toast.enums'

defineComponent({
  name: 'ToastC',
})

library.add(faXmark, faCircleCheck, faCircleInfo, faCircleExclamation)
let toastStore = useToastStore()

function getIconByType(type: ToastType) {
  switch (type) {
    case ToastType.SUCCESS:
      return 'circle-check'
    case ToastType.WARNING:
    case ToastType.ERROR:
      return 'circle-exclamation'
    case ToastType.INFO:
    default:
      return 'circle-info'
  }
}

function getBorderByType(type: ToastType) {
  switch (type) {
    case ToastType.SUCCESS:
      return 'border-green-700'
    case ToastType.WARNING:
    case ToastType.ERROR:
      return 'border-red-700'
    case ToastType.INFO:
    default:
      return 'border-blue-700'
  }
}

//
</script>
