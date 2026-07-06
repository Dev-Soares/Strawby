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
import BootstrapDiagnostics, {
  errorBootstrap,
  installGlobalErrorHandlers,
  logBootstrap,
  warnBootstrap,
} from './shared/components/BootstrapDiagnostics'
import { registerServiceWorker } from './shared/utils/registerServiceWorker'

installGlobalErrorHandlers()
logBootstrap('main.tsx executando')

try {
  registerServiceWorker()
  logBootstrap('registerServiceWorker OK')
} catch (error) {
  warnBootstrap('registerServiceWorker falhou', error instanceof Error ? error.message : String(error))
}

const rootElement = document.getElementById('root')
if (!rootElement) {
  errorBootstrap('Elemento #root não encontrado')
} else {
  logBootstrap('#root encontrado, renderizando')
  try {
    const root = createRoot(rootElement)
    root.render(
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
                <BootstrapDiagnostics />
              </BrowserRouter>
            </QueryClientProvider>
          </HelmetProvider>
        </GoogleOAuthProvider>
      </StrictMode>,
    )
    logBootstrap('createRoot.render chamado')
  } catch (renderError) {
    errorBootstrap('Erro no createRoot.render', renderError instanceof Error ? renderError.stack ?? renderError.message : String(renderError))
  }
}
