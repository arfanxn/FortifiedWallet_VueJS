export enum EthersErrorCode {
  // Generic Errors
  UnknownError = 'UNKNOWN_ERROR',
  NotImplemented = 'NOT_IMPLEMENTED',
  UnsupportedOperation = 'UNSUPPORTED_OPERATION',
  NetworkError = 'NETWORK_ERROR',
  ServerError = 'SERVER_ERROR',
  Timeout = 'TIMEOUT',
  BadData = 'BAD_DATA',
  Cancelled = 'CANCELLED',

  // Operational Errors
  BufferOverrun = 'BUFFER_OVERRUN',
  NumericFault = 'NUMERIC_FAULT',

  // Argument Errors
  InvalidArgument = 'INVALID_ARGUMENT',
  MissingArgument = 'MISSING_ARGUMENT',
  UnexpectedArgument = 'UNEXPECTED_ARGUMENT',
  ValueMismatch = 'VALUE_MISMATCH',

  // Blockchain Errors
  CallException = 'CALL_EXCEPTION',
  InsufficientFunds = 'INSUFFICIENT_FUNDS',
  NonceExpired = 'NONCE_EXPIRED',
  ReplacementUnderpriced = 'REPLACEMENT_UNDERPRICED',
  TransactionReplaced = 'TRANSACTION_REPLACED',
  UnconfiguredName = 'UNCONFIGURED_NAME',
  OffchainFault = 'OFFCHAIN_FAULT',

  // User Interaction
  ActionRejected = 'ACTION_REJECTED',
}
