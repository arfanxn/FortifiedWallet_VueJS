// services/wallet.service.js
import { isZeroAddress } from "@/helpers/string.helpers";
import { ethers } from "ethers";

const _walletFactoryContractAddr = () => import.meta.env.VITE__WALLET_FACTORY_CONTRACT_ADDRESS

const walletFactoryAbis = [
  // getWalletAddressesBySigner
  'function getWalletAddressesBySigner(address, uint256, uint256) view returns (address[])',
  // getWalletsBySigner
  'function getWalletsBySigner(address, uint256, uint256) view returns (tuple(string name, address addr, address[] signers, uint256 minimumApprovals, uint256 totalBalanceInUsd)[])',

  // createWallet
  'function createWallet(string, address[], uint256, bytes32) returns (address)'
]

const walletAbis = [
  // deposit
  'function deposit(address token, uint256 value)',
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
export const fetchWalletsBySigner = async (provider, signerAddr, { offset, limit }) => {
  const contract = new ethers.Contract(_walletFactoryContractAddr(), walletFactoryAbis, provider)
  const tuples = await contract.getWalletsBySigner(signerAddr, offset, limit)
  return tuples
}


export const createWallet = async (providerSigner, { name, signers, minimumApprovals, passwordHash }) => {
  // TODO: update this function to follows blockchain function best practice
  const contract = new ethers.Contract(_walletFactoryContractAddr(), walletFactoryAbis, providerSigner);

  const tx = await contract.createWallet(name, signers, minimumApprovals, passwordHash)
  const receipt = await tx.wait()
  console.log(receipt.logs)
  return true
}


export const deposit = async (signer, walletAddr, { token, value }) => {
  // TODO: update this function to follows blockchain function best practice
  const contract = new ethers.Contract(walletAddr, walletAbis, signer);

  // Deposit either ETH (when token is the zero address) or ERC-20 tokens (when token is a valid contract address)
  const tx = isZeroAddress(token)
    ? await contract.deposit(token, value, { value }) // Deposit ETH
    : await contract.deposit(token, value) // Deposit ERC-20 tokens
  const receipt = await tx.wait()
  console.log(receipt.logs)
  return true
}

