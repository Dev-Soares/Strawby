import { createContext } from 'react'
import type { ThemeState } from '../hooks/useTheme'

export const ThemeContext = createContext<ThemeState | null>(null)
