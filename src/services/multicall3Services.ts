import { Multicall3InvalidCallData, Multicall3InvalidTargetAddress } from '@/errors/muticall3Errors'
import { resolveEthersError } from '@/helpers/ethersHelpers'
import { Multicall3Call, Multicall3Result } from '@/interfaces/multicall3Interfaces'
import { ethers } from 'ethers'

const abis = [
  'function aggregate3(tuple(address target, bool allowFailure, bytes callData)[] calls) view returns (tuple(bool success, bytes returnData)[])',
]

const _multicall3ContractAddr = () => import.meta.env.VITE__MULTICALL3

// export const aggregate3 = (
//   params: { calls: { target: string; allowFailure: boolean; callData: string }[] },
//   runner: ethers.ContractRunner,
// ) => {
//   const contract = new ethers.Contract(_multicall3ContractAddr(), abis, runner)
//   return contract.aggregate3(params.calls)
// }

export const aggregate3 = async (
  params: { calls: Multicall3Call[] },
  runner: ethers.BrowserProvider,
): Promise<Multicall3Result[]> => {
  const { calls } = params

  // if (calls.length === 0) return []

  // // Validate each call
  // params.calls.forEach((call, index) => {
  //   if (!ethers.isAddress(call.target)) {
  //     throw new Multicall3InvalidTargetAddress()
  //   }
  //   if (!ethers.isBytesLike(call.callData)) {
  //     throw new Multicall3InvalidCallData()
  //   }
  // })

  const contract = new ethers.Contract(_multicall3ContractAddr(), abis, runner)
  try {
    return await contract.aggregate3.staticCall(params.calls)
  } catch (error) {
    throw resolveEthersError(error, contract) ?? error
  }
}
