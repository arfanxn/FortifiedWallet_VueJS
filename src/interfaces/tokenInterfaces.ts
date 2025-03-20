export interface TokenMetadata {
  address: string
  name: string
  symbol: string
  decimals: bigint
}

export type TokenTuple = [string, string, string, number, bigint, bigint, bigint]

export interface Token {
  address: string
  name: string
  symbol: string
  decimals: number
  balance: bigint
  balanceInUsd: bigint
  priceInUsd: bigint
}
