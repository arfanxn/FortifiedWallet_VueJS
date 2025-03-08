import { ethers } from 'ethers'

export class ResolvedEthersError extends Error {
  constructor(
    message: string,
    public readonly origin: ethers.EthersError,
  ) {
    super(message)

    Object.setPrototypeOf(this, ResolvedEthersError.prototype) // Fix prototype chain for ES5/TypeScript
  }

  get code(): string {
    return this.origin.code
  }

  get name(): string {
    return this.origin.name
  }

  get stack(): string | undefined {
    return this.origin.stack
  }
}
