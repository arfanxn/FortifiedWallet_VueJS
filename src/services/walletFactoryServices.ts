import { TransactionFailedError } from '@/errors/ethereumErrors'
import { ethers } from 'ethers'
import { WalletTuple } from '@/interfaces/walletInterfaces'
import { didTransactionSucceed, resolveEthersError } from '@/helpers/ethersHelpers'

const _walletFactoryContractAddr = () => import.meta.env.VITE__WALLET_FACTORY

const walletViewAbi =
  'tuple(string name, address addr, address[] signers, uint256 minimumApprovals, uint256 totalBalanceInUsd, uint256 totalLockedBalanceInUsd, uint256 totalUnlockedBalanceInUsd)'

const abis: ethers.InterfaceAbi = [
  // Errors
  // WalletDoesNotExist
  'error WalletDoesNotExist()',
  'error WalletExceededMaximum()',

  // Functions
  // getWalletAddressesBySigner
  'function getWalletAddressesBySigner(address, uint256, uint256) view returns (address[])',
  // getNewestWalletsBySigner
  `function getNewestWalletsBySigner(address, uint256, uint256) view returns (${walletViewAbi}[])`,
  `function getWallet(address walletAddress) view returns(${walletViewAbi})`,
  // createWallet
  'function createWallet(string, address[], uint256, bytes32) returns (address)',

  // Events
  // WalletCreated event
  'event WalletCreated(address indexed wallet, address[] signers)',
]

/**
 * Fetches a list of wallet addresses associated with a given signer.
 * @param {{ signerAddr: string; offset: number; limit: number }} params - An object containing the following properties:
 *   - {string} signerAddr - The Ethereum address of the account to fetch wallets for.
 *   - {number} offset - The offset of the first wallet address to fetch.
 *   - {number} limit - The maximum number of wallet addresses to fetch.
 * @param {ethers.BrowserProvider} runner - An ethers.js provider object.
 * @returns {Promise<string[]>} A promise that resolves to an array of wallet addresses associated with the given signer.
 * @throws {Error|ResolvedEthersError} If fails.
 */
export const fetchWalletAddressesBySigner = async (
  params: { signer: string; offset: number; limit: number },
  runner: ethers.BrowserProvider,
): Promise<string[]> => {
  const contract = new ethers.Contract(_walletFactoryContractAddr(), abis, runner)
  try {
    const addresses = await contract.getWalletAddressesBySigner(
      params.signer,
      params.offset,
      params.limit,
    )
    return addresses
  } catch (error) {
    throw resolveEthersError(error, contract) ?? error
  }
}

/**
 * Fetches a list of wallet tuples associated with a given signer.
 * @param {{ signerAddr: string; offset: number; limit: number }} params - An object containing the following properties:
 *   - {string} signerAddr - The Ethereum address of the account to fetch wallets for.
 *   - {number} offset - The offset of the first wallet to fetch.
 *   - {number} limit - The maximum number of wallets to fetch.
 * @param {ethers.BrowserProvider} runner - An ethers.js provider object.
 * @returns {Promise<WalletTuple[]>} A promise that resolves to an array of wallet tuples associated with the given signer.
 * @throws {Error|ResolvedEthersError} If fails.
 */
export const getNewestWalletsBySigner = async (
  params: { signer: string; offset: number; limit: number },
  runner: ethers.BrowserProvider,
): Promise<WalletTuple[]> => {
  const contract = new ethers.Contract(_walletFactoryContractAddr(), abis, runner)
  try {
    const tuples = await contract.getNewestWalletsBySigner(
      params.signer,
      params.offset,
      params.limit,
    )
    return tuples
  } catch (error) {
    throw resolveEthersError(error, contract) ?? error
  }
}

/**
 * Fetches a wallet tuple associated with a given wallet address.
 * @param {{ walletAddr: string }} params - An object containing the following properties:
 * @param {ethers.BrowserProvider} runner - An ethers.js provider object.
 *   - {string} walletAddr - The Ethereum address of the wallet to fetch.
 * @returns {Promise<WalletTuple>} A promise that resolves to a tuple containing the wallet's name, address, signers, minimum approvals, and total balance in USD.
 * @throws {Error|ResolvedEthersError} If fails.
 */
export const getWallet = async (
  params: { address: string },
  runner: ethers.BrowserProvider,
): Promise<WalletTuple> => {
  const { address } = params
  const contract = new ethers.Contract(_walletFactoryContractAddr(), abis, runner)
  try {
    const tuple = await contract.getWallet(address)
    return tuple
  } catch (error) {
    throw resolveEthersError(error, contract) ?? error
  }
}

export const createWallet = async (
  params: { name: string; signers: string[]; minimumApprovals: number; passwordHash: string },
  signer: ethers.Signer,
): Promise<string> => {
  const contract = new ethers.Contract(_walletFactoryContractAddr(), abis, signer)

  try {
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
  } catch (error) {
    throw resolveEthersError(error, contract) ?? error
  }
}
