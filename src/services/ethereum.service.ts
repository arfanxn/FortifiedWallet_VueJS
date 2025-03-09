// services/ethereumService.ts
import { MetamaskNotInstalledError } from '../errors/ethereum.errors'
import { ethers } from 'ethers'

/**
 * Ensures that MetaMask is installed and throws an error if it is not.
 *
 * @returns {boolean} True if MetaMask is installed, false otherwise.
 * @throws {MetamaskNotInstalledError} If MetaMask is not installed.
 */
export const ensureMetamaskInstalled = (): boolean => {
  if (!window.ethereum || !window.ethereum.isMetaMask) throw new MetamaskNotInstalledError()
  return true
}

/**
 * Connects to the Ethereum provider by first checking if MetaMask is installed
 * and then creates an ethers.js provider object.
 *
 * @returns {Promise<ethers.BrowserProvider>} A promise that resolves to the provider
 * object.
 * @throws {MetamaskNotInstalledError} If MetaMask is not installed.
 */
export const connect = async (): Promise<ethers.BrowserProvider> => {
  ensureMetamaskInstalled()
  const provider = new ethers.BrowserProvider(window.ethereum!)
  return provider
}

/**
 * Retrieves the list of Ethereum accounts available through the provider.
 *
 * @param {ethers.BrowserProvider} provider - An ethers.js provider object.
 * @returns {Promise<string[]>} A promise that resolves to an array of account addresses.
 */
export const getAccounts = async (provider: ethers.BrowserProvider): Promise<string[]> => {
  ensureMetamaskInstalled()
  const accounts = await provider.send('eth_requestAccounts', [])
  return accounts
}

/**
 * Listens for the 'accountsChanged' event emitted by the MetaMask provider. This
 * event is emitted whenever the user changes their account.
 *
 * @param {(...args: any[]) => void} listener - The callback function to run when
 * the event is emitted.
 */
export const listenAccountsChanged = (listener: (...args: any[]) => void) => {
  ensureMetamaskInstalled()
  window.ethereum!.on('accountsChanged', listener)
}

/**
 * Removes all listeners from the MetaMask provider.
 *
 * @param {ethers.BrowserProvider} provider - An ethers.js provider object.
 */
export const removeAllListeners = async (provider: ethers.BrowserProvider) => {
  await provider?.removeAllListeners()
  await window.ethereum?.removeAllListeners?.()
}
