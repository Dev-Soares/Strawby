import { useEffect } from 'react'
import { CONTROLS_SPACE } from './useTourLayout'

/** Quanto tempo esperar o alvo montar depois da troca de rota. */
const WAIT_MS = 1500
const RETRY_MS = 80

/** Folga do topo: os controles do tutorial moram lá e cobririam o alvo. */
const TOP_OFFSET = CONTROLS_SPACE + 24

const findVisible = (target: string) => {
  for (const element of document.querySelectorAll(`[data-tour="${target}"]`)) {
    const rect = element.getBoundingClientRect()
    if (rect.width > 0 && rect.height > 0) return element
  }
  return null
}

/** TabBar e header não rolam com a página — centralizar eles só bagunça o scroll. */
const isPinned = (element: Element) => {
  let node: Element | null = element

  while (node) {
    const { position } = getComputedStyle(node)
    if (position === 'fixed' || position === 'sticky') return true
    node = node.parentElement
  }

  return false
}

/**
 * Traz o alvo do passo para o meio da tela.
 *
 * Sem isso o closeup só funcionaria no que já estivesse visível — e boa parte
 * do que o tutorial mostra (gráfico de peso, resumo do dia) vive abaixo da
 * dobra. O alvo costuma montar depois da rota, daí a espera.
 */
export const useTourScroll = (target?: string) => {
  useEffect(() => {
    if (!target) return

    let timer = 0
    const deadline = Date.now() + WAIT_MS

    const attempt = () => {
      const element = findVisible(target)

      if (element) {
        if (!isPinned(element)) {
          const rect = element.getBoundingClientRect()
          const viewport = window.innerHeight

          // alvo que ocupa quase a tela toda fica encostado no topo: centralizar
          // não deixaria espaço nem em cima nem embaixo para o mascote
          const offset =
            rect.height > viewport * 0.6
              ? TOP_OFFSET
              : Math.max((viewport - rect.height) / 2, TOP_OFFSET)

          window.scrollTo({ top: window.scrollY + rect.top - offset, behavior: 'smooth' })
        }
        return
      }

      if (Date.now() < deadline) timer = window.setTimeout(attempt, RETRY_MS)
    }

    attempt()
    return () => window.clearTimeout(timer)
  }, [target])
}
