import { useEthereumStore } from '@/stores/ethereum.store'
import * as tokenService from '@/services/token.service'
import { TokenMetadata } from '@/interfaces/token.interfaces'
import { ethers } from 'ethers'
import { computed, ref } from 'vue'

export function useTokenMetadata() {
  const tokenMetadata = ref<TokenMetadata>()

  const fetchTokenMetadata = async (tokenAddr: string): Promise<void> => {
    const provider = useEthereumStore().provider
    const name = await tokenService.name(provider as ethers.BrowserProvider, tokenAddr)
    const symbol = await tokenService.symbol(provider as ethers.BrowserProvider, tokenAddr)
    const decimals = await tokenService.decimals(provider as ethers.BrowserProvider, tokenAddr)
    if (name && symbol && decimals)
      tokenMetadata.value = {
        address: tokenAddr,
        name,
        symbol,
        decimals,
      }
  }

  // const tokenMetadata = computedAsync(
  //   async () => {
  //     if (isEthAddr(tokenAddr.value)) return fetchTokenMetadata(tokenAddr.value)
  //     return
  //   },
  //   undefined,
  //   { lazy: true },
  // )

  const tokenLabel = computed(() =>
    tokenMetadata.value
      ? `Token: ${tokenMetadata.value.name} (${tokenMetadata.value.symbol})`
      : 'Token: -',
  )

  const tokenAmountLabel = computed(() => {
    if (tokenMetadata.value) return `Amount (in ${tokenMetadata.value.decimals} decimals)`
    else return `Amount`
  })

  return {
    // ============================== State variables ==============================
    tokenMetadata,
    tokenLabel,
    tokenAmountLabel,
    // ================================== Methods ==================================
    fetchTokenMetadata,
  }
}
