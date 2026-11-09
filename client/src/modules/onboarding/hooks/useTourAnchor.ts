import { useEffect, useState } from 'react'

export type TourRect = { top: number; left: number; width: number; height: number }

const read = (target?: string): TourRect | null => {
  if (!target) return null

  // a TabBar existe duas vezes (mobile e desktop) e a do breakpoint oposto
  // continua no DOM, só que sem caixa — vale a primeira que estiver visível
  for (const element of document.querySelectorAll(`[data-tour="${target}"]`)) {
    const rect = element.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) continue

    return { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
  }

  return null
}

const isSame = (a: TourRect | null, b: TourRect | null) =>
  a === b ||
  (!!a &&
    !!b &&
    a.top === b.top &&
    a.left === b.left &&
    a.width === b.width &&
    a.height === b.height)

/**
 * Posição do elemento marcado com `data-tour`, remedida a cada frame.
 *
 * O alvo se mexe sozinho: a rota do passo monta depois da troca, a TabBar troca
 * de layout no breakpoint e o indicador da aba ativa é animado. Um listener de
 * resize não pegaria nada disso — por isso o `requestAnimationFrame`, que só
 * roda enquanto o tutorial está aberto e só muda o state quando a caixa muda.
 */
export const useTourAnchor = (target?: string) => {
  const [rect, setRect] = useState<TourRect | null>(() => read(target))

  useEffect(() => {
    let frame = 0

    const tick = () => {
      setRect((previous) => {
        const next = read(target)
        return isSame(previous, next) ? previous : next
      })
      frame = requestAnimationFrame(tick)
    }

    tick()
    return () => cancelAnimationFrame(frame)
  }, [target])

  return rect
}
