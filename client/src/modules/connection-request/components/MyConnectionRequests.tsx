import { useState } from 'react'
import { ClockCounterClockwise } from '@phosphor-icons/react'
import { useGetMyConnectionRequests } from '../hooks/useGetMyConnectionRequests'
import MyConnectionRequestsModal from './MyConnectionRequestsModal'

export default function MyConnectionRequests() {
  const { data: requests } = useGetMyConnectionRequests()
  const [open, setOpen] = useState(false)

  if (!requests || requests.length === 0) return null

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-sm font-bold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors duration-150 cursor-pointer"
      >
        <ClockCounterClockwise size={16} weight="bold" />
        Ver solicitações enviadas
      </button>

      <MyConnectionRequestsModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  )
}
