<template>
  <Layout>
    <slot />
  </Layout>
</template>

<script setup>
import { defineComponent } from 'vue'
import Layout from './Layout.vue'

defineComponent({
  name: 'GuestLayout',
})
</script>
