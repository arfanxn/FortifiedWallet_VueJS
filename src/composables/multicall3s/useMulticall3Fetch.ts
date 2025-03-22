import { ethers } from 'ethers'
import * as multicall3Services from '@/services/multicall3Services'
import { Multicall3Call, Multicall3Result } from '@/interfaces/multicall3Interfaces'
import { useEthereumStore } from '@/stores/useEthereumStore'

export function useMulticall3Fetch() {
  const ethereumStore = useEthereumStore()

  const fetchAggregate3 = async (calls: Multicall3Call[]): Promise<Multicall3Result[]> => {
    const runner = ethereumStore.provider as ethers.BrowserProvider
    const results = await multicall3Services.aggregate3({ calls }, runner)
    return results
  }

  const encodeCallData = (
    abi: ethers.InterfaceAbi,
    functionName: string,
    params?: ReadonlyArray<any>,
  ): string => {
    const iface = new ethers.Interface(abi)
    return iface.encodeFunctionData(functionName, params)
  }

  const decodeResult = (
    abi: ethers.InterfaceAbi,
    functionName: string,
    returnData: string,
  ): any => {
    const iface = new ethers.Interface(abi)
    return iface.decodeFunctionResult(functionName, returnData)
  }

  return {
    fetchAggregate3,
    encodeCallData,
    decodeResult,
  }
}
