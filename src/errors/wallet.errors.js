export class WalletDoesNotExistError extends Error {
  constructor() {
    super('Wallet does not exist.');
  }
}

