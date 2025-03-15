<template>
  <div class="flex flex-col gap-y-1 text-slate-700">
    <label class="font-semibold" :for="inputId" v-if="isNotEmpty(props.label)">{{
      props.label
    }}</label>
    <input
      :id="inputId"
      :name="props.name"
      :disabled="props.disabled"
      :placeholder="props.placeholder"
      :value="props.value ?? model"
      @input="emit('onInput', $event)"
      @blur="emit('onBlur', $event)"
      @focus="emit('onFocus', $event)"
      @keyup.enter="emit('onKeyupEnter', $event)"
      v-model="model"
      class="w-full rounded-lg border border-slate-600 px-4 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-slate-600 focus:outline-none"
    />
  </div>
</template>

<script setup lang="ts">
import { isNotEmpty } from '../utils/booleanUtils'
import { defineComponent, defineModel, defineEmits, computed } from 'vue'

defineComponent({
  name: 'TextFieldC',
})
const emit = defineEmits(['onFocus', 'onBlur', 'onInput', 'onKeyupEnter'])

const inputId = computed(() => Date.now() + props.name)
const model = defineModel()

interface Props {
  name: string
  disabled?: boolean
  placeholder?: string
  label?: string
  value?: string
}
const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})
</script>
