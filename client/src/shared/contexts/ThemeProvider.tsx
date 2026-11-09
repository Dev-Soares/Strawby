import { useTheme } from '../hooks/useTheme'
import { ThemeContext } from './theme-context'

export type { ThemeState } from '../hooks/useTheme'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const value = useTheme()
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
