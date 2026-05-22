import { useState } from 'react'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import { useGetDailyScores } from '../hooks/useGetDailyScores'
import DailyScoreSkeleton from '../skeletons/DailyScoreSkeleton'
import DailyScoreCard from './DailyScoreCard'
import WeeklyReport from '../../home/components/WeeklyReport'
import WeeklyScore from '../../home/components/WeeklyScore'
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

export default function DailyScoreDashboard() {
  const [weekOffset, setWeekOffset] = useState(0)
  const { startDate, endDate, weekStart } = getWeekRange(weekOffset)
  const todayIndex = getTodayIndex(weekStart)
  const { data: scores, isPending, isError } = useGetDailyScores(startDate, endDate)

  if (isPending) return <DailyScoreSkeleton />
  if (isError || !scores)
    return (
      <div className="text-red-600 text-sm font-medium">
        Erro ao carregar pontuações
      </div>
    )

  const weekly = buildWeekData(scores, weekStart)

  return (
    <div className="space-y-4 sm:space-y-5">
      <DailyScoreCard />

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setWeekOffset((o) => o - 1)}
          className="flex items-center gap-1 text-sm font-bold text-neutral-500 hover:text-neutral-950 transition-colors"
        >
          <CaretLeft size={18} weight="bold" />
          Anterior
        </button>
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
          {weekOffset === 0
            ? 'Semana atual'
            : weekOffset === -1
              ? 'Semana passada'
              : weekOffset === 1
                ? 'Próxima semana'
                : `Semana ${weekOffset > 0 ? '+' : ''}${weekOffset}`}
        </span>
        <button
          type="button"
          onClick={() => setWeekOffset((o) => o + 1)}
          className="flex items-center gap-1 text-sm font-bold text-neutral-500 hover:text-neutral-950 transition-colors"
        >
          Próxima
          <CaretRight size={18} weight="bold" />
        </button>
      </div>

      <WeeklyReport data={weekly} todayIndex={todayIndex} weekStartDate={weekStart} />
      <WeeklyScore score={weekly.weekScore} maxScore={weekly.weekMaxScore} />
    </div>
  )
}
