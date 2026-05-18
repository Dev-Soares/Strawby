import { createContext, useContext, useState, useMemo, useCallback } from 'react'
import { toLocalISODate } from '@/shared/utils/date'

function getTodayIso() {
  return toLocalISODate()
}

interface DayContextValue {
  selectedDay: string
  setSelectedDay: (day: string) => void
  isToday: boolean
}

const DayContext = createContext<DayContextValue | null>(null)

export function DayProvider({ children }: { children: React.ReactNode }) {
  const [selectedDay, setSelectedDay] = useState(() => getTodayIso())

  const isToday = useMemo(() => selectedDay === getTodayIso(), [selectedDay])

  const handleChange = useCallback((day: string) => {
    setSelectedDay(day)
  }, [])

  const value = useMemo(
    () => ({ selectedDay, setSelectedDay: handleChange, isToday }),
    [selectedDay, handleChange, isToday],
  )

  return <DayContext.Provider value={value}>{children}</DayContext.Provider>
}

export function useDay() {
  const ctx = useContext(DayContext)
  if (!ctx) throw new Error('useDay must be used within DayProvider')
  return ctx
}
