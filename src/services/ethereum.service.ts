// services/ethereumService.ts
import { MetamaskNotInstalledError } from '../errors/ethereum.errors'
import { ethers } from 'ethers'

/**
 * Connects to the Ethereum provider by first checking if MetaMask is installed
 * and then creates an ethers.js provider object.
 *
 * @returns {Promise<ethers.BrowserProvider>} A promise that resolves to the provider
 * object.
 * @throws {MetamaskNotInstalledError} If MetaMask is not installed.
 */
export const connect = async (): Promise<ethers.BrowserProvider> => {
  if (!window.ethereum || !window.ethereum.isMetaMask) throw new MetamaskNotInstalledError()
  const provider = new ethers.BrowserProvider(window.ethereum)
  return provider
}

/**
 * Retrieves the list of Ethereum accounts available through the provider.
 *
 * @param {ethers.BrowserProvider} provider - An ethers.js provider object.
 * @returns {Promise<string[]>} A promise that resolves to an array of account addresses.
 */
export const getAccounts = async (provider: ethers.BrowserProvider): Promise<string[]> => {
  const accounts = await provider.send('eth_requestAccounts', [])
  return accounts
}
