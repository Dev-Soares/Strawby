export function toLocalISODate(date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** Converte 'YYYY-MM-DD' em Date local (sem deslocamento de fuso). */
export function parseLocalISODate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export type CalendarDay = {
  iso: string
  day: number
  inMonth: boolean
}

/**
 * Grade do mês com 6 semanas fixas (42 células, domingo a sábado).
 * Altura constante evita o popover "pular" ao trocar de mês.
 */
export function buildMonthGrid(year: number, month: number): CalendarDay[] {
  const firstWeekday = new Date(year, month, 1).getDay()
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(year, month, 1 - firstWeekday + index)
    return {
      iso: toLocalISODate(date),
      day: date.getDate(),
      inMonth: date.getMonth() === month,
    }
  })
}

export function formatBirthDate(birthDate: string): string {
  const d = new Date(birthDate)
  const day = String(d.getUTCDate()).padStart(2, '0')
  const month = String(d.getUTCMonth() + 1).padStart(2, '0')
  const year = d.getUTCFullYear()
  return `${day}/${month}/${year}`
}

export function computeAge(birthDate: string): number {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}
