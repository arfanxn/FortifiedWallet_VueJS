<template>
  <div class="flex flex-row gap-x-4">
    <ButtonC
      class="rounded-none border-slate-700 bg-transparent px-1! font-bold text-slate-700! outline-none hover:bg-transparent hover:text-slate-700!"
      :class="{
        'cursor-not-allowed border-b': value === options[0],
      }"
      @onClick="updateValue(options[0])"
      type="button"
      :text="left"
      :disabled="value === options[0]"
    />
    <ButtonC
      class="rounded-none border-slate-700 bg-transparent px-1! font-bold text-slate-700! outline-none hover:bg-transparent hover:text-slate-700!"
      :class="{
        'cursor-not-allowed border-b': value === options[1],
      }"
      @onClick="updateValue(options[1])"
      type="button"
      :text="right"
      :disabled="value === options[1]"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineModel } from 'vue'
import ButtonC from '@/components/ButtonC.vue'

const props = defineProps<{
  value: string
  options: string[]
  left: string
  right: string
}>()
const emit = defineEmits<{
  (e: 'update:value', value: string): void
}>()
const updateValue = (newValue: string) => {
  emit('update:value', newValue)
}
</script>
