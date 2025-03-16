<template>
  <div class="flex flex-row gap-x-4">
    <ButtonC
      class="rounded-none border-slate-700 bg-transparent px-1! font-bold text-slate-700! outline-none hover:bg-transparent hover:text-slate-700!"
      :class="{
        'cursor-not-allowed border-b': selected === options[0],
      }"
      @onClick="selected = options[0]"
      type="button"
      :text="left"
      :disabled="selected === options[0]"
    />
    <ButtonC
      class="rounded-none border-slate-700 bg-transparent px-1! font-bold text-slate-700! outline-none hover:bg-transparent hover:text-slate-700!"
      :class="{
        'cursor-not-allowed border-b': selected === options[1],
      }"
      @onClick="selected = options[1]"
      type="button"
      :text="right"
      :disabled="selected === options[1]"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineModel } from 'vue'
import ButtonC from '@/components/ButtonC.vue'

const selected = defineModel<string>({ required: true })
const props = defineProps<{
  options: string[]
  left: string
  right: string
}>()
</script>
