import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { queryClient } from '../queryClient'

export const UNAUTHORIZED_EVENT = 'auth:unauthorized'

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean }

let isRefreshing = false
let refreshSubscribers: Array<() => void> = []

const onRefreshed = () => {
  refreshSubscribers.forEach((subscriber) => subscriber())
  refreshSubscribers = []
}

const handleUnauthorized = () => {
  queryClient.setQueryData(['user', 'me'], null)
  queryClient.invalidateQueries({ queryKey: ['user', 'me'] })
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
        if (status === 401) handleUnauthorized()
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshSubscribers.push(() => {
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
        onRefreshed()
        return api(originalRequest)
      } catch (refreshError) {
        isRefreshing = false
        refreshSubscribers = []
        handleUnauthorized()
        return Promise.reject(refreshError)
      }
    },
  )
}
