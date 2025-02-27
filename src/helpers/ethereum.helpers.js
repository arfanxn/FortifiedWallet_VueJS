/**
 * Checks if the given transaction receipt is a failed transaction.
 *
 * The transaction receipt is considered to be a failed transaction if the
 * status is not equal to 1.
 *
 * @param {Object} receipt - The transaction receipt to check.
 * @returns {boolean} True if the transaction receipt is a failed transaction, false otherwise.
 */
export function didTransactionFail(receipt) {
  return receipt.status !== 1
}
