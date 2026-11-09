import { isAxiosError } from 'axios'

/**
 * 503 = dependência externa fora do ar (ex: provider de IA sem key ou
 * indisponível). Não é falha do app, então a UI responde "tente mais tarde"
 * em vez de mostrar erro genérico.
 */
export const isServiceUnavailableError = (error: unknown): boolean =>
  isAxiosError(error) && error.response?.status === 503
