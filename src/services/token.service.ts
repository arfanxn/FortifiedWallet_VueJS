import { TransactionFailedError } from '@/errors/ethereum.errors'
import { didTransactionFail } from '@/helpers/ethereum.helpers'
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

interface ApproveParams {
  spender: EthereumAddress
  value: BigNumber // Depending on whether you're using bigint or string representation
}

/**
 * Approves a certain amount of a token to be spent by a certain spender.
 *
 * @param {ethers.Signer} providerSigner - An ethers.js Signer object for interacting with Ethereum.
 * @param {EthereumAddress} token - The Ethereum address of the token to be approved.
 * @param {{ spender: string, value: BigNumber }} opts - An object containing the following properties:
 *   - {string} spender - The Ethereum address of the account that is allowed to spend the token.
 *   - {BigNumber} value - The amount of the token to be approved.
 * @returns {Promise<void>} A promise that resolves when the approval transaction has been successfully mined.
 * @throws {Error|TransactionFailedError} If fails.
 */
export const approve = async (
  providerSigner: ethers.Signer,
  token: EthereumAddress,
  { spender, value }: ApproveParams,
): Promise<void> => {
  await tryRethrow(async () => {
    const contract = new ethers.Contract(token, tokenAbis, providerSigner)
    const tx = await contract.approve(spender, value)
    const receipt = await tx.wait()
    if (didTransactionFail(receipt)) throw new TransactionFailedError()
  })
}
