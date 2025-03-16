import { ToastType } from '@/enums/toastEnums'
import { useToastStore } from '@/stores/useToastStore'

export function showToast(type: ToastType, message: string, disappearIn: number = 3000): void {
  useToastStore().addToast(type, message, disappearIn)
}

/**
 * Shows multiple error toast messages from an array of strings.
 * @param {string[]} errorMessages - Array of error messages to show as toasts.
 * @param {number} [disappearIn=3000] - The duration in milliseconds before each toast disappears.
 */
export function showErrorToasts(errorMessages: string[], disappearIn: number = 3000): void {
  errorMessages.forEach((errorMessage) => {
    showToast(ToastType.Error, errorMessage, disappearIn)
  })
}
