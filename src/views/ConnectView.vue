<template>
  <GuestLayout>
    <main class="flex min-h-screen w-full items-center justify-center bg-slate-700">
      <div
        class="flex flex-col items-center gap-y-2 rounded-lg border-2 border-slate-200 px-8 py-6 text-slate-200"
      >
        <h1 class="font-serif text-2xl md:text-4xl">Fortified Wallet</h1>
        <button
          class="inline-flex w-full items-center justify-center gap-x-2 rounded-md border-1 border-slate-200 bg-slate-500 p-2 text-slate-300 hover:text-slate-200 hover:outline-2 hover:outline-slate-200"
          @click="onClick"
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
import GuestLayout from '@/layouts/GuestLayout.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import { showToast } from '@/helpers/toast.helpers'
import { ToastType } from '@/enums/toast.enums'
import { useEthereum } from '@/composables/ethereum.composable'
import { useNavigation } from '@/composables/navigation.composable'

library.add(faLink)

const { isConnected, connect } = useEthereum()
const { navigateToDashboard } = useNavigation()

onMounted(() => {
  if (!isConnected) showToast(ToastType.Info, 'Please connect to your wallet.')
})

async function onClick() {
  try {
    await connect()
    showToast(ToastType.Success, 'Successfully connected to wallet.', 5000)
    navigateToDashboard()
  } catch (error) {
    showToast(ToastType.Error, error)
  }
}
</script>
