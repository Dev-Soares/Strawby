export type SelectableFood = {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  kind: 'public' | 'private'
  servingSize: string | null
}

export type SelectableRecipe = {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  kind: 'recipe'
}

export type SelectableItem = SelectableFood | SelectableRecipe

export type SelectFoodTab = 'public' | 'private' | 'recipes'
