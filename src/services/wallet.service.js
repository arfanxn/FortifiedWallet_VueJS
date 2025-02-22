// services/wallet.service.js
import { ethers } from "ethers";

const _walletFactoryContractAddress = () => import.meta.env.VITE__WALLET_FACTORY_CONTRACT_ADDRESS

const walletFactoryAbis = [
  // getWalletAddressesBySigner
  'function getWalletAddressesBySigner(address, uint256, uint256) view returns (address[])',
  // getWalletsBySigner
  'function getWalletsBySigner(address, uint256, uint256) view returns (tuple(string name, address addr, address[] signers, uint256 minimumApprovals, uint256 totalBalanceInUsd)[])',

  // createWallet
  'function createWallet(string, address[], uint256, bytes32) returns (address)'
]

/**
 * Fetches wallet addresses associated with a specific signer.
 *
 * @param {Object} provider - An ethers.js provider object used to interact with the Ethereum network.
 * @param {string} signerAddress - The Ethereum address of the signer whose wallet addresses are to be fetched.
 * @param {number} offset - The starting index from which wallet addresses should be fetched.
 * @param {number} limit - The maximum number of wallet addresses to fetch.
 * @returns {Promise<string[]>} A promise that resolves to an array of wallet addresses associated with the signer.
 */
export const fetchWalletAddressesBySigner = async (provider, signerAddress, offset, limit) => {
  const walletFactoryContract = new ethers.Contract(_walletFactoryContractAddress(), walletFactoryAbis, provider)
  const addresses = await walletFactoryContract.getWalletAddressesBySigner(signerAddress, offset, limit)
  return addresses
}

/**
 * Fetches wallet data associated with a specific signer.
 *
 * @param {Object} provider - An ethers.js provider object for interacting with Ethereum.
 * @param {string} signerAddress - The Ethereum address of the signer whose wallets are being fetched.
 * @param {number} offset - The starting point for fetching wallets (for pagination purposes).
 * @param {number} limit - The maximum number of wallets to fetch.
 * @returns {Promise<tuple[]>} A promise that resolves to an array of tuples, each containing:
 *   - string name: The name of the wallet.
 *   - address addr: The Ethereum address of the wallet.
 *   - address[] signers: The list of signers for the wallet.
 *   - number minimumApprovals: The minimum number of approvals required for transactions.
 *   - number totalBalanceInUsd: The total balance of the wallet in USD (assuming 18 decimals).
 */
export const fetchWalletsBySigner = async (provider, signerAddress, offset, limit) => {
  const walletFactoryContract = new ethers.Contract(_walletFactoryContractAddress(), walletFactoryAbis, provider)
  const tuples = await walletFactoryContract.getWalletsBySigner(signerAddress, offset, limit)
  return tuples
}


export const createWallet = async (signer, name, signers, minimumApprovals, passwordHash) => {
  const walletFactoryContract = new ethers.Contract(
    _walletFactoryContractAddress(),
    ["function createWallet(string, address[], uint256, bytes32) returns (address)"],
    signer
  );

  // const _signers = ['0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '0x70997970C51812dc3A010C7d01b50e0d17dc79C8']
  // console.log(signers, _signers)
  // signers = _signers
  console.log('it goes here...')
  const tx = await walletFactoryContract.createWallet(name, signers, minimumApprovals, passwordHash)
  const receipt = await tx.wait();
  console.log(receipt.logs)

  return true
}

// TESTING
// export const writeValue = async (signer, value) => {
//   console.log('write value is called');

//   // Check if signer is valid
//   if (!signer || !signer.sendTransaction) {
//     console.log('signer is invalid');
//     throw new Error('Invalid signer: cannot send transactions');
//   }

//   const contract = new ethers.Contract(
//     _walletFactoryContractAddress(),
//     ["function writeValue(uint256 value) returns (bool)"],
//     signer // Ensure this is a Signer, not a Provider
//   );

//   try {
//     const tx = await contract.writeValue(value);
//     const receipt = await tx.wait();
//     console.log(receipt.logs);
//     console.log('write value call is done');
//     return true;
//   } catch (error) {
//     console.error('Transaction failed:', error);
//     throw error;
//   }
// };
