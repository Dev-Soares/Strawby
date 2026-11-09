import { isAxiosError } from 'axios'

/**
 * Lê o `code` que a API manda no corpo do erro. Existe porque alguns status
 * são reusados em situações diferentes (ex: 429 vale pro throttle por IP e pra
 * cota diária) — o status sozinho não diz o que aconteceu.
 */
export const getApiErrorCode = (error: unknown): string | undefined => {
  if (!isAxiosError(error)) return undefined

  const { code } = (error.response?.data ?? {}) as { code?: unknown }
  return typeof code === 'string' ? code : undefined
}
