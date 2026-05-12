export type WeekDayStatus = 'good' | 'bad' | 'neutral'

export interface WeekDay {
  day: string
  date: number
  status: WeekDayStatus
  kcal: number
  goal: number
}

export interface WeeklyReportData {
  days: WeekDay[]
  streak: number
  bestStreak: number
  weekTotalKcal: number
  weekGoalKcal: number
}

export interface MonthlyScoreData {
  days: WeekDay[]
  monthLabel: string
  year: number
  firstDayOffset: number // 0 = Segunda, 6 = Domingo
  todayDate: number
}
