<template>
  <button
    class="inline-flex cursor-pointer items-center gap-x-2 rounded-full border-2 border-slate-200 bg-slate-700 px-4 text-slate-300 hover:bg-slate-600 hover:text-slate-200"
    @click="onClick()"
  >
    <FontAwesomeIcon :icon="props.icon" class="text-sm" v-if="props.icon" />
    <span>{{ props.text }}</span>
  </button>
</template>

<script setup>
import { defineComponent, defineProps, defineEmits } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

defineComponent({
  name: 'ButtonC',
})

const emit = defineEmits(['onClick'])

let props = defineProps({
  text: String,
  icon: Object,
})

const onClick = () => {
  emit('onClick')
}
</script>
