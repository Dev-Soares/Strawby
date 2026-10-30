import { useState } from 'react'
import { useGetPatientDailyScores } from '../hooks/useGetPatientDailyScores'
import MonthlyCalendar from '../../daily-summary/components/MonthlyCalendar'
import {
  getMonthRange,
  getTodayDateInMonth,
  buildMonthlyScoreData,
} from '../../daily-summary/utils/buildMonthlyScoreData'

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
      <div className="animate-pulse bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-6 sm:p-8 transition-colors duration-300">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="h-9 w-9 rounded-xl bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-4 w-40 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        </div>
        <div className="grid w-full max-w-sm grid-cols-7 gap-2">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-neutral-100 dark:bg-neutral-800" />
          ))}
        </div>
      </div>
    )
  }

  if (isError || !scores) {
    return <p className="text-red-600 text-sm font-medium">Erro ao carregar pontuações</p>
  }

  const monthly = buildMonthlyScoreData(scores, monthStart, daysInMonth, firstDayOffset)

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
