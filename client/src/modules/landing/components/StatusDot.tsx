import { Check, TriangleAlert, X } from 'lucide-react'
export default function StatusDot({ status }: { status: 'good' | 'warn' | 'bad' | 'empty' }) {
  if (status === 'good') return (
    <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
      <Check size={8} className="text-white" />
    </div>
  )
  if (status === 'warn') return (
    <div className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center">
      <TriangleAlert size={8} className="text-white" />
    </div>
  )
  if (status === 'bad') return (
    <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
      <X size={8} className="text-white" />
    </div>
  )
  return <div className="w-1.5 h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-700 transition-colors duration-300" />
}
