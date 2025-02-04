<template>
  <AuthLayout>
    <ul class="flex flex-col gap-y-2">
      <li>
        <button class="inline-flex items-center gap-x-2">
          <FontAwesomeIcon icon="link" class="text-xl" />
          <span>Connect Wallet</span>
        </button>
      </li>
    </ul>
  </AuthLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faLink } from '@fortawesome/free-solid-svg-icons'
// import { useEthereumStore } from '@/stores/ethereum.store.js'
// let ethereumStore = useEthereumStore()

library.add(faLink)

onMounted(() => {})
</script>
