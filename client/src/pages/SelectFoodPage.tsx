import { ArrowLeft } from '@phosphor-icons/react'
import AppLayout from '../shared/layouts/AppLayout'
import SelectFoodSearchView from '../modules/food/components/SelectFoodSearchView'
import QuantityStep from '../modules/food/components/QuantityStep'
import { useSelectFoodPage } from '../modules/food/hooks/useSelectFoodPage'

export default function SelectFoodPage() {
  const {
    tab, setTab,
    search, setSearch,
    step, setStep,
    selectedFood,
    quantity, setQuantity,
    isPending, isError,
    currentItems,
    anyPending,
    isRecipe,
    isPlan,
    targetId,
    handleSelectItem,
    handleConfirm,
    handleBack,
  } = useSelectFoodPage()

  const contextLabel = isRecipe ? 'receita' : isPlan ? 'plano' : 'refeição'

  return (
    <AppLayout>
      <div className="px-4 sm:px-10 lg:px-16 pt-10 pb-8 sm:py-12 max-w-5xl mx-auto">
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 mb-4 text-sm font-bold text-neutral-500 dark:text-neutral-400 hover:text-red-600 transition-colors duration-150 cursor-pointer"
          >
            <ArrowLeft size={18} weight="bold" />
            Voltar
          </button>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-neutral-950 dark:text-neutral-100 tracking-tight leading-none transition-colors duration-300">
            {step === 'search' ? 'Buscar alimento' : 'Ajustar quantidade'}
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 transition-colors duration-300">
            {step === 'search'
              ? `Escolha um alimento para adicionar à ${contextLabel}`
              : 'Defina a quantidade em gramas'}
          </p>
        </div>

        {step === 'search' ? (
          <SelectFoodSearchView
            tab={tab}
            onTabChange={setTab}
            includeRecipes={!isRecipe}
            search={search}
            onSearchChange={setSearch}
            isPending={isPending}
            isError={isError}
            items={currentItems}
            onSelect={handleSelectItem}
            anyPending={anyPending}
          />
        ) : (
          <QuantityStep
            selectedFood={selectedFood}
            quantity={quantity}
            targetId={targetId}
            contextLabel={contextLabel}
            anyPending={anyPending}
            onQuantityChange={setQuantity}
            onBack={() => setStep('search')}
            onConfirm={handleConfirm}
          />
        )}
      </div>
    </AppLayout>
  )
}
