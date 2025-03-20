<template>
  <GuestLayout>
    <main class="flex min-h-screen items-center justify-center bg-slate-700">
      <div
        class="w-full max-w-md space-y-6 rounded-xl border border-slate-700 bg-slate-300 p-8 shadow-xl"
      >
        <div class="space-y-3 text-center">
          <h1 class="bg-clip-text font-serif text-3xl font-bold text-slate-700 md:text-4xl">
            Fortified Wallet
          </h1>
          <p class="text-sm text-slate-700 md:text-base">Secure digital asset management</p>
        </div>

        <button
          @click="onClick"
          class="flex w-full items-center justify-center gap-3 rounded-lg px-6 py-3 transition-all duration-200"
          :class="[
            'bg-slate-700 hover:bg-slate-600',
            'border border-slate-600 hover:border-slate-500',
            'text-slate-300',
          ]"
          aria-label="Connect wallet"
        >
          <FontAwesomeIcon icon="link" class="shrink-0 text-xl" />
          <span class="text-sm font-medium tracking-wide">
            {{ 'Connect' }}
          </span>
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
import { showToast } from '@/helpers/toastHelpers'
import { ToastType } from '@/enums/toastEnums'
import { useEthereumInteraction } from '@/composables/ethereums/useEthereumInteraction'
import { useWalletNavigator } from '@/composables/wallets/useWalletNavigator'

library.add(faLink)

const { isConnected, connect } = useEthereumInteraction()
const { navigateToDashboard } = useWalletNavigator()

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
