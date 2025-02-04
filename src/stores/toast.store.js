// stores/ethers.ts
import { defineStore } from 'pinia';

export const useToastStore = defineStore('toast', {
  /**
   * The state of the toast store.
   *
   * @property {Array<{id: string, type: 'info'|'success'|'warning'|'error', message: string, disappearIn: number}>} toasts - An array of toast objects to be displayed.
   * @property {string} id - A randomly generated id for the toast.
   * @property {'info'|'success'|'warning'|'error'} type - The type of the toast.
   * @property {string} message - The message to be displayed in the toast.
   * @property {number} disappearIn - The time in milliseconds before the toast disappears.
   */
  state: () => ({
    toasts: [
    ],
  }),
  getters: {
    //
  },
  actions: {

    /**
     * Adds a new toast notification to the store with a specified type, message, and duration.
     *
     * @param {string} type - The type of the toast, which can be 'info', 'success', 'warning', or 'error'.
     * @param {string} message - The message to display within the toast notification.
     * @param {number} [disappearIn=3000] - The duration in milliseconds before the toast automatically disappears.
     *                                      This value is adjusted based on the duration of the previous toast if one exists.
     */

    addToast(type, message, disappearIn = 3000) {
      const id = crypto.randomUUID()

      const toastsLength = this.toasts.length;
      if (toastsLength > 0)
        disappearIn += this.toasts[toastsLength - 1].disappearIn

      this.toasts.push({
        id,
        type,
        message,
        disappearIn
      })

      setTimeout(() => {
        this.removeToast(id)
      }, disappearIn)
    },

    /**
     * Removes a toast notification with the specified id from the store.
     *
     * @param {string} id - The id of the toast to remove.
     */
    removeToast(id) {
      const index = this.toasts.findIndex(toast => toast.id === id);
      if (index !== -1) {
        this.toasts.splice(index, 1);
      }
    },
  },
})

