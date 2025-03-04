export type StringOrNull = string | null
export type StringOrNullOrUndefined = string | null | undefined

export type BooleanOrNull = boolean | null
export type BooleanOrNullOrUndefined = boolean | null | undefined

export type NumberOrNull = number | null
export type NumberOrNullOrUndefined = number | null | undefined

export interface ObjectKeyValue<T> {
  key: string
  value: T
}
