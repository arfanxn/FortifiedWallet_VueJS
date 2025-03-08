import { showToast } from '@/helpers/toast.helpers'
import { ethers } from 'ethers'
import type { Ref } from 'vue'
import type { ErrorObject, Validation } from '@vuelidate/core'
import { ToastType } from '@/enums/toast.enums'
import { StringOrNullOrUndefined } from '@/interfaces/interfaces'

/**
 * Validates the given Vuelidate validation object and shows a toast for each
 * error found.
 *
 * @param {Ref<Validation>} v$ - The Vuelidate validation ref object to validate
 * @returns {Promise<boolean>} True if validation was successful, false otherwise
 */
export async function validateAndToast(v$: Ref<Validation>): Promise<boolean> {
  const isValid = await v$.value.$validate()

  v$.value.$errors.forEach((value: ErrorObject) => {
    showToast(ToastType.Error, value.$message.toString())
  })

  return isValid
}

/**
 * Checks if a given string is a valid Ethereum address.
 *
 * First verifies the address format matches the standard Ethereum pattern,
 * then performs a checksum validation using ethers.js.
 *
 * @param {StringOrNullOrUndefined} address - The Ethereum address to validate
 * @returns {boolean} True if the address is valid, false otherwise
 */
export function isValidAddr(address: StringOrNullOrUndefined): boolean {
  if (address === null || address === undefined) return false
  // Quick format check first
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) return false

  // Full checksum validation
  return ethers.isAddress(address)
}
