import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { queryClient } from '../queryClient'

export const UNAUTHORIZED_EVENT = 'auth:unauthorized'
export const NETWORK_ERROR_EVENT = 'network:error'
export const NETWORK_OK_EVENT = 'network:ok'

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean }

// `navigator.onLine` é otimista — reporta true em wi-fi sem saída (portal
// cativo, 4G sem dados). Uma request que falhou sem resposta é o único sinal
// confiável de que o app está realmente sem rede.
const isNetworkError = (error: AxiosError) =>
  !error.response && error.code !== 'ERR_CANCELED'

let isRefreshing = false
let refreshSubscribers: Array<(error?: unknown) => void> = []

const notifySubscribers = (error?: unknown) => {
  refreshSubscribers.forEach((subscriber) => subscriber(error))
  refreshSubscribers = []
}

const handleUnauthorized = () => {
  // Marca usuário como deslogado SEM invalidar — invalidar dispararia
  // refetch de /user/me → 401 → refresh → handleUnauthorized → loop infinito.
  queryClient.setQueryData(['user', 'me'], null)
  window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT))
}

export const setupAuthRefreshInterceptor = (api: AxiosInstance) => {
  api.interceptors.response.use(
    (response) => {
      window.dispatchEvent(new CustomEvent(NETWORK_OK_EVENT))
      return response
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryableConfig | undefined
      const status = error.response?.status

      if (isNetworkError(error)) {
        window.dispatchEvent(new CustomEvent(NETWORK_ERROR_EVENT))
        return Promise.reject(error)
      }

      const isRefreshCall = originalRequest?.url === '/auth/refresh'

      if (status !== 401 || !originalRequest || isRefreshCall || originalRequest._retry) {
        // 401 terminal (já tentou refresh e retry) → desloga. O 401 do próprio
        // /auth/refresh é tratado no catch abaixo, então não dispara aqui.
        if (status === 401 && originalRequest?._retry && !isRefreshCall) {
          handleUnauthorized()
        }
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshSubscribers.push((refreshError?: unknown) => {
            if (refreshError) {
              reject(refreshError)
              return
            }
            originalRequest._retry = true
            api(originalRequest).then(resolve).catch(reject)
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        await api.post('/auth/refresh')
        isRefreshing = false
        notifySubscribers()
        return api(originalRequest)
      } catch (refreshError) {
        isRefreshing = false
        notifySubscribers(refreshError)
        handleUnauthorized()
        return Promise.reject(refreshError)
      }
    },
  )
}
