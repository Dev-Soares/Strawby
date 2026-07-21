import type { MonthlyScoreData, DayStatus } from '../types/monthlyScore'

export interface MonthRange {
  startDate: string
  endDate: string
  monthStart: Date
  daysInMonth: number
  firstDayOffset: number
}

interface ScoredEntry {
  date: string | Date
  score: number
}

function getDayStatus(score: number): DayStatus {
  return score >= 8 ? 'good' : 'bad'
}

export function getMonthRange(offset = 0): MonthRange {
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth() + offset, 1)
  const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0)

  const dow = monthStart.getDay()
  const firstDayOffset = dow === 0 ? 6 : dow - 1

  const fmt = (d: Date) => d.toISOString().split('T')[0]
  return {
    startDate: fmt(monthStart),
    endDate: fmt(monthEnd),
    monthStart,
    daysInMonth: monthEnd.getDate(),
    firstDayOffset,
  }
}

export function getTodayDateInMonth(monthStart: Date): number | null {
  const now = new Date()
  if (now.getFullYear() === monthStart.getFullYear() && now.getMonth() === monthStart.getMonth()) {
    return now.getDate()
  }
  return null
}

export function buildMonthlyScoreData(
  scores: ScoredEntry[],
  monthStart: Date,
  daysInMonth: number,
  firstDayOffset: number,
): MonthlyScoreData {
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = i + 1
    const d = new Date(monthStart.getFullYear(), monthStart.getMonth(), dayNum)

    const scoreEntry = scores.find((s) => {
      const sDate = new Date(s.date)
      return (
        sDate.getUTCFullYear() === d.getFullYear() &&
        sDate.getUTCMonth() === d.getMonth() &&
        sDate.getUTCDate() === d.getDate()
      )
    })

    if (scoreEntry) {
      return { date: dayNum, status: getDayStatus(scoreEntry.score), score: Math.round(scoreEntry.score) }
    }
    return { date: dayNum, status: 'neutral' as DayStatus }
  })

  const monthLabel = monthStart.toLocaleDateString('pt-BR', { month: 'long' }).toUpperCase()
  const displayMonth = monthLabel.charAt(0) + monthLabel.slice(1).toLowerCase()

  return {
    days,
    firstDayOffset,
    monthLabel: displayMonth,
    year: monthStart.getFullYear(),
  }
}
