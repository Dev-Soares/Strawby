import type { ComponentType, CSSProperties } from 'react'
import { Armchair, Bike, Dumbbell, Flame, Footprints } from 'lucide-react'

export type ActivityLevelIcon = ComponentType<{
  size?: number
  className?: string
  style?: CSSProperties
}>

export type ActivityLevel = {
  /** Multiplicador aplicado sobre a taxa metabólica basal */
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
    value: 1.15,
    label: 'Sedentário',
    description: 'Pouca ou nenhuma atividade física',
    icon: Armchair,
    intensity: 1,
  },
  {
    value: 1.3,
    label: 'Levemente ativo',
    description: 'Exercícios leves 1–3x por semana',
    icon: Footprints,
    intensity: 2,
  },
  {
    value: 1.4,
    label: 'Moderadamente ativo',
    description: 'Exercícios moderados 3–5x por semana',
    icon: Bike,
    intensity: 3,
  },
  {
    value: 1.5,
    label: 'Muito ativo',
    description: 'Exercícios intensos 6–7x por semana',
    icon: Dumbbell,
    intensity: 4,
  },
  {
    value: 1.6,
    label: 'Extremamente ativo',
    description: 'Treino diário intenso ou trabalho físico',
    icon: Flame,
    intensity: 5,
  },
]

/** Nível padrão — moderadamente ativo */
export const DEFAULT_ACTIVITY_LEVEL = 1.4
