import type { MascotAction } from '@/shared/types/mascotAction'

export type TourStep = {
  id: string
  /** Aba apresentada neste passo. */
  route: string
  /**
   * Valor do `data-tour` do elemento que o mascote vai visitar.
   * Sem alvo ele fica na bolinha do assistente — é assim que o tutorial abre e
   * fecha.
   */
  target?: string
  /** Fala do mascote enquanto a aba está na tela. */
  prompt: string
  /** Animação do mascote enquanto o passo está na tela. */
  action: MascotAction
  /** Texto do botão principal. Padrão: "Continuar". */
  cta?: string
  /**
   * Fecho do tutorial: o mascote volta pra bolinha do assistente e pulsa,
   * mostrando onde encontrá-lo depois.
   */
  assistantHandoff?: boolean
}
