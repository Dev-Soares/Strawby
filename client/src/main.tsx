import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App'
import { queryClient } from './api/queryClient'
import ThemeProvider from './shared/contexts/ThemeProvider'
import StrawbyToaster from './shared/components/StrawbyToaster'
import GlobalErrorBoundary from './shared/components/GlobalErrorBoundary'
import { GOOGLE_CLIENT_ID, isGoogleAuthEnabled } from './modules/auth/config/google'

// Registro e checagem do service worker vivem em modules/pwa (PwaAutoUpdate).

const tree = (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <GlobalErrorBoundary>
            <App />
          </GlobalErrorBoundary>
        </ThemeProvider>
        <StrawbyToaster />
      </BrowserRouter>
    </QueryClientProvider>
  </HelmetProvider>
)

const rootElement = document.getElementById('root')
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      {isGoogleAuthEnabled
        ? <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>{tree}</GoogleOAuthProvider>
        : tree
      }
    </StrictMode>,
  )
}
