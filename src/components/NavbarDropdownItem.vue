<template>
  <li class="w-full">
    <button
      @click="onClick"
      class="inline-flex w-full items-center justify-between gap-x-2 px-2 py-1 text-slate-300 hover:bg-slate-600 hover:text-slate-200"
    >
      <FontAwesomeIcon
        v-if="props.icon"
        :icon="props.icon"
        class="w-4 text-center text-xl md:w-6"
      />
      <span class="grow text-left">{{ props.text }}</span>
    </button>
  </li>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { IconDefinition } from '@fortawesome/fontawesome-common-types'

const emit = defineEmits(['onClick'])

const props = defineProps<{
  icon?: IconDefinition
  text: string
}>()

function onClick(event: MouseEvent) {
  emit('onClick', event)
}
</script>
