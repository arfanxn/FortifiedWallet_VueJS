import { TokenMetadata } from '@/interfaces/tokenInterfaces'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTokenMetadataStore = defineStore('tokenMetadata', () => {
  // ==========================================================================
  //                            Internal functions
  // ==========================================================================
  //

  // ==========================================================================
  //                                State
  // ==========================================================================
  const tokenMetadatas = ref<TokenMetadata[]>([])

  // ==========================================================================
  //                                Getters
  // ==========================================================================
  //

  // ==========================================================================
  //                                Actions
  // ==========================================================================
  const reset = () => {
    tokenMetadatas.value = []
  }

  const findTokenMetadataByAddr = (tokenAddr: string): TokenMetadata | undefined =>
    tokenMetadatas.value.find((tokenMetadata) => tokenMetadata.address === tokenAddr)

  // ==========================================================================
  //                              Initializations
  // ==========================================================================
  //

  return {
    // ============================== State variables ==============================
    tokenMetadatas,

    // ================================= Methods ===================================
    reset,
    findTokenMetadataByAddr,
  }
})
