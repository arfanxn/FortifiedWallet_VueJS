<template>
  <label class="flex flex-col text-slate-700">
    <span class="font-bold">{{ props.label }}</span>
    <input
      :name="props.name"
      :disabled="props.disabled"
      :placeholder="props.placeholder"
      @input="emit('onInput')"
      @blur="emit('onBlur')"
      @focus="emit('onFocus')"
      v-model="model"
      class="w-full rounded-lg border border-slate-600 px-4 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-slate-600 focus:outline-none"
    />
  </label>
</template>

<script setup>
import { defineComponent, defineModel, defineEmits } from 'vue'

defineComponent({
  name: 'TextFieldC',
})
const emit = defineEmits(['onFocus', 'onBlur', 'onInput'])

const model = defineModel()
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: null,
  },
  label: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
</script>
