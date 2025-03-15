import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { Transaction } from '@/interfaces/transaction.interfaces'

export const useTransactionStore = defineStore('transaction', () => {
  // ==========================================================================
  //                            Internal functions
  // ==========================================================================
  //

  // ==========================================================================
  //                                State
  // ==========================================================================
  const transactions = ref<Transaction[]>([])
  const selectedTransactionHash = ref<string | undefined>()
  const selectedTransaction = computed<Transaction | undefined>({
    get: () =>
      selectedTransactionHash.value
        ? transactions.value.find(
            (transaction) => selectedTransactionHash.value === transaction.hash,
          )
        : undefined,
    set: (value: Transaction | undefined) => {
      if (value === undefined) {
        selectedTransactionHash.value = undefined
        return
      }

      selectedTransactionHash.value = value.hash
      transactions.value.forEach((transaction, index) => {
        if (transaction.hash === value.hash) transactions.value[index] = value
      })
    },
  })
  const currentPage = ref<number>(1)
  const keyword = ref<string | undefined>()

  // ==========================================================================
  //                                Getters
  // ==========================================================================
  //

  // ==========================================================================
  //                                Actions
  // ==========================================================================
  const reset = () => {
    transactions.value = []
    selectedTransactionHash.value = undefined
    currentPage.value = 1
    keyword.value = undefined
  }

  // /**
  //  * Finds a transaction in the `transactions` array by its address.
  //  * @param {string} txhash - The Ethereum address of the transaction to find.
  //  * @returns {Transaction | undefined} The transaction if found, undefined otherwise.
  //  */
  // const findTransaction = (txhash: string): Transaction | undefined => {
  //   const transaction = transactions.value.find((t) => t.hash === txhash)
  //   return transaction
  // }

  // ==========================================================================
  //                              Initializations
  // ==========================================================================
  //

  return {
    // ============================== State variables ==============================
    transactions,
    selectedTransaction,
    currentPage,
    keyword,
    // ================================= Methods ===================================
    reset,
  }
})
