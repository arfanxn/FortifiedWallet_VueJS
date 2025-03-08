import { TransactionFailedError } from '@/errors/ethereum.errors'
import { isZeroAddress } from '@/helpers/string.helpers'
import { EthereumAddress } from '@/interfaces/ethereum.interfaces'
import { tryRethrow } from '@/utils/error.utils'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { WalletTuple } from '@/interfaces/wallet.interfaces'
import {
  didTransactionFail,
  didTransactionSucceed,
  isEthersError,
  resolveAndThrowEthersError,
  withResolvedEthersErrorHandling,
} from '@/helpers/ethers.helpers'
import { ResolvedEthersError } from '@/errors/ethers.error'

const _walletFactoryContractAddr = () => import.meta.env.VITE__WALLET_FACTORY_CONTRACT_ADDRESS

const walletFactoryAbis: ethers.InterfaceAbi = [
  // Errors
  // WalletDoesNotExist
  'error WalletDoesNotExist()',
  'error WalletExceededMaximum()',

  // Functions
  // getWalletAddressesBySigner
  'function getWalletAddressesBySigner(address, uint256, uint256) view returns (address[])',
  // getNewestWalletsBySigner
  'function getNewestWalletsBySigner(address, uint256, uint256) view returns (tuple(string name, address addr, address[] signers, uint256 minimumApprovals, uint256 totalBalanceInUsd)[])',
  'function getWallet(address walletAddress) view returns(tuple(string name, address addr, address[] signers, uint256 minimumApprovals, uint256 totalBalanceInUsd))',
  // createWallet
  'function createWallet(string, address[], uint256, bytes32) returns (address)',

  // Events
  // WalletCreated event
  'event WalletCreated(address indexed wallet, address[] signers)',
]

const walletAbis = [
  // deposit
  'function deposit(address token, uint256 value)',

  // Deposited event
  'event Deposited(address indexed sender, uint256 value)',
]

/**
 * Fetches a list of wallet addresses associated with a given signer.
 * @param {ethers.BrowserProvider} provider - An ethers.js provider object.
 * @param {{ signerAddr: string; offset: number; limit: number }} params - An object containing the following properties:
 *   - {string} signerAddr - The Ethereum address of the account to fetch wallets for.
 *   - {number} offset - The offset of the first wallet address to fetch.
 *   - {number} limit - The maximum number of wallet addresses to fetch.
 * @returns {Promise<string[]>} A promise that resolves to an array of wallet addresses associated with the given signer.
 * @throws {Error|ResolvedEthersError} If fails.
 */
export const fetchWalletAddressesBySigner = async (
  provider: ethers.BrowserProvider,
  params: { signer: string; offset: number; limit: number },
): Promise<string[]> => {
  const contract = new ethers.Contract(_walletFactoryContractAddr(), walletFactoryAbis, provider)
  return await withResolvedEthersErrorHandling<string[]>(async () => {
    const addresses = await contract.getWalletAddressesBySigner(
      params.signer,
      params.offset,
      params.limit,
    )
    return addresses
  }, contract)
}

/**
 * Fetches a list of wallet tuples associated with a given signer.
 * @param {ethers.BrowserProvider} provider - An ethers.js provider object.
 * @param {{ signerAddr: string; offset: number; limit: number }} params - An object containing the following properties:
 *   - {string} signerAddr - The Ethereum address of the account to fetch wallets for.
 *   - {number} offset - The offset of the first wallet to fetch.
 *   - {number} limit - The maximum number of wallets to fetch.
 * @returns {Promise<WalletTuple[]>} A promise that resolves to an array of wallet tuples associated with the given signer.
 * @throws {Error|ResolvedEthersError} If fails.
 */
export const getNewestWalletsBySigner = async (
  provider: ethers.BrowserProvider,
  params: { signer: string; offset: number; limit: number },
): Promise<WalletTuple[]> => {
  const contract = new ethers.Contract(_walletFactoryContractAddr(), walletFactoryAbis, provider)
  return await withResolvedEthersErrorHandling<WalletTuple[]>(async () => {
    const tuples = await contract.getNewestWalletsBySigner(
      params.signer,
      params.offset,
      params.limit,
    )
    return tuples
  }, contract)
}

/**
 * Fetches a wallet tuple associated with a given wallet address.
 * @param {ethers.BrowserProvider} provider - An ethers.js provider object.
 * @param {{ walletAddr: string }} params - An object containing the following properties:
 *   - {string} walletAddr - The Ethereum address of the wallet to fetch.
 * @returns {Promise<WalletTuple>} A promise that resolves to a tuple containing the wallet's name, address, signers, minimum approvals, and total balance in USD.
 * @throws {Error|ResolvedEthersError} If fails.
 */
export const getWallet = async (
  provider: ethers.BrowserProvider,
  params: { address: string },
): Promise<WalletTuple> => {
  const { address } = params
  const contract = new ethers.Contract(_walletFactoryContractAddr(), walletFactoryAbis, provider)

  return await withResolvedEthersErrorHandling<WalletTuple>(async () => {
    const tuple = await contract.getWallet(address)
    return tuple
  }, contract)
}

export const createWallet = async (
  signer: ethers.Signer,
  params: { name: string; signers: string[]; minimumApprovals: number; passwordHash: string },
): Promise<string> => {
  const contract = new ethers.Contract(_walletFactoryContractAddr(), walletFactoryAbis, signer)

  return await withResolvedEthersErrorHandling<string>(async () => {
    // Create a new wallet with the given parameters
    const tx: ethers.TransactionResponse = await contract.createWallet(
      params.name,
      params.signers,
      params.minimumApprovals,
      params.passwordHash,
    )
    // Wait for the transaction to be mined
    const receipt: ethers.TransactionReceipt | null = await tx.wait()
    // Extract the wallet address from the event emitted by the contract
    if (didTransactionSucceed(receipt)) {
      const logs: readonly ethers.Log[] = receipt.logs
      const event: ethers.EventLog = logs[0] as ethers.EventLog
      const walletAddr = event.args[0]
      return walletAddr
    } else {
      // If the transaction failed, throw an error
      throw new TransactionFailedError()
    }
  }, contract)
}

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
  const contract = new ethers.Contract(to, walletAbis, signer)

  withResolvedEthersErrorHandling(async () => {
    const tx: ethers.TransactionResponse = isZeroAddress(token)
      ? await contract.deposit(token, value, { value }) // Deposit ETH
      : await contract.deposit(token, value) // Deposit ERC-20 tokens

    // We use the `wait()` method to wait for the transaction to be mined
    const receipt: ethers.TransactionReceipt | null = await tx.wait()

    // If the transaction failed, throw an error
    if (didTransactionFail(receipt)) throw new TransactionFailedError()
  }, contract)
}
