import { createContext } from 'react'

export interface DayContextValue {
  selectedDay: string
  setSelectedDay: (day: string) => void
  isToday: boolean
}

export const DayContext = createContext<DayContextValue | null>(null)
