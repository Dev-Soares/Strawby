import { Smile, Frown } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type ScoreTierKey = 'good' | 'low'

export type ScoreTier = {
  key: ScoreTierKey
  /** Rótulo curto exibido no badge */
  label: string
  /** Frase de apoio abaixo do score */
  description: string
  icon: LucideIcon
  /** Cor principal — var() para acompanhar o tema */
  color: string
  /** Fundo claro do mesmo tom — tiles, trilhos e badges */
  track: string
}

export const SCORE_TIERS: Record<ScoreTierKey, ScoreTier> = {
  good: {
    key: 'good',
    label: 'Dia bom',
    description: 'Meus registros de hoje estão alinhados com o plano.',
    icon: Smile,
    color: 'var(--score-good)',
    track: 'var(--score-good-light)',
  },
  low: {
    key: 'low',
    label: 'Abaixo',
    description: 'Ainda dá para chegar lá ajustando as próximas refeições.',
    icon: Frown,
    color: 'var(--score-low)',
    track: 'var(--score-low-light)',
  },
}

/** Corte da nota (0–10) — mesmo valor que o servidor usa para manter a sequência */
export const GOOD_SCORE_THRESHOLD = 7

export const getScoreTier = (score: number, max = 10): ScoreTier => {
  const normalized = max === 10 ? score : (score / max) * 10
  return normalized >= GOOD_SCORE_THRESHOLD ? SCORE_TIERS.good : SCORE_TIERS.low
}

/** Cores das sequências — sequência atual (fogo) e recorde (troféu) */
export const STREAK_COLORS = {
  current: { color: 'var(--score-streak)', track: 'var(--score-streak-light)' },
  best: { color: 'var(--score-best)', track: 'var(--score-best-light)' },
}
