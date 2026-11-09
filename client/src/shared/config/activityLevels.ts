import type { ComponentType, CSSProperties } from 'react'
import { Armchair, Bike, Dumbbell, Flame, Footprints } from 'lucide-react'

export type ActivityLevelIcon = ComponentType<{
  size?: number
  className?: string
  style?: CSSProperties
}>

export type ActivityLevel = {
  /**
   * Multiplicador aplicado sobre a taxa metabólica basal.
   * Fatores do Mifflin-St Jeor (1990) — o servidor só aceita estes valores.
   */
  value: number
  label: string
  description: string
  /** Ícone do nível — atividade típica da intensidade */
  icon: ActivityLevelIcon
  /** Intensidade de 1 a 5 — alimenta o indicador de barrinhas */
  intensity: number
}

export const ACTIVITY_LEVELS: ActivityLevel[] = [
  {
    value: 1.2,
    label: 'Sedentário',
    description: 'Pouca ou nenhuma atividade física',
    icon: Armchair,
    intensity: 1,
  },
  {
    value: 1.375,
    label: 'Levemente ativo',
    description: 'Exercícios leves 1–3x por semana',
    icon: Footprints,
    intensity: 2,
  },
  {
    value: 1.55,
    label: 'Moderadamente ativo',
    description: 'Exercícios moderados 3–5x por semana',
    icon: Bike,
    intensity: 3,
  },
  {
    value: 1.725,
    label: 'Muito ativo',
    description: 'Exercícios intensos 6–7x por semana',
    icon: Dumbbell,
    intensity: 4,
  },
  {
    value: 1.9,
    label: 'Extremamente ativo',
    description: 'Treino diário intenso ou trabalho físico',
    icon: Flame,
    intensity: 5,
  },
]

/** Valores aceitos pela API — qualquer outro número é recusado no servidor. */
export const ACTIVITY_LEVEL_VALUES = ACTIVITY_LEVELS.map((level) => level.value)

/** Nível padrão — moderadamente ativo */
export const DEFAULT_ACTIVITY_LEVEL = 1.55
