export type DayStatus = 'good' | 'bad' | 'neutral'

export interface CalendarDay {
  date: number
  status: DayStatus
  score?: number
}

export interface MonthlyScoreData {
  days: CalendarDay[]
  firstDayOffset: number
  monthLabel: string
  year: number
}
