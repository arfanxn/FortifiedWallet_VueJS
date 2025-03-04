// stores/ethers.ts
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { ToastType } from '@/enums/toast.enums'

interface Toast {
  id: string
  type: ToastType
  message: string
  disappearIn: number
}

export const useToastStore = defineStore('toast', () => {
  // ==========================================================================
  //                                State
  // ==========================================================================
  /**
   * The state of the toast store.
   *
   * @property {Array<{id: string, type: 'info'|'success'|'warning'|'error', message: string, disappearIn: number}>} toasts - An array of toast objects to be displayed.
   * @property {string} id - A randomly generated id for the toast.
   * @property {'info'|'success'|'warning'|'error'} type - The type of the toast.
   * @property {string} message - The message to be displayed in the toast.
   * @property {number} disappearIn - The time in milliseconds before the toast disappears.
   */
  const toasts = ref<Toast[]>([])

  // ==========================================================================
  //                                Actions
  // ==========================================================================
  /**
   * Adds a new toast notification to the store with a specified type, message, and duration.
   *
   * @param {string} type - The type of the toast, which can be 'info', 'success', 'warning', or 'error'.
   * @param {string} message - The message to display within the toast notification.
   * @param {number} [disappearIn=3000] - The duration in milliseconds before the toast automatically disappears.
   *                                      This value is adjusted based on the duration of the previous toast if one exists.
   */
  const addToast = (type: ToastType, message: string, disappearIn: Miliseconds = 3000) => {
    const id = crypto.randomUUID()

    const toastsLength = toasts.value.length
    if (toastsLength > 0) disappearIn += toasts.value[toastsLength - 1].disappearIn

    toasts.value.push({
      id,
      type,
      message,
      disappearIn,
    })

    setTimeout(() => {
      removeToast(id)
    }, disappearIn)
  }
  /**
   * Removes a toast notification with the specified id from the store.
   *
   * @param {string} id - The id of the toast to remove.
   */
  const removeToast = (id: string) => {
    const index = toasts.value.findIndex((toast) => toast.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  // ==========================================================================
  //                                  Initializations
  // ==========================================================================

  // ==========================================================================
  //                                Returns the store
  // ==========================================================================
  return {
    toasts,
    addToast,
    removeToast,
  }
})
