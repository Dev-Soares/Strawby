import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { queryClient } from '../queryClient'

export const UNAUTHORIZED_EVENT = 'auth:unauthorized'

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean }

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
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryableConfig | undefined
      const status = error.response?.status

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
