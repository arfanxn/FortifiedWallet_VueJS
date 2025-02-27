import { ref } from 'vue'

export function useEthereumUnit() {
  const units = [
    { text: 'Wei', value: 0 },
    { text: 'Gwei', value: 9 },
    { text: 'Ether', value: 18 },
  ]
  const unitTexts = units.map(x => x.text)
  const unitValues = units.map(x => x.value)
  const unitDefault = units[0]
  const defaultUnitValue = unitDefault.value
  const selectedUnitValue = ref(defaultUnitValue)

  /**
   * Retrieves the unit value corresponding to a given unit text.
   *
   * @param {string} unitText - The text representation of the unit (e.g., 'Wei', 'Gwei').
   * @returns {number|null} The numeric value of the unit (e.g., 0 for Wei, 9 for Gwei) or null if not found.
   */
  function getValueByText(unitText) {
    return units.find(x => x.text === unitText)?.value ?? null
  }

  /**
   * Retrieves the unit text corresponding to a given unit value.
   *
   * @param {number} unitValue - The numeric value of the unit (e.g., 0 for Wei, 9 for Gwei).
   * @returns {string|null} The text representation of the unit (e.g., 'Wei', 'Gwei') or null if not found.
   */
  function getTextByValue(unitValue) {
    return units.find(x => x.value === unitValue)?.text ?? null
  }

  /**
   * Resets the selected unit value to the default unit value.
   */
  function resetSelectedUnitValue() {
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
    resetSelectedUnitValue
  }
}
