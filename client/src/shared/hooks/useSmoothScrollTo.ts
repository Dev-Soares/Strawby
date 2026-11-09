import { useCallback } from 'react'

/**
 * Rola suave até uma âncora na mesma página.
 *
 * O `scroll-behavior: smooth` global é proibido (ver index.css): ele faz o
 * ScrollToTop animar a subida a cada troca de rota. Então quem quer suavidade
 * pede explicitamente — é o caso dos links de âncora da landing.
 *
 * Href que não começa com `#` passa direto, com a navegação padrão do browser.
 */
export const useSmoothScrollTo = () => {
  return useCallback((event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) return

    const target = document.querySelector(href)
    if (!target) return

    event.preventDefault()

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    target.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    })

    // scrollIntoView não mexe na URL: sem isso o link some do histórico e o
    // usuário não consegue compartilhar/voltar para a seção.
    window.history.replaceState(null, '', href)
  }, [])
}
