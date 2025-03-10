import type { Ref, ComputedRef } from 'vue'

export type StringOrNull = string | null
export type StringOrUndefined = string | undefined
export type StringOrNullOrUndefined = string | null | undefined

export type BooleanOrNull = boolean | null
export type BooleanOrUndefined = boolean | undefined
export type BooleanOrNullOrUndefined = boolean | null | undefined

export type NumberOrNull = number | null
export type NumberOrNullOrUndefined = number | null | undefined

export type ComputedRefOrRef<T> = ComputedRef<T> | Ref<T>
export type RawOrComputedRefOrRef<T> = T | ComputedRefOrRef<T>

export interface ObjectKeyValue<T> {
  key: string
  value: T
}
