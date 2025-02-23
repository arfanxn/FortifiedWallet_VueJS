import { useToastStore } from '@/stores/toast.store'

export function showToast(type, message, disappearIn = 3000) {
  useToastStore().addToast(type, message, disappearIn)
}
