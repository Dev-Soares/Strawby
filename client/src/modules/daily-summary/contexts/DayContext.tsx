import { useState, useMemo, useCallback } from 'react'
import { toLocalISODate } from '@/shared/utils/date'
import { DayContext } from './day-context'

function getTodayIso() {
  return toLocalISODate()
}

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
