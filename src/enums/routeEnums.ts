export enum RouteName {
  // Dashboard
  Dashboard = 'dashboard',

  // Authenciation relateds
  Connect = 'connect',

  // Wallet relateds
  WalletConnect = Connect,
  WalletCreate = 'wallet.create',
  WalletShow = 'wallet.show',
  WalletDeposit = 'wallet.deposit',
  WalletTransfer = 'wallet.transfer',
  WalletLock = 'wallet.lock',

  // Tokens relateds
  Token = 'token',
  TokenIndex = 'token.index',

  // Transaction relateds
  Transaction = 'transaction',
  TransactionIndex = 'transaction.index',
  TransactionShow = 'transaction.show',

  // User relateds
  NotificationIndex = 'notification.index',
}
