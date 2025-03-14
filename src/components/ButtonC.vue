<template>
  <button
    class="inline-flex cursor-pointer items-center gap-x-2 rounded-full bg-slate-700 px-4 text-slate-300 outline-2 outline-slate-200 hover:bg-slate-600 hover:text-slate-200"
    :type="props.type"
    @click="onClick()"
  >
    <FontAwesomeIcon v-if="props.icon" :icon="props.icon" class="text-sm" />
    <span>{{ props.text }}</span>
  </button>
</template>

<script setup lang="ts">
import { defineComponent, defineProps, defineEmits } from 'vue'
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/vue-fontawesome'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { RouteLocationRaw, useRouter } from 'vue-router'

defineComponent({
  name: 'ButtonC',
})

const emit = defineEmits(['onClick'])
const router = useRouter()

interface Props {
  text: string
  to?: RouteLocationRaw
  type?: 'submit' | 'reset' | 'button'
  icon?: IconDefinition
}
let props = withDefaults(defineProps<Props>(), {
  type: 'submit',
})

const onClick = () => {
  if (props.to) router.push(props.to)
  else emit('onClick')
}
</script>
