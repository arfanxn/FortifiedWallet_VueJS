import { Ref, ref } from 'vue'
import { EthereumUnit } from '@/interfaces/ethereum.interfaces'

export function useEthereumUnit() {
  const units: EthereumUnit[] = [
    { text: 'Wei', value: 0 },
    { text: 'Gwei', value: 9 },
    { text: 'Ether', value: 18 },
  ]
  const unitTexts: string[] = units.map((x) => x.text)
  const unitValues: number[] = units.map((x) => x.value)
  const unitDefault: EthereumUnit = units[0]
  const defaultUnitValue: number = unitDefault.value
  const selectedUnitValue: Ref<number> = ref<number>(defaultUnitValue)

  /**
   * Retrieves the unit value corresponding to a given unit text.
   *
   * @param {string} unit - The text representation of the unit (e.g., 'Wei', 'Gwei').
   * @returns {number|null} The numeric value of the unit (e.g., 0 for Wei, 9 for Gwei) or null if not found.
   */
  function getValueByText(unit: string): number | null {
    return units.find((x) => x.text === unit)?.value ?? null
  }

  /**
   * Retrieves the unit text corresponding to a given unit value.
   *
   * @param {number} unit - The numeric value of the unit (e.g., 0 for Wei, 9 for Gwei).
   * @returns {string|null} The text representation of the unit (e.g., 'Wei', 'Gwei') or null if not found.
   */
  function getTextByValue(unit: number): string | null {
    return units.find((x) => x.value === unit)?.text ?? null
  }

  /**
   * Resets the selected unit value to the default unit value.
   */
  function resetSelectedUnitValue(): void {
    selectedUnitValue.value = defaultUnitValue
  }

  return {
    // ============================== State variables ==============================
    units,
    unitTexts,
    unitValues,
    unitDefault,
    defaultUnitValue,
    selectedUnitValue,
    // ================================== Methods ==================================
    getValueByText,
    getTextByValue,
    resetSelectedUnitValue,
  }
}
