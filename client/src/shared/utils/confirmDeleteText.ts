type ConfirmTarget = { type: string; name: string } | null

type ConfirmText = { title: string; description: string }

/** Textos do modal de confirmação por tipo de alvo */
const TEXTS: Record<string, (name: string) => ConfirmText> = {
  meal: (name) => ({
    title: `Remover refeição "${name}"?`,
    description: 'A refeição será excluída permanentemente.',
  }),
  mealItem: (name) => ({
    title: `Remover "${name}"?`,
    description: 'O alimento será removido desta refeição.',
  }),
  mealRecipe: (name) => ({
    title: `Remover receita "${name}"?`,
    description: 'A receita será removida desta refeição.',
  }),
  recipe: (name) => ({
    title: `Remover receita "${name}"?`,
    description: 'A receita será excluída permanentemente.',
  }),
  recipeItem: (name) => ({
    title: `Remover "${name}"?`,
    description: 'O alimento será removido desta receita.',
  }),
}

const FALLBACK: ConfirmText = {
  title: 'Tem certeza?',
  description: 'Esta ação não pode ser desfeita.',
}

export const confirmDeleteText = (target: ConfirmTarget): ConfirmText =>
  target ? (TEXTS[target.type]?.(target.name) ?? FALLBACK) : FALLBACK
