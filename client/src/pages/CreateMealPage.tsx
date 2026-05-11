import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from '@phosphor-icons/react'
import AppLayout from '../shared/layouts/AppLayout'
import CreateMealForm from '../modules/meal/components/CreateMealForm'

export default function CreateMealPage() {
  const navigate = useNavigate()

  return (
    <AppLayout>
      <div className="px-10 sm:px-16 py-12 pb-32">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/plan')}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 hover:bg-red-100 transition-colors duration-150 cursor-pointer shrink-0"
          >
            <ArrowLeft size={18} weight="bold" className="text-red-600" />
          </button>
          <div>
            <h1 className="font-display text-4xl sm:text-5xl font-black text-neutral-950 tracking-tight leading-none">
              Nova Refeição
            </h1>
            <p className="text-sm text-neutral-500 mt-2">Adicione uma refeição ao seu plano</p>
          </div>
        </div>

        <CreateMealForm />
      </div>
    </AppLayout>
  )
}
