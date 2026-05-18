import axios from 'axios'
import { queryClient } from './queryClient'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      queryClient.setQueryData(['auth', 'me'], null)
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })

      const path = window.location.pathname
      const publicPaths = ['/', '/app/login', '/app/create-account']
      if (!publicPaths.includes(path)) {
        window.location.href = '/app/login'
      }
    }
    return Promise.reject(error)
  },
)
