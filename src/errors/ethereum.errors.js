export class MetamaskNotInstalledError extends Error {
  constructor() {
    super('Metamask is not installed.');
  }
}

export class TransactionFailedError extends Error {
  constructor() {
    super('Transaction Failed.');
  }
}

export class ContractRevertedError extends Error {
  constructor() {
    super('Contract Reverted.');
  }
}
