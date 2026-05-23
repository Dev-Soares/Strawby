import { useEffect } from 'react'

export function useTheme() {
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')

    const apply = () => {
      if (media.matches) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }

    apply()
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [])
}
