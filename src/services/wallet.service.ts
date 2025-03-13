import { TransactionFailedError } from '@/errors/ethereum.errors'
import { isZeroAddress } from '@/helpers/string.helpers'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { TransactionTuple } from '@/interfaces/transaction.interfaces'
import {
  didTransactionFail,
  didTransactionSucceed,
  resolveEthersError,
} from '@/helpers/ethers.helpers'

const abis = [
  // deposit
  'function deposit(address token, uint256 value)',
  // createTransaction
  'function createTransaction(address token, address to, uint256 value) returns (bytes32 txHash)',
  // approveTransaction
  'function approveTransaction(bytes32 txHash)',
  // revokeTransaction
  'function revokeTransaction(bytes32 txHash)',
  // cancelTransaction
  'function cancelTransaction(bytes32 txHash)',
  // executeTransaction
  'function executeTransaction(bytes32 txHash)',
  // getNewestTransactions
  'function getNewestTransactions(uint256 offset, uint256 limit) view returns (tuple(bytes32 hash, address token, address to, uint256 value, uint256 valueInUsd, uint8 approvalCount, address[] approvers, uint256 createdAt, uint256 executedAt, uint256 cancelledAt)[])',

  // Deposited event
  'event Deposited(address indexed sender, uint256 value)',
  // TransactionCreated event
  'event TransactionCreated(bytes32 indexed txHash, address indexed to, uint256 value, address token)',
  // TransactionApproved event
  'event TransactionApproved(bytes32 indexed txHash, address indexed approver)',
  // TransactionRevoked event
  'event TransactionRevoked(bytes32 indexed txHash, address indexed revoker)',
  // TransactionCancelled event
  'event TransactionCancelled(bytes32 indexed txHash, address indexed canceller)',
  // TransactionExecuted event
  'event TransactionExecuted(bytes32 indexed txHash, address indexed executor)',
]

/**
 * Deposits a certain amount of a token into a wallet.
 *
 * @param {{ to: string, token: string, value: BigNumber }} params - An object containing the following properties:
 *   - {string} to - The Ethereum address of the wallet to deposit into.
 *   - {string} token - The Ethereum address of the token to deposit. If this is the zero address, it means depositing Ether.
 *   - {BigNumber} value - The amount of the token to deposit.
 * @param {ethers.Signer} runner - An ethers.js Signer object for interacting with Ethereum.
 * @returns {Promise<void>} A promise that resolves when the transaction has been successfully mined.
 * @throws {Error|TransactionFailedError} If fails.
 */
export const deposit = async (
  params: { to: string; token: string; value: BigNumber },
  runner: ethers.Signer,
): Promise<void> => {
  const { to, token, value } = params
  const contract = new ethers.Contract(to, abis, runner)

  try {
    const tx: ethers.TransactionResponse = isZeroAddress(token)
      ? await contract.deposit(token, value.toString(), { value: value.toString() }) // Deposit ETH
      : await contract.deposit(token, value.toString()) // Deposit ERC-20 tokens

    // We use the `wait()` method to wait for the transaction to be mined
    const receipt: ethers.TransactionReceipt | null = await tx.wait()

    // If the transaction failed, throw an error
    if (didTransactionFail(receipt)) throw new TransactionFailedError()
  } catch (error) {
    throw resolveEthersError(error, contract) ?? error
  }
}

export const createTransaction = async (
  params: { token: string; to: string; value: BigNumber },
  walletAddr: string,
  runner: ethers.Signer,
): Promise<string> => {
  const { token, to, value } = params
  const contract = new ethers.Contract(walletAddr, abis, runner)

  try {
    const tx: ethers.TransactionResponse = await contract.createTransaction(
      token,
      to,
      value.toString(),
    )

    // We use the `wait()` method to wait for the transaction to be mined
    const receipt: ethers.TransactionReceipt | null = await tx.wait()

    // Extract the transaction hash from the event emitted by the contract
    if (didTransactionSucceed(receipt)) {
      const logs: readonly ethers.Log[] = receipt.logs
      const event: ethers.EventLog = logs[0] as ethers.EventLog
      const txHash = event.args[0]
      return txHash
    } else {
      // If the transaction failed, throw an error
      throw new TransactionFailedError()
    }
  } catch (error) {
    throw resolveEthersError(error, contract) ?? error
  }
}

export const approveTransaction = async (
  params: { hash: string },
  walletAddr: string,
  runner: ethers.Signer,
): Promise<boolean> => {
  const { hash } = params
  const contract = new ethers.Contract(walletAddr, abis, runner)
  try {
    const tx: ethers.TransactionResponse = await contract.approveTransaction(hash)
    const receipt: ethers.TransactionReceipt | null = await tx.wait()

    if (didTransactionSucceed(receipt)) return true
    else throw new TransactionFailedError()
  } catch (error) {
    throw resolveEthersError(error, contract) ?? error
  }
}

export const revokeTransaction = async (
  params: { hash: string },
  walletAddr: string,
  runner: ethers.Signer,
): Promise<boolean> => {
  const { hash } = params
  const contract = new ethers.Contract(walletAddr, abis, runner)
  try {
    const tx: ethers.TransactionResponse = await contract.revokeTransaction(hash)
    const receipt: ethers.TransactionReceipt | null = await tx.wait()

    if (didTransactionSucceed(receipt)) return true
    else throw new TransactionFailedError()
  } catch (error) {
    throw resolveEthersError(error, contract) ?? error
  }
}

export const cancelTransaction = async (
  params: { hash: string },
  walletAddr: string,
  runner: ethers.Signer,
): Promise<boolean> => {
  const { hash } = params
  const contract = new ethers.Contract(walletAddr, abis, runner)
  try {
    const tx: ethers.TransactionResponse = await contract.cancelTransaction(hash)
    const receipt: ethers.TransactionReceipt | null = await tx.wait()

    if (didTransactionSucceed(receipt)) return true
    else throw new TransactionFailedError()
  } catch (error) {
    throw resolveEthersError(error, contract) ?? error
  }
}

export const executeTransaction = async (
  params: { hash: string },
  walletAddr: string,
  runner: ethers.Signer,
): Promise<boolean> => {
  const { hash } = params
  const contract = new ethers.Contract(walletAddr, abis, runner)
  try {
    const tx: ethers.TransactionResponse = await contract.executeTransaction(hash)
    const receipt: ethers.TransactionReceipt | null = await tx.wait()

    if (didTransactionSucceed(receipt)) return true
    else throw new TransactionFailedError()
  } catch (error) {
    throw resolveEthersError(error, contract) ?? error
  }
}

export async function getNewestTransactions(
  params: { offset: number; limit: number },
  walletAddr: string,
  runner: ethers.BrowserProvider,
): Promise<TransactionTuple[]> {
  const contract = new ethers.Contract(walletAddr, abis, runner)
  try {
    const tuples: TransactionTuple[] = await contract.getNewestTransactions(
      params.offset,
      params.limit,
    )
    return tuples
  } catch (error) {
    throw resolveEthersError(error, contract) ?? error
  }
}

export async function getTransaction(
  params: { hash: string },
  walletAddr: string,
  runner: ethers.BrowserProvider,
) {
  const contract = new ethers.Contract(walletAddr, abis, runner)
  try {
    const tuple: TransactionTuple = await contract.getTransaction(params.hash)
    return tuple
  } catch (error) {
    throw resolveEthersError(error, contract) ?? error
  }
}
