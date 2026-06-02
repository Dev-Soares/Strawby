import { useState } from 'react'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import { useGetDailyScores } from '../hooks/useGetDailyScores'
import DailyScoreSkeleton from '../skeletons/DailyScoreSkeleton'
import DailyScoreCard from './DailyScoreCard'
import TotalScoreCard from './TotalScoreCard'
import WeeklyReport from '../../home/components/WeeklyReport'
import PatientStreakCard from '../../patient/components/PatientStreakCard'
import type { WeeklyReportData, WeekDayStatus } from '../../home/types/weeklyReport'
import type { DailyScore } from '../types/dailyScore'

function getDayStatus(score: number): WeekDayStatus {
  if (score >= 8) return 'good'
  if (score >= 5) return 'warn'
  return 'bad'
}

function getWeekRange(offset: number = 0): { startDate: string; endDate: string; weekStart: Date } {
  const now = new Date()
  const currentDay = now.getDay()
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay

  const start = new Date(now)
  start.setDate(now.getDate() + mondayOffset + offset * 7)
  start.setHours(0, 0, 0, 0)

  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  end.setHours(0, 0, 0, 0)

  const fmt = (d: Date) => d.toISOString().split('T')[0]
  return { startDate: fmt(start), endDate: fmt(end), weekStart: start }
}

function getTodayIndex(weekStart: Date): number {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const start = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate())

  const diffDays = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays >= 0 && diffDays < 7) return diffDays
  return -1
}

function buildWeekData(scores: DailyScore[], weekStart: Date): WeeklyReportData {
  const shortNames = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D']
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(weekStart.getDate() + i)

    const scoreEntry = scores.find((s) => {
      const sDate = new Date(s.date)
      return (
        sDate.getFullYear() === d.getFullYear() &&
        sDate.getMonth() === d.getMonth() &&
        sDate.getDate() === d.getDate()
      )
    })

    if (scoreEntry) {
      return {
        day: shortNames[i],
        date: d.getDate(),
        status: getDayStatus(scoreEntry.score),
        kcal: 0,
        goal: 0,
        score: Math.round(scoreEntry.score),
      }
    }

    return {
      day: shortNames[i],
      date: d.getDate(),
      status: 'neutral' as WeekDayStatus,
      kcal: 0,
      goal: 0,
    }
  })

  const weekScore = days.reduce((sum, d) => sum + (d.score ?? 0), 0)

  return {
    days,
    weekScore,
    weekMaxScore: 70,
    level: Math.floor(weekScore / 10),
    weekTotalKcal: 0,
    weekGoalKcal: 0,
  }
}

type ScoreView = 'hoje' | 'total'

export default function DailyScoreDashboard() {
  const [activeView, setActiveView] = useState<ScoreView>('hoje')
  const [weekOffset, setWeekOffset] = useState(0)
  const { startDate, endDate, weekStart } = getWeekRange(weekOffset)
  const todayIndex = getTodayIndex(weekStart)
  const { data: scores, isPending, isFetching, isError } = useGetDailyScores(startDate, endDate)

  if (isPending) return <DailyScoreSkeleton />
  if (isError || !scores)
    return (
      <div className="text-red-600 text-sm font-medium">
        Erro ao carregar pontuações
      </div>
    )

  const weekly = buildWeekData(scores, weekStart)

  return (
    <div data-tutorial="score-dashboard" className="space-y-4 sm:space-y-5">
      <div className="flex gap-1 p-1 bg-neutral-100 dark:bg-neutral-800/60 rounded-xl w-fit transition-colors duration-300">
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
        <>
          <PatientStreakCard />
          <DailyScoreCard />
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setWeekOffset((o) => o - 1)}
              className="flex items-center gap-1 text-sm font-bold text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-100 transition-colors duration-300"
            >
              <CaretLeft size={18} weight="bold" />
              Anterior
            </button>
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 transition-colors duration-300">
              {`${startDate.slice(8)}/${startDate.slice(5, 7)} — ${endDate.slice(8)}/${endDate.slice(5, 7)}`}
            </span>
            <button
              type="button"
              onClick={() => setWeekOffset((o) => o + 1)}
              className="flex items-center gap-1 text-sm font-bold text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-100 transition-colors duration-300"
            >
              Próxima
              <CaretRight size={18} weight="bold" />
            </button>
          </div>

          <div className={`transition-opacity duration-200 ${isFetching ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
            <WeeklyReport data={weekly} todayIndex={todayIndex} weekStartDate={weekStart} />
          </div>
          <TotalScoreCard />
        </>
      )}
    </div>
  )
}
