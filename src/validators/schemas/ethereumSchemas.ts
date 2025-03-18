// ethereumSchemas.ts

import { object, string, number, boolean } from 'yup'
import { isEthAddr } from '@/utils/booleanUtils'

export const ethereumAddressSchema = () =>
  string().test('ethereum-address', '${label} is invalid ethereum address.', (value) =>
    isEthAddr(value),
  )
