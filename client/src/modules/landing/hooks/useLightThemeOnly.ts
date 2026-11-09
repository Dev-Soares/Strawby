import { useEffect } from 'react'

/**
 * A landing fica sempre no tema claro, independente da preferência do usuário.
 * Marca o <html> enquanto a página está montada — o CSS em index.css usa esse
 * atributo pra neutralizar o fundo escuro global.
 */
export function useLightThemeOnly() {
  useEffect(() => {
    document.documentElement.dataset.forceLight = 'true'
    return () => {
      delete document.documentElement.dataset.forceLight
    }
  }, [])
}
