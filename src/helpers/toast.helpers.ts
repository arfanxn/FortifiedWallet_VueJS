import { ToastType } from '@/enums/toast.enums'
import { useToastStore } from '@/stores/toast.store'

export function showToast(type: ToastType, message: string, disappearIn: number = 3000): void {
  useToastStore().addToast(type, message, disappearIn)
}
