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
      <option v-for="option in props.options" :key="option.key" :value="option.value">
        {{ option.key }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { notEmpty } from '@/utils/string.utils'
import { defineComponent, defineModel, defineEmits, computed, onMounted, Ref, ref } from 'vue'
import type { ObjectKeyValue } from '@/interfaces/interfaces'
import { SelectFieldProps } from '@/interfaces/componentProps.interfaces'

defineComponent({
  name: 'SelectFieldC',
})
const emit = defineEmits(['onChange', 'onBlur', 'onFocus'])

onMounted(() => {
  inputId.value = Date.now() + props.name
})

const inputId: Ref<string> = ref('')
const model = defineModel()

// const props = defineProps({
//   name: {
//     type: String,
//     required: true,
//   },
//   options: {
//     type: ObjectKeyValue[],
//     required: true,
//   },
//   label: {
//     type: String,
//     default: null,
//   },
//   disabled: {
//     type: Boolean,
//     default: false,
//   },
//   value: {
//     type: String,
//     default: null,
//   },
// })

const props = withDefaults(defineProps<SelectFieldProps<number>>(), {
  label: null,
  disabled: false,
  value: null,
  options: () => [],
})
</script>
