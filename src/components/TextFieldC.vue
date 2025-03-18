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
      :value="inputValue"
      :type="props.type"
      :autocomplete="props.autocomplete"
      @input="(event) => onInput(event)"
      @blur="emit('onBlur', $event)"
      @focus="emit('onFocus', $event)"
      @keyup.enter="emit('onKeyupEnter', $event)"
      class="w-full rounded-lg border border-slate-600 px-4 py-2 transition-all focus:border-transparent focus:ring-2 focus:ring-slate-600 focus:outline-none"
    />
  </div>
</template>

<script setup lang="ts">
import { isNotEmpty } from '../utils/booleanUtils'
import { defineComponent, defineEmits, computed, watchEffect } from 'vue'

defineComponent({
  name: 'TextFieldC',
})
const emit = defineEmits([
  'onFocus',
  'onBlur',
  'onInput',
  'onKeyupEnter',
  'update:modelValue',
  'update:value',
])
const inputId = computed(() => Date.now() + props.name)

interface Props {
  name: string
  disabled?: boolean
  placeholder?: string
  label?: string
  value?: string | number | null
  modelValue?: string | number | null
  type?: 'text' | 'password' | 'email' | 'url' | 'search' | 'tel' | 'number'
  autocomplete?: 'on' | 'off'
}
const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  type: 'text',
  autocomplete: 'on',
})

const inputValue = computed(() => props.modelValue ?? props.value ?? '')

const onInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value

  // Emit both events to support all use cases
  emit('update:modelValue', value)
  emit('update:value', value)
  emit('onInput', event)
}
</script>
