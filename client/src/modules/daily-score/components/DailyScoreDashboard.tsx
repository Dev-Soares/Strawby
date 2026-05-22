import { useGetDailyScores } from '../hooks/useGetDailyScores'
import DailyScoreSkeleton from '../skeletons/DailyScoreSkeleton'
import WeeklyReport from '../../home/components/WeeklyReport'
import WeeklyScore from '../../home/components/WeeklyScore'
import type { WeeklyReportData, WeekDayStatus } from '../../home/types/weeklyReport'
import type { DailyScore } from '../types/dailyScore'

function getDayStatus(score: number): WeekDayStatus {
  if (score >= 8) return 'good'
  if (score >= 5) return 'warn'
  return 'bad'
}

function buildWeekData(scores: DailyScore[]): WeeklyReportData {
  const now = new Date()
  const currentDay = now.getDay()
  const mondayBasedDay = currentDay === 0 ? 6 : currentDay - 1

  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - mondayBasedDay)
  startOfWeek.setHours(0, 0, 0, 0)

  const shortNames = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D']
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek)
    d.setDate(startOfWeek.getDate() + i)

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
  const { data: scores, isPending, isError } = useGetDailyScores()

  if (isPending) return <DailyScoreSkeleton />
  if (isError || !scores)
    return (
      <div className="text-red-600 text-sm font-medium">
        Erro ao carregar pontuações
      </div>
    )

  const weekly = buildWeekData(scores)

  return (
    <div className="space-y-4 sm:space-y-5">
      <WeeklyReport data={weekly} />
      <WeeklyScore score={weekly.weekScore} maxScore={weekly.weekMaxScore} />
    </div>
  )
}
