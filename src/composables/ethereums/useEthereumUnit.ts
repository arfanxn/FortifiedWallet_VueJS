import { computed, Ref, ref, WritableComputedRef } from 'vue'
import { ethers } from 'ethers'
import { EthereumUnit } from '@/interfaces/ethereumInterfaces'

export function useEthereumUnit() {
  const units: EthereumUnit[] = [
    { label: 'Wei', value: 0n },
    { label: 'Gwei', value: 9n },
    { label: 'Ether', value: 18n },
  ]
  const unitLabels: string[] = units.map((x) => x.label)
  const unitValues: bigint[] = units.map((x) => x.value)
  const defaultUnit: EthereumUnit = units[units.length - 1]
  const selectedUnit: Ref<EthereumUnit> = ref<EthereumUnit>(defaultUnit)
  const selectedUnitValue: WritableComputedRef<bigint> = computed({
    get: () => selectedUnit.value.value,
    set: (value: bigint) => {
      const unit = units.find((x) => x.value === value)
      selectedUnit.value = unit ? unit : defaultUnit
    },
  })

  function parseBySelectedUnit(value: string | bigint): bigint {
    return ethers.parseUnits(
      typeof value === 'bigint' ? value.toString() : value,
      selectedUnit.value.value,
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
    unitLabels,
    unitValues,
    defaultUnit,
    selectedUnit,
    selectedUnitValue,
    // ================================== Methods ==================================
    parseBySelectedUnit,
    resetSelectedUnit,
  }
}
