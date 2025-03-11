import { Wallet, WalletTuple, Transaction, TransactionTuple } from '@/interfaces/wallet.interfaces'
import BigNumber from 'bignumber.js'

export function useWalletParser() {
  const tupleToWallet = (tuple: WalletTuple): Wallet => {
    return {
      name: tuple[0],
      address: tuple[1],
      signers: tuple[2],
      minimumApprovals: tuple[3],
      totalBalanceInUsd: tuple[4], // Assuming USD is 18 decimals
    }
  }

  const tupleToTransaction = (tuple: TransactionTuple): Transaction => {
    return {
      hash: tuple[0],
      token: tuple[1],
      to: tuple[2],
      value: BigNumber(tuple[3]),
      approvalCount: parseInt(tuple[4]),
      approvers: tuple[5],
      createdAt: tuple[6],
      executedAt: tuple[7],
      cancelledAt: tuple[8],
    }
  }

  return {
    tupleToWallet,
    tupleToTransaction,
  }
}
