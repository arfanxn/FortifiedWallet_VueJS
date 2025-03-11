import type { Ref } from 'vue'
import type { ErrorObject, Validation } from '@vuelidate/core'
import { showToast } from '@/helpers/toast.helpers'
import { ToastType } from '@/enums/toast.enums'

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
