import type { ObjectKeyValue, StringOrNull } from '@/interfaces/interfaces'

export interface SelectFieldProps<T> {
  name: string
  label: StringOrNull
  disabled: boolean
  value: StringOrNull
  options: ObjectKeyValue<T>[]
}
