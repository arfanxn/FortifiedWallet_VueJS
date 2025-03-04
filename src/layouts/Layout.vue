<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <main>
    <!-- Utilities -->
    <ToastC />

    <!-- Main -->
    <slot />
  </main>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue'
import ToastC from '@/components/ToastC.vue'

defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Layout',
})
</script>
