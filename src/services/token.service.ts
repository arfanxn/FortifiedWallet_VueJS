import { TransactionFailedError } from '@/errors/ethereum.errors'
import {
  didTransactionFail,
  isEthersError,
  resolveAndThrowEthersError,
  withResolvedEthersErrorHandling,
} from '@/helpers/ethers.helpers'
import { tryRethrow } from '@/utils/error.utils'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { EthereumAddress } from '@/interfaces/ethereum.interfaces'

const tokenAbis: ethers.InterfaceAbi = [
  // name
  'function name() view returns (string)',

  // symbol
  'function symbol() view returns (string)',

  // decimals
  'function decimals() view returns (uint8)',

  // approve
  'function approve(address spender, uint256 value) returns (bool)',
]

export const name = async (provider: ethers.BrowserProvider, token: EthereumAddress) => {
  const contract = new ethers.Contract(token, tokenAbis, provider)
  return await contract.name()
}

export const symbol = async (provider: ethers.BrowserProvider, token: EthereumAddress) => {
  const contract = new ethers.Contract(token, tokenAbis, provider)
  return await contract.symbol()
}

export const decimals = async (provider: ethers.BrowserProvider, token: EthereumAddress) => {
  const contract = new ethers.Contract(token, tokenAbis, provider)
  return await contract.decimals()
}

export const approve = async (
  signer: ethers.Signer,
  params: { token: string; spender: string; value: BigNumber },
): Promise<void> => {
  const contract = new ethers.Contract(params.token, tokenAbis, signer)

  withResolvedEthersErrorHandling(async () => {
    const tx: ethers.TransactionResponse = await contract.approve(params.spender, params.value)
    const receipt: ethers.TransactionReceipt | null = await tx.wait()
    if (didTransactionFail(receipt)) throw new TransactionFailedError()
  }, contract)
}
