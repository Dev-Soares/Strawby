import axios from 'axios'
import { queryClient } from './queryClient'

export const UNAUTHORIZED_EVENT = 'auth:unauthorized'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      queryClient.setQueryData(['user', 'me'], null)
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] })
      window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT))
    }
    return Promise.reject(error)
  },
)
