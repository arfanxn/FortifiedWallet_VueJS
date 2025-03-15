import { EthereumAssetType } from '@/enums/ethereumEnums'

export enum WalletDepositType {
  Token = EthereumAssetType.Token,
  Ether = EthereumAssetType.Ether,
}

export enum WalletTransactionType {
  Token = EthereumAssetType.Token,
  Ether = EthereumAssetType.Ether,
}

export enum WalletRouteName {
  Deposit = 'wallet.deposit',
  Transfer = 'wallet.transfer',
  Lock = 'wallet.lock',
  Create = 'wallet.create',
}
