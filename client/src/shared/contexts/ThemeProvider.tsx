import { createContext, useContext } from 'react'
import { useTheme, type ThemeState } from '../hooks/useTheme'

const ThemeContext = createContext<ThemeState | null>(null)

export function useThemeContext(): ThemeState {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useThemeContext must be used within ThemeProvider')
  return ctx
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const value = useTheme()
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
