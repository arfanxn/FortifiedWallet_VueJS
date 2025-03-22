import { TransactionFailedError } from '@/errors/ethereumErrors'
import { didTransactionFail, resolveEthersError } from '@/helpers/ethersHelpers'
import { ethers } from 'ethers'
import { EthereumAddress } from '@/interfaces/ethereumInterfaces'
import ERC20 from '@/abis/ERC20'

export const name = async (
  token: EthereumAddress,
  runner: ethers.BrowserProvider,
): Promise<string> => {
  const contract = new ethers.Contract(token, ERC20, runner)
  return await contract.name()
}

export const symbol = async (
  token: EthereumAddress,
  runner: ethers.BrowserProvider,
): Promise<string> => {
  const contract = new ethers.Contract(token, ERC20, runner)
  return await contract.symbol()
}

export const decimals = async (
  token: EthereumAddress,
  runner: ethers.BrowserProvider,
): Promise<bigint> => {
  const contract = new ethers.Contract(token, ERC20, runner)
  return await contract.decimals()
}

export const approve = async (
  params: { token: string; spender: string; value: bigint },
  runner: ethers.Signer,
): Promise<void> => {
  const contract = new ethers.Contract(params.token, ERC20, runner)

  try {
    const tx: ethers.TransactionResponse = await contract.approve(params.spender, params.value)
    const receipt: ethers.TransactionReceipt | null = await tx.wait()
    if (didTransactionFail(receipt)) throw new TransactionFailedError()
  } catch (error) {
    throw resolveEthersError(error, contract) ?? error
  }
}
