import { ToastType } from '@/enums/toastEnums'
import { useToastStore } from '@/stores/useToastStore'

export function showToast(type: ToastType, message: string, disappearIn: number = 3000): void {
  useToastStore().addToast(type, message, disappearIn)
}
