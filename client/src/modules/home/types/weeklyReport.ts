export type WeekDayStatus = 'good' | 'warn' | 'bad' | 'neutral'

export type WeekDay = {
  day: string
  date: number
  status: WeekDayStatus
  kcal: number
  goal: number
  score?: number
}

export type WeeklyReportData = {
  days: WeekDay[]
  weekScore: number
  weekMaxScore: number
  level: number
  weekTotalKcal: number
  weekGoalKcal: number
}
