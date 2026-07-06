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
import { registerServiceWorker } from './shared/utils/registerServiceWorker'

try {
  registerServiceWorker()
} catch {
  // WebViews restritos (ex: Instagram no iOS) podem bloquear service workers.
}

const rootElement = document.getElementById('root')
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
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
      </GoogleOAuthProvider>
    </StrictMode>,
  )
}
