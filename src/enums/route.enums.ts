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
  TokenIndex = 'token.index',

  // Transaction relateds
  TransactionIndex = 'transaction.index',

  // User relateds
  NotificationIndex = 'notification.index',
}
