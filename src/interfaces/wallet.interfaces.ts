import BigNumber from 'bignumber.js'
import { EthereumAddress } from './ethereum.interfaces'

export type WalletTuple = [
  string, // Wallet name
  string, // Wallet Ethereum address
  string[], // Array of Ethereum addresses of signers
  number, // Minimum number of approvals required for a transaction
  number, // Total balance of the wallet in USD
]

export type Wallet = {
  // Ethereum address of the wallet
  address: string
  // Name of the wallet
  name: string
  // Array of Ethereum addresses of signers
  signers: string[]
  // Minimum number of approvals required for a transaction
  minimumApprovals: number
  // Total balance of the wallet in USD
  totalBalanceInUsd: number
}

export type WalletOrNull = Wallet | null

export type WalletTransactionTuple = [
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

export type WalletTransaction = {
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
