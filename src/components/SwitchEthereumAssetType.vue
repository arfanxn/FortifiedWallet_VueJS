<template>
  <div class="flew-row flex gap-4">
    <ButtonC
      @onClick="() => toggleAsset()"
      type="button"
      :text="'ETH'"
      class="rounded-none border-slate-700 bg-transparent px-1! font-bold text-slate-700! outline-none hover:bg-transparent hover:text-slate-700!"
      :class="{
        'cursor-not-allowed border-b': model === 'ether',
      }"
      :disabled="model === 'ether'"
    />
    <ButtonC
      @onClick="() => toggleAsset()"
      type="button"
      :text="'ERC20'"
      class="rounded-none border-slate-700 bg-transparent px-1! font-bold text-slate-700! outline-none hover:bg-transparent hover:text-slate-700!"
      :class="{
        'cursor-not-allowed border-b': model === 'token',
      }"
      :disabled="model === 'token'"
    />
  </div>
</template>

<script setup lang="ts">
import { defineModel, watch } from 'vue'
import ButtonC from '@/components/ButtonC.vue'

const emit = defineEmits(['onAssetCurrencyChange'])

const model = defineModel<'ether' | 'token'>()

const props = defineProps<{
  value?: 'ether' | 'token'
}>()

watch(
  () => props.value,
  (value) => {
    model.value = value ?? 'ether'
  },
)

function toggleAsset() {
  model.value = model.value === 'ether' ? 'token' : 'ether'
  emit('onAssetCurrencyChange', model.value)
}
</script>
