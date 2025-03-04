import { EthereumAddress } from './ethereum.interfaces'

export type WalletTuple = [
  string, // name
  string, // address
  string[], // array of signer
  number, // min approvals
  number, // total balance in usd
]

export type Wallet = {
  address: EthereumAddress
  name: string
  signers: EthereumAddress[]
  minimumApprovals: number
  totalBalanceInUsd: number
}

export type WalletOrNull = Wallet | null
