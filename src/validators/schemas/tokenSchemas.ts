import { TokenMetadata } from '@/interfaces/tokenInterfaces'
import { string } from 'yup'

export const tokenExistsSchema = (
  fetcher: (token: string) => Promise<TokenMetadata | undefined>,
) => {
  const message = '${label} does not exist.'
  return string().test('token-exists', message, async (token, context) => {
    try {
      const tokenMetadata = await fetcher(token!)
      if (tokenMetadata === undefined) return context.createError({ message: message })
      return true
    } catch (error) {
      return context.createError({ message: message })
    }
  })
}
