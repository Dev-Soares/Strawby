import { useState } from 'react'
import { useGetPatientDailyScores } from '../hooks/useGetPatientDailyScores'
import MonthlyCalendar from '../../daily-summary/components/MonthlyCalendar'
import type { MonthlyScoreData, DayStatus } from '../../daily-summary/types/monthlyScore'
import type { DailyScore } from '../../daily-score/types/dailyScore'

function getDayStatus(score: number): DayStatus {
  return score >= 8 ? 'good' : 'bad'
}

function getMonthRange(offset = 0) {
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

function getTodayDateInMonth(monthStart: Date): number | null {
  const now = new Date()
  if (now.getFullYear() === monthStart.getFullYear() && now.getMonth() === monthStart.getMonth()) {
    return now.getDate()
  }
  return null
}

function buildMonthData(
  scores: DailyScore[],
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

interface Props {
  patientId: string
}

export default function PatientScoreCalendar({ patientId }: Props) {
  const [monthOffset, setMonthOffset] = useState(0)
  const { startDate, endDate, monthStart, daysInMonth, firstDayOffset } = getMonthRange(monthOffset)
  const todayDate = getTodayDateInMonth(monthStart)
  const { data: scores, isPending, isFetching, isError } = useGetPatientDailyScores(patientId, startDate, endDate)

  if (isPending) {
    return (
      <div className="animate-pulse flex flex-col gap-3">
        <div className="h-6 w-40 rounded bg-neutral-100 dark:bg-neutral-800" />
        <div className="grid grid-cols-7 gap-2 sm:gap-3">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-neutral-100 dark:bg-neutral-800" />
          ))}
        </div>
      </div>
    )
  }

  if (isError || !scores) {
    return <p className="text-red-600 text-sm font-medium">Erro ao carregar pontuações</p>
  }

  const monthly = buildMonthData(scores, monthStart, daysInMonth, firstDayOffset)

  return (
    <div className={`transition-opacity duration-200 ${isFetching ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
      <MonthlyCalendar
        data={monthly}
        todayDate={todayDate}
        onPrevMonth={() => setMonthOffset((o) => o - 1)}
        onNextMonth={() => setMonthOffset((o) => o + 1)}
      />
    </div>
  )
}
