export type WalletTuple = [
  string, // Wallet name
  string, // Wallet Ethereum address
  string[], // Array of Ethereum addresses of signers
  number, // Minimum number of approvals required for a transaction
  bigint, // Total balance of the wallet in USD
]

export interface Wallet {
  // Ethereum address of the wallet
  address: string
  // Name of the wallet
  name: string
  // Array of Ethereum addresses of signers
  signers: string[]
  // Minimum number of approvals required for a transaction
  minimumApprovals: number
  // Total balance of the wallet in USD
  totalBalanceInUsd: bigint
}

export type WalletOrNull = Wallet | null
