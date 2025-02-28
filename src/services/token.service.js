// services/token.service.js
import { TransactionFailedError } from "@/errors/ethereum.errors";
import { didTransactionFail } from "@/helpers/ethereum.helpers";
import { tryRethrow } from "@/utils/error.utils";
import { ethers } from "ethers";

const tokenAbis = [
  // name
  'function name() view returns (string)',

  // symbol
  'function symbol() view returns (string)',

  // decimals
  'function decimals() view returns (uint8)',

  // approve
  'function approve(address spender, uint256 value) returns (bool)',
]

export const name = async (provider, tokenAddr) => {
  const contract = new ethers.Contract(tokenAddr, tokenAbis, provider);
  return await contract.name()
}

export const symbol = async (provider, tokenAddr) => {
  const contract = new ethers.Contract(tokenAddr, tokenAbis, provider);
  return await contract.symbol()
}

export const decimals = async (provider, tokenAddr) => {
  const contract = new ethers.Contract(tokenAddr, tokenAbis, provider);
  return await contract.decimals()
}

/**
 * Approves a certain amount of a token to be spent by a certain spender.
 *
 * @param {Object} providerSigner - An ethers.js providerSigner object for interacting with Ethereum.
 * @param {string} tokenAddr - The Ethereum address of the token to be approved.
 * @param {{ spender: string, value: number|string|BN }} opts - An object containing the following properties:
 *   - {string} spender - The Ethereum address of the account that is allowed to spend the token.
 *   - {number|string|BN} value - The amount of the token to be approved.
 * @returns {Promise<void>} A promise that resolves when the approval transaction has been successfully mined.
 * @throws {Error|TransactionFailedError} If fails.
 */
export const approve = async (providerSigner, tokenAddr, { spender, value }) => {
  await tryRethrow(async () => {
    const contract = new ethers.Contract(tokenAddr, tokenAbis, providerSigner);
    const tx = await contract.approve(spender, value)
    const receipt = await tx.wait()
    if (didTransactionFail(receipt)) throw new TransactionFailedError();
  })
}
