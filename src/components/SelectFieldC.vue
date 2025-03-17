<template>
  <div class="flex flex-col gap-y-1 text-slate-700">
    <label class="font-semibold" :for="inputId" v-if="props.label">{{ props.label }}</label>
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
      <option
        v-for="option in props.options"
        :key="getOptionValue(option)"
        :value="getOptionValue(option)"
      >
        {{ getOptionLabel(option) }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, defineModel, defineEmits, onMounted, Ref, ref } from 'vue'

defineComponent({
  name: 'SelectFieldC',
})
const emit = defineEmits(['onChange', 'onBlur', 'onFocus'])

onMounted(() => {
  inputId.value = Date.now() + props.name
})

const inputId: Ref<string> = ref('')
const model = defineModel()

type Option =
  | number
  | string
  | {
      label: string
      value: any
    }
const props = withDefaults(
  defineProps<{
    name: string
    label: string
    disabled?: boolean
    options: Option[]
  }>(),
  {
    disabled: false,
  },
)

const getOptionValue = (option: Option): string | number => {
  if (typeof option === 'object') return option.value
  return option
}

const getOptionLabel = (option: Option): string | number => {
  if (typeof option === 'object') return option.label
  return option
}
</script>
