import { useState } from 'react'
import { useGetDailyScores } from '../hooks/useGetDailyScores'
import DailyScoreSkeleton from '../skeletons/DailyScoreSkeleton'
import DailyScoreCard from './DailyScoreCard'
import TotalScoreCard from './TotalScoreCard'
import MonthlyCalendar from '../../daily-summary/components/MonthlyCalendar'
import PatientStreakCard from '../../patient/components/PatientStreakCard'
import BestStreakCard from '../../patient/components/BestStreakCard'
import {
  getMonthRange,
  getTodayDateInMonth,
  buildMonthlyScoreData,
} from '../../daily-summary/utils/buildMonthlyScoreData'

type ScoreView = 'hoje' | 'total'

export default function DailyScoreDashboard() {
  const [activeView, setActiveView] = useState<ScoreView>('hoje')
  const [monthOffset, setMonthOffset] = useState(0)
  const { startDate, endDate, monthStart, daysInMonth, firstDayOffset } = getMonthRange(monthOffset)
  const todayDate = getTodayDateInMonth(monthStart)
  const { data: scores, isPending, isFetching, isError } = useGetDailyScores(startDate, endDate)

  if (isPending) return <DailyScoreSkeleton />
  if (isError || !scores)
    return (
      <div className="text-red-600 text-sm font-medium">
        Erro ao carregar pontuações
      </div>
    )

  const monthly = buildMonthlyScoreData(scores, monthStart, daysInMonth, firstDayOffset)

  return (
    <div data-tutorial="score-dashboard">
      <div className="flex gap-1 p-1 bg-neutral-100 dark:bg-neutral-800/60 rounded-xl w-fit mb-8 sm:mb-10 transition-colors duration-300">
        <button
          type="button"
          onClick={() => setActiveView('hoje')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
            activeView === 'hoje'
              ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-sm'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
          }`}
        >
          Hoje
        </button>
        <button
          type="button"
          onClick={() => setActiveView('total')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
            activeView === 'total'
              ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-sm'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
          }`}
        >
          Total
        </button>
      </div>

      {activeView === 'hoje' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-0 items-start">
          <div className="lg:pr-16 lg:border-r border-neutral-100 dark:border-neutral-800">
            <PatientStreakCard />
          </div>
          <div className="lg:pl-16">
            <DailyScoreCard />
            <hr className="border-neutral-100 dark:border-neutral-800 my-8 transition-colors duration-300" />
            <BestStreakCard />
          </div>
        </div>
      ) : (
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-0 items-start transition-opacity duration-200 ${
            isFetching ? 'opacity-40 pointer-events-none' : 'opacity-100'
          }`}
        >
          <div className="lg:pr-16 lg:border-r border-neutral-100 dark:border-neutral-800">
            <MonthlyCalendar
              data={monthly}
              todayDate={todayDate}
              onPrevMonth={() => setMonthOffset((o) => o - 1)}
              onNextMonth={() => setMonthOffset((o) => o + 1)}
            />
          </div>
          <div className="lg:pl-16">
            <TotalScoreCard />
          </div>
        </div>
      )}
    </div>
  )
}
