<template>
  <GuestLayout>
    <main class="flex min-h-screen w-full items-center justify-center bg-slate-700">
      <div
        class="flex flex-col items-center gap-y-2 rounded-lg border-2 border-slate-200 px-8 py-6 text-slate-200"
      >
        <h1 class="font-serif text-2xl md:text-4xl">Fortified Wallet</h1>
        <button
          class="inline-flex w-full items-center justify-center gap-x-2 rounded-md border-1 border-slate-200 bg-slate-500 p-2 text-slate-300 hover:text-slate-200 hover:outline-2 hover:outline-slate-200"
          @click="connect"
        >
          <FontAwesomeIcon icon="link" class="text-2xl" />
          <span>Connect</span>
        </button>
      </div>
    </main>
  </GuestLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import GuestLayout from '@/layouts/GuestLayout.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import { useEthereumStore } from '@/stores/ethereum.store.js'
import { useToastStore } from '@/stores/toast.store.js'

library.add(faLink)

const router = useRouter()

let ethereumStore = useEthereumStore()
let toastStore = useToastStore()

onMounted(() => {
  if (!ethereumStore.isConnected) {
    toastStore.addToast('info', 'Please connect to your wallet.')
  }
})

async function connect() {
  try {
    await ethereumStore.connect()
    toastStore.addToast('success', 'Successfully connected to wallet.', 5000)
    router.push('/')
  } catch {
    toastStore.addToast('error', ethereumStore.errorMessage)
  }
}
</script>
