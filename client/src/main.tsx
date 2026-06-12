import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

if ('serviceWorker' in navigator) {
  const checkForUpdate = () => {
    // getRegistrations (plural): inclui o SW de push do FCM, que vive em scope próprio
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.update().catch(() => {}))
    })
  }
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') checkForUpdate()
  })
  window.addEventListener('focus', checkForUpdate)
}
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { HelmetProvider } from 'react-helmet-async'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App'
import { queryClient } from './api/queryClient'
import ThemeProvider from './shared/contexts/ThemeProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider 
    clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <ThemeProvider>

              <App />
            </ThemeProvider>
            <Toaster position="top-right" />
          </BrowserRouter>
        </QueryClientProvider>
      </HelmetProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
