import { useEthereumStore } from '@/stores/ethereum.store'
import * as tokenService from '@/services/token.service'
import { TokenMetadata } from '@/interfaces/token.interfaces'
import { ethers } from 'ethers'

export function useToken() {
  const ethereumStore = useEthereumStore()

  const fetchTokenMetadata = async (token: string): Promise<TokenMetadata | undefined> => {
    const provider = ethereumStore.provider
    const name = await tokenService.name(provider as ethers.BrowserProvider, token)
    const symbol = await tokenService.symbol(provider as ethers.BrowserProvider, token)
    const decimals = await tokenService.decimals(provider as ethers.BrowserProvider, token)
    const tokenMetadata: TokenMetadata = {
      name,
      symbol,
      decimals,
    }
    if (name && symbol && decimals) return tokenMetadata
  }

  return {
    // ============================== State variables ==============================
    //
    // ================================== Methods ==================================
    fetchTokenMetadata,
  }
}
