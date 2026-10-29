import { useEffect, useMemo, useRef, useState } from 'react'
import { buildMonthGrid, parseLocalISODate, toLocalISODate } from '../utils/date'

type Params = {
  /** Data selecionada em 'YYYY-MM-DD' */
  value: string
  onClose: () => void
}

/**
 * Estado do painel de calendário. Só é usado enquanto o painel está montado —
 * por isso o mês visível nasce da data selecionada, sem efeito de sincronização.
 */
export const useDatePicker = ({ value, onClose }: Params) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visibleMonth, setVisibleMonth] = useState(() => parseLocalISODate(value))

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) onClose()
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  const days = useMemo(
    () => buildMonthGrid(visibleMonth.getFullYear(), visibleMonth.getMonth()),
    [visibleMonth],
  )

  const monthLabel = useMemo(
    () =>
      visibleMonth
        .toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
        .replace(/^\w/, (char) => char.toUpperCase()),
    [visibleMonth],
  )

  const shiftMonth = (delta: number) =>
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1))

  return {
    containerRef,
    days,
    monthLabel,
    todayIso: toLocalISODate(),
    goPrevMonth: () => shiftMonth(-1),
    goNextMonth: () => shiftMonth(1),
  }
}
