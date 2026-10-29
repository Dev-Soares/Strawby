import { AnimatePresence } from 'framer-motion'
import DatePickerPanel from './DatePickerPanel'

interface DatePickerPopoverProps {
  isOpen: boolean
  /** Data selecionada em 'YYYY-MM-DD' */
  value: string
  onChange: (iso: string) => void
  onClose: () => void
  /** Alinhamento horizontal em relação ao gatilho */
  align?: 'left' | 'center'
}

/**
 * Calendário do app — substitui o picker nativo do navegador.
 * O container pai precisa ser `relative`.
 */
export default function DatePickerPopover({
  isOpen,
  value,
  onChange,
  onClose,
  align = 'center',
}: DatePickerPopoverProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <DatePickerPanel value={value} onChange={onChange} onClose={onClose} align={align} />
      )}
    </AnimatePresence>
  )
}
