// services/token.service.js
import { ethers } from "ethers";

const tokenAbis = [
  // name
  'function name() view returns (string)',

  // symbol
  'function symbol() view returns (string)',

  // decimals
  'function decimals() view returns (uint8)',

  // approve
  'function approve(address spender, uint256 value) returns (bool)',
]

export const name = async (provider, tokenAddr) => {
  const contract = new ethers.Contract(tokenAddr, tokenAbis, provider);
  return await contract.name()
}

export const symbol = async (provider, tokenAddr) => {
  const contract = new ethers.Contract(tokenAddr, tokenAbis, provider);
  return await contract.symbol()
}

export const decimals = async (provider, tokenAddr) => {
  const contract = new ethers.Contract(tokenAddr, tokenAbis, provider);
  return await contract.decimals()
}

export const approve = async (providerSigner, tokenAddr, { spender, value }) => {
  // TODO: update this function to follows blockchain function best practice
  const contract = new ethers.Contract(tokenAddr, tokenAbis, providerSigner);

  const tx = await contract.approve(spender, value)
  const receipt = await tx.wait()
  console.log(receipt.logs)
  return true
}
