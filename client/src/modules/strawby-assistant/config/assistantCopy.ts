import { mealTypeLabels, type MealType } from '../types/snackSuggestion'

/** Fala do usuário ao escolher o tipo de refeição no seletor. */
export const buildMealTypeChoiceMessage = (mealType?: MealType): string =>
  `Quero uma sugestão de ${mealType ? mealTypeLabels[mealType].toLowerCase() : 'refeição'}`

export const buildMealAddedMessage = (mealName: string): string =>
  `Mandou bem! "${mealName}" já está no seu diário de hoje. Bom apetite!`

export const SUGGESTION_EMPTY_MESSAGE =
  'Poxa, não consegui montar nada agora. Tenta de novo daqui a pouco?'

/** Fala do mascote quando a IA está fora do ar (sem key, provider caído). */
export const ASSISTANT_UNAVAILABLE_MESSAGE =
  'Poxa, não estou disponível no momento. Tente novamente mais tarde.'

/** Fala do usuário ao escolher o nível de atividade no seletor. */
export const buildActivityLevelChoiceMessage = (label: string): string =>
  `Meu nível de atividade é: ${label.toLowerCase()}`

export const PLAN_INTENT_MESSAGE = 'Quero que você gere meu plano alimentar'

export const PLAN_PROMPT_MESSAGE =
  'Bora montar! Me conta qual é o seu nível de atividade física que eu calculo suas metas.'

export const PLAN_DISCARDED_MESSAGE =
  'Tudo bem, não mexi no seu plano. Se quiser calcular de novo, é só escolher outro nível de atividade.'

export const buildSuggestionIntro = (
  count: number,
  mealType?: MealType,
): string => {
  const label = mealType ? mealTypeLabels[mealType].toLowerCase() : 'refeição'
  const ideas = count === 1 ? 'ideia' : 'ideias'

  return `Tenho ${count} ${ideas} de ${label} pra você! Caso tenha gostado, escolha uma para adicionar ao seu dia.`
}
