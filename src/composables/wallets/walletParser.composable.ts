import { Wallet, WalletTuple } from '@/interfaces/wallet.interfaces'

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

  return {
    tupleToWallet,
  }
}
