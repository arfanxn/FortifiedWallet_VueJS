// services/ethereumService.ts
import { MetamaskNotInstalledError } from '../errors/ethereum.errors'
import { ethers } from 'ethers'

/**
 * Connects to the Ethereum network using MetaMask as a provider.
 *
 * @returns {Promise<ethers.BrowserProvider>} A promise that resolves to an ethers.js provider object.
 * @throws {Error} If MetaMask is not installed or available in the browser.
 */

export const connect = async (): Promise<ethers.BrowserProvider> => {
  if (!window.ethereum || !window.ethereum.isMetaMask) throw new MetamaskNotInstalledError()
  const provider = new ethers.BrowserProvider(window.ethereum)
  return provider
}

/**
 * Requests the connected Ethereum accounts from the provider.
 *
 * @param {Promise<ethers.BrowserProvider>} provider An ethers.js provider object.
 * @returns {Promise<string[]>} A promise that resolves to an array of connected
 * Ethereum account addresses.
 */
export const getAccounts = async (provider: ethers.BrowserProvider) => {
  const accounts = await provider.send('eth_requestAccounts', [])
  return accounts
}
