export class Multicall3InvalidTargetAddress extends Error {
  constructor() {
    super('Invalid target address.')
  }
}

export class Multicall3InvalidCallData extends Error {
  constructor() {
    super('Invalid callData.')
  }
}
