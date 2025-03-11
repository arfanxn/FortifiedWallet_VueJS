import BigNumber from 'bignumber.js'

export type TransactionTuple = [
  string, // Transaction hash
  string, // Token address
  string, // Recipient address
  string, // Transaction value in string format
  string, // Approval count in string format
  string[], // Array of approver addresses
  number, // Timestamp of creation
  number, // Timestamp of execution
  number, // Timestamp of cancellation
]

export type Transaction = {
  // Transaction hash
  hash: string
  // Token address
  token: string
  // Recipient address
  to: string
  // Transaction value in string format
  value: BigNumber
  // Approval count in string format
  approvalCount: number
  // Array of approver addresses
  approvers: string[]
  // Timestamp of creation
  createdAt: number
  // Timestamp of execution
  executedAt: number
  // Timestamp of cancellation
  cancelledAt: number
}
