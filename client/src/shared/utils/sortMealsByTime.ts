type SortableMeal = {
  kind: string
  time: string | null
  date: string
}

const timeFromDate = (date: string) =>
  new Date(date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

/**
 * Hora usada na ordenação — mesma regra de exibição do card: refeição de plano
 * é template e só tem a hora definida; a do diário cai na hora do registro
 * quando não há hora explícita.
 */
const effectiveTime = (meal: SortableMeal): string | null =>
  meal.kind === 'PLAN' ? meal.time : (meal.time ?? timeFromDate(meal.date))

/** 'HH:MM' é ordenável lexicograficamente. Sem hora vai para o fim da lista. */
export function sortMealsByTime<T extends SortableMeal>(meals: T[]): T[] {
  return [...meals].sort((a, b) => {
    const timeA = effectiveTime(a)
    const timeB = effectiveTime(b)

    if (!timeA && !timeB) return new Date(a.date).getTime() - new Date(b.date).getTime()
    if (!timeA) return 1
    if (!timeB) return -1

    const byTime = timeA.localeCompare(timeB)
    if (byTime !== 0) return byTime

    // Mesma hora: mantém a ordem de registro.
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })
}
