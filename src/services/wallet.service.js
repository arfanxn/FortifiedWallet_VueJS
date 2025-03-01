// services/wallet.service.js
import { TransactionFailedError } from "@/errors/ethereum.errors";
import { didTransactionFail, } from "@/helpers/ethereum.helpers";
import { isZeroAddress } from "@/helpers/string.helpers";
import { tryRethrow } from "@/utils/error.utils";
import { ethers } from "ethers";

const _walletFactoryContractAddr = () => import.meta.env.VITE__WALLET_FACTORY_CONTRACT_ADDRESS

const walletFactoryAbis = [
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
 * Fetches wallet addresses associated with a specific signer.
 *
 * @param {Object} provider - An ethers.js provider object used to interact with the Ethereum network.
 * @param {string} signerAddr - The Ethereum address of the signer whose wallet addresses are to be fetched.
 * @param {number} offset - The starting index from which wallet addresses should be fetched.
 * @param {number} limit - The maximum number of wallet addresses to fetch.
 * @returns {Promise<string[]>} A promise that resolves to an array of wallet addresses associated with the signer.
 */
export const fetchWalletAddressesBySigner = async (provider, signerAddr, { offset, limit }) => {
  const contract = new ethers.Contract(_walletFactoryContractAddr(), walletFactoryAbis, provider)
  const addresses = await contract.getWalletAddressesBySigner(signerAddr, offset, limit)
  return addresses
}

/**
 * Fetches wallet data associated with a specific signer.
 *
 * @param {Object} provider - An ethers.js provider object for interacting with Ethereum.
 * @param {string} signerAddr - The Ethereum address of the signer whose wallets are being fetched.
 * @param {number} offset - The starting point for fetching wallets (for pagination purposes).
 * @param {number} limit - The maximum number of wallets to fetch.
 * @returns {Promise<tuple[]>} A promise that resolves to an array of tuples, each containing:
 *   - string name: The name of the wallet.
 *   - address addr: The Ethereum address of the wallet.
 *   - address[] signers: The list of signers for the wallet.
 *   - number minimumApprovals: The minimum number of approvals required for transactions.
 *   - number totalBalanceInUsd: The total balance of the wallet in USD (assuming 18 decimals).
 */
export const getNewestWalletsBySigner = async (provider, { signerAddr, offset, limit }) => {
  const contract = new ethers.Contract(_walletFactoryContractAddr(), walletFactoryAbis, provider)
  const tuples = await contract.getNewestWalletsBySigner(signerAddr, offset, limit)
  return tuples
}

/**
 * Retrieves a specific wallet.
 *
 * @param {Object} provider - An ethers.js provider object for interacting with Ethereum.
 * @param {Object} opts - An object containing the following properties:
 *   - {string} walletAddr - The Ethereum address of the wallet to be retrieved.
 * @returns {Promise<tuple>} A promise that resolves to a tuple containing:
 *   - string name: The name of the wallet.
 *   - address addr: The Ethereum address of the wallet.
 *   - address[] signers: The list of signers for the wallet.
 *   - number minimumApprovals: The minimum number of approvals required for transactions.
 *   - number totalBalanceInUsd: The total balance of the wallet in USD (assuming 18 decimals).
 * @throws {Error} If fails.
 */
export const getWallet = async (provider, { walletAddr }) => {
  return await tryRethrow(async () => {
    const contract = new ethers.Contract(_walletFactoryContractAddr(), walletFactoryAbis, provider)
    const tuple = await contract.getWallet(walletAddr)
    return tuple
  })
}

/**
 * Creates a new wallet by interacting with the wallet factory contract.
 *
 * @param {Object} providerSigner - An ethers.js signer object for signing transactions.
 * @param {Object} opts - An object containing the following properties:
 *   - {string} name - The name of the wallet.
 *   - {address[]} signers - The list of signer addresses authorized for the wallet.
 *   - {number} minimumApprovals - The minimum number of approvals required for transactions.
 *   - {string} passwordHash - A hash representing the password for the wallet.
 * @returns {Promise<string>} The address of the newly created wallet.
 * @throws {Error|TransactionFailedError} If fails.
 */
export const createWallet = async (providerSigner, { name, signers, minimumApprovals, passwordHash }) => {
  return await tryRethrow(async () => {
    const contract = new ethers.Contract(_walletFactoryContractAddr(), walletFactoryAbis, providerSigner);
    const tx = await contract.createWallet(name, signers, minimumApprovals, passwordHash)
    const receipt = await tx.wait()
    // Check if transaction was successful
    if (didTransactionFail(receipt)) throw new TransactionFailedError();
    const logs = receipt.logs
    const event = logs[0]
    const walletAddr = event.args[0]
    return walletAddr
  })
}

/**
 * Deposits funds into a wallet. This function will throw an exception if the contract call fails.
 *
 * @param {Object} signer - An ethers.js signer object for interacting with Ethereum.
 * @param {string} walletAddr - The Ethereum address of the wallet to deposit funds into.
 * @param {Object} opts - An object containing the following properties:
 *   - {string} token - The Ethereum address of the token to deposit. If the zero address is provided, ETH is deposited.
 *   - {string|number|BN} value - The amount of the token (or ETH) to deposit.
 * @returns {Promise<boolean>} A promise that resolves to true if the deposit was successful.
 * @throws {Error|TransactionFailedError} If fails.
 */
export const deposit = async (signer, walletAddr, { token, value }) => {
  await tryRethrow(async () => {
    const contract = new ethers.Contract(walletAddr, walletAbis, signer);

    // Deposit either ETH (when token is the zero address) or ERC-20 tokens (when token is a valid contract address)
    const tx = isZeroAddress(token)
      ? await contract.deposit(token, value, { value }) // Deposit ETH
      : await contract.deposit(token, value) // Deposit ERC-20 tokens
    const receipt = await tx.wait()
    // Check if transaction was successful
    if (didTransactionFail(receipt)) throw new TransactionFailedError();
  })
}

