import { useViewportSize } from '@/shared/hooks/useViewportSize'
import { useTourAnchor, type TourRect } from './useTourAnchor'

/** Breakpoint `sm` do Tailwind — o launcher e a TabBar mudam de lugar aqui. */
const DESKTOP_MIN_WIDTH = 640

/** Folga entre o mascote, o balão e o alvo. */
const GAP = 12

/** Respiro mínimo das bordas da janela. */
const EDGE = 12

/** Mesmas coordenadas do `AssistantLauncher` — é de lá que o mascote sai. */
const DOCK = {
  mobile: { right: 20, bottom: 96, size: 76 },
  desktop: { right: 24, bottom: 24, size: 80 },
}

/** Mascote solto, caminhando pela tela. */
const FREE_SIZE = { mobile: 96, desktop: 120 }

const CALLOUT_MAX_WIDTH = 352

/** Altura usada até o balão ser medido de verdade. */
const CALLOUT_FALLBACK_HEIGHT = 96

/**
 * Faixa ocupada pelos controles, que ficam parados no mesmo canto o tutorial
 * inteiro: topo no mobile, rodapé no desktop. O bloco do mascote nunca entra lá.
 */
export const CONTROLS_SPACE = 92

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), Math.max(min, max))

export type TourLayout = {
  /** Caixa do alvo, para o recorte do escuro. `null` sem alvo nesta tela. */
  rect: TourRect | null
  isDocked: boolean
  mascot: { left: number; top: number; size: number }
  /** Já resolvido em coordenadas finais — o balão não usa transform. */
  callout: { left: number; top: number; width: number }
}

type Geometry = {
  vw: number
  vh: number
  size: number
  calloutWidth: number
  calloutHeight: number
}

/**
 * O bloco, ancorado pelo topo: a fala sempre sai por cima do mascote, como num
 * quadrinho — o bico aponta pra baixo em todos os passos.
 */
const stack = (top: number, left: number, calloutLeft: number, g: Geometry) => ({
  callout: { left: calloutLeft, top, width: g.calloutWidth },
  mascot: { left, top: top + g.calloutHeight + GAP, size: g.size },
})

/**
 * Onde o mascote e o balão ficam neste passo.
 *
 * No fecho o mascote ocupa exatamente o lugar do botão do assistente, pra
 * mostrar onde encontrá-lo depois. Com alvo, o bloco (mascote + balão) procura
 * um lado que caiba inteiro: embaixo, em cima, ou ao lado quando o alvo é alto
 * demais para sobrar espaço vertical. Em último caso ele encosta na borda e
 * cobre parte do alvo — melhor do que sair da tela.
 *
 * Os controles ficam parados no topo o tutorial inteiro, e a faixa deles nunca
 * é ocupada pelo bloco. É a única borda livre: o rodapé é da TabBar, que é alvo
 * de vários passos.
 */
export const useTourLayout = (
  target?: string,
  /** Passo do fecho: o mascote vira a bolinha do assistente. */
  isDock = false,
  calloutHeight?: number,
): TourLayout => {
  const rect = useTourAnchor(target)
  const { width: vw, height: vh } = useViewportSize()

  const isDesktop = vw >= DESKTOP_MIN_WIDTH
  const calloutWidth = Math.min(CALLOUT_MAX_WIDTH, vw - EDGE * 2)

  /** Faixa livre: a borda dos controles fica de fora. */
  const ceiling = isDesktop ? EDGE : CONTROLS_SPACE
  const floor = isDesktop ? vh - CONTROLS_SPACE : vh - EDGE

  if (!rect) {
    const g: Geometry = {
      vw,
      vh,
      size: isDesktop ? FREE_SIZE.desktop : FREE_SIZE.mobile,
      calloutWidth,
      calloutHeight: calloutHeight ?? CALLOUT_FALLBACK_HEIGHT,
    }

    // abertura, ou alvo que existe na config mas não nesta tela (plano já
    // criado, lista vazia): o mascote fala do meio da tela
    if (!isDock) {
      const blockHeight = g.size + GAP + g.calloutHeight
      const top = clamp((vh - blockHeight) / 2, ceiling, floor - blockHeight)
      const left = (vw - g.size) / 2
      const calloutLeft = clamp((vw - calloutWidth) / 2, EDGE, vw - calloutWidth - EDGE)

      return { rect: null, isDocked: false, ...stack(top, left, calloutLeft, g) }
    }

    // a bolinha tem posição fixa (é a cópia do launcher); só o balão se ajusta
    const dock = isDesktop ? DOCK.desktop : DOCK.mobile
    const dockLeft = vw - dock.right - dock.size
    const dockTop = vh - dock.bottom - dock.size

    return {
      rect: null,
      isDocked: true,
      mascot: { left: dockLeft, top: dockTop, size: dock.size },
      callout: {
        // alinhado pela direita, encostando na bolinha
        left: clamp(dockLeft + dock.size - calloutWidth, EDGE, vw - calloutWidth - EDGE),
        top: Math.max(ceiling, dockTop - GAP - g.calloutHeight),
        width: calloutWidth,
      },
    }
  }

  const g: Geometry = {
    vw,
    vh,
    size: isDesktop ? FREE_SIZE.desktop : FREE_SIZE.mobile,
    calloutWidth,
    calloutHeight: calloutHeight ?? CALLOUT_FALLBACK_HEIGHT,
  }

  const blockHeight = g.size + GAP + g.calloutHeight
  const centerX = rect.left + rect.width / 2
  const centeredLeft = clamp(centerX - g.size / 2, EDGE, vw - g.size - EDGE)
  const centeredCalloutLeft = clamp(centerX - calloutWidth / 2, EDGE, vw - calloutWidth - EDGE)

  const below = rect.top + rect.height + GAP
  if (below + blockHeight <= floor) {
    return {
      rect,
      isDocked: false,
      ...stack(below, centeredLeft, centeredCalloutLeft, g),
    }
  }

  const above = rect.top - GAP - blockHeight
  if (above >= ceiling) {
    return {
      rect,
      isDocked: false,
      ...stack(above, centeredLeft, centeredCalloutLeft, g),
    }
  }

  // alvo alto demais para sobrar espaço em cima ou embaixo: tenta o lado
  const needed = calloutWidth + GAP + EDGE
  const spaceRight = vw - (rect.left + rect.width)
  const spaceLeft = rect.left
  const sideTop = clamp(rect.top + rect.height / 2 - blockHeight / 2, ceiling, floor - blockHeight)

  if (spaceRight >= needed || spaceLeft >= needed) {
    const sideLeft =
      spaceRight >= needed
        ? rect.left + rect.width + GAP
        : rect.left - GAP - calloutWidth

    return {
      rect,
      isDocked: false,
      ...stack(sideTop, sideLeft + (calloutWidth - g.size) / 2, sideLeft, g),
    }
  }

  // nada cabe: fica do lado vertical mais folgado e cobre um pedaço do alvo,
  // que continua marcado pelo recorte do escuro
  const fitsBelow = floor - (rect.top + rect.height) >= rect.top

  if (fitsBelow) {
    const top = clamp(rect.top + rect.height + GAP, ceiling, floor - blockHeight)
    return {
      rect,
      isDocked: false,
      ...stack(top, centeredLeft, centeredCalloutLeft, g),
    }
  }

  const top = clamp(rect.top - GAP - blockHeight, ceiling, floor - blockHeight)
  return {
    rect,
    isDocked: false,
    ...stack(top, centeredLeft, centeredCalloutLeft, g),
  }
}
