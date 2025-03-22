import { TokenMetadata } from '@/interfaces/tokenInterfaces'
import { Multicall3Call } from '@/interfaces/multicall3Interfaces'
import { useMulticall3Fetch } from '../multicall3s/useMulticall3Fetch'
import ERC20 from '@/abis/ERC20'

export function useTokenMetadataFetch() {
  const { fetchAggregate3, encodeCallData, decodeResult } = useMulticall3Fetch()

  const fetchTokenMetadata = async (tokenAddress: string): Promise<TokenMetadata | undefined> =>
    await fetchTokenMetadatas([tokenAddress]).then((ts) => ts[0])

  const fetchTokenMetadatas = async (tokenAddresses: string[]): Promise<TokenMetadata[]> => {
    const calls: Multicall3Call[] = []

    for (const tokenAddr of tokenAddresses) {
      calls.push({
        target: tokenAddr,
        allowFailure: false,
        callData: encodeCallData(ERC20, 'name'),
      })
      calls.push({
        target: tokenAddr,
        allowFailure: false,
        callData: encodeCallData(ERC20, 'symbol'),
      })
      calls.push({
        target: tokenAddr,
        allowFailure: false,
        callData: encodeCallData(ERC20, 'decimals'),
      })
    }

    const tokenMetadatas: TokenMetadata[] = []
    const results = await fetchAggregate3(calls)
    let tokenAddressesIndex = 0
    for (let i = 0; i < results.length; i += 3) {
      const name = decodeResult(ERC20, 'name', results[i].returnData)
      const symbol = decodeResult(ERC20, 'symbol', results[i + 1].returnData)
      const decimals = decodeResult(ERC20, 'decimals', results[i + 2].returnData)
      const tokenMetadata: TokenMetadata = {
        address: tokenAddresses[tokenAddressesIndex],
        name: String(name),
        symbol: String(symbol),
        decimals: BigInt(decimals),
      }
      tokenMetadatas.push(tokenMetadata)
      tokenAddressesIndex++
    }
    return tokenMetadatas
  }

  return {
    fetchTokenMetadata,
    fetchTokenMetadatas,
  }
}
