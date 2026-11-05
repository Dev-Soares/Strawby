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

export const buildSuggestionIntro = (
  count: number,
  mealType?: MealType,
): string => {
  const label = mealType ? mealTypeLabels[mealType].toLowerCase() : 'refeição'
  const ideas = count === 1 ? 'ideia' : 'ideias'

  return `Tenho ${count} ${ideas} de ${label} pra você! Caso tenha gostado, escolha uma para adicionar ao seu dia.`
}
