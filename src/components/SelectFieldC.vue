<template>
  <div class="flex flex-col gap-y-1 text-slate-700">
    <label class="font-semibold" :for="inputId" v-if="notEmpty(props.label)">{{
      props.label
    }}</label>
    <select
      class="w-full rounded-lg border border-slate-600 px-4 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-slate-600 focus:outline-none"
      :name="props.name"
      :id="inputId"
      :disabled="props.disabled"
      v-model="model"
      @change="emit('onChange', $event)"
      @blur="emit('onBlur', $event)"
      @focus="emit('onFocus', $event)"
    >
      <option v-for="option in props.options" :key="option.value" :value="option.value">
        {{ option.text }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { notEmpty } from '@/utils/string.utils'
import { defineComponent, defineModel, defineEmits, computed } from 'vue'

defineComponent({
  name: 'SelectFieldC',
})
const emit = defineEmits(['onChange', 'onBlur', 'onFocus'])

const inputId = computed(() => Date.now() + props.name)
const model = defineModel()
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  options: {
    type: Array,
    required: true,
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
