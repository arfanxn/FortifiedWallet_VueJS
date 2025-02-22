<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <main>
    <ToastC />
    <slot />
  </main>
</template>

<script setup>
import { defineComponent } from 'vue'
import ToastC from '@/components/ToastC.vue'

defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Layout',
})
</script>
