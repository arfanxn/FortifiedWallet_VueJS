import { TokenMetadata } from '@/interfaces/tokenInterfaces'
import { useEthereumStore } from '@/stores/useEthereumStore'
import * as tokenService from '@/services/tokenServices'
import { ethers } from 'ethers'
import { ref } from 'vue'

export function useTokenMetadataFetch() {
  const tokenMetadata = ref<TokenMetadata | undefined>()

  const fetchTokenMetadata = async (tokenAddr: string): Promise<TokenMetadata> => {
    try {
      const runner = useEthereumStore().provider as ethers.BrowserProvider
      const name = await tokenService.name(tokenAddr, runner)
      const symbol = await tokenService.symbol(tokenAddr, runner)
      const decimals = await tokenService.decimals(tokenAddr, runner)
      tokenMetadata.value = {
        address: tokenAddr,
        name,
        symbol,
        decimals,
      }
      return tokenMetadata.value
    } catch (error) {
      throw error
    }
  }

  return {
    tokenMetadata,
    fetchTokenMetadata,
  }
}
