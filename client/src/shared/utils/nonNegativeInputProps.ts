import type { ClipboardEvent, KeyboardEvent } from 'react'

const BLOCKED_CHARS = /[-+eE]/

/**
 * Props para <input type="number"> que representa grandeza sempre positiva
 * (peso, altura, kcal, macros, quantidade). Bloqueia sinal e notação científica
 * na digitação e na colagem — `min` sozinho não impede a digitação.
 *
 * Usar depois do spread do `register` para não ser sobrescrito.
 */
export const nonNegativeInputProps = {
  min: 0,
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key.length === 1 && BLOCKED_CHARS.test(event.key)) event.preventDefault()
  },
  onPaste: (event: ClipboardEvent<HTMLInputElement>) => {
    if (BLOCKED_CHARS.test(event.clipboardData.getData('text'))) event.preventDefault()
  },
}
