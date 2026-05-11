export type WeekDayStatus = 'good' | 'warn' | 'bad' | 'neutral'

export interface WeekDay {
  day: string
  date: number
  status: WeekDayStatus
  kcal: number
  goal: number
  score?: number
}

export interface WeeklyReportData {
  days: WeekDay[]
  weekScore: number
  weekMaxScore: number
  level: number
  weekTotalKcal: number
  weekGoalKcal: number
}

export interface MonthlyScoreData {
  days: WeekDay[]
  monthLabel: string
  year: number
  firstDayOffset: number
  todayDate: number
}
