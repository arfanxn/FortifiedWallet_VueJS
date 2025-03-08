import { EthersErrorCode } from '@/enums/ethers.enums'
import { ResolvedEthersError } from '@/errors/ethers.error'
import { pascalToSentenceCase } from '@/utils/string.utils'
import { ethers } from 'ethers'

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
 * Resolves and throws a specific `ResolvedEthersError` based on the provided
 * `ethers.EthersError`. This function analyzes the error type and throws a
 * more descriptive error message. It supports various ethers error scenarios,
 * such as action rejection, network issues, contract-related errors, insufficient
 * funds, and invalid arguments.
 *
 * @param {ethers.EthersError} error - The ethers error object to resolve.
 * @param {ethers.Contract} [contract] - Optional contract instance for parsing
 * contract errors.
 * @throws {ResolvedEthersError} Throws a resolved error with a specific message
 * based on the type of ethers error encountered.
 */
export function resolveAndThrowEthersError(
  error: ethers.EthersError,
  contract?: ethers.Contract,
): ResolvedEthersError {
  switch (true) {
    case isActionRejectedError(error):
      throw new ResolvedEthersError('Action rejected by user.', error)

    case isNetworkError(error):
      throw new ResolvedEthersError('Network error.', error)

    case isContractError(error):
      if (contract === undefined)
        throw new ResolvedEthersError('Unknown contract error occurred.', error)
      else {
        const errorDescription = contract.interface.parseError(error.data)
        const message = pascalToSentenceCase(errorDescription!.name).concat('.')
        throw new ResolvedEthersError(message, error)
      }

    case isInsufficientFundsError(error):
      throw new ResolvedEthersError('Unpredictable gas limit.', error)

    case isInvalidArgumentError(error):
      throw new ResolvedEthersError('Invalid input format.', error)

    case error instanceof Error:
      throw new ResolvedEthersError(error.message, error)

    default:
      throw new ResolvedEthersError('Unknown error occurred.', error)
  }
}

export function isActionRejectedError(error: any): boolean {
  return error?.code === EthersErrorCode.ActionRejected
}

export function isNetworkError(error: any): boolean {
  return error?.code === EthersErrorCode.NetworkError || error.message?.includes('network')
}

export function isInsufficientFundsError(error: any): boolean {
  return error?.code === EthersErrorCode.InsufficientFunds
}

export function isInvalidArgumentError(error: any): boolean {
  return error?.code === EthersErrorCode.InvalidArgument
}

export function isContractError(error: any): error is { data: string } {
  return error?.code === EthersErrorCode.CallException && typeof error.data === 'string'
}

export async function withResolvedEthersErrorHandling<T>(
  closure: () => Promise<T>,
  contract?: ethers.Contract,
): Promise<T> {
  try {
    return await closure()
  } catch (error) {
    if (isEthersError(error)) resolveAndThrowEthersError(error, contract)
    throw error
  }
}
