import { Wallet, WalletTuple } from '@/interfaces/walletInterfaces'
import { Transaction, TransactionTuple } from '@/interfaces/transactionInterfaces'
import { Token, TokenTuple } from '@/interfaces/tokenInterfaces'

export function useWalletParser() {
  const tupleToWallet = (tuple: WalletTuple): Wallet => {
    return {
      name: tuple[0],
      address: tuple[1],
      signers: tuple[2],
      minimumApprovals: tuple[3],
      totalBalanceInUsd: tuple[4], // Assuming USD is 18 decimals
      totalLockedBalanceInUsd: tuple[5], // Assuming USD is 18 decimals
      totalUnlockedBalanceInUsd: tuple[6], // Assuming USD is 18 decimals
    }
  }

  const tupleToTransaction = (tuple: TransactionTuple): Transaction => {
    return {
      hash: tuple[0],
      token: tuple[1],
      to: tuple[2],
      value: tuple[3],
      valueInUsd: tuple[4],
      approvalCount: tuple[5],
      approvers: tuple[6],
      createdAt: tuple[7],
      executedAt: tuple[8],
      cancelledAt: tuple[9],
    }
  }

  const tupleToToken = (tuple: TokenTuple): Token => {
    return {
      address: tuple[0],
      name: tuple[1],
      symbol: tuple[2],
      decimals: tuple[3],
      balance: tuple[4],
      balanceInUsd: tuple[5],
      priceInUsd: tuple[6],
    }
  }

  return {
    tupleToWallet,
    tupleToTransaction,
    tupleToToken,
  }
}
