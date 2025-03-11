import { TransactionFailedError } from '@/errors/ethereum.errors'
import { isZeroAddress } from '@/helpers/string.helpers'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { WalletTuple } from '@/interfaces/wallet.interfaces'
import {
  didTransactionFail,
  didTransactionSucceed,
  withResolvedEthersErrorHandling,
} from '@/helpers/ethers.helpers'

const abis = [
  // deposit
  'function deposit(address token, uint256 value)',
  // createTransaction
  'function createTransaction(address token, address to, uint256 value) returns (bytes32 txHash)',

  // Deposited event
  'event Deposited(address indexed sender, uint256 value)',
  // TransactionCreated event
  'event TransactionCreated(bytes32 indexed txHash, address indexed to ,uint256 value ,address token)',
]

/**
 * Deposits a certain amount of a token into a wallet.
 *
 * @param {ethers.Signer} signer - An ethers.js Signer object for interacting with Ethereum.
 * @param {{ to: string, token: string, value: BigNumber }} params - An object containing the following properties:
 *   - {string} to - The Ethereum address of the wallet to deposit into.
 *   - {string} token - The Ethereum address of the token to deposit. If this is the zero address, it means depositing Ether.
 *   - {BigNumber} value - The amount of the token to deposit.
 * @returns {Promise<void>} A promise that resolves when the transaction has been successfully mined.
 * @throws {Error|TransactionFailedError} If fails.
 */
export const deposit = async (
  signer: ethers.Signer,
  params: { to: string; token: string; value: BigNumber },
): Promise<void> => {
  const { to, token, value } = params
  const contract = new ethers.Contract(to, abis, signer)

  await withResolvedEthersErrorHandling(async () => {
    const tx: ethers.TransactionResponse = isZeroAddress(token)
      ? await contract.deposit(token, value.toString(), { value: value.toString() }) // Deposit ETH
      : await contract.deposit(token, value.toString()) // Deposit ERC-20 tokens

    // We use the `wait()` method to wait for the transaction to be mined
    const receipt: ethers.TransactionReceipt | null = await tx.wait()

    // If the transaction failed, throw an error
    if (didTransactionFail(receipt)) throw new TransactionFailedError()
  }, contract)
}

export const createTransaction = async (
  signer: ethers.Signer,
  params: { from: string; token: string; to: string; value: BigNumber },
): Promise<string> => {
  const { from, token, to, value } = params
  const contract = new ethers.Contract(from, abis, signer)

  return await withResolvedEthersErrorHandling<string>(async () => {
    const tx: ethers.TransactionResponse = await contract.createTransaction(
      token,
      to,
      value.toString(),
    )

    // We use the `wait()` method to wait for the transaction to be mined
    const receipt: ethers.TransactionReceipt | null = await tx.wait()

    console.log('receipt: ', receipt)

    // Extract the transaction hash from the event emitted by the contract
    if (didTransactionSucceed(receipt)) {
      const logs: readonly ethers.Log[] = receipt.logs
      console.log('logs: ', logs)
      const event: ethers.EventLog = logs[0] as ethers.EventLog
      console.log('event: ', event)
      console.log('event.args: ', event.args)
      const txHash = event.args[0]
      return txHash
    } else {
      // If the transaction failed, throw an error
      throw new TransactionFailedError()
    }
  }, contract)
}
