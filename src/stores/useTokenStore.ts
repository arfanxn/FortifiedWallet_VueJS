import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Token } from '@/interfaces/tokenInterfaces'

export const useTokenStore = defineStore('token', () => {
  // ==========================================================================
  //                            Internal functions
  // ==========================================================================
  //

  // ==========================================================================
  //                                State
  // ==========================================================================
  const token = ref<Token>()
  const tokens = ref<Token[]>([])
  const selectedToken = ref<Token | undefined>()
  const currentPage = ref<number>(1)
  const keyword = ref<string | undefined>()

  // ==========================================================================
  //                                Getters
  // ==========================================================================
  //

  // ==========================================================================
  //                                Actions
  // ==========================================================================
  const reset = () => {
    tokens.value = []
    selectedToken.value = undefined
    currentPage.value = 1
    keyword.value = undefined
  }

  // ==========================================================================
  //                              Initializations
  // ==========================================================================
  //

  return {
    // ============================== State variables ==============================
    token,
    tokens,
    selectedToken,
    currentPage,
    keyword,
    // ================================= Methods ===================================
    reset,
  }
})
