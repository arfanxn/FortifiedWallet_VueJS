import { resolveEthersError } from '@/helpers/ethersHelpers'
import { Multicall3Call, Multicall3Result } from '@/interfaces/multicall3Interfaces'
import { ethers } from 'ethers'

const abis = [
  'function aggregate3(tuple(address target, bool allowFailure, bytes callData)[] calls) view returns (tuple(bool success, bytes returnData)[])',
]

const _multicall3ContractAddr = () => import.meta.env.VITE__MULTICALL3


export const aggregate3 = async (
  params: { calls: Multicall3Call[] },
  runner: ethers.BrowserProvider,
): Promise<Multicall3Result[]> => {
  const { calls } = params

  const contract = new ethers.Contract(_multicall3ContractAddr(), abis, runner)
  try {
    return await contract.aggregate3.staticCall(params.calls)
  } catch (error) {
    throw resolveEthersError(error, contract) ?? error
  }
}
