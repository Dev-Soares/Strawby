import { CheckIcon, XIcon, WarningIcon } from '@phosphor-icons/react'

export default function StatusDot({ status }: { status: 'good' | 'warn' | 'bad' | 'empty' }) {
  if (status === 'good') return (
    <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
      <CheckIcon size={8} weight="bold" className="text-white" />
    </div>
  )
  if (status === 'warn') return (
    <div className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center">
      <WarningIcon size={8} weight="bold" className="text-white" />
    </div>
  )
  if (status === 'bad') return (
    <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
      <XIcon size={8} weight="bold" className="text-white" />
    </div>
  )
  return <div className="w-1.5 h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-700 transition-colors duration-300" />
}
