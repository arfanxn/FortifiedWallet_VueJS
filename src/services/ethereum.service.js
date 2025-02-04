// services/ethereumService.ts
import { ethers } from "ethers";

class EthereumService {
  /**
   * Initializes a new instance of the EthersService class.
   *
   * This constructor sets the provider property to null, preparing the service
   * for future connection to an Ethereum provider like MetaMask.
   */
  constructor() {
    this.provider = null;
  }

  /**
   * Returns a connected signer for a given Ethereum account.
   *
   * @param {string} account - The Ethereum account address.
   * @returns {Promise<ethers.Signer>} A promise that resolves to a connected
   * Ethereum signer.
   *
   * @throws {Error} - If the provider is not connected.
   */
  async getSigner(account) {
    if (!this.provider) throw new Error('Not connected!')
    return this.provider.getSigner(account)
  }

  /**
   * Returns the connected Ethereum network.
   *
   * @returns {Promise<ethers.Network>} A promise that resolves to the
   * connected Ethereum network.
   *
   * @throws {Error} - If the provider is not connected.
   */
  async getNetwork() {
    if (!this.provider) throw new Error('Not connected!')
    return this.provider.getNetwork()
  }

  /**
   * Connects to the MetaMask Ethereum provider and initializes the
   * provider and signer for interaction with the Ethereum blockchain.
   *
   * If MetaMask is not installed, it throws an error.
   *
   * @returns {Promise<string[]>} A promise that resolves to an array of
   * connected Ethereum accounts.
   *
   * @throws {Error} If MetaMask is not installed.
   */
  async connect() {
    if (!window.ethereum || !window.ethereum.isMetaMask) throw new Error('MetaMask is not installed!');

    this.provider = new ethers.BrowserProvider(window.ethereum);

    const accounts = await this.provider.send('eth_requestAccounts', [])
    return accounts
  }

  async disconnect() {
    await this.provider.removeAllListeners()
    await window.ethereum.removeAllListeners()
    this.provider = null
    this.signer = null
  }

  /**
   * Sets up an event listener for the accountsChanged event emitted by the
   * connected Ethereum provider. This event is emitted whenever the connected
   * Ethereum accounts change (e.g. when the user logs in/out of MetaMask).
   *
   * @param {function(string[])} callback The callback function to run when
   * the accounts change. The callback is passed an array of Ethereum account
   * addresses.
   */
  onAccountsChanged(callback) {
    window.ethereum.on('accountsChanged', callback)
  }

  /*
  async getBalance(provider, account) {
    const balanceInWei = await provider.getBalance(account);
    return ethers.utils.formatEther(balanceInWei);
  }
  */
}

export const ethereumService = new EthereumService();
