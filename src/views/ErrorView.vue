<template>
  <GuestLayout>
    <main class="flex min-h-screen items-center justify-center bg-slate-300">
      <article
        class="w-full max-w-2xl overflow-hidden rounded-lg border-2 border-slate-200 bg-slate-700 shadow-lg"
      >
        <div class="space-y-6 p-8 text-center">
          <header class="space-y-4">
            <h1 id="page-title" class="font-serif text-2xl text-slate-100 md:text-3xl">
              Fortified Wallet
            </h1>
            <div class="space-y-2">
              <p class="text-4xl font-bold text-slate-100 md:text-5xl">404</p>
              <p class="text-xl text-slate-200 md:text-2xl">Page Not Found</p>
            </div>
          </header>

          <section aria-labelledby="error-description">
            <p id="error-description" class="mb-6 text-slate-300">
              The requested page could not be found. Please check the URL or navigate back to
              safety.
            </p>

            <ButtonC
              class="w-full justify-center md:w-auto"
              :icon="faArrowLeft"
              text="Return to Safety"
              @onClick="onClick"
            />
          </section>
        </div>
      </article>
    </main>
  </GuestLayout>
</template>

<script setup>
import GuestLayout from '@/layouts/GuestLayout.vue'
import ButtonC from '@/components/ButtonC.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { useWalletNavigator } from '@/composables/wallets/useWalletNavigator'
import { useRouter } from 'vue-router'

library.add(faArrowLeft)

const { navigateToDashboard } = useWalletNavigator()

const router = useRouter()

function onClick() {
  router.go(-1)
}
</script>
