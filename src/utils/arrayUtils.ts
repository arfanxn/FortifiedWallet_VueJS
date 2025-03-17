import { getLastIndex } from './numberUtils'

export function getLastItem<T>(data: T[]): T {
  return data[getLastIndex(data)]
}
