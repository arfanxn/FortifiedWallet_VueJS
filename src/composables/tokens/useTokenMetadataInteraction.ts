import { TokenMetadata } from '@/interfaces/tokenInterfaces'
import { useTokenMetadataStore } from '@/stores/useTokenMetadataStore'
import { useTokenMetadataFetch } from './useTokenMetadataFetch'

export function useTokenMetadataInteraction() {
  const tokenMetadataStore = useTokenMetadataStore()

  const { fetchTokenMetadatas: _fetchTokenMetadatas } = useTokenMetadataFetch()

  const fetchTokenMetadatas = async (tokenAddresses: string[]): Promise<TokenMetadata[]> => {
    const tokenMetadatas = await _fetchTokenMetadatas(tokenAddresses)
    tokenMetadataStore.tokenMetadatas = tokenMetadatas
    return tokenMetadatas
  }

  return {
    fetchTokenMetadatas,
  }
}
