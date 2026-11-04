import { useState } from 'react'

export const MONTH_LABELS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

/** Mesma faixa aceita pelo schema de onboarding. */
const MIN_AGE = 10
const MAX_AGE = 120

type DateParts = { day: string; month: string; year: string }

const splitIso = (iso?: string): DateParts => {
  const [year = '', month = '', day = ''] = (iso ?? '').split('-')
  return { day, month, year }
}

const pad = (value: number) => String(value).padStart(2, '0')

const daysInMonth = ({ month, year }: DateParts) => {
  if (!month) return 31
  // dia 0 do mês seguinte = último dia do mês atual
  return new Date(Number(year) || 2000, Number(month), 0).getDate()
}

interface UseBirthDateSelectParams {
  /** Data no formato 'YYYY-MM-DD'. */
  value?: string
  onChange: (iso?: string) => void
}

/**
 * Data de nascimento em três listas (dia / mês / ano).
 * O calendário do app navega mês a mês — inviável para anos de nascimento.
 * A data só chega ao formulário quando as três partes estão preenchidas.
 */
export const useBirthDateSelect = ({ value, onChange }: UseBirthDateSelectParams) => {
  const [parts, setParts] = useState<DateParts>(() => splitIso(value))

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: MAX_AGE - MIN_AGE + 1 }, (_, i) => currentYear - MIN_AGE - i)
  const days = Array.from({ length: daysInMonth(parts) }, (_, i) => i + 1)

  const setPart = (part: keyof DateParts, raw: string) => {
    const next: DateParts = { ...parts, [part]: raw }

    // trocar de mês pode encurtar a lista de dias (31/03 → 28/02)
    const maxDay = daysInMonth(next)
    if (next.day && Number(next.day) > maxDay) next.day = pad(maxDay)

    setParts(next)

    const isComplete = Boolean(next.day && next.month && next.year)
    onChange(isComplete ? `${next.year}-${next.month}-${next.day}` : undefined)
  }

  return {
    parts,
    days,
    years,
    monthLabels: MONTH_LABELS,
    setDay: (day: number) => setPart('day', pad(day)),
    setMonth: (month: number) => setPart('month', pad(month)),
    setYear: (year: number) => setPart('year', String(year)),
    pad,
  }
}
