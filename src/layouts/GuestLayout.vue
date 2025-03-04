<template>
  <Layout>
    <slot />
  </Layout>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue'
import Layout from './Layout.vue'

defineComponent({
  name: 'GuestLayout',
})
</script>
