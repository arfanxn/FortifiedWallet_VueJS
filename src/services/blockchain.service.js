// services/ethereumService.ts
import { ethers } from "ethers";


/**
 * Connects to the Ethereum network using MetaMask as a provider.
 *
 * @returns {Promise<Object>} A promise that resolves to an ethers.js provider object.
 * @throws {Error} If MetaMask is not installed or available in the browser.
 */

export const connect = async () => {
  if (!window.ethereum || !window.ethereum.isMetaMask) throw new Error('MetaMask is not installed!');
  const provider = new ethers.BrowserProvider(window.ethereum);
  return provider
}

/**
 * Requests the connected Ethereum accounts from the provider.
 *
 * @param {Object} provider An ethers.js provider object.
 * @returns {Promise<string[]>} A promise that resolves to an array of connected
 * Ethereum account addresses.
 */
export const getAccounts = async (provider) => {
  const accounts = await provider.send('eth_requestAccounts', [])
  return accounts
}
