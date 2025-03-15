export type TransactionTuple = [
  string, // Transaction hash
  string, // Token address
  string, // Recipient address
  bigint, // Transaction value in string format
  bigint, // Transaction valueInUsd in string format
  number, // Approval count in string format
  string[], // Array of approver addresses
  bigint, // Timestamp of creation
  bigint, // Timestamp of execution
  bigint, // Timestamp of cancellation
]

export interface Transaction {
  // Transaction hash
  hash: string
  // Token address
  token: string
  // Recipient address
  to: string
  // Transaction value
  value: bigint
  // Transaction value in usd
  valueInUsd: bigint
  // Approval count in string format
  approvalCount: number
  // Array of approver addresses
  approvers: string[]
  // Timestamp of creation
  createdAt: bigint
  // Timestamp of execution
  executedAt: bigint
  // Timestamp of cancellation
  cancelledAt: bigint
}
