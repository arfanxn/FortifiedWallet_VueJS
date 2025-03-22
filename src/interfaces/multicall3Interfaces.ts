// src/types/multicall.ts
import type { Interface, Result } from 'ethers'

// export type MulticallConfig = {
//   chainId?: number
//   batchSize?: number
// }

// Type definitions
export type Multicall3Call = {
  target: string
  allowFailure: boolean
  callData: string
}

export type Multicall3Result = {
  success: boolean
  returnData: string
}
