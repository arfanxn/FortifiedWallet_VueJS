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
        :key="option.key ?? option.value"
        :value="option.value"
      >
        {{ option.text }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, defineModel, defineEmits, onMounted, Ref, ref } from 'vue'
import { SelectFieldComponent } from '@/interfaces/component.interfaces'

defineComponent({
  name: 'SelectFieldC',
})
const emit = defineEmits(['onChange', 'onBlur', 'onFocus'])

onMounted(() => {
  inputId.value = Date.now() + props.name
})

const inputId: Ref<string> = ref('')
const model = defineModel()

const props = withDefaults(defineProps<SelectFieldComponent.Props<any>>(), {
  disabled: false,
  options: () => [],
})
</script>
