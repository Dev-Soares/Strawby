import { useContext } from 'react'
import { DayContext } from '../contexts/day-context'

export function useDay() {
  const ctx = useContext(DayContext)
  if (!ctx) throw new Error('useDay must be used within DayProvider')
  return ctx
}
