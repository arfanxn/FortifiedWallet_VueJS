import { useEthereumStore } from '@/stores/useEthereumStore'
import * as tokenService from '@/services/tokenServices'
import { TokenMetadata } from '@/interfaces/tokenInterfaces'
import { ethers } from 'ethers'
import { computed, ref } from 'vue'

export function useTokenMetadata() {
  const tokenMetadata = ref<TokenMetadata>()

  const fetchTokenMetadata = async (tokenAddr: string): Promise<TokenMetadata | undefined> => {
    const runner = useEthereumStore().provider as ethers.BrowserProvider
    const name = await tokenService.name(tokenAddr, runner)
    const symbol = await tokenService.symbol(tokenAddr, runner)
    const decimals = await tokenService.decimals(tokenAddr, runner)
    if (name && symbol && decimals)
      tokenMetadata.value = {
        address: tokenAddr,
        name,
        symbol,
        decimals,
      }

    return tokenMetadata.value
  }

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
