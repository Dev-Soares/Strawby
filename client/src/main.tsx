import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App'
import { queryClient } from './api/queryClient'
import ThemeProvider from './shared/contexts/ThemeProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <App />
        </ThemeProvider>
        <Toaster position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
