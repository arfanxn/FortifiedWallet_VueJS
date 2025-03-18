import { string as yupString, number as yupNumber } from 'yup'

export const alphanumericSchema = () =>
  yupString().matches(/^[A-Za-z0-9]*$/, '${label} must be alphanumeric.')
