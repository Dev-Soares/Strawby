import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Brain } from 'lucide-react'
import AssistantDrawer from './AssistantDrawer'

const baseClass =
  'items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors duration-200 cursor-pointer shrink-0'

export default function AssistantLauncher() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Link to="/app/assistant" className={`${baseClass} flex sm:hidden`}>
        <Brain size={18} />
        <span>Assistente Strawby</span>
      </Link>

      <button type="button" onClick={() => setIsOpen(true)} className={`${baseClass} hidden sm:flex`}>
        <Brain size={18} />
        <span>Assistente Strawby</span>
      </button>

      <div className="hidden sm:block">
        <AssistantDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    </>
  )
}
