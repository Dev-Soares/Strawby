import { useState } from 'react'
import { LayoutGroup, motion } from 'framer-motion'
import { useGetDailyScores } from '../hooks/useGetDailyScores'
import DailyScoreSkeleton from '../skeletons/DailyScoreSkeleton'
import DailyScoreCard from './DailyScoreCard'
import MonthlyCalendar from '../../daily-summary/components/MonthlyCalendar'
import PatientStreakCard from '../../patient/components/PatientStreakCard'
import BestStreakCard from '../../patient/components/BestStreakCard'
import {
  getMonthRange,
  getTodayDateInMonth,
  buildMonthlyScoreData,
} from '../../daily-summary/utils/buildMonthlyScoreData'

type ScoreView = 'hoje' | 'total'

const views: { value: ScoreView; label: string }[] = [
  { value: 'hoje', label: 'Hoje' },
  { value: 'total', label: 'Total' },
]

export default function DailyScoreDashboard() {
  const [activeView, setActiveView] = useState<ScoreView>('hoje')
  const [monthOffset, setMonthOffset] = useState(0)
  const { startDate, endDate, monthStart, daysInMonth, firstDayOffset } = getMonthRange(monthOffset)
  const todayDate = getTodayDateInMonth(monthStart)
  const { data: scores, isPending, isFetching, isError } = useGetDailyScores(startDate, endDate)

  if (isPending) return <DailyScoreSkeleton />
  if (isError || !scores)
    return (
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-6 transition-colors duration-300">
        <p className="text-sm font-medium text-red-600">Erro ao carregar pontuações</p>
      </div>
    )

  const monthly = buildMonthlyScoreData(scores, monthStart, daysInMonth, firstDayOffset)

  return (
    <div data-tutorial="score-dashboard">
      <LayoutGroup id="score-view">
        <div className="flex gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl w-fit mb-6 sm:mb-8 transition-colors duration-300">
          {views.map((view) => {
            const active = activeView === view.value
            return (
              <button
                key={view.value}
                type="button"
                onClick={() => setActiveView(view.value)}
                aria-pressed={active}
                className={`relative px-5 py-2 rounded-lg text-sm font-bold tracking-tight transition-colors duration-200 cursor-pointer ${
                  active
                    ? 'text-white'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-100'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="score-view-pill"
                    className="absolute inset-0 rounded-lg bg-red-600 shadow-sm"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative">{view.label}</span>
              </button>
            )
          })}
        </div>
      </LayoutGroup>

      {activeView === 'hoje' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          <DailyScoreCard />
          <PatientStreakCard />
        </div>
      ) : (
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-5 items-center transition-opacity duration-200 ${
            isFetching ? 'opacity-40 pointer-events-none' : 'opacity-100'
          }`}
        >
          {/* No mobile a sequencia vem primeiro: e o dado que resume o mes.
              No desktop volta pra direita do calendario. */}
          <div className="order-2 lg:order-1">
            <MonthlyCalendar
              data={monthly}
              todayDate={todayDate}
              onPrevMonth={() => setMonthOffset((o) => o - 1)}
              onNextMonth={() => setMonthOffset((o) => o + 1)}
            />
          </div>
          <div className="order-1 lg:order-2">
            <BestStreakCard />
          </div>
        </div>
      )}
    </div>
  )
}
