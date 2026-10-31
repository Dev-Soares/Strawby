import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'

export type ThemePreference = 'dark' | 'light' | 'system'

export type ThemeState = {
  theme: ThemePreference
  resolvedTheme: 'dark' | 'light'
  toggleTheme: () => void
  setTheme: (t: ThemePreference) => void
}

const STORAGE_KEY = 'strawby-theme-preference'

function getSystemTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function subscribeSystemTheme(callback: () => void) {
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  media.addEventListener('change', callback)
  return () => media.removeEventListener('change', callback)
}

function getInitialPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemePreference | null
    if (stored === 'dark' || stored === 'light' || stored === 'system') return stored
  } catch { /* ignore */ }
  return 'system'
}

export function useTheme(): ThemeState {
  const [theme, setThemeState] = useState<ThemePreference>(getInitialPreference)
  const systemTheme = useSyncExternalStore<'dark' | 'light'>(
    subscribeSystemTheme,
    getSystemTheme,
    () => 'light',
  )
  const resolvedTheme = theme === 'system' ? systemTheme : theme

  useEffect(() => {
    if (resolvedTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [resolvedTheme])

  const setTheme = useCallback((t: ThemePreference) => {
    try {
      if (t === 'system') {
        localStorage.removeItem(STORAGE_KEY)
      } else {
        localStorage.setItem(STORAGE_KEY, t)
      }
    } catch { /* ignore */ }
    setThemeState(t)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }, [resolvedTheme, setTheme])

  return { theme, resolvedTheme, toggleTheme, setTheme }
}
