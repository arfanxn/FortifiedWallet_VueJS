<template>
  <div id="app">
    <router-view class="container-md custom-container"> </router-view>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(async () => {
  document.body.classList.add('bg-slate-300')
  document.getElementById('app')?.classList?.add('min-h-screen')
})
</script>

<style></style>
