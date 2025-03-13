import BigNumber from 'bignumber.js'
import currency from 'currency.js'
import { ethers } from 'ethers'
import { EthereumAddress } from '@/interfaces/ethereum.interfaces'
import { isEthAddr } from '@/utils/boolean.utils'

/**
 * Formats a given amount of Ether as a string in USD format.
 *
 * @param {string|number|BigNumber} amount - The amount of Ether to format, where 1 Ether is equal to 10^18 Wei.
 * @param {boolean} withSymbol - Whether to include the currency symbol in the formatted string.
 * @returns {string} The formatted string, with the currency symbol and two decimal places.
 */
export function formatUsd(
  amount: string | number | bigint | BigNumber,
  withSymbol: boolean = false,
): string {
  // Convert the amount to a number (if it's a string) and divide by 10^18
  const bn = (amount instanceof BigNumber ? amount : BigNumber(amount.toString())).dividedBy(1e18)
  const formatted = currency(bn.toString(), {
    symbol: withSymbol ? '$' : '',
    separator: ',',
    decimal: '.',
    precision: 2,
  }).format()
  return formatted
}

/**
 * Formats an Ethereum address to a shortened version for display purposes.
 *
 * This function takes an Ethereum address and returns a string with the first
 * 6 characters, followed by an ellipsis, and the last 4 characters of the address.
 *
 * @param {EthereumAddress} addr - The Ethereum address to format.
 * @returns {string} The formatted Ethereum address.
 */
export function formatEthAddr(addr: EthereumAddress): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

export function formatEthHash(hash: string): string {
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`
}

/**
 * Checks if a given Ethereum address is the zero address.
 *
 * This function compares the provided Ethereum address with the predefined
 * zero address constant from ethers.js. The zero address is typically used
 * to represent an uninitialized or invalid address.
 *
 * @param {EthereumAddress} addr - The Ethereum address to check.
 * @returns {boolean} True if the address is the zero address, false otherwise.
 */

export function isZeroAddress(addr: string): boolean {
  if (!isEthAddr(addr)) return false
  return ethers.getAddress(addr) == ethers.ZeroAddress
}
