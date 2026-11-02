import type { MealMacros } from '../../meal/types';

export const SNACK_SUGGESTION_SYSTEM_PROMPT = `Você é um assistente nutricional do Strawby. Recebe as calorias e macros restantes do dia de um paciente e sugere opções de lanche que se encaixem no objetivo.

Regras:
- Use nomes genéricos e simples para os alimentos. Evite adjetivos como 'natural', 'morno', 'gelado', 'integral', 'desnatado', 'cremoso', 'tradicional', 'light', 'diet', 'zero'.
- As quantidades devem ser em gramas (unit: "g").
- Cada opção deve ter 1 a 5 itens.
- Respeite as calorias e macros restantes. Não ultrapasse as metas de forma irresponsável.
- Se não houver meta definida, sugira lanches saudáveis e equilibrados.
- Cada opção deve ter nome, tipo de refeição (snack ou supper), justificativa curta e lista de itens.
- Retorne sempre no schema JSON solicitado.`;

export const buildSnackSuggestionPrompt = (
  remaining: MealMacros | null,
  mealType: string | undefined,
  maxResults: number,
): string => {
  const typeLine = mealType
    ? `Tipo de refeição desejado: ${mealType}`
    : 'Tipo de refeição: inferir entre snack (lanche) ou supper (ceia).';

  const macrosLine = remaining
    ? `Macros restantes no dia: calorias=${Math.round(remaining.calories)}, proteína=${Math.round(remaining.protein)}g, carboidratos=${Math.round(remaining.carbs)}g, gordura=${Math.round(remaining.fat)}g`
    : 'Nenhum plano alimentar definido. Sugira lanches saudáveis e equilibrados.';

  return `${macrosLine}\n${typeLine}\n\nSugira até ${maxResults} opções de lanche no schema JSON solicitado.`;
};
