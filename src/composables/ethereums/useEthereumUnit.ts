import { computed, Ref, ref, WritableComputedRef } from 'vue'
import { EthereumUnit } from '@/interfaces/ethereumInterfaces'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'

export function useEthereumUnit() {
  const units: EthereumUnit[] = [
    { text: 'Wei', value: 0 },
    { text: 'Gwei', value: 9 },
    { text: 'Ether', value: 18 },
  ]
  const unitTexts: string[] = units.map((x) => x.text)
  const unitValues: number[] = units.map((x) => x.value)
  const defaultUnit: EthereumUnit = units[0]
  const selectedUnit: Ref<EthereumUnit> = ref<EthereumUnit>(defaultUnit)
  const selectedUnitValue: WritableComputedRef<number> = computed({
    get: () => selectedUnit.value.value,
    set: (value: number) => {
      const unit = units.find((x) => x.value === value)
      selectedUnit.value = unit ? unit : defaultUnit
    },
  })

  const etherAmountLabel = computed(() => `Amount (in ${selectedUnit.value.text.toLowerCase()})`)

  function parseBySelectedUnit(value: string | number): BigNumber {
    return BigNumber(
      ethers
        .parseUnits(typeof value === 'number' ? value.toString() : value, selectedUnit.value.value)
        .toString(),
    )
  }

  /**
   * Resets the selected unit value to the default unit value.
   */
  function resetSelectedUnit(): void {
    selectedUnit.value = defaultUnit
  }

  return {
    // ============================== State variables ==============================
    units,
    unitTexts,
    unitValues,
    defaultUnit,
    selectedUnit,
    selectedUnitValue,
    etherAmountLabel,
    // ================================== Methods ==================================
    parseBySelectedUnit,
    resetSelectedUnit,
  }
}
