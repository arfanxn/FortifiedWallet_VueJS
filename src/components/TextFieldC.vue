<template>
  <div class="flex flex-col gap-y-1 text-slate-700">
    <label class="font-semibold" :for="inputId" v-if="notEmpty(props.label)">{{
      props.label
    }}</label>
    <input
      :id="inputId"
      :name="props.name"
      :disabled="props.disabled"
      :placeholder="props.placeholder"
      @input="emit('onInput', $event)"
      @blur="emit('onBlur', $event)"
      @focus="emit('onFocus', $event)"
      v-model="model"
      class="w-full rounded-lg border border-slate-600 px-4 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-slate-600 focus:outline-none"
    />
  </div>
</template>

<script setup>
import { notEmpty } from '@/utils/string.utils'
import { defineComponent, defineModel, defineEmits, computed } from 'vue'

defineComponent({
  name: 'TextFieldC',
})
const emit = defineEmits(['onFocus', 'onBlur', 'onInput'])

const inputId = computed(() => Date.now() + props.name)
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
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
</script>
