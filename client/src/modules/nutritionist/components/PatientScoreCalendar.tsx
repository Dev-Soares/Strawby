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
