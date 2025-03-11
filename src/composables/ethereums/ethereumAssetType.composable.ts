import { computed, ref, unref, type Ref } from 'vue'

export const useEthereumAssetType = () => {
  const selectedAssetType: Ref<'token' | 'ether'> = ref('token')

  const isToken = computed(() => {
    return unref(selectedAssetType) === 'token'
  })

  const isEther = computed(() => {
    return unref(selectedAssetType) === 'ether'
  })

  const resolveAssetType = (assetCurrency: string | undefined): 'token' | 'ether' => {
    if (assetCurrency && assetCurrency.toLowerCase() === 'token') return 'token'
    else return 'ether'
  }

  return {
    selectedAssetType,
    isToken,
    isEther,
    resolveAssetType,
  }
}
