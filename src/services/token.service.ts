import { TransactionFailedError } from '@/errors/ethereum.errors'
import { didTransactionFail, resolveEthersError } from '@/helpers/ethers.helpers'
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

export const name = async (token: EthereumAddress, runner: ethers.BrowserProvider) => {
  const contract = new ethers.Contract(token, tokenAbis, runner)
  return await contract.name()
}

export const symbol = async (token: EthereumAddress, runner: ethers.BrowserProvider) => {
  const contract = new ethers.Contract(token, tokenAbis, runner)
  return await contract.symbol()
}

export const decimals = async (token: EthereumAddress, runner: ethers.BrowserProvider) => {
  const contract = new ethers.Contract(token, tokenAbis, runner)
  return await contract.decimals()
}

export const approve = async (
  params: { token: string; spender: string; value: BigNumber },
  runner: ethers.Signer,
): Promise<void> => {
  const contract = new ethers.Contract(params.token, tokenAbis, runner)

  try {
    const tx: ethers.TransactionResponse = await contract.approve(
      params.spender,
      params.value.toString(),
    )
    const receipt: ethers.TransactionReceipt | null = await tx.wait()
    if (didTransactionFail(receipt)) throw new TransactionFailedError()
  } catch (error) {
    throw resolveEthersError(error, contract) ?? error
  }
}
