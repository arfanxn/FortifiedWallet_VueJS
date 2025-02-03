<template>
  <Layout>
    <SidebarC />
    <div class="md:ml-64">
      <NavbarC />
      <slot />
    </div>
  </Layout>
</template>

<script setup>
import { defineComponent } from 'vue'
import SidebarC from '@/components/SidebarC.vue'
import NavbarC from '@/components/NavbarC.vue'
import Layout from '@/layouts/Layout.vue'

defineComponent({
  name: 'AuthLayout',
})
</script>
