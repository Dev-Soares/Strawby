export type ActivityLevel = {
  /** Multiplicador aplicado sobre a taxa metabólica basal */
  value: number
  label: string
  description: string
}

export const ACTIVITY_LEVELS: ActivityLevel[] = [
  { value: 1.15, label: 'Sedentário', description: 'Pouca ou nenhuma atividade física' },
  { value: 1.3, label: 'Levemente ativo', description: 'Exercícios leves 1–3x por semana' },
  { value: 1.4, label: 'Moderadamente ativo', description: 'Exercícios moderados 3–5x por semana' },
  { value: 1.5, label: 'Muito ativo', description: 'Exercícios intensos 6–7x por semana' },
  { value: 1.6, label: 'Extremamente ativo', description: 'Treino diário intenso ou trabalho físico' },
]

/** Nível padrão — moderadamente ativo */
export const DEFAULT_ACTIVITY_LEVEL = 1.4
