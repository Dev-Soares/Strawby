import { useContext } from 'react'
import { ThemeContext } from '../contexts/theme-context'
import type { ThemeState } from '../hooks/useTheme'

export function useThemeContext(): ThemeState {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useThemeContext must be used within ThemeProvider')
  return ctx
}
