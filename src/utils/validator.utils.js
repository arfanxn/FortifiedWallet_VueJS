import { showToast } from "@/utils/toast.utils"
import { ethers } from "ethers"


/**
 * Validates the given Vuelidate validation object and shows a toast for each
 * error found.
 *
 * @param {Object} v$ - The Vuelidate validation object to validate.
 * @returns {Promise<boolean>} True if the validation was successful, false otherwise.
 */
export async function validateAndToast(v$) {
  const isValid = await v$.value.$validate()

  v$.value.$errors.forEach(({ $message }) => {
    showToast('error', $message)
  })

  return isValid
}


/**
 * Validates whether a given string is a valid Ethereum address.
 *
 * This function first checks the address format to ensure it matches the
 * standard Ethereum address pattern. Then, it performs a checksum
 * validation using ethers.js library to confirm its authenticity.
 *
 * @param {string} address - The Ethereum address to validate.
 * @returns {boolean} - True if the address is valid, false otherwise.
 */
export function validateAddress(address) {
  // Quick format check first
  if (/^0x[a-fA-F0-9]{40}$/.test(address) == false) return false;

  // Full checksum validation
  return ethers.utils.isAddress(address);
};
