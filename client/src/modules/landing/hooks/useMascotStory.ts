import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import {
  MASCOT_ACTION_DURATION_MS,
  preloadMascotActions,
} from '@/shared/config/mascotActions'
import type { MascotAction } from '@/shared/types/mascotAction'

/**
 * A história que o mascote conta na hero: ele come e depois registra no
 * celular — a proposta do produto em dois gestos, sem texto.
 *
 * `loops` multiplica a duração da animação: comer precisa de duas voltas pra
 * leitura não ficar apressada, o celular fecha a ideia em uma.
 */
const STORY = [
  { action: 'eating', loops: 2 },
  { action: 'phone', loops: 1 },
] as const satisfies readonly { action: MascotAction; loops: number }[]

const STORY_ACTIONS = STORY.map((step) => step.action)

/**
 * Toca a história em loop e expõe a ação atual.
 *
 * Com `prefers-reduced-motion` a troca não acontece: o mascote fica na primeira
 * cena e `isStatic` avisa a UI pra mostrar a composição inteira de uma vez, em
 * vez de esperar por uma transição que nunca vem.
 */
export const useMascotStory = () => {
  const prefersReducedMotion = useReducedMotion()
  const [index, setIndex] = useState(0)

  // as animações são ~700KB cada — baixar antes tira a espera da troca de cena
  useEffect(() => {
    preloadMascotActions(STORY_ACTIONS)
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) return

    const step = STORY[index]
    const timer = setTimeout(
      () => setIndex((prev) => (prev + 1) % STORY.length),
      MASCOT_ACTION_DURATION_MS[step.action] * step.loops,
    )

    return () => clearTimeout(timer)
  }, [index, prefersReducedMotion])

  return {
    action: STORY[index].action as MascotAction,
    isStatic: Boolean(prefersReducedMotion),
  }
}
