<template>
  <Layout>
    <Sidebar />
    <NavbarC />
    <main id="auth-layout-slot"><slot /></main>
  </Layout>
</template>

<script setup lang="ts">
import { defineComponent, onMounted, onUnmounted } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import NavbarC from '@/components/NavbarC.vue'
import Layout from '@/layouts/Layout.vue'

defineComponent({
  name: 'AuthLayout',
})

const updateLayout = () => {
  const sidebar = document.getElementById('sidebar')
  const navbar = document.getElementById('navbar')
  const slot = document.getElementById('auth-layout-slot')

  if (!sidebar || !navbar || !slot) return

  navbar.style.marginLeft = `${sidebar.getBoundingClientRect().right}px`
  slot.style.marginLeft = `${sidebar.getBoundingClientRect().right}px`
  slot.style.marginTop = `${navbar.getBoundingClientRect().bottom}px`
}

onMounted(() => {
  updateLayout()
  window.addEventListener('resize', updateLayout) // Add listener
})

onUnmounted(() => {
  window.removeEventListener('resize', updateLayout) // Cleanup
})
</script>
