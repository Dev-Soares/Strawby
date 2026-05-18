import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft } from '@phosphor-icons/react'
import AppLayout from '../shared/layouts/AppLayout'
import CreateMealForm from '../modules/meal/components/CreateMealForm'

export default function CreateMealPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const type = searchParams.get('type') ?? 'meal'
  const isPlan = type === 'plan-meal'

  return (
    <AppLayout>
      <div className="px-4 sm:px-10 lg:px-16 pt-10 pb-32 sm:pt-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(isPlan ? '/plan' : '/home')}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 hover:bg-red-100 transition-colors duration-150 cursor-pointer shrink-0"
          >
            <ArrowLeft size={18} weight="bold" className="text-red-600" />
          </button>
          <div>
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-neutral-950 tracking-tight leading-none">
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
