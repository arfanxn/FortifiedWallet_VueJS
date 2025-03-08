<template>
  <li
    class="px-4 py-2 transition-colors duration-200 hover:bg-slate-600 md:px-4 md:py-2"
    :class="{
      'border-r-6 border-slate-200 text-slate-200': props.isActive,
    }"
  >
    <button @click="onClick" class="inline-flex w-full items-center gap-x-2">
      <FontAwesomeIcon :icon="props.icon as IconDefinition" class="text-xl" />
      <h2 class="text-lg">{{ props.text }}</h2>
    </button>
  </li>
</template>

<script setup lang="ts">
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { defineComponent } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

defineComponent({
  name: 'SidebarListItem',
})

const emit = defineEmits(['onClick'])

interface Props {
  isActive: boolean
  icon?: IconDefinition
  text: string
}
const props = withDefaults(defineProps<Props>(), {
  isActive: false,
})

function onClick(event: MouseEvent) {
  emit('onClick', event)
}
</script>
