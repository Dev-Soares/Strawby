import { useMemo, useState } from 'react'
import type { MealDraft, MealDraftItem } from '../types/chat'

/** Macros são lineares na quantidade — reescala a partir do item original. */
const scaleItem = (base: MealDraftItem, quantity: number): MealDraftItem => {
  const ratio = base.quantity === 0 ? 0 : quantity / base.quantity

  return {
    ...base,
    quantity,
    calories: base.calories * ratio,
    protein: base.protein * ratio,
    carbs: base.carbs * ratio,
    fat: base.fat * ratio,
  }
}

/**
 * Estado de edição do rascunho antes de gravar.
 * Os totais são recalculados no cliente com a mesma conta do servidor, então o
 * que o card mostra é o que vai pro diário.
 */
export const useMealDraftEditor = (draft: MealDraft) => {
  const [items, setItems] = useState(draft.items)

  // rascunho novo descarta a edição do anterior
  const [source, setSource] = useState(draft)
  if (source !== draft) {
    setSource(draft)
    setItems(draft.items)
  }

  const baseItems = useMemo(
    () => new Map(draft.items.map((item) => [item.foodId, item])),
    [draft.items],
  )

  const setQuantity = (foodId: string, quantity: number) => {
    const base = baseItems.get(foodId)
    if (!base) return

    setItems((previous) =>
      previous.map((item) => (item.foodId === foodId ? scaleItem(base, quantity) : item)),
    )
  }

  const removeItem = (foodId: string) => {
    setItems((previous) => previous.filter((item) => item.foodId !== foodId))
  }

  const totals = useMemo(() => {
    const sum = (pick: (item: MealDraftItem) => number) =>
      items.reduce((total, item) => total + pick(item), 0)

    return {
      calories: sum((item) => item.calories),
      protein: sum((item) => item.protein),
      carbs: sum((item) => item.carbs),
      fat: sum((item) => item.fat),
    }
  }, [items])

  const edited: MealDraft = { ...draft, items, totals }
  const canConfirm = items.length > 0 && items.every((item) => item.quantity > 0)

  return { items, setQuantity, removeItem, totals, edited, canConfirm }
}
