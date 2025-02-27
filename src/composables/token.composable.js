import { useBlockchainStore } from "@/stores/blockchain.store";
import * as tokenService from "@/services/token.service.js";

export function useToken() {
  const blockchainStore = useBlockchainStore()

  const fetchTokenMetadata = async (tokenAddr) => {
    const provider = blockchainStore.provider
    const name = await tokenService.name(provider, tokenAddr)
    const symbol = await tokenService.symbol(provider, tokenAddr)
    const decimals = await tokenService.decimals(provider, tokenAddr)
    return { name, symbol, decimals }
  }

  return {
    // ============================== State variables ==============================
    //
    // ================================== Methods ==================================
    fetchTokenMetadata,
  }
}
