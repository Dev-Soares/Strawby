import { useEffect, useRef } from 'react'

/**
 * Fecha um painel flutuante com clique fora ou Esc.
 * Devolve a ref que delimita o "dentro" — trigger e painel no mesmo elemento.
 */
export const useDismiss = <T extends HTMLElement>(isOpen: boolean, onClose: () => void) => {
  const containerRef = useRef<T>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) onClose()
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  return containerRef
}
