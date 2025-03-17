export type EthereumAddress = string

export interface EthereumUnit {
  label: string
  value: bigint
}

export type EthereumAssetType = 'token' | 'ether'
