import { useEthereumStore } from '@/stores/useEthereumStore'
import * as walletService from '@/services/walletServices'
import { ref } from 'vue'
import { ethers } from 'ethers'

export function useWalletBalanceFetch() {
  const walletBalance = ref<bigint>()
  const walletBalanceInUsd = ref<bigint>()

  const fetchWalletBalance = async (walletAddr: string, tokenAddr?: string) => {
    const runner = await useEthereumStore().provider!.getSigner()

    const ETH = ethers.ZeroAddress
    tokenAddr = tokenAddr ?? ETH
    const [balance, balanceInUsd] = await walletService.getBalance(
      { tokenAddr },
      walletAddr,
      runner,
    )
    walletBalance.value = balance
    walletBalanceInUsd.value = balanceInUsd
    return { balance, balanceInUsd }
  }

  return { walletBalance, walletBalanceInUsd, fetchWalletBalance }
}
