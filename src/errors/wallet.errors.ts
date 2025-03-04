export class WalletDoesNotExistError extends Error {
  constructor() {
    super('Wallet does not exist.')
  }
}

export class WalletExceededMaximumError extends Error {
  constructor() {
    super('Wallet has exceeded the maximum.')
  }
}
