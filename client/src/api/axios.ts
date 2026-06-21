import axios from 'axios'
import { setupAuthRefreshInterceptor } from './interceptors/authRefreshInterceptor'

export { UNAUTHORIZED_EVENT } from './interceptors/authRefreshInterceptor'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true,
})

setupAuthRefreshInterceptor(api)
