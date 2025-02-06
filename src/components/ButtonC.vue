<template>
  <button
    class="inline-flex cursor-pointer items-center gap-x-2 rounded-full border-2 border-slate-200 bg-slate-700 px-4 text-slate-300 hover:bg-slate-600 hover:text-slate-200"
    @click="onClick()"
  >
    <FontAwesomeIcon :icon="props.icon" class="text-sm" v-if="props.icon" />
    <span>{{ props.name }}</span>
  </button>
</template>

<script setup>
import { defineComponent, defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

defineComponent({
  name: 'ButtonC',
})

let router = useRouter()

let props = defineProps({
  name: String,
  icon: Object,
  path: String,
  handler: Function,
})

const onClick = () => {
  const menu = props
  if (menu.path != null) router.push(menu.path)
  else menu.handler()
}
</script>
