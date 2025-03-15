import { EthersErrorCode } from '@/enums/ethersEnums'
import { ResolvedEthersError } from '@/errors/ResolvedEthersError'
import { pascalToSentenceCase } from '@/utils/stringUtils'
import { ethers } from 'ethers'

// ==========================================================================
//                            Internal functions
// ==========================================================================

function isActionRejectedError(error: any): boolean {
  return error?.code === EthersErrorCode.ActionRejected
}

function isNetworkError(error: any): boolean {
  return error?.code === EthersErrorCode.NetworkError || error.message?.includes('network')
}

function isInsufficientFundsError(error: any): boolean {
  return error?.code === EthersErrorCode.InsufficientFunds
}

function isInvalidArgumentError(error: any): boolean {
  return error?.code === EthersErrorCode.InvalidArgument
}

function isContractError(error: any): error is { data: string } {
  return error?.code === EthersErrorCode.CallException && typeof error.data === 'string'
}

// ==========================================================================
//                            External functions
// ==========================================================================

/**
 * Determines if a given error object conforms to the ethers.EthersError interface.
 *
 * This function checks if the provided error is a non-null object and verifies
 * the presence and correct type of properties expected in an ethers.EthersError.
 * The required properties include 'code', 'shortMessage', 'message', and 'name',
 * all of which must be strings. Additionally, it optionally checks the 'info'
 * property, ensuring that if present, it is a non-null object, and the 'error'
 * property, ensuring that if present, it is an instance of Error.
 *
 * @param {any} error - The error object to be checked.
 * @returns {boolean} True if the error matches the ethers.EthersError interface, false otherwise.
 */

export function isEthersError(error: any): error is ethers.EthersError {
  return (
    // First verify it's a non-null object
    typeof error === 'object' &&
    error !== null &&
    // Check for required properties from EthersError interface
    'code' in error && // Error code identifier
    'shortMessage' in error && // Brief error description
    'message' in error && // Full error message
    'name' in error && // Error type name
    // Validate property types match interface
    typeof error.code === 'string' && // ErrorCode is string-based
    typeof error.shortMessage === 'string' && // Short message is always string
    typeof error.message === 'string' && // Standard Error property
    typeof error.name === 'string' && // Standard Error property
    // Validate optional 'info' property when present:
    // - Must be an object if it exists
    // - null check prevents typeof null === 'object' false positive
    (!('info' in error) || (typeof error.info === 'object' && error.info !== null)) &&
    // Validate optional 'error' property when present:
    // - Must be a proper Error instance
    (!('error' in error) || error.error instanceof Error)
  )
}

/**
 * Resolves an EthersError by parsing the error data and converting it to a
 * ResolvedEthersError instance. The given contract is used to parse the error
 * data using its interface.
 *
 * If the error is not a valid EthersError, the function returns undefined.
 *
 * @param {unknown} error - The error object to be resolved.
 * @param {ethers.Contract} contract - The contract instance to use for parsing the error data.
 * @returns {ResolvedEthersError | undefined} A ResolvedEthersError containing the parsed error
 *                                            message, or undefined if the error is not a valid
 *                                            EthersError.
 */
export function resolveEthersError(
  error: unknown,
  contract: ethers.Contract,
): ResolvedEthersError | undefined {
  if (isEthersError(error) === false) return undefined

  switch (true) {
    case isActionRejectedError(error):
      return new ResolvedEthersError('Action rejected by user.', error)

    case isNetworkError(error):
      return new ResolvedEthersError('Network error.', error)

    case isContractError(error):
      // Attempt to parse the contract error data using the contract's interface
      const errorDescription = contract.interface.parseError(error.data)
      let message: string

      // Handle the case where the error data is a standard "revert" opcode
      if (error.data.startsWith('0x08c379a0')) {
        // Extract the error message from the parsed error description
        message = errorDescription!.args[0] as string
      } else {
        // Handle the case where the error data is a custom contract error
        // Convert the PascalCase error name to sentence case
        message = pascalToSentenceCase(errorDescription!.name).concat('.')
      }

      // Throw a resolved error with the parsed message
      return new ResolvedEthersError(message, error)

    case isInsufficientFundsError(error):
      return new ResolvedEthersError('Unpredictable gas limit.', error)

    case isInvalidArgumentError(error):
      return new ResolvedEthersError('Invalid input format.', error)

    default:
      return new ResolvedEthersError('Unknown error occurred.', error)
  }
}

/**
 * Checks if a given transaction receipt object indicates that the transaction
 * has failed.
 *
 * @param {ethers.TransactionReceipt | null} receipt - The transaction receipt
 * object to be checked.
 * @returns {boolean} True if the transaction failed, false if the
 * transaction succeeded or if the receipt is null.
 */
export function didTransactionFail(receipt: ethers.TransactionReceipt | null): boolean {
  if (receipt === null) return false
  return receipt.status !== 1
}

/**
 * Checks if a given transaction receipt object indicates that the transaction
 * has succeeded.
 *
 * This function is a type guard that will narrow the type of the receipt
 * parameter from `ethers.TransactionReceipt | null` to `ethers.TransactionReceipt`
 * if the transaction succeeded. If the transaction failed, the return value
 * will be `false`.
 *
 * @param {ethers.TransactionReceipt | null} receipt - The transaction receipt
 * object to be checked.
 * @returns {receipt is ethers.TransactionReceipt} True if the transaction
 * succeeded, false if the transaction failed or if the receipt is null.
 */
export function didTransactionSucceed(
  receipt: ethers.TransactionReceipt | null,
): receipt is ethers.TransactionReceipt {
  return !didTransactionFail(receipt)
}

/**
 * Generates a Keccak256 hash from a given string and optional salt using Solidity's
 * packed encoding.
 *
 * @param {string} str - The input string to be hashed.
 * @param {string} salt - An optional salt to be used in the hash computation.
 * If provided, the hash will be generated from the concatenation of the string and
 * the salt.
 * @returns {string} The resulting Keccak256 hash as a hex string.
 */
export function toSolidityPackedKeccak256Hash(str: string, salt?: string): string {
  const hash = salt
    ? ethers.solidityPackedKeccak256(['string', 'string'], [str, salt])
    : ethers.solidityPackedKeccak256(['string'], [str])
  return hash
}
