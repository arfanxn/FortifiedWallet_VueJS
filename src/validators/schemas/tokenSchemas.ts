import { TokenMetadata } from '@/interfaces/tokenInterfaces'
import { string } from 'yup'

export const tokenExistsSchema = (fetcher: (token: string) => Promise<TokenMetadata>) => {
  const message = '${label} does not exist.'
  return string().test('token-exists', message, async (token, context) => {
    try {
      await fetcher(token!)
      return true
    } catch (error) {
      return context.createError({ message: message })
    }
  })
}
