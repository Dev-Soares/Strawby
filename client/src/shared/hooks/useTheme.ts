import { useCallback, useEffect, useState } from 'react'

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

function getInitialPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemePreference | null
    if (stored === 'dark' || stored === 'light' || stored === 'system') return stored
  } catch { /* ignore */ }
  return 'system'
}

export function useTheme(): ThemeState {
  const [theme, setThemeState] = useState<ThemePreference>(getInitialPreference)
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>(getSystemTheme())

  const apply = useCallback((pref: ThemePreference) => {
    const resolved = pref === 'system' ? getSystemTheme() : pref
    setResolvedTheme(resolved)
    if (resolved === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  useEffect(() => {
    apply(theme)
  }, [theme, apply])

  useEffect(() => {
    if (theme !== 'system') return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => apply('system')
    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [theme, apply])

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
